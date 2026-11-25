# AGENT.md --- Clap API Engineering Instructions

> This file defines how AI coding agents should work on the Clap API.
> Treat it as the project-level source of truth for engineering
> conventions. If the repository contains newer, explicit decisions from
> the project owner, follow those decisions and update this file when
> appropriate.

## 1. Product context

Clap is a web-first cross-border payments product. Its initial payment
corridor is **NGN → XOF**.

Core product concepts:

-   Users have Clap-managed wallet accounts.
-   Clap owns its internal transaction records and ledger.
-   External payment providers facilitate payment collection and/or
    payout; they do not own or dictate Clap's internal wallet balances.
-   TchokoPay is the currently preferred primary provider for the NGN →
    XOF corridor, subject to technical, commercial, liquidity,
    operational, and regulatory due diligence.
-   The system must be designed so additional providers can be added or
    substituted without rewriting wallet, ledger, transfer, or
    user-facing business logic.
-   The product is web-first. Do not assume WhatsApp is the primary
    interface or introduce WhatsApp-specific dependencies unless
    explicitly requested.

Do not invent product capabilities, provider capabilities, regulatory
permissions, settlement arrangements, fees, exchange rates, or
operational guarantees. Verify them against current documentation,
contracts, or explicit project-owner decisions.

## 2. Your role when working with the owner

Act as a senior backend engineer who explains material decisions and
implements carefully.

### Before making changes

1.  Inspect the repository, `package.json`, existing modules, database
    schema, migrations, tests, environment examples, and README.
2.  Identify the existing framework, package manager, naming
    conventions, and architectural patterns. Do not assume the
    repository is empty or that this document overrides working code.
3.  Summarise the intended change and any important assumptions before a
    substantial implementation.
4.  Ask the owner one focused question when a missing product, provider,
    security, or financial decision blocks a safe implementation. Do not
    silently make consequential assumptions.
5.  Prefer small, reviewable changes over broad rewrites.

### While making changes

-   Explain what you are changing and why, especially for financial or
    security-sensitive code.
-   Keep code readable, typed, testable, and consistent with the
    repository.
-   Do not add dependencies for functionality already provided by the
    existing stack.
-   Do not refactor unrelated code.
-   Do not silently change API contracts, database semantics, money
    movement, or provider behaviour.
-   Never claim that a feature, test, migration, deployment, or provider
    integration works unless you have actually verified it.
-   If something cannot be verified, state the limitation clearly.

### After making changes

-   Run the relevant tests, linting, formatting, type checks, and build
    commands that are available.
-   Report the files changed, important design decisions, commands run,
    results, and remaining risks.
-   Call out any required environment variables, migrations, provider
    credentials, dashboard configuration, or manual steps.
-   Never report a test as passing if it was not run.

## 3. Target architecture

Use a **modular monolith** initially. Keep one codebase and deploy the
HTTP API and background worker as separate processes where appropriate.
Do not introduce microservices without an explicit architectural
decision.

### Preferred stack

  -----------------------------------------------------------------------
  Concern                             Preferred technology
  ----------------------------------- -----------------------------------
  Runtime                             Node.js LTS

  Language                            TypeScript, strict mode

  HTTP framework                      NestJS

  Primary database                    PostgreSQL

  ORM / migrations                    Drizzle ORM

  Queue and cache                     Redis + BullMQ

  Email delivery                      Resend

  Email templates                     React Email

  API documentation                   Swagger / OpenAPI

  Request validation                  NestJS DTOs with class-validator
                                      and class-transformer, unless the
                                      repository has an established
                                      alternative

  Testing                             Jest, plus integration tests

  Containers                          Docker

  CI                                  GitHub Actions

  Error monitoring                    Sentry or the repository's
                                      established monitoring service
  -----------------------------------------------------------------------

If the repository already uses a different choice, do not replace it
automatically. Explain the trade-off and get approval before a
foundational stack change.

## 4. Suggested module boundaries

Organise code by business domain. Adapt names to the existing repository
rather than forcing a large restructuring.

-   `auth`: registration, login, verification, sessions, password
    recovery
-   `users`: user profiles and account status
-   `kyc`: identity verification workflows and provider integration,
    when requirements are confirmed
-   `wallets`: wallet accounts, currencies, available and pending
    balances
-   `ledger`: immutable double-entry accounting records
-   `payments`: inbound funding and outbound payment orchestration
-   `fx`: exchange-rate sourcing, quote creation, expiry, and conversion
    calculations
-   `transfers`: cross-border transfer lifecycle and orchestration
-   `transactions`: user-facing transaction history and status
-   `providers`: provider interfaces, adapters, capabilities, and
    provider-specific implementations
