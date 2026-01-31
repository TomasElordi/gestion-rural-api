import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { PaddockRepository } from '../../domain/repositories/paddock.repository';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';

@Injectable()
export class GetPaddockUseCase {
  constructor(
    private paddockRepository: PaddockRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    paddockId: string,
    farmId: string,
    organizationId: string,
  ): Promise<PaddockResponseDto> {
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

    const paddock = await this.paddockRepository.findById(paddockId, farmId);

    if (!paddock) {
      throw new NotFoundException('Paddock not found');
    }

    return paddock;
  }
}
