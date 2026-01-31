import { ApiProperty } from '@nestjs/swagger';

export class OccupancyEventDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  eventId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  paddockId: string;

  @ApiProperty({ example: 'Potrero Norte' })
  paddockName: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  herdGroupId: string;

  @ApiProperty({ example: 'Rodeo Principal' })
  herdGroupName: string;

  @ApiProperty({ example: '2024-01-10T08:00:00Z' })
  startAt: string;

  @ApiProperty({
    example: '2024-01-14T08:00:00Z',
    nullable: true,
    description: 'End date (null for active events)'
  })
  endAt: string | null;

  @ApiProperty({ example: 'done', enum: ['active', 'done', 'cancelled'] })
  status: string;

  @ApiProperty({ example: 96, description: 'Occupancy duration in hours' })
  occupancyHours: number;

  @ApiProperty({ example: 4, description: 'Occupancy duration in days' })
  occupancyDays: number;

  @ApiProperty({
    example: true,
    description: 'Whether occupancy exceeds the configured threshold'
  })
  exceedsThreshold: boolean;
}

export class OccupancyResponseDto {
  @ApiProperty({ type: [OccupancyEventDto] })
  events: OccupancyEventDto[];

  @ApiProperty({ example: 3, description: 'Configured threshold in days' })
  thresholdDays: number;

  @ApiProperty({ example: '2024-01-01' })
  fromDate: string;

  @ApiProperty({ example: '2024-12-31' })
  toDate: string;
}
