/*
# Clap Core Schema — Enums, Users, Sessions, Wallets

## Purpose
Creates the foundational tables for the Clap cross-border money platform:
authentication, user profiles, sessions, devices, OTP codes, and multi-currency wallets.

## New Tables
1. users — main user profile with role, tier, status, KYC tier
2. sessions — refresh-token sessions with device/IP tracking
3. devices — registered devices with optional push/biometrics
4. otp_codes — one-time passcodes for login/transfer/KYC verification
5. wallets — multi-currency wallets storing balances as integer minor units (never float)

## Enums Created
- role, tier, user_status, wallet_status, currency, transaction_type, transaction_status,
  transaction_direction, journal_status, ledger_account_type, quote_status, webhook_status,
  kyc_document_type, kyc_status, compliance_check_type, compliance_status, agent_status,
  agent_tx_type, notification_channel, notification_status

## Security
- RLS enabled on all tables.
- Users can read/update their own rows (auth.uid() = user_id or id).
- Sessions and devices are owner-scoped.
- Wallets are owner-scoped.

## Important Notes
1. All monetary amounts stored as BIGINT in minor units (e.g. 50000 = ₦500.00).
2. Wallets have a unique constraint on (user_id, currency).
3. The users table is a standalone profile keyed by UUID (not auth.users).
4. OTP codes expire and track attempt counts for brute-force protection.
*/

-- ── ENUMS ──
DO $$ BEGIN
  CREATE TYPE role AS ENUM ('USER','AGENT','SUPPORT','COMPLIANCE','FINANCE','ADMIN','SUPER_ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tier AS ENUM ('TIER_0','TIER_1','TIER_2','TIER_3');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('PENDING','ACTIVE','SUSPENDED','BANNED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE wallet_status AS ENUM ('ACTIVE','FROZEN','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE currency AS ENUM ('NGN','USD','EUR','GBP','GHS','KES','ZAR','XOF');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('TRANSFER','DEPOSIT','WITHDRAWAL','FX','AGENT_PAYMENT','INTERNAL_TRANSFER','INTERNATIONAL_TRANSFER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED','REVERSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_direction AS ENUM ('DEBIT','CREDIT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE journal_status AS ENUM ('PENDING','POSTED','REVERSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ledger_account_type AS ENUM ('ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('OPEN','EXPIRED','USED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE webhook_status AS ENUM ('RECEIVED','PROCESSING','PROCESSED','FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kyc_document_type AS ENUM ('BVN','NIN','PASSPORT','DRIVERS_LICENSE','SELFIE','PROOF_OF_ADDRESS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('PENDING','APPROVED','REJECTED','EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE compliance_check_type AS ENUM ('AML','PEP','SANCTIONS','VELOCITY','FRAUD','BLACKLIST');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE compliance_status AS ENUM ('PENDING','PASSED','FLAGGED','REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE agent_status AS ENUM ('ACTIVE','SUSPENDED','TERMINATED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE agent_tx_type AS ENUM ('CASH_IN','CASH_OUT','COMMISSION','SETTLEMENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('WHATSAPP','SMS','EMAIL','PUSH','IN_APP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_status AS ENUM ('QUEUED','SENT','FAILED','DELIVERED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── USERS ──
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  password_hash text,
  first_name text,
  last_name text,
  country text,
  dob timestamptz,
  address text,
  tier tier NOT NULL DEFAULT 'TIER_0',
  status user_status NOT NULL DEFAULT 'PENDING',
  role role NOT NULL DEFAULT 'USER',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ── SESSIONS ──
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token text UNIQUE NOT NULL,
  device_info text,
  ip_address text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select_own" ON sessions;
CREATE POLICY "sessions_select_own" ON sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_insert_own" ON sessions;
CREATE POLICY "sessions_insert_own" ON sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_delete_own" ON sessions;
CREATE POLICY "sessions_delete_own" ON sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── DEVICES ──
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  platform text,
  push_token text,
  biometric_enabled boolean NOT NULL DEFAULT false,
  last_used_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_id)
);
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "devices_select_own" ON devices;
CREATE POLICY "devices_select_own" ON devices FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "devices_insert_own" ON devices;
CREATE POLICY "devices_insert_own" ON devices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "devices_update_own" ON devices;
CREATE POLICY "devices_update_own" ON devices FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── OTP CODES ──
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed boolean NOT NULL DEFAULT false,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_otp_phone_code ON otp_codes(phone, code);
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- ── WALLETS ──
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency currency NOT NULL,
  balance bigint NOT NULL DEFAULT 0,
  available_balance bigint NOT NULL DEFAULT 0,
  locked_balance bigint NOT NULL DEFAULT 0,
  status wallet_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, currency)
);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wallets_select_own" ON wallets;
CREATE POLICY "wallets_select_own" ON wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wallets_insert_own" ON wallets;
CREATE POLICY "wallets_insert_own" ON wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wallets_update_own" ON wallets;
CREATE POLICY "wallets_update_own" ON wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
