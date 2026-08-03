"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BanksService = class BanksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.bank.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findByCode(code) {
        const bank = await this.prisma.bank.findUnique({ where: { code } });
        if (!bank)
            throw new common_1.NotFoundException(`Bank with code ${code} not found`);
        return bank;
    }
    async create(dto) {
        return this.prisma.bank.create({
            data: {
                code: dto.code,
                name: dto.name,
                country: dto.country,
                currency: dto.currency,
            },
        });
    }
    async update(id, dto) {
        const bank = await this.prisma.bank.findUnique({ where: { id } });
        if (!bank)
            throw new common_1.NotFoundException('Bank not found');
        return this.prisma.bank.update({
            where: { id },
            data: {
                name: dto.name,
                country: dto.country,
                currency: dto.currency,
                isActive: dto.isActive,
            },
        });
    }
};
exports.BanksService = BanksService;
exports.BanksService = BanksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BanksService);
//# sourceMappingURL=banks.service.js.map