import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export class SendNotificationDto {
  @ApiProperty({ description: 'Recipient user ID' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationChannel, example: 'WHATSAPP', description: 'Notification channel' })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ example: 'transaction_completed', description: 'Notification template identifier' })
  @IsString()
  template: string;

  @ApiProperty({ example: { amount: 50000, currency: 'NGN' }, description: 'Template payload (JSON)', required: false })
  @IsOptional()
  @IsObject()
  payload?: any;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, description: 'Items per page', default: 20, required: false })
  @IsOptional()
  limit?: number;
}
