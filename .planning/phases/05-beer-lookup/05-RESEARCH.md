# Phase 5: Beer Lookup - Research

**Researched:** 2026-02-08
**Domain:** Beer database APIs, autocomplete search UI, mobile bottom sheets
**Confidence:** HIGH

## Summary

Beer lookup requires integrating with a beer database API, implementing debounced autocomplete search, and displaying results in a mobile-friendly slide-up panel. Research reveals **CRITICAL FINDING: OpenBreweryDB only provides brewery data, NOT beer data** (no ABV, IBU, or beer names). Alternative APIs exist with comprehensive beer information.

For autocomplete, the React ecosystem has matured around headless UI libraries (Headless UI Combobox) paired with dedicated debounce hooks (use-debounce). Bottom sheet patterns are well-supported for web via react-modal-sheet with Motion animations. Glass matching science is well-documented: beer style is the primary attribute, with ABV and IBU as secondary factors for optimal glass selection.

**Primary recommendation:** Use PunkAPI (415 BrewDog beers with full data) or implement a hybrid approach (API + hardcoded style examples) given the limited free beer API landscape. Headless UI Combobox + use-debounce provides the most maintainable autocomplete pattern for Next.js.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @headlessui/react | ^2.x | Autocomplete combobox | Official Tailwind Labs library, WAI-ARIA compliant, unstyled (works with Tailwind v4) |
| use-debounce | ^10.x | Search debouncing | Most popular React debounce hook, server-rendering friendly, TypeScript support |
| react-modal-sheet | ^3.x | Bottom sheet/slide-up panel | Motion-powered, mobile-optimized gestures, accessibility-ready |
| zod | ^3.x | Form validation (manual entry) | Next.js 16 ecosystem standard, type-safe schema validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | ^5.x | API data fetching/caching | If using external API (PunkAPI), provides request deduplication, caching |
| next-safe-action | ^7.x | Server action validation | If manual entry uses server actions, provides type-safe validation pipeline |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @headlessui/react | Material UI Autocomplete | MUI brings heavyweight styling, conflicts with Tailwind v4 CSS-first approach |
| use-debounce | Custom debounce with useRef | Reinvents wheel, easy to mess up cleanup, no server-rendering support |
| react-modal-sheet | Custom bottom sheet | Complex gesture handling, accessibility concerns, mobile keyboard avoidance |

**Installation:**
```bash
npm install @headlessui/react use-debounce react-modal-sheet zod
# Optional for API integration:
npm install @tanstack/react-query
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── (drinker)/
│   └── lookup/
│       ├── page.tsx              # Search + style browsing UI
│       ├── _components/
│       │   ├── BeerSearch.tsx    # Autocomplete with Combobox
│       │   ├── StyleBrowser.tsx  # Categorized style list
│       │   ├── BeerInfoSheet.tsx # Bottom sheet with beer details
│       │   └── ManualEntryForm.tsx # Not-found fallback form
│       └── actions.ts            # Server actions for manual entry
lib/
├── beer/
│   ├── api.ts                    # API client (PunkAPI or fallback)
│   ├── styles.ts                 # Beer style constants + categories
│   └── types.ts                  # Beer, Style, GlassAttributes types
```

### Pattern 1: Debounced Autocomplete Search
**What:** User types → debounce 300ms → API search → display in Combobox dropdown
**When to use:** Any live search feature requiring API calls

