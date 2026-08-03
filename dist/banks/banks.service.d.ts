import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';
export declare class BanksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findByCode(code: string): Promise<any>;
    create(dto: CreateBankDto): Promise<any>;
    update(id: string, dto: UpdateBankDto): Promise<any>;
}
