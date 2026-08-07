import { PremiumTrustService } from '../src/premiumtrust/premiumtrust.service';
import { AccountType } from '../src/premiumtrust/dto/premiumtrust.dto';
import {
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

function fakePrisma() {
  return {
    virtualAccount: {
      findFirst: jest.fn().mockResolvedValue(null),
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation(({ data }) => ({ id: 'va-1', ...data })),
    },
  } as any;
}

function baseDto(overrides: Record<string, any> = {}) {
  return {
    firstName: 'EZEKIEL',
    lastName: 'FADIPE',
    bvn: 22142668052,
    nin: '22278019171',
    emailAddress: 'jos@gmail.com',
    phoneNumber: '08032111222',
    dob: '12-Jul-1987',
    accountType: AccountType.STATIC,
    ...overrides,
  };
}

describe('PremiumTrustService', () => {
  beforeEach(() => {
    process.env.PREMIUMTRUST_CLIENT_ID = 'cid';
    process.env.PREMIUMTRUST_SECRET_KEY = 'a'.repeat(64);
    process.env.PREMIUMTRUST_CLIENT_IV = 'b'.repeat(32);
  });

  describe('response code mapping', () => {
    it.each([
      ['00', 'Success', undefined],
      ['02', 'Account already exists', ConflictException],
      ['03', 'Invalid BVN', BadRequestException],
      ['04', 'BVN watchlisted', UnprocessableEntityException],
      ['08', 'Failure due to exception', UnprocessableEntityException],
    ])('code %s -> %s', async (code, _msg, ErrorClass) => {
      const prisma = fakePrisma();
      const client = { createAccount: jest.fn().mockResolvedValue({ Message: 'x', Code: code, AccountNo: '4130000028' }) };
      const svc = new PremiumTrustService(prisma, client as any);

      if (ErrorClass) {
        await expect(svc.createStaticAccount('user-1', baseDto())).rejects.toThrow(ErrorClass);
      } else {
        const account = await svc.createStaticAccount('user-1', baseDto());
        expect(account.accountNo).toBe('4130000028');
        expect(account.accountType).toBe('STATIC');
      }
    });

    it('throws for unknown codes', async () => {
      const prisma = fakePrisma();
      const client = { createAccount: jest.fn().mockResolvedValue({ Code: '99' }) };
      const svc = new PremiumTrustService(prisma, client as any);
      await expect(svc.createStaticAccount('u1', baseDto())).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('BVN validation', () => {
    it('rejects BVN shorter than 11 digits', async () => {
      const svc = new PremiumTrustService(fakePrisma(), { createAccount: jest.fn() } as any);
      await expect(svc.createStaticAccount('u1', baseDto({ bvn: 12345 }))).rejects.toThrow(BadRequestException);
      await expect(svc.createStaticAccount('u1', baseDto({ bvn: 1234567890123 }))).rejects.toThrow(BadRequestException);
    });
  });

  describe('static account rule', () => {
    it('prevents a second static account', async () => {
      const prisma = fakePrisma();
      prisma.virtualAccount.findFirst.mockResolvedValue({ id: 'va-static' });
      const svc = new PremiumTrustService(prisma, { createAccount: jest.fn() } as any);
      await expect(svc.createStaticAccount('u1', baseDto())).rejects.toThrow(ConflictException);
    });

    it('requires a static account before a dynamic one', async () => {
      const prisma = fakePrisma();
      prisma.virtualAccount.findFirst.mockResolvedValue(null);
      const svc = new PremiumTrustService(prisma, { createAccount: jest.fn() } as any);
      await expect(
        svc.createDynamicAccount('u1', baseDto({ accountType: AccountType.DYNAMIC })),
      ).rejects.toThrow(BadRequestException);
    });

    it('sends staticAccountNo when creating a dynamic account', async () => {
      const prisma = fakePrisma();
      prisma.virtualAccount.findFirst.mockResolvedValue({ accountNo: '4130000028' });
      const client = {
        createAccount: jest.fn().mockResolvedValue({ Code: '00', AccountNo: '4130000100' }),
      };
      const svc = new PremiumTrustService(prisma, client as any);
      await svc.createDynamicAccount('u1', baseDto({ accountType: AccountType.DYNAMIC }));
      expect(client.createAccount).toHaveBeenCalledWith(
        expect.objectContaining({ accountType: AccountType.DYNAMIC, staticAccountNo: '4130000028' }),
      );
    });
  });
});
