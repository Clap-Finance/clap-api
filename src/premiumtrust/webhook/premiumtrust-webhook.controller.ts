import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { PremiumTrustWebhookService } from './premiumtrust-webhook.service';
import { FT_STATUS_CODES } from '../premiumtrust.constants';

@ApiTags('PremiumTrust')
@Controller('premiumtrust/webhook')
export class PremiumTrustWebhookController {
  constructor(private readonly webhookService: PremiumTrustWebhookService) {}

  @Post('funds-transfer')
  @ApiBasicAuth()
  @ApiOperation({
    summary: 'Funds transfer notification (PremiumTrust calls this)',
    description: 'Receives incoming credit notifications from Premium Trust Bank. Echoes the payload back with a StatusCode.',
  })
  @ApiResponse({ status: 200, description: 'Processed. Echo of payload + StatusCode (1=success, 2=invalid account, 4=duplicate)' })
  @ApiResponse({ status: 401, description: 'Invalid credentials. Echo + StatusCode 3' })
  async fundsTransfer(
    @Req() req: any,
    @Res() res: Response,
    @Body() payload: Record<string, any>,
  ) {
    const header: string = req.headers.authorization || '';
    const [scheme, credentials] = header.split(' ');
    let authOk = false;

    if (scheme === 'Basic' && credentials) {
      try {
        const [user, pass] = Buffer.from(credentials, 'base64').toString('utf8').split(':');
        authOk =
          user === process.env.PREMIUMTRUST_FT_USERNAME &&
          pass === process.env.PREMIUMTRUST_FT_PASSWORD;
      } catch {
        authOk = false;
      }
    }

    if (!authOk) {
      return res
        .status(401)
        .json({ ...payload, StatusCode: FT_STATUS_CODES.INVALID_CREDENTIALS });
    }

    const body = await this.webhookService.handleFundsTransfer(payload);
    return res.status(200).json(body);
  }
}
