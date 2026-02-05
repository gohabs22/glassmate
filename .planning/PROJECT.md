# Beer Glass App

## What This Is

A mobile app that helps beer drinkers find the right glass for their beer when visiting a friend's home. Hosts register their glass collection (types and quantities), guests check in via QR code, scan a beer's barcode, and get a ranked recommendation of which available glass to use based on established beer-style-to-glass pairings.

## Core Value

When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Host account creation and authentication
- [ ] Host glass collection management (add/remove glass types with quantities)
- [ ] Glass identification via photo with AI suggestion + manual confirm
- [ ] Pick-from-list glass entry for quick setup
- [ ] QR code generation for host's collection (deep link with web fallback)
- [ ] Anonymous drinker check-in via QR code scan
- [ ] Beer barcode scanning with external API lookup
- [ ] Style-based beer-to-glass matching engine
- [ ] Ranked glass recommendations from host's available collection
- [ ] Result screen showing recommended glass, beer name/style/ABV, and pairing info
- [ ] Host glass quantity tracking

### Out of Scope

- Android support — iOS-first, expand later
- Monetization / in-app purchases — passion project, free
- Social features (following, sharing, feeds) — not a social network
- Beer rating or review system — plenty of apps do this already
- AI/ML recommendation engine — style-based rules are well-established and sufficient
- Multi-language support — English only for v1
- Offline mode — requires API access for beer lookups

## Context

- Two distinct user types with very different flows: hosts (setup-heavy, occasional) and drinkers (scan-and-go, frequent)
- Beer-to-glass pairings are well-established in craft beer culture (IPA → tulip/pint, stout → snifter/tulip, wheat → weizen, etc.) — this is a rules-based mapping, not opinion
- External beer database API needed for barcode → beer style lookup (Untappd, OpenBreweryDB, or similar)
- QR code must work as deep link (opens app if installed) with web fallback (functional page if not installed)
- Glass photo identification needs on-device or cloud-based image recognition with user confirmation step
- Casual hangout context — UX should be quick and frictionless, not fussy

## Constraints

- **Platform**: iOS only (Swift/SwiftUI) — native for best camera/barcode performance
- **Backend**: Firebase or Supabase — hosted BaaS for auth, database, and storage
- **Beer Data**: External API dependency — app value depends on reliable beer lookup
- **Budget**: Zero — passion project, use free tiers where possible
- **Design**: Warm & crafty beer-culture aesthetic — warm tones, textured, pub feel

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Native Swift over cross-platform | Best camera/barcode scanning performance, App Store standard | — Pending |
| Firebase/Supabase over custom backend | Free tier sufficient, built-in auth, fast to build | — Pending |
| Style-based rules over AI matching | Well-established pairings, simpler to build and maintain, deterministic | — Pending |
| Anonymous drinkers (no account) | Reduces friction — scan QR and go, no signup wall | — Pending |
| AI glass photo ID with confirm | Better UX than manual-only, confirmation prevents errors | — Pending |
| Deep link + web fallback for QR | Works whether drinker has app installed or not | — Pending |

---
*Last updated: 2026-02-04 after initialization*
