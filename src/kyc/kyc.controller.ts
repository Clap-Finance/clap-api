import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('KYC')
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Upload KYC document', description: 'Uploads a KYC document (BVN, NIN, passport, selfie, proof of address) with a storage URL.' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadDocument(@Req() req: any, @Body() dto: UploadKycDocumentDto) {
    return this.kycService.uploadDocument(req.user.sub, dto);
  }

  @Get('documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List own KYC documents', description: 'Returns all KYC documents uploaded by the authenticated user.' })
  @ApiResponse({ status: 200, description: 'List of KYC documents' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyDocuments(@Req() req: any) {
    return this.kycService.findMyDocuments(req.user.sub);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Submit KYC verification', description: 'Submits a KYC verification request for a specific tier with BVN, NIN, selfie, and proof of address.' })
  @ApiResponse({ status: 201, description: 'KYC verification submitted successfully' })
  @ApiResponse({ status: 400, description: 'Pending verification already exists' })
  submitVerification(@Req() req: any, @Body() dto: SubmitKycVerificationDto) {
    return this.kycService.submitVerification(req.user.sub, dto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get KYC verification status', description: 'Returns the authenticated user\'s current KYC tier and verification status.' })
  @ApiResponse({ status: 200, description: 'KYC status returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStatus(@Req() req: any) {
    return this.kycService.getStatus(req.user.sub);
  }

  @Get('verifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List all KYC verifications (admin)', description: 'Returns a paginated list of all KYC verifications. Admin only.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of KYC verifications' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  findAllVerifications(@Query() query: PaginationDto) {
    return this.kycService.findAllVerifications(query);
  }

  @Post('verifications/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Approve KYC verification (admin)', description: 'Approves a pending KYC verification and upgrades the user\'s tier. Admin only.' })
  @ApiResponse({ status: 200, description: 'KYC verification approved and user tier updated' })
  @ApiResponse({ status: 404, description: 'Verification not found' })
  @ApiResponse({ status: 400, description: 'Verification is not pending' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  approve(@Req() req: any, @Param('id') id: string) {
    return this.kycService.approve(id, req.user.sub);
  }

  @Post('verifications/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Reject KYC verification (admin)', description: 'Rejects a pending KYC verification with a reason. Admin only.' })
  @ApiResponse({ status: 200, description: 'KYC verification rejected' })
  @ApiResponse({ status: 404, description: 'Verification not found' })
  @ApiResponse({ status: 400, description: 'Verification is not pending' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  reject(@Req() req: any, @Param('id') id: string, @Body() dto: RejectKycDto) {
    return this.kycService.reject(id, dto, req.user.sub);
  }
}
