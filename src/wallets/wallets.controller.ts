import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, PaginationDto } from './wallets.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List own wallets', description: 'Returns all wallets belonging to the authenticated user.' })
  @ApiResponse({ status: 200, description: 'List of user wallets' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyWallets(@Req() req: any) {
    return this.walletsService.findMyWallets(req.user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create wallet', description: 'Creates a new wallet for the authenticated user in the specified currency.' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @ApiResponse({ status: 409, description: 'Wallet for this currency already exists' })
  createWallet(@Req() req: any, @Body() dto: CreateWalletDto) {
    return this.walletsService.createWallet(req.user.sub, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get wallet details', description: 'Returns details of a specific wallet owned by the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Wallet details' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  getWallet(@Req() req: any, @Param('id') id: string) {
    return this.walletsService.getWallet(req.user.sub, id);
  }

  @Get(':id/statement')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get wallet statement', description: 'Returns the transaction statement for a specific wallet with pagination.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Wallet statement with paginated transactions' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  getStatement(@Req() req: any, @Param('id') id: string, @Query() query: PaginationDto) {
    return this.walletsService.getStatement(req.user.sub, id, query);
  }

  @Post(':id/freeze')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Freeze wallet (admin)', description: 'Freezes a wallet, preventing transactions. Admin only.' })
  @ApiResponse({ status: 200, description: 'Wallet frozen successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  freezeWallet(@Param('id') id: string) {
    return this.walletsService.freezeWallet(id);
  }

  @Post(':id/unfreeze')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Unfreeze wallet (admin)', description: 'Unfreezes a wallet, re-enabling transactions. Admin only.' })
  @ApiResponse({ status: 200, description: 'Wallet unfrozen successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  unfreezeWallet(@Param('id') id: string) {
    return this.walletsService.unfreezeWallet(id);
  }
}
