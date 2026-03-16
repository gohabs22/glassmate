---
phase: 07-audit-gap-fixes
plan: 01
subsystem: gap-closure
tags: [bugfix, middleware, dead-code, edge-case]

# Dependency graph
requires:
  - phase: 06-matching-recommendations
    provides: ResultsSheet, matching engine, history save wiring
provides:
  - SetupWizard CTA correctly links to /glasses
  - Save-to-history works for empty-collection hosts (idealGlass fallback)
  - /history route protected by middleware
  - Dead auth-actions.ts removed
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [idealGlass fallback in save handler]

key-files:
  created: []
  modified: [src/components/dashboard/SetupWizard.tsx, src/components/beer/ResultsSheet.tsx, src/app/c/[userId]/page.tsx, src/middleware.ts]
  deleted: [src/lib/firebase/auth-actions.ts]

key-decisions:
  - "Use idealGlass as fallback when bestAvailable is null — saves the ideal glass recommendation to history"
  - "Remove !idealGlass guard on save section — save button should always be visible regardless of collection state"

patterns-established: []

requirements-completed: [UX-02, HIST-01]

# Metrics
duration: 5min
completed: 2026-03-15
---

# Phase 7 Plan 1: Audit Gap Fixes Summary

**4 targeted fixes closing all v1.0 milestone audit gaps**

## Performance

- **Duration:** 5 min
- **Tasks:** 4
- **Files modified:** 4
- **Files deleted:** 1

## Accomplishments
- Fixed SetupWizard CTA link from `/dashboard/glasses` (404) to `/glasses`
- Removed `{!idealGlass && (` guard so save-to-history button shows for empty-collection hosts
- Updated save handler to use `idealGlass` as fallback when `bestAvailable` is null
- Added `/history` to middleware `isProtectedRoute` check
- Deleted unused `auth-actions.ts` server action file (148 lines of dead code)

## Task Commits

All 4 tasks committed atomically:

1. **All tasks** - `5b2a245` (fix)

## Files Modified
- `src/components/dashboard/SetupWizard.tsx` - Changed `href="/dashboard/glasses"` to `href="/glasses"`
- `src/components/beer/ResultsSheet.tsx` - Removed `!idealGlass` conditional wrapper around save section
- `src/app/c/[userId]/page.tsx` - Updated save handler guard to use idealGlass fallback
- `src/middleware.ts` - Added `|| pathname.startsWith('/history')` to isProtectedRoute
- `src/lib/firebase/auth-actions.ts` - Deleted (dead code, never imported)

## Deviations from Plan

None.

## Issues Encountered

None.

## Self-Check: PASSED

- SetupWizard links to `/glasses` (not `/dashboard/glasses`)
- ResultsSheet save section visible regardless of idealGlass
- Save handler uses idealGlass fallback when bestAvailable is null
- `/history` in middleware isProtectedRoute
- `auth-actions.ts` deleted
- `npm run build` passes

---
*Phase: 07-audit-gap-fixes*
*Completed: 2026-03-15*
