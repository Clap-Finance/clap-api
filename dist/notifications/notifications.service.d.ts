import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto, PaginationDto } from './notifications.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    send(dto: SendNotificationDto): Promise<any>;
    markAsRead(userId: string, id: string): Promise<any>;
}
