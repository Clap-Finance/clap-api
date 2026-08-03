import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        userId: any;
        requiresOtp: boolean;
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    login(dto: LoginDto): Promise<{
        userId: any;
        requiresOtp: boolean;
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresIn: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        userId: any;
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
    getMe(userId: string): Promise<any>;
    private issueTokens;
    private generateOtp;
}
