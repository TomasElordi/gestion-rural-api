import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HerdGroupRepository } from '../../domain/repositories/herd-group.repository';
import { CreateHerdGroupDto } from '../../presentation/dto/create-herd-group.dto';
import { UpdateHerdGroupDto } from '../../presentation/dto/update-herd-group.dto';
import { HerdGroupResponseDto } from '../../presentation/dto/herd-group-response.dto';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaHerdGroupRepository extends HerdGroupRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    farmId: string,
    dto: CreateHerdGroupDto,
    ugm: number,
  ): Promise<HerdGroupResponseDto> {
    const herdGroup = await this.prisma.herdGroup.create({
      data: {
        farmId,
        name: dto.name,
        category: dto.category,
        liveWeightKg: new Decimal(dto.liveWeightKg),
        ugm: new Decimal(ugm),
        headCount: dto.headCount,
        notes: dto.notes,
      },
    });

    return HerdGroupResponseDto.fromPrisma(herdGroup);
  }

  async findAllByFarmId(farmId: string): Promise<HerdGroupResponseDto[]> {
    const herdGroups = await this.prisma.herdGroup.findMany({
      where: {
        farmId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return herdGroups.map(HerdGroupResponseDto.fromPrisma);
  }

  async findById(
    id: string,
    farmId: string,
  ): Promise<HerdGroupResponseDto | null> {
    const herdGroup = await this.prisma.herdGroup.findFirst({
      where: {
        id,
        farmId,
        deletedAt: null,
      },
    });

    return herdGroup ? HerdGroupResponseDto.fromPrisma(herdGroup) : null;
  }

  async update(
    id: string,
    farmId: string,
    dto: UpdateHerdGroupDto,
    ugm?: number,
  ): Promise<HerdGroupResponseDto> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Herd group not found');
    }

    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.liveWeightKg !== undefined) {
      updateData.liveWeightKg = new Decimal(dto.liveWeightKg);
      // If liveWeightKg is updated, ugm must be recalculated
      if (ugm !== undefined) {
        updateData.ugm = new Decimal(ugm);
      }
    }
    if (dto.headCount !== undefined) updateData.headCount = dto.headCount;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    const herdGroup = await this.prisma.herdGroup.update({
      where: { id },
      data: updateData,
    });

    return HerdGroupResponseDto.fromPrisma(herdGroup);
  }

  async delete(id: string, farmId: string): Promise<void> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Herd group not found');
    }

    await this.prisma.herdGroup.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
