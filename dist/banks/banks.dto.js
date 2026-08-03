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
exports.UpdateBankDto = exports.CreateBankDto = exports.Currency = void 0;
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
class CreateBankDto {
}
exports.CreateBankDto = CreateBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '044', description: 'Unique bank code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Access Bank', description: 'Bank name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nigeria', description: 'Country where the bank operates' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Bank\'s primary currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], CreateBankDto.prototype, "currency", void 0);
class UpdateBankDto {
}
exports.UpdateBankDto = UpdateBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country where the bank operates', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, description: 'Bank\'s primary currency', required: false }),
    (0, class_validator_1.IsEnum)(Currency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the bank is active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBankDto.prototype, "isActive", void 0);
//# sourceMappingURL=banks.dto.js.map