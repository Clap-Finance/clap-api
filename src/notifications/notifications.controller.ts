import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto, PaginationDto } from './notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List own notifications', description: 'Returns a paginated list of the authenticated user\'s notifications.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of notifications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() req: any, @Query() query: PaginationDto) {
    return this.notificationsService.findAll(req.user.sub, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Send notification (admin)', description: 'Sends a notification to a user via the specified channel. Admin only.' })
  @ApiResponse({ status: 201, description: 'Notification queued successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mark notification as read', description: 'Marks a specific notification as read/delivered.' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id);
  }
}
