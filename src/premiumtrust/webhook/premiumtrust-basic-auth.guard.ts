import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PremiumTrustBasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization || '';

    const expectedUser = process.env.PREMIUMTRUST_FT_USERNAME;
    const expectedPass = process.env.PREMIUMTRUST_FT_PASSWORD;

    if (!expectedUser || !expectedPass) {
      return false;
    }

    const [scheme, credentials] = header.split(' ');
    if (scheme !== 'Basic' || !credentials) return false;

    let decoded = '';
    try {
      decoded = Buffer.from(credentials, 'base64').toString('utf8');
    } catch {
      return false;
    }

    const [user, pass] = decoded.split(':');
    return user === expectedUser && pass === expectedPass;
  }
}
