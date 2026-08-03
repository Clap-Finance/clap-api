import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadKycDocumentDto, SubmitKycVerificationDto, RejectKycDto, PaginationDto } from './kyc.dto';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(userId: string, dto: UploadKycDocumentDto) {
    return this.prisma.kycDocument.create({
      data: {
        userId,
        documentType: dto.documentType as any,
        documentNumber: dto.documentNumber || null,
        storageUrl: dto.storageUrl,
      },
    });
  }

  async findMyDocuments(userId: string) {
    return this.prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitVerification(userId: string, dto: SubmitKycVerificationDto) {
    const existing = await this.prisma.kycVerification.findUnique({ where: { userId } });
    if (existing && existing.status === 'PENDING') {
      throw new BadRequestException('You already have a pending KYC verification');
    }

    return this.prisma.kycVerification.create({
      data: {
        userId,
        tier: dto.tier as any,
        bvn: dto.bvn || null,
        nin: dto.nin || null,
        selfieUrl: dto.selfieUrl || null,
        proofOfAddressUrl: dto.proofOfAddressUrl || null,
        status: 'PENDING' as any,
        submittedAt: new Date(),
      },
    });
  }

  async getStatus(userId: string) {
    const verification = await this.prisma.kycVerification.findUnique({
      where: { userId },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return {
      tier: user.tier,
      verification,
    };
  }

  async findAllVerifications(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      this.prisma.kycVerification.findMany({
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.kycVerification.count(),
    ]);

    return {
      data: verifications,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async approve(id: string, reviewerId: string) {
    const verification = await this.prisma.kycVerification.findUnique({ where: { id } });
    if (!verification) throw new NotFoundException('KYC verification not found');
    if (verification.status !== 'PENDING') {
      throw new BadRequestException('Verification is not in pending status');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verification.userId },
        data: { tier: verification.tier },
      });

      return tx.kycVerification.update({
        where: { id },
        data: {
          status: 'APPROVED' as any,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        },
      });
    });
  }

  async reject(id: string, dto: RejectKycDto, reviewerId: string) {
    const verification = await this.prisma.kycVerification.findUnique({ where: { id } });
    if (!verification) throw new NotFoundException('KYC verification not found');
    if (verification.status !== 'PENDING') {
      throw new BadRequestException('Verification is not in pending status');
    }

    return this.prisma.kycVerification.update({
      where: { id },
      data: {
        status: 'REJECTED' as any,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        notes: dto.reason,
      },
    });
  }
}
