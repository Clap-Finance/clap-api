import { WebhooksService } from './webhooks.service';
import { PaginationDto } from './webhooks.dto';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    receiveWebhook(providerCode: string, body: any, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.WebhookStatus;
        createdAt: Date;
        attempts: number;
        payload: import("@prisma/client/runtime/client").JsonValue;
        providerId: string;
        eventType: string;
        signature: string | null;
        processedAt: Date | null;
        errorMessage: string | null;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            provider: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                config: import("@prisma/client/runtime/client").JsonValue | null;
                priority: number;
                isActive: boolean;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.WebhookStatus;
            createdAt: Date;
            attempts: number;
            payload: import("@prisma/client/runtime/client").JsonValue;
            providerId: string;
            eventType: string;
            signature: string | null;
            processedAt: Date | null;
            errorMessage: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        provider: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            config: import("@prisma/client/runtime/client").JsonValue | null;
            priority: number;
            isActive: boolean;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.WebhookStatus;
        createdAt: Date;
        attempts: number;
        payload: import("@prisma/client/runtime/client").JsonValue;
        providerId: string;
        eventType: string;
        signature: string | null;
        processedAt: Date | null;
        errorMessage: string | null;
    }>;
    replay(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.WebhookStatus;
        createdAt: Date;
        attempts: number;
        payload: import("@prisma/client/runtime/client").JsonValue;
        providerId: string;
        eventType: string;
        signature: string | null;
        processedAt: Date | null;
        errorMessage: string | null;
    }>;
}
