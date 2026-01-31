import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaddockRepository } from '../../../paddocks/domain/repositories/paddock.repository';
import { WaterPointRepository } from '../../../water-points/domain/repositories/water-point.repository';
import { HerdGroupRepository } from '../../../herd-groups/domain/repositories/herd-group.repository';
import { GrazingEventRepository } from '../../../grazing-events/domain/repositories/grazing-event.repository';
import { GrazingEventStatus } from '../../../grazing-events/presentation/dto/update-grazing-event.dto';
import { FarmMapLayersResponseDto } from '../../presentation/dto/farm-map-layers-response.dto';

@Injectable()
export class GetFarmMapLayersUseCase {
  constructor(
    private prisma: PrismaService,
    private paddockRepository: PaddockRepository,
    private waterPointRepository: WaterPointRepository,
    private herdGroupRepository: HerdGroupRepository,
    private grazingEventRepository: GrazingEventRepository,
  ) {}

  async execute(
    farmId: string,
    organizationId: string,
  ): Promise<FarmMapLayersResponseDto> {
    // Verify farm exists and belongs to user's organization
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

    // Fetch all map layers in parallel
    const [paddocks, waterPoints, herdGroups, grazingEvents] =
      await Promise.all([
        this.paddockRepository.findAllByFarmId(farmId),
        this.waterPointRepository.findAllByFarmId(farmId),
        this.herdGroupRepository.findAllByFarmId(farmId),
        this.grazingEventRepository.findAllByFarmId(farmId, {
          status: GrazingEventStatus.ACTIVE,
        }),
      ]);

    return {
      paddocks,
      waterPoints,
      herdGroups,
      grazingEvents,
    };
  }
}
