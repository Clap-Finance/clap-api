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
export declare class CreateFxQuoteDto {
    fromCurrency: Currency;
    toCurrency: Currency;
    amount: number;
}
export declare class FxConvertDto {
    quoteId: string;
    fromWalletId: string;
    toWalletId: string;
}
