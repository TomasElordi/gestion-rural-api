import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { PaddockRepository } from '../../domain/repositories/paddock.repository';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';

@Injectable()
export class ListPaddocksUseCase {
  constructor(
    private paddockRepository: PaddockRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
  ): Promise<PaddockResponseDto[]> {
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

    return this.paddockRepository.findAllByFarmId(farmId);
  }
}
