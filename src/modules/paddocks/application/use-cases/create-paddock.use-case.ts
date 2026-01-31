import { Injectable, NotFoundException } from '@nestjs/common';
import { PaddockRepository } from '../../domain/repositories/paddock.repository';
import { CreatePaddockDto } from '../../presentation/dto/create-paddock.dto';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CreatePaddockUseCase {
  constructor(
    private paddockRepository: PaddockRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
    dto: CreatePaddockDto,
  ): Promise<PaddockResponseDto> {
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

    return this.paddockRepository.create(farmId, dto);
  }
}
