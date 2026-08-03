import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum KycDocumentType {
  BVN = 'BVN',
  NIN = 'NIN',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  SELFIE = 'SELFIE',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
}

export enum Tier {
  TIER_0 = 'TIER_0',
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

export class UploadKycDocumentDto {
  @ApiProperty({ enum: KycDocumentType, example: 'BVN', description: 'Type of KYC document' })
  @IsEnum(KycDocumentType)
  documentType: KycDocumentType;

  @ApiProperty({ example: '12345678901', description: 'Document number (e.g. BVN, NIN)', required: false })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @ApiProperty({ example: 'https://storage.supabase.co/kyc/bvn-abc123.pdf', description: 'Storage URL for the uploaded document' })
  @IsString()
  storageUrl: string;
}

export class SubmitKycVerificationDto {
  @ApiProperty({ enum: Tier, example: 'TIER_1', description: 'KYC tier to apply for' })
  @IsEnum(Tier)
  tier: Tier;

  @ApiProperty({ example: '12345678901', description: 'Bank Verification Number', required: false })
  @IsString()
  @IsOptional()
  bvn?: string;

  @ApiProperty({ example: '12345678901', description: 'National Identification Number', required: false })
  @IsString()
  @IsOptional()
  nin?: string;

  @ApiProperty({ example: 'https://storage.supabase.co/kyc/selfie-abc123.jpg', description: 'Selfie photo URL', required: false })
  @IsString()
  @IsOptional()
  selfieUrl?: string;

  @ApiProperty({ example: 'https://storage.supabase.co/kyc/poa-abc123.pdf', description: 'Proof of address document URL', required: false })
  @IsString()
  @IsOptional()
  proofOfAddressUrl?: string;
}

export class RejectKycDto {
  @ApiProperty({ example: 'Document image is blurry and unreadable', description: 'Reason for rejection' })
  @IsString()
  reason: string;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
