# Phase 5: Beer Lookup - Implementation Context

**Generated:** 2026-02-08
**Phase Goal:** Drinkers can search for beers and view beer information

---

## Overview

This phase delivers the beer discovery and selection experience. After checking in at a host's place (Phase 4), drinkers identify what beer they're drinking using either text-based search or style browsing. The selected beer information flows into the glass matching engine (Phase 6).

**Critical boundary:** This phase handles INPUT to the matching engine. Glass recommendations happen in Phase 6.

---

## Search Behavior

### Data Source
- **Primary:** OpenBreweryDB API (live data)
- **Rationale:** Free, no API key required, sufficient for MVP
- **Trade-off:** Accepts API availability dependency for up-to-date beer data

### Search Interaction
- **Trigger:** Live search as you type (debounced)
- **Minimum input:** 2-3 characters before search initiates
- **Search scope:** Beer names + brewery names + style keywords
- **Results display:** Dropdown list (autocomplete pattern) below search input
- **Result limit:** Top 5-10 most relevant results
- **Result content:** Beer name + brewery name (e.g., "Guinness Draught - Guinness")
- **Result sorting:** Relevance-based (best match first)

### Search States
- **Loading:** Show "Searching..." text in dropdown
- **No results:** Display "No results" message in dropdown
- **API failure:** Automatically fallback to style browsing interface

---

## Style Browsing

### Organization
- **Structure:** Grouped by category (hierarchical)
  - Example categories: Ales, Lagers, Stouts & Porters, Wheats, Sours, etc.
- **Coverage:** Core 15-20 major beer styles (covers 90% of common beers)
- **Presentation:** Text-only list (clean, fast, minimal)

### Selection Flow
1. User selects a style from the categorized list
2. System displays example beers of that style
3. User selects a specific beer from examples
4. Proceed to beer information display

---

## Information Display

### Layout
- **Pattern:** Slide-up panel (mobile-friendly bottom sheet)
- **Dismissible:** Can be closed/swiped down

### Information Depth
- **Default view:** Name, style, ABV, brewery, description
- **Expanded view:** Toggle "Show details" reveals IBU, color/SRM, origin/region
- **Progressive disclosure:** Keep initial view clean, allow opt-in to deeper data

### Visual Elements
- **Primary visual:** Beer label image (if available from API)
- **Fallback:** Text-only if no image available

### Call-to-Action
- **Button label:** "Match to glasses"
- **Action:** Proceeds to glass matching/recommendations (Phase 6)

---

## Not-Found Handling

### When Beer Not in Database

**Flow:**
1. User searches but beer isn't found
2. Offer manual entry form to collect beer characteristics
3. User fills form (style required, other fields optional)
4. System shows beer info summary with entered data
5. User proceeds to "Match to glasses"

### Manual Entry Form

**Presentation:** Simple form (all fields visible at once)

**Fields:**
- To be determined by glass matching science (research required)
- Candidates: ABV, IBU, style, flavor notes, color
- **Required:** Style field (dropdown or text input)
- **Optional:** All other characteristic fields

**Validation:** Style must be provided; other fields enhance matching but aren't required

**After submission:** Display entered data in standard beer info format (slide-up panel), then show "Match to glasses" CTA

---

## Deferred Ideas

### Barcode Scanning (Future Phase)
- **Concept:** Allow users to scan beer can/bottle barcode for lookup
- **Why deferred:** Requires camera permissions, scanning library, different UX flow, API barcode support
- **Potential timing:** Phase 5.1 or later enhancement

---

## Open Questions for Research/Planning

1. **OpenBreweryDB capabilities:**
   - Does it support search by name/brewery/style?
   - Does it provide ABV, IBU, beer descriptions?
   - Rate limits and usage constraints?

2. **Glass matching characteristics:**
   - Which beer attributes actually matter for glass selection?
   - What fields should the manual entry form collect?

3. **Example beers for styles:**
   - Should these come from API or be hardcoded examples?
   - How many examples per style?

4. **Beer label images:**
   - Does OpenBreweryDB provide label images?
   - Fallback strategy if images unavailable?

---

## Success Criteria Mapping

| Criterion | Implementation Approach |
|-----------|------------------------|
| Drinker can search for a beer by name with results displayed | Live search with autocomplete dropdown, 5-10 results, OpenBreweryDB API |
| Drinker can browse and select a beer style manually from a list | Categorized style list (15-20 styles) → example beers → beer selection |
| After selecting a beer, page displays beer info (name, style, ABV) | Slide-up panel with basic info + "Show details" toggle for extended data |

---

## Technical Constraints

- **API dependency:** Requires internet connection for OpenBreweryDB access
- **Mobile-first:** Slide-up panel pattern optimized for mobile devices
- **API failure resilience:** Must gracefully fallback to style browsing if API unavailable
- **Progressive enhancement:** Manual entry ensures users can proceed even if their beer isn't in database

---

## User Experience Principles

1. **Speed:** Live search with debouncing, minimal loading states
2. **Clarity:** Clear result formatting, explicit CTAs
3. **Resilience:** Multiple paths to success (search → style browse → manual entry)
4. **Progressive disclosure:** Show essentials first, details on demand
5. **Mobile-optimized:** Bottom sheet, touch-friendly interactions
