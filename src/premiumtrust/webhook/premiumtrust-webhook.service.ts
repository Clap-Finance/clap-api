import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import {
  FT_STATUS_CODES,
  PREMIUMTRUST_PROVIDER_CODE,
} from '../premiumtrust.constants';

@Injectable()
export class PremiumTrustWebhookService {
  private readonly logger = new Logger(PremiumTrustWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handleFundsTransfer(payload: Record<string, any>) {
    const sessionId = String(payload.SessionID || '');
    const paymentReference = String(payload.PaymentReference || '');
    const amount = String(payload.Amount || '');

    const provider = await this.ensureProvider();

    if (!sessionId || !paymentReference || !amount) {
      this.logger.warn('PTB FT webhook rejected: missing required fields');
      return this.buildResponse(payload, FT_STATUS_CODES.INVALID_ACCOUNT);
    }

    const existing = await this.prisma.webhookEvent.findFirst({
      where: {
        providerId: provider.id,
        eventType: paymentReference,
        status: { in: ['RECEIVED', 'PROCESSING', 'PROCESSED'] as any },
      },
    });
    if (existing) {
      this.logger.warn(`PTB FT webhook duplicate rejected: ref=${paymentReference}`);
      return this.buildResponse(payload, FT_STATUS_CODES.DUPLICATE);
    }

    const event = await this.prisma.webhookEvent.create({
      data: {
        providerId: provider.id,
        eventType: paymentReference,
        payload: payload as any,
        status: 'RECEIVED' as any,
      },
    });

    const account = await this.prisma.virtualAccount.findUnique({
      where: { accountNo: String(payload.BeneficiaryAccountNumber || '') },
    });

    if (!account) {
      this.logger.warn(`PTB FT webhook: no customer for account ${payload.BeneficiaryAccountNumber}`);
      return this.buildResponse(payload, FT_STATUS_CODES.INVALID_ACCOUNT);
    }

    const amountMinor = this.toMinorUnits(amount);
    const reference = `PTB-${paymentReference}`;

    await this.prisma.$transaction(async (tx) => {
      await tx.webhookEvent.update({
        where: { id: event.id },
        data: { status: 'PROCESSING' as any },
      });

      await tx.wallet.update({
        where: { userId_currency: { userId: account.userId, currency: 'NGN' } },
        data: {
          balance: { increment: amountMinor },
          availableBalance: { increment: amountMinor },
        },
      });

      await tx.transaction.create({
        data: {
          reference,
          userId: account.userId,
          type: 'DEPOSIT' as any,
          status: 'COMPLETED' as any,
          direction: 'CREDIT' as any,
          amount: amountMinor,
          currency: 'NGN' as any,
          provider: 'PREMIUMTRUST',
          providerRef: sessionId,
          counterpartyName: payload.OriginatorAccountName || null,
          counterpartyAccount: payload.OriginatorAccountNumber || null,
          counterpartyBank: payload.DestinationInstitutionCode || null,
          description: payload.Narration || `Incoming transfer to ${account.accountNo}`,
          completedAt: new Date(),
        },
      });

      await tx.notification.create({
        data: {
          userId: account.userId,
          channel: 'WHATSAPP' as any,
          template: 'payment_received',
          payload: {
            amount: payload.Amount,
            accountNo: account.accountNo,
            reference: paymentReference,
            from: payload.OriginatorAccountName || null,
          } as any,
          status: 'QUEUED' as any,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: account.userId,
          action: 'INCOMING_TRANSFER',
          resource: 'virtual-account',
          resourceId: account.accountNo,
          metadata: { reference, sessionId, amount: payload.Amount } as any,
        },
      });

      await tx.webhookEvent.update({
        where: { id: event.id },
        data: { status: 'PROCESSED' as any, processedAt: new Date() },
      });
    });

    this.logger.log(
      `PTB FT webhook processed: ref=${paymentReference} account=${account.accountNo} amount=${payload.Amount}`,
    );
    return this.buildResponse(payload, FT_STATUS_CODES.SUCCESS);
  }

  private async ensureProvider() {
    return this.prisma.paymentProvider.upsert({
      where: { code: PREMIUMTRUST_PROVIDER_CODE },
      update: {},
      create: { name: 'Premium Trust Bank', code: PREMIUMTRUST_PROVIDER_CODE },
    });
  }

  private toMinorUnits(amount: string): bigint {
    const parsed = Number(amount);
    if (Number.isNaN(parsed) || parsed < 0) throw new Error(`Invalid amount: ${amount}`);
    return BigInt(Math.round(parsed * 100));
  }

  private buildResponse(payload: Record<string, any>, statusCode: string): Record<string, any> {
    return {
      ...payload,
      StatusCode: statusCode,
    };
  }
}
