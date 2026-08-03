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
exports.BeneficiariesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const beneficiaries_service_1 = require("./beneficiaries.service");
const beneficiaries_dto_1 = require("./beneficiaries.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BeneficiariesController = class BeneficiariesController {
    constructor(beneficiariesService) {
        this.beneficiariesService = beneficiariesService;
    }
    findAll(req) {
        return this.beneficiariesService.findAll(req.user.sub);
    }
    create(req, dto) {
        return this.beneficiariesService.create(req.user.sub, dto);
    }
    update(req, id, dto) {
        return this.beneficiariesService.update(req.user.sub, id, dto);
    }
    remove(req, id) {
        return this.beneficiariesService.remove(req.user.sub, id);
    }
};
exports.BeneficiariesController = BeneficiariesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List own beneficiaries', description: 'Returns all saved beneficiaries for the authenticated user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of beneficiaries' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BeneficiariesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add beneficiary', description: 'Saves a new beneficiary with bank account details for recurring transfers.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Beneficiary added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, beneficiaries_dto_1.CreateBeneficiaryDto]),
    __metadata("design:returntype", void 0)
], BeneficiariesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update beneficiary', description: 'Updates a saved beneficiary\'s details.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Beneficiary updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Beneficiary not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this beneficiary' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, beneficiaries_dto_1.UpdateBeneficiaryDto]),
    __metadata("design:returntype", void 0)
], BeneficiariesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete beneficiary', description: 'Removes a saved beneficiary.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Beneficiary deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Beneficiary not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this beneficiary' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BeneficiariesController.prototype, "remove", null);
exports.BeneficiariesController = BeneficiariesController = __decorate([
    (0, swagger_1.ApiTags)('Beneficiaries'),
    (0, common_1.Controller)('beneficiaries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [beneficiaries_service_1.BeneficiariesService])
], BeneficiariesController);
//# sourceMappingURL=beneficiaries.controller.js.map