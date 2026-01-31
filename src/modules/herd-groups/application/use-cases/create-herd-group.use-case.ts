import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { HerdGroupRepository } from '../../domain/repositories/herd-group.repository';
import { CreateHerdGroupDto } from '../../presentation/dto/create-herd-group.dto';
import { HerdGroupResponseDto } from '../../presentation/dto/herd-group-response.dto';
import { UgmCalculatorService } from '../services/ugm-calculator.service';

@Injectable()
export class CreateHerdGroupUseCase {
  constructor(
    private herdGroupRepository: HerdGroupRepository,
    private prisma: PrismaService,
    private ugmCalculator: UgmCalculatorService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
    dto: CreateHerdGroupDto,
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

    // Calcular UGM a partir del peso vivo
    const ugm = this.ugmCalculator.calculateUgm(dto.liveWeightKg);

    return this.herdGroupRepository.create(farmId, dto, ugm.toNumber());
  }
}