**Example:**
```typescript
// Source: https://headlessui.com/react/combobox + https://www.npmjs.com/package/use-debounce
'use client'

import { Combobox } from '@headlessui/react'
import { useDebounce } from 'use-debounce'
import { useState, useEffect } from 'react'

export function BeerSearch({ onSelect }: { onSelect: (beer: Beer) => void }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300) // 300ms delay
  const [results, setResults] = useState<Beer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const abortController = new AbortController()
    setLoading(true)

    searchBeers(debouncedQuery, abortController.signal)
      .then(setResults)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
      .finally(() => setLoading(false))

    return () => abortController.abort() // Cancel old requests
  }, [debouncedQuery])

  return (
    <Combobox value={null} onChange={onSelect}>
      <ComboboxInput
        placeholder="Search for a beer..."
        onChange={(e) => setQuery(e.target.value)}
        displayValue={() => query}
      />
      <ComboboxOptions className="empty:invisible">
        {loading && <div className="p-2 text-gray-500">Searching...</div>}
        {!loading && results.length === 0 && query.length >= 2 && (
          <div className="p-2 text-gray-500">No results found</div>
        )}
        {results.map((beer) => (
          <ComboboxOption key={beer.id} value={beer}>
            {beer.name} - {beer.brewery}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
```

### Pattern 2: Mobile Bottom Sheet
**What:** Slide-up panel for beer info, dismissible with swipe-down gesture
**When to use:** Displaying detail views on mobile without navigation

**Example:**
```typescript
// Source: https://github.com/Temzasse/react-modal-sheet
import { Sheet } from 'react-modal-sheet'

export function BeerInfoSheet({
  beer,
  isOpen,
  onClose
}: {
  beer: Beer | null
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="p-4">
            <h2 className="text-2xl font-bold">{beer?.name}</h2>
            <p className="text-gray-600">{beer?.style}</p>

            <div className="mt-4 space-y-2">
              <p><strong>ABV:</strong> {beer?.abv}%</p>
              <p><strong>IBU:</strong> {beer?.ibu}</p>
              <p className="text-sm text-gray-700">{beer?.description}</p>
            </div>

            <button
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
              onClick={() => {/* Navigate to glass matching */}}
            >
              Match to glasses
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  )
}
```

### Pattern 3: Server Action Form Validation
**What:** Manual entry form validated with Zod, submitted via server action
**When to use:** Forms requiring server-side validation in Next.js 16

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/forms
// actions.ts
'use server'

import { z } from 'zod'

const ManualBeerSchema = z.object({
  name: z.string().min(1, 'Beer name required'),
  style: z.string().min(1, 'Style required'),
  abv: z.number().min(0).max(100).optional(),
  ibu: z.number().min(0).max(200).optional(),
})

