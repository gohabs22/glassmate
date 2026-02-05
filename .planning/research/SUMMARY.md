# Research Summary — Beer Glass App

## Stack Recommendations

| Layer | Choice | Rationale | Confidence |
|-------|--------|-----------|------------|
| **UI** | SwiftUI | Modern declarative UI, native iOS | High |
| **Barcode Scanning** | VisionKit DataScannerViewController (iOS 16+) | Built-in camera UI, minimal code, supports UPC/EAN/QR | High |
| **QR Generation** | Core Image CIFilter (CIQRCodeGenerator) | Native, no dependencies | High |
| **Deep Links** | Universal Links + Associated Domains | Apple's standard for app-to-web fallback | High |
| **Image Recognition** | Core ML + Create ML (or Vision API) | On-device glass identification, privacy-friendly | Medium |
| **Backend** | Firebase (Auth + Firestore + Storage) | Free tier generous, real-time sync, built-in auth | High |
| **Beer Data API** | **PROBLEM — see below** | No single great option | Low |

### Beer Data API — Critical Finding

- **Untappd API**: Best beer/UPC database but **barcode lookup is explicitly blocked for third-party API access**
- **OpenBreweryDB**: Free and open but only has **brewery data**, not individual beers or UPC codes
- **Alternatives to evaluate**: UPCitemdb, Barcode Lookup API, Open Food Facts — general product DBs with varying beer coverage
- **Fallback strategy needed**: Manual beer search when barcode lookup fails

**Recommendation**: Use a general UPC API (UPCitemdb or similar) for barcode→product name, then map product name to beer style. Build a growing internal database of barcode→beer mappings over time. Allow manual beer style selection as fallback.

## Feature Categories

### Table Stakes (must have)
- Barcode scanning that returns beer info
- Glass collection management for hosts
- Beer-to-glass recommendation engine
- QR code check-in flow

### Differentiators (competitive advantage)
- Two-role system (host + drinker) — unique in beer app space
- Contextual recommendations based on host's actual inventory
- AI glass photo identification
- "Best available" ranking (not just ideal glass)

### Anti-Features (don't build)
- Beer ratings/reviews (Untappd owns this)
- Social feed / following system
- Brewery finder / taproom locator
- Beer trading / marketplace

## Architecture — Key Components

1. **Auth Layer** — Firebase Auth (hosts only, email/password)
2. **Data Layer** — Firestore collections: users, glassCollections, glassPairings
3. **Scanner Module** — VisionKit for barcode + QR scanning
4. **Beer Lookup Service** — UPC API client + internal cache + manual fallback
5. **Matching Engine** — Rules-based beer style → glass type mapping
6. **Glass ID Module** — Core ML model for photo → glass type classification
7. **Deep Link Handler** — Universal Links for QR → app routing with web fallback
8. **Web Fallback Page** — Simple hosted page for drinkers without the app

### Suggested Build Order
1. Project scaffolding + Firebase setup + Auth
2. Glass collection CRUD (host flow)
3. QR code generation + deep links
4. Barcode scanning + beer lookup
5. Matching engine + recommendation UI
6. Glass photo identification (AI)
7. Polish + web fallback page

## Key Pitfalls

| Pitfall | Risk | Prevention |
|---------|------|------------|
| **Beer barcode API unreliability** | High | Build fallback (manual search), cache results, grow internal DB |
| **Universal Links setup complexity** | Medium | Requires Apple Developer account, AASA file on web server, test early |
| **Glass photo ML model training data** | Medium | Start with manual confirm, improve model over time with user corrections |
| **Two-user-type UX confusion** | Medium | Clear onboarding flow, distinct host vs drinker entry points |
| **Firestore security rules** | Medium | Anonymous drinkers need read-only access to host collections, test rules early |
| **App Store review for camera usage** | Low | Clear privacy descriptions, only request camera when needed |

## Sources
- [Untappd API Docs](https://untappd.com/api/docs)
- [OpenBreweryDB](https://www.openbrewerydb.org/)
- [VisionKit DataScanner — WWDC22](https://developer.apple.com/videos/play/wwdc2022/10025/)
- [Beer Glassware Guide — KegWorks](https://www.kegworks.com/blog/beer-glassware-guide-beer-glass-types-uses/)
- [BeerAdvocate Glassware Guide](https://www.beeradvocate.com/beer/101/glassware/)
- [WSET Beer Glass Guide](https://www.wsetglobal.com/knowledge-centre/blog/2024/how-to-pick-the-perfect-beer-glass)
