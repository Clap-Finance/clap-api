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
exports.CountriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const countries_service_1 = require("./countries.service");
const countries_dto_1 = require("./countries.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let CountriesController = class CountriesController {
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    findAll() {
        return this.countriesService.findAll();
    }
    findByCode(code) {
        return this.countriesService.findByCode(code);
    }
    create(dto) {
        return this.countriesService.create(dto);
    }
};
exports.CountriesController = CountriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all countries (public)', description: 'Returns all active countries. This endpoint is public and does not require authentication.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active countries' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get country by code (public)', description: 'Returns a country by its unique ISO code. This endpoint is public.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Country details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Country not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create country (admin)', description: 'Creates a new country entry in the directory. Admin only.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Country created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [countries_dto_1.CreateCountryDto]),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "create", null);
exports.CountriesController = CountriesController = __decorate([
    (0, swagger_1.ApiTags)('Countries'),
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [countries_service_1.CountriesService])
], CountriesController);
//# sourceMappingURL=countries.controller.js.map