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
exports.PaginationDto = exports.WithdrawDto = exports.DepositDto = exports.TransferDto = exports.Currency = void 0;
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
class TransferDto {
}
exports.TransferDto = TransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source wallet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferDto.prototype, "fromWalletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination wallet ID (for internal transfers)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "toWalletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Amount in minor units', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TransferDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Transaction currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], TransferDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rent payment', description: 'Transaction description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Counterparty name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "counterpartyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Counterparty account number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "counterpartyAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Counterparty bank code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "counterpartyBank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Counterparty country', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "counterpartyCountry", void 0);
class DepositDto {
}
exports.DepositDto = DepositDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination wallet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Amount in minor units', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DepositDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Deposit currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], DepositDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paystack', description: 'Payment provider code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ref-abc123', description: 'Provider reference', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepositDto.prototype, "providerRef", void 0);
class WithdrawDto {
}
exports.WithdrawDto = WithdrawDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source wallet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Amount in minor units', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], WithdrawDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Withdrawal currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], WithdrawDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '044', description: 'Bank code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0123456789', description: 'Bank account number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "accountNumber", void 0);
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
//# sourceMappingURL=transactions.dto.js.map