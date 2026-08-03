import { PrismaService } from '../prisma/prisma.service';
import { ChangeRoleDto, PaginationDto } from './admin.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        totalUsers: any;
        totalTransactions: any;
        totalVolume: {
            [k: string]: string;
        };
    }>;
    findAllUsers(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findAllTransactions(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findAuditLogs(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    suspendUser(id: string): Promise<any>;
    activateUser(id: string): Promise<any>;
    changeRole(id: string, dto: ChangeRoleDto): Promise<any>;
}
