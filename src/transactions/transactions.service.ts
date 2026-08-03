import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransferDto, DepositDto, WithdrawDto, PaginationDto } from './transactions.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async transfer(userId: string, dto: TransferDto) {
    const fromWallet = await this.prisma.wallet.findUnique({ where: { id: dto.fromWalletId } });
    if (!fromWallet) throw new NotFoundException('Source wallet not found');
    if (fromWallet.userId !== userId) throw new ForbiddenException('Access denied to source wallet');
    if (fromWallet.status !== 'ACTIVE') throw new BadRequestException('Source wallet is not active');
    if (fromWallet.availableBalance < BigInt(dto.amount)) {
      throw new BadRequestException('Insufficient available balance');
    }

    const isInternal = !!dto.toWalletId;
    let toWallet: any = null;
    if (isInternal) {
      toWallet = await this.prisma.wallet.findUnique({ where: { id: dto.toWalletId } });
      if (!toWallet) throw new NotFoundException('Destination wallet not found');
      if (toWallet.status !== 'ACTIVE') throw new BadRequestException('Destination wallet is not active');
    }

    const reference = `TXN-${randomUUID()}`;
    const type = isInternal ? 'INTERNAL_TRANSFER' : 'TRANSFER';
    const direction = 'DEBIT' as any;

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: {
          balance: { decrement: BigInt(dto.amount) },
          availableBalance: { decrement: BigInt(dto.amount) },
        },
      });

      if (isInternal && toWallet) {
        await tx.wallet.update({
          where: { id: toWallet.id },
          data: {
            balance: { increment: BigInt(dto.amount) },
            availableBalance: { increment: BigInt(dto.amount) },
          },
        });
      }

      return tx.transaction.create({
        data: {
          reference,
          userId,
          type: type as any,
          status: 'COMPLETED' as any,
          direction,
          amount: BigInt(dto.amount),
          currency: dto.currency as any,
          description: dto.description || null,
          counterpartyName: dto.counterpartyName || null,
          counterpartyAccount: dto.counterpartyAccount || null,
          counterpartyBank: dto.counterpartyBank || null,
          counterpartyCountry: dto.counterpartyCountry || null,
          completedAt: new Date(),
        },
      });
    });
  }

  async deposit(userId: string, dto: DepositDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: dto.walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new ForbiddenException('Access denied to this wallet');
    if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is not active');

    const reference = `TXN-${randomUUID()}`;

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: BigInt(dto.amount) },
          availableBalance: { increment: BigInt(dto.amount) },
        },
      });

      return tx.transaction.create({
        data: {
          reference,
          userId,
          type: 'DEPOSIT' as any,
          status: 'COMPLETED' as any,
          direction: 'CREDIT' as any,
          amount: BigInt(dto.amount),
          currency: dto.currency as any,
          provider: dto.provider,
          providerRef: dto.providerRef || null,
          completedAt: new Date(),
        },
      });
    });
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: dto.walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new ForbiddenException('Access denied to this wallet');
    if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is not active');
    if (wallet.availableBalance < BigInt(dto.amount)) {
      throw new BadRequestException('Insufficient available balance');
    }

    const reference = `TXN-${randomUUID()}`;

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: BigInt(dto.amount) },
          availableBalance: { decrement: BigInt(dto.amount) },
        },
      });

      return tx.transaction.create({
        data: {
          reference,
          userId,
          type: 'WITHDRAWAL' as any,
          status: 'PENDING' as any,
          direction: 'DEBIT' as any,
          amount: BigInt(dto.amount),
          currency: dto.currency as any,
          counterpartyAccount: dto.accountNumber,
          counterpartyBank: dto.bankCode,
        },
      });
    });
  }

  async findAll(userId: string, query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      data: transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getTransaction(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.userId !== userId) throw new ForbiddenException('Access denied to this transaction');
    return transaction;
  }

  async cancel(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.userId !== userId) throw new ForbiddenException('Access denied to this transaction');
    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Only pending transactions can be cancelled');
    }

    // Reverse the wallet balance if this was a debit (withdrawal)
    if (transaction.direction === 'DEBIT') {
      const wallet = await this.prisma.wallet.findFirst({
        where: { userId, currency: transaction.currency },
      });
      if (wallet) {
        await this.prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: transaction.amount },
            availableBalance: { increment: transaction.amount },
          },
        });
      }
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
    });
  }
}
