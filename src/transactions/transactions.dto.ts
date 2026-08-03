import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

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

export class TransferDto {
  @ApiProperty({ description: 'Source wallet ID' })
  @IsString()
  fromWalletId: string;

  @ApiProperty({ description: 'Destination wallet ID (for internal transfers)', required: false })
  @IsString()
  @IsOptional()
  toWalletId?: string;

  @ApiProperty({ example: 50000, description: 'Amount in minor units', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Transaction currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 'Rent payment', description: 'Transaction description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  // Counterparty details for external transfers
  @ApiProperty({ description: 'Counterparty name', required: false })
  @IsString()
  @IsOptional()
  counterpartyName?: string;

  @ApiProperty({ description: 'Counterparty account number', required: false })
  @IsString()
  @IsOptional()
  counterpartyAccount?: string;

  @ApiProperty({ description: 'Counterparty bank code', required: false })
  @IsString()
  @IsOptional()
  counterpartyBank?: string;

  @ApiProperty({ description: 'Counterparty country', required: false })
  @IsString()
  @IsOptional()
  counterpartyCountry?: string;
}

export class DepositDto {
  @ApiProperty({ description: 'Destination wallet ID' })
  @IsString()
  walletId: string;

  @ApiProperty({ example: 50000, description: 'Amount in minor units', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Deposit currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 'paystack', description: 'Payment provider code' })
  @IsString()
  provider: string;

  @ApiProperty({ example: 'ref-abc123', description: 'Provider reference', required: false })
  @IsString()
  @IsOptional()
  providerRef?: string;
}

export class WithdrawDto {
  @ApiProperty({ description: 'Source wallet ID' })
  @IsString()
  walletId: string;

  @ApiProperty({ example: 50000, description: 'Amount in minor units', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Withdrawal currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: '044', description: 'Bank code' })
  @IsString()
  bankCode: string;

  @ApiProperty({ example: '0123456789', description: 'Bank account number' })
  @IsString()
  accountNumber: string;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
