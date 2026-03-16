# Phase 3: Glass Collection Management - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Hosts can build and manage their personal glass collection by browsing a catalog of standard glass types, adding types to their collection, viewing/editing/removing glasses, and accessing a visual glass type reference guide. Quantity tracking and advanced filtering are out of scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Glass catalog browsing
- Visual card grid layout, 2-3 columns
- Each card shows: glass illustration, name, and a one-liner description (e.g. "Tulip — Best for Belgian ales and IPAs")
- Core set of ~8-10 standard glass types to start (pint, tulip, snifter, weizen, goblet, pilsner, stange, mug, etc.)
- No search or filtering — just scroll through the grid (catalog is small enough)

### Collection interaction
- Quick-add button on each catalog card — one tap to add, no confirmation step
- Presence-based only (no quantity tracking for now)
- Each glass type has type-specific size options (e.g. Pint: 16oz/20oz, Mug: 16oz/20oz/32oz) — sizes are dynamic based on the glass type selected
- Collection and catalog are separate pages/tabs — not a split view
- Empty collection state: "You haven't added any glasses yet" message with a prominent button to browse the catalog

### Glass visuals
- Simple line-art/flat vector illustrations — clean, consistent style
- Monochrome with a single accent color
- Sourced from open-source SVG sets
- Medium image size on cards — balanced with text, not hero-sized

### Reference guide
- Two access points: expandable detail on each catalog/collection card AND a dedicated "Glass Guide" page
- Quick facts format: name, illustration, 1-2 sentence description, 3-5 beer style pairings
- Accessible to everyone (not just hosts) — educational resource for all visitors
- Guide entries include "Add to Collection" buttons for logged-in hosts — seamless browsing-to-adding flow

### Claude's Discretion
- Exact card styling, spacing, and typography
- Glass type data structure and Firestore schema
- Error state and loading state design
- Specific SVG illustration source selection
- Animation/transitions when adding/removing glasses
- Responsive breakpoints for the card grid

</decisions>

<specifics>
## Specific Ideas

- Glass sizes should reflect real-world common sizes per type — a pint is typically 16oz or 20oz, a mug can go to 32oz, but you don't see 32oz pint glasses. Research actual common sizes per glass type.
- Start with core set (~8-10 types) and expand later — keep it focused.

</specifics>

<deferred>
## Deferred Ideas

- Quantity tracking ("I have 4 tulip glasses") — add in a future iteration
- Catalog expansion beyond core set (~15-20 types) — future enhancement
- Search/filtering of glass catalog — only needed if catalog grows significantly

</deferred>

---

*Phase: 03-glass-collection-management*
*Context gathered: 2026-02-07*
