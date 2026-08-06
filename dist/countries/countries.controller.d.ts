import { CountriesService } from './countries.service';
import { CreateCountryDto } from './countries.dto';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
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
