/*
# Clap KYC, Compliance, Agents, Notifications, Supporting Schema

## Purpose
Creates tables for KYC verification, compliance checks, agent network, notifications,
beneficiaries, banks, audit logs, and countries.

## New Tables
1. kyc_documents — uploaded verification documents (BVN, NIN, passport, selfie, etc.)
2. kyc_verifications — tier-level verification status per user
3. compliance_checks — AML, PEP, sanctions, velocity, fraud checks
4. sanction_entries — sanctions screening list
5. beneficiaries — saved recipient accounts
6. banks — supported bank directory
7. agents — agent network with cash float, commission, limits
8. agent_transactions — agent cash-in/cash-out records
9. notifications — multi-channel notification log (WhatsApp, SMS, email, push, in-app)
10. audit_logs — admin action audit trail
11. countries — supported countries with currency mapping

## Security
- RLS enabled on all tables.
- KYC documents & verifications: owner-scoped.
- Compliance checks: owner-scoped (users see their own check results).
- Beneficiaries: owner-scoped.
- Banks, countries: public-readable to authenticated users.
- Notifications: owner-scoped.
- Audit logs: readable by the user whose action was logged.
- Agents & agent_transactions: owner-scoped via agent → user_id.
- Sanction entries: readable by authenticated users (screening list).

## Important Notes
1. KYC tiers unlock transaction limits: TIER_0 (basic), TIER_1 (BVN), TIER_2 (ID+selfie), TIER_3 (full).
2. Agent cash balance and float are tracked as BIGINT minor units.
3. Agent commission rate is a decimal percentage (e.g. 0.5 = 0.5%).
4. Notifications support 5 channels with status tracking.
5. Audit logs record every admin action with actor, resource, and metadata.
*/

-- ── KYC DOCUMENTS ──
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type kyc_document_type NOT NULL,
  document_number text,
  document_data jsonb,
  storage_url text,
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verified_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kyc_documents_select_own" ON kyc_documents;
CREATE POLICY "kyc_documents_select_own" ON kyc_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "kyc_documents_insert_own" ON kyc_documents;
CREATE POLICY "kyc_documents_insert_own" ON kyc_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "kyc_documents_update_own" ON kyc_documents;
CREATE POLICY "kyc_documents_update_own" ON kyc_documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── KYC VERIFICATIONS ──
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier tier NOT NULL,
  status kyc_status NOT NULL DEFAULT 'PENDING',
  bvn text,
  nin text,
  selfie_url text,
  proof_of_address_url text,
  reviewed_by uuid,
  notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kyc_verifications_select_own" ON kyc_verifications;
CREATE POLICY "kyc_verifications_select_own" ON kyc_verifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "kyc_verifications_insert_own" ON kyc_verifications;
CREATE POLICY "kyc_verifications_insert_own" ON kyc_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "kyc_verifications_update_own" ON kyc_verifications;
CREATE POLICY "kyc_verifications_update_own" ON kyc_verifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── COMPLIANCE CHECKS ──
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  transaction_id uuid REFERENCES transactions(id),
  check_type compliance_check_type NOT NULL,
  status compliance_status NOT NULL DEFAULT 'PENDING',
  risk_score int NOT NULL DEFAULT 0,
  details jsonb,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_user_id ON compliance_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_transaction_id ON compliance_checks(transaction_id);
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "compliance_checks_select_own" ON compliance_checks;
CREATE POLICY "compliance_checks_select_own" ON compliance_checks FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ── SANCTION ENTRIES ──
CREATE TABLE IF NOT EXISTS sanction_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  match_key text NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sanction_entries_match_key ON sanction_entries(match_key);
ALTER TABLE sanction_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sanction_entries_select_all" ON sanction_entries;
CREATE POLICY "sanction_entries_select_all" ON sanction_entries FOR SELECT TO authenticated USING (true);

-- ── BENEFICIARIES ──
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  account_number text NOT NULL,
  bank_code text,
  bank_name text,
  country text NOT NULL,
  currency currency NOT NULL,
  nickname text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_user_id ON beneficiaries(user_id);
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "beneficiaries_select_own" ON beneficiaries;
CREATE POLICY "beneficiaries_select_own" ON beneficiaries FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "beneficiaries_insert_own" ON beneficiaries;
CREATE POLICY "beneficiaries_insert_own" ON beneficiaries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "beneficiaries_update_own" ON beneficiaries;
CREATE POLICY "beneficiaries_update_own" ON beneficiaries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "beneficiaries_delete_own" ON beneficiaries;
CREATE POLICY "beneficiaries_delete_own" ON beneficiaries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── BANKS ──
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  currency currency NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banks_select_all" ON banks;
CREATE POLICY "banks_select_all" ON banks FOR SELECT TO authenticated USING (true);

-- ── AGENTS ──
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  business_name text NOT NULL,
  location text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  cash_balance bigint NOT NULL DEFAULT 0,
  float_balance bigint NOT NULL DEFAULT 0,
  commission_rate decimal(5,4) NOT NULL DEFAULT 0,
  daily_limit bigint NOT NULL DEFAULT 0,
  status agent_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agents_select_own" ON agents;
CREATE POLICY "agents_select_own" ON agents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "agents_update_own" ON agents;
CREATE POLICY "agents_update_own" ON agents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── AGENT TRANSACTIONS ──
CREATE TABLE IF NOT EXISTS agent_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id uuid,
  type agent_tx_type NOT NULL,
  amount bigint NOT NULL,
  currency currency NOT NULL,
  commission bigint NOT NULL DEFAULT 0,
  status transaction_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_agent_transactions_agent_id ON agent_transactions(agent_id);
ALTER TABLE agent_transactions ENABLE ROW LEVEL SECURITY;

-- ── NOTIFICATIONS ──
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  template text NOT NULL,
  payload jsonb,
  status notification_status NOT NULL DEFAULT 'QUEUED',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ── AUDIT LOGS ──
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  actor_id uuid,
  action text NOT NULL,
  resource text,
  resource_id text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_select_own" ON audit_logs;
CREATE POLICY "audit_logs_select_own" ON audit_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = actor_id);

-- ── COUNTRIES ──
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  currency currency NOT NULL,
  region text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "countries_select_all" ON countries;
CREATE POLICY "countries_select_all" ON countries FOR SELECT TO authenticated USING (true);
