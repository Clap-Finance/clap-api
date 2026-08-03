import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { PaginationDto } from './webhooks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':providerCode')
  @ApiOperation({ summary: 'Receive webhook from provider (public)', description: 'Receives an incoming webhook event from a payment provider. This endpoint is public and does not require authentication. The raw body is stored for processing.' })
  @ApiBody({ description: 'Raw webhook payload from the provider (any JSON structure)' })
  @ApiResponse({ status: 201, description: 'Webhook event received and stored' })
  @ApiResponse({ status: 404, description: 'Unknown provider' })
  receiveWebhook(
    @Param('providerCode') providerCode: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-paystack-signature'] || undefined;
    return this.webhooksService.receiveWebhook(providerCode, body, signature);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List webhook events (admin)', description: 'Returns a paginated list of all webhook events. Admin only.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of webhook events' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAll(@Query() query: PaginationDto) {
    return this.webhooksService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get webhook event details (admin)', description: 'Returns details of a specific webhook event. Admin only.' })
  @ApiResponse({ status: 200, description: 'Webhook event details' })
  @ApiResponse({ status: 404, description: 'Webhook event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(id);
  }

  @Post(':id/replay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Replay webhook event (admin)', description: 'Re-queues a webhook event for reprocessing. Admin only.' })
  @ApiResponse({ status: 200, description: 'Webhook event queued for replay' })
  @ApiResponse({ status: 404, description: 'Webhook event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  replay(@Param('id') id: string) {
    return this.webhooksService.replay(id);
  }
}
