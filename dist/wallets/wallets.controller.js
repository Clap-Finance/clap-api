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
exports.WalletsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallets_service_1 = require("./wallets.service");
const wallets_dto_1 = require("./wallets.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let WalletsController = class WalletsController {
    constructor(walletsService) {
        this.walletsService = walletsService;
    }
    findMyWallets(req) {
        return this.walletsService.findMyWallets(req.user.sub);
    }
    createWallet(req, dto) {
        return this.walletsService.createWallet(req.user.sub, dto);
    }
    getWallet(req, id) {
        return this.walletsService.getWallet(req.user.sub, id);
    }
    getStatement(req, id, query) {
        return this.walletsService.getStatement(req.user.sub, id, query);
    }
    freezeWallet(id) {
        return this.walletsService.freezeWallet(id);
    }
    unfreezeWallet(id) {
        return this.walletsService.unfreezeWallet(id);
    }
};
exports.WalletsController = WalletsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List own wallets', description: 'Returns all wallets belonging to the authenticated user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user wallets' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "findMyWallets", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create wallet', description: 'Creates a new wallet for the authenticated user in the specified currency.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wallet created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Wallet for this currency already exists' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.CreateWalletDto]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "createWallet", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet details', description: 'Returns details of a specific wallet owned by the authenticated user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this wallet' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)(':id/statement'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet statement', description: 'Returns the transaction statement for a specific wallet with pagination.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet statement with paginated transactions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, wallets_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "getStatement", null);
__decorate([
    (0, common_1.Post)(':id/freeze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Freeze wallet (admin)', description: 'Freezes a wallet, preventing transactions. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet frozen successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "freezeWallet", null);
__decorate([
    (0, common_1.Post)(':id/unfreeze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Unfreeze wallet (admin)', description: 'Unfreezes a wallet, re-enabling transactions. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet unfrozen successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "unfreezeWallet", null);
exports.WalletsController = WalletsController = __decorate([
    (0, swagger_1.ApiTags)('Wallets'),
    (0, common_1.Controller)('wallets'),
    __metadata("design:paramtypes", [wallets_service_1.WalletsService])
], WalletsController);
//# sourceMappingURL=wallets.controller.js.map