import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum GrazingEventStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  DONE = 'done',
  CANCELED = 'canceled',
}

export class UpdateGrazingEventDto {
  @ApiProperty({
    example: '2024-02-16T09:00:00.000Z',
    description: 'Updated start date and time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startAt?: string;

  @ApiProperty({
    example: '2024-02-21T18:00:00.000Z',
    description: 'Updated end date and time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiProperty({
    enum: GrazingEventStatus,
    example: GrazingEventStatus.DONE,
    description: 'Status of the grazing event',
    required: false,
  })
  @IsEnum(GrazingEventStatus)
  @IsOptional()
  status?: GrazingEventStatus;

  @ApiProperty({
    example: 'Evento finalizado - lote movido a otro potrero',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
