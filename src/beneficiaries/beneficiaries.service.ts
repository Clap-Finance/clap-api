import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';

@Injectable()
export class BeneficiariesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateBeneficiaryDto) {
    return this.prisma.beneficiary.create({
      data: {
        userId,
        name: dto.name,
        accountNumber: dto.accountNumber,
        bankCode: dto.bankCode || null,
        bankName: dto.bankName || null,
        country: dto.country,
        currency: dto.currency as any,
        nickname: dto.nickname || null,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateBeneficiaryDto) {
    const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id } });
    if (!beneficiary) throw new NotFoundException('Beneficiary not found');
    if (beneficiary.userId !== userId) throw new ForbiddenException('Access denied to this beneficiary');

    return this.prisma.beneficiary.update({
      where: { id },
      data: {
        name: dto.name,
        accountNumber: dto.accountNumber,
        bankCode: dto.bankCode,
        bankName: dto.bankName,
        country: dto.country,
        currency: dto.currency as any,
        nickname: dto.nickname,
      },
    });
  }

  async remove(userId: string, id: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id } });
    if (!beneficiary) throw new NotFoundException('Beneficiary not found');
    if (beneficiary.userId !== userId) throw new ForbiddenException('Access denied to this beneficiary');

    return this.prisma.beneficiary.delete({ where: { id } });
  }
}
