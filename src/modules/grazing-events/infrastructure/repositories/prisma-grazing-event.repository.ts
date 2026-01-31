import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/client';
import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { CreateGrazingEventDto } from '../../presentation/dto/create-grazing-event.dto';
import { UpdateGrazingEventDto } from '../../presentation/dto/update-grazing-event.dto';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';
import { QueryGrazingEventsDto } from '../../presentation/dto/query-grazing-events.dto';

@Injectable()
export class PrismaGrazingEventRepository extends GrazingEventRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    farmId: string,
    dto: CreateGrazingEventDto,
    status: string,
    ugmSnapshot: number | null,
  ): Promise<GrazingEventResponseDto> {
    const grazingEvent = await this.prisma.grazingEvent.create({
      data: {
        farmId,
        herdGroupId: dto.herdGroupId,
        paddockId: dto.paddockId,
        startAt: new Date(dto.startAt),
        endAt: dto.endAt ? new Date(dto.endAt) : null,
        status: status as any,
        ugmSnapshot: ugmSnapshot ? new Decimal(ugmSnapshot) : null,
        notes: dto.notes,
      },
    });

    return GrazingEventResponseDto.fromPrisma(grazingEvent);
  }

  async findAllByFarmId(
    farmId: string,
    query: QueryGrazingEventsDto,
  ): Promise<GrazingEventResponseDto[]> {
    const where: any = {
      farmId,
      deletedAt: null,
    };

    if (query.from || query.to) {
      where.startAt = {};
      if (query.from) {
        where.startAt.gte = new Date(query.from);
      }
      if (query.to) {
        where.startAt.lte = new Date(query.to);
      }
    }

    if (query.status) {
      where.status = query.status;
    }

    const grazingEvents = await this.prisma.grazingEvent.findMany({
      where,
      orderBy: {
        startAt: 'desc',
      },
    });

    return grazingEvents.map(GrazingEventResponseDto.fromPrisma);
  }

  async findById(
    id: string,
    farmId: string,
  ): Promise<GrazingEventResponseDto | null> {
    const grazingEvent = await this.prisma.grazingEvent.findFirst({
      where: {
        id,
        farmId,
        deletedAt: null,
      },
    });

    return grazingEvent ? GrazingEventResponseDto.fromPrisma(grazingEvent) : null;
  }

  async update(
    id: string,
    farmId: string,
    dto: UpdateGrazingEventDto,
  ): Promise<GrazingEventResponseDto> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Grazing event not found');
    }

    const updateData: any = {};

    if (dto.startAt !== undefined) {
      updateData.startAt = new Date(dto.startAt);
    }
    if (dto.endAt !== undefined) {
      updateData.endAt = new Date(dto.endAt);
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }
    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    const grazingEvent = await this.prisma.grazingEvent.update({
      where: { id },
      data: updateData,
    });

    return GrazingEventResponseDto.fromPrisma(grazingEvent);
  }

  async delete(id: string, farmId: string): Promise<void> {
    const existing = await this.findById(id, farmId);
    if (!existing) {
      throw new NotFoundException('Grazing event not found');
    }

    await this.prisma.grazingEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findActiveByHerdGroupId(
    herdGroupId: string,
    excludeEventId?: string,
  ): Promise<GrazingEventResponseDto[]> {
    const where: any = {
      herdGroupId,
      status: 'active',
      deletedAt: null,
    };

    if (excludeEventId) {
      where.id = { not: excludeEventId };
    }

    const grazingEvents = await this.prisma.grazingEvent.findMany({
      where,
    });

    return grazingEvents.map(GrazingEventResponseDto.fromPrisma);
  }

  async findActiveByPaddockId(
    paddockId: string,
    excludeEventId?: string,
  ): Promise<GrazingEventResponseDto[]> {
    const where: any = {
      paddockId,
      status: 'active',
      deletedAt: null,
    };

    if (excludeEventId) {
      where.id = { not: excludeEventId };
    }

    const grazingEvents = await this.prisma.grazingEvent.findMany({
      where,
    });

    return grazingEvents.map(GrazingEventResponseDto.fromPrisma);
  }
}
