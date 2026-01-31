import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { WaterPointRepository } from '../../domain/repositories/water-point.repository';

@Injectable()
export class DeleteWaterPointUseCase {
  constructor(
    private waterPointRepository: WaterPointRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<void> {
    // Verify farm exists and belongs to user's organization
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: farmId,
        organizationId,
        deletedAt: null,
      },
    });

    if (!farm) {
      throw new NotFoundException('Farm not found or access denied');
    }

    await this.waterPointRepository.delete(id, farmId);
  }
}
