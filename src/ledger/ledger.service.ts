import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLedgerAccountDto, CreateJournalDto, PaginationDto } from './ledger.dto';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async findAccounts() {
    return this.prisma.ledgerAccount.findMany({
      orderBy: { code: 'asc' },
      include: { _count: { select: { entries: true } } },
    });
  }

  async createAccount(dto: CreateLedgerAccountDto) {
    return this.prisma.ledgerAccount.create({
      data: {
        code: dto.code,
        name: dto.name,
        type: dto.type as any,
        currency: (dto.currency as any) || null,
      },
    });
  }

  async findJournals(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [journals, total] = await Promise.all([
      this.prisma.journal.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { entries: true } } },
      }),
      this.prisma.journal.count(),
    ]);

    return {
      data: journals,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getJournal(id: string) {
    const journal = await this.prisma.journal.findUnique({
      where: { id },
      include: {
        entries: { include: { account: true } },
      },
    });
    if (!journal) throw new NotFoundException('Journal not found');
    return journal;
  }

  async createJournal(dto: CreateJournalDto) {
    // Validate that debits equal credits
    const totalDebit = dto.entries.reduce((sum, e) => sum + Number(e.debit), 0);
    const totalCredit = dto.entries.reduce((sum, e) => sum + Number(e.credit), 0);
    if (totalDebit !== totalCredit) {
      throw new BadRequestException('Journal entries must balance: total debits must equal total credits');
    }

    return this.prisma.journal.create({
      data: {
        reference: dto.reference,
        description: dto.description,
        status: 'POSTED' as any,
        postedAt: new Date(),
        entries: {
          create: dto.entries.map((e) => ({
            accountId: e.accountId,
            debit: BigInt(e.debit),
            credit: BigInt(e.credit),
            currency: e.currency as any,
          })),
        },
      },
      include: { entries: { include: { account: true } } },
    });
  }
}
