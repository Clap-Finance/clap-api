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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalUsers, totalTransactions, transactions] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.transaction.count(),
            this.prisma.transaction.findMany({
                where: { status: 'COMPLETED' },
                select: { amount: true, currency: true },
            }),
        ]);
        const volumeByCurrency = {};
        for (const tx of transactions) {
            const key = tx.currency;
            volumeByCurrency[key] = (volumeByCurrency[key] || BigInt(0)) + tx.amount;
        }
        return {
            totalUsers,
            totalTransactions,
            totalVolume: Object.fromEntries(Object.entries(volumeByCurrency).map(([k, v]) => [k, v.toString()])),
        };
    }
    async findAllUsers(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);
        return {
            data: users.map(({ passwordHash, ...u }) => u),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findAllTransactions(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
            }),
            this.prisma.transaction.count(),
        ]);
        return {
            data: transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findAuditLogs(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
            }),
            this.prisma.auditLog.count(),
        ]);
        return {
            data: logs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async suspendUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { status: 'SUSPENDED' },
        });
    }
    async activateUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
    }
    async changeRole(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map