import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './countries.dto';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByCode(code: string) {
    const country = await this.prisma.country.findUnique({ where: { code } });
    if (!country) throw new NotFoundException(`Country with code ${code} not found`);
    return country;
  }

  async create(dto: CreateCountryDto) {
    return this.prisma.country.create({
      data: {
        code: dto.code,
        name: dto.name,
        currency: dto.currency as any,
        region: dto.region || null,
      },
    });
  }
}
