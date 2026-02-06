# Beer Glass App

## What This Is

A web app that helps beer drinkers find the right glass for their beer when visiting a friend's home. Hosts register their glass collection, guests check in via QR code (opens directly in browser), search or select a beer, and get a ranked recommendation of which available glass to use based on established beer-style-to-glass pairings.

## Core Value

When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Host account creation and authentication
- [ ] Host glass collection management (add/remove glass types)
- [ ] Pick-from-list glass entry for quick setup
- [ ] QR code generation for host's collection (direct URL — no app install needed)
- [ ] Anonymous drinker check-in via QR code scan (opens in browser)
- [ ] Beer search by name or style selection
- [ ] Style-based beer-to-glass matching engine
- [ ] Ranked glass recommendations from host's available collection
- [ ] Result screen showing recommended glass, beer name/style/ABV, and pairing info

### Out of Scope

- Native iOS/Android app — web-first, native apps are a future feature
- Monetization / in-app purchases — passion project, free
- Social features (following, sharing, feeds) — not a social network
- Beer rating or review system — plenty of apps do this already
- AI/ML recommendation engine — style-based rules are well-established and sufficient
- Multi-language support — English only for v1
- Offline mode — requires API access for beer lookups
- Barcode scanning — v2 feature, manual search/select for v1

## Context

- Two distinct user types with very different flows: hosts (setup-heavy, occasional) and drinkers (scan-and-go, frequent)
- Beer-to-glass pairings are well-established in craft beer culture (IPA → tulip/pint, stout → snifter/tulip, wheat → weizen, etc.) — this is a rules-based mapping, not opinion
- QR code links directly to host's collection page — no app install needed, works on any device with a browser
- Web platform means drinkers need zero setup — scan QR, open browser, pick beer, get recommendation
- Casual hangout context — UX should be quick and frictionless, not fussy
- Mobile-first responsive design — primarily used on phones at social gatherings

## Constraints

- **Platform**: Web (Next.js + React) — mobile-first responsive, works on any device
- **Backend**: Firebase — Auth, Firestore, Hosting, generous free tier
- **Budget**: Zero — passion project, use free tiers where possible
- **Design**: Warm & crafty beer-culture aesthetic — warm tones, textured, pub feel
- **Deployment**: Vercel or Firebase Hosting — zero-config deployment

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web over native iOS | No Xcode requirement, works on all devices, QR → browser is frictionless | Decided |
| Next.js over other frameworks | SSR/SSG, App Router, great Firebase integration, Vercel deployment | Decided |
| Firebase over Supabase | Mature web SDK, Auth + Firestore + Hosting, already researched | Decided |
| Style-based rules over AI matching | Well-established pairings, simpler to build and maintain, deterministic | — Pending |
| Anonymous drinkers (no account) | Reduces friction — scan QR and go, no signup wall | — Pending |
| Native iOS app as future feature | Can wrap with Capacitor or build native later if needed | Decided |

---
*Last updated: 2026-02-06 after platform pivot from iOS to web (Next.js + Firebase)*
