import { ApiProperty } from '@nestjs/swagger';

export class PaddockRestDaysDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  paddockId: string;

  @ApiProperty({ example: 'Potrero Norte' })
  paddockName: string;

  @ApiProperty({ example: 45.5 })
  areaHa: number;

  @ApiProperty({
    example: 25,
    nullable: true,
    description: 'Days since last grazing event ended (null if never grazed)'
  })
  restDays: number | null;

  @ApiProperty({ example: false })
  neverGrazed: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    nullable: true,
    description: 'End date of last grazing event'
  })
  lastGrazingEndDate: string | null;
}

export class RestDaysResponseDto {
  @ApiProperty({ type: [PaddockRestDaysDto] })
  paddocks: PaddockRestDaysDto[];

  @ApiProperty({ example: '2024-01-25T12:00:00Z' })
  calculatedAt: string;
}
