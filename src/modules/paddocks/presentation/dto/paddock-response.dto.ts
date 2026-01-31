import { ApiProperty } from '@nestjs/swagger';

export class PaddockResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  farmId: string;

  @ApiProperty({ description: 'Área en hectáreas', example: 12.5 })
  areaHa: number;

  @ApiProperty({ type: Object, description: 'GeoJSON Polygon' })
  geometry: any;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
