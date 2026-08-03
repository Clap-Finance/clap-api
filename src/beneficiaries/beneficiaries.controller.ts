import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './beneficiaries.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Beneficiaries')
@Controller('beneficiaries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Get()
  @ApiOperation({ summary: 'List own beneficiaries', description: 'Returns all saved beneficiaries for the authenticated user.' })
  @ApiResponse({ status: 200, description: 'List of beneficiaries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() req: any) {
    return this.beneficiariesService.findAll(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Add beneficiary', description: 'Saves a new beneficiary with bank account details for recurring transfers.' })
  @ApiResponse({ status: 201, description: 'Beneficiary added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() dto: CreateBeneficiaryDto) {
    return this.beneficiariesService.create(req.user.sub, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update beneficiary', description: 'Updates a saved beneficiary\'s details.' })
  @ApiResponse({ status: 200, description: 'Beneficiary updated successfully' })
  @ApiResponse({ status: 404, description: 'Beneficiary not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this beneficiary' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBeneficiaryDto) {
    return this.beneficiariesService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete beneficiary', description: 'Removes a saved beneficiary.' })
  @ApiResponse({ status: 200, description: 'Beneficiary deleted successfully' })
  @ApiResponse({ status: 404, description: 'Beneficiary not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this beneficiary' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.beneficiariesService.remove(req.user.sub, id);
  }
}
