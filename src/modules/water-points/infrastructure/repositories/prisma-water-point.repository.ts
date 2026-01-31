import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WaterPointRepository } from '../../domain/repositories/water-point.repository';
import { CreateWaterPointDto } from '../../presentation/dto/create-water-point.dto';
import { UpdateWaterPointDto } from '../../presentation/dto/update-water-point.dto';
import { WaterPointResponseDto } from '../../presentation/dto/water-point-response.dto';

@Injectable()
export class PrismaWaterPointRepository implements WaterPointRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    farmId: string,
    dto: CreateWaterPointDto,
  ): Promise<WaterPointResponseDto> {
    const geoJsonString = JSON.stringify(dto.geometry);

    const result = await this.prisma.$queryRaw<any[]>`
      INSERT INTO "water_points" (id, farm_id, name, type, location, is_active, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${farmId}::uuid,
        ${dto.name || null},
        ${dto.type || null},
        ST_SetSRID(ST_GeomFromGeoJSON(${geoJsonString}), 4326),
        true,
        NOW(),
        NOW()
      )
      RETURNING
        id::text,
        name,
        type,
        farm_id::text AS "farmId",
        is_active AS "isActive",
        ST_AsGeoJSON(location)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return this.mapToDto(result[0]);
  }

  async findAllByFarmId(farmId: string): Promise<WaterPointResponseDto[]> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        id::text,
        name,
        type,
        farm_id::text AS "farmId",
        is_active AS "isActive",
        ST_AsGeoJSON(location)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM "water_points"
      WHERE farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    return result.map((row) => this.mapToDto(row));
  }

  async findById(
    id: string,
    farmId: string,
  ): Promise<WaterPointResponseDto | null> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        id::text,
        name,
        type,
        farm_id::text AS "farmId",
        is_active AS "isActive",
        ST_AsGeoJSON(location)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM "water_points"
      WHERE id = ${id}::uuid
        AND farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
    `;

    if (result.length === 0) {
      return null;
    }

    return this.mapToDto(result[0]);
  }

  async update(
    id: string,
    farmId: string,
    dto: UpdateWaterPointDto,
  ): Promise<WaterPointResponseDto> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Water point not found');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(dto.name);
    }

    if (dto.type !== undefined) {
      updates.push(`type = $${values.length + 1}`);
      values.push(dto.type);
    }

    if (dto.geometry) {
      const geoJsonString = JSON.stringify(dto.geometry);
      updates.push(
        `location = ST_SetSRID(ST_GeomFromGeoJSON($${values.length + 1}), 4326)`,
      );
      values.push(geoJsonString);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push('updated_at = NOW()');

    // Add id and farmId to values array for WHERE clause
    const idParamIndex = values.length + 1;
    const farmIdParamIndex = values.length + 2;
    values.push(id, farmId);

    const query = `
      UPDATE "water_points"
      SET ${updates.join(', ')}
      WHERE id = $${idParamIndex}::uuid
        AND farm_id = $${farmIdParamIndex}::uuid
        AND deleted_at IS NULL
      RETURNING
        id::text,
        name,
        type,
        farm_id::text AS "farmId",
        is_active AS "isActive",
        ST_AsGeoJSON(location)::json as geometry,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await this.prisma.$queryRawUnsafe<any[]>(query, ...values);

    if (result.length === 0) {
      throw new NotFoundException('Water point not found');
    }

    return this.mapToDto(result[0]);
  }

  async delete(id: string, farmId: string): Promise<void> {
    const result = await this.prisma.$queryRaw<any[]>`
      UPDATE "water_points"
      SET deleted_at = NOW()
      WHERE id = ${id}::uuid
        AND farm_id = ${farmId}::uuid
        AND deleted_at IS NULL
      RETURNING id
    `;

    if (result.length === 0) {
      throw new NotFoundException('Water point not found');
    }
  }

  private mapToDto(row: any): WaterPointResponseDto {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      farmId: row.farmId,
      geometry: row.geometry,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
