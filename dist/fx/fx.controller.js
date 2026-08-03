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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fx_service_1 = require("./fx.service");
const fx_dto_1 = require("./fx.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FxController = class FxController {
    constructor(fxService) {
        this.fxService = fxService;
    }
    getRates() {
        return this.fxService.getRates();
    }
    getRate(base, quote) {
        return this.fxService.getRate(base, quote);
    }
    createQuote(req, dto) {
        return this.fxService.createQuote(req.user.sub, dto);
    }
    convert(req, dto) {
        return this.fxService.convert(req.user.sub, dto);
    }
};
exports.FxController = FxController;
__decorate([
    (0, common_1.Get)('rates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'List all exchange rates', description: 'Returns all available exchange rates.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of exchange rates' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FxController.prototype, "getRates", null);
__decorate([
    (0, common_1.Get)('rates/:base/:quote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific rate', description: 'Returns the exchange rate for a specific currency pair.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exchange rate for the pair' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rate not found for this pair' }),
    __param(0, (0, common_1.Param)('base')),
    __param(1, (0, common_1.Param)('quote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FxController.prototype, "getRate", null);
__decorate([
    (0, common_1.Post)('quote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create FX quote', description: 'Creates a new FX quote with a 30-second expiry. The quote locks in the exchange rate for the duration.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FX quote created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No exchange rate found for this pair' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid currency pair' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fx_dto_1.CreateFxQuoteDto]),
    __metadata("design:returntype", void 0)
], FxController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Post)('convert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute FX conversion', description: 'Executes an FX conversion using a valid, non-expired quote. Debits the source wallet and credits the destination wallet.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FX conversion completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Quote expired, already used, or wallet currency mismatch' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quote or wallet not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fx_dto_1.FxConvertDto]),
    __metadata("design:returntype", void 0)
], FxController.prototype, "convert", null);
exports.FxController = FxController = __decorate([
    (0, swagger_1.ApiTags)('FX'),
    (0, common_1.Controller)('fx'),
    __metadata("design:paramtypes", [fx_service_1.FxService])
], FxController);
//# sourceMappingURL=fx.controller.js.map