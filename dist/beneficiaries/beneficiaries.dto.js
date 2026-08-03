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
exports.UpdateBeneficiaryDto = exports.CreateBeneficiaryDto = exports.Currency = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var Currency;
(function (Currency) {
    Currency["NGN"] = "NGN";
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
    Currency["GBP"] = "GBP";
    Currency["GHS"] = "GHS";
    Currency["KES"] = "KES";
    Currency["ZAR"] = "ZAR";
    Currency["XOF"] = "XOF";
})(Currency || (exports.Currency = Currency = {}));
class CreateBeneficiaryDto {
}
exports.CreateBeneficiaryDto = CreateBeneficiaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tunde Adeyemi', description: 'Beneficiary full name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0123456789', description: 'Beneficiary account number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '044', description: 'Bank code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Access Bank', description: 'Bank name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nigeria', description: 'Beneficiary country' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Beneficiary account currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Brother', description: 'Nickname for the beneficiary', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBeneficiaryDto.prototype, "nickname", void 0);
class UpdateBeneficiaryDto {
}
exports.UpdateBeneficiaryDto = UpdateBeneficiaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Beneficiary full name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Beneficiary account number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Beneficiary country', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, description: 'Beneficiary account currency', required: false }),
    (0, class_validator_1.IsEnum)(Currency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nickname for the beneficiary', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBeneficiaryDto.prototype, "nickname", void 0);
//# sourceMappingURL=beneficiaries.dto.js.map