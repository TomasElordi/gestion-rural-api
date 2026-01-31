import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';

export class CreateHerdGroupDto {
  @ApiProperty({ example: 'Terneros 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Terneros', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 4500.5,
    description: 'Total live weight of the herd group in kilograms',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Live weight must be a positive number' })
  liveWeightKg: number;

  @ApiProperty({ example: 25, required: false, description: 'Number of animals in the herd group' })
  @IsInt()
  @IsOptional()
  @Min(0, { message: 'Head count must be a positive integer' })
  headCount?: number;

  @ApiProperty({ example: 'Lote de terneros de destete', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
