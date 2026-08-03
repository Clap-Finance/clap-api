export declare enum ComplianceCheckType {
    AML = "AML",
    PEP = "PEP",
    SANCTIONS = "SANCTIONS",
    VELOCITY = "VELOCITY",
    FRAUD = "FRAUD",
    BLACKLIST = "BLACKLIST"
}
export declare class CreateComplianceCheckDto {
    userId?: string;
    transactionId?: string;
    checkType: ComplianceCheckType;
}
export declare class ScreenNameDto {
    firstName: string;
    lastName: string;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
