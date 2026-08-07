import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PremiumTrustService } from './premiumtrust.service';
import { CreateVirtualAccountDto } from './dto/premiumtrust.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('PremiumTrust')
@Controller('premiumtrust')
export class PremiumTrustController {
  constructor(private readonly premiumTrustService: PremiumTrustService) {}

  @Post('accounts/static')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create static virtual account', description: 'Creates a static virtual account with Premium Trust Bank for the authenticated user.' })
  @ApiResponse({ status: 201, description: 'Static account created' })
  @ApiResponse({ status: 409, description: 'A static account already exists' })
  createStaticAccount(@Req() req: any, @Body() dto: CreateVirtualAccountDto) {
    return this.premiumTrustService.createStaticAccount(req.user.sub, dto);
  }

  @Post('accounts/dynamic')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create dynamic virtual account', description: 'Creates a dynamic virtual account. A static account must exist first.' })
  @ApiResponse({ status: 201, description: 'Dynamic account created' })
  @ApiResponse({ status: 400, description: 'No static account exists yet' })
  createDynamicAccount(@Req() req: any, @Body() dto: CreateVirtualAccountDto) {
    return this.premiumTrustService.createDynamicAccount(req.user.sub, dto);
  }

  @Get('accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List my virtual accounts' })
  @ApiResponse({ status: 200, description: 'Virtual accounts' })
  listAccounts(@Req() req: any) {
    return this.premiumTrustService.listAccounts(req.user.sub);
  }

  @Get('accounts/:accountNo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get virtual account by number' })
  @ApiResponse({ status: 200, description: 'Virtual account' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  getAccount(@Req() req: any, @Param('accountNo') accountNo: string) {
    return this.premiumTrustService.getAccount(req.user.sub, accountNo);
  }
}
