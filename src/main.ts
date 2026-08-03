import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Clap API')
    .setDescription(
      'Clap — WhatsApp-first cross-border money platform API.\n\n' +
        'Clap lets users sign up, verify identity (KYC), create multi-currency wallets, ' +
        'send and receive money, exchange currencies, cash in/out through agents, and ' +
        'transfer locally and internationally.\n\n' +
        '## Authentication\n' +
        'All protected endpoints require a Bearer JWT token obtained via `/api/v1/auth/login` ' +
        'or `/api/v1/auth/register`. Include it in the `Authorization` header:\n\n' +
        '```\nAuthorization: Bearer <your-jwt-token>\n```\n\n' +
        '## Architecture\n' +
        'The backend is designed as independent services (Auth, User, Wallet, Ledger, ' +
        'Transaction, FX, Payment, Webhook, Notification, KYC, Compliance, Agent, Admin, ' +
        'WhatsApp) so that WhatsApp, the mobile app, and future APIs are all just different ' +
        'clients talking to the same services.\n\n' +
        '## Monetary Values\n' +
        'All amounts are stored as integers in minor units (e.g. 50000 = ₦500.00). ' +
        'Never use floating-point for money.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'JWT',
    )
    .addTag('Auth', 'Authentication — register, login, OTP, refresh tokens, sessions, device management')
    .addTag('Users', 'User profiles — personal info, KYC tier, status management')
    .addTag('Wallets', 'Multi-currency wallets — balances, lock/unlock, statements')
    .addTag('Ledger', 'Double-entry ledger — accounts, journals, entries')
    .addTag('Transactions', 'Money movement — transfers, deposits, withdrawals, FX, agent payments')
    .addTag('FX', 'Foreign exchange — live rates, quotes, conversion')
    .addTag('Payments', 'Payment rails — provider abstraction, Fincra/Flutterwave/Paystack integration')
    .addTag('Webhooks', 'Incoming provider events — retry, verification, logging, replay')
    .addTag('Notifications', 'Multi-channel notifications — WhatsApp, SMS, email, push, in-app')
    .addTag('KYC', 'Identity verification — BVN, NIN, passport, selfie, proof of address, tier limits')
    .addTag('Compliance', 'Compliance — AML, PEP, sanctions, velocity, fraud detection, blacklists')
    .addTag('Agents', 'Agent network — cash in/out, commission, float, settlement, daily limits')
    .addTag('Admin', 'Admin dashboard — users, wallets, transactions, KYC, support, fraud, rates, disputes, audit logs')
    .addTag('WhatsApp', 'WhatsApp service — webhook, intent detection, conversation engine')
    .addTag('Beneficiaries', 'Saved recipients — bank accounts for recurring transfers')
    .addTag('Banks', 'Bank directory — supported banks per country')
    .addTag('Countries', 'Country directory — supported countries and currencies')
    .addTag('Health', 'Health checks — service status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Clap API Documentation',
    customfavIcon: '',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
    },
  });

  app.setGlobalPrefix('api/v1');

  const port = 3000;
  await app.listen(port);
  console.log(`Clap API running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/docs`);
  console.log(`OpenAPI JSON: http://localhost:${port}/docs-json`);
}

bootstrap();
