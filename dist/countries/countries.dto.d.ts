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
export declare class CreateCountryDto {
    code: string;
    name: string;
    currency: Currency;
    region?: string;
}
