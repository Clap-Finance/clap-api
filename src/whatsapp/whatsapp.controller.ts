import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookDto, SendWhatsappMessageDto, WhatsappWebhookVerificationDto } from './whatsapp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FLOWS } from './whatsapp.flows';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

const rawBodyOf = (req: RawBodyRequest, body: Record<string, unknown>): Buffer => req.rawBody ?? Buffer.from(JSON.stringify(body));

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
  @ApiOperation({ summary: 'Flow data (public)', description: 'Handles encrypted data exchange, health check and error notification requests from Meta for the given flow. Body is RSA-OAEP/AES-GCM encrypted and the response is encrypted with the request AES key.' })
  @ApiResponse({ status: 200, description: 'Encrypted flow response (text/plain)' })
  @ApiResponse({ status: 401, description: 'Invalid X-Hub-Signature-256' })
  @ApiResponse({ status: 421, description: 'Unable to decrypt payload' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async flowData(
    @Param('flowName') flowName: string,
    @Req() req: RawBodyRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    if (!FLOWS[flowName]) throw new NotFoundException('Flow not found');
    const result = await this.whatsappService.handleFlowEndpointRequest(
      flowName,
      rawBodyOf(req, body),
      body,
      req.headers['x-hub-signature-256'] as string | undefined,
    );
    return res.status(result.httpStatus).set({ 'Content-Type': result.contentType }).send(result.body);
  }

  @Post('flows/:flowName/flow')
  @ApiOperation({ summary: 'Flow submission (public)', description: 'Handles encrypted flow data exchange requests from Meta for the given flow, including terminal submissions. Body is RSA-OAEP/AES-GCM encrypted and the response is encrypted with the request AES key.' })
  @ApiResponse({ status: 200, description: 'Encrypted flow response (text/plain)' })
  @ApiResponse({ status: 401, description: 'Invalid X-Hub-Signature-256' })
  @ApiResponse({ status: 421, description: 'Unable to decrypt payload' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async flowSubmission(
    @Param('flowName') flowName: string,
    @Req() req: RawBodyRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    if (!FLOWS[flowName]) throw new NotFoundException('Flow not found');
    const result = await this.whatsappService.handleFlowEndpointRequest(
      flowName,
      rawBodyOf(req, body),
      body,
      req.headers['x-hub-signature-256'] as string | undefined,
    );
    return res.status(result.httpStatus).set({ 'Content-Type': result.contentType }).send(result.body);
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
