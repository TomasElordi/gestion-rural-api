import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PrismaFarmsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    organizationId: string;
    name: string;
    center?: { lng: number; lat: number };
  }) {
    const { organizationId, name, center } = params;

    if (!center) {
      return this.prisma.farm.create({
        data: { organizationId, name },
        select: { id: true, name: true, organizationId: true, createdAt: true },
      });
    }

    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
      }>
    >`
      INSERT INTO farms (id, organization_id, name, center, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${organizationId}::uuid,
        ${name},
        ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326),
        NOW(),
        NOW()
      )
      RETURNING id, name, organization_id, created_at, updated_at;
    `;

    return {
      id: rows[0].id,
      name: rows[0].name,
      organizationId: rows[0].organization_id,
      createdAt: rows[0].created_at,
    };
  }

  listByOrganization(organizationId: string) {
    return this.prisma.farm.findMany({
      where: { organizationId, deletedAt: null },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  getById(id: string) {
    return this.prisma.farm.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
