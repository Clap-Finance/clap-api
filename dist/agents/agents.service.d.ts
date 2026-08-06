import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, CashInOutDto, PaginationDto } from './agents.dto';
export declare class AgentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAgentDto): Promise<{
        code: string;
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.AgentStatus;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        location: string | null;
        commissionRate: import("@prisma/client-runtime-utils").Decimal;
        dailyLimit: bigint;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        cashBalance: bigint;
        floatBalance: bigint;
    }>;
    findAll(): Promise<({
        user: {
            phone: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        code: string;
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.AgentStatus;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        location: string | null;
        commissionRate: import("@prisma/client-runtime-utils").Decimal;
        dailyLimit: bigint;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        cashBalance: bigint;
        floatBalance: bigint;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            phone: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        code: string;
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.AgentStatus;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        location: string | null;
        commissionRate: import("@prisma/client-runtime-utils").Decimal;
        dailyLimit: bigint;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        cashBalance: bigint;
        floatBalance: bigint;
    }>;
    update(id: string, dto: UpdateAgentDto): Promise<{
        code: string;
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.AgentStatus;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        location: string | null;
        commissionRate: import("@prisma/client-runtime-utils").Decimal;
        dailyLimit: bigint;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        cashBalance: bigint;
        floatBalance: bigint;
    }>;
    findAgentTransactions(id: string, query: PaginationDto): Promise<{
        data: {
            type: import("@prisma/client").$Enums.AgentTxType;
            userId: string | null;
            id: string;
            status: import("@prisma/client").$Enums.TransactionStatus;
            createdAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            amount: bigint;
            completedAt: Date | null;
            agentId: string;
            commission: bigint;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    cashIn(agentId: string, agentUserId: string, dto: CashInOutDto): Promise<{
        type: import("@prisma/client").$Enums.AgentTxType;
        userId: string | null;
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        amount: bigint;
        completedAt: Date | null;
        agentId: string;
        commission: bigint;
    }>;
    cashOut(agentId: string, agentUserId: string, dto: CashInOutDto): Promise<{
        type: import("@prisma/client").$Enums.AgentTxType;
        userId: string | null;
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        amount: bigint;
        completedAt: Date | null;
        agentId: string;
        commission: bigint;
    }>;
}
