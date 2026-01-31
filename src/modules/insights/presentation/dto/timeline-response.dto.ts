import { ApiProperty } from '@nestjs/swagger';

export class TimelineEventDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  eventId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  paddockId: string;

  @ApiProperty({ example: 'Potrero Norte' })
  paddockName: string;

  @ApiProperty({ example: 45.5 })
  paddockAreaHa: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  herdGroupId: string;

  @ApiProperty({ example: 'Rodeo Principal' })
  herdGroupName: string;

  @ApiProperty({ example: 150.5 })
  eventUgm: number;

  @ApiProperty({ example: '2024-01-10T08:00:00Z' })
  startAt: string;

  @ApiProperty({ example: '2024-01-14T08:00:00Z', nullable: true })
  endAt: string | null;

  @ApiProperty({ example: 'done', enum: ['active', 'done', 'cancelled'] })
  status: string;

  @ApiProperty({ example: 96, description: 'Occupancy in hours' })
  occupancyHours: number;

  @ApiProperty({ example: 4, description: 'Occupancy in days' })
  occupancyDays: number;

  @ApiProperty({ example: 3.31, description: 'UGM per hectare' })
  ugmPerHa: number;

  @ApiProperty({
    example: false,
    description: 'Whether occupancy exceeds threshold'
  })
  occupancyExceedsThreshold: boolean;

  @ApiProperty({
    example: false,
    nullable: true,
    description: 'Whether stocking rate exceeds threshold'
  })
  stockingRateExceedsThreshold: boolean | null;
}

export class TimelineResponseDto {
  @ApiProperty({ type: [TimelineEventDto] })
  events: TimelineEventDto[];

  @ApiProperty({ example: 3 })
  occupancyThresholdDays: number;

  @ApiProperty({ example: 5, nullable: true })
  stockingRateThresholdUgmPerHa: number | null;

  @ApiProperty({ example: '2024-01-01' })
  fromDate: string;

  @ApiProperty({ example: '2024-12-31' })
  toDate: string;
}
