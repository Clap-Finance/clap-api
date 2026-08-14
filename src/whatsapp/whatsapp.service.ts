import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
import { welcomeTemplate, flowAction } from './whatsapp.templates';
import { decryptFlowRequest, encryptFlowResponse, FlowCryptoError, verifyHubSignature } from './whatsapp.crypto';

export interface FlowEndpointResponse {
  httpStatus: number;
  contentType: string;
  body: string;
}

interface FlowRequest {
  version?: string;
  action?: string;
  screen?: string;
  flow_token?: string;
  data?: Record<string, any>;
}

const ROUTING_MODEL: Record<string, string> = {
  PERSONAL_DETAILS: 'YOUR_ADDRESS',
  YOUR_ADDRESS: 'SET_TRANSACTION_PIN',
};

@Injectable()
export class WhatsappService {
  constructor(private prisma: PrismaService) {}

  async handleFlowEndpointRequest(
    flowName: string,
    rawBody: Buffer | string,
    parsedBody: Record<string, unknown>,
    signature?: string,
  ): Promise<FlowEndpointResponse> {
    const appSecret = process.env.WHATSAPP_APP_SECRET || process.env.APP_SECRET;

    if (appSecret && !verifyHubSignature(rawBody, signature, appSecret)) {
      return this.plain(401, 'Invalid X-Hub-Signature-256');
    }

    const privateKey = process.env.WHATSAPP_PRIVATE_KEY;
    let request: FlowRequest;
    let encrypted = false;
    let aesKey: Buffer | undefined;
    let initialVector: Buffer | undefined;

    if (privateKey) {
      try {
        const decrypted = decryptFlowRequest(parsedBody, privateKey);
        request = decrypted.decryptedBody;
        aesKey = decrypted.aesKey;
        initialVector = decrypted.initialVector;
        encrypted = true;
      } catch (err) {
        if (err instanceof FlowCryptoError) {
          return this.plain(421, err.message);
        }
        throw err;
      }
    } else {
      request = parsedBody as unknown as FlowRequest;
    }

    const respond = (payload: unknown) =>
      encrypted
        ? this.plain(200, encryptFlowResponse(payload, aesKey!, initialVector!))
        : { httpStatus: 200, contentType: 'application/json', body: JSON.stringify(payload) };

    if (request.action === 'ping') {
      return respond({ data: { status: 'active' } });
    }

    if (request.data?.error) {
      return respond({ data: { acknowledged: true } });
    }

    const flowToken = request.flow_token || '';
    const screen = request.screen;
    const data = request.data || {};

    if (request.action === 'INIT' || request.action === 'BACK') {
      return respond({ screen: 'PERSONAL_DETAILS', data: {} });
    }

    if (screen === 'SET_TRANSACTION_PIN') {
      return respond(await this.completeGetStarted(flowName, flowToken, data));
    }

    const nextScreen = ROUTING_MODEL[screen || ''];
    if (nextScreen) {
      return respond({ screen: nextScreen, data: {} });
    }

    return respond({ screen: 'PERSONAL_DETAILS', data: {} });
  }

  private async completeGetStarted(flowName: string, flowToken: string, data: Record<string, any>) {
    const pin = String(data.pin || '');
    const retypePin = String(data.retype_pin || '');

    if (!/^\d{4}$/.test(pin) || pin !== retypePin) {
      return {
        screen: 'SET_TRANSACTION_PIN',
        data: { error_message: 'PINs do not match. Please enter a 4-digit PIN and retype it correctly.' },
      };
    }

    const waId = flowToken.replace(/^get_started_/, '');
    const firstName = String(data.first_name || '');
    const lastName = String(data.last_name || '');
    const email = String(data.email || '');
    const pinHash = await argon2.hash(pin);

    const sessionData = {
      firstName,
      lastName,
      idType: data.id_type,
      idNumber: data.id_number,
      email,
      referralCode: data.referral_code,
      street: data.street,
      city: data.city,
      state: data.state,
      pinHash,
    };

    await this.prisma.whatsappFlowSession.upsert({
      where: { flowToken },
      create: { flowToken, waId, flowName, data: sessionData as any },
      update: { waId, flowName, data: sessionData as any },
    });

    let user = await this.prisma.user.findUnique({ where: { phone: waId } });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email: email || user.email,
        },
      });
    } else {
      try {
        user = await this.prisma.user.create({
          data: {
            phone: waId,
            firstName: firstName || null,
            lastName: lastName || null,
            email: email || null,
            status: 'PENDING' as any,
          },
        });
      } catch (err: any) {
        if (err?.code === 'P2002' && email) {
          user = await this.prisma.user.create({
            data: {
              phone: waId,
              firstName: firstName || null,
              lastName: lastName || null,
              status: 'PENDING' as any,
            },
          });
        } else {
          throw err;
        }
      }
    }

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        channel: 'WHATSAPP' as any,
        template: 'flow_submission',
        payload: {
          flowToken,
          waId,
          flowName,
          firstName,
          lastName,
          idType: data.id_type,
          street: data.street,
          city: data.city,
          state: data.state,
          pinConfigured: true,
        } as any,
        status: 'DELIVERED' as any,
        sentAt: new Date(),
      },
    });

    return {
      screen: 'SUCCESS',
      data: {
        extension_message_response: {
          params: {
            flow_token: flowToken,
            name: `${firstName} ${lastName}`.trim(),
            phone: waId,
          },
        },
      },
    };
  }

  private plain(httpStatus: number, body: string): FlowEndpointResponse {
    return { httpStatus, contentType: 'text/plain', body };
  }

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
    const flowId = process.env.WHATSAPP_FLOW_ID || undefined;

    if (!token || !numberId) return false;

    const interactive = {
      type: 'flow',
      body: { text: welcomeTemplate(name || 'there') },
      action: flowAction({ flowId, flowName: 'get_started' }, `get_started_${to}`),
    };

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
        interactive,
      }),
    });

    return res.ok;
  }

  async sendMessage(dto: SendWhatsappMessageDto) {
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
