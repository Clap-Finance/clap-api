import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';

@Injectable()
export class WhatsappService {
  constructor(private prisma: PrismaService) {}

  async receiveWebhook(dto: WhatsappWebhookDto) {
    // Store the incoming message as a notification for the user (if found by phone)
    const user = await this.prisma.user.findUnique({ where: { phone: dto.from } });

    if (user) {
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          channel: 'WHATSAPP' as any,
          template: 'incoming_message',
          payload: {
            from: dto.from,
            messageBody: dto.messageBody,
            messageId: dto.messageId,
          } as any,
          status: 'DELIVERED' as any,
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

  async sendMessage(dto: SendWhatsappMessageDto) {
    // In a real implementation, this would call the WhatsApp Business API
    // For now, store the outgoing message as a notification if the user exists
    const user = await this.prisma.user.findUnique({ where: { phone: dto.to } });

    if (user) {
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          channel: 'WHATSAPP' as any,
          template: 'outgoing_message',
          payload: {
            to: dto.to,
            message: dto.message,
          } as any,
          status: 'SENT' as any,
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

  async getConversation(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new NotFoundException('User not found for this phone number');

    const notifications = await this.prisma.notification.findMany({
      where: {
        userId: user.id,
        channel: 'WHATSAPP' as any,
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
}
