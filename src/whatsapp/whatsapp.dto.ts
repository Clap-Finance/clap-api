import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class WhatsappWebhookDto {
  @ApiProperty({ example: '+2348012345678', description: 'Sender phone number' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'Send 5000 to +2348098765432', description: 'Message body text' })
  @IsString()
  messageBody: string;

  @ApiProperty({ example: 'wamid.HBgM...', description: 'WhatsApp message ID' })
  @IsString()
  messageId: string;
}

export class SendWhatsappMessageDto {
  @ApiProperty({ example: '+2348012345678', description: 'Recipient phone number' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Your transfer of ₦5,000 to Tunde was successful.', description: 'Message content to send' })
  @IsString()
  message: string;
}
