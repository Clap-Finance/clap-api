import { WebhooksService } from './webhooks.service';
import { PaginationDto } from './webhooks.dto';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    receiveWebhook(providerCode: string, body: any, req: any): Promise<any>;
    findAll(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    replay(id: string): Promise<any>;
}
