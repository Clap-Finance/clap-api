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
exports.PaginationDto = exports.RejectKycDto = exports.SubmitKycVerificationDto = exports.UploadKycDocumentDto = exports.Tier = exports.KycDocumentType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var KycDocumentType;
(function (KycDocumentType) {
    KycDocumentType["BVN"] = "BVN";
    KycDocumentType["NIN"] = "NIN";
    KycDocumentType["PASSPORT"] = "PASSPORT";
    KycDocumentType["DRIVERS_LICENSE"] = "DRIVERS_LICENSE";
    KycDocumentType["SELFIE"] = "SELFIE";
    KycDocumentType["PROOF_OF_ADDRESS"] = "PROOF_OF_ADDRESS";
})(KycDocumentType || (exports.KycDocumentType = KycDocumentType = {}));
var Tier;
(function (Tier) {
    Tier["TIER_0"] = "TIER_0";
    Tier["TIER_1"] = "TIER_1";
    Tier["TIER_2"] = "TIER_2";
    Tier["TIER_3"] = "TIER_3";
})(Tier || (exports.Tier = Tier = {}));
class UploadKycDocumentDto {
}
exports.UploadKycDocumentDto = UploadKycDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: KycDocumentType, example: 'BVN', description: 'Type of KYC document' }),
    (0, class_validator_1.IsEnum)(KycDocumentType),
    __metadata("design:type", String)
], UploadKycDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678901', description: 'Document number (e.g. BVN, NIN)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadKycDocumentDto.prototype, "documentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/kyc/bvn-abc123.pdf', description: 'Storage URL for the uploaded document' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadKycDocumentDto.prototype, "storageUrl", void 0);
class SubmitKycVerificationDto {
}
exports.SubmitKycVerificationDto = SubmitKycVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Tier, example: 'TIER_1', description: 'KYC tier to apply for' }),
    (0, class_validator_1.IsEnum)(Tier),
    __metadata("design:type", String)
], SubmitKycVerificationDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678901', description: 'Bank Verification Number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitKycVerificationDto.prototype, "bvn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678901', description: 'National Identification Number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitKycVerificationDto.prototype, "nin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/kyc/selfie-abc123.jpg', description: 'Selfie photo URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitKycVerificationDto.prototype, "selfieUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/kyc/poa-abc123.pdf', description: 'Proof of address document URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitKycVerificationDto.prototype, "proofOfAddressUrl", void 0);
class RejectKycDto {
}
exports.RejectKycDto = RejectKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Document image is blurry and unreadable', description: 'Reason for rejection' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectKycDto.prototype, "reason", void 0);
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
//# sourceMappingURL=kyc.dto.js.map