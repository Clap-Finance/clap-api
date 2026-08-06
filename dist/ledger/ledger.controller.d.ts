import { LedgerService } from './ledger.service';
import { CreateLedgerAccountDto, CreateJournalDto, PaginationDto } from './ledger.dto';
export declare class LedgerController {
    private readonly ledgerService;
    constructor(ledgerService: LedgerService);
    findAccounts(): Promise<({
        _count: {
            entries: number;
        };
    } & {
        type: import("@prisma/client").$Enums.LedgerAccountType;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency | null;
    })[]>;
    createAccount(dto: CreateLedgerAccountDto): Promise<{
        type: import("@prisma/client").$Enums.LedgerAccountType;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency | null;
    }>;
    findJournals(query: PaginationDto): Promise<{
        data: ({
            _count: {
                entries: number;
            };
        } & {
            description: string;
            id: string;
            status: import("@prisma/client").$Enums.JournalStatus;
            createdAt: Date;
            reference: string;
            transactionId: string | null;
            postedAt: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getJournal(id: string): Promise<{
        entries: ({
            account: {
                type: import("@prisma/client").$Enums.LedgerAccountType;
                code: string;
                id: string;
                createdAt: Date;
                name: string;
                currency: import("@prisma/client").$Enums.Currency | null;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            accountId: string;
            debit: bigint;
            credit: bigint;
            journalId: string;
        })[];
    } & {
        description: string;
        id: string;
        status: import("@prisma/client").$Enums.JournalStatus;
        createdAt: Date;
        reference: string;
        transactionId: string | null;
        postedAt: Date | null;
    }>;
    createJournal(dto: CreateJournalDto): Promise<{
        entries: ({
            account: {
                type: import("@prisma/client").$Enums.LedgerAccountType;
                code: string;
                id: string;
                createdAt: Date;
                name: string;
                currency: import("@prisma/client").$Enums.Currency | null;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            accountId: string;
            debit: bigint;
            credit: bigint;
            journalId: string;
        })[];
    } & {
        description: string;
        id: string;
        status: import("@prisma/client").$Enums.JournalStatus;
        createdAt: Date;
        reference: string;
        transactionId: string | null;
        postedAt: Date | null;
    }>;
}
