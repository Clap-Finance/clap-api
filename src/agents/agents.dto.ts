import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

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

export class CreateAgentDto {
  @ApiProperty({ description: 'User ID to designate as agent' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Tunde Cash Point', description: 'Business name' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'Lagos Island, Nigeria', description: 'Business location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 0.02, description: 'Commission rate (e.g. 0.02 = 2%)' })
  @IsNumber()
  @Min(0)
  commissionRate: number;

  @ApiProperty({ example: 5000000, description: 'Daily transaction limit in minor units' })
  @IsNumber()
  @Min(0)
  dailyLimit: number;
}

export class UpdateAgentDto {
  @ApiProperty({ description: 'Business name', required: false })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ description: 'Business location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Commission rate', required: false })
  @IsNumber()
  @IsOptional()
  commissionRate?: number;

  @ApiProperty({ description: 'Daily transaction limit in minor units', required: false })
  @IsNumber()
  @IsOptional()
  dailyLimit?: number;

  @ApiProperty({ description: 'Agent status', required: false, enum: ['ACTIVE', 'SUSPENDED', 'TERMINATED'] })
  @IsString()
  @IsOptional()
  status?: string;
}

export class CashInOutDto {
  @ApiProperty({ description: 'User ID of the customer' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 50000, description: 'Amount in minor units', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Currency' })
  @IsString()
  currency: Currency;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
