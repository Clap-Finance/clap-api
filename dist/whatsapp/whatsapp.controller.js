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
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const whatsapp_service_1 = require("./whatsapp.service");
const whatsapp_dto_1 = require("./whatsapp.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WhatsappController = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    receiveWebhook(dto) {
        return this.whatsappService.receiveWebhook(dto);
    }
    send(dto) {
        return this.whatsappService.sendMessage(dto);
    }
    getConversation(phone) {
        return this.whatsappService.getConversation(phone);
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive WhatsApp webhook (public)', description: 'Receives an incoming WhatsApp message webhook. This endpoint is public and does not require authentication.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Webhook received successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [whatsapp_dto_1.WhatsappWebhookDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "receiveWebhook", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Send WhatsApp message', description: 'Sends a WhatsApp message to a recipient phone number.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [whatsapp_dto_1.SendWhatsappMessageDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('conversations/:phone'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation history', description: 'Returns the WhatsApp conversation history for a given phone number.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation history' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found for this phone number' }),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getConversation", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, swagger_1.ApiTags)('WhatsApp'),
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map