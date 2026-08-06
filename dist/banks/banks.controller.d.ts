import { BanksService } from './banks.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';
export declare class BanksController {
    private readonly banksService;
    constructor(banksService: BanksService);
    findAll(): Promise<{
        country: string;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
    }[]>;
    findByCode(code: string): Promise<{
        country: string;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
    }>;
    create(dto: CreateBankDto): Promise<{
        country: string;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateBankDto): Promise<{
        country: string;
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
    }>;
}
