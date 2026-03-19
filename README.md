# Senior Scam Safety MVP

Senior Scam Safety is a mobile-first React and TypeScript MVP for older adults who need a simple way to pause, verify suspicious digital interactions, and contact trusted people before taking risky actions.

## What is included

- `apps/mobile`: React + TypeScript + Tailwind web app intended to run inside Capacitor.
- `packages/core`: shared domain types, demo seed data, and a rules-first scam evaluator.
- `supabase/schema.sql` and `supabase/seed.sql`: starter database model and sample records.
- Local-first storage with optional Supabase configuration.
- Senior-friendly screens for onboarding, home, verification, result review, trusted contacts, activity log, and settings.
- Optional Supabase magic-link sign-in and cloud sync.
- OCR-assisted screenshot reading.
- Accessibility settings for larger text, high contrast, simplified wording, and read-aloud support.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy the mobile env example if you want cloud-backed configuration:

```bash
copy apps\mobile\.env.example apps\mobile\.env
```

3. Start the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment

`apps/mobile/.env.example`

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If these values are not supplied, the app runs in local demo mode using browser storage. That makes the MVP easy to inspect without backend setup.

## Architecture

### Monorepo layout

- `apps/mobile/src/components`: reusable large-touch UI building blocks.
- `apps/mobile/src/screens`: app screens and user flows.
- `apps/mobile/src/services`: storage, notifications, and backend adapters.
- `apps/mobile/src/hooks`: app state and business-flow orchestration.
- `packages/core/src`: domain model, seed data, and rules-first evaluation logic.

### Product flow

1. Welcome and plain-language onboarding.
2. Optional magic-link sign-in for syncing through Supabase.
3. Add one to three trusted contacts.
4. Use the home screen to check a message, number, or screenshot.
5. Extract text from screenshots with OCR when needed.
6. Get a calm risk result with explanation, review checklist, and next action.
7. Share or call a trusted person.
8. Review recent activity in a readable log.

### Scam evaluator

The evaluator is intentionally rules-first for transparency and fast iteration. Current heuristics include:

- urgency language
- secrecy language
- OTP, PIN, password, or code requests
- gift card and crypto requests
- remote access requests
- sensitive banking/personal data requests
- simple suspicious number patterns

Each check returns:

- `riskLevel`
- `score`
- `reasons`
- `explanation`
- `suggestedAction`
- `pauseChecklist`
- `requiresReview`

## Demo scenarios

The app ships with realistic demo scenarios:

- fake bank OTP request
- suspicious overseas caller
- prize screenshot asking for a gift card fee

These are available directly in the verification screens so the MVP is easy to demo without manual data entry.

## Supabase notes

The current scaffold is local-first and production-oriented:

- schema and seed SQL are included
- the mobile app detects whether Supabase env values exist
- email magic-link auth is wired in
- trusted contacts, accessibility settings, and verification history can sync through repository methods
- repository methods are separated so real persistence can evolve without changing the screen layer

Recommended next backend steps:

1. Add Row Level Security policies per user profile.
2. Add caregiver invitation and approval flows.
3. Move caregiver alert orchestration into a small Node service only if server-side delivery logic becomes necessary.
4. Add OCR result storage and moderation limits if usage grows.

## Capacitor and future native extensions

The mobile app is structured for future native safety features:

- `apps/mobile/capacitor.config.ts` is already in place.
- Notification logic is behind a service abstraction.
- Contact/share actions are isolated in UI flows and can later call native plugins.

Future roadmap:

1. Android call screening plugin integration for caller reputation checks.
2. Android SMS classification hooks for suspicious message intake.
3. iOS Call Directory and message filtering extensions through native modules.
4. Secure caregiver alert delivery and acknowledgement workflow.
5. Richer OCR pipeline with image preprocessing and multilingual support.

## Notes for extension

- The UI is deliberately simple, high-contrast, and mobile-first.
- The app does not claim to block all scams.
- The current screenshot flow is intentionally stubbed so it can be replaced later by camera, OCR, or native share-sheet ingestion.
