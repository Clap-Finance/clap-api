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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("./transactions.service");
const transactions_dto_1 = require("./transactions.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    transfer(req, dto) {
        return this.transactionsService.transfer(req.user.sub, dto);
    }
    deposit(req, dto) {
        return this.transactionsService.deposit(req.user.sub, dto);
    }
    withdraw(req, dto) {
        return this.transactionsService.withdraw(req.user.sub, dto);
    }
    findAll(req, query) {
        return this.transactionsService.findAll(req.user.sub, query);
    }
    getTransaction(req, id) {
        return this.transactionsService.getTransaction(req.user.sub, id);
    }
    cancel(req, id) {
        return this.transactionsService.cancel(req.user.sub, id);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('transfer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer money', description: 'Transfers money from one wallet to another wallet or to counterparty bank details.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transfer completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance or inactive wallet' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transactions_dto_1.TransferDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)('deposit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Deposit', description: 'Deposits money into a wallet via a payment provider.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Deposit completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transactions_dto_1.DepositDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw', description: 'Withdraws money from a wallet to a bank account.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Withdrawal initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transactions_dto_1.WithdrawDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List own transactions', description: 'Returns a paginated list of the authenticated user\'s transactions.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of transactions' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transactions_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction details', description: 'Returns details of a specific transaction owned by the authenticated user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this transaction' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel pending transaction', description: 'Cancels a pending transaction and reverses any wallet balance changes.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending transactions can be cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "cancel", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map