-   `webhooks`: authenticated provider event intake and processing
-   `notifications`: email and other approved notification channels
-   `admin`: restricted operational and support functions
-   `common`: shared guards, filters, decorators, utilities, and error
    handling
-   `database`: Drizzle schema, migrations, and database access
-   `workers`: BullMQ processors and scheduled/background jobs

Keep provider-specific code inside its adapter. Do not leak
TchokoPay-specific payloads or status names into core domain models.

## 5. Financial correctness --- non-negotiable

Money movement is the highest-risk part of this system. Correctness
takes priority over convenience and speed.

### Money representation

-   Never use JavaScript floating-point numbers for monetary arithmetic.
-   Store monetary values as integer minor units where the currency's
    exponent is known and modelled correctly, or use PostgreSQL
    `NUMERIC` with a decimal-safe library.
-   Never assume every currency has two decimal places. Store and apply
    currency exponent rules explicitly.
-   Keep currency codes attached to every monetary amount.
-   Do not add, subtract, compare, or convert amounts of different
    currencies without an explicit FX operation.
-   Define and test rounding rules for every conversion and fee
    calculation.
-   Store the rate, rate source, quote timestamp, expiry, fee breakdown,
    and calculation inputs used for each accepted conversion.

### Ledger

-   Use a double-entry ledger for financial movements.
-   Every posted journal entry must balance: total debits must equal
    total credits for that currency and accounting context.
-   Do not update a user's balance as an isolated mutable number without
    corresponding ledger entries.
-   Treat posted ledger entries as immutable. Correct mistakes with
    compensating/reversal entries; do not edit or delete historical
    posted entries.
-   Define the accounting treatment of fees, provider clearing accounts,
    pending funds, reversals, and FX separately.
-   Make balance reads derive from, or be safely reconciled with,
    ledger-backed accounting records.
-   Use database transactions for operations that must commit
    atomically.

### Transaction lifecycle

-   Model transaction states explicitly. Do not rely on arbitrary
    strings or infer success from an HTTP response alone.
-   Distinguish at least: initiated, pending, processing, successful,
    failed, expired, and reversed where relevant. Final states and
    allowed transitions must be documented and enforced.
-   A provider's acceptance response is not necessarily proof of
    settlement or final payout.
-   Do not mark a transaction successful until the required provider
    confirmation and internal accounting conditions are met.
-   Handle late, duplicated, out-of-order, and contradictory provider
    events safely.
-   Record state transitions with timestamps and useful audit metadata.

### Idempotency and concurrency

-   Require or generate idempotency keys for money-moving operations.
-   Enforce idempotency in the database with unique constraints; an
    in-memory check is insufficient.
-   A retry must return or continue the original operation rather than
    create a second debit, credit, deposit, or payout.
-   Protect balance checks and debits against race conditions using
    appropriate database transactions, row locks, constraints, or
    another proven concurrency-control strategy.
-   Design queue jobs and webhook handlers to be safe to execute more
    than once.
-   Never assume a queue delivers a job exactly once.

### Reconciliation and auditability

-   Persist provider references, internal references, raw event
    identifiers, relevant timestamps, and normalised outcomes.
-   Maintain reconciliation workflows between Clap's ledger and provider
    reports or transaction APIs.
-   Log enough information to investigate a discrepancy without exposing
    secrets or unnecessary personal data.
-   Never silently discard a financial mismatch. Surface it for
    investigation and preserve the evidence.

## 6. Provider integration rules

Create a provider abstraction around the actual capabilities Clap needs.
Example capabilities may include:

-   creating a collection or deposit request
-   checking transaction status
-   initiating a payout
-   retrieving supported currencies and corridors
-   retrieving or requesting FX quotes, if the provider actually
    supports this
-   verifying webhook signatures
-   retrieving settlement or reconciliation records

These are capability examples, not claims that TchokoPay supports every
operation.

### TchokoPay

-   Treat TchokoPay as the preferred initial provider for NGN → XOF,
    subject to due diligence and confirmed documentation.
-   Before implementation, inspect the current official API
    documentation and confirm authentication, environments, supported
    endpoints, currencies, fees, limits, quote semantics, payout
    semantics, webhook signing, idempotency, settlement, and error
    formats.
-   Do not fabricate endpoint paths, request fields, response fields,
    headers, status values, or signature algorithms.
-   If documentation or credentials are unavailable, implement only the
    provider interface and tested mock adapter. Clearly mark the live
    adapter as incomplete.
-   Keep provider credentials in environment variables or a secret
    manager. Never commit credentials.
