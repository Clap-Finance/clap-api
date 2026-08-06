import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';
export declare class BanksService {
    private prisma;
    constructor(prisma: PrismaService);
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
