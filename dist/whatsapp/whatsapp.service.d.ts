import { PrismaService } from '../prisma/prisma.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
export declare class WhatsappService {
    private prisma;
    constructor(prisma: PrismaService);
    receiveWebhook(dto: WhatsappWebhookDto): Promise<{
        received: boolean;
        from: string;
        messageId: string;
        userId: string;
    }>;
    sendMessage(dto: SendWhatsappMessageDto): Promise<{
        sent: boolean;
        to: string;
        message: string;
        userId: string;
    }>;
    getConversation(phone: string): Promise<{
        phone: string;
        userId: string;
        messages: {
            id: string;
            template: string;
            payload: import("@prisma/client/runtime/client").JsonValue;
            status: import("@prisma/client").$Enums.NotificationStatus;
            sentAt: Date;
            createdAt: Date;
        }[];
    }>;
}
