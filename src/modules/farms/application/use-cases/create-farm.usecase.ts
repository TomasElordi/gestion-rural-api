import { Injectable } from '@nestjs/common';
import { PrismaFarmsRepository } from '../../infrastructure/repositories/prisma-farms.repository';

@Injectable()
export class CreateFarmUseCase {
  constructor(private readonly farmsRepo: PrismaFarmsRepository) {}

  async execute(input: {
    organizationId: string;
    name: string;
    center?: { lng: number; lat: number };
  }) {
    return this.farmsRepo.create(input);
  }
}
