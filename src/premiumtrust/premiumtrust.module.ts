import { Module } from '@nestjs/common';
import { PremiumTrustController } from './premiumtrust.controller';
import { PremiumTrustService } from './premiumtrust.service';
import { PremiumTrustClient } from './premiumtrust.client';
import { PremiumTrustEncryptionService } from './premiumtrust.encryption.service';
import { PremiumTrustWebhookController } from './webhook/premiumtrust-webhook.controller';
import { PremiumTrustWebhookService } from './webhook/premiumtrust-webhook.service';

@Module({
  controllers: [PremiumTrustController, PremiumTrustWebhookController],
  providers: [
    PremiumTrustService,
    PremiumTrustClient,
    PremiumTrustEncryptionService,
    PremiumTrustWebhookService,
  ],
  exports: [PremiumTrustService],
})
export class PremiumTrustModule {}
