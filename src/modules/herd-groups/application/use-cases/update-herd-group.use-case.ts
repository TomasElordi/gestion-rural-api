import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

import { HerdGroupRepository } from '../../domain/repositories/herd-group.repository';
import { UpdateHerdGroupDto } from '../../presentation/dto/update-herd-group.dto';
import { HerdGroupResponseDto } from '../../presentation/dto/herd-group-response.dto';
import { UgmCalculatorService } from '../services/ugm-calculator.service';

@Injectable()
export class UpdateHerdGroupUseCase {
  constructor(
    private herdGroupRepository: HerdGroupRepository,
    private prisma: PrismaService,
    private ugmCalculator: UgmCalculatorService,
  ) {}

  async execute(
    id: string,
    farmId: string,
    organizationId: string,
    dto: UpdateHerdGroupDto,
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

    // Si se actualiza el peso vivo, recalcular UGM
    let ugm: number | undefined;
    if (dto.liveWeightKg !== undefined) {
      ugm = this.ugmCalculator.calculateUgm(dto.liveWeightKg).toNumber();
    }

    return this.herdGroupRepository.update(id, farmId, dto, ugm);
  }
}
