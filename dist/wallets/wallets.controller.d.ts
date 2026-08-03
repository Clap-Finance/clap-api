import { WalletsService } from './wallets.service';
import { CreateWalletDto, PaginationDto } from './wallets.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    findMyWallets(req: any): Promise<any>;
    createWallet(req: any, dto: CreateWalletDto): Promise<any>;
    getWallet(req: any, id: string): Promise<any>;
    getStatement(req: any, id: string, query: PaginationDto): Promise<{
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
