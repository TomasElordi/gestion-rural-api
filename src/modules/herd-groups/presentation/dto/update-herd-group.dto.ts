import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';

export class UpdateHerdGroupDto {
  @ApiProperty({ example: 'Terneros 2024 - Actualizado', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Novillos', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 5200.75,
    description: 'Total live weight of the herd group in kilograms',
    required: false,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Live weight must be a positive number' })
  @IsOptional()
  liveWeightKg?: number;

  @ApiProperty({ example: 30, required: false, description: 'Number of animals in the herd group' })
  @IsInt()
  @Min(0, { message: 'Head count must be a positive integer' })
  @IsOptional()
  headCount?: number;

  @ApiProperty({ example: 'Lote actualizado después de pesaje', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
