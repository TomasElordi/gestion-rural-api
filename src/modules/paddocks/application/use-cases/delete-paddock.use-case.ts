import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaddockRepository } from '../../domain/repositories/paddock.repository';

@Injectable()
export class DeletePaddockUseCase {
  constructor(
    private paddockRepository: PaddockRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    paddockId: string,
    farmId: string,
    organizationId: string,
  ): Promise<void> {
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

    await this.paddockRepository.delete(paddockId, farmId);
  }
}
