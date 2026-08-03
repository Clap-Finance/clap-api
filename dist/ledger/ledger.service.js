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
exports.LedgerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LedgerService = class LedgerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAccounts() {
        return this.prisma.ledgerAccount.findMany({
            orderBy: { code: 'asc' },
            include: { _count: { select: { entries: true } } },
        });
    }
    async createAccount(dto) {
        return this.prisma.ledgerAccount.create({
            data: {
                code: dto.code,
                name: dto.name,
                type: dto.type,
                currency: dto.currency || null,
            },
        });
    }
    async findJournals(query) {
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
    async getJournal(id) {
        const journal = await this.prisma.journal.findUnique({
            where: { id },
            include: {
                entries: { include: { account: true } },
            },
        });
        if (!journal)
            throw new common_1.NotFoundException('Journal not found');
        return journal;
    }
    async createJournal(dto) {
        const totalDebit = dto.entries.reduce((sum, e) => sum + Number(e.debit), 0);
        const totalCredit = dto.entries.reduce((sum, e) => sum + Number(e.credit), 0);
        if (totalDebit !== totalCredit) {
            throw new common_1.BadRequestException('Journal entries must balance: total debits must equal total credits');
        }
        return this.prisma.journal.create({
            data: {
                reference: dto.reference,
                description: dto.description,
                status: 'POSTED',
                postedAt: new Date(),
                entries: {
                    create: dto.entries.map((e) => ({
                        accountId: e.accountId,
                        debit: BigInt(e.debit),
                        credit: BigInt(e.credit),
                        currency: e.currency,
                    })),
                },
            },
            include: { entries: { include: { account: true } } },
        });
    }
};
exports.LedgerService = LedgerService;
exports.LedgerService = LedgerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LedgerService);
//# sourceMappingURL=ledger.service.js.map