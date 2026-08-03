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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = exports.ScreenNameDto = exports.CreateComplianceCheckDto = exports.ComplianceCheckType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ComplianceCheckType;
(function (ComplianceCheckType) {
    ComplianceCheckType["AML"] = "AML";
    ComplianceCheckType["PEP"] = "PEP";
    ComplianceCheckType["SANCTIONS"] = "SANCTIONS";
    ComplianceCheckType["VELOCITY"] = "VELOCITY";
    ComplianceCheckType["FRAUD"] = "FRAUD";
    ComplianceCheckType["BLACKLIST"] = "BLACKLIST";
})(ComplianceCheckType || (exports.ComplianceCheckType = ComplianceCheckType = {}));
class CreateComplianceCheckDto {
}
exports.CreateComplianceCheckDto = CreateComplianceCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID to check', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceCheckDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID to check', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplianceCheckDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ComplianceCheckType, example: 'AML', description: 'Type of compliance check' }),
    (0, class_validator_1.IsEnum)(ComplianceCheckType),
    __metadata("design:type", String)
], CreateComplianceCheckDto.prototype, "checkType", void 0);
class ScreenNameDto {
}
exports.ScreenNameDto = ScreenNameDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tunde', description: 'First name to screen' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScreenNameDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Adeyemi', description: 'Last name to screen' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScreenNameDto.prototype, "lastName", void 0);
class PaginationDto {
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Page number', default: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20, description: 'Items per page', default: 20, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
//# sourceMappingURL=compliance.dto.js.map