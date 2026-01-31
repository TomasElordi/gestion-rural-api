import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';
import { QueryGrazingEventsDto } from '../../presentation/dto/query-grazing-events.dto';

@Injectable()
export class ListGrazingEventsUseCase {
  constructor(
    private grazingEventRepository: GrazingEventRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
    query: QueryGrazingEventsDto,
  ): Promise<GrazingEventResponseDto[]> {
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

    return this.grazingEventRepository.findAllByFarmId(farmId, query);
  }
}
