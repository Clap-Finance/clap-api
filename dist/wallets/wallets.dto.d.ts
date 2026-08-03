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
export declare class CreateWalletDto {
    currency: Currency;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
