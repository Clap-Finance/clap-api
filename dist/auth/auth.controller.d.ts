import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, LogoutDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(dto: LogoutDto): Promise<{
        success: boolean;
    }>;
    getMe(req: any): Promise<any>;
}
