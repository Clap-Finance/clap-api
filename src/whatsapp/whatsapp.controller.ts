import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto } from './whatsapp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Receive WhatsApp webhook (public)', description: 'Receives an incoming WhatsApp message webhook. This endpoint is public and does not require authentication.' })
  @ApiResponse({ status: 201, description: 'Webhook received successfully' })
  receiveWebhook(@Body() dto: WhatsappWebhookDto) {
    return this.whatsappService.receiveWebhook(dto);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Send WhatsApp message', description: 'Sends a WhatsApp message to a recipient phone number.' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  send(@Body() dto: SendWhatsappMessageDto) {
    return this.whatsappService.sendMessage(dto);
  }

  @Get('conversations/:phone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get conversation history', description: 'Returns the WhatsApp conversation history for a given phone number.' })
  @ApiResponse({ status: 200, description: 'Conversation history' })
  @ApiResponse({ status: 404, description: 'User not found for this phone number' })
  getConversation(@Param('phone') phone: string) {
    return this.whatsappService.getConversation(phone);
  }
}
