# Requirements — Beer Glass App

## v1 Requirements

### Authentication
- [ ] **AUTH-01**: Host can create an account with email and password
- [ ] **AUTH-02**: Host can log in and stay logged in across app sessions

### Glass Management
- [ ] **GLASS-01**: Host can browse a visual list of standard glass types (pint, tulip, snifter, weizen, goblet, etc.)
- [ ] **GLASS-02**: Host can add glass types from the list to their personal collection
- [ ] **GLASS-03**: Host can edit or remove glasses from their collection

### QR Check-in
- [ ] **QR-01**: Host can generate a unique QR code linked to their glass collection
- [ ] **QR-02**: Drinker can scan host's QR code to load the host's glass collection in the app

### Beer Lookup
- [ ] **BEER-01**: Drinker can search for a beer by name
- [ ] **BEER-02**: Drinker can browse/select a beer style manually
- [ ] **BEER-03**: App displays beer info (name, style, ABV) after selection

### Matching Engine
- [ ] **MATCH-01**: App maps beer styles to ideal glass types using established pairing rules
- [ ] **MATCH-02**: App ranks host's available glasses from best to worst fit for the selected beer

### Onboarding & UX
- [ ] **UX-01**: App opens with role selection: "I'm a Host" vs "I'm a Drinker"
- [ ] **UX-02**: Host sees a guided setup wizard (create account → add first glasses)
- [ ] **UX-03**: App includes a visual glass type reference guide with names and descriptions

---

## v2 Requirements (Deferred)

- Barcode scanning (camera UPC scan)
- Beer data API integration (external UPC lookup)
- Password reset via email
- Glass quantity tracking
- AI glass photo identification
- Deep link / Universal Link support for QR codes
- Web fallback page for drinkers without app
- Pairing explanation text ("why this glass")

---

## Out of Scope

- Android support — iOS-first, expand later
- Beer ratings/reviews — Untappd owns this space
- Social feed / following — not a social network
- Brewery finder / taproom locator — out of scope
- Multi-language support — English only for v1
- Beer trading / marketplace — not relevant

---

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| AUTH-01 | — | — | Pending |
| AUTH-02 | — | — | Pending |
| GLASS-01 | — | — | Pending |
| GLASS-02 | — | — | Pending |
| GLASS-03 | — | — | Pending |
| QR-01 | — | — | Pending |
| QR-02 | — | — | Pending |
| BEER-01 | — | — | Pending |
| BEER-02 | — | — | Pending |
| BEER-03 | — | — | Pending |
| MATCH-01 | — | — | Pending |
| MATCH-02 | — | — | Pending |
| UX-01 | — | — | Pending |
| UX-02 | — | — | Pending |
| UX-03 | — | — | Pending |

---
*Last updated: 2026-02-05 after requirements definition*
