import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { InsightsRepository } from '../../domain/repositories/insights.repository';
import {
  PaddockRestDaysDto,
  RestDaysResponseDto,
} from '../../presentation/dto';

@Injectable()
export class GetRestDaysUseCase {
  constructor(
    private insightsRepository: InsightsRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
  ): Promise<RestDaysResponseDto> {
    // Validate that the farm exists and belongs to the user's organization
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

    const paddocksData =
      await this.insightsRepository.getPaddocksRestDays(farmId);

    const now = new Date();
    const paddocks: PaddockRestDaysDto[] = paddocksData.map((data) => {
      const neverGrazed = data.lastGrazingEndDate === null;
      let restDays: number | null = null;

      if (!neverGrazed && data.lastGrazingEndDate) {
        const diffMs = now.getTime() - data.lastGrazingEndDate.getTime();
        restDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      return {
        paddockId: data.paddockId,
        paddockName: data.paddockName,
        areaHa: data.areaHa,
        restDays,
        neverGrazed,
        lastGrazingEndDate: data.lastGrazingEndDate?.toISOString() ?? null,
      };
    });

    return {
      paddocks,
      calculatedAt: now.toISOString(),
    };
  }
}
