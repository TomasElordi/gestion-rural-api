import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaddockRepository } from '../../domain/repositories/paddock.repository';
import { UpdatePaddockDto } from '../../presentation/dto/update-paddock.dto';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';

@Injectable()
export class UpdatePaddockUseCase {
  constructor(
    private paddockRepository: PaddockRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    paddockId: string,
    farmId: string,
    organizationId: string,
    dto: UpdatePaddockDto,
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

    return this.paddockRepository.update(paddockId, farmId, dto);
  }
}
