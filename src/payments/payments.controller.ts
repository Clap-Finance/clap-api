import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateProviderDto, UpdateProviderDto, ProviderTransferDto } from './payments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('providers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List active payment providers', description: 'Returns all active payment providers ordered by priority.' })
  @ApiResponse({ status: 200, description: 'List of active payment providers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findActiveProviders() {
    return this.paymentsService.findActiveProviders();
  }

  @Post('providers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create payment provider (admin)', description: 'Creates a new payment provider with configuration. Admin only.' })
  @ApiResponse({ status: 201, description: 'Provider created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  createProvider(@Body() dto: CreateProviderDto) {
    return this.paymentsService.createProvider(dto);
  }

  @Put('providers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update payment provider (admin)', description: 'Updates an existing payment provider. Admin only.' })
  @ApiResponse({ status: 200, description: 'Provider updated successfully' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  updateProvider(@Param('id') id: string, @Body() dto: UpdateProviderDto) {
    return this.paymentsService.updateProvider(id, dto);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Initiate provider transfer', description: 'Initiates a transfer through a specific payment provider for a given transaction.' })
  @ApiResponse({ status: 201, description: 'Payment request created successfully' })
  @ApiResponse({ status: 404, description: 'Provider or transaction not found' })
  initiateTransfer(@Body() dto: ProviderTransferDto) {
    return this.paymentsService.initiateTransfer(dto);
  }

  @Get('verify/:providerRef')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Verify payment status', description: 'Verifies the status of a payment by provider reference.' })
  @ApiResponse({ status: 200, description: 'Payment verification result' })
  @ApiResponse({ status: 404, description: 'Transaction not found for this provider reference' })
  verifyPayment(@Param('providerRef') providerRef: string) {
    return this.paymentsService.verifyPayment(providerRef);
  }
}
