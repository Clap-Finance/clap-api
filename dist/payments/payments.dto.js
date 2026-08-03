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
exports.ProviderTransferDto = exports.UpdateProviderDto = exports.CreateProviderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProviderDto {
}
exports.CreateProviderDto = CreateProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paystack', description: 'Provider display name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paystack', description: 'Unique provider code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { apiKey: 'sk_***', secret: '***' }, description: 'Provider configuration (JSON)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateProviderDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Priority (lower = higher priority)', required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProviderDto.prototype, "priority", void 0);
class UpdateProviderDto {
}
exports.UpdateProviderDto = UpdateProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider display name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider configuration (JSON)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateProviderDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority (lower = higher priority)', required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProviderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the provider is active', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProviderDto.prototype, "isActive", void 0);
class ProviderTransferDto {
}
exports.ProviderTransferDto = ProviderTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paystack', description: 'Provider code to use for the transfer' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProviderTransferDto.prototype, "providerCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID to process via the provider' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProviderTransferDto.prototype, "transactionId", void 0);
//# sourceMappingURL=payments.dto.js.map