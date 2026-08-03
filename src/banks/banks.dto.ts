import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

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

export class CreateBankDto {
  @ApiProperty({ example: '044', description: 'Unique bank code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Access Bank', description: 'Bank name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country where the bank operates' })
  @IsString()
  country: string;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Bank\'s primary currency' })
  @IsEnum(Currency)
  currency: Currency;
}

export class UpdateBankDto {
  @ApiProperty({ description: 'Bank name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Country where the bank operates', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ enum: Currency, description: 'Bank\'s primary currency', required: false })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ description: 'Whether the bank is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
