"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KycService = class KycService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadDocument(userId, dto) {
        return this.prisma.kycDocument.create({
            data: {
                userId,
                documentType: dto.documentType,
                documentNumber: dto.documentNumber || null,
                storageUrl: dto.storageUrl,
            },
        });
    }
    async findMyDocuments(userId) {
        return this.prisma.kycDocument.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async submitVerification(userId, dto) {
        const existing = await this.prisma.kycVerification.findUnique({ where: { userId } });
        if (existing && existing.status === 'PENDING') {
            throw new common_1.BadRequestException('You already have a pending KYC verification');
        }
        return this.prisma.kycVerification.create({
            data: {
                userId,
                tier: dto.tier,
                bvn: dto.bvn || null,
                nin: dto.nin || null,
                selfieUrl: dto.selfieUrl || null,
                proofOfAddressUrl: dto.proofOfAddressUrl || null,
                status: 'PENDING',
                submittedAt: new Date(),
            },
        });
    }
    async getStatus(userId) {
        const verification = await this.prisma.kycVerification.findUnique({
            where: { userId },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            tier: user.tier,
            verification,
        };
    }
    async findAllVerifications(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [verifications, total] = await Promise.all([
            this.prisma.kycVerification.findMany({
                skip,
                take: limit,
                orderBy: { submittedAt: 'desc' },
            }),
            this.prisma.kycVerification.count(),
        ]);
        return {
            data: verifications,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async approve(id, reviewerId) {
        const verification = await this.prisma.kycVerification.findUnique({ where: { id } });
        if (!verification)
            throw new common_1.NotFoundException('KYC verification not found');
        if (verification.status !== 'PENDING') {
            throw new common_1.BadRequestException('Verification is not in pending status');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: verification.userId },
                data: { tier: verification.tier },
            });
            return tx.kycVerification.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    reviewedBy: reviewerId,
                    reviewedAt: new Date(),
                },
            });
        });
    }
    async reject(id, dto, reviewerId) {
        const verification = await this.prisma.kycVerification.findUnique({ where: { id } });
        if (!verification)
            throw new common_1.NotFoundException('KYC verification not found');
        if (verification.status !== 'PENDING') {
            throw new common_1.BadRequestException('Verification is not in pending status');
        }
        return this.prisma.kycVerification.update({
            where: { id },
            data: {
                status: 'REJECTED',
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
                notes: dto.reason,
            },
        });
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KycService);
//# sourceMappingURL=kyc.service.js.map