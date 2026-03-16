# Phase 6: Matching & Recommendations - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Match selected beers to host glasses using style-based pairing rules, display ranked recommendations with rationale, and record beer history for logged-in users. This phase delivers the app's core value — telling a drinker which glass to use.

</domain>

<decisions>
## Implementation Decisions

### Recommendation Display
- Results appear in a **new bottom sheet** (separate from the beer info sheet)
- **Ranked list** layout — all glasses same size, numbered, with match quality indicator
- Each glass shows: glass name + style-specific rationale + color dot/bar for match quality
- **Compact beer recap** at top of results sheet (beer name, style, ABV) then glass list below
- **Two match tiers**: Recommended (green) and Other options (gray)
- When only "Other options" tier glasses exist, still **highlight one as "best available"** with a disclaimer ("Not ideal, but it'll do the job")
- After matching, the check-in page **stays the same** — drinker can re-tap "Match to Glasses" to see results again
- Drinker **closes the sheet** by swiping/tapping backdrop — no explicit "done" button

### Pairing Rationale
- **Two sentences** per glass-style pairing explaining why it's recommended
- Rationale is **style-specific** (references the beer style, not the specific beer name)
- **Hardcoded pairings** — each glass-style combo has a hand-written rationale (more authentic, beer-nerdy)
- **Casual pub vibe** tone — friendly and approachable, not academic ("This glass keeps your IPA smelling amazing" not "Concentrates volatile hop compounds")

### No-Match Scenario
- When host has no ideal glass: show **best available + disclaimer** ("Your best bet is the Pint Glass" + "Not ideal, but it'll do the job")
- When host has **zero glasses**: still allow matching — show the **ideal glass type from the catalog** (generic recommendation rather than host-specific)
- Always highlight one glass at top as "best available" even if nothing is a great match

### Beer History
- Accessible on a **separate /history page** linked from dashboard
- Each entry shows: beer name, style, recommended glass, host name, **count of beers at that host's place**
- History is **opt-in** via a "Save to history" button on the results sheet (not auto-recorded)
- **Logged-in users only** can save — anonymous drinkers see a **gentle nudge** ("Sign up to save your beer history")

### Claude's Discretion
- Exact color values for match quality dots/bars
- Results sheet height and scroll behavior
- History page layout and pagination
- Firestore data model for history storage
- How to structure the pairing rules data

</decisions>

<specifics>
## Specific Ideas

- History should feel like a mini check-in log — "you had 3 beers at Mike's place"
- The disclaimer for non-ideal matches should be reassuring, not apologetic — it's a casual hangout, any glass is fine
- Empty collection matching (showing ideal glass from catalog) means the app is always useful even before a host sets up

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-matching-recommendations*
*Context gathered: 2026-02-20*
