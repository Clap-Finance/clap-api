export declare enum NotificationChannel {
    WHATSAPP = "WHATSAPP",
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    IN_APP = "IN_APP"
}
export declare class SendNotificationDto {
    userId: string;
    channel: NotificationChannel;
    template: string;
    payload?: any;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
