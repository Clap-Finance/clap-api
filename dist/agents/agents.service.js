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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.prisma.agent.findUnique({ where: { userId: dto.userId } });
        if (existing)
            throw new common_1.BadRequestException('User is already an agent');
        return this.prisma.agent.create({
            data: {
                userId: dto.userId,
                code: `AGT-${(0, crypto_1.randomUUID)().slice(0, 8).toUpperCase()}`,
                businessName: dto.businessName,
                location: dto.location || null,
                commissionRate: dto.commissionRate,
                dailyLimit: BigInt(dto.dailyLimit),
            },
        });
    }
    async findAll() {
        return this.prisma.agent.findMany({
            include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
        });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return agent;
    }
    async update(id, dto) {
        const agent = await this.prisma.agent.findUnique({ where: { id } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        const data = {};
        if (dto.businessName !== undefined)
            data.businessName = dto.businessName;
        if (dto.location !== undefined)
            data.location = dto.location;
        if (dto.commissionRate !== undefined)
            data.commissionRate = dto.commissionRate;
        if (dto.dailyLimit !== undefined)
            data.dailyLimit = BigInt(dto.dailyLimit);
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.agent.update({ where: { id }, data });
    }
    async findAgentTransactions(id, query) {
        const agent = await this.prisma.agent.findUnique({ where: { id } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.prisma.agentTransaction.findMany({
                where: { agentId: id },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.agentTransaction.count({ where: { agentId: id } }),
        ]);
        return {
            data: transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async cashIn(agentId, agentUserId, dto) {
        const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        if (agent.userId !== agentUserId)
            throw new common_1.ForbiddenException('You are not this agent');
        if (agent.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Agent is not active');
        const commission = BigInt(Math.floor(Number(dto.amount) * Number(agent.commissionRate)));
        return this.prisma.$transaction(async (tx) => {
            const customerWallet = await tx.wallet.findFirst({
                where: { userId: dto.userId, currency: dto.currency },
            });
            if (!customerWallet)
                throw new common_1.NotFoundException('Customer wallet not found');
            await tx.wallet.update({
                where: { id: customerWallet.id },
                data: {
                    balance: { increment: BigInt(dto.amount) },
                    availableBalance: { increment: BigInt(dto.amount) },
                },
            });
            await tx.agent.update({
                where: { id: agentId },
                data: {
                    cashBalance: { increment: BigInt(dto.amount) },
                },
            });
            return tx.agentTransaction.create({
                data: {
                    agentId,
                    userId: dto.userId,
                    type: 'CASH_IN',
                    amount: BigInt(dto.amount),
                    currency: dto.currency,
                    commission,
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        });
    }
    async cashOut(agentId, agentUserId, dto) {
        const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        if (agent.userId !== agentUserId)
            throw new common_1.ForbiddenException('You are not this agent');
        if (agent.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Agent is not active');
        const commission = BigInt(Math.floor(Number(dto.amount) * Number(agent.commissionRate)));
        return this.prisma.$transaction(async (tx) => {
            const customerWallet = await tx.wallet.findFirst({
                where: { userId: dto.userId, currency: dto.currency },
            });
            if (!customerWallet)
                throw new common_1.NotFoundException('Customer wallet not found');
            if (customerWallet.availableBalance < BigInt(dto.amount)) {
                throw new common_1.BadRequestException('Customer has insufficient balance');
            }
            await tx.wallet.update({
                where: { id: customerWallet.id },
                data: {
                    balance: { decrement: BigInt(dto.amount) },
                    availableBalance: { decrement: BigInt(dto.amount) },
                },
            });
            await tx.agent.update({
                where: { id: agentId },
                data: {
                    cashBalance: { decrement: BigInt(dto.amount) },
                },
            });
            return tx.agentTransaction.create({
                data: {
                    agentId,
                    userId: dto.userId,
                    type: 'CASH_OUT',
                    amount: BigInt(dto.amount),
                    currency: dto.currency,
                    commission,
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        });
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map