import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

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

export class CreateBeneficiaryDto {
  @ApiProperty({ example: 'Tunde Adeyemi', description: 'Beneficiary full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '0123456789', description: 'Beneficiary account number' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: '044', description: 'Bank code', required: false })
  @IsString()
  @IsOptional()
  bankCode?: string;

  @ApiProperty({ example: 'Access Bank', description: 'Bank name', required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ example: 'Nigeria', description: 'Beneficiary country' })
  @IsString()
  country: string;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Beneficiary account currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 'My Brother', description: 'Nickname for the beneficiary', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;
}

export class UpdateBeneficiaryDto {
  @ApiProperty({ description: 'Beneficiary full name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Beneficiary account number', required: false })
  @IsString()
  @IsOptional()
  accountNumber?: string;

  @ApiProperty({ description: 'Bank code', required: false })
  @IsString()
  @IsOptional()
  bankCode?: string;

  @ApiProperty({ description: 'Bank name', required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ description: 'Beneficiary country', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ enum: Currency, description: 'Beneficiary account currency', required: false })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ description: 'Nickname for the beneficiary', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;
}
