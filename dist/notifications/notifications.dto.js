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
exports.PaginationDto = exports.SendNotificationDto = exports.NotificationChannel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["IN_APP"] = "IN_APP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
class SendNotificationDto {
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recipient user ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: NotificationChannel, example: 'WHATSAPP', description: 'Notification channel' }),
    (0, class_validator_1.IsEnum)(NotificationChannel),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'transaction_completed', description: 'Notification template identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "template", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { amount: 50000, currency: 'NGN' }, description: 'Template payload (JSON)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "payload", void 0);
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
//# sourceMappingURL=notifications.dto.js.map