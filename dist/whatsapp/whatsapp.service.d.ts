import { PrismaService } from '../prisma/prisma.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
export declare class WhatsappService {
    private prisma;
    constructor(prisma: PrismaService);
    receiveWebhook(dto: WhatsappWebhookDto): Promise<{
        received: boolean;
        from: string;
        messageId: string;
        userId: any;
    }>;
    sendMessage(dto: SendWhatsappMessageDto): Promise<{
        sent: boolean;
        to: string;
        message: string;
        userId: any;
    }>;
    getConversation(phone: string): Promise<{
        phone: string;
        userId: any;
        messages: any;
    }>;
}
