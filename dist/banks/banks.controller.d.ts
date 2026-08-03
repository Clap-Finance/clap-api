import { BanksService } from './banks.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';
export declare class BanksController {
    private readonly banksService;
    constructor(banksService: BanksService);
    findAll(): Promise<any>;
    findByCode(code: string): Promise<any>;
    create(dto: CreateBankDto): Promise<any>;
    update(id: string, dto: UpdateBankDto): Promise<any>;
}
