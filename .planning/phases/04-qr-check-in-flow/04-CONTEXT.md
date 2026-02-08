# Phase 4: QR Check-in Flow - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Hosts can generate QR codes linked to their glass collection. Drinkers (anonymous or logged-in) scan the QR code to check in and view the host's glasses. Beer lookup and matching are separate phases (5-6).

</domain>

<decisions>
## Implementation Decisions

### QR code presentation
- Dashboard card on the main dashboard (alongside "Manage Glasses" and "Check In") as the access point
- Dedicated full page showing the QR code large, with download and share options below
- Download as PNG image plus native share button (Web Share API for mobile)
- Standard black & white QR code — no branding or colors, maximum scan reliability

### Scan & landing experience
- After scanning, drinker sees host's name/greeting at top with their glass collection below — all on one page
- Reuse existing glass card component in read-only mode (same grid layout host sees, no edit controls)
- Empty collection: show friendly "hasn't added any glasses yet" message plus link to the public glass guide
- Invalid/expired QR: error page with message plus CTA to create their own host account
- Tease the beer flow: "Pick a beer to find your glass!" with a disabled/coming-soon beer button

### Dual-role handling
- Logged-in host scanning another host's QR gets a brief confirmation: "Check in at [Host]'s place?"
- Standard header/nav handles return to own dashboard — no extra persistent back button
- Host scanning their OWN QR code gets the full drinker experience (not redirected to management) — hosts participate in drinking activities and should be able to pick a beer and get glass recommendations like any guest

### Claude's Discretion
- QR code generation library choice
- URL structure for check-in links (e.g., /checkin/[hostId] vs /c/[code])
- Loading states and transitions
- Exact layout of the QR code page
- Check-in confirmation dialog styling

</decisions>

<specifics>
## Specific Ideas

- Host wants to use their own QR code to participate as a drinker at their own place — the experience should be identical to a guest's
- "Coming soon" teaser for beer selection keeps users aware of the full vision even before Phase 5-6

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-qr-check-in-flow*
*Context gathered: 2026-02-07*
