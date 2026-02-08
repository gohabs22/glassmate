# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.
**Current focus:** Phase 3 complete — ready for Phase 4

## Current Position

Phase: 4 of 6 (QR Check-In Flow)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-02-08 — Completed 04-01-PLAN.md (QR code generation)

Progress: [█████░░░░░] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 4 min
- Total execution time: 0.8 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-project-setup | 2 | 16 min | 8 min |
| 02-role-selection-authentication | 3 | 14 min | 5 min |
| 03-glass-collection-management | 3 | 9 min | 3 min |
| 04-qr-check-in-flow | 1 | 7 min | 7 min |

**Recent Trend:**
- Last 5 plans: 2min, 5min, 7min
- Trend: Fast execution for UI component tasks

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Platform pivot: iOS → Web (Next.js + Firebase) — Xcode not available on dev machine
- Framework: Next.js (App Router, React-based, Vercel deployment)
- Backend: Firebase (Auth, Firestore, Hosting)
- Native iOS app deferred to v2
- Tailwind CSS v4 with @tailwindcss/postcss (CSS-based config, no tailwind.config.ts)
- TypeScript strict mode with @ path alias for src imports
- Server Components by default (client components only when needed)
- Firebase singleton initialization pattern with getApps() guard prevents re-initialization bugs
- Environment variables prefixed with NEXT_PUBLIC_ for client-side access
- .env.example committed (template), .env.local gitignored (secrets)
- Route groups organize features without affecting URL structure
- Middleware uses __session cookie for lightweight auth check (optimistic, no Firebase calls)
- Auth calls happen client-side (not server actions) so onAuthStateChanged fires naturally
- SetupWizard dismiss state stored in localStorage
- useEffect for redirect on dashboard prevents setState-during-render warning
- Firestore operations client-side to match auth pattern
- users/{userId}/glasses subcollection for glass ownership
- Presence-based glass collection (no duplicate prevention, one entry per type)
- GlassCard component handles both catalog and collection modes
- Amber-600 accent color for beer culture aesthetic
- Responsive 1-2-3 column grid layout for catalog/collection
- Public guide at /guide outside (dashboard) group for unauthenticated access
- QR code URL structure: /c/{userId} for check-in links (short, memorable)
- QR code generation: 256px, error correction level M, react-qr-code library
- Web Share API with graceful fallback to download-only on unsupported devices
- URL.revokeObjectURL cleanup pattern to prevent memory leaks in blob downloads

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-08
Stopped at: Completed 04-01-PLAN.md (QR code generation)
Resume file: None
