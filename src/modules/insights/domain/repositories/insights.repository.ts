export interface PaddockRestDaysData {
  paddockId: string;
  paddockName: string;
  areaHa: number;
  lastGrazingEndDate: Date | null;
}

export interface OccupancyEventData {
  eventId: string;
  paddockId: string;
  paddockName: string;
  herdGroupId: string;
  herdGroupName: string;
  startAt: Date;
  endAt: Date | null;
  status: string;
}

export interface StockingRateEventData {
  eventId: string;
  paddockId: string;
  paddockName: string;
  paddockAreaHa: number;
  herdGroupId: string;
  herdGroupName: string;
  ugmSnapshot: number | null;
  herdGroupCurrentUgm: number;
  startAt: Date;
  endAt: Date | null;
  status: string;
}

export interface TimelineEventData {
  eventId: string;
  paddockId: string;
  paddockName: string;
  paddockAreaHa: number;
  herdGroupId: string;
  herdGroupName: string;
  ugmSnapshot: number | null;
  herdGroupCurrentUgm: number;
  startAt: Date;
  endAt: Date | null;
  status: string;
}

export interface ActiveAlertEventData {
  eventId: string;
  paddockId: string;
  paddockName: string;
  herdGroupId: string;
  herdGroupName: string;
  startAt: Date;
  endAt: Date | null;
  status: string;
  ugmSnapshot: number | null;
  notes: string | null;
}

export abstract class InsightsRepository {
  /**
   * Get all paddocks with their last grazing end date for a farm
   */
  abstract getPaddocksRestDays(farmId: string): Promise<PaddockRestDaysData[]>;

  /**
   * Get grazing events in a date range for occupancy analysis
   */
  abstract getOccupancyEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<OccupancyEventData[]>;

  /**
   * Get grazing events in a date range for stocking rate analysis
   */
  abstract getStockingRateEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<StockingRateEventData[]>;

  /**
   * Get grazing events in a date range for timeline view
   */
  abstract getTimelineEvents(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<TimelineEventData[]>;

  /**
   * Get active grazing events for alerts
   */
  abstract getActiveAlerts(
    farmId: string,
    from?: Date,
    to?: Date,
  ): Promise<ActiveAlertEventData[]>;
}
