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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletsService = class WalletsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMyWallets(userId) {
        return this.prisma.wallet.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async createWallet(userId, dto) {
        const existing = await this.prisma.wallet.findFirst({
            where: { userId, currency: dto.currency },
        });
        if (existing) {
            throw new common_1.ConflictException(`Wallet for ${dto.currency} already exists`);
        }
        return this.prisma.wallet.create({
            data: { userId, currency: dto.currency },
        });
    }
    async getWallet(userId, id) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this wallet');
        return wallet;
    }
    async getStatement(userId, id, query) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this wallet');
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { userId, currency: wallet.currency },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where: { userId, currency: wallet.currency } }),
        ]);
        return {
            wallet,
            transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async freezeWallet(id) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return this.prisma.wallet.update({
            where: { id },
            data: { status: 'FROZEN' },
        });
    }
    async unfreezeWallet(id) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return this.prisma.wallet.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map