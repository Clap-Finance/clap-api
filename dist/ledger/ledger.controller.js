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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ledger_service_1 = require("./ledger.service");
const ledger_dto_1 = require("./ledger.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let LedgerController = class LedgerController {
    constructor(ledgerService) {
        this.ledgerService = ledgerService;
    }
    findAccounts() {
        return this.ledgerService.findAccounts();
    }
    createAccount(dto) {
        return this.ledgerService.createAccount(dto);
    }
    findJournals(query) {
        return this.ledgerService.findJournals(query);
    }
    getJournal(id) {
        return this.ledgerService.getJournal(id);
    }
    createJournal(dto) {
        return this.ledgerService.createJournal(dto);
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, common_1.Get)('accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List ledger accounts', description: 'Returns all ledger accounts with entry counts.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ledger accounts' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "findAccounts", null);
__decorate([
    (0, common_1.Post)('accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create ledger account (admin)', description: 'Creates a new ledger account with a unique code, name, type, and optional currency. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ledger account created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ledger_dto_1.CreateLedgerAccountDto]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)('journals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List journals (admin)', description: 'Returns a paginated list of all journal entries. Admin only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of journals' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ledger_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "findJournals", null);
__decorate([
    (0, common_1.Get)('journals/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get journal with entries (admin)', description: 'Returns a single journal with all its ledger entries. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journal with entries' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Journal not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getJournal", null);
__decorate([
    (0, common_1.Post)('journals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create journal entry (admin)', description: 'Creates a new double-entry journal. Debits must equal credits. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Journal created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Entries do not balance' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ledger_dto_1.CreateJournalDto]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "createJournal", null);
exports.LedgerController = LedgerController = __decorate([
    (0, swagger_1.ApiTags)('Ledger'),
    (0, common_1.Controller)('ledger'),
    __metadata("design:paramtypes", [ledger_service_1.LedgerService])
], LedgerController);
//# sourceMappingURL=ledger.controller.js.map