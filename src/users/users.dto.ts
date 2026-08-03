import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Tunde', description: 'First name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Adeyemi', description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country of residence', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: '1990-01-15', description: 'Date of birth (ISO 8601)', required: false })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({ example: '12 Marina Road, Lagos', description: 'Residential address', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
