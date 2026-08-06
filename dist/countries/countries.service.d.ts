import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './countries.dto';
export declare class CountriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
        region: string | null;
    }[]>;
    findByCode(code: string): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
        region: string | null;
    }>;
    create(dto: CreateCountryDto): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        name: string;
        currency: import("@prisma/client").$Enums.Currency;
        isActive: boolean;
        region: string | null;
    }>;
}
