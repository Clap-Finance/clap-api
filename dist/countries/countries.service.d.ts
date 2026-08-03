import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './countries.dto';
export declare class CountriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findByCode(code: string): Promise<any>;
    create(dto: CreateCountryDto): Promise<any>;
}
