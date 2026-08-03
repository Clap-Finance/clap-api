import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto, PaginationDto } from './wallets.dto';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async findMyWallets(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createWallet(userId: string, dto: CreateWalletDto) {
    const existing = await this.prisma.wallet.findFirst({
      where: { userId, currency: dto.currency as any },
    });
    if (existing) {
      throw new ConflictException(`Wallet for ${dto.currency} already exists`);
    }
    return this.prisma.wallet.create({
      data: { userId, currency: dto.currency as any },
    });
  }

  async getWallet(userId: string, id: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new ForbiddenException('Access denied to this wallet');
    return wallet;
  }

  async getStatement(userId: string, id: string, query: PaginationDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new ForbiddenException('Access denied to this wallet');

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId, currency: wallet.currency },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { userId, currency: wallet.currency } }),
    ]);

    return {
      wallet,
      transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async freezeWallet(id: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.prisma.wallet.update({
      where: { id },
      data: { status: 'FROZEN' as any },
    });
  }

  async unfreezeWallet(id: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.prisma.wallet.update({
      where: { id },
      data: { status: 'ACTIVE' as any },
    });
  }
}
