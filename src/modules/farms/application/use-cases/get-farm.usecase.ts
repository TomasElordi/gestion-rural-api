import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaFarmsRepository } from '../../infrastructure/repositories/prisma-farms.repository';

@Injectable()
export class GetFarmUseCase {
  constructor(private readonly farmsRepo: PrismaFarmsRepository) {}

  async execute(input: { farmId: string; organizationId: string }) {
    const farm = await this.farmsRepo.getById(input.farmId);
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.organizationId !== input.organizationId)
      throw new ForbiddenException('No access to this farm');
    return farm;
  }
}
