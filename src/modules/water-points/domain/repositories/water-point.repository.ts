import { CreateWaterPointDto } from '../../presentation/dto/create-water-point.dto';
import { UpdateWaterPointDto } from '../../presentation/dto/update-water-point.dto';
import { WaterPointResponseDto } from '../../presentation/dto/water-point-response.dto';

export abstract class WaterPointRepository {
  abstract create(
    farmId: string,
    dto: CreateWaterPointDto,
  ): Promise<WaterPointResponseDto>;

  abstract findAllByFarmId(farmId: string): Promise<WaterPointResponseDto[]>;

  abstract findById(
    id: string,
    farmId: string,
  ): Promise<WaterPointResponseDto | null>;

  abstract update(
    id: string,
    farmId: string,
    dto: UpdateWaterPointDto,
  ): Promise<WaterPointResponseDto>;

  abstract delete(id: string, farmId: string): Promise<void>;
}
