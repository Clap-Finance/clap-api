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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
const webhooks_dto_1 = require("./webhooks.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let WebhooksController = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    receiveWebhook(providerCode, body, req) {
        const signature = req.headers['x-webhook-signature'] || req.headers['x-paystack-signature'] || undefined;
        return this.webhooksService.receiveWebhook(providerCode, body, signature);
    }
    findAll(query) {
        return this.webhooksService.findAll(query);
    }
    findOne(id) {
        return this.webhooksService.findOne(id);
    }
    replay(id) {
        return this.webhooksService.replay(id);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)(':providerCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive webhook from provider (public)', description: 'Receives an incoming webhook event from a payment provider. This endpoint is public and does not require authentication. The raw body is stored for processing.' }),
    (0, swagger_1.ApiBody)({ description: 'Raw webhook payload from the provider (any JSON structure)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Webhook event received and stored' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Unknown provider' }),
    __param(0, (0, common_1.Param)('providerCode')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "receiveWebhook", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List webhook events (admin)', description: 'Returns a paginated list of all webhook events. Admin only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of webhook events' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhooks_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get webhook event details (admin)', description: 'Returns details of a specific webhook event. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook event details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Webhook event not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/replay'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Replay webhook event (admin)', description: 'Re-queues a webhook event for reprocessing. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook event queued for replay' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Webhook event not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "replay", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map