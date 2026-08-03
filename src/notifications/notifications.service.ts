import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto, PaginationDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async send(dto: SendNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        channel: dto.channel as any,
        template: dto.template,
        payload: dto.payload || undefined,
        status: 'QUEUED' as any,
      },
    });
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: {
        status: 'DELIVERED' as any,
        sentAt: new Date(),
      },
    });
  }
}
