import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FxService } from './fx.service';
import { CreateFxQuoteDto, FxConvertDto } from './fx.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('FX')
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List all exchange rates', description: 'Returns all available exchange rates.' })
  @ApiResponse({ status: 200, description: 'List of exchange rates' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRates() {
    return this.fxService.getRates();
  }

  @Get('rates/:base/:quote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get specific rate', description: 'Returns the exchange rate for a specific currency pair.' })
  @ApiResponse({ status: 200, description: 'Exchange rate for the pair' })
  @ApiResponse({ status: 404, description: 'Rate not found for this pair' })
  getRate(@Param('base') base: string, @Param('quote') quote: string) {
    return this.fxService.getRate(base, quote);
  }

  @Post('quote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create FX quote', description: 'Creates a new FX quote with a 30-second expiry. The quote locks in the exchange rate for the duration.' })
  @ApiResponse({ status: 201, description: 'FX quote created successfully' })
  @ApiResponse({ status: 404, description: 'No exchange rate found for this pair' })
  @ApiResponse({ status: 400, description: 'Invalid currency pair' })
  createQuote(@Req() req: any, @Body() dto: CreateFxQuoteDto) {
    return this.fxService.createQuote(req.user.sub, dto);
  }

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Execute FX conversion', description: 'Executes an FX conversion using a valid, non-expired quote. Debits the source wallet and credits the destination wallet.' })
  @ApiResponse({ status: 201, description: 'FX conversion completed successfully' })
  @ApiResponse({ status: 400, description: 'Quote expired, already used, or wallet currency mismatch' })
  @ApiResponse({ status: 404, description: 'Quote or wallet not found' })
  convert(@Req() req: any, @Body() dto: FxConvertDto) {
    return this.fxService.convert(req.user.sub, dto);
  }
}
