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
export declare class CreateBeneficiaryDto {
    name: string;
    accountNumber: string;
    bankCode?: string;
    bankName?: string;
    country: string;
    currency: Currency;
    nickname?: string;
}
export declare class UpdateBeneficiaryDto {
    name?: string;
    accountNumber?: string;
    bankCode?: string;
    bankName?: string;
    country?: string;
    currency?: Currency;
    nickname?: string;
}
