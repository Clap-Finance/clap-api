export declare class RegisterDto {
    phone: string;
    email?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    deviceId?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
    deviceId?: string;
}
export declare class VerifyOtpDto {
    phone: string;
    code: string;
    purpose: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class LogoutDto {
    refreshToken: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: string;
    requiresOtp: boolean;
}
export declare class OtpResponseDto {
    sent: boolean;
    phone: string;
    expiresIn: number;
}
