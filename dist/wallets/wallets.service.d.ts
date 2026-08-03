import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto, PaginationDto } from './wallets.dto';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    findMyWallets(userId: string): Promise<any>;
    createWallet(userId: string, dto: CreateWalletDto): Promise<any>;
    getWallet(userId: string, id: string): Promise<any>;
    getStatement(userId: string, id: string, query: PaginationDto): Promise<{
        wallet: any;
        transactions: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    freezeWallet(id: string): Promise<any>;
    unfreezeWallet(id: string): Promise<any>;
}
