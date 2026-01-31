import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  InsightsRepository,
  OccupancyEventData,
  PaddockRestDaysData,
  StockingRateEventData,
  TimelineEventData,
  ActiveAlertEventData,
} from '../../domain/repositories/insights.repository';

@Injectable()
export class PrismaInsightsRepository implements InsightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPaddocksRestDays(farmId: string): Promise<PaddockRestDaysData[]> {
    // Get all active paddocks with their last grazing event
    const paddocks = await this.prisma.paddock.findMany({
      where: {
        farmId,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        areaHa: true,
        grazingEvents: {
          where: {
            deletedAt: null,
            status: { in: ['done', 'active'] },
            endAt: { not: null },
          },
          orderBy: { endAt: 'desc' },
          take: 1,
          select: {
            endAt: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return paddocks.map((paddock) => ({
      paddockId: paddock.id,
      paddockName: paddock.name,
      areaHa: paddock.areaHa ? Number(paddock.areaHa) : 0,
      lastGrazingEndDate:
        paddock.grazingEvents[0]?.endAt ?? null,
    }));
  }

  async getOccupancyEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<OccupancyEventData[]> {
    const whereClause: any = {
      farmId,
      deletedAt: null,
      status: { in: ['active', 'done'] },
    };

    // Build date range filter
    if (from || to) {
      whereClause.OR = [];

      if (from && to) {
        // Event overlaps with [from, to]
        whereClause.OR.push(
          // Starts within range
          { startAt: { gte: from, lte: to } },
          // Ends within range
          { endAt: { gte: from, lte: to } },
          // Spans the entire range
          { startAt: { lte: from }, endAt: { gte: to } },
          // Active events that started before 'to'
          { startAt: { lte: to }, endAt: null },
        );
      } else if (from) {
        // Events that end after 'from' or are still active
        whereClause.OR.push(
          { endAt: { gte: from } },
          { endAt: null },
        );
      } else if (to) {
        // Events that start before 'to'
        whereClause.startAt = { lte: to };
      }
    }

    const events = await this.prisma.grazingEvent.findMany({
      where: whereClause,
      select: {
        id: true,
        startAt: true,
        endAt: true,
        status: true,
        paddock: {
          select: {
            id: true,
            name: true,
          },
        },
        herdGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startAt: 'desc' },
    });

    return events.map((event) => ({
      eventId: event.id,
      paddockId: event.paddock.id,
      paddockName: event.paddock.name,
      herdGroupId: event.herdGroup.id,
      herdGroupName: event.herdGroup.name,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
    }));
  }

  async getStockingRateEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<StockingRateEventData[]> {
    const whereClause: any = {
      farmId,
      deletedAt: null,
      status: { in: ['active', 'done'] },
    };

    // Same date range logic as occupancy
    if (from || to) {
      whereClause.OR = [];

      if (from && to) {
        whereClause.OR.push(
          { startAt: { gte: from, lte: to } },
          { endAt: { gte: from, lte: to } },
          { startAt: { lte: from }, endAt: { gte: to } },
          { startAt: { lte: to }, endAt: null },
        );
      } else if (from) {
        whereClause.OR.push(
          { endAt: { gte: from } },
          { endAt: null },
        );
      } else if (to) {
        whereClause.startAt = { lte: to };
      }
    }

    const events = await this.prisma.grazingEvent.findMany({
      where: whereClause,
      select: {
        id: true,
        startAt: true,
        endAt: true,
        status: true,
        ugmSnapshot: true,
        paddock: {
          select: {
            id: true,
            name: true,
            areaHa: true,
          },
        },
        herdGroup: {
          select: {
            id: true,
            name: true,
            ugm: true,
          },
        },
      },
      orderBy: { startAt: 'desc' },
    });

    return events.map((event) => ({
      eventId: event.id,
      paddockId: event.paddock.id,
      paddockName: event.paddock.name,
      paddockAreaHa: event.paddock.areaHa ? Number(event.paddock.areaHa) : 0,
      herdGroupId: event.herdGroup.id,
      herdGroupName: event.herdGroup.name,
      ugmSnapshot: event.ugmSnapshot ? Number(event.ugmSnapshot) : null,
      herdGroupCurrentUgm: Number(event.herdGroup.ugm),
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
    }));
  }

  async getTimelineEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<TimelineEventData[]> {
    // Same implementation as stocking rate since we need the same data
    return this.getStockingRateEvents(farmId, from, to);
  }

  async getActiveAlerts(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<ActiveAlertEventData[]> {
    const whereClause: any = {
      farmId,
      deletedAt: null,
      status: 'active', // Only active events for alerts
    };

    // Build date range filter for startAt
    if (from || to) {
      const dateFilter: any = {};
      if (from) {
        dateFilter.gte = from;
      }
      if (to) {
        dateFilter.lte = to;
      }
      whereClause.startAt = dateFilter;
    }

    const events = await this.prisma.grazingEvent.findMany({
      where: whereClause,
      select: {
        id: true,
        startAt: true,
        endAt: true,
        status: true,
        ugmSnapshot: true,
        notes: true,
        paddock: {
          select: {
            id: true,
            name: true,
          },
        },
        herdGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startAt: 'desc' },
    });

    return events.map((event) => ({
      eventId: event.id,
      paddockId: event.paddock.id,
      paddockName: event.paddock.name,
      herdGroupId: event.herdGroup.id,
      herdGroupName: event.herdGroup.name,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      ugmSnapshot: event.ugmSnapshot ? Number(event.ugmSnapshot) : null,
      notes: event.notes,
    }));
  }
}
