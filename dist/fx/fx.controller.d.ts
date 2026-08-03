import { FxService } from './fx.service';
import { CreateFxQuoteDto, FxConvertDto } from './fx.dto';
export declare class FxController {
    private readonly fxService;
    constructor(fxService: FxService);
    getRates(): Promise<any>;
    getRate(base: string, quote: string): Promise<any>;
    createQuote(req: any, dto: CreateFxQuoteDto): Promise<any>;
    convert(req: any, dto: FxConvertDto): Promise<any>;
}
