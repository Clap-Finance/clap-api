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
export declare class CreateBankDto {
    code: string;
    name: string;
    country: string;
    currency: Currency;
}
export declare class UpdateBankDto {
    name?: string;
    country?: string;
    currency?: Currency;
    isActive?: boolean;
}
