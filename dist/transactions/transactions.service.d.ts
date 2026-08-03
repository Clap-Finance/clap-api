import { PrismaService } from '../prisma/prisma.service';
import { TransferDto, DepositDto, WithdrawDto, PaginationDto } from './transactions.dto';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    transfer(userId: string, dto: TransferDto): Promise<any>;
    deposit(userId: string, dto: DepositDto): Promise<any>;
    withdraw(userId: string, dto: WithdrawDto): Promise<any>;
    findAll(userId: string, query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getTransaction(userId: string, id: string): Promise<any>;
    cancel(userId: string, id: string): Promise<any>;
}
