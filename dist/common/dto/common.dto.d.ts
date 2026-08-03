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
export declare enum TransactionType {
    TRANSFER = "TRANSFER",
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    FX = "FX",
    AGENT_PAYMENT = "AGENT_PAYMENT",
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
    INTERNATIONAL_TRANSFER = "INTERNATIONAL_TRANSFER"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REVERSED = "REVERSED"
}
export declare enum Tier {
    TIER_0 = "TIER_0",
    TIER_1 = "TIER_1",
    TIER_2 = "TIER_2",
    TIER_3 = "TIER_3"
}
export declare enum Role {
    USER = "USER",
    AGENT = "AGENT",
    SUPPORT = "SUPPORT",
    COMPLIANCE = "COMPLIANCE",
    FINANCE = "FINANCE",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export declare enum NotificationChannel {
    WHATSAPP = "WHATSAPP",
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    IN_APP = "IN_APP"
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
