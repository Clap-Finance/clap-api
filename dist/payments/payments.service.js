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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActiveProviders() {
        return this.prisma.paymentProvider.findMany({
            where: { isActive: true },
            orderBy: { priority: 'asc' },
        });
    }
    async createProvider(dto) {
        return this.prisma.paymentProvider.create({
            data: {
                name: dto.name,
                code: dto.code,
                config: dto.config || undefined,
                priority: dto.priority ?? 0,
            },
        });
    }
    async updateProvider(id, dto) {
        const provider = await this.prisma.paymentProvider.findUnique({ where: { id } });
        if (!provider)
            throw new common_1.NotFoundException('Provider not found');
        return this.prisma.paymentProvider.update({
            where: { id },
            data: {
                name: dto.name,
                config: dto.config,
                priority: dto.priority,
                isActive: dto.isActive,
            },
        });
    }
    async initiateTransfer(dto) {
        const provider = await this.prisma.paymentProvider.findUnique({
            where: { code: dto.providerCode },
        });
        if (!provider)
            throw new common_1.NotFoundException('Provider not found');
        if (!provider.isActive)
            throw new common_1.NotFoundException('Provider is not active');
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: dto.transactionId },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        return this.prisma.paymentRequest.create({
            data: {
                providerId: provider.id,
                transactionId: transaction.id,
                providerRef: transaction.reference,
                requestType: 'transfer',
                payload: {
                    amount: transaction.amount.toString(),
                    currency: transaction.currency,
                    reference: transaction.reference,
                },
                status: 'PENDING',
            },
            include: { provider: true },
        });
    }
    async verifyPayment(providerRef) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { reference: providerRef },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found for this provider reference');
        const request = await this.prisma.paymentRequest.findFirst({
            where: { providerRef },
            include: { provider: true },
        });
        return {
            transaction,
            paymentRequest: request,
            status: transaction.status,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map