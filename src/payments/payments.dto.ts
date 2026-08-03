import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsJSON, IsObject } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({ example: 'Paystack', description: 'Provider display name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'paystack', description: 'Unique provider code' })
  @IsString()
  code: string;

  @ApiProperty({ example: { apiKey: 'sk_***', secret: '***' }, description: 'Provider configuration (JSON)', required: false })
  @IsOptional()
  @IsObject()
  config?: any;

  @ApiProperty({ example: 1, description: 'Priority (lower = higher priority)', required: false })
  @IsInt()
  @IsOptional()
  priority?: number;
}

export class UpdateProviderDto {
  @ApiProperty({ description: 'Provider display name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Provider configuration (JSON)', required: false })
  @IsOptional()
  @IsObject()
  config?: any;

  @ApiProperty({ description: 'Priority (lower = higher priority)', required: false })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Whether the provider is active', required: false })
  @IsOptional()
  isActive?: boolean;
}

export class ProviderTransferDto {
  @ApiProperty({ example: 'paystack', description: 'Provider code to use for the transfer' })
  @IsString()
  providerCode: string;

  @ApiProperty({ description: 'Transaction ID to process via the provider' })
  @IsString()
  transactionId: string;
}
