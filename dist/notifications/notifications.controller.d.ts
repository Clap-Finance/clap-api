import { NotificationsService } from './notifications.service';
import { SendNotificationDto, PaginationDto } from './notifications.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any, query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    send(dto: SendNotificationDto): Promise<any>;
    markAsRead(req: any, id: string): Promise<any>;
}
