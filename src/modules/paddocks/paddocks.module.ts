import { Module } from '@nestjs/common';
import { PaddocksController } from './presentation/paddocks.controller';
import { PaddockRepository } from './domain/repositories/paddock.repository';
import { PrismaPaddockRepository } from './infrastructure/repositories/prisma-paddock.repository';
import { CreatePaddockUseCase } from './application/use-cases/create-paddock.use-case';
import { ListPaddocksUseCase } from './application/use-cases/list-paddocks.use-case';
import { GetPaddockUseCase } from './application/use-cases/get-paddock.use-case';
import { UpdatePaddockUseCase } from './application/use-cases/update-paddock.use-case';
import { DeletePaddockUseCase } from './application/use-cases/delete-paddock.use-case';

@Module({
  controllers: [PaddocksController],
  providers: [
    {
      provide: PaddockRepository,
      useClass: PrismaPaddockRepository,
    },
    CreatePaddockUseCase,
    ListPaddocksUseCase,
    GetPaddockUseCase,
    UpdatePaddockUseCase,
    DeletePaddockUseCase,
  ],
  exports: [PaddockRepository],
})
export class PaddocksModule {}
