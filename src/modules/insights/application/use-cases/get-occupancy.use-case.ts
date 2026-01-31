import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma/prisma.service';

import { InsightsRepository } from '../../domain/repositories/insights.repository';
import {
  OccupancyEventDto,
  OccupancyResponseDto,
} from '../../presentation/dto';

@Injectable()
export class GetOccupancyUseCase {
  private readonly thresholdDays: number;

  constructor(
    private insightsRepository: InsightsRepository,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.thresholdDays = this.configService.get<number>(
      'PRV_MAX_OCCUPANCY_DAYS',
      3,
    );
  }

  async execute(
    farmId: string,
    organizationId: string,
    from?: string,
    to?: string,
  ): Promise<OccupancyResponseDto> {
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

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const eventsData = await this.insightsRepository.getOccupancyEvents(
      farmId,
      fromDate,
      toDate,
    );

    const now = new Date();
    const events: OccupancyEventDto[] = eventsData.map((data) => {
      const startAt = data.startAt;
      const endAt = data.endAt ?? now; // Use current time for active events

      const durationMs = endAt.getTime() - startAt.getTime();
      const occupancyHours = Math.floor(durationMs / (1000 * 60 * 60));
      const occupancyDays = Number(
        (durationMs / (1000 * 60 * 60 * 24)).toFixed(2),
      );

      return {
        eventId: data.eventId,
        paddockId: data.paddockId,
        paddockName: data.paddockName,
        herdGroupId: data.herdGroupId,
        herdGroupName: data.herdGroupName,
        startAt: data.startAt.toISOString(),
        endAt: data.endAt?.toISOString() ?? null,
        status: data.status,
        occupancyHours,
        occupancyDays,
        exceedsThreshold: occupancyDays > this.thresholdDays,
      };
    });

    return {
      events,
      thresholdDays: this.thresholdDays,
      fromDate: fromDate?.toISOString().split('T')[0] ?? '',
      toDate: toDate?.toISOString().split('T')[0] ?? '',
    };
  }
}
