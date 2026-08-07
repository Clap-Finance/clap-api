import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
import { welcomeTemplate, WELCOME_BUTTON } from './whatsapp.templates';

@Injectable()
export class WhatsappService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

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
    const templateName = process.env.WHATSAPP_WELCOME_TEMPLATE || 'get_started_flow';

    if (!token || !numberId) return false;

    const flowToken = randomUUID();
    await this.prisma.whatsappFlowSession.create({
      data: { flowToken, waId: to, flowName: 'get_started' },
    });

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
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: name || 'there' }],
            },
            {
              type: 'button',
              sub_type: 'flow',
              index: '0',
              parameters: [
                {
                  type: 'flow',
                  flow_name: 'get_started',
                  flow_token: flowToken,
                  flow_cta: 'Get Started',
                },
              ],
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      await this.prisma.whatsappFlowSession.delete({ where: { flowToken } }).catch(() => {});
      return this.sendWelcomeFallback(to, name, numberId, token);
    }

    return true;
  }

  private async sendWelcomeFallback(to: string, name?: string, numberId?: string, token?: string) {
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

  async handleFlowSubmission(flowName: string, body: Record<string, unknown>) {
    const flowToken = (body.flow_token as string) || '';
    const data = (body.data as Record<string, unknown>) || {};

    const session = await this.prisma.whatsappFlowSession.findUnique({ where: { flowToken } });
    if (!session) return { success: false, error: { message: 'Invalid or expired session' } };

    const waId = session.waId;
    const phone = waId.startsWith('+') ? waId : `+${waId}`;

    try {
      await this.authService.register({
        phone,
        email: (data.email as string) || undefined,
        password: data.password as string,
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        country: data.country as string,
      });

      await this.prisma.whatsappFlowSession.delete({ where: { flowToken } });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: { message: err?.response?.message || 'Signup failed, please try again later' },
      };
    }
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
