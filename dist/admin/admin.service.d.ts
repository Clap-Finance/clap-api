import { PrismaService } from '../prisma/prisma.service';
import { ChangeRoleDto, PaginationDto } from './admin.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalTransactions: number;
        totalVolume: {
            [k: string]: string;
        };
    }>;
    findAllUsers(query: PaginationDto): Promise<{
        data: {
            country: string | null;
            phone: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
            id: string;
            dob: Date | null;
            address: string | null;
            tier: import("@prisma/client").$Enums.Tier;
            status: import("@prisma/client").$Enums.UserStatus;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findAllTransactions(query: PaginationDto): Promise<{
        data: ({
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            exchangeRate: import("@prisma/client-runtime-utils").Decimal | null;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string | null;
            userId: string;
            id: string;
            status: import("@prisma/client").$Enums.TransactionStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            reference: string;
            direction: import("@prisma/client").$Enums.TransactionDirection;
            amount: bigint;
            fee: bigint;
            fromCurrency: import("@prisma/client").$Enums.Currency | null;
            toCurrency: import("@prisma/client").$Enums.Currency | null;
            provider: string | null;
            providerRef: string | null;
            counterpartyName: string | null;
            counterpartyAccount: string | null;
            counterpartyBank: string | null;
            counterpartyCountry: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            completedAt: Date | null;
            failedAt: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findAuditLogs(query: PaginationDto): Promise<{
        data: ({
            user: {
                phone: string;
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            userId: string | null;
            id: string;
            createdAt: Date;
            ipAddress: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            actorId: string | null;
            action: string;
            resource: string | null;
            resourceId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    suspendUser(id: string): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        passwordHash: string | null;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    activateUser(id: string): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        passwordHash: string | null;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changeRole(id: string, dto: ChangeRoleDto): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        passwordHash: string | null;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
