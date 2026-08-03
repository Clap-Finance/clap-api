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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const payments_dto_1 = require("./payments.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    findActiveProviders() {
        return this.paymentsService.findActiveProviders();
    }
    createProvider(dto) {
        return this.paymentsService.createProvider(dto);
    }
    updateProvider(id, dto) {
        return this.paymentsService.updateProvider(id, dto);
    }
    initiateTransfer(dto) {
        return this.paymentsService.initiateTransfer(dto);
    }
    verifyPayment(providerRef) {
        return this.paymentsService.verifyPayment(providerRef);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('providers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List active payment providers', description: 'Returns all active payment providers ordered by priority.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active payment providers' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findActiveProviders", null);
__decorate([
    (0, common_1.Post)('providers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment provider (admin)', description: 'Creates a new payment provider with configuration. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Provider created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payments_dto_1.CreateProviderDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update payment provider (admin)', description: 'Updates an existing payment provider. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Provider updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payments_dto_1.UpdateProviderDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateProvider", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate provider transfer', description: 'Initiates a transfer through a specific payment provider for a given transaction.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider or transaction not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payments_dto_1.ProviderTransferDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiateTransfer", null);
__decorate([
    (0, common_1.Get)('verify/:providerRef'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify payment status', description: 'Verifies the status of a payment by provider reference.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verification result' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found for this provider reference' }),
    __param(0, (0, common_1.Param)('providerRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map