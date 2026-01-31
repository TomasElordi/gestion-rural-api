import { ApiProperty } from '@nestjs/swagger';
import { GrazingEventStatus } from './update-grazing-event.dto';
import { Decimal } from '@prisma/client/runtime/client';

export class GrazingEventResponseDto {
  @ApiProperty({ example: 'c7e9c8a0-1234-5678-9abc-def012345678' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  farmId: string;

  @ApiProperty({ example: 'b2c3d4e5-6789-01bc-def1-234567890abc' })
  herdGroupId: string;

  @ApiProperty({ example: 'c3d4e5f6-789a-12cd-ef12-34567890abcd' })
  paddockId: string;

  @ApiProperty({
    enum: GrazingEventStatus,
    example: GrazingEventStatus.ACTIVE,
  })
  status: GrazingEventStatus;

  @ApiProperty({ example: '2024-02-15T08:00:00.000Z' })
  startAt: Date;

  @ApiProperty({ example: '2024-02-20T17:00:00.000Z', required: false })
  endAt: Date | null;

  @ApiProperty({
    example: 10.5,
    description: 'UGM snapshot at the time of event creation',
    required: false,
  })
  ugmSnapshot: number | null;

  @ApiProperty({ example: 'Pastoreo en potrero norte', required: false })
  notes: string | null;

  @ApiProperty({
    example: 133.5,
    description: 'Duration in hours (null if event is still active)',
    required: false,
  })
  durationHours: number | null;

  @ApiProperty({
    example: 5.56,
    description: 'Duration in days (null if event is still active)',
    required: false,
  })
  durationDays: number | null;

  @ApiProperty({ example: '2024-02-15T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-20T18:00:00.000Z' })
  updatedAt: Date;

  static fromPrisma(grazingEvent: {
    id: string;
    farmId: string;
    herdGroupId: string;
    paddockId: string;
    status: string;
    startAt: Date;
    endAt: Date | null;
    ugmSnapshot: Decimal | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): GrazingEventResponseDto {
    const durationMs =
      grazingEvent.endAt && grazingEvent.startAt
        ? grazingEvent.endAt.getTime() - grazingEvent.startAt.getTime()
        : null;

    const durationHours = durationMs ? durationMs / (1000 * 60 * 60) : null;
    const durationDays = durationHours ? durationHours / 24 : null;

    return {
      id: grazingEvent.id,
      farmId: grazingEvent.farmId,
      herdGroupId: grazingEvent.herdGroupId,
      paddockId: grazingEvent.paddockId,
      status: grazingEvent.status as GrazingEventStatus,
      startAt: grazingEvent.startAt,
      endAt: grazingEvent.endAt,
      ugmSnapshot: grazingEvent.ugmSnapshot
        ? grazingEvent.ugmSnapshot.toNumber()
        : null,
      notes: grazingEvent.notes,
      durationHours: durationHours ? parseFloat(durationHours.toFixed(2)) : null,
      durationDays: durationDays ? parseFloat(durationDays.toFixed(2)) : null,
      createdAt: grazingEvent.createdAt,
      updatedAt: grazingEvent.updatedAt,
    };
  }
}
