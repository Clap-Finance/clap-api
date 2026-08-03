import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto, UpdateProviderDto, ProviderTransferDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findActiveProviders() {
    return this.prisma.paymentProvider.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });
  }

  async createProvider(dto: CreateProviderDto) {
    return this.prisma.paymentProvider.create({
      data: {
        name: dto.name,
        code: dto.code,
        config: dto.config || undefined,
        priority: dto.priority ?? 0,
      },
    });
  }

  async updateProvider(id: string, dto: UpdateProviderDto) {
    const provider = await this.prisma.paymentProvider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');
    return this.prisma.paymentProvider.update({
      where: { id },
      data: {
        name: dto.name,
        config: dto.config,
        priority: dto.priority,
        isActive: dto.isActive,
      },
    });
  }

  async initiateTransfer(dto: ProviderTransferDto) {
    const provider = await this.prisma.paymentProvider.findUnique({
      where: { code: dto.providerCode },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    if (!provider.isActive) throw new NotFoundException('Provider is not active');

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: dto.transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.prisma.paymentRequest.create({
      data: {
        providerId: provider.id,
        transactionId: transaction.id,
        providerRef: transaction.reference,
        requestType: 'transfer',
        payload: {
          amount: transaction.amount.toString(),
          currency: transaction.currency,
          reference: transaction.reference,
        },
        status: 'PENDING',
      },
      include: { provider: true },
    });
  }

  async verifyPayment(providerRef: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference: providerRef },
    });
    if (!transaction) throw new NotFoundException('Transaction not found for this provider reference');

    const request = await this.prisma.paymentRequest.findFirst({
      where: { providerRef },
      include: { provider: true },
    });

    return {
      transaction,
      paymentRequest: request,
      status: transaction.status,
    };
  }
}
