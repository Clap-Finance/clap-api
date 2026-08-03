import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { LedgerModule } from './ledger/ledger.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FxModule } from './fx/fx.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { KycModule } from './kyc/kyc.module';
import { ComplianceModule } from './compliance/compliance.module';
import { AgentsModule } from './agents/agents.module';
import { AdminModule } from './admin/admin.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { BanksModule } from './banks/banks.module';
import { CountriesModule } from './countries/countries.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    WalletsModule,
    LedgerModule,
    TransactionsModule,
    FxModule,
    PaymentsModule,
    WebhooksModule,
    NotificationsModule,
    KycModule,
    ComplianceModule,
    AgentsModule,
    AdminModule,
    WhatsappModule,
    BeneficiariesModule,
    BanksModule,
    CountriesModule,
    HealthModule,
  ],
})
export class AppModule {}
