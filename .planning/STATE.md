# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.
**Current focus:** All 6 phases complete — milestone 1 delivered

## Current Position

Phase: 6 of 6 (Matching & Recommendations)
Plan: 3 of 3 in current phase
Status: All plans complete
Last activity: 2026-03-15 — Phase 6 fully executed and verified

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 18
- Average duration: 5 min
- Total execution time: ~1.7 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-project-setup | 2 | 16 min | 8 min |
| 02-role-selection-authentication | 3 | 14 min | 5 min |
| 03-glass-collection-management | 3 | 9 min | 3 min |
| 04-qr-check-in-flow | 3 | 17 min | 6 min |
| 05-beer-lookup | 3 | 13 min | 4 min |
| 06-matching-recommendations | 3 | 25 min | 8 min |

**Recent Trend:**
- Last 5 plans: 4min, 5min, 12min, 5min, 5min
- Trend: Stable execution times

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
- users/{userId}/history subcollection for beer history (opt-in save)
- Presence-based glass collection (no duplicate prevention, one entry per type)
- GlassCard component handles both catalog and collection modes
- Amber-600 accent color for beer culture aesthetic
- Responsive 1-2-3 column grid layout for catalog/collection
- Public guide at /guide outside (dashboard) group for unauthenticated access
- QR code URL structure: /c/{userId} for check-in links (short, memorable)
- QR code generation: 256px, error correction level M, react-qr-code library
- Web Share API with graceful fallback to download-only on unsupported devices
- URL.revokeObjectURL cleanup pattern to prevent memory leaks in blob downloads
- Dashboard 4-card grid layout (Manage Glasses, QR Code, Check In, Beer History)
- Dual-role UX: Logged-in users at another host's collection see confirmation dialog
- Host scanning own QR code sees full drinker experience (no confirmation gate)
- Firebase auth in public routes: Direct onAuthStateChanged pattern (no AuthProvider dependency)
- No free beer API exists — hardcoded catalog of 63 real beers across all major styles
- react-modal-sheet uses named import { Sheet }, detent "content" (not "content-height")
- Headless UI Combobox for search autocomplete, use-debounce for 300ms debounce
- Direct string matching for beer-to-glass pairing (no fuzzy matching needed)
- Pairing rationale keyed as "glassId:beerStyle" for O(1) lookup (45 entries + 8 generic)
- Empty glass collection returns idealGlass from catalog (app always useful)
- Two match tiers: Recommended (green dot) and Other (gray dot)
- History entries show per-host beer count via client-side grouping
- Anonymous users see signup nudge instead of save button

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-15
Stopped at: All phases complete — milestone 1 fully delivered
Resume file: .planning/phases/06-matching-recommendations/VERIFICATION.md
