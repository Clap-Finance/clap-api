import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    receiveWebhook(dto: WhatsappWebhookDto): Promise<{
        received: boolean;
        from: string;
        messageId: string;
        userId: string;
    }>;
    send(dto: SendWhatsappMessageDto): Promise<{
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
