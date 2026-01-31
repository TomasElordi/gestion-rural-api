import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma/prisma.service';

import { InsightsRepository } from '../../domain/repositories/insights.repository';
import {
  StockingRateEventDto,
  StockingRateResponseDto,
} from '../../presentation/dto';

@Injectable()
export class GetStockingRateUseCase {
  private readonly thresholdUgmPerHa: number | null;

  constructor(
    private insightsRepository: InsightsRepository,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const threshold = this.configService.get<number>('PRV_MAX_UGM_PER_HA');
    this.thresholdUgmPerHa = threshold !== undefined ? threshold : null;
  }

  async execute(
    farmId: string,
    organizationId: string,
    from?: string,
    to?: string,
  ): Promise<StockingRateResponseDto> {
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

    const eventsData = await this.insightsRepository.getStockingRateEvents(
      farmId,
      fromDate,
      toDate,
    );

    const events: StockingRateEventDto[] = eventsData.map((data) => {
      // Use ugmSnapshot if available, otherwise use current herd group UGM
      const eventUgm = data.ugmSnapshot ?? data.herdGroupCurrentUgm;

      // Calculate UGM per hectare
      const ugmPerHa =
        data.paddockAreaHa > 0
          ? Number((eventUgm / data.paddockAreaHa).toFixed(2))
          : 0;

      const exceedsThreshold =
        this.thresholdUgmPerHa !== null
          ? ugmPerHa > this.thresholdUgmPerHa
          : null;

      return {
        eventId: data.eventId,
        paddockId: data.paddockId,
        paddockName: data.paddockName,
        paddockAreaHa: data.paddockAreaHa,
        herdGroupId: data.herdGroupId,
        herdGroupName: data.herdGroupName,
        eventUgm,
        ugmPerHa,
        exceedsThreshold,
        startAt: data.startAt.toISOString(),
        endAt: data.endAt?.toISOString() ?? null,
        status: data.status,
      };
    });

    return {
      events,
      thresholdUgmPerHa: this.thresholdUgmPerHa,
      fromDate: fromDate?.toISOString().split('T')[0] ?? '',
      toDate: toDate?.toISOString().split('T')[0] ?? '',
    };
  }
}
