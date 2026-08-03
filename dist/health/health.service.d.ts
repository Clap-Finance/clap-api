import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
    }>;
    ready(): Promise<{
        status: string;
        database: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: string;
        timestamp: string;
    }>;
}
