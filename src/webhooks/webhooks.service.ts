import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './webhooks.dto';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async receiveWebhook(providerCode: string, payload: any, signature?: string) {
    const provider = await this.prisma.paymentProvider.findUnique({
      where: { code: providerCode },
    });
    if (!provider) throw new NotFoundException('Unknown provider');

    const eventType = payload?.event || payload?.type || 'UNKNOWN';

    return this.prisma.webhookEvent.create({
      data: {
        providerId: provider.id,
        eventType,
        signature: signature || null,
        payload: payload as any,
        status: 'RECEIVED' as any,
      },
    });
  }

  async findAll(query: PaginationDto) {
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

  async findOne(id: string) {
    const event = await this.prisma.webhookEvent.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!event) throw new NotFoundException('Webhook event not found');
    return event;
  }

  async replay(id: string) {
    const event = await this.prisma.webhookEvent.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!event) throw new NotFoundException('Webhook event not found');

    // Reset status for reprocessing
    return this.prisma.webhookEvent.update({
      where: { id },
      data: {
        status: 'RECEIVED' as any,
        attempts: 0,
        errorMessage: null,
        processedAt: null,
      },
    });
  }
}
