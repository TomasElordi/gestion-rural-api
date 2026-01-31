import { ApiProperty } from '@nestjs/swagger';

export class WaterPointResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    example: 'Tanque Principal',
    description: 'Nombre del punto de agua',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'tanque',
    description: 'Tipo de punto de agua',
    enum: ['bebedero', 'tanque', 'molino'],
    nullable: true,
  })
  type: string | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  farmId: string;

  @ApiProperty({
    type: Object,
    description: 'Ubicación del punto de agua en formato GeoJSON Point',
    example: {
      type: 'Point',
      coordinates: [-58.123456, -34.654321],
    },
  })
  geometry: any;

  @ApiProperty({ description: 'Indica si el punto de agua está activo' })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
