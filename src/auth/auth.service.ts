import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: dto.phone }, ...(dto.email ? [{ email: dto.email }] : [])] },
    });
    if (existing) {
      throw new ConflictException('User with this phone or email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        country: dto.country,
      },
    });

    await this.prisma.wallet.createMany({
      data: [{ userId: user.id, currency: 'NGN' as any }],
    });

    const otpCode = this.generateOtp();
    await this.prisma.otpCode.create({
      data: {
        phone: dto.phone,
        code: otpCode,
        purpose: 'login',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const tokens = await this.issueTokens(user.id, dto.deviceId);
    return { ...tokens, userId: user.id, requiresOtp: true };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const otpCode = this.generateOtp();
    await this.prisma.otpCode.create({
      data: {
        phone: dto.phone,
        code: otpCode,
        purpose: 'login',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const tokens = await this.issueTokens(user.id, dto.deviceId);
    return { ...tokens, userId: user.id, requiresOtp: true };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otpCode.findFirst({
      where: { phone: dto.phone, code: dto.code, purpose: dto.purpose, consumed: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    if (otp.attempts >= 5) {
      throw new UnauthorizedException('Too many attempts');
    }

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.status === 'PENDING' && dto.purpose === 'login') {
      await this.prisma.user.update({ where: { id: user.id }, data: { status: 'ACTIVE' as any } });
    }

    const tokens = await this.issueTokens(user.id, undefined);
    return { ...tokens, userId: user.id, requiresOtp: false };
  }

  async refresh(dto: RefreshTokenDto) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: dto.refreshToken },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(session.userId, undefined);
  }

  async logout(refreshToken: string) {
    const session = await this.prisma.session.findUnique({ where: { refreshToken } });
    if (session) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }

  private async issueTokens(userId: string, deviceId?: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: { userId, refreshToken, expiresAt, deviceInfo: deviceId || null },
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
