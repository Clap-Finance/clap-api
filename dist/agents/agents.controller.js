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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agents_service_1 = require("./agents.service");
const agents_dto_1 = require("./agents.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    create(dto) {
        return this.agentsService.create(dto);
    }
    findAll() {
        return this.agentsService.findAll();
    }
    findOne(id) {
        return this.agentsService.findOne(id);
    }
    update(id, dto) {
        return this.agentsService.update(id, dto);
    }
    findAgentTransactions(id, query) {
        return this.agentsService.findAgentTransactions(id, query);
    }
    cashIn(req, id, dto) {
        return this.agentsService.cashIn(id, req.user.sub, dto);
    }
    cashOut(req, id, dto) {
        return this.agentsService.cashOut(id, req.user.sub, dto);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create agent (admin)', description: 'Designates a user as an agent with business details, commission rate, and daily limit. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agent created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User is already an agent' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agents_dto_1.CreateAgentDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List agents (admin)', description: 'Returns all agents with their associated user details. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agents' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent details (admin)', description: 'Returns details of a specific agent. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update agent (admin)', description: 'Updates agent details (business name, location, commission rate, daily limit, status). Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agents_dto_1.UpdateAgentDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List agent transactions (admin)', description: 'Returns a paginated list of transactions for a specific agent. Admin only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of agent transactions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agents_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findAgentTransactions", null);
__decorate([
    (0, common_1.Post)(':id/cash-in'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent cash in', description: 'Agent processes a cash-in for a customer. Credits the customer\'s wallet and updates the agent\'s cash balance.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cash-in completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent or customer wallet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not this agent' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agents_dto_1.CashInOutDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "cashIn", null);
__decorate([
    (0, common_1.Post)(':id/cash-out'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent cash out', description: 'Agent processes a cash-out for a customer. Debits the customer\'s wallet and updates the agent\'s cash balance.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cash-out completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Customer has insufficient balance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent or customer wallet not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not this agent' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, agents_dto_1.CashInOutDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "cashOut", null);
exports.AgentsController = AgentsController = __decorate([
    (0, swagger_1.ApiTags)('Agents'),
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map