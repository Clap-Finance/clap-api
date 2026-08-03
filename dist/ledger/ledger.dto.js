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
exports.PaginationDto = exports.CreateJournalDto = exports.LedgerEntryDto = exports.CreateLedgerAccountDto = exports.Currency = exports.LedgerAccountType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var LedgerAccountType;
(function (LedgerAccountType) {
    LedgerAccountType["ASSET"] = "ASSET";
    LedgerAccountType["LIABILITY"] = "LIABILITY";
    LedgerAccountType["EQUITY"] = "EQUITY";
    LedgerAccountType["REVENUE"] = "REVENUE";
    LedgerAccountType["EXPENSE"] = "EXPENSE";
})(LedgerAccountType || (exports.LedgerAccountType = LedgerAccountType = {}));
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
class CreateLedgerAccountDto {
}
exports.CreateLedgerAccountDto = CreateLedgerAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WALLET_NGN', description: 'Unique account code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLedgerAccountDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGN Wallet Liability', description: 'Account name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLedgerAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: LedgerAccountType, example: 'LIABILITY', description: 'Account type' }),
    (0, class_validator_1.IsEnum)(LedgerAccountType),
    __metadata("design:type", String)
], CreateLedgerAccountDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Account currency', required: false }),
    (0, class_validator_1.IsEnum)(Currency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLedgerAccountDto.prototype, "currency", void 0);
class LedgerEntryDto {
}
exports.LedgerEntryDto = LedgerEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ledger account ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LedgerEntryDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Debit amount in minor units' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LedgerEntryDto.prototype, "debit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Credit amount in minor units' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LedgerEntryDto.prototype, "credit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Entry currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], LedgerEntryDto.prototype, "currency", void 0);
class CreateJournalDto {
}
exports.CreateJournalDto = CreateJournalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TXN-abc123', description: 'Unique reference for the journal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Transfer from NGN wallet to USD wallet', description: 'Journal description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [LedgerEntryDto], description: 'Ledger entries (must balance: total debits = total credits)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LedgerEntryDto),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "entries", void 0);
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
//# sourceMappingURL=ledger.dto.js.map