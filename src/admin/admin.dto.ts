import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  USER = 'USER',
  AGENT = 'AGENT',
  SUPPORT = 'SUPPORT',
  COMPLIANCE = 'COMPLIANCE',
  FINANCE = 'FINANCE',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class ChangeRoleDto {
  @ApiProperty({ enum: Role, example: 'ADMIN', description: 'New role for the user' })
  @IsEnum(Role)
  role: Role;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
