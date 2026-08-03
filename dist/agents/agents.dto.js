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
exports.PaginationDto = exports.CashInOutDto = exports.UpdateAgentDto = exports.CreateAgentDto = exports.Currency = void 0;
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
class CreateAgentDto {
}
exports.CreateAgentDto = CreateAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID to designate as agent' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tunde Cash Point', description: 'Business name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lagos Island, Nigeria', description: 'Business location', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.02, description: 'Commission rate (e.g. 0.02 = 2%)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "commissionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, description: 'Daily transaction limit in minor units' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "dailyLimit", void 0);
class UpdateAgentDto {
}
exports.UpdateAgentDto = UpdateAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business location', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Commission rate', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAgentDto.prototype, "commissionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Daily transaction limit in minor units', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAgentDto.prototype, "dailyLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent status', required: false, enum: ['ACTIVE', 'SUSPENDED', 'TERMINATED'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "status", void 0);
class CashInOutDto {
}
exports.CashInOutDto = CashInOutDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the customer' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CashInOutDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Amount in minor units', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CashInOutDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Currency' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CashInOutDto.prototype, "currency", void 0);
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
//# sourceMappingURL=agents.dto.js.map