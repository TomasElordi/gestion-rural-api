import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'demo@gestionrural.com',
    description: 'User email (unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (min 8 chars)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    example: 'Tomi',
    description: 'Display name',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'Estancia Demo',
    description:
      'Organization name to create for this user (if omitted: "Mi Organización")',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;
}
