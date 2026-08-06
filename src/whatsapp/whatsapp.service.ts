import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
import { welcomeTemplate, WELCOME_BUTTON } from './whatsapp.templates';

@Injectable()
export class WhatsappService {
  constructor(private prisma: PrismaService) {}

  async receiveWebhook(dto: WhatsappWebhookDto) {
    const stored = [];

    for (const entry of dto.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        for (const msg of value?.messages || []) {
          const body = msg.text?.body ?? msg.type ?? `message_${msg.id}`;

          const user = await this.prisma.user.findUnique({
            where: { phone: msg.from },
          });

          if (user) {
            await this.prisma.notification.create({
              data: {
                userId: user.id,
                channel: 'WHATSAPP' as any,
                template: 'incoming_message',
                payload: {
                  from: msg.from,
                  messageBody: body,
                  messageId: msg.id,
                  type: msg.type,
                } as any,
                status: 'DELIVERED' as any,
                sentAt: new Date(),
              },
            });
          }

          const name = value?.contacts?.find((c) => c.wa_id === msg.from)?.profile?.name;
          const replySent = await this.sendWelcomeReply(msg.from, name, value?.metadata?.phone_number_id);

          stored.push({ from: msg.from, messageId: msg.id, userId: user?.id || null, replySent });
        }
      }
    }

    return {
      received: true,
      messages: stored,
    };
  }

  private async sendWelcomeReply(to: string, name?: string, phoneNumberId?: string) {
    const token = process.env.WHATSAPP_API_KEY;
    const numberId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !numberId) return false;

    const res = await fetch(`https://graph.facebook.com/v21.0/${numberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: welcomeTemplate(name || 'there') },
          action: { buttons: [WELCOME_BUTTON] },
        },
      }),
    });

    return res.ok;
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
