import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        userId: string;
        requiresOtp: boolean;
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    login(dto: LoginDto): Promise<{
        userId: string;
        requiresOtp: boolean;
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        userId: string;
        requiresOtp: boolean;
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    getMe(userId: string): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private issueTokens;
    private generateOtp;
}
