import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { HerdGroupRepository } from '../../domain/repositories/herd-group.repository';

@Injectable()
export class DeleteHerdGroupUseCase {
  constructor(
    private herdGroupRepository: HerdGroupRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<void> {
    // Validar que el farm existe y pertenece a la org del usuario
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

    await this.herdGroupRepository.delete(id, farmId);
  }
}
