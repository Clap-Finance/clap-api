import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WhatsappWebhookText {
  @ApiProperty({ example: 'Send 5000 to +2348098765432', description: 'Message body text' })
  @IsString()
  body: string;
}

export class WhatsappWebhookMessage {
  @ApiProperty({ example: '2348012345678', description: 'Sender WhatsApp ID' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'wamid.HBgM...', description: 'WhatsApp message ID' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ example: 'text', description: 'Message type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ type: WhatsappWebhookText })
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsappWebhookText)
  text?: WhatsappWebhookText;
}

export class WhatsappWebhookValue {
  @ApiPropertyOptional({ type: [WhatsappWebhookMessage] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsappWebhookMessage)
  messages?: WhatsappWebhookMessage[];

  @ApiPropertyOptional({
    example: { display_phone_number: '+15551234567', phone_number_id: '1234567890' },
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: { display_phone_number?: string; phone_number_id?: string };

  @ApiPropertyOptional({
    type: 'array',
    example: [{ profile: { name: 'Tunde' }, wa_id: '2348012345678' }],
  })
  @IsOptional()
  contacts?: { profile?: { name?: string }; wa_id?: string }[];
}

export class WhatsappWebhookChange {
  @ApiPropertyOptional({ type: WhatsappWebhookValue })
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsappWebhookValue)
  value?: WhatsappWebhookValue;
}

export class WhatsappWebhookEntry {
  @ApiPropertyOptional({ type: [WhatsappWebhookChange] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsappWebhookChange)
  changes?: WhatsappWebhookChange[];
}

export class WhatsappWebhookDto {
  @ApiPropertyOptional({ example: 'whatsapp_business_account', description: 'Meta object type' })
  @IsOptional()
  @IsString()
  object?: string;

  @ApiPropertyOptional({ type: [WhatsappWebhookEntry] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsappWebhookEntry)
  entry?: WhatsappWebhookEntry[];
}

export class WhatsappWebhookVerificationDto {
  @ApiProperty({ example: 'subscribe', description: 'Hub mode, should be "subscribe"' })
  @IsString()
  'hub.mode': string;

  @ApiProperty({ example: 'my-verify-token', description: 'Verification token configured in the Meta Developer Console' })
  @IsString()
  'hub.verify_token': string;

  @ApiProperty({ example: '12345', description: 'Challenge string to echo back to Meta' })
  @IsString()
  'hub.challenge': string;
}

export class SendWhatsappMessageDto {
  @ApiProperty({ example: '+2348012345678', description: 'Recipient phone number' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Your transfer of ₦5,000 to Tunde was successful.', description: 'Message content to send' })
  @IsString()
  message: string;
}
