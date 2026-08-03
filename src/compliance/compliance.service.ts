import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceCheckDto, ScreenNameDto, PaginationDto } from './compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async findChecks(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [checks, total] = await Promise.all([
      this.prisma.complianceCheck.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.complianceCheck.count(),
    ]);

    return {
      data: checks,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createCheck(dto: CreateComplianceCheckDto) {
    return this.prisma.complianceCheck.create({
      data: {
        userId: dto.userId || null,
        transactionId: dto.transactionId || null,
        checkType: dto.checkType as any,
        status: 'PENDING' as any,
      },
    });
  }

  async screenName(dto: ScreenNameDto) {
    const matchKey = `${dto.firstName.toLowerCase()}:${dto.lastName.toLowerCase()}`;

    const matches = await this.prisma.sanctionEntry.findMany({
      where: {
        matchKey,
      },
    });

    // Also try fuzzy match on individual name parts
    const partialMatches = await this.prisma.sanctionEntry.findMany({
      where: {
        OR: [
          { firstName: { contains: dto.firstName, mode: 'insensitive' } },
          { lastName: { contains: dto.lastName, mode: 'insensitive' } },
        ],
      },
      take: 50,
    });

    return {
      screenedName: `${dto.firstName} ${dto.lastName}`,
      exactMatches: matches,
      partialMatches: partialMatches.filter(
        (m) => !matches.some((em) => em.id === m.id),
      ),
      isFlagged: matches.length > 0 || partialMatches.length > 0,
    };
  }

  async findSanctions() {
    return this.prisma.sanctionEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
