import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { GrazingEventRepository } from '../../domain/repositories/grazing-event.repository';

@Injectable()
export class DeleteGrazingEventUseCase {
  constructor(
    private grazingEventRepository: GrazingEventRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<void> {
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

    await this.grazingEventRepository.delete(id, farmId);
  }
}
