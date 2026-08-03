import { PrismaService } from '../prisma/prisma.service';
import { CreateLedgerAccountDto, CreateJournalDto, PaginationDto } from './ledger.dto';
export declare class LedgerService {
    private prisma;
    constructor(prisma: PrismaService);
    findAccounts(): Promise<any>;
    createAccount(dto: CreateLedgerAccountDto): Promise<any>;
    findJournals(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getJournal(id: string): Promise<any>;
    createJournal(dto: CreateJournalDto): Promise<any>;
}
