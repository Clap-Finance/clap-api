import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';
export declare class BeneficiariesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<any>;
    create(userId: string, dto: CreateBeneficiaryDto): Promise<any>;
    update(userId: string, id: string, dto: UpdateBeneficiaryDto): Promise<any>;
    remove(userId: string, id: string): Promise<any>;
}
