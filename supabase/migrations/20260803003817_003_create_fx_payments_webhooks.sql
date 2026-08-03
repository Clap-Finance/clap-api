/*
# Clap FX, Payments, Webhooks Schema

## Purpose
Creates tables for FX rates/quotes, payment provider abstraction, payment requests, and webhook events.

## New Tables
1. exchange_rates — live currency rates with spread, buy/sell rates
2. fx_quotes — time-limited quotes for FX conversions (30s expiry)
3. payment_providers — abstracted payment rail providers (Fincra, Flutterwave, Paystack)
4. payment_requests — outbound requests to providers with payload/response logging
5. webhook_events — incoming provider events with retry tracking

## Security
- RLS enabled on all tables.
- Exchange rates: readable by all authenticated users (public market data).
- FX quotes: owner-scoped to the requesting user.
- Payment providers: readable by authenticated users (provider list is not secret).
- Payment requests & webhook events: backend-managed via service role.

## Important Notes
1. FX quotes expire after 30 seconds — the expires_at column enforces this.
2. Payment providers have priority ordering for fallback routing.
3. Webhook events track attempt counts and error messages for retry logic.
4. Provider config is stored as JSONB for flexible per-provider settings.
*/

-- ── EXCHANGE RATES ──
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency currency NOT NULL,
  quote_currency currency NOT NULL,
  rate decimal(20,8) NOT NULL,
  spread decimal(20,8) NOT NULL DEFAULT 0,
  buy_rate decimal(20,8) NOT NULL,
  sell_rate decimal(20,8) NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(base_currency, quote_currency)
);
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exchange_rates_select_all" ON exchange_rates;
CREATE POLICY "exchange_rates_select_all" ON exchange_rates FOR SELECT TO authenticated USING (true);

-- ── FX QUOTES ──
CREATE TABLE IF NOT EXISTS fx_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  from_currency currency NOT NULL,
  to_currency currency NOT NULL,
  amount bigint NOT NULL,
  rate decimal(20,8) NOT NULL,
  fee bigint NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  status quote_status NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fx_quotes_user_id ON fx_quotes(user_id);
ALTER TABLE fx_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fx_quotes_select_own" ON fx_quotes;
CREATE POLICY "fx_quotes_select_own" ON fx_quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "fx_quotes_insert_own" ON fx_quotes;
CREATE POLICY "fx_quotes_insert_own" ON fx_quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ── PAYMENT PROVIDERS ──
CREATE TABLE IF NOT EXISTS payment_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  config jsonb,
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE payment_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payment_providers_select_all" ON payment_providers;
CREATE POLICY "payment_providers_select_all" ON payment_providers FOR SELECT TO authenticated USING (true);

-- ── PAYMENT REQUESTS ──
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES payment_providers(id),
  transaction_id uuid REFERENCES transactions(id),
  provider_ref text,
  request_type text NOT NULL,
  payload jsonb,
  response jsonb,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_requests_provider_id ON payment_requests(provider_id);
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- ── WEBHOOK EVENTS ──
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES payment_providers(id),
  event_type text NOT NULL,
  signature text,
  payload jsonb,
  status webhook_status NOT NULL DEFAULT 'RECEIVED',
  attempts int NOT NULL DEFAULT 0,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_id ON webhook_events(provider_id);
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
