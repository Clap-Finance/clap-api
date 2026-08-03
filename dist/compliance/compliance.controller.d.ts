import { ComplianceService } from './compliance.service';
import { CreateComplianceCheckDto, ScreenNameDto, PaginationDto } from './compliance.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    findChecks(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    createCheck(dto: CreateComplianceCheckDto): Promise<any>;
    screenName(dto: ScreenNameDto): Promise<{
        screenedName: string;
        exactMatches: any;
        partialMatches: any;
        isFlagged: boolean;
    }>;
    findSanctions(): Promise<any>;
}
