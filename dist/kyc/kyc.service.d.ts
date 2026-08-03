import { PrismaService } from '../prisma/prisma.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';
export declare class KycService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(userId: string, dto: UploadKycDocumentDto): Promise<any>;
    findMyDocuments(userId: string): Promise<any>;
    submitVerification(userId: string, dto: SubmitKycVerificationDto): Promise<any>;
    getStatus(userId: string): Promise<{
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
    approve(id: string, reviewerId: string): Promise<any>;
    reject(id: string, dto: RejectKycDto, reviewerId: string): Promise<any>;
}
