export declare enum KycDocumentType {
    BVN = "BVN",
    NIN = "NIN",
    PASSPORT = "PASSPORT",
    DRIVERS_LICENSE = "DRIVERS_LICENSE",
    SELFIE = "SELFIE",
    PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS"
}
export declare enum Tier {
    TIER_0 = "TIER_0",
    TIER_1 = "TIER_1",
    TIER_2 = "TIER_2",
    TIER_3 = "TIER_3"
}
export declare class UploadKycDocumentDto {
    documentType: KycDocumentType;
    documentNumber?: string;
    storageUrl: string;
}
export declare class SubmitKycVerificationDto {
    tier: Tier;
    bvn?: string;
    nin?: string;
    selfieUrl?: string;
    proofOfAddressUrl?: string;
}
export declare class RejectKycDto {
    reason: string;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
