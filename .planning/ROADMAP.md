# Roadmap: Beer Glass App

## Overview

This roadmap delivers a web app (Next.js + Firebase) that helps beer drinkers find the right glass at a friend's place. We build from foundation to matching engine: project setup → host authentication → glass collection management → QR check-in flow → beer lookup → matching and recommendations. Each phase delivers a complete, testable capability that builds toward the core value: instant beer-to-glass recommendations from a host's actual collection.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Setup** - Next.js project scaffolding and Firebase backend configuration
- [ ] **Phase 2: Role Selection & Authentication** - User role choice and host account system
- [ ] **Phase 3: Glass Collection Management** - Host glass library CRUD and reference guide
- [ ] **Phase 4: QR Check-in Flow** - QR code generation and drinker check-in via URL
- [ ] **Phase 5: Beer Lookup** - Beer search by name or style with info display
- [ ] **Phase 6: Matching & Recommendations** - Style-to-glass mapping and ranked recommendations

## Phase Details

### Phase 1: Project Setup
**Goal**: Project foundation exists with working Firebase connection and basic page routing
**Depends on**: Nothing (first phase)
**Requirements**: None (foundational work)
**Success Criteria** (what must be TRUE):
  1. Next.js project builds and runs on localhost without errors
  2. Firebase is configured and connected (Auth, Firestore initialized)
  3. Basic page routing structure works (home page renders)
**Plans**: TBD

Plans:
- [ ] 01-01: [To be planned]

### Phase 2: Role Selection & Authentication
**Goal**: Users can create accounts and navigate a dashboard that supports both hosting and drinking roles
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, UX-01, UX-02
**Success Criteria** (what must be TRUE):
  1. Logged-in users see a dashboard with "Manage My Glasses" and "Check In Somewhere" options
  2. Anonymous visitors go straight to drinker/scan flow
  3. Host can create an account with email and password
  4. Host can log in and stay logged in across browser sessions
  5. Host sees guided setup wizard after account creation (ready for glass setup)
**Plans**: TBD

Plans:
- [ ] 02-01: [To be planned]

### Phase 3: Glass Collection Management
**Goal**: Hosts can build and manage their personal glass collection
**Depends on**: Phase 2
**Requirements**: GLASS-01, GLASS-02, GLASS-03, UX-03
**Success Criteria** (what must be TRUE):
  1. Host can browse a visual list of standard glass types (pint, tulip, snifter, weizen, goblet, etc.)
  2. Host can add glass types from the list to their personal collection
  3. Host can view their collection with all added glasses displayed
  4. Host can edit or remove glasses from their collection
  5. Site includes a visual glass type reference guide accessible from collection page
**Plans**: TBD

Plans:
- [ ] 03-01: [To be planned]

### Phase 4: QR Check-in Flow
**Goal**: Hosts can generate QR codes and drinkers (anonymous or logged-in) can check in via URL to access host collections
**Depends on**: Phase 3
**Requirements**: QR-01, QR-02, UX-04
**Success Criteria** (what must be TRUE):
  1. Host can generate a unique QR code linked to their glass collection
  2. Host can view, download, and share their QR code from the site
  3. Drinker can scan a host's QR code which opens the collection page in their browser
  4. After scanning, drinker's browser loads the host's glass collection (ready for beer matching)
  5. Logged-in user can check in at another host's place as a drinker (dual-role)
**Plans**: TBD

Plans:
- [ ] 04-01: [To be planned]

### Phase 5: Beer Lookup
**Goal**: Drinkers can search for beers and view beer information
**Depends on**: Phase 4
**Requirements**: BEER-01, BEER-02, BEER-03
**Success Criteria** (what must be TRUE):
  1. Drinker can search for a beer by name with results displayed
  2. Drinker can browse and select a beer style manually from a list
  3. After selecting a beer, page displays beer info (name, style, ABV)
**Plans**: TBD

Plans:
- [ ] 05-01: [To be planned]

### Phase 6: Matching & Recommendations
**Goal**: App matches selected beers to host glasses, displays ranked recommendations, and records beer history for logged-in users
**Depends on**: Phase 5
**Requirements**: MATCH-01, MATCH-02, HIST-01, HIST-02
**Success Criteria** (what must be TRUE):
  1. App maps beer styles to ideal glass types using established pairing rules
  2. App compares selected beer style against host's available glasses
  3. App displays ranked list of host's glasses from best to worst fit for the selected beer
  4. Result page shows recommended glass with beer name, style, ABV, and pairing rationale
  5. App records beer selections for logged-in drinkers
  6. Logged-in user can view their beer drinking history
**Plans**: TBD

Plans:
- [ ] 06-01: [To be planned]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup | 0/? | Not started | - |
| 2. Role Selection & Authentication | 0/? | Not started | - |
| 3. Glass Collection Management | 0/? | Not started | - |
| 4. QR Check-in Flow | 0/? | Not started | - |
| 5. Beer Lookup | 0/? | Not started | - |
| 6. Matching & Recommendations | 0/? | Not started | - |