-   Store provider-specific references separately from Clap's internal
    IDs.
-   Normalise provider errors and statuses at the adapter boundary.
-   Add contract tests using documented examples or approved fixtures.
    Do not use real-money transactions for ordinary automated tests.

### Provider independence

Core services should depend on an internal interface, not directly on a
provider SDK. Provider routing should be explicit and auditable. Do not
build "intelligent routing" that can move real funds until routing
rules, fallback behaviour, fees, liquidity checks, and operational
ownership are specified and tested.

## 7. Webhooks and background jobs

### Webhooks

-   Verify signatures using the provider's documented method before
    trusting an event.
-   Reject invalid signatures. Do not invent a verification scheme.
-   Persist the event or a safe, redacted representation before
    acknowledging it when the processing design requires durable intake.
-   Deduplicate events using a stable provider event ID or another
    documented idempotency strategy.
-   Acknowledge promptly after durable receipt, then process
    asynchronously where appropriate.
-   Do not let an untrusted webhook directly mutate wallet balances.
-   Re-fetch provider status when required to resolve ambiguous or
    out-of-order events.
-   Redact secrets and sensitive personal data from logs.

### BullMQ

Use background jobs for work such as email delivery, provider status
checks, webhook processing, reconciliation, and notifications.

-   Configure retries with bounded attempts and backoff.
-   Make processors idempotent.
-   Define failed-job handling and operational visibility.
-   Do not put raw credentials or unnecessary personal data in job
    payloads.
-   Do not make a successful financial API request depend on successful
    email delivery.

## 8. Email with Resend

Use Resend for transactional email and React Email for reusable
templates.

Expected use cases include:

-   account verification and authentication codes
-   welcome and account-security messages
-   deposit and withdrawal notifications
-   transfer status updates and receipts
-   FX conversion confirmations
-   password recovery, if password-based authentication is used

Rules:

-   Send email through a queue worker, not inline in a critical
    money-moving request.
-   Email failure must not reverse or invalidate a successful financial
    transaction.
-   Use verified Clap sending domains and environment-based
    configuration.
-   Keep templates reusable, responsive, accessible, and consistent with
    Clap branding.
-   Do not put full sensitive account details, credentials, or
    authentication secrets in email.
-   Use short-lived, single-use verification tokens and store them
    securely.
-   Never log OTPs, password-reset tokens, API keys, or full
    authentication links.
-   Make email sending observable and retryable without creating
    duplicate user-visible messages where possible.

Suggested environment variables:

``` env
RESEND_API_KEY=
EMAIL_FROM=
APP_PUBLIC_URL=
```

Do not assume a sending domain or sender address is verified until it
has been configured and tested.

## 9. API design

-   Use a versioned API namespace, such as `/api/v1`, unless the
    existing project has an established convention.
-   Use consistent resource naming, HTTP methods, status codes,
    pagination, and error shapes.
-   Validate all external input at the boundary.
-   Use DTOs for request and response contracts; do not expose database
    rows directly.
-   Keep internal provider payloads out of public API responses.
-   Document endpoints, authentication requirements, error responses,
    and example payloads in Swagger.
-   Use explicit response types and avoid `any`.
-   Do not return secrets, internal risk signals, provider credentials,
    or unnecessary personal data.
-   Apply rate limits to authentication, OTP, quote creation, and other
    abuse-sensitive endpoints.
-   Use UTC for persisted timestamps and return ISO 8601 timestamps from
    APIs.
-   Make breaking API changes explicit and coordinate them with the
    frontend.

## 10. Security and privacy

-   Never commit `.env` files, API keys, private keys, passwords,
    tokens, or production data.
-   Maintain `.env.example` with placeholder values only.
-   Hash passwords with a suitable password-hashing algorithm if
    passwords are introduced.
-   Store refresh tokens and verification tokens safely; support
    revocation and expiry.
-   Apply authentication and authorisation guards at the correct
    resource boundaries.
-   Enforce ownership checks so users cannot access another user's
    wallets or transactions by changing an ID.
-   Validate and sanitise user-controlled input.
-   Use secure headers, CORS allowlists, rate limiting, and safe error
    responses.
-   Avoid logging full identity documents, bank details, card details,
    OTPs, access tokens, or other sensitive data.
-   Use least-privilege access for database users, provider keys, and
    deployment credentials.
-   Do not claim that Clap is licensed, compliant, safeguarded, or
    authorised in any jurisdiction unless the owner provides verified
    evidence and approves that wording.
-   Flag regulatory, custody, KYC/AML, sanctions, data-protection, and
    consumer-funds questions for qualified review. Do not provide legal
    conclusions as implementation facts.

