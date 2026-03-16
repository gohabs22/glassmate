# Requirements — Beer Glass App

## v1 Requirements

### Authentication
- [x] **AUTH-01**: Host can create an account with email and password
- [x] **AUTH-02**: Host can log in and stay logged in across browser sessions

### Glass Management
- [x] **GLASS-01**: Host can browse a visual list of standard glass types (pint, tulip, snifter, weizen, goblet, etc.)
- [x] **GLASS-02**: Host can add glass types from the list to their personal collection
- [x] **GLASS-03**: Host can edit or remove glasses from their collection

### QR Check-in
- [x] **QR-01**: Host can generate a unique QR code linked to their glass collection
- [x] **QR-02**: Drinker can scan host's QR code to open host's collection page in browser

### Beer Lookup
- [x] **BEER-01**: Drinker can search for a beer by name
- [x] **BEER-02**: Drinker can browse/select a beer style manually
- [x] **BEER-03**: App displays beer info (name, style, ABV) after selection

### Matching Engine
- [x] **MATCH-01**: App maps beer styles to ideal glass types using established pairing rules
- [x] **MATCH-02**: App ranks host's available glasses from best to worst fit for the selected beer

### Onboarding & UX
- [x] **UX-01**: Logged-in users see a dashboard with "Manage My Glasses" and "Check In Somewhere"; anonymous visitors go straight to drinker/scan flow
- [ ] **UX-02**: Host sees a guided setup wizard (create account → add first glasses)
- [x] **UX-03**: App includes a visual glass type reference guide with names and descriptions
- [x] **UX-04**: Logged-in user can check in at another host's place as a drinker (dual-role support)

### Beer History
- [ ] **HIST-01**: App records which beers a logged-in drinker has selected at each visit
- [x] **HIST-02**: Logged-in user can view their beer drinking history

---

## v2 Requirements (Deferred)

- Native iOS app (Capacitor wrapper or native Swift)
- Native Android app
- Barcode scanning (camera UPC scan via browser API)
- Beer data API integration (external UPC lookup)
- Password reset via email
- Glass quantity tracking
- AI glass photo identification
- Pairing explanation text ("why this glass")
- Check-in history (which host visited, when)
- Recommended glass history per visit
- PWA offline support

---

## Out of Scope

- Native mobile apps — web-first, native is v2
- Beer ratings/reviews — Untappd owns this space
- Social feed / following — not a social network
- Brewery finder / taproom locator — out of scope
- Multi-language support — English only for v1
- Beer trading / marketplace — not relevant

---

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| AUTH-01 | Phase 2 | 02-01, 02-03 | Complete |
| AUTH-02 | Phase 2 | 02-01, 02-03 | Complete |
| GLASS-01 | Phase 3 | 03-01, 03-02, 03-03 | Complete |
| GLASS-02 | Phase 3 | 03-02, 03-03 | Complete |
| GLASS-03 | Phase 3 | 03-02, 03-03 | Complete |
| QR-01 | Phase 4 | 04-01 | Complete |
| QR-02 | Phase 4 | 04-02 | Complete |
| BEER-01 | Phase 5 | 05-01, 05-02 | Complete |
| BEER-02 | Phase 5 | 05-02 | Complete |
| BEER-03 | Phase 5 | 05-03 | Complete |
| MATCH-01 | Phase 6 | 06-01 | Complete |
| MATCH-02 | Phase 6 | 06-01, 06-02 | Complete |
| UX-01 | Phase 2 | 02-02, 02-03 | Complete |
| UX-02 | Phase 7 | 07-01 | Pending — gap closure |
| UX-03 | Phase 3 | 03-01, 03-03 | Complete |
| UX-04 | Phase 4 | 04-03 | Complete |
| HIST-01 | Phase 7 | 07-01 | Pending — gap closure |
| HIST-02 | Phase 6 | 06-03 | Complete |

---
*Last updated: 2026-03-15 — gap closure phase added for UX-02, HIST-01*
