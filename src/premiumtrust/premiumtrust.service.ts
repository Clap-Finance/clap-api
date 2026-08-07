import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PremiumTrustClient } from './premiumtrust.client';
import { CreateVirtualAccountDto, AccountType } from './dto/premiumtrust.dto';
import { PREMIUMTRUST_RESPONSE_CODES } from './premiumtrust.constants';

@Injectable()
export class PremiumTrustService {
  private readonly logger = new Logger(PremiumTrustService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly client: PremiumTrustClient,
  ) {}

  async createStaticAccount(userId: string, dto: CreateVirtualAccountDto) {
    const bvn = String(dto.bvn);
    if (!/^\d{11}$/.test(bvn)) {
      throw new BadRequestException('BVN must be exactly 11 digits');
    }

    const existing = await this.prisma.virtualAccount.findFirst({
      where: { userId, accountType: 'STATIC' },
    });
    if (existing) throw new ConflictException('A static account already exists for this user');

    const response = await this.client.createAccount({
      firstName: dto.firstName,
      lastName: dto.lastName,
      bvn: dto.bvn,
      nin: dto.nin,
      businessName: dto.businessName,
      natureOfBusiness: dto.natureOfBusiness,
      physicalAddress: dto.physicalAddress,
      emailAddress: dto.emailAddress,
      phoneNumber: dto.phoneNumber,
      dob: dto.dob,
      accountType: AccountType.STATIC,
    });

    this.handleResponseCode(response);

    const accountNo = String(response.AccountNo);

    const account = await this.prisma.virtualAccount.create({
      data: {
        userId,
        accountNo,
        accountType: 'STATIC',
        bankName: 'Premium Trust Bank',
        bvn,
        metadata: { bvnResponse: response as object },
      },
    });

    this.logger.log(`Static virtual account ${accountNo} created for user ${userId}`);
    return account;
  }

  async createDynamicAccount(userId: string, dto: CreateVirtualAccountDto) {
    const staticAccount = await this.prisma.virtualAccount.findFirst({
      where: { userId, accountType: 'STATIC' },
    });
    if (!staticAccount) {
      throw new BadRequestException(
        'A static account must be created before creating a dynamic account',
      );
    }

    const staticAccountNo = dto.staticAccountNo || staticAccount.accountNo;
    const bvn = String(dto.bvn || staticAccount.bvn);

    if (!/^\d{11}$/.test(bvn)) {
      throw new BadRequestException('BVN must be exactly 11 digits');
    }

    const response = await this.client.createAccount({
      firstName: dto.firstName,
      lastName: dto.lastName,
      bvn: Number(bvn),
      nin: dto.nin,
      businessName: dto.businessName,
      natureOfBusiness: dto.natureOfBusiness,
      physicalAddress: dto.physicalAddress,
      emailAddress: dto.emailAddress,
      phoneNumber: dto.phoneNumber,
      dob: dto.dob,
      accountType: AccountType.DYNAMIC,
      staticAccountNo,
    });

    this.handleResponseCode(response);

    const accountNo = String(response.AccountNo);

    const account = await this.prisma.virtualAccount.create({
      data: {
        userId,
        accountNo,
        accountType: 'DYNAMIC',
        bankName: 'Premium Trust Bank',
        bvn,
        metadata: { staticAccountNo, bvnResponse: response as object },
      },
    });

    this.logger.log(`Dynamic virtual account ${accountNo} created for user ${userId}`);
    return account;
  }

  async listAccounts(userId: string) {
    return this.prisma.virtualAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAccount(userId: string, accountNo: string) {
    const account = await this.prisma.virtualAccount.findUnique({
      where: { accountNo },
    });
    if (!account || account.userId !== userId) throw new NotFoundException('Account not found');
    return account;
  }

  private handleResponseCode(response: Record<string, unknown>) {
    const code = String(response.Code);
    const mapping = PREMIUMTRUST_RESPONSE_CODES[code as keyof typeof PREMIUMTRUST_RESPONSE_CODES];

    if (!mapping) {
      throw new UnprocessableEntityException(`Unknown PremiumTrust response code: ${code}`);
    }

    switch (code) {
      case '00':
        return;
      case '02':
        throw new ConflictException(mapping.message);
      case '03':
        throw new BadRequestException(mapping.message);
      case '04':
        throw new UnprocessableEntityException(mapping.message);
      case '08':
        throw new UnprocessableEntityException(mapping.message);
      default:
        throw new UnprocessableEntityException(`PremiumTrust error: ${code}`);
    }
  }
}
