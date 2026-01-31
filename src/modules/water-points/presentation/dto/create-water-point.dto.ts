import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Matches,
  IsIn,
} from 'class-validator';

class GeoJsonPoint {
  @ApiProperty({ example: 'Point', description: 'Must be "Point"' })
  @IsString()
  @Matches(/^Point$/, { message: 'type must be "Point"' })
  type: string;

  @ApiProperty({
    example: [-58.123456, -34.654321],
    description: 'Coordinates [longitude, latitude] in WGS84',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: [number, number];
}

export class CreateWaterPointDto {
  @ApiProperty({
    example: 'Tanque Principal',
    description: 'Nombre del punto de agua',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'tanque',
    description: 'Tipo de punto de agua',
    enum: ['bebedero', 'tanque', 'molino'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['bebedero', 'tanque', 'molino'])
  type?: string;

  @ApiProperty({
    type: GeoJsonPoint,
    description: 'Ubicación del punto de agua en formato GeoJSON Point',
    example: {
      type: 'Point',
      coordinates: [-58.123456, -34.654321],
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJsonPoint)
  geometry: GeoJsonPoint;
}
