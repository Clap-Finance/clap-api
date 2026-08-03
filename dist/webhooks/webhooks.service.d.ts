import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './webhooks.dto';
export declare class WebhooksService {
    private prisma;
    constructor(prisma: PrismaService);
    receiveWebhook(providerCode: string, payload: any, signature?: string): Promise<any>;
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
