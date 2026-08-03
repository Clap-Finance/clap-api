export declare enum LedgerAccountType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
    EQUITY = "EQUITY",
    REVENUE = "REVENUE",
    EXPENSE = "EXPENSE"
}
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
export declare class CreateLedgerAccountDto {
    code: string;
    name: string;
    type: LedgerAccountType;
    currency?: Currency;
}
export declare class LedgerEntryDto {
    accountId: string;
    debit: number;
    credit: number;
    currency: Currency;
}
export declare class CreateJournalDto {
    reference: string;
    description: string;
    entries: LedgerEntryDto[];
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
