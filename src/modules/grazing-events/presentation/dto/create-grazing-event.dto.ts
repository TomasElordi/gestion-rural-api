import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateGrazingEventDto {
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'Herd group ID',
  })
  @IsUUID()
  @IsNotEmpty()
  herdGroupId: string;

  @ApiProperty({
    example: 'b2c3d4e5-6789-01bc-def1-234567890abc',
    description: 'Paddock ID',
  })
  @IsUUID()
  @IsNotEmpty()
  paddockId: string;

  @ApiProperty({
    example: '2024-02-15T08:00:00.000Z',
    description: 'Start date and time of the grazing event',
  })
  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @ApiProperty({
    example: '2024-02-20T17:00:00.000Z',
    description: 'End date and time of the grazing event (optional, null for active events)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiProperty({
    example: 'Pastoreo en potrero norte - rotación de verano',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
