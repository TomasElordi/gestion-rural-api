import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { HerdGroupRepository } from '../../domain/repositories/herd-group.repository';
import { HerdGroupResponseDto } from '../../presentation/dto/herd-group-response.dto';

@Injectable()
export class GetHerdGroupUseCase {
  constructor(
    private herdGroupRepository: HerdGroupRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
  ): Promise<HerdGroupResponseDto> {
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

    const herdGroup = await this.herdGroupRepository.findById(id, farmId);

    if (!herdGroup) {
      throw new NotFoundException('Herd group not found');
    }

    return herdGroup;
  }
}
