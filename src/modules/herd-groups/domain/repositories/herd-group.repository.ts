import { CreateHerdGroupDto } from '../../presentation/dto/create-herd-group.dto';
import { UpdateHerdGroupDto } from '../../presentation/dto/update-herd-group.dto';
import { HerdGroupResponseDto } from '../../presentation/dto/herd-group-response.dto';

export abstract class HerdGroupRepository {
  abstract create(
    farmId: string,
    dto: CreateHerdGroupDto,
    ugm: number,
  ): Promise<HerdGroupResponseDto>;

  abstract findAllByFarmId(farmId: string): Promise<HerdGroupResponseDto[]>;

  abstract findById(
    id: string,
    farmId: string,
  ): Promise<HerdGroupResponseDto | null>;

  abstract update(
    id: string,
    farmId: string,
    dto: UpdateHerdGroupDto,
    ugm?: number,
  ): Promise<HerdGroupResponseDto>;

  abstract delete(id: string, farmId: string): Promise<void>;
}
