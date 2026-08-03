"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ phone: dto.phone }, ...(dto.email ? [{ email: dto.email }] : [])] },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this phone or email already exists');
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
            data: [{ userId: user.id, currency: 'NGN' }],
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await argon2.verify(user.passwordHash, dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async verifyOtp(dto) {
        const otp = await this.prisma.otpCode.findFirst({
            where: { phone: dto.phone, code: dto.code, purpose: dto.purpose, consumed: false },
            orderBy: { createdAt: 'desc' },
        });
        if (!otp || otp.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        if (otp.attempts >= 5) {
            throw new common_1.UnauthorizedException('Too many attempts');
        }
        await this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
        const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (user.status === 'PENDING' && dto.purpose === 'login') {
            await this.prisma.user.update({ where: { id: user.id }, data: { status: 'ACTIVE' } });
        }
        const tokens = await this.issueTokens(user.id, undefined);
        return { ...tokens, userId: user.id, requiresOtp: false };
    }
    async refresh(dto) {
        const session = await this.prisma.session.findUnique({
            where: { refreshToken: dto.refreshToken },
            include: { user: true },
        });
        if (!session || session.revokedAt || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.prisma.session.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
        });
        return this.issueTokens(session.userId, undefined);
    }
    async logout(refreshToken) {
        const session = await this.prisma.session.findUnique({ where: { refreshToken } });
        if (session) {
            await this.prisma.session.update({
                where: { id: session.id },
                data: { revokedAt: new Date() },
            });
        }
        return { success: true };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const { passwordHash, ...result } = user;
        return result;
    }
    async issueTokens(userId, deviceId) {
        const payload = { sub: userId };
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
        const refreshToken = (0, crypto_1.randomUUID)();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await this.prisma.session.create({
            data: { userId, refreshToken, expiresAt, deviceInfo: deviceId || null },
        });
        return { accessToken, refreshToken, expiresIn: 900 };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map