import { Injectable } from '@nestjs/common';
import { PrismaFarmsRepository } from '../../infrastructure/repositories/prisma-farms.repository';

@Injectable()
export class ListFarmsUseCase {
  constructor(private readonly farmsRepo: PrismaFarmsRepository) {}

  execute(organizationId: string) {
    return this.farmsRepo.listByOrganization(organizationId);
  }
}
