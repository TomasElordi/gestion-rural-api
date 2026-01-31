import { Module } from '@nestjs/common';
import { HerdGroupsController } from './presentation/herd-groups.controller';
import { HerdGroupRepository } from './domain/repositories/herd-group.repository';
import { PrismaHerdGroupRepository } from './infrastructure/repositories/prisma-herd-group.repository';
import { UgmCalculatorService } from './application/services/ugm-calculator.service';
import { CreateHerdGroupUseCase } from './application/use-cases/create-herd-group.use-case';
import { ListHerdGroupsUseCase } from './application/use-cases/list-herd-groups.use-case';
import { GetHerdGroupUseCase } from './application/use-cases/get-herd-group.use-case';
import { UpdateHerdGroupUseCase } from './application/use-cases/update-herd-group.use-case';
import { DeleteHerdGroupUseCase } from './application/use-cases/delete-herd-group.use-case';

@Module({
  controllers: [HerdGroupsController],
  providers: [
    {
      provide: HerdGroupRepository,
      useClass: PrismaHerdGroupRepository,
    },
    UgmCalculatorService,
    CreateHerdGroupUseCase,
    ListHerdGroupsUseCase,
    GetHerdGroupUseCase,
    UpdateHerdGroupUseCase,
    DeleteHerdGroupUseCase,
  ],
  exports: [HerdGroupRepository, UgmCalculatorService],
})
export class HerdGroupsModule {}
