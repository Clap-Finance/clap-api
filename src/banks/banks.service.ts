import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';

@Injectable()
export class BanksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.bank.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByCode(code: string) {
    const bank = await this.prisma.bank.findUnique({ where: { code } });
    if (!bank) throw new NotFoundException(`Bank with code ${code} not found`);
    return bank;
  }

  async create(dto: CreateBankDto) {
    return this.prisma.bank.create({
      data: {
        code: dto.code,
        name: dto.name,
        country: dto.country,
        currency: dto.currency as any,
      },
    });
  }

  async update(id: string, dto: UpdateBankDto) {
    const bank = await this.prisma.bank.findUnique({ where: { id } });
    if (!bank) throw new NotFoundException('Bank not found');
    return this.prisma.bank.update({
      where: { id },
      data: {
        name: dto.name,
        country: dto.country,
        currency: dto.currency as any,
        isActive: dto.isActive,
      },
    });
  }
}
