import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Matches,
  MinLength,
} from 'class-validator';

export enum AccountType {
  DYNAMIC = 0,
  STATIC = 1,
}

export class CreateVirtualAccountDto {
  @ApiProperty({ example: 'EZEKIEL' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'FADIPE' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 22142668052, description: 'Must be exactly 11 digits' })
  @IsNumber()
  bvn: number;

  @ApiPropertyOptional({ example: '22278019171' })
  @IsOptional()
  @IsString()
  nin?: string;

  @ApiPropertyOptional({ example: 'Josad' })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ example: 'Trading' })
  @IsOptional()
  @IsString()
  natureOfBusiness?: string;

  @ApiPropertyOptional({ example: '12 Lagos Street' })
  @IsOptional()
  @IsString()
  physicalAddress?: string;

  @ApiProperty({ example: 'jos@gmail.com' })
  @IsString()
  emailAddress: string;

  @ApiProperty({ example: '08032111222' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '12-Jul-1987', description: 'Format: dd-MMM-yyyy' })
  @IsString()
  @Matches(/^\d{2}-[A-Za-z]{3}-\d{4}$/, { message: 'DOB must be in dd-MMM-yyyy format' })
  dob: string;

  @ApiProperty({ enum: AccountType, description: '0 = dynamic, 1 = static' })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiPropertyOptional({ description: 'Required when creating a dynamic account' })
  @IsOptional()
  @IsString()
  staticAccountNo?: string;
}

export class CreateVirtualAccountResponseDto {
  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: '00' })
  code: string;

  @ApiProperty({ example: '4130000028' })
  accountNo: string;
}
