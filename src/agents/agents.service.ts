import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, CashInOutDto, PaginationDto } from './agents.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAgentDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.agent.findUnique({ where: { userId: dto.userId } });
    if (existing) throw new BadRequestException('User is already an agent');

    return this.prisma.agent.create({
      data: {
        userId: dto.userId,
        code: `AGT-${randomUUID().slice(0, 8).toUpperCase()}`,
        businessName: dto.businessName,
        location: dto.location || null,
        commissionRate: dto.commissionRate,
        dailyLimit: BigInt(dto.dailyLimit),
      },
    });
  }

  async findAll() {
    return this.prisma.agent.findMany({
      include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: string, dto: UpdateAgentDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');

    const data: any = {};
    if (dto.businessName !== undefined) data.businessName = dto.businessName;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.commissionRate !== undefined) data.commissionRate = dto.commissionRate;
    if (dto.dailyLimit !== undefined) data.dailyLimit = BigInt(dto.dailyLimit);
    if (dto.status !== undefined) data.status = dto.status as any;

    return this.prisma.agent.update({ where: { id }, data });
  }

  async findAgentTransactions(id: string, query: PaginationDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.agentTransaction.findMany({
        where: { agentId: id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.agentTransaction.count({ where: { agentId: id } }),
    ]);

    return {
      data: transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async cashIn(agentId: string, agentUserId: string, dto: CashInOutDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');
    if (agent.userId !== agentUserId) throw new ForbiddenException('You are not this agent');
    if (agent.status !== 'ACTIVE') throw new BadRequestException('Agent is not active');

    const commission = BigInt(Math.floor(Number(dto.amount) * Number(agent.commissionRate)));

    return this.prisma.$transaction(async (tx) => {
      // Credit customer wallet
      const customerWallet = await tx.wallet.findFirst({
        where: { userId: dto.userId, currency: dto.currency as any },
      });
      if (!customerWallet) throw new NotFoundException('Customer wallet not found');

      await tx.wallet.update({
        where: { id: customerWallet.id },
        data: {
          balance: { increment: BigInt(dto.amount) },
          availableBalance: { increment: BigInt(dto.amount) },
        },
      });

      // Update agent cash balance
      await tx.agent.update({
        where: { id: agentId },
        data: {
          cashBalance: { increment: BigInt(dto.amount) },
        },
      });

      return tx.agentTransaction.create({
        data: {
          agentId,
          userId: dto.userId,
          type: 'CASH_IN' as any,
          amount: BigInt(dto.amount),
          currency: dto.currency as any,
          commission,
          status: 'COMPLETED' as any,
          completedAt: new Date(),
        },
      });
    });
  }

  async cashOut(agentId: string, agentUserId: string, dto: CashInOutDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');
    if (agent.userId !== agentUserId) throw new ForbiddenException('You are not this agent');
    if (agent.status !== 'ACTIVE') throw new BadRequestException('Agent is not active');

    const commission = BigInt(Math.floor(Number(dto.amount) * Number(agent.commissionRate)));

    return this.prisma.$transaction(async (tx) => {
      // Debit customer wallet
      const customerWallet = await tx.wallet.findFirst({
        where: { userId: dto.userId, currency: dto.currency as any },
      });
      if (!customerWallet) throw new NotFoundException('Customer wallet not found');
      if (customerWallet.availableBalance < BigInt(dto.amount)) {
        throw new BadRequestException('Customer has insufficient balance');
      }

      await tx.wallet.update({
        where: { id: customerWallet.id },
        data: {
          balance: { decrement: BigInt(dto.amount) },
          availableBalance: { decrement: BigInt(dto.amount) },
        },
      });

      // Update agent cash balance
      await tx.agent.update({
        where: { id: agentId },
        data: {
          cashBalance: { decrement: BigInt(dto.amount) },
        },
      });

      return tx.agentTransaction.create({
        data: {
          agentId,
          userId: dto.userId,
          type: 'CASH_OUT' as any,
          amount: BigInt(dto.amount),
          currency: dto.currency as any,
          commission,
          status: 'COMPLETED' as any,
          completedAt: new Date(),
        },
      });
    });
  }
}
