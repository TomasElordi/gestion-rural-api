import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Start date (ISO 8601 format, inclusive)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date (ISO 8601 format, inclusive)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
