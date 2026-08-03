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
exports.SendWhatsappMessageDto = exports.WhatsappWebhookDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class WhatsappWebhookDto {
}
exports.WhatsappWebhookDto = WhatsappWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+2348012345678', description: 'Sender phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappWebhookDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Send 5000 to +2348098765432', description: 'Message body text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappWebhookDto.prototype, "messageBody", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'wamid.HBgM...', description: 'WhatsApp message ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappWebhookDto.prototype, "messageId", void 0);
class SendWhatsappMessageDto {
}
exports.SendWhatsappMessageDto = SendWhatsappMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+2348012345678', description: 'Recipient phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendWhatsappMessageDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Your transfer of ₦5,000 to Tunde was successful.', description: 'Message content to send' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendWhatsappMessageDto.prototype, "message", void 0);
//# sourceMappingURL=whatsapp.dto.js.map