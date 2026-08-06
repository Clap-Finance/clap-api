import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, PaginationDto } from './users.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById(id: string): Promise<{
        country: string | null;
        phone: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        dob: Date | null;
        address: string | null;
        tier: import("@prisma/client").$Enums.Tier;
        status: import("@prisma/client").$Enums.UserStatus;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: {
            country: string | null;
            phone: string;
            email: string | null;
            firstName: string | null;
            lastName: string | null;
            id: string;
            dob: Date | null;
            address: string | null;
            tier: import("@prisma/client").$Enums.Tier;
            status: import("@prisma/client").$Enums.UserStatus;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
