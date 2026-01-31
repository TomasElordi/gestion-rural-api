import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { UpdateGrazingEventDto } from '../../presentation/dto/update-grazing-event.dto';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';
import { GrazingEventRulesService } from '../services/grazing-event-rules.service';
import { GrazingEventStatus } from '../../presentation/dto/update-grazing-event.dto';

@Injectable()
export class UpdateGrazingEventUseCase {
  constructor(
    private grazingEventRepository: GrazingEventRepository,
    private prisma: PrismaService,
    private rulesService: GrazingEventRulesService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
    dto: UpdateGrazingEventDto,
  ): Promise<GrazingEventResponseDto> {
    // 1. Validate that the farm exists and belongs to the user's organization
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: farmId,
        organizationId,
        deletedAt: null,
      },
    });

    if (!farm) {
      throw new NotFoundException('Farm not found or access denied');
    }

    // 2. Get current grazing event
    const currentEvent = await this.grazingEventRepository.findById(id, farmId);
    if (!currentEvent) {
      throw new NotFoundException('Grazing event not found');
    }

    // 3. Validate date consistency if dates are being updated
    const newStartAt = dto.startAt ? new Date(dto.startAt) : currentEvent.startAt;
    const newEndAt = dto.endAt ? new Date(dto.endAt) : currentEvent.endAt;

    if (newEndAt) {
      this.rulesService.validateDateConsistency(newStartAt, newEndAt);
    }

    // 4. If changing status to active, validate resource availability
    const newStatus = dto.status || (currentEvent.status as GrazingEventStatus);

    if (
      newStatus === GrazingEventStatus.ACTIVE &&
      currentEvent.status !== GrazingEventStatus.ACTIVE
    ) {
      await this.rulesService.validateActivation(
        id,
        currentEvent.herdGroupId,
        currentEvent.paddockId,
      );
    }

    // 5. Update the grazing event
    return this.grazingEventRepository.update(id, farmId, dto);
  }
}
