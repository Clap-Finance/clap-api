import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ChangeRoleDto, PaginationDto } from './admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@ApiBearerAuth('JWT')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard stats', description: 'Returns aggregate dashboard statistics: total users, total transactions, and total volume by currency.' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users', description: 'Returns a paginated list of all users.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAllUsers(@Query() query: PaginationDto) {
    return this.adminService.findAllUsers(query);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List all transactions', description: 'Returns a paginated list of all transactions across all users.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of transactions' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAllTransactions(@Query() query: PaginationDto) {
    return this.adminService.findAllTransactions(query);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'List audit logs', description: 'Returns a paginated list of audit logs.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of audit logs' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAuditLogs(@Query() query: PaginationDto) {
    return this.adminService.findAuditLogs(query);
  }

  @Post('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend user', description: 'Suspends a user account, preventing login and transactions.' })
  @ApiResponse({ status: 200, description: 'User suspended successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Post('users/:id/activate')
  @ApiOperation({ summary: 'Activate user', description: 'Reactivates a previously suspended user account.' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Change user role', description: 'Changes a user\'s role (e.g. promote to ADMIN or SUPER_ADMIN).' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
    return this.adminService.changeRole(id, dto);
  }
}
