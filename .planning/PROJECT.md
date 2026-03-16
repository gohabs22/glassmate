# Beer Glass App

## What This Is

A web app that helps beer drinkers find the right glass for their beer when visiting a friend's home. Hosts register their glass collection, guests check in via QR code (opens directly in browser), search or select a beer, and get a ranked recommendation of which available glass to use based on established beer-style-to-glass pairings.

## Core Value

When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.

## Requirements

### Validated

- Host account creation and authentication — v1.0
- Host glass collection management (add/remove glass types) — v1.0
- Pick-from-list glass entry with 8 glass types — v1.0
- QR code generation for host's collection (direct URL, no app install) — v1.0
- Anonymous drinker check-in via QR code scan (opens in browser) — v1.0
- Beer search by name (63-beer catalog) or style selection (20 styles) — v1.0
- Style-based beer-to-glass matching engine with 45 pairing rationales — v1.0
- Ranked glass recommendations from host's available collection — v1.0
- Result screen showing recommended glass, beer name/style/ABV, and pairing rationale — v1.0
- Visual glass reference guide with names and descriptions — v1.0
- Dual-role support (logged-in user can check in as drinker at other hosts) — v1.0
- Beer history recording and viewing for logged-in drinkers — v1.0
- Guided setup wizard for new hosts — v1.0

### Active

(None — next milestone not yet planned)

### Out of Scope

- Native iOS/Android app — web-first, native apps are a future feature
- Monetization / in-app purchases — passion project, free
- Social features (following, sharing, feeds) — not a social network
- Beer rating or review system — plenty of apps do this already
- AI/ML recommendation engine — style-based rules are well-established and sufficient
- Multi-language support — English only
- Barcode scanning — manual search/select works well

## Context

- **Current state:** v1.0 shipped with 4,087 LOC TypeScript across 129 files
- **Tech stack:** Next.js 16 (App Router), Firebase (Auth + Firestore), Tailwind CSS v4, TypeScript
- Two distinct user types: hosts (setup-heavy, occasional) and drinkers (scan-and-go, frequent)
- Beer-to-glass pairings are rules-based (IPA -> tulip/pint, stout -> snifter, wheat -> weizen, etc.)
- QR code links directly to /c/{userId} — no app install needed
- Mobile-first responsive design for use at social gatherings
- 8 glass types, 20 beer styles, 63 individual beers in catalog

## Constraints

- **Platform**: Web (Next.js + React) — mobile-first responsive, works on any device
- **Backend**: Firebase — Auth, Firestore, Hosting, generous free tier
- **Budget**: Zero — passion project, use free tiers where possible
- **Design**: Warm & crafty beer-culture aesthetic — amber-600 accent, pub feel
- **Deployment**: Vercel or Firebase Hosting — zero-config deployment

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web over native iOS | No Xcode requirement, works on all devices, QR -> browser is frictionless | Good |
| Next.js over other frameworks | SSR/SSG, App Router, great Firebase integration, Vercel deployment | Good |
| Firebase over Supabase | Mature web SDK, Auth + Firestore + Hosting, already researched | Good |
| Style-based rules over AI matching | Well-established pairings, simpler to build and maintain, deterministic | Good |
| Anonymous drinkers (no account) | Reduces friction — scan QR and go, no signup wall | Good |
| Client-side auth over server actions | Firebase onAuthStateChanged doesn't fire from server-side calls | Good |
| Hardcoded beer catalog over API | No free beer API exists; 63 beers across 20 styles is sufficient for v1 | Good |
| Direct string matching for pairing | Catalog uses exact style names, making direct comparison reliable | Good |
| Opt-in history save over auto-record | Respects user choice, avoids unwanted data collection | Good |

---
*Last updated: 2026-03-15 after v1.0 milestone*
