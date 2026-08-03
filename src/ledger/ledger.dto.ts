import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum LedgerAccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

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

export class CreateLedgerAccountDto {
  @ApiProperty({ example: 'WALLET_NGN', description: 'Unique account code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'NGN Wallet Liability', description: 'Account name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: LedgerAccountType, example: 'LIABILITY', description: 'Account type' })
  @IsEnum(LedgerAccountType)
  type: LedgerAccountType;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Account currency', required: false })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;
}

export class LedgerEntryDto {
  @ApiProperty({ description: 'Ledger account ID' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 50000, description: 'Debit amount in minor units' })
  @IsNumber()
  debit: number;

  @ApiProperty({ example: 0, description: 'Credit amount in minor units' })
  @IsNumber()
  credit: number;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Entry currency' })
  @IsEnum(Currency)
  currency: Currency;
}

export class CreateJournalDto {
  @ApiProperty({ example: 'TXN-abc123', description: 'Unique reference for the journal' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 'Transfer from NGN wallet to USD wallet', description: 'Journal description' })
  @IsString()
  description: string;

  @ApiProperty({ type: [LedgerEntryDto], description: 'Ledger entries (must balance: total debits = total credits)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LedgerEntryDto)
  entries: LedgerEntryDto[];
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
