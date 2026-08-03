import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, CashInOutDto, PaginationDto } from './agents.dto';
export declare class AgentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAgentDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateAgentDto): Promise<any>;
    findAgentTransactions(id: string, query: PaginationDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    cashIn(agentId: string, agentUserId: string, dto: CashInOutDto): Promise<any>;
    cashOut(agentId: string, agentUserId: string, dto: CashInOutDto): Promise<any>;
}
