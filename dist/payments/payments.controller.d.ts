import { PaymentsService } from './payments.service';
import { CreateProviderDto, UpdateProviderDto, ProviderTransferDto } from './payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findActiveProviders(): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("@prisma/client/runtime/client").JsonValue | null;
        priority: number;
        isActive: boolean;
    }[]>;
    createProvider(dto: CreateProviderDto): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("@prisma/client/runtime/client").JsonValue | null;
        priority: number;
        isActive: boolean;
    }>;
    updateProvider(id: string, dto: UpdateProviderDto): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("@prisma/client/runtime/client").JsonValue | null;
        priority: number;
        isActive: boolean;
    }>;
    initiateTransfer(dto: ProviderTransferDto): Promise<{
        provider: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            config: import("@prisma/client/runtime/client").JsonValue | null;
            priority: number;
            isActive: boolean;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        providerRef: string | null;
        transactionId: string | null;
        requestType: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        response: import("@prisma/client/runtime/client").JsonValue | null;
        providerId: string;
    }>;
    verifyPayment(providerRef: string): Promise<{
        transaction: {
            exchangeRate: import("@prisma/client-runtime-utils").Decimal | null;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string | null;
            userId: string;
            id: string;
            status: import("@prisma/client").$Enums.TransactionStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: import("@prisma/client").$Enums.Currency;
            reference: string;
            direction: import("@prisma/client").$Enums.TransactionDirection;
            amount: bigint;
            fee: bigint;
            fromCurrency: import("@prisma/client").$Enums.Currency | null;
            toCurrency: import("@prisma/client").$Enums.Currency | null;
            provider: string | null;
            providerRef: string | null;
            counterpartyName: string | null;
            counterpartyAccount: string | null;
            counterpartyBank: string | null;
            counterpartyCountry: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            completedAt: Date | null;
            failedAt: Date | null;
        };
        paymentRequest: {
            provider: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                config: import("@prisma/client/runtime/client").JsonValue | null;
                priority: number;
                isActive: boolean;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            providerRef: string | null;
            transactionId: string | null;
            requestType: string;
            payload: import("@prisma/client/runtime/client").JsonValue;
            response: import("@prisma/client/runtime/client").JsonValue | null;
            providerId: string;
        };
        status: import("@prisma/client").$Enums.TransactionStatus;
    }>;
}
