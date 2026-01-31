import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma/prisma.service';

import { InsightsRepository } from '../../domain/repositories/insights.repository';
import { TimelineEventDto, TimelineResponseDto } from '../../presentation/dto';

@Injectable()
export class GetTimelineUseCase {
  private readonly occupancyThresholdDays: number;
  private readonly stockingRateThresholdUgmPerHa: number | null;

  constructor(
    private insightsRepository: InsightsRepository,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.occupancyThresholdDays = this.configService.get<number>(
      'PRV_MAX_OCCUPANCY_DAYS',
      3,
    );

    const stockingThreshold =
      this.configService.get<number>('PRV_MAX_UGM_PER_HA');
    this.stockingRateThresholdUgmPerHa =
      stockingThreshold !== undefined ? stockingThreshold : null;
  }

  async execute(
    farmId: string,
    organizationId: string,
    from?: string,
    to?: string,
  ): Promise<TimelineResponseDto> {
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

    const eventsData = await this.insightsRepository.getTimelineEvents(
      farmId,
      fromDate,
      toDate,
    );

    const now = new Date();
    const events: TimelineEventDto[] = eventsData.map((data) => {
      // Calculate occupancy
      const startAt = data.startAt;
      const endAt = data.endAt ?? now;
      const durationMs = endAt.getTime() - startAt.getTime();
      const occupancyHours = Math.floor(durationMs / (1000 * 60 * 60));
      const occupancyDays = Number(
        (durationMs / (1000 * 60 * 60 * 24)).toFixed(2),
      );

      // Calculate stocking rate
      const eventUgm = data.ugmSnapshot ?? data.herdGroupCurrentUgm;
      const ugmPerHa =
        data.paddockAreaHa > 0
          ? Number((eventUgm / data.paddockAreaHa).toFixed(2))
          : 0;

      // Check thresholds
      const occupancyExceedsThreshold =
        occupancyDays > this.occupancyThresholdDays;
      const stockingRateExceedsThreshold =
        this.stockingRateThresholdUgmPerHa !== null
          ? ugmPerHa > this.stockingRateThresholdUgmPerHa
          : null;

      return {
        eventId: data.eventId,
        paddockId: data.paddockId,
        paddockName: data.paddockName,
        paddockAreaHa: data.paddockAreaHa,
        herdGroupId: data.herdGroupId,
        herdGroupName: data.herdGroupName,
        eventUgm,
        startAt: data.startAt.toISOString(),
        endAt: data.endAt?.toISOString() ?? null,
        status: data.status,
        occupancyHours,
        occupancyDays,
        ugmPerHa,
        occupancyExceedsThreshold,
        stockingRateExceedsThreshold,
      };
    });

    return {
      events,
      occupancyThresholdDays: this.occupancyThresholdDays,
      stockingRateThresholdUgmPerHa: this.stockingRateThresholdUgmPerHa,
      fromDate: fromDate?.toISOString().split('T')[0] ?? '',
      toDate: toDate?.toISOString().split('T')[0] ?? '',
    };
  }
}
