import { NotificationsService } from './notifications.service';
import { SendNotificationDto, PaginationDto } from './notifications.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any, query: PaginationDto): Promise<{
        data: {
            userId: string;
            id: string;
            status: import("@prisma/client").$Enums.NotificationStatus;
            createdAt: Date;
            payload: import("@prisma/client/runtime/client").JsonValue | null;
            channel: import("@prisma/client").$Enums.NotificationChannel;
            template: string;
            sentAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    send(dto: SendNotificationDto): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        createdAt: Date;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("@prisma/client").$Enums.NotificationChannel;
        template: string;
        sentAt: Date | null;
    }>;
    markAsRead(req: any, id: string): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        createdAt: Date;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("@prisma/client").$Enums.NotificationChannel;
        template: string;
        sentAt: Date | null;
    }>;
}
