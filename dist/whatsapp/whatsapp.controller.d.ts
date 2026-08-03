import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    receiveWebhook(dto: WhatsappWebhookDto): Promise<{
        received: boolean;
        from: string;
        messageId: string;
        userId: any;
    }>;
    send(dto: SendWhatsappMessageDto): Promise<{
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
