import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ComplianceCheckType {
  AML = 'AML',
  PEP = 'PEP',
  SANCTIONS = 'SANCTIONS',
  VELOCITY = 'VELOCITY',
  FRAUD = 'FRAUD',
  BLACKLIST = 'BLACKLIST',
}

export class CreateComplianceCheckDto {
  @ApiProperty({ description: 'User ID to check', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Transaction ID to check', required: false })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ enum: ComplianceCheckType, example: 'AML', description: 'Type of compliance check' })
  @IsEnum(ComplianceCheckType)
  checkType: ComplianceCheckType;
}

export class ScreenNameDto {
  @ApiProperty({ example: 'Tunde', description: 'First name to screen' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Adeyemi', description: 'Last name to screen' })
  @IsString()
  lastName: string;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
