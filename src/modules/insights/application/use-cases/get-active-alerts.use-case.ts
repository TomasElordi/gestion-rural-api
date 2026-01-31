import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { InsightsRepository } from '../../domain/repositories/insights.repository';
import {
  ActiveAlertEventDto,
  ActiveAlertsResponseDto,
} from '../../presentation/dto';

@Injectable()
export class GetActiveAlertsUseCase {
  constructor(
    private insightsRepository: InsightsRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
    from?: string,
    to?: string,
  ): Promise<ActiveAlertsResponseDto> {
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

    const eventsData = await this.insightsRepository.getActiveAlerts(
      farmId,
      fromDate,
      toDate,
    );

    const now = new Date();
    const events: ActiveAlertEventDto[] = eventsData.map((data) => {
      // Calculate occupancy from startAt to now (for active events)
      const startAt = data.startAt;
      const durationMs = now.getTime() - startAt.getTime();
      const occupancyHours = Math.floor(durationMs / (1000 * 60 * 60));
      const occupancyDays = Number(
        (durationMs / (1000 * 60 * 60 * 24)).toFixed(2),
      );

      return {
        id: data.eventId,
        paddockId: data.paddockId,
        paddockName: data.paddockName,
        herdGroupId: data.herdGroupId,
        herdGroupName: data.herdGroupName,
        entryDate: data.startAt.toISOString(),
        exitDate: data.endAt?.toISOString() ?? null,
        status: data.status,
        occupancyDays,
        occupancyHours,
        ugmSnapshot: data.ugmSnapshot ?? 0,
        notes: data.notes,
      };
    });

    // Sort by occupancyDays descending (longest active events first)
    events.sort((a, b) => b.occupancyDays - a.occupancyDays);

    return {
      events,
      calculatedAt: now.toISOString(),
    };
  }
}
