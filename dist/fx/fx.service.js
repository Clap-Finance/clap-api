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
exports.FxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let FxService = class FxService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRates() {
        return this.prisma.exchangeRate.findMany({
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getRate(base, quote) {
        const rate = await this.prisma.exchangeRate.findUnique({
            where: {
                baseCurrency_quoteCurrency: {
                    baseCurrency: base,
                    quoteCurrency: quote,
                },
            },
        });
        if (!rate)
            throw new common_1.NotFoundException(`No rate found for ${base}/${quote}`);
        return rate;
    }
    async createQuote(userId, dto) {
        if (dto.fromCurrency === dto.toCurrency) {
            throw new common_1.BadRequestException('fromCurrency and toCurrency must be different');
        }
        const rate = await this.prisma.exchangeRate.findUnique({
            where: {
                baseCurrency_quoteCurrency: {
                    baseCurrency: dto.fromCurrency,
                    quoteCurrency: dto.toCurrency,
                },
            },
        });
        if (!rate) {
            throw new common_1.NotFoundException(`No exchange rate found for ${dto.fromCurrency}/${dto.toCurrency}`);
        }
        const expiresAt = new Date(Date.now() + 30 * 1000);
        const convertedAmount = BigInt(Math.floor(Number(dto.amount) * Number(rate.rate)));
        return this.prisma.fxQuote.create({
            data: {
                userId,
                fromCurrency: dto.fromCurrency,
                toCurrency: dto.toCurrency,
                amount: BigInt(dto.amount),
                rate: rate.rate,
                fee: BigInt(0),
                expiresAt,
                status: 'OPEN',
            },
        });
    }
    async convert(userId, dto) {
        const quote = await this.prisma.fxQuote.findUnique({ where: { id: dto.quoteId } });
        if (!quote)
            throw new common_1.NotFoundException('Quote not found');
        if (quote.status !== 'OPEN')
            throw new common_1.BadRequestException('Quote is no longer open');
        if (quote.expiresAt < new Date()) {
            await this.prisma.fxQuote.update({
                where: { id: quote.id },
                data: { status: 'EXPIRED' },
            });
            throw new common_1.BadRequestException('Quote has expired');
        }
        const fromWallet = await this.prisma.wallet.findUnique({ where: { id: dto.fromWalletId } });
        if (!fromWallet)
            throw new common_1.NotFoundException('Source wallet not found');
        if (fromWallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to source wallet');
        if (fromWallet.currency !== quote.fromCurrency) {
            throw new common_1.BadRequestException('Source wallet currency does not match quote');
        }
        if (fromWallet.availableBalance < quote.amount) {
            throw new common_1.BadRequestException('Insufficient available balance');
        }
        const toWallet = await this.prisma.wallet.findUnique({ where: { id: dto.toWalletId } });
        if (!toWallet)
            throw new common_1.NotFoundException('Destination wallet not found');
        if (toWallet.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to destination wallet');
        if (toWallet.currency !== quote.toCurrency) {
            throw new common_1.BadRequestException('Destination wallet currency does not match quote');
        }
        const convertedAmount = BigInt(Math.floor(Number(quote.amount) * Number(quote.rate)));
        const reference = `FX-${(0, crypto_1.randomUUID)()}`;
        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: fromWallet.id },
                data: {
                    balance: { decrement: quote.amount },
                    availableBalance: { decrement: quote.amount },
                },
            });
            await tx.wallet.update({
                where: { id: toWallet.id },
                data: {
                    balance: { increment: convertedAmount },
                    availableBalance: { increment: convertedAmount },
                },
            });
            await tx.fxQuote.update({
                where: { id: quote.id },
                data: { status: 'USED' },
            });
            return tx.transaction.create({
                data: {
                    reference,
                    userId,
                    type: 'FX',
                    status: 'COMPLETED',
                    direction: 'DEBIT',
                    amount: quote.amount,
                    currency: quote.fromCurrency,
                    fromCurrency: quote.fromCurrency,
                    toCurrency: quote.toCurrency,
                    exchangeRate: quote.rate,
                    completedAt: new Date(),
                },
            });
        });
    }
};
exports.FxService = FxService;
exports.FxService = FxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FxService);
//# sourceMappingURL=fx.service.js.map