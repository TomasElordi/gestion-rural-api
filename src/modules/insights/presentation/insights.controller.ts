import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
import {
  DateRangeQueryDto,
  RestDaysResponseDto,
  OccupancyResponseDto,
  StockingRateResponseDto,
  TimelineResponseDto,
  ActiveAlertsResponseDto,
} from './dto';
import {
  GetRestDaysUseCase,
  GetOccupancyUseCase,
  GetStockingRateUseCase,
  GetTimelineUseCase,
  GetActiveAlertsUseCase,
} from '../application/use-cases';

@ApiTags('Insights PRV')
@ApiBearerAuth()
@Controller('farms/:farmId/insights')
export class InsightsController {
  constructor(
    private getRestDaysUseCase: GetRestDaysUseCase,
    private getOccupancyUseCase: GetOccupancyUseCase,
    private getStockingRateUseCase: GetStockingRateUseCase,
    private getTimelineUseCase: GetTimelineUseCase,
    private getActiveAlertsUseCase: GetActiveAlertsUseCase,
  ) {}

  @Get('rest-days')
  @ApiOperation({
    summary: 'Get rest days analysis for all paddocks',
    description:
      'Calculate days since last grazing event ended for each paddock. ' +
      'Helps identify which paddocks have had sufficient rest time.',
  })
  async getRestDays(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<RestDaysResponseDto> {
    return this.getRestDaysUseCase.execute(farmId, user.orgId!);
  }

  @Get('occupancy')
  @ApiOperation({
    summary: 'Get occupancy analysis for grazing events',
    description:
      'Calculate duration (occupancy) of grazing events in a date range. ' +
      'Flags events that exceed the configured threshold (default 3 days).',
  })
  async getOccupancy(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Query() query: DateRangeQueryDto,
    @CurrentUser() user: JwtUser,
  ): Promise<OccupancyResponseDto> {
    return this.getOccupancyUseCase.execute(
      farmId,
      user.orgId!,
      query.from,
      query.to,
    );
  }

  @Get('stocking-rate')
  @ApiOperation({
    summary: 'Get stocking rate analysis for grazing events',
    description:
      'Calculate UGM per hectare (stocking rate) for each grazing event in a date range. ' +
      'Uses UGM snapshot if available, otherwise current herd group UGM. ' +
      'Flags events that exceed configured threshold if set.',
  })
  async getStockingRate(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Query() query: DateRangeQueryDto,
    @CurrentUser() user: JwtUser,
  ): Promise<StockingRateResponseDto> {
    return this.getStockingRateUseCase.execute(
      farmId,
      user.orgId!,
      query.from,
      query.to,
    );
  }

  @Get('timeline')
  @ApiOperation({
    summary: 'Get comprehensive timeline of grazing events with all insights',
    description:
      'Returns enriched grazing events with occupancy and stocking rate calculations. ' +
      'Combines all insights for a complete view of grazing management.',
  })
  async getTimeline(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Query() query: DateRangeQueryDto,
    @CurrentUser() user: JwtUser,
  ): Promise<TimelineResponseDto> {
    return this.getTimelineUseCase.execute(
      farmId,
      user.orgId!,
      query.from,
      query.to,
    );
  }

  @Get('active-alerts')
  @ApiOperation({
    summary: 'Get active grazing events with occupancy calculations',
    description:
      'Returns all active grazing events with calculated occupancy days and hours. ' +
      'Results are sorted by longest occupancy first (most critical alerts). ' +
      'Includes paddock and herd group details with JOINs for efficiency.',
  })
  async getActiveAlerts(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Query() query: DateRangeQueryDto,
    @CurrentUser() user: JwtUser,
  ): Promise<ActiveAlertsResponseDto> {
    return this.getActiveAlertsUseCase.execute(
      farmId,
      user.orgId!,
      query.from,
      query.to,
    );
  }
}