## 11. Database and migrations

-   Use Drizzle schema definitions and checked-in migrations.
-   Never modify production schema manually as a substitute for a
    migration.
-   Make migrations safe, reviewable, and reversible where practical.
-   Consider table constraints, foreign keys, unique indexes, and
    indexes for common query paths.
-   Use appropriate decimal/numeric types for money where integer minor
    units are not sufficient.
-   Store timestamps consistently in UTC.
-   Avoid destructive migrations without explicit approval, a backup
    plan, and a data migration strategy.
-   Do not use production customer data in local development or tests.

## 12. Testing expectations

Add tests with every meaningful feature.

Prioritise:

-   unit tests for domain services, FX calculations, fee calculations,
    and state transitions
-   ledger tests proving balanced entries and correct reversal behaviour
-   integration tests for database transactions, constraints, and
    concurrency-sensitive operations
-   provider adapter tests using mocks and documented fixtures
-   webhook tests for invalid signatures, duplicate events, retries, and
    out-of-order events
-   idempotency tests proving retries cannot double-debit or
    double-credit
-   authorisation tests proving users cannot access other users'
    resources
-   queue tests proving retries do not duplicate side effects
-   API end-to-end tests for critical user journeys

Never use floating-point arithmetic in financial tests. Include boundary
cases, rounding cases, duplicate requests, timeouts, and partial
failures.

## 13. Configuration and operational practices

-   Validate required environment variables at application startup.
-   Keep configuration centralised and typed.
-   Separate local, test, staging, and production environments.
-   Use structured logs with correlation IDs and internal transaction
    IDs.
-   Do not log secrets or sensitive financial/identity data.
-   Add health and readiness checks for the API, database, Redis, and
    worker processes as appropriate.
-   Ensure graceful shutdown for HTTP servers and workers.
-   Keep operational runbooks for migrations, provider outages, stuck
    transactions, reconciliation discrepancies, and credential rotation.
-   Prefer explicit timeouts and bounded retries for external calls.

## 14. Implementation workflow for AI agents

For each task:

1.  **Understand:** inspect the relevant code and state the existing
    behaviour.
2.  **Plan:** identify affected modules, schema changes, API changes,
    risks, and tests.
3.  **Confirm:** ask before making a consequential product, accounting,
    security, provider, or infrastructure decision that is not
    specified.
4.  **Implement:** make the smallest complete change consistent with
    project conventions.
5.  **Test:** run targeted tests, then relevant broader checks.
6.  **Review:** inspect the diff for accidental changes, insecure
    logging, missing validation, race conditions, and unhandled failure
    paths.
7.  **Report:** summarise what changed, what was tested, what remains
    incomplete, and any manual steps.

Do not:

-   create fake provider integrations or pretend a mock is
    production-ready
-   hardcode exchange rates, fees, credentials, provider URLs, or
    account balances
-   bypass the ledger to make a wallet feature appear to work
-   trust frontend-supplied balances, fees, rates, transaction statuses,
    or user IDs
-   mark a transfer complete based only on a frontend action or provider
    initiation response
-   swallow exceptions or silently ignore failed financial operations
-   add microservices, event sourcing, Kubernetes, or other
    infrastructure without a demonstrated need and owner approval
-   rewrite working modules just to match a preferred personal style
-   make unrelated changes while implementing a task

## 15. Definition of done

A task is complete only when:

-   the implementation matches the agreed requirement
-   types and validation are in place
-   authorisation and security implications are handled
-   financial invariants and idempotency are preserved where applicable
-   relevant tests are added and run
-   migrations and environment changes are documented
-   API documentation is updated where contracts changed
-   logs and error handling are appropriate
-   known limitations and unverified provider behaviour are disclosed

## 16. Project-owner decisions that must not be guessed

Ask the owner or consult approved project documentation before deciding:

-   exact onboarding and authentication flow
-   KYC provider, required verification levels, and approval rules
-   wallet funding and withdrawal methods
-   whether users can hold NGN, XOF, or both balances at each stage
-   FX quote source, quote validity, spread, and fee model
-   when funds become available or pending
-   transfer limits and risk controls
-   provider fallback and routing policy
-   refund, reversal, dispute, and failed-payout treatment
-   accounting treatment and chart of accounts
-   production hosting, regions, backups, and disaster recovery
-   regulatory and safeguarding arrangements

When a decision is needed, present the options, trade-offs, and your
recommendation. Do not quietly choose a financial or compliance policy.

------------------------------------------------------------------------

**Primary engineering principle:** Clap must remain the source of truth
for its users, internal transaction state, and ledger. External
providers are integrations around that core---not substitutes for it.
