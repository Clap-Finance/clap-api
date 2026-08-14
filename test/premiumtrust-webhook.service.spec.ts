import { PremiumTrustWebhookService } from '../src/premiumtrust/webhook/premiumtrust-webhook.service';
import { FT_STATUS_CODES } from '../src/premiumtrust/premiumtrust.constants';

function fakePrisma() {
  const state = { webhookEvents: [], events: [] };
  const prisma = {
    paymentProvider: {
      upsert: jest.fn().mockResolvedValue({ id: 'provider-1', code: 'PREMIUMTRUST' }),
    },
    webhookEvent: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(({ data }) => {
        const ev = { id: `event-${state.webhookEvents.length + 1}`, ...data };
        state.events.push(ev);
        return Promise.resolve(ev);
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const ev = state.events.find((e) => e.id === where.id);
        if (ev) Object.assign(ev, data);
        return Promise.resolve(ev);
      }),
    },
    virtualAccount: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'va-1',
        userId: 'user-1',
        accountNo: '7452588732',
      }),
    },
    wallet: { update: jest.fn().mockResolvedValue({}) },
    transaction: { create: jest.fn().mockResolvedValue({}) },
    notification: { create: jest.fn().mockResolvedValue({}) },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn().mockImplementation(async (fn) => fn(prisma)),
  };
  return prisma;
}

function ftPayload(overrides: Record<string, any> = {}) {
  return {
    SessionID: '000001100913103301000000000002',
    NameEnquiryRef: '000001000000000001000001000001',
    DestinationInstitutionCode: '000002',
    ChannelCode: '1',
    BeneficiaryAccountName: 'Ademola David',
    BeneficiaryAccountNumber: '7452588732',
    BeneficiaryBankVerificationNumber: '221716390050',
    BeneficiaryKYCLevel: '1',
    OriginatorAccountName: 'Abidemi Asunmo',
    OriginatorAccountNumber: '3333002345',
    OriginatorBankVerificationNumber: '10330004410',
    OriginatorKYCLevel: '1',
    TransactionLocation: '6.4300747,3.4110715',
    Narration: '1000000001',
    PaymentReference: 'xxxxx12345',
    Amount: '1000.00',
    ResponseCode: '00',
    RequeryStatus: '00',
    ...overrides,
  };
}

describe('PremiumTrustWebhookService', () => {
  describe('handleFundsTransfer', () => {
    it('credits the wallet, creates transaction, notification and audit log', async () => {
      const prisma = fakePrisma();
      const svc = new PremiumTrustWebhookService(prisma as any);

      const result = await svc.handleFundsTransfer(ftPayload());

      expect(result.StatusCode).toBe(FT_STATUS_CODES.SUCCESS);
      expect(result.Amount).toBe('1000.00');
      expect(prisma.wallet.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_currency: { userId: 'user-1', currency: 'NGN' } },
          data: { balance: { increment: 100000n }, availableBalance: { increment: 100000n } },
        }),
      );
      expect(prisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'DEPOSIT',
            direction: 'CREDIT',
            amount: 100000n,
            reference: 'PTB-xxxxx12345',
          }),
        }),
      );
      expect(prisma.notification.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'INCOMING_TRANSFER' }) }),
      );
    });

    it('rejects duplicates with StatusCode 4', async () => {
      const prisma = fakePrisma();
      prisma.webhookEvent.findFirst.mockResolvedValue({ id: 'event-1', status: 'PROCESSED' });
      const svc = new PremiumTrustWebhookService(prisma as any);

      const result = await svc.handleFundsTransfer(ftPayload());
      expect(result.StatusCode).toBe(FT_STATUS_CODES.DUPLICATE);
      expect(prisma.wallet.update).not.toHaveBeenCalled();
    });

    it('returns StatusCode 2 when no customer matches the account', async () => {
      const prisma = fakePrisma();
      prisma.virtualAccount.findUnique.mockResolvedValue(null);
      const svc = new PremiumTrustWebhookService(prisma as any);

      const result = await svc.handleFundsTransfer(ftPayload());
      expect(result.StatusCode).toBe(FT_STATUS_CODES.INVALID_ACCOUNT);
      expect(prisma.wallet.update).not.toHaveBeenCalled();
    });

    it('returns StatusCode 2 for a malformed payload', async () => {
      const prisma = fakePrisma();
      const svc = new PremiumTrustWebhookService(prisma as any);

      const result = await svc.handleFundsTransfer({ SessionID: '', PaymentReference: '', Amount: '' });
      expect(result.StatusCode).toBe(FT_STATUS_CODES.INVALID_ACCOUNT);
    });

    it('echoes every request field in the response', async () => {
      const prisma = fakePrisma();
      const svc = new PremiumTrustWebhookService(prisma as any);

      const payload = ftPayload();
      const result = await svc.handleFundsTransfer(payload);

      for (const key of Object.keys(payload)) {
        expect(result[key]).toBe(payload[key]);
      }
    });

    it('converts fractional amounts to minor units', async () => {
      const prisma = fakePrisma();
      const svc = new PremiumTrustWebhookService(prisma as any);

      await svc.handleFundsTransfer(ftPayload({ Amount: '1000.99' }));
      expect(prisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ amount: 100099n }) }),
      );
    });
  });
});
