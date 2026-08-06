import { PrismaService } from '../prisma/prisma.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';
export declare class KycService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(userId: string, dto: UploadKycDocumentDto): Promise<{
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
    findMyDocuments(userId: string): Promise<{
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
    submitVerification(userId: string, dto: SubmitKycVerificationDto): Promise<{
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
    getStatus(userId: string): Promise<{
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
    approve(id: string, reviewerId: string): Promise<{
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
    reject(id: string, dto: RejectKycDto, reviewerId: string): Promise<{
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
