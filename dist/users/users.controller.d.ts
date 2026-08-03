import { UsersService } from './users.service';
import { UpdateProfileDto, PaginationDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<any>;
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
