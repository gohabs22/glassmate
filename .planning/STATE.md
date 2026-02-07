# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.
**Current focus:** Phase 2 complete — ready for Phase 3

## Current Position

Phase: 2 of 6 (Role Selection & Authentication) ✓ COMPLETE
Plan: 3 of 3 in current phase
Status: Phase verified and complete
Last activity: 2026-02-07 — Phase 2 verified (human + automated)

Progress: [███░░░░░░░] 33%

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: 5 min
- Total execution time: 0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-project-setup | 2 | 16 min | 8 min |
| 02-role-selection-authentication | 3 | 14 min | 5 min |

**Recent Trend:**
- Last 5 plans: 3min, 3min, 3min, 8min
- Trend: Consistent 3-5min per plan

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-07
Stopped at: Phase 2 complete, verified, ready for Phase 3
Resume file: None
