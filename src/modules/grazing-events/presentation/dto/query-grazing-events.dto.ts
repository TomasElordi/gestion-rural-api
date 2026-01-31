import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { GrazingEventStatus } from './update-grazing-event.dto';

export class QueryGrazingEventsDto {
  @ApiProperty({
    example: '2024-02-01',
    description: 'Start date for filtering (YYYY-MM-DD)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    example: '2024-02-29',
    description: 'End date for filtering (YYYY-MM-DD)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiProperty({
    enum: GrazingEventStatus,
    example: GrazingEventStatus.ACTIVE,
    description: 'Filter by status',
    required: false,
  })
  @IsEnum(GrazingEventStatus)
  @IsOptional()
  status?: GrazingEventStatus;
}
