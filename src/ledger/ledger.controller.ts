import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { CreateLedgerAccountDto, CreateJournalDto, PaginationDto } from './ledger.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Ledger')
@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List ledger accounts', description: 'Returns all ledger accounts with entry counts.' })
  @ApiResponse({ status: 200, description: 'List of ledger accounts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAccounts() {
    return this.ledgerService.findAccounts();
  }

  @Post('accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create ledger account (admin)', description: 'Creates a new ledger account with a unique code, name, type, and optional currency. Admin only.' })
  @ApiResponse({ status: 201, description: 'Ledger account created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  createAccount(@Body() dto: CreateLedgerAccountDto) {
    return this.ledgerService.createAccount(dto);
  }

  @Get('journals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List journals (admin)', description: 'Returns a paginated list of all journal entries. Admin only.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of journals' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findJournals(@Query() query: PaginationDto) {
    return this.ledgerService.findJournals(query);
  }

  @Get('journals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get journal with entries (admin)', description: 'Returns a single journal with all its ledger entries. Admin only.' })
  @ApiResponse({ status: 200, description: 'Journal with entries' })
  @ApiResponse({ status: 404, description: 'Journal not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  getJournal(@Param('id') id: string) {
    return this.ledgerService.getJournal(id);
  }

  @Post('journals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create journal entry (admin)', description: 'Creates a new double-entry journal. Debits must equal credits. Admin only.' })
  @ApiResponse({ status: 201, description: 'Journal created successfully' })
  @ApiResponse({ status: 400, description: 'Entries do not balance' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  createJournal(@Body() dto: CreateJournalDto) {
    return this.ledgerService.createJournal(dto);
  }
}
