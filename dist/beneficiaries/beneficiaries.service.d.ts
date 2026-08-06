import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';
export declare class BeneficiariesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        country: string;
        userId: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        bankCode: string | null;
        accountNumber: string;
        bankName: string | null;
        nickname: string | null;
    }[]>;
    create(userId: string, dto: CreateBeneficiaryDto): Promise<{
        country: string;
        userId: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        bankCode: string | null;
        accountNumber: string;
        bankName: string | null;
        nickname: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateBeneficiaryDto): Promise<{
        country: string;
        userId: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        bankCode: string | null;
        accountNumber: string;
        bankName: string | null;
        nickname: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        country: string;
        userId: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        bankCode: string | null;
        accountNumber: string;
        bankName: string | null;
        nickname: string | null;
    }>;
}
