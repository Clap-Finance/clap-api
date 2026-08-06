import { UsersService } from './users.service';
import { UpdateProfileDto, PaginationDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
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
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
