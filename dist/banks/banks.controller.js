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
exports.BanksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const banks_service_1 = require("./banks.service");
const banks_dto_1 = require("./banks.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let BanksController = class BanksController {
    constructor(banksService) {
        this.banksService = banksService;
    }
    findAll() {
        return this.banksService.findAll();
    }
    findByCode(code) {
        return this.banksService.findByCode(code);
    }
    create(dto) {
        return this.banksService.create(dto);
    }
    update(id, dto) {
        return this.banksService.update(id, dto);
    }
};
exports.BanksController = BanksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all banks (public)', description: 'Returns all active banks. This endpoint is public and does not require authentication.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active banks' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BanksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bank by code (public)', description: 'Returns a bank by its unique code. This endpoint is public.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanksController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create bank (admin)', description: 'Creates a new bank entry in the directory. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bank created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banks_dto_1.CreateBankDto]),
    __metadata("design:returntype", void 0)
], BanksController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bank (admin)', description: 'Updates an existing bank entry. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, banks_dto_1.UpdateBankDto]),
    __metadata("design:returntype", void 0)
], BanksController.prototype, "update", null);
exports.BanksController = BanksController = __decorate([
    (0, swagger_1.ApiTags)('Banks'),
    (0, common_1.Controller)('banks'),
    __metadata("design:paramtypes", [banks_service_1.BanksService])
], BanksController);
//# sourceMappingURL=banks.controller.js.map