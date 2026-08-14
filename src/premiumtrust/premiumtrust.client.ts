import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PremiumTrustConfig } from './premiumtrust.config';
import { PremiumTrustEncryptionService } from './premiumtrust.encryption.service';
import { PREMIUMTRUST_CREATE_ACCOUNT_PATH } from './premiumtrust.constants';

@Injectable()
export class PremiumTrustClient {
  private readonly logger = new Logger(PremiumTrustClient.name);

  constructor(private readonly encryption: PremiumTrustEncryptionService) {}

  async createAccount(plainPayload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const config = PremiumTrustConfig.get();

    const encrypted = this.encryption.encrypt(JSON.stringify(plainPayload));
    const hash = this.encryption.hmacSha256(encrypted);

    this.logger.log(
      `PTB createAccount request: clientId=${config.clientId} hash=${hash} payloadEncrypted=true`,
    );

    let res: Response;
    try {
      res = await fetch(`${config.baseUrl}${PREMIUMTRUST_CREATE_ACCOUNT_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ClientId: config.clientId,
          Hash: hash,
        },
        body: JSON.stringify({ encrypted }),
      });
    } catch (err: any) {
      this.logger.error(`PTB createAccount network error: ${err?.message}`);
      throw new ServiceUnavailableException('PremiumTrust is unreachable');
    }

    this.logger.log(`PTB createAccount response: status=${res.status}`);

    if (!res.ok) {
      const raw = await res.text().catch(() => '');
      this.logger.error(`PTB createAccount failed: status=${res.status} body=${raw}`);
      throw new ServiceUnavailableException(`PremiumTrust responded with HTTP ${res.status}`);
    }

    const raw = await res.text();
    const decrypted = this.encryption.decrypt(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(decrypted);
    } catch {
      this.logger.error('PTB createAccount response could not be parsed after decryption');
      throw new ServiceUnavailableException('Invalid response from PremiumTrust');
    }

    return parsed as Record<string, unknown>;
  }
}
