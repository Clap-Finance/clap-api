import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto, PaginationDto } from './wallets.dto';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    findMyWallets(userId: string): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.WalletStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        balance: bigint;
        availableBalance: bigint;
        lockedBalance: bigint;
    }[]>;
    createWallet(userId: string, dto: CreateWalletDto): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.WalletStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        balance: bigint;
        availableBalance: bigint;
        lockedBalance: bigint;
    }>;
    getWallet(userId: string, id: string): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.WalletStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        balance: bigint;
        availableBalance: bigint;
        lockedBalance: bigint;
    }>;
    getStatement(userId: string, id: string, query: PaginationDto): Promise<{
        wallet: {
            userId: string;
            id: string;
            status: import("@prisma/client").$Enums.WalletStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            balance: bigint;
            availableBalance: bigint;
            lockedBalance: bigint;
        };
        transactions: {
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
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    freezeWallet(id: string): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.WalletStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        balance: bigint;
        availableBalance: bigint;
        lockedBalance: bigint;
    }>;
    unfreezeWallet(id: string): Promise<{
        userId: string;
        id: string;
        status: import("@prisma/client").$Enums.WalletStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: import("@prisma/client").$Enums.Currency;
        balance: bigint;
        availableBalance: bigint;
        lockedBalance: bigint;
    }>;
}
