import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  GHS = 'GHS',
  KES = 'KES',
  ZAR = 'ZAR',
  XOF = 'XOF',
}

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  FX = 'FX',
  AGENT_PAYMENT = 'AGENT_PAYMENT',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  INTERNATIONAL_TRANSFER = 'INTERNATIONAL_TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}

export enum Tier {
  TIER_0 = 'TIER_0',
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

export enum Role {
  USER = 'USER',
  AGENT = 'AGENT',
  SUPPORT = 'SUPPORT',
  COMPLIANCE = 'COMPLIANCE',
  FINANCE = 'FINANCE',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, description: 'Items per page' })
  @IsOptional()
  limit?: number = 20;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  data: T[];

  @ApiProperty({ description: 'Total count of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
