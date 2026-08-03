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
exports.PaginatedResponseDto = exports.PaginationDto = exports.NotificationChannel = exports.Role = exports.Tier = exports.TransactionStatus = exports.TransactionType = exports.Currency = void 0;
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
var TransactionType;
(function (TransactionType) {
    TransactionType["TRANSFER"] = "TRANSFER";
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["FX"] = "FX";
    TransactionType["AGENT_PAYMENT"] = "AGENT_PAYMENT";
    TransactionType["INTERNAL_TRANSFER"] = "INTERNAL_TRANSFER";
    TransactionType["INTERNATIONAL_TRANSFER"] = "INTERNATIONAL_TRANSFER";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["PROCESSING"] = "PROCESSING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
    TransactionStatus["REVERSED"] = "REVERSED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var Tier;
(function (Tier) {
    Tier["TIER_0"] = "TIER_0";
    Tier["TIER_1"] = "TIER_1";
    Tier["TIER_2"] = "TIER_2";
    Tier["TIER_3"] = "TIER_3";
})(Tier || (exports.Tier = Tier = {}));
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
    Role["SUPPORT"] = "SUPPORT";
    Role["COMPLIANCE"] = "COMPLIANCE";
    Role["FINANCE"] = "FINANCE";
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["IN_APP"] = "IN_APP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
class PaginationDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20, description: 'Items per page' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
class PaginatedResponseDto {
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of items' }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of items' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=common.dto.js.map