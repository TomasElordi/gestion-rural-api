import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CenterPointDto {
  @ApiProperty({ example: 'Point', enum: ['Point'] })
  @IsString()
  type: 'Point';

  @ApiProperty({
    example: [-59.1333, -37.3167],
    description: '[lng, lat]',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateFarmDto {
  @ApiProperty({ example: 'Establecimiento La Demo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description:
      'GeoJSON Point (optional). Example: { type: "Point", coordinates: [lng, lat] }',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CenterPointDto)
  center?: CenterPointDto;
}
