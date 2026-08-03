import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BanksService } from './banks.service';
import { CreateBankDto, UpdateBankDto } from './banks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Banks')
@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @ApiOperation({ summary: 'List all banks (public)', description: 'Returns all active banks. This endpoint is public and does not require authentication.' })
  @ApiResponse({ status: 200, description: 'List of active banks' })
  findAll() {
    return this.banksService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get bank by code (public)', description: 'Returns a bank by its unique code. This endpoint is public.' })
  @ApiResponse({ status: 200, description: 'Bank details' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  findByCode(@Param('code') code: string) {
    return this.banksService.findByCode(code);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create bank (admin)', description: 'Creates a new bank entry in the directory. Admin only.' })
  @ApiResponse({ status: 201, description: 'Bank created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  create(@Body() dto: CreateBankDto) {
    return this.banksService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update bank (admin)', description: 'Updates an existing bank entry. Admin only.' })
  @ApiResponse({ status: 200, description: 'Bank updated successfully' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  update(@Param('id') id: string, @Body() dto: UpdateBankDto) {
    return this.banksService.update(id, dto);
  }
}
