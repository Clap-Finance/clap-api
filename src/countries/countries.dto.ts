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

export class CreateCountryDto {
  @ApiProperty({ example: 'NG', description: 'Unique ISO country code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Currency, example: 'NGN', description: 'Country\'s primary currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 'West Africa', description: 'Geographic region', required: false })
  @IsString()
  @IsOptional()
  region?: string;
}
