import { Body, Controller, Get, NotFoundException, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto, WhatsappWebhookVerificationDto } from './whatsapp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FLOWS } from './whatsapp.flows';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('webhook')
  @ApiOperation({ summary: 'Verify WhatsApp webhook (public)', description: 'Handles Meta webhook verification. Echoes back hub.challenge when hub.verify_token matches.' })
  @ApiResponse({ status: 200, description: 'Challenge echoed back' })
  @ApiResponse({ status: 403, description: 'Invalid verification token' })
  verifyWebhook(@Query() query: WhatsappWebhookVerificationDto, @Res() res: Response) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'clap-whatsapp-verify-token';
    if (query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === verifyToken) {
      return res.status(200).send(query['hub.challenge']);
    }
    return res.status(403).send('Verification failed');
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Receive WhatsApp webhook (public)', description: 'Receives an incoming WhatsApp message webhook. This endpoint is public and does not require authentication.' })
  @ApiResponse({ status: 201, description: 'Webhook received successfully' })
  receiveWebhook(@Body() dto: WhatsappWebhookDto) {
    return this.whatsappService.receiveWebhook(dto);
  }

  @Get('flows/:flowName/config')
  @ApiOperation({ summary: 'Flow config (public)', description: 'Serves the WhatsApp Flow JSON definition that Meta renders for the given flow.' })
  @ApiResponse({ status: 200, description: 'Flow JSON' })
  getFlowConfig(@Param('flowName') flowName: string) {
    const flow = FLOWS[flowName];
    if (!flow) throw new NotFoundException('Flow not found');
    return flow;
  }

  @Post('flows/:flowName/data')
  @ApiOperation({ summary: 'Flow data (public)', description: 'Handles dynamic data and validation requests from Meta for the given flow.' })
  @ApiResponse({ status: 200, description: 'Resolved data' })
  flowData(@Param('flowName') flowName: string) {
    if (!FLOWS[flowName]) throw new NotFoundException('Flow not found');
    return { data: {} };
  }

  @Post('flows/:flowName/flow')
  @ApiOperation({ summary: 'Flow submission (public)', description: 'Receives the user-submitted flow data from Meta for the given flow.' })
  @ApiResponse({ status: 200, description: 'Submission processed' })
  flowSubmission(@Param('flowName') flowName: string, @Body() body: Record<string, unknown>) {
    if (!FLOWS[flowName]) throw new NotFoundException('Flow not found');
    return this.whatsappService.handleFlowSubmission(flowName, body);
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
