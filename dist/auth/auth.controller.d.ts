import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, LogoutDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(dto: LogoutDto): Promise<{
        success: boolean;
    }>;
    getMe(req: any): Promise<{
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
}
