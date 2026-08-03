import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFxQuoteDto, FxConvertDto } from './fx.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class FxService {
  constructor(private prisma: PrismaService) {}

  async getRates() {
    return this.prisma.exchangeRate.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getRate(base: string, quote: string) {
    const rate = await this.prisma.exchangeRate.findUnique({
      where: {
        baseCurrency_quoteCurrency: {
          baseCurrency: base as any,
          quoteCurrency: quote as any,
        },
      },
    });
    if (!rate) throw new NotFoundException(`No rate found for ${base}/${quote}`);
    return rate;
  }

  async createQuote(userId: string, dto: CreateFxQuoteDto) {
    if (dto.fromCurrency === dto.toCurrency) {
      throw new BadRequestException('fromCurrency and toCurrency must be different');
    }

    const rate = await this.prisma.exchangeRate.findUnique({
      where: {
        baseCurrency_quoteCurrency: {
          baseCurrency: dto.fromCurrency as any,
          quoteCurrency: dto.toCurrency as any,
        },
      },
    });
    if (!rate) {
      throw new NotFoundException(`No exchange rate found for ${dto.fromCurrency}/${dto.toCurrency}`);
    }

    const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds
    const convertedAmount = BigInt(Math.floor(Number(dto.amount) * Number(rate.rate)));

    return this.prisma.fxQuote.create({
      data: {
        userId,
        fromCurrency: dto.fromCurrency as any,
        toCurrency: dto.toCurrency as any,
        amount: BigInt(dto.amount),
        rate: rate.rate,
        fee: BigInt(0),
        expiresAt,
        status: 'OPEN' as any,
      },
    });
  }

  async convert(userId: string, dto: FxConvertDto) {
    const quote = await this.prisma.fxQuote.findUnique({ where: { id: dto.quoteId } });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.status !== 'OPEN') throw new BadRequestException('Quote is no longer open');
    if (quote.expiresAt < new Date()) {
      await this.prisma.fxQuote.update({
        where: { id: quote.id },
        data: { status: 'EXPIRED' as any },
      });
      throw new BadRequestException('Quote has expired');
    }

    const fromWallet = await this.prisma.wallet.findUnique({ where: { id: dto.fromWalletId } });
    if (!fromWallet) throw new NotFoundException('Source wallet not found');
    if (fromWallet.userId !== userId) throw new ForbiddenException('Access denied to source wallet');
    if (fromWallet.currency !== quote.fromCurrency) {
      throw new BadRequestException('Source wallet currency does not match quote');
    }
    if (fromWallet.availableBalance < quote.amount) {
      throw new BadRequestException('Insufficient available balance');
    }

    const toWallet = await this.prisma.wallet.findUnique({ where: { id: dto.toWalletId } });
    if (!toWallet) throw new NotFoundException('Destination wallet not found');
    if (toWallet.userId !== userId) throw new ForbiddenException('Access denied to destination wallet');
    if (toWallet.currency !== quote.toCurrency) {
      throw new BadRequestException('Destination wallet currency does not match quote');
    }

    const convertedAmount = BigInt(Math.floor(Number(quote.amount) * Number(quote.rate)));
    const reference = `FX-${randomUUID()}`;

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: {
          balance: { decrement: quote.amount },
          availableBalance: { decrement: quote.amount },
        },
      });

      await tx.wallet.update({
        where: { id: toWallet.id },
        data: {
          balance: { increment: convertedAmount },
          availableBalance: { increment: convertedAmount },
        },
      });

      await tx.fxQuote.update({
        where: { id: quote.id },
        data: { status: 'USED' as any },
      });

      return tx.transaction.create({
        data: {
          reference,
          userId,
          type: 'FX' as any,
          status: 'COMPLETED' as any,
          direction: 'DEBIT' as any,
          amount: quote.amount,
          currency: quote.fromCurrency as any,
          fromCurrency: quote.fromCurrency as any,
          toCurrency: quote.toCurrency as any,
          exchangeRate: quote.rate,
          completedAt: new Date(),
        },
      });
    });
  }
}
