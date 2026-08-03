import { PrismaService } from '../prisma/prisma.service';
import { CreateFxQuoteDto, FxConvertDto } from './fx.dto';
export declare class FxService {
    private prisma;
    constructor(prisma: PrismaService);
    getRates(): Promise<any>;
    getRate(base: string, quote: string): Promise<any>;
    createQuote(userId: string, dto: CreateFxQuoteDto): Promise<any>;
    convert(userId: string, dto: FxConvertDto): Promise<any>;
}
