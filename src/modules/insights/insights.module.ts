import { Module } from '@nestjs/common';
import { InsightsController } from './presentation/insights.controller';
import { InsightsRepository } from './domain/repositories/insights.repository';
import { PrismaInsightsRepository } from './infrastructure/repositories/prisma-insights.repository';
import {
  GetRestDaysUseCase,
  GetOccupancyUseCase,
  GetStockingRateUseCase,
  GetTimelineUseCase,
  GetActiveAlertsUseCase,
} from './application/use-cases';

@Module({
  controllers: [InsightsController],
  providers: [
    {
      provide: InsightsRepository,
      useClass: PrismaInsightsRepository,
    },
    GetRestDaysUseCase,
    GetOccupancyUseCase,
    GetStockingRateUseCase,
    GetTimelineUseCase,
    GetActiveAlertsUseCase,
  ],
  exports: [InsightsRepository],
})
export class InsightsModule {}
