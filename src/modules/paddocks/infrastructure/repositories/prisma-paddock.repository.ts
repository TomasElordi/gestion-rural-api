import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaddockRepository } from '../../domain/repositories/paddock.repository';
import { CreatePaddockDto } from '../../presentation/dto/create-paddock.dto';
import { UpdatePaddockDto } from '../../presentation/dto/update-paddock.dto';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';

@Injectable()
export class PrismaPaddockRepository extends PaddockRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    farmId: string,
    dto: CreatePaddockDto,
  ): Promise<PaddockResponseDto> {
    // Validar que el anillo esté cerrado
    const coords = dto.geometry.coordinates[0];
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      throw new BadRequestException('Polygon ring must be closed');
    }

    const geoJsonString = JSON.stringify(dto.geometry);

    // Crear paddock + calcular área con PostGIS
    const result = await this.prisma.$queryRaw<any[]>`
      INSERT INTO "paddocks" (id, farm_id, name, description, polygon, area_ha, is_active, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${farmId}::uuid,
        ${dto.name},
        ${dto.description || null},
        ST_SetSRID(ST_GeomFromGeoJSON(${geoJsonString}), 4326),
        ST_Area(ST_SetSRID(ST_GeomFromGeoJSON(${geoJsonString}), 4326)::geography) / 10000.0,
        true,
        NOW(),
        NOW()
      )
      RETURNING
        id::text,
        name,
        description,
        farm_id::text AS "farmId",
        area_ha AS "areaHa",
        is_active AS "isActive",
        ST_AsGeoJSON(polygon)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return this.mapToDto(result[0]);
  }

  async findAllByFarmId(farmId: string): Promise<PaddockResponseDto[]> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        id::text,
        name,
        description,
        farm_id::text AS "farmId",
        area_ha AS "areaHa",
        is_active AS "isActive",
        ST_AsGeoJSON(polygon)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM "paddocks"
      WHERE farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    return result.map(this.mapToDto);
  }

  async findById(
    id: string,
    farmId: string,
  ): Promise<PaddockResponseDto | null> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        id::text,
        name,
        description,
        farm_id::text AS "farmId",
        area_ha AS "areaHa",
        is_active AS "isActive",
        ST_AsGeoJSON(polygon)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM "paddocks"
      WHERE id = ${id}::uuid
        AND farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
    `;

    return result.length > 0 ? this.mapToDto(result[0]) : null;
  }

  async update(
    id: string,
    farmId: string,
    dto: UpdatePaddockDto,
  ): Promise<PaddockResponseDto> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Paddock not found');
    }

    // Si se actualiza geometría, recalcular área
    if (dto.geometry) {
      const coords = dto.geometry.coordinates[0];
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        throw new BadRequestException('Polygon ring must be closed');
      }

      const geoJsonString = JSON.stringify(dto.geometry);

      const result = await this.prisma.$queryRaw<any[]>`
        UPDATE "paddocks"
        SET
          name = COALESCE(${dto.name}, name),
          description = COALESCE(${dto.description}, description),
          polygon = ST_SetSRID(ST_GeomFromGeoJSON(${geoJsonString}), 4326),
          area_ha = ST_Area(ST_SetSRID(ST_GeomFromGeoJSON(${geoJsonString}), 4326)::geography) / 10000.0,
          updated_at = NOW()
        WHERE id = ${id}::uuid
          AND farm_id = ${farmId}::uuid
          AND deleted_at IS NULL
        RETURNING
          id::text,
          name,
          description,
          farm_id::text AS "farmId",
          area_ha AS "areaHa",
          is_active AS "isActive",
          ST_AsGeoJSON(polygon)::json as geometry,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `;

      return this.mapToDto(result[0]);
    } else {
      // Solo actualizar campos simples
      const result = await this.prisma.$queryRaw<any[]>`
        UPDATE "paddocks"
        SET
          name = COALESCE(${dto.name}, name),
          description = COALESCE(${dto.description}, description),
          updated_at = NOW()
        WHERE id = ${id}::uuid
          AND farm_id = ${farmId}::uuid
          AND deleted_at IS NULL
        RETURNING
          id::text,
          name,
          description,
          farm_id::text AS "farmId",
          area_ha AS "areaHa",
          is_active AS "isActive",
          ST_AsGeoJSON(polygon)::json as geometry,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `;

      return this.mapToDto(result[0]);
    }
  }

  async delete(id: string, farmId: string): Promise<void> {
    const result = await this.prisma.$executeRaw`
      UPDATE "paddocks"
      SET deleted_at = NOW()
      WHERE id = ${id}::uuid
        AND farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
    `;

    if (result === 0) {
      throw new NotFoundException('Paddock not found');
    }
  }

  private mapToDto(row: any): PaddockResponseDto {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      farmId: row.farmId,
      areaHa: parseFloat(row.areaHa),
      geometry: row.geometry,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
