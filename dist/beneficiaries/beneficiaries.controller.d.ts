import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';
export declare class BeneficiariesController {
    private readonly beneficiariesService;
    constructor(beneficiariesService: BeneficiariesService);
    findAll(req: any): Promise<any>;
    create(req: any, dto: CreateBeneficiaryDto): Promise<any>;
    update(req: any, id: string, dto: UpdateBeneficiaryDto): Promise<any>;
    remove(req: any, id: string): Promise<any>;
}
