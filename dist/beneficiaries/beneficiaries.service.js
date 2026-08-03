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
exports.BeneficiariesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BeneficiariesService = class BeneficiariesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.beneficiary.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userId, dto) {
        return this.prisma.beneficiary.create({
            data: {
                userId,
                name: dto.name,
                accountNumber: dto.accountNumber,
                bankCode: dto.bankCode || null,
                bankName: dto.bankName || null,
                country: dto.country,
                currency: dto.currency,
                nickname: dto.nickname || null,
            },
        });
    }
    async update(userId, id, dto) {
        const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id } });
        if (!beneficiary)
            throw new common_1.NotFoundException('Beneficiary not found');
        if (beneficiary.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this beneficiary');
        return this.prisma.beneficiary.update({
            where: { id },
            data: {
                name: dto.name,
                accountNumber: dto.accountNumber,
                bankCode: dto.bankCode,
                bankName: dto.bankName,
                country: dto.country,
                currency: dto.currency,
                nickname: dto.nickname,
            },
        });
    }
    async remove(userId, id) {
        const beneficiary = await this.prisma.beneficiary.findUnique({ where: { id } });
        if (!beneficiary)
            throw new common_1.NotFoundException('Beneficiary not found');
        if (beneficiary.userId !== userId)
            throw new common_1.ForbiddenException('Access denied to this beneficiary');
        return this.prisma.beneficiary.delete({ where: { id } });
    }
};
exports.BeneficiariesService = BeneficiariesService;
exports.BeneficiariesService = BeneficiariesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BeneficiariesService);
//# sourceMappingURL=beneficiaries.service.js.map