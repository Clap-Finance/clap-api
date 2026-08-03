import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeRoleDto, PaginationDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalUsers, totalTransactions, transactions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.transaction.count(),
      this.prisma.transaction.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true, currency: true },
      }),
    ]);

    // Calculate total volume per currency
    const volumeByCurrency: Record<string, bigint> = {};
    for (const tx of transactions) {
      const key = tx.currency as string;
      volumeByCurrency[key] = (volumeByCurrency[key] || BigInt(0)) + tx.amount;
    }

    return {
      totalUsers,
      totalTransactions,
      totalVolume: Object.fromEntries(
        Object.entries(volumeByCurrency).map(([k, v]) => [k, v.toString()]),
      ),
    };
  }

  async findAllUsers(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map(({ passwordHash, ...u }) => u),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllTransactions(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      }),
      this.prisma.transaction.count(),
    ]);

    return {
      data: transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAuditLogs(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      data: logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async suspendUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' as any },
    });
  }

  async activateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' as any },
    });
  }

  async changeRole(id: string, dto: ChangeRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role as any },
    });
  }
}
