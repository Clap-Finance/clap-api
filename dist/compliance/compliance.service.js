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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComplianceService = class ComplianceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findChecks(query) {
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
    async createCheck(dto) {
        return this.prisma.complianceCheck.create({
            data: {
                userId: dto.userId || null,
                transactionId: dto.transactionId || null,
                checkType: dto.checkType,
                status: 'PENDING',
            },
        });
    }
    async screenName(dto) {
        const matchKey = `${dto.firstName.toLowerCase()}:${dto.lastName.toLowerCase()}`;
        const matches = await this.prisma.sanctionEntry.findMany({
            where: {
                matchKey,
            },
        });
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
            partialMatches: partialMatches.filter((m) => !matches.some((em) => em.id === m.id)),
            isFlagged: matches.length > 0 || partialMatches.length > 0,
        };
    }
    async findSanctions() {
        return this.prisma.sanctionEntry.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map