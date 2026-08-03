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
exports.FxConvertDto = exports.CreateFxQuoteDto = exports.Currency = void 0;
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
class CreateFxQuoteDto {
}
exports.CreateFxQuoteDto = CreateFxQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Source currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], CreateFxQuoteDto.prototype, "fromCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'USD', description: 'Destination currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], CreateFxQuoteDto.prototype, "toCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Amount in minor units of the source currency', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFxQuoteDto.prototype, "amount", void 0);
class FxConvertDto {
}
exports.FxConvertDto = FxConvertDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FX quote ID (must be valid and not expired)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FxConvertDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source wallet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FxConvertDto.prototype, "fromWalletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination wallet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FxConvertDto.prototype, "toWalletId", void 0);
//# sourceMappingURL=fx.dto.js.map