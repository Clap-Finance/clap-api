import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceCheckDto, ScreenNameDto, PaginationDto } from './compliance.dto';
export declare class ComplianceService {
    private prisma;
    constructor(prisma: PrismaService);
    findChecks(query: PaginationDto): Promise<{
        data: {
            userId: string | null;
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            createdAt: Date;
            transactionId: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            checkType: import("@prisma/client").$Enums.ComplianceCheckType;
            riskScore: number;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createCheck(dto: CreateComplianceCheckDto): Promise<{
        userId: string | null;
        id: string;
        status: import("@prisma/client").$Enums.ComplianceStatus;
        createdAt: Date;
        transactionId: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        checkType: import("@prisma/client").$Enums.ComplianceCheckType;
        riskScore: number;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    screenName(dto: ScreenNameDto): Promise<{
        screenedName: string;
        exactMatches: {
            firstName: string;
            lastName: string;
            id: string;
            createdAt: Date;
            source: string;
            matchKey: string;
        }[];
        partialMatches: {
            firstName: string;
            lastName: string;
            id: string;
            createdAt: Date;
            source: string;
            matchKey: string;
        }[];
        isFlagged: boolean;
    }>;
    findSanctions(): Promise<{
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        source: string;
        matchKey: string;
    }[]>;
}
