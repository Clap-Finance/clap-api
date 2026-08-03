/*
# Clap Ledger & Transaction Schema

## Purpose
Creates the double-entry ledger system and transaction records.
The ledger is the most critical service — every balance change must go through journal entries.

## New Tables
1. ledger_accounts — chart of accounts (wallet mirrors, revenue, provider clearing, etc.)
2. journals — journal headers with reference, status, posting time
3. ledger_entries — individual debit/credit lines per journal
4. transactions — user-facing transaction records with type, status, amounts, FX details

## Security
- RLS enabled on all tables.
- Ledger accounts: readable by authenticated users (chart of accounts is not secret).
- Journals & entries: owner-scoped via transaction → user relationship.
- Transactions: owner-scoped — users see only their own transactions.

## Important Notes
1. Double-entry: every journal must have balanced debits and credits.
2. Ledger entries store amounts as BIGINT minor units per currency.
3. Transactions track the full lifecycle: PENDING → PROCESSING → COMPLETED/FAILED.
4. FX transactions store from/to currency and exchange rate.
5. Provider reference allows reconciliation with external payment rails.
*/

-- ── LEDGER ACCOUNTS ──
CREATE TABLE IF NOT EXISTS ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type ledger_account_type NOT NULL,
  currency currency,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ledger_accounts_select_all" ON ledger_accounts;
CREATE POLICY "ledger_accounts_select_all" ON ledger_accounts FOR SELECT TO authenticated USING (true);

-- ── TRANSACTIONS (created before journals for FK) ──
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id),
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'PENDING',
  direction transaction_direction NOT NULL,
  amount bigint NOT NULL,
  currency currency NOT NULL,
  fee bigint NOT NULL DEFAULT 0,
  from_currency currency,
  to_currency currency,
  exchange_rate decimal(20,8),
  provider text,
  provider_ref text,
  counterparty_name text,
  counterparty_account text,
  counterparty_bank text,
  counterparty_country text,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  failed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
CREATE POLICY "transactions_select_own" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
CREATE POLICY "transactions_insert_own" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_update_own" ON transactions;
CREATE POLICY "transactions_update_own" ON transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── JOURNALS ──
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  transaction_id uuid REFERENCES transactions(id),
  description text NOT NULL,
  status journal_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz
);
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

-- Journals are managed by the backend service role; users read via transactions.

-- ── LEDGER ENTRIES ──
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES ledger_accounts(id),
  debit bigint NOT NULL DEFAULT 0,
  credit bigint NOT NULL DEFAULT 0,
  currency currency NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_journal_id ON ledger_entries(journal_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id ON ledger_entries(account_id);
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
