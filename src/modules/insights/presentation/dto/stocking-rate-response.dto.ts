import { ApiProperty } from '@nestjs/swagger';

export class StockingRateEventDto {
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

  @ApiProperty({
    example: 150.5,
    description: 'UGM used in this event (from snapshot or current herd group)'
  })
  eventUgm: number;

  @ApiProperty({ example: 3.31, description: 'UGM per hectare (stocking rate)' })
  ugmPerHa: number;

  @ApiProperty({
    example: false,
    nullable: true,
    description: 'Whether stocking rate exceeds threshold (null if no threshold configured)'
  })
  exceedsThreshold: boolean | null;

  @ApiProperty({ example: '2024-01-10T08:00:00Z' })
  startAt: string;

  @ApiProperty({
    example: '2024-01-14T08:00:00Z',
    nullable: true
  })
  endAt: string | null;

  @ApiProperty({ example: 'done', enum: ['active', 'done', 'cancelled'] })
  status: string;
}

export class StockingRateResponseDto {
  @ApiProperty({ type: [StockingRateEventDto] })
  events: StockingRateEventDto[];

  @ApiProperty({
    example: 5,
    nullable: true,
    description: 'Configured threshold for UGM per hectare (null if not set)'
  })
  thresholdUgmPerHa: number | null;

  @ApiProperty({ example: '2024-01-01' })
  fromDate: string;

  @ApiProperty({ example: '2024-12-31' })
  toDate: string;
}
