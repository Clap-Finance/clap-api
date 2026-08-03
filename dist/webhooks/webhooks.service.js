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
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WebhooksService = class WebhooksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async receiveWebhook(providerCode, payload, signature) {
        const provider = await this.prisma.paymentProvider.findUnique({
            where: { code: providerCode },
        });
        if (!provider)
            throw new common_1.NotFoundException('Unknown provider');
        const eventType = payload?.event || payload?.type || 'UNKNOWN';
        return this.prisma.webhookEvent.create({
            data: {
                providerId: provider.id,
                eventType,
                signature: signature || null,
                payload: payload,
                status: 'RECEIVED',
            },
        });
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            this.prisma.webhookEvent.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { provider: true },
            }),
            this.prisma.webhookEvent.count(),
        ]);
        return {
            data: events,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const event = await this.prisma.webhookEvent.findUnique({
            where: { id },
            include: { provider: true },
        });
        if (!event)
            throw new common_1.NotFoundException('Webhook event not found');
        return event;
    }
    async replay(id) {
        const event = await this.prisma.webhookEvent.findUnique({
            where: { id },
            include: { provider: true },
        });
        if (!event)
            throw new common_1.NotFoundException('Webhook event not found');
        return this.prisma.webhookEvent.update({
            where: { id },
            data: {
                status: 'RECEIVED',
                attempts: 0,
                errorMessage: null,
                processedAt: null,
            },
        });
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map