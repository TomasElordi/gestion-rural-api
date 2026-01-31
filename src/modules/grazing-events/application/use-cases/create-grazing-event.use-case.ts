import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { CreateGrazingEventDto } from '../../presentation/dto/create-grazing-event.dto';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';
import { GrazingEventRulesService } from '../services/grazing-event-rules.service';
import { GrazingEventStatus } from '../../presentation/dto/update-grazing-event.dto';

@Injectable()
export class CreateGrazingEventUseCase {
  constructor(
    private grazingEventRepository: GrazingEventRepository,
    private prisma: PrismaService,
    private rulesService: GrazingEventRulesService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
    dto: CreateGrazingEventDto,
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

    // 2. Validate that paddock exists and belongs to the farm
    const paddock = await this.prisma.paddock.findFirst({
      where: {
        id: dto.paddockId,
        farmId,
        deletedAt: null,
      },
    });

    if (!paddock) {
      throw new BadRequestException('Paddock not found or does not belong to this farm');
    }

    // 3. Validate that herd group exists and belongs to the farm
    const herdGroup = await this.prisma.herdGroup.findFirst({
      where: {
        id: dto.herdGroupId,
        farmId,
        deletedAt: null,
      },
    });

    if (!herdGroup) {
      throw new BadRequestException('Herd group not found or does not belong to this farm');
    }

    // 4. Validate date consistency
    if (dto.endAt) {
      this.rulesService.validateDateConsistency(
        new Date(dto.startAt),
        new Date(dto.endAt),
      );
    }

    // 5. Determine initial status based on dates
    const status = this.rulesService.determineInitialStatus(dto.startAt, dto.endAt);

    // 6. If status is active, validate that resources are available
    if (status === GrazingEventStatus.ACTIVE) {
      await this.rulesService.validateHerdGroupAvailability(dto.herdGroupId);
      await this.rulesService.validatePaddockAvailability(dto.paddockId);
    }

    // 7. Get UGM snapshot from herd group
    const ugmSnapshot = herdGroup.ugm ? herdGroup.ugm.toNumber() : null;

    // 8. Create the grazing event
    return this.grazingEventRepository.create(
      farmId,
      dto,
      status,
      ugmSnapshot,
    );
  }
}
