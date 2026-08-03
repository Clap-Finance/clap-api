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
export declare class TransferDto {
    fromWalletId: string;
    toWalletId?: string;
    amount: number;
    currency: Currency;
    description?: string;
    counterpartyName?: string;
    counterpartyAccount?: string;
    counterpartyBank?: string;
    counterpartyCountry?: string;
}
export declare class DepositDto {
    walletId: string;
    amount: number;
    currency: Currency;
    provider: string;
    providerRef?: string;
}
export declare class WithdrawDto {
    walletId: string;
    amount: number;
    currency: Currency;
    bankCode: string;
    accountNumber: string;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
