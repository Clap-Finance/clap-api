import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { TransferDto, DepositDto, WithdrawDto, PaginationDto } from './transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Transfer money', description: 'Transfers money from one wallet to another wallet or to counterparty bank details.' })
  @ApiResponse({ status: 201, description: 'Transfer completed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or inactive wallet' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  transfer(@Req() req: any, @Body() dto: TransferDto) {
    return this.transactionsService.transfer(req.user.sub, dto);
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Deposit', description: 'Deposits money into a wallet via a payment provider.' })
  @ApiResponse({ status: 201, description: 'Deposit completed successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  deposit(@Req() req: any, @Body() dto: DepositDto) {
    return this.transactionsService.deposit(req.user.sub, dto);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Withdraw', description: 'Withdraws money from a wallet to a bank account.' })
  @ApiResponse({ status: 201, description: 'Withdrawal initiated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  withdraw(@Req() req: any, @Body() dto: WithdrawDto) {
    return this.transactionsService.withdraw(req.user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List own transactions', description: 'Returns a paginated list of the authenticated user\'s transactions.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of transactions' })
  findAll(@Req() req: any, @Query() query: PaginationDto) {
    return this.transactionsService.findAll(req.user.sub, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get transaction details', description: 'Returns details of a specific transaction owned by the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this transaction' })
  getTransaction(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.getTransaction(req.user.sub, id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cancel pending transaction', description: 'Cancels a pending transaction and reverses any wallet balance changes.' })
  @ApiResponse({ status: 200, description: 'Transaction cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Only pending transactions can be cancelled' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.cancel(req.user.sub, id);
  }
}
