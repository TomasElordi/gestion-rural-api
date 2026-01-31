import { Module } from '@nestjs/common';
import { PrismaFarmsRepository } from './infrastructure/repositories/prisma-farms.repository';
import { FarmsController } from './presentation/farms.controller';
import { CreateFarmUseCase } from './application/use-cases/create-farm.usecase';
import { ListFarmsUseCase } from './application/use-cases/list-farms.usecase';
import { GetFarmUseCase } from './application/use-cases/get-farm.usecase';
import { GetFarmMapLayersUseCase } from './application/use-cases/get-farm-map-layers.usecase';
import { PaddocksModule } from '../paddocks/paddocks.module';
import { WaterPointsModule } from '../water-points/water-points.module';
import { HerdGroupsModule } from '../herd-groups/herd-groups.module';
import { GrazingEventsModule } from '../grazing-events/grazing-events.module';

@Module({
  imports: [
    PaddocksModule,
    WaterPointsModule,
    HerdGroupsModule,
    GrazingEventsModule,
  ],
  controllers: [FarmsController],
  providers: [
    PrismaFarmsRepository,
    CreateFarmUseCase,
    ListFarmsUseCase,
    GetFarmUseCase,
    GetFarmMapLayersUseCase,
  ],
})
export class FarmsModule {}
