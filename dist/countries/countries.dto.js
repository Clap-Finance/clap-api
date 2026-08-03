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
exports.CreateCountryDto = exports.Currency = void 0;
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
class CreateCountryDto {
}
exports.CreateCountryDto = CreateCountryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NG', description: 'Unique ISO country code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nigeria', description: 'Country name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Currency, example: 'NGN', description: 'Country\'s primary currency' }),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'West Africa', description: 'Geographic region', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "region", void 0);
//# sourceMappingURL=countries.dto.js.map