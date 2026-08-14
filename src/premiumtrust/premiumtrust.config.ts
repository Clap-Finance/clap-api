export class PremiumTrustConfig {
  static get() {
    const clientId = process.env.PREMIUMTRUST_CLIENT_ID;
    const secretKey = process.env.PREMIUMTRUST_SECRET_KEY;
    const clientIv = process.env.PREMIUMTRUST_CLIENT_IV;
    const baseUrl =
      process.env.PREMIUMTRUST_BASE_URL || 'https://dev.premiumtrustbank.com';

    const missing = [] as string[];
    if (!clientId) missing.push('PREMIUMTRUST_CLIENT_ID');
    if (!secretKey) missing.push('PREMIUMTRUST_SECRET_KEY');
    if (!clientIv) missing.push('PREMIUMTRUST_CLIENT_IV');

    if (missing.length > 0) {
      throw new Error(
        `PremiumTrust integration is not configured. Missing environment variables: ${missing.join(', ')}`,
      );
    }

    return { clientId: clientId!, secretKey: secretKey!, clientIv: clientIv!, baseUrl };
  }
}
