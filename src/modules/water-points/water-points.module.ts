import { Module } from '@nestjs/common';
import { WaterPointsController } from './presentation/water-points.controller';
import { WaterPointRepository } from './domain/repositories/water-point.repository';
import { PrismaWaterPointRepository } from './infrastructure/repositories/prisma-water-point.repository';
import { CreateWaterPointUseCase } from './application/use-cases/create-water-point.use-case';
import { ListWaterPointsUseCase } from './application/use-cases/list-water-points.use-case';
import { GetWaterPointUseCase } from './application/use-cases/get-water-point.use-case';
import { UpdateWaterPointUseCase } from './application/use-cases/update-water-point.use-case';
import { DeleteWaterPointUseCase } from './application/use-cases/delete-water-point.use-case';

@Module({
  controllers: [WaterPointsController],
  providers: [
    {
      provide: WaterPointRepository,
      useClass: PrismaWaterPointRepository,
    },
    CreateWaterPointUseCase,
    ListWaterPointsUseCase,
    GetWaterPointUseCase,
    UpdateWaterPointUseCase,
    DeleteWaterPointUseCase,
  ],
  exports: [WaterPointRepository],
})
export class WaterPointsModule {}
