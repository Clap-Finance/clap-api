import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './countries.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all countries (public)', description: 'Returns all active countries. This endpoint is public and does not require authentication.' })
  @ApiResponse({ status: 200, description: 'List of active countries' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get country by code (public)', description: 'Returns a country by its unique ISO code. This endpoint is public.' })
  @ApiResponse({ status: 200, description: 'Country details' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  findByCode(@Param('code') code: string) {
    return this.countriesService.findByCode(code);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create country (admin)', description: 'Creates a new country entry in the directory. Admin only.' })
  @ApiResponse({ status: 201, description: 'Country created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  create(@Body() dto: CreateCountryDto) {
    return this.countriesService.create(dto);
  }
}
