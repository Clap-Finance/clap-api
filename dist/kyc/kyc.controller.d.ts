import { KycService } from './kyc.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    uploadDocument(req: any, dto: UploadKycDocumentDto): Promise<any>;
    findMyDocuments(req: any): Promise<any>;
    submitVerification(req: any, dto: SubmitKycVerificationDto): Promise<any>;
    getStatus(req: any): Promise<{
        tier: any;
        verification: any;
    }>;
    findAllVerifications(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    approve(req: any, id: string): Promise<any>;
    reject(req: any, id: string, dto: RejectKycDto): Promise<any>;
}
