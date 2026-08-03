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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transfer(userId, dto) {
        const fromWallet = await this.prisma.wallet.findUnique({ where: { id: dto.fromWalletId } });
        if (!fromWallet)
            throw new common_1.NotFoundException('Source wallet not found');
        if (fromWallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to source wallet');
        if (fromWallet.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Source wallet is not active');
        if (fromWallet.availableBalance < BigInt(dto.amount)) {
            throw new common_1.BadRequestException('Insufficient available balance');
        }
        const isInternal = !!dto.toWalletId;
        let toWallet = null;
        if (isInternal) {
            toWallet = await this.prisma.wallet.findUnique({ where: { id: dto.toWalletId } });
            if (!toWallet)
                throw new common_1.NotFoundException('Destination wallet not found');
            if (toWallet.status !== 'ACTIVE')
                throw new common_1.BadRequestException('Destination wallet is not active');
        }
        const reference = `TXN-${(0, crypto_1.randomUUID)()}`;
        const type = isInternal ? 'INTERNAL_TRANSFER' : 'TRANSFER';
        const direction = 'DEBIT';
        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: fromWallet.id },
                data: {
                    balance: { decrement: BigInt(dto.amount) },
                    availableBalance: { decrement: BigInt(dto.amount) },
                },
            });
            if (isInternal && toWallet) {
                await tx.wallet.update({
                    where: { id: toWallet.id },
                    data: {
                        balance: { increment: BigInt(dto.amount) },
                        availableBalance: { increment: BigInt(dto.amount) },
                    },
                });
            }
            return tx.transaction.create({
                data: {
                    reference,
                    userId,
                    type: type,
                    status: 'COMPLETED',
                    direction,
                    amount: BigInt(dto.amount),
                    currency: dto.currency,
                    description: dto.description || null,
                    counterpartyName: dto.counterpartyName || null,
                    counterpartyAccount: dto.counterpartyAccount || null,
                    counterpartyBank: dto.counterpartyBank || null,
                    counterpartyCountry: dto.counterpartyCountry || null,
                    completedAt: new Date(),
                },
            });
        });
    }
    async deposit(userId, dto) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: dto.walletId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this wallet');
        if (wallet.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Wallet is not active');
        const reference = `TXN-${(0, crypto_1.randomUUID)()}`;
        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { increment: BigInt(dto.amount) },
                    availableBalance: { increment: BigInt(dto.amount) },
                },
            });
            return tx.transaction.create({
                data: {
                    reference,
                    userId,
                    type: 'DEPOSIT',
                    status: 'COMPLETED',
                    direction: 'CREDIT',
                    amount: BigInt(dto.amount),
                    currency: dto.currency,
                    provider: dto.provider,
                    providerRef: dto.providerRef || null,
                    completedAt: new Date(),
                },
            });
        });
    }
    async withdraw(userId, dto) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: dto.walletId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this wallet');
        if (wallet.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Wallet is not active');
        if (wallet.availableBalance < BigInt(dto.amount)) {
            throw new common_1.BadRequestException('Insufficient available balance');
        }
        const reference = `TXN-${(0, crypto_1.randomUUID)()}`;
        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: BigInt(dto.amount) },
                    availableBalance: { decrement: BigInt(dto.amount) },
                },
            });
            return tx.transaction.create({
                data: {
                    reference,
                    userId,
                    type: 'WITHDRAWAL',
                    status: 'PENDING',
                    direction: 'DEBIT',
                    amount: BigInt(dto.amount),
                    currency: dto.currency,
                    counterpartyAccount: dto.accountNumber,
                    counterpartyBank: dto.bankCode,
                },
            });
        });
    }
    async findAll(userId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where: { userId } }),
        ]);
        return {
            data: transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getTransaction(userId, id) {
        const transaction = await this.prisma.transaction.findUnique({ where: { id } });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this transaction');
        return transaction;
    }
    async cancel(userId, id) {
        const transaction = await this.prisma.transaction.findUnique({ where: { id } });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this transaction');
        if (transaction.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending transactions can be cancelled');
        }
        if (transaction.direction === 'DEBIT') {
            const wallet = await this.prisma.wallet.findFirst({
                where: { userId, currency: transaction.currency },
            });
            if (wallet) {
                await this.prisma.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        balance: { increment: transaction.amount },
                        availableBalance: { increment: transaction.amount },
                    },
                });
            }
        }
        return this.prisma.transaction.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map