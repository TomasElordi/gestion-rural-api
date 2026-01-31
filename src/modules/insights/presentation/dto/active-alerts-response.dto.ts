import { ApiProperty } from '@nestjs/swagger';

export class ActiveAlertEventDto {
  @ApiProperty({ description: 'Grazing event ID', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Paddock ID', format: 'uuid' })
  paddockId: string;

  @ApiProperty({ description: 'Paddock name', example: 'Potrero real 1.0' })
  paddockName: string;

  @ApiProperty({ description: 'Herd group ID', format: 'uuid' })
  herdGroupId: string;

  @ApiProperty({ description: 'Herd group name', example: 'Terneros 2024' })
  herdGroupName: string;

  @ApiProperty({
    description: 'Event entry date (ISO 8601)',
    example: '2024-02-15T08:00:00.000Z',
  })
  entryDate: string;

  @ApiProperty({
    description: 'Event exit date (ISO 8601), null if still active',
    example: null,
    nullable: true,
  })
  exitDate: string | null;

  @ApiProperty({
    description: 'Event status',
    example: 'active',
    enum: ['active', 'done'],
  })
  status: string;

  @ApiProperty({
    description: 'Days since entry (calculated from NOW - entryDate)',
    example: 712.48,
  })
  occupancyDays: number;

  @ApiProperty({
    description: 'Hours since entry (calculated from NOW - entryDate)',
    example: 17099,
  })
  occupancyHours: number;

  @ApiProperty({
    description: 'UGM snapshot at event creation',
    example: 10.0011,
  })
  ugmSnapshot: number;

  @ApiProperty({
    description: 'Event notes',
    example: 'Pastoreo en potrero norte...',
    nullable: true,
  })
  notes: string | null;
}

export class ActiveAlertsResponseDto {
  @ApiProperty({
    description: 'List of active grazing events',
    type: [ActiveAlertEventDto],
  })
  events: ActiveAlertEventDto[];

  @ApiProperty({
    description: 'Timestamp when the response was calculated',
    example: '2026-01-27T19:30:00.000Z',
  })
  calculatedAt: string;
}
