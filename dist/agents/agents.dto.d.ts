export declare enum Currency {
    NGN = "NGN",
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    GHS = "GHS",
    KES = "KES",
    ZAR = "ZAR",
    XOF = "XOF"
}
export declare class CreateAgentDto {
    userId: string;
    businessName: string;
    location?: string;
    commissionRate: number;
    dailyLimit: number;
}
export declare class UpdateAgentDto {
    businessName?: string;
    location?: string;
    commissionRate?: number;
    dailyLimit?: number;
    status?: string;
}
export declare class CashInOutDto {
    userId: string;
    amount: number;
    currency: Currency;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
