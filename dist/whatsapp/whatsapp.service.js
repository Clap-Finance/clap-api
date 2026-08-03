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
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WhatsappService = class WhatsappService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async receiveWebhook(dto) {
        const user = await this.prisma.user.findUnique({ where: { phone: dto.from } });
        if (user) {
            await this.prisma.notification.create({
                data: {
                    userId: user.id,
                    channel: 'WHATSAPP',
                    template: 'incoming_message',
                    payload: {
                        from: dto.from,
                        messageBody: dto.messageBody,
                        messageId: dto.messageId,
                    },
                    status: 'DELIVERED',
                    sentAt: new Date(),
                },
            });
        }
        return {
            received: true,
            from: dto.from,
            messageId: dto.messageId,
            userId: user?.id || null,
        };
    }
    async sendMessage(dto) {
        const user = await this.prisma.user.findUnique({ where: { phone: dto.to } });
        if (user) {
            await this.prisma.notification.create({
                data: {
                    userId: user.id,
                    channel: 'WHATSAPP',
                    template: 'outgoing_message',
                    payload: {
                        to: dto.to,
                        message: dto.message,
                    },
                    status: 'SENT',
                    sentAt: new Date(),
                },
            });
        }
        return {
            sent: true,
            to: dto.to,
            message: dto.message,
            userId: user?.id || null,
        };
    }
    async getConversation(phone) {
        const user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user)
            throw new common_1.NotFoundException('User not found for this phone number');
        const notifications = await this.prisma.notification.findMany({
            where: {
                userId: user.id,
                channel: 'WHATSAPP',
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            phone,
            userId: user.id,
            messages: notifications.map((n) => ({
                id: n.id,
                template: n.template,
                payload: n.payload,
                status: n.status,
                sentAt: n.sentAt,
                createdAt: n.createdAt,
            })),
        };
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map