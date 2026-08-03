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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compliance_service_1 = require("./compliance.service");
const compliance_dto_1 = require("./compliance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    findChecks(query) {
        return this.complianceService.findChecks(query);
    }
    createCheck(dto) {
        return this.complianceService.createCheck(dto);
    }
    screenName(dto) {
        return this.complianceService.screenName(dto);
    }
    findSanctions() {
        return this.complianceService.findSanctions();
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('checks'),
    (0, swagger_1.ApiOperation)({ summary: 'List compliance checks (admin)', description: 'Returns a paginated list of all compliance checks. Admin/Compliance role only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of compliance checks' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin/compliance role required' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "findChecks", null);
__decorate([
    (0, common_1.Post)('checks'),
    (0, swagger_1.ApiOperation)({ summary: 'Create compliance check (admin)', description: 'Creates a new compliance check for a user or transaction. Admin/Compliance role only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Compliance check created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin/compliance role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.CreateComplianceCheckDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "createCheck", null);
__decorate([
    (0, common_1.Post)('screen'),
    (0, swagger_1.ApiOperation)({ summary: 'Screen a name against sanctions (admin)', description: 'Screens a first and last name against the sanctions list. Returns exact and partial matches. Admin/Compliance role only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Screening result with matches' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin/compliance role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.ScreenNameDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "screenName", null);
__decorate([
    (0, common_1.Get)('sanctions'),
    (0, swagger_1.ApiOperation)({ summary: 'List sanction entries (admin)', description: 'Returns all sanction entries in the database. Admin/Compliance role only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sanction entries' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin/compliance role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "findSanctions", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Compliance'),
    (0, common_1.Controller)('compliance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN', 'COMPLIANCE'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map