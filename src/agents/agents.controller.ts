import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto, CashInOutDto, PaginationDto } from './agents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create agent (admin)', description: 'Designates a user as an agent with business details, commission rate, and daily limit. Admin only.' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User is already an agent' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  create(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List agents (admin)', description: 'Returns all agents with their associated user details. Admin only.' })
  @ApiResponse({ status: 200, description: 'List of agents' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get agent details (admin)', description: 'Returns details of a specific agent. Admin only.' })
  @ApiResponse({ status: 200, description: 'Agent details' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update agent (admin)', description: 'Updates agent details (business name, location, commission rate, daily limit, status). Admin only.' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  update(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    return this.agentsService.update(id, dto);
  }

  @Get(':id/transactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List agent transactions (admin)', description: 'Returns a paginated list of transactions for a specific agent. Admin only.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of agent transactions' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAgentTransactions(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.agentsService.findAgentTransactions(id, query);
  }

  @Post(':id/cash-in')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Agent cash in', description: 'Agent processes a cash-in for a customer. Credits the customer\'s wallet and updates the agent\'s cash balance.' })
  @ApiResponse({ status: 201, description: 'Cash-in completed successfully' })
  @ApiResponse({ status: 404, description: 'Agent or customer wallet not found' })
  @ApiResponse({ status: 403, description: 'You are not this agent' })
  cashIn(@Req() req: any, @Param('id') id: string, @Body() dto: CashInOutDto) {
    return this.agentsService.cashIn(id, req.user.sub, dto);
  }

  @Post(':id/cash-out')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Agent cash out', description: 'Agent processes a cash-out for a customer. Debits the customer\'s wallet and updates the agent\'s cash balance.' })
  @ApiResponse({ status: 201, description: 'Cash-out completed successfully' })
  @ApiResponse({ status: 400, description: 'Customer has insufficient balance' })
  @ApiResponse({ status: 404, description: 'Agent or customer wallet not found' })
  @ApiResponse({ status: 403, description: 'You are not this agent' })
  cashOut(@Req() req: any, @Param('id') id: string, @Body() dto: CashInOutDto) {
    return this.agentsService.cashOut(id, req.user.sub, dto);
  }
}
