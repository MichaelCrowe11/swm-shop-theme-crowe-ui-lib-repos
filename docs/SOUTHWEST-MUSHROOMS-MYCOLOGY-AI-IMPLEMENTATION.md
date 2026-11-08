# Southwest Mushrooms Mycology AI — Implementation Plan

**Product owner:** Crowe Logic  
**Customer brand:** Southwest Mushrooms  
**Status:** Pilot interface scaffolded; backend deliberately disabled pending safeguards  
**Branch:** `feature/southwest-mushrooms-mycology-ai`

## Repository audit

The selected repository is `MichaelCrowe11/swm-shop-theme-crowe-ui-lib-repos`. Its `packages/next-app` is a Next.js 15.4.1 / React 19 application with a previously verified build in September 2026. The existing app is an experimental storefront prototype, not a production SaaS platform.

Findings that must be addressed before launch:

- Existing `app/api/chat/route.ts` is mock/keyword response logic, not a connected AI or retrieval service.
- That route contains hardcoded cultivation claims and a sample substrate formula that are not validated knowledge-base content. Do not use it as the source of truth or expose its answers as expert guidance.
- The existing route includes a placeholder API-key fallback. Secrets must never have client-side or source-code defaults.
- The current project has no demonstrated production authentication, tenant isolation, subscription entitlement checks, or reviewed knowledge ingestion.
- The repository's Shopify theme is based on Dawn and its theme license restricts use to Shopify-integrated themes. Keep SaaS application code separate from theme licensing and verify any copied theme assets before reuse.
- The public repo has an experimental status; the application and its dependencies require a fresh install/build/security review before production.

## Work completed in this branch

- Added `app/mycology-ai/page.tsx`: a responsive Southwest Mushrooms-branded pilot workspace with clear non-production status, module overview, and a local-only question capture preview.
- Added `app/api/mycology-ai/route.ts`: a deliberately disabled API boundary returning HTTP 503 until the safety and data requirements are met.
- This scaffold does not send prompts to an AI provider, store user data, charge customers, or claim to provide live cultivation advice.

## Product modules

1. **Mycology Knowledge Assistant:** Retrieval-augmented answers over reviewed documents, with source citations, document version, and explicit uncertainty.
2. **Crop Troubleshooter:** Structured species/process/environment/symptom intake and optional image context. Image interpretation must remain probabilistic and must not claim definitive contamination diagnosis.
3. **Farm Operations:** Batch records, substrate calculations with visible assumptions, schedules, inventory, harvest logs, and exports.
4. **Commercial Farm Assistant:** Forecasts and reports from customer-entered data; all external actions require role checks and explicit approval.

## Required architecture before live AI

- Authentication and server-side authorization on every customer resource.
- Tenant-scoped database records and automated cross-tenant access tests.
- Document ingestion with source ownership, license/permission, version, species, process stage, review status, and chunk-level provenance.
- Retrieval that filters by tenant and document permission, and returns source IDs with each answer.
- Server-side model provider integration only; secrets stored in deployment environment, never in browser bundles or committed files.
- Rate limits, request-size limits, abuse controls, cost metering, and request/audit IDs.
- Evaluation set covering species and stage specificity, substrate arithmetic, contradictory source material, missing context, unsupported claims, and safe abstention.
- Human review workflow for sensitive/high-impact recommendations.
- Payment webhook verification, idempotent entitlement updates, account cancellation and deletion flows.
- Backups, retention policy, monitoring, and incident response.

## Knowledge source policy

Start with the founder-owned cultivation documents and SOPs whose ownership and commercial reuse rights are confirmed. Do not ingest paid third-party books, copied course material, or customer documents into a shared corpus without explicit rights and tenant separation. Maintain source references so each answer can identify the exact supporting material.

## Launch packaging hypothesis

Pricing is a validation hypothesis, not a public offer:

- Starter: $19 one-time, limited feature/usage allowance.
- Professional: $29/month, higher usage and saved troubleshooting cases.
- Commercial: $79/month, farm workspace and operational reporting.
- Custom commercial implementation: quote only after discovery and a written scope.

Do not publish prices until AI cost, support load, usage limits, and feature entitlements are measured.

## Implementation sequence

### Phase 0 — Source and infrastructure audit
- Inventory Southwest Mushrooms cultivation files and confirm commercial reuse rights.
- Inspect the current Cloudflare/Azure deployment, domains, DNS, secrets, database, and payment provider.
- Identify authoritative repositories and remove dependence on mock answers.
- Select auth/database and hosting architecture based on actual deployed resources.

### Phase 1 — Secure knowledge assistant
- Implement auth, tenant model, document ingestion, retrieval, citations, evaluation, and usage metering.
- Keep the public API disabled until tests pass.
- Pilot with five growers and manually review feedback.

### Phase 2 — Troubleshooting
- Structured case capture, image uploads, probabilistic guidance, and reviewed evaluation cases.

### Phase 3 — Farm operations
- Batches, calculators, schedules, inventory, reports, and exports.

### Phase 4 — Commercial integrations
- Per-farm knowledge spaces, role-based permissions, approval queues, audit logs, and support process.

## Acceptance criteria for public launch

- Verified authentication and tenant isolation.
- No unsupported cultivation claim presented as source-backed.
- Each knowledge answer includes supporting source references or abstains.
- Payment-to-entitlement flow tested with signed sandbox events.
- Usage and model costs measured per account.
- Upload, deletion, and data retention policies tested.
- No secrets in repository or browser bundle.
- Pilot users repeatedly use the product and confirm value before wider launch.
