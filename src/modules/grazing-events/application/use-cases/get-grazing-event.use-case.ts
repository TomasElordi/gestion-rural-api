import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';

@Injectable()
export class GetGrazingEventUseCase {
  constructor(
    private grazingEventRepository: GrazingEventRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<GrazingEventResponseDto> {
    // Validate that the farm exists and belongs to the user's organization
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

    const grazingEvent = await this.grazingEventRepository.findById(id, farmId);

    if (!grazingEvent) {
      throw new NotFoundException('Grazing event not found');
    }

    return grazingEvent;
  }
}
