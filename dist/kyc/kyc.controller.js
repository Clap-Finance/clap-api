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
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kyc_service_1 = require("./kyc.service");
const kyc_dto_1 = require("./kyc.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let KycController = class KycController {
    constructor(kycService) {
        this.kycService = kycService;
    }
    uploadDocument(req, dto) {
        return this.kycService.uploadDocument(req.user.sub, dto);
    }
    findMyDocuments(req) {
        return this.kycService.findMyDocuments(req.user.sub);
    }
    submitVerification(req, dto) {
        return this.kycService.submitVerification(req.user.sub, dto);
    }
    getStatus(req) {
        return this.kycService.getStatus(req.user.sub);
    }
    findAllVerifications(query) {
        return this.kycService.findAllVerifications(query);
    }
    approve(req, id) {
        return this.kycService.approve(id, req.user.sub);
    }
    reject(req, id, dto) {
        return this.kycService.reject(id, dto, req.user.sub);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Post)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload KYC document', description: 'Uploads a KYC document (BVN, NIN, passport, selfie, proof of address) with a storage URL.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.UploadKycDocumentDto]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List own KYC documents', description: 'Returns all KYC documents uploaded by the authenticated user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of KYC documents' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "findMyDocuments", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit KYC verification', description: 'Submits a KYC verification request for a specific tier with BVN, NIN, selfie, and proof of address.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'KYC verification submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pending verification already exists' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.SubmitKycVerificationDto]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC verification status', description: 'Returns the authenticated user\'s current KYC tier and verification status.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status returned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('verifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List all KYC verifications (admin)', description: 'Returns a paginated list of all KYC verifications. Admin only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of KYC verifications' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kyc_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "findAllVerifications", null);
__decorate([
    (0, common_1.Post)('verifications/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve KYC verification (admin)', description: 'Approves a pending KYC verification and upgrades the user\'s tier. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC verification approved and user tier updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Verification not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Verification is not pending' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('verifications/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject KYC verification (admin)', description: 'Rejects a pending KYC verification with a reason. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC verification rejected' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Verification not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Verification is not pending' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, kyc_dto_1.RejectKycDto]),
    __metadata("design:returntype", void 0)
], KycController.prototype, "reject", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('KYC'),
    (0, common_1.Controller)('kyc'),
    __metadata("design:paramtypes", [kyc_service_1.KycService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map