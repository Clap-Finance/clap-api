import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { CreateComplianceCheckDto, ScreenNameDto, PaginationDto } from './compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Compliance')
@Controller('compliance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN', 'COMPLIANCE')
@ApiBearerAuth('JWT')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('checks')
  @ApiOperation({ summary: 'List compliance checks (admin)', description: 'Returns a paginated list of all compliance checks. Admin/Compliance role only.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of compliance checks' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin/compliance role required' })
  findChecks(@Query() query: PaginationDto) {
    return this.complianceService.findChecks(query);
  }

  @Post('checks')
  @ApiOperation({ summary: 'Create compliance check (admin)', description: 'Creates a new compliance check for a user or transaction. Admin/Compliance role only.' })
  @ApiResponse({ status: 201, description: 'Compliance check created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin/compliance role required' })
  createCheck(@Body() dto: CreateComplianceCheckDto) {
    return this.complianceService.createCheck(dto);
  }

  @Post('screen')
  @ApiOperation({ summary: 'Screen a name against sanctions (admin)', description: 'Screens a first and last name against the sanctions list. Returns exact and partial matches. Admin/Compliance role only.' })
  @ApiResponse({ status: 200, description: 'Screening result with matches' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin/compliance role required' })
  screenName(@Body() dto: ScreenNameDto) {
    return this.complianceService.screenName(dto);
  }

  @Get('sanctions')
  @ApiOperation({ summary: 'List sanction entries (admin)', description: 'Returns all sanction entries in the database. Admin/Compliance role only.' })
  @ApiResponse({ status: 200, description: 'List of sanction entries' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin/compliance role required' })
  findSanctions() {
    return this.complianceService.findSanctions();
  }
}
