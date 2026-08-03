"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const wallets_module_1 = require("./wallets/wallets.module");
const ledger_module_1 = require("./ledger/ledger.module");
const transactions_module_1 = require("./transactions/transactions.module");
const fx_module_1 = require("./fx/fx.module");
const payments_module_1 = require("./payments/payments.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const notifications_module_1 = require("./notifications/notifications.module");
const kyc_module_1 = require("./kyc/kyc.module");
const compliance_module_1 = require("./compliance/compliance.module");
const agents_module_1 = require("./agents/agents.module");
const admin_module_1 = require("./admin/admin.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const beneficiaries_module_1 = require("./beneficiaries/beneficiaries.module");
const banks_module_1 = require("./banks/banks.module");
const countries_module_1 = require("./countries/countries.module");
const health_module_1 = require("./health/health.module");
const prisma_module_1 = require("./prisma/prisma.module");
const supabase_module_1 = require("./supabase/supabase.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            supabase_module_1.SupabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            wallets_module_1.WalletsModule,
            ledger_module_1.LedgerModule,
            transactions_module_1.TransactionsModule,
            fx_module_1.FxModule,
            payments_module_1.PaymentsModule,
            webhooks_module_1.WebhooksModule,
            notifications_module_1.NotificationsModule,
            kyc_module_1.KycModule,
            compliance_module_1.ComplianceModule,
            agents_module_1.AgentsModule,
            admin_module_1.AdminModule,
            whatsapp_module_1.WhatsappModule,
            beneficiaries_module_1.BeneficiariesModule,
            banks_module_1.BanksModule,
            countries_module_1.CountriesModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map