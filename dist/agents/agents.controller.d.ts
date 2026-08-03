import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto, CashInOutDto, PaginationDto } from './agents.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
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
    cashIn(req: any, id: string, dto: CashInOutDto): Promise<any>;
    cashOut(req: any, id: string, dto: CashInOutDto): Promise<any>;
}
