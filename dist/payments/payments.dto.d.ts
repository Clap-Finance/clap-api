export declare class CreateProviderDto {
    name: string;
    code: string;
    config?: any;
    priority?: number;
}
export declare class UpdateProviderDto {
    name?: string;
    config?: any;
    priority?: number;
    isActive?: boolean;
}
export declare class ProviderTransferDto {
    providerCode: string;
    transactionId: string;
}
