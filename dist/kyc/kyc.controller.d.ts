import { KycService } from './kyc.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    uploadDocument(req: any, dto: UploadKycDocumentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: import("@prisma/client").$Enums.KycDocumentType;
        documentNumber: string | null;
        storageUrl: string | null;
        documentData: import("@prisma/client/runtime/client").JsonValue | null;
        verified: boolean;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }>;
    findMyDocuments(req: any): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: import("@prisma/client").$Enums.KycDocumentType;
        documentNumber: string | null;
        storageUrl: string | null;
        documentData: import("@prisma/client/runtime/client").JsonValue | null;
        verified: boolean;
        verifiedAt: Date | null;
        verifiedBy: string | null;
    }[]>;
    submitVerification(req: any, dto: SubmitKycVerificationDto): Promise<{
        userId: string;
        id: string;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.KycStatus;
        bvn: string | null;
        nin: string | null;
        selfieUrl: string | null;
        proofOfAddressUrl: string | null;
        reviewedBy: string | null;
        notes: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
    }>;
    getStatus(req: any): Promise<{
        tier: import("@prisma/client").$Enums.Tier;
        verification: {
            userId: string;
            id: string;
            tier: import("@prisma/client").$Enums.Tier;
            status: import("@prisma/client").$Enums.KycStatus;
            bvn: string | null;
            nin: string | null;
            selfieUrl: string | null;
            proofOfAddressUrl: string | null;
            reviewedBy: string | null;
            notes: string | null;
            submittedAt: Date;
            reviewedAt: Date | null;
        };
    }>;
    findAllVerifications(query: PaginationDto): Promise<{
        data: {
            userId: string;
            id: string;
            tier: import("@prisma/client").$Enums.Tier;
            status: import("@prisma/client").$Enums.KycStatus;
            bvn: string | null;
            nin: string | null;
            selfieUrl: string | null;
            proofOfAddressUrl: string | null;
            reviewedBy: string | null;
            notes: string | null;
            submittedAt: Date;
            reviewedAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    approve(req: any, id: string): Promise<{
        userId: string;
        id: string;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.KycStatus;
        bvn: string | null;
        nin: string | null;
        selfieUrl: string | null;
        proofOfAddressUrl: string | null;
        reviewedBy: string | null;
        notes: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
    }>;
    reject(req: any, id: string, dto: RejectKycDto): Promise<{
        userId: string;
        id: string;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.KycStatus;
        bvn: string | null;
        nin: string | null;
        selfieUrl: string | null;
        proofOfAddressUrl: string | null;
        reviewedBy: string | null;
        notes: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
    }>;
}
