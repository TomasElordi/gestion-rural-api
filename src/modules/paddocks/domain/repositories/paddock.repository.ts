import { CreatePaddockDto } from '../../presentation/dto/create-paddock.dto';
import { UpdatePaddockDto } from '../../presentation/dto/update-paddock.dto';
import { PaddockResponseDto } from '../../presentation/dto/paddock-response.dto';

export abstract class PaddockRepository {
  abstract create(
    farmId: string,
    dto: CreatePaddockDto,
  ): Promise<PaddockResponseDto>;

  abstract findAllByFarmId(farmId: string): Promise<PaddockResponseDto[]>;

  abstract findById(
    id: string,
    farmId: string,
  ): Promise<PaddockResponseDto | null>;

  abstract update(
    id: string,
    farmId: string,
    dto: UpdatePaddockDto,
  ): Promise<PaddockResponseDto>;

  abstract delete(id: string, farmId: string): Promise<void>;
}