export async function submitManualBeer(formData: FormData) {
  const parsed = ManualBeerSchema.safeParse({
    name: formData.get('name'),
    style: formData.get('style'),
    abv: formData.get('abv') ? parseFloat(formData.get('abv') as string) : undefined,
    ibu: formData.get('ibu') ? parseFloat(formData.get('ibu') as string) : undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Store in state management or database
  return { success: true, beer: parsed.data }
}
```

### Anti-Patterns to Avoid
- **Debouncing in render:** Creating new debounce function on every render breaks debouncing. Use `useDebounce` hook or `useRef`.
- **Not canceling old requests:** Leads to race conditions where older, slower responses override newer ones. Always use `AbortController`.
- **Combobox with controlled value for search:** Don't set `value={query}` on Combobox root. The input manages query, Combobox manages selection.
- **Manual bottom sheet gestures:** Don't build swipe gestures from scratch. Use react-modal-sheet which handles touch, drag, snap points, keyboard avoidance.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Debouncing search input | Custom setTimeout/clearTimeout logic | `use-debounce` hook | Server-rendering bugs, cleanup issues, re-render edge cases |
| Autocomplete dropdown | Custom dropdown with keyboard nav | Headless UI Combobox | WAI-ARIA compliance, keyboard navigation (Arrow/Enter/Esc), focus management |
| Bottom sheet gestures | Touch event handlers for swipe | react-modal-sheet | Mobile keyboard avoidance, snap points, drag velocity physics, accessibility |
| Request cancellation | Manual abort flag tracking | AbortController with useEffect cleanup | React 18+ strict mode compatibility, proper cleanup guarantee |
| Form validation schema | Manual field checking | Zod with server actions | Type inference, error formatting, async validation support |

**Key insight:** Mobile UX (gestures, keyboard handling) and accessibility (ARIA, keyboard nav) have complex edge cases. Use battle-tested libraries.

## Common Pitfalls

### Pitfall 1: Race Conditions in Search
**What goes wrong:** User types "IPA" quickly, then deletes to "IP". Slow "IPA" response arrives after fast "IP" response, displaying wrong results.
**Why it happens:** Older API requests can complete after newer ones, overwriting correct results.
**How to avoid:**
- Use `AbortController` to cancel in-flight requests when new search starts
- Always abort in useEffect cleanup function
**Warning signs:** Results briefly flicker to previous search query, results don't match current input.

**Example prevention:**
```typescript
useEffect(() => {
  const abortController = new AbortController()

  searchAPI(query, abortController.signal)
    .then(setResults)
    .catch(err => {
      if (err.name !== 'AbortError') handleError(err)
    })

  return () => abortController.abort() // Cancel on unmount or new query
}, [query])
```

### Pitfall 2: Debounce Function Recreated on Every Render
**What goes wrong:** Debouncing doesn't work. API called on every keystroke despite debounce code.
**Why it happens:** Creating new debounce function in component body means each render creates fresh function with fresh timer.
**How to avoid:**
- Use `use-debounce` hook (built-in memoization)
- If custom implementation, wrap in `useRef` or `useCallback` with empty deps
**Warning signs:** API requests still fire on every keystroke, debounce delay has no effect.

### Pitfall 3: Bottom Sheet Behind Content
**What goes wrong:** Sheet slides up but appears behind other page content, not tappable.
**Why it happens:** Z-index conflicts, portal rendering issues, CSS stacking context.
**How to avoid:**
- react-modal-sheet renders in portal by default (solves z-index)
- Ensure no parent elements have `isolation: isolate` or `transform` creating stacking context
**Warning signs:** Can see sheet edge but can't interact, sheet content not visible.

### Pitfall 4: Not Validating Manual Entry Style Field
**What goes wrong:** User submits manual entry without selecting style, glass matching fails with undefined.
**Why it happens:** Assuming form validation prevents submission, but client-side validation can be bypassed.
**How to avoid:**
- Always validate style field in server action with Zod
- Make style a required field in schema: `style: z.string().min(1, 'Style required')`
- Display error states in UI with `useActionState`
**Warning signs:** Glass matching throws errors for manual beers, undefined style crashes downstream logic.

### Pitfall 5: OpenBreweryDB Assumed to Have Beer Data
**What goes wrong:** Implement search expecting beer names/ABV/IBU, discover API only has brewery names/locations.
**Why it happens:** Name "OpenBreweryDB" implies beer data, but it's brewery facilities only.
**How to avoid:**
- **CRITICAL:** OpenBreweryDB = brewery data ONLY (addresses, phone numbers, types)
- For beer data (ABV, IBU, styles), use PunkAPI or hardcoded dataset
- Verify API capabilities before committing to implementation
**Warning signs:** API returns brewery names but no beer names, no ABV/IBU fields in response.

## Code Examples

Verified patterns from official sources:

### Categorized Style Browser
```typescript
// Source: Domain research on beer glass matching
const BEER_STYLE_CATEGORIES = {
  'Ales': [
    { id: 'pale-ale', name: 'Pale Ale', examples: ['Sierra Nevada Pale Ale'] },
    { id: 'ipa', name: 'IPA', examples: ['Punk IPA', 'Stone IPA'] },
    { id: 'amber-ale', name: 'Amber Ale', examples: ['Fat Tire'] },
  ],
  'Lagers': [
    { id: 'pilsner', name: 'Pilsner', examples: ['Pilsner Urquell'] },
    { id: 'helles', name: 'Helles', examples: ['Hofbräu Original'] },
  ],
  'Stouts & Porters': [
    { id: 'stout', name: 'Stout', examples: ['Guinness Draught'] },
    { id: 'porter', name: 'Porter', examples: ['Founders Porter'] },
  ],
  'Wheat Beers': [
    { id: 'hefeweizen', name: 'Hefeweizen', examples: ['Weihenstephaner Hefeweizen'] },
    { id: 'witbier', name: 'Witbier', examples: ['Blue Moon'] },
  ],
  'Belgian': [
    { id: 'belgian-dubbel', name: 'Belgian Dubbel', examples: ['Westmalle Dubbel'] },
    { id: 'belgian-tripel', name: 'Belgian Tripel', examples: ['Westmalle Tripel'] },
    { id: 'saison', name: 'Saison', examples: ['Saison Dupont'] },
  ],
} as const

export function StyleBrowser({ onSelectStyle }: { onSelectStyle: (style: string) => void }) {
  return (
    <div className="space-y-6">
      {Object.entries(BEER_STYLE_CATEGORIES).map(([category, styles]) => (
        <div key={category}>
          <h3 className="font-semibold text-lg mb-2">{category}</h3>
          <div className="space-y-1">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => onSelectStyle(style.id)}
                className="w-full text-left p-3 hover:bg-gray-100 rounded"
              >
                <div className="font-medium">{style.name}</div>
                <div className="text-sm text-gray-600">
                  e.g., {style.examples[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### PunkAPI Client
```typescript
// Source: https://github.com/alxiw/punkapi
const PUNK_API_BASE = 'https://punkapi-alxiw.amvera.io/v3'

export interface PunkBeer {
  id: number
  name: string
  tagline: string
  description: string
  abv: number
  ibu: number
  ebc: number
  image: string | null
  food_pairing: string[]
}

export async function searchPunkAPI(
  query: string,
  signal?: AbortSignal
): Promise<PunkBeer[]> {
  const params = new URLSearchParams({
    beer_name: query,
    per_page: '10',
  })

  const response = await fetch(`${PUNK_API_BASE}/beers?${params}`, { signal })

  if (!response.ok) {
    throw new Error(`PunkAPI error: ${response.status}`)
  }

  return response.json()
}

export async function getBeersByStyle(
  style: string,
  signal?: AbortSignal
): Promise<PunkBeer[]> {
  // PunkAPI doesn't have direct style filter, use beer_name to search style terms
  return searchPunkAPI(style, signal)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lodash debounce in class components | `use-debounce` hook | React 16.8+ (Hooks) | Cleaner cleanup, server-rendering support, less bundle size |
| Material UI styled components | Headless UI + Tailwind CSS | Tailwind v3+ era | Smaller bundles, CSS-first styling, no runtime JS for styles |
| React Spring gestures | Motion (Framer Motion) | ~2023 | Simpler API, better mobile performance, built-in accessibility |
| Custom form validation | Zod + server actions | Next.js 13-16 | Type safety, server-side validation, automatic error handling |
| BreweryDB API (paid) | PunkAPI / community APIs | ~2020 | BreweryDB discontinued free tier, community filled gap |

**Deprecated/outdated:**
- **BreweryDB API:** Was the go-to beer database API but discontinued free tier in 2020s, now requires paid license.
- **beer.db Heroku API (prost.herokuapp.com):** Documentation mentions this endpoint but it returns 404 as of 2026, likely shut down.
- **Uncontrolled Combobox pattern:** Old Headless UI examples used uncontrolled inputs, v2+ recommends controlled with `displayValue` prop.

## Open Questions

Things that couldn't be fully resolved:

1. **Comprehensive Free Beer Database API**
   - What we know: PunkAPI has 415 BrewDog beers with full data (ABV, IBU, description). OpenBreweryDB only has breweries, not beers.
   - What's unclear: No free API found with comprehensive beer catalog (thousands of beers across all styles/breweries).
   - Recommendation:
     - **Option A:** Use PunkAPI for search (limited to BrewDog catalog) + hardcoded style examples for browsing
     - **Option B:** Hardcoded dataset of ~50-100 popular beers across all styles (no API dependency)
     - **Option C:** Wait for glass matching requirements (Phase 6) to determine minimal data needed

2. **Glass Matching Attributes Priority**
   - What we know: Style is primary factor, ABV affects glass size (high ABV = smaller glasses like snifters), IBU affects glass shape (high IBU IPAs = tulip to concentrate aroma).
   - What's unclear: Whether EBC/SRM (color), carbonation level, or temperature matter for glass selection in this app's scope.
   - Recommendation: Start with style + ABV + IBU as core attributes. Manual entry form collects these three. Phase 6 planning determines if more needed.

3. **Beer Label Images**
   - What we know: PunkAPI includes `image` field (PNG URLs). OpenBreweryDB has no beer data.
   - What's unclear: Image hosting reliability, fallback strategy if images fail to load.
   - Recommendation: Implement graceful fallback (text-only display if image missing/fails). Images enhance UX but aren't required for glass matching.

4. **Browser Style → Example Beers Source**
   - What we know: Need 2-3 example beers per style (15-20 styles = 30-60 examples total).
   - What's unclear: Whether to fetch from PunkAPI or hardcode.
   - Recommendation: **Hardcode** examples in `lib/beer/styles.ts`. Rationale: PunkAPI limited to BrewDog catalog (won't have examples for all styles), hardcoding ensures predictable examples for MVP, avoids API dependency for browsing flow.

## Sources

### Primary (HIGH confidence)
- **Headless UI Combobox:** https://headlessui.com/react/combobox - Official Tailwind Labs documentation
- **PunkAPI Documentation:** https://github.com/alxiw/punkapi - API endpoint reference, data schema
- **use-debounce npm:** https://www.npmjs.com/package/use-debounce - Library documentation
- **Next.js Forms Guide:** https://nextjs.org/docs/app/guides/forms - Official Next.js 16 form patterns
- **react-modal-sheet:** https://github.com/Temzasse/react-modal-sheet - Library documentation

### Secondary (MEDIUM confidence)
- **Beer Glass Matching:**
  - https://pourmybeer.com/best-glasses-for-beer/ - Glass types and style pairing
  - https://www.beermerchants.com/features/the-world-of-beer-glasses-which-shape-for-which-beer-style - Style-specific recommendations
  - https://www.wine-n-gear.com/blog/the-impact-of-glass-shape-on-beer-tasting/ - How ABV/IBU affect glass selection
- **OpenBreweryDB:** https://www.openbrewerydb.org/documentation - Confirmed brewery-only data (not beer data)
- **React Autocomplete Pitfalls:** https://dev.to/adamgen/making-autocomplete-with-react-common-mistakes-and-their-solutions-58nf - Race conditions, debounce anti-patterns

### Tertiary (LOW confidence)
- **beer.db:** https://openbeer.github.io/ - Mentions Heroku API but endpoint non-functional as of 2026, marked for validation
- **WebSearch results:** Various sources on debouncing, beer APIs - Cross-referenced with official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Headless UI, use-debounce, react-modal-sheet are documented, maintained, Tailwind-compatible
- Architecture: HIGH - Patterns verified from official Next.js and library docs
- Pitfalls: HIGH - Based on official documentation warnings and community-confirmed issues
- Beer API: MEDIUM - PunkAPI verified functional, but limited catalog; OpenBreweryDB limitation confirmed
- Glass matching science: MEDIUM - Beer style → glass pairing well-documented across multiple sources, ABV/IBU effects verified

**Research date:** 2026-02-08
**Valid until:** ~30 days (stable libraries), ~7 days for API endpoint reliability (PunkAPI hosting)
