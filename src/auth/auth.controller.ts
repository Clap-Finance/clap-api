import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  RefreshTokenDto,
  LogoutDto,
  AuthResponseDto,
  OtpResponseDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with phone number and password. Sends OTP for verification.' })
  @ApiResponse({ status: 201, type: AuthResponseDto, description: 'Registration successful — OTP sent for verification' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Authenticates a user with phone and password. Sends OTP for verification.' })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Login successful — OTP sent' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP', description: 'Verifies the one-time passcode sent to the user\'s phone. Activates the account on first login.' })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'OTP verified — access token issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Exchanges a valid refresh token for a new access token pair.' })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'New token pair issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout', description: 'Revokes the current session and refresh token.' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user\'s profile information.' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.sub);
  }
}
