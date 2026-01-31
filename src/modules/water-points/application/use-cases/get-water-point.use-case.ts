import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { WaterPointRepository } from '../../domain/repositories/water-point.repository';
import { WaterPointResponseDto } from '../../presentation/dto/water-point-response.dto';

@Injectable()
export class GetWaterPointUseCase {
  constructor(
    private waterPointRepository: WaterPointRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<WaterPointResponseDto> {
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

    const waterPoint = await this.waterPointRepository.findById(id, farmId);

    if (!waterPoint) {
      throw new NotFoundException('Water point not found');
    }

    return waterPoint;
  }
}
