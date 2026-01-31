import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  Matches,
  IsOptional,
} from 'class-validator';

class GeoJsonGeometry {
  @ApiProperty({ example: 'Polygon' })
  @IsString()
  @Matches(/^Polygon$/, { message: 'type must be "Polygon"' })
  type: string;

  @ApiProperty({
    example: [
      [
        [-58.123, -34.456],
        [-58.124, -34.456],
        [-58.124, -34.457],
        [-58.123, -34.457],
        [-58.123, -34.456], // cerrado
      ],
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  coordinates: number[][][];
}

export class CreatePaddockDto {
  @ApiProperty({ example: 'Potrero Norte' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Frente al camino principal', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: GeoJsonGeometry,
    description: 'GeoJSON Polygon (WGS84, EPSG:4326)',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJsonGeometry)
  geometry: GeoJsonGeometry;
}
