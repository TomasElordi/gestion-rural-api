import { Module } from '@nestjs/common';
import { GrazingEventsController } from './presentation/grazing-events.controller';
import { GrazingEventRepository } from './domain/repositories/grazing-event.repository';
import { PrismaGrazingEventRepository } from './infrastructure/repositories/prisma-grazing-event.repository';
import { GrazingEventRulesService } from './application/services/grazing-event-rules.service';
import { CreateGrazingEventUseCase } from './application/use-cases/create-grazing-event.use-case';
import { ListGrazingEventsUseCase } from './application/use-cases/list-grazing-events.use-case';
import { GetGrazingEventUseCase } from './application/use-cases/get-grazing-event.use-case';
import { UpdateGrazingEventUseCase } from './application/use-cases/update-grazing-event.use-case';
import { DeleteGrazingEventUseCase } from './application/use-cases/delete-grazing-event.use-case';

@Module({
  controllers: [GrazingEventsController],
  providers: [
    {
      provide: GrazingEventRepository,
      useClass: PrismaGrazingEventRepository,
    },
    GrazingEventRulesService,
    CreateGrazingEventUseCase,
    ListGrazingEventsUseCase,
    GetGrazingEventUseCase,
    UpdateGrazingEventUseCase,
    DeleteGrazingEventUseCase,
  ],
  exports: [GrazingEventRepository, GrazingEventRulesService],
})
export class GrazingEventsModule {}
