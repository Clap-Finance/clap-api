import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, PaginationDto } from './users.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<any>;
    getUserById(id: string): Promise<any>;
    findAll(query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
}
