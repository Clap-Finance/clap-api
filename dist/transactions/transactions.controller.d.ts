import { TransactionsService } from './transactions.service';
import { TransferDto, DepositDto, WithdrawDto, PaginationDto } from './transactions.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    transfer(req: any, dto: TransferDto): Promise<any>;
    deposit(req: any, dto: DepositDto): Promise<any>;
    withdraw(req: any, dto: WithdrawDto): Promise<any>;
    findAll(req: any, query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getTransaction(req: any, id: string): Promise<any>;
    cancel(req: any, id: string): Promise<any>;
}
