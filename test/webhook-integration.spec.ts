import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { PremiumTrustWebhookService } from '../src/premiumtrust/webhook/premiumtrust-webhook.service';

const prisma = new PrismaService();

const describeIntegration = process.env.DATABASE_URL || process.env.POSTGRES_URL ? describe : describe.skip;

describeIntegration('PremiumTrust integration (real database)', () => {
  let userId: string;
  let walletId: string;

  beforeAll(async () => {
    await prisma.$connect();
    const user = await prisma.user.create({
      data: {
        phone: `+234${Date.now()}`,
        firstName: 'Integ',
        lastName: 'Test',
      },
    });
    userId = user.id;
    const wallet = await prisma.wallet.create({
      data: { userId, currency: 'NGN' },
    });
    walletId = wallet.id;
  });

  afterAll(async () => {
    await prisma.wallet.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.transaction.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.notification.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.auditLog.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.user.deleteMany({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('processes a webhook, credits the NGN wallet and records the transaction', async () => {
    const accountNo = `9000${Date.now()}`;
    await prisma.virtualAccount.create({
      data: { userId, accountNo, accountType: 'STATIC', bankName: 'Premium Trust Bank' },
    });

    const before = await prisma.wallet.findUnique({ where: { id: walletId } });

    const svc = new PremiumTrustWebhookService(prisma);
    const result = await svc.handleFundsTransfer({
      SessionID: `SESSION-${Date.now()}`,
      PaymentReference: `REF-${Date.now()}`,
      Amount: '2500.50',
      BeneficiaryAccountNumber: accountNo,
      OriginatorAccountName: 'Ademola David',
      OriginatorAccountNumber: '3333002345',
      Narration: 'Payment for goods',
    });

    expect(result.StatusCode).toBe('1');

    const after = await prisma.wallet.findUnique({ where: { id: walletId } });
    expect(after!.balance).toBe((before!.balance || 0n) + 250050n);
    expect(after!.availableBalance).toBe((before!.availableBalance || 0n) + 250050n);

    const tx = await prisma.transaction.findFirst({
      where: { userId, reference: `PTB-REF-${result.PaymentReference.slice(4)}` },
    });
    expect(tx).toBeTruthy();
    expect(tx!.amount).toBe(250050n);
    expect(tx!.status).toBe('COMPLETED');
    expect(tx!.direction).toBe('CREDIT');

    const notif = await prisma.notification.findFirst({ where: { userId, template: 'payment_received' } });
    expect(notif).toBeTruthy();

    const audit = await prisma.auditLog.findFirst({ where: { userId, action: 'INCOMING_TRANSFER' } });
    expect(audit).toBeTruthy();

    await prisma.virtualAccount.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.webhookEvent.deleteMany({
      where: { provider: { code: 'PREMIUMTRUST' }, eventType: `REF-${Date.now()}` },
    }).catch(() => {});
  }, 20000);

  it('creates and later rejects a duplicate webhook with StatusCode 4', async () => {
    const accountNo = `8000${Date.now()}`;
    await prisma.virtualAccount.create({
      data: { userId, accountNo, accountType: 'STATIC' },
    });

    const svc = new PremiumTrustWebhookService(prisma);
    const payload = {
      SessionID: `SESSION-${Date.now()}`,
      PaymentReference: `REF-DUP-${Date.now()}`,
      Amount: '500.00',
      BeneficiaryAccountNumber: accountNo,
    };

    const first = await svc.handleFundsTransfer(payload);
    expect(first.StatusCode).toBe('1');

    const second = await svc.handleFundsTransfer(payload);
    expect(second.StatusCode).toBe('4');

    await prisma.virtualAccount.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.webhookEvent.deleteMany({ where: { eventType: payload.PaymentReference } }).catch(() => {});
  }, 20000);
});
