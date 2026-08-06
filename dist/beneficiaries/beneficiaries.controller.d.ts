import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';
export declare class BeneficiariesController {
    private readonly beneficiariesService;
    constructor(beneficiariesService: BeneficiariesService);
    findAll(req: any): Promise<{
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
    create(req: any, dto: CreateBeneficiaryDto): Promise<{
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
    update(req: any, id: string, dto: UpdateBeneficiaryDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
