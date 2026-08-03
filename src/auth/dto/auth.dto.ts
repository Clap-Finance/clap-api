import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: '+2348012345678', description: 'Phone number in international format' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password (min 8 characters)', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Tunde', description: 'First name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Adeyemi', description: 'Last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country of residence' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'device-uuid-123', description: 'Device identifier' })
  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class LoginDto {
  @ApiProperty({ example: '+2348012345678', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'device-uuid-123', description: 'Device identifier' })
  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+2348012345678', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'login', description: 'Purpose of OTP', enum: ['login', 'transfer', 'kyc'] })
  @IsString()
  purpose: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class LogoutDto {
  @ApiProperty({ description: 'Refresh token to revoke' })
  @IsString()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token for token renewal' })
  refreshToken: string;

  @ApiProperty({ description: 'Token expiration in seconds' })
  expiresIn: number;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Whether OTP verification is required' })
  requiresOtp: boolean;
}

export class OtpResponseDto {
  @ApiProperty({ description: 'Whether OTP was sent successfully' })
  sent: boolean;

  @ApiProperty({ description: 'Phone number the OTP was sent to' })
  phone: string;

  @ApiProperty({ description: 'OTP expiration in seconds' })
  expiresIn: number;
}
