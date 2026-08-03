import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, Min } from 'class-validator';

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

export class CreateFxQuoteDto {
  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Source currency' })
  @IsEnum(Currency)
  fromCurrency: Currency;

  @ApiProperty({ enum: Currency, example: 'USD', description: 'Destination currency' })
  @IsEnum(Currency)
  toCurrency: Currency;

  @ApiProperty({ example: 50000, description: 'Amount in minor units of the source currency', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;
}

export class FxConvertDto {
  @ApiProperty({ description: 'FX quote ID (must be valid and not expired)' })
  @IsString()
  quoteId: string;

  @ApiProperty({ description: 'Source wallet ID' })
  @IsString()
  fromWalletId: string;

  @ApiProperty({ description: 'Destination wallet ID' })
  @IsString()
  toWalletId: string;
}
