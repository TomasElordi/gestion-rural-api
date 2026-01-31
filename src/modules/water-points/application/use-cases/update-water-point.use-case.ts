import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WaterPointRepository } from '../../domain/repositories/water-point.repository';
import { UpdateWaterPointDto } from '../../presentation/dto/update-water-point.dto';
import { WaterPointResponseDto } from '../../presentation/dto/water-point-response.dto';

@Injectable()
export class UpdateWaterPointUseCase {
  constructor(
    private waterPointRepository: WaterPointRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
    dto: UpdateWaterPointDto,
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

    return this.waterPointRepository.update(id, farmId, dto);
  }
}
