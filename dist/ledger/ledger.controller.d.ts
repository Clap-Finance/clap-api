import { LedgerService } from './ledger.service';
import { CreateLedgerAccountDto, CreateJournalDto, PaginationDto } from './ledger.dto';
export declare class LedgerController {
    private readonly ledgerService;
    constructor(ledgerService: LedgerService);
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
