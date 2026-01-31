import { PartialType } from '@nestjs/swagger';
import { CreateWaterPointDto } from './create-water-point.dto';

export class UpdateWaterPointDto extends PartialType(CreateWaterPointDto) {}
