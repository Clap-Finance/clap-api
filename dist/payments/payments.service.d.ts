import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto, UpdateProviderDto, ProviderTransferDto } from './payments.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findActiveProviders(): Promise<any>;
    createProvider(dto: CreateProviderDto): Promise<any>;
    updateProvider(id: string, dto: UpdateProviderDto): Promise<any>;
    initiateTransfer(dto: ProviderTransferDto): Promise<any>;
    verifyPayment(providerRef: string): Promise<{
        transaction: any;
        paymentRequest: any;
        status: any;
    }>;
}
