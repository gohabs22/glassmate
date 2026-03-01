# Phase 6: Matching & Recommendations - Research

**Researched:** 2026-03-01
**Domain:** Beer-to-glass pairing algorithms, recommendation display, history tracking
**Confidence:** HIGH

## Summary

This phase implements the core value proposition: matching beers to glasses using established style-based pairing rules, displaying ranked recommendations with casual rationale, and optionally recording beer history for logged-in users.

The existing glass catalog already contains `beerStyles: string[]` arrays that can serve as the foundation for the matching algorithm. Each glass lists 5 compatible beer styles. Cross-referencing with the 20 beer styles in the catalog reveals that the existing mappings are comprehensive but need augmentation with casual rationale text for the recommended pairings.

The matching algorithm will use direct string matching between `beer.style` and each glass's `beerStyles[]` array to create a "Recommended" tier, with all other host glasses falling into "Other options". When no recommended matches exist, the algorithm highlights one "Other options" glass as "best available" with a disclaimer.

For history tracking, a Firestore subcollection `users/{userId}/history` will store beer selections with opt-in via a "Save to history" button. Each entry records beer details, recommended glass, host information, and timestamp.

**Primary recommendation:** Use the existing `beerStyles[]` arrays for matching logic, hardcode two-sentence casual rationale for each glass-style combo, display results in a new bottom sheet separate from BeerInfoSheet, and implement opt-in history saving with client-side Firestore operations.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Recommendation Display
- Results appear in a **new bottom sheet** (separate from the beer info sheet)
- **Ranked list** layout — all glasses same size, numbered, with match quality indicator
- Each glass shows: glass name + style-specific rationale + color dot/bar for match quality
- **Compact beer recap** at top of results sheet (beer name, style, ABV) then glass list below
- **Two match tiers**: Recommended (green) and Other options (gray)
- When only "Other options" tier glasses exist, still **highlight one as "best available"** with a disclaimer ("Not ideal, but it'll do the job")
- After matching, the check-in page **stays the same** — drinker can re-tap "Match to Glasses" to see results again
- Drinker **closes the sheet** by swiping/tapping backdrop — no explicit "done" button

#### Pairing Rationale
- **Two sentences** per glass-style pairing explaining why it's recommended
- Rationale is **style-specific** (references the beer style, not the specific beer name)
- **Hardcoded pairings** — each glass-style combo has a hand-written rationale (more authentic, beer-nerdy)
- **Casual pub vibe** tone — friendly and approachable, not academic ("This glass keeps your IPA smelling amazing" not "Concentrates volatile hop compounds")

#### No-Match Scenario
- When host has no ideal glass: show **best available + disclaimer** ("Your best bet is the Pint Glass" + "Not ideal, but it'll do the job")
- When host has **zero glasses**: still allow matching — show the **ideal glass type from the catalog** (generic recommendation rather than host-specific)
- Always highlight one glass at top as "best available" even if nothing is a great match

#### Beer History
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MATCH-01 | App maps beer styles to ideal glass types using established pairing rules | Glass catalog `beerStyles[]` arrays + beer-to-glass pairing research |
| MATCH-02 | App ranks host's available glasses from best to worst fit for the selected beer | Matching algorithm using direct string matching produces Recommended/Other tiers |
| HIST-01 | App records which beers a logged-in drinker has selected at each visit | Firestore subcollection pattern `users/{userId}/history` |
| HIST-02 | Logged-in user can view their beer drinking history | History page with Firestore queries ordered by timestamp |

</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-modal-sheet | 5.2.1 | Bottom sheet UI | Already in use for BeerInfoSheet, proven pattern |
| Firebase Firestore | 12.9.0 | History storage | Already in use for glasses collection, consistent pattern |
| TypeScript | 5.x | Type safety | Project standard, existing types in `beer/types.ts` |

### Supporting
No additional libraries needed — all functionality can be implemented with existing stack.

### Alternatives Considered
None — constraints specify using existing patterns (bottom sheets, Firestore subcollections, client-side operations).

**Installation:**
No new packages required.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── lib/
│   ├── beer/
│   │   ├── matching.ts          # NEW: Matching algorithm + pairing rationale
│   │   ├── types.ts              # EXTEND: Add MatchResult, MatchedGlass types
│   ├── firebase/
│   │   ├── history-db.ts         # NEW: History CRUD operations
│   │   ├── history-types.ts      # NEW: HistoryEntry type
├── components/
│   ├── beer/
│   │   ├── ResultsSheet.tsx      # NEW: Ranked glass recommendations
│   │   ├── HistoryList.tsx       # NEW: Display beer history
├── app/
│   ├── history/
│   │   ├── page.tsx              # NEW: History page
```

### Pattern 1: Beer-to-Glass Matching Algorithm

**What:** Client-side function that compares a beer's style to all host glasses, produces ranked tiers (Recommended, Other), and includes pairing rationale.

**When to use:** When user taps "Match to Glasses" in BeerInfoSheet.

**Example:**
```typescript
// src/lib/beer/matching.ts
import { Beer } from './types';
import { GlassType } from '../data/glass-catalog';

export type MatchTier = 'recommended' | 'other';

export type MatchedGlass = {
  glass: GlassType;
  size: string;
  tier: MatchTier;
  rationale: string;
  rank: number;
};

export type MatchResult = {
  beer: Beer;
  recommendedGlasses: MatchedGlass[];
  otherGlasses: MatchedGlass[];
  hasIdealMatch: boolean;
  bestAvailable: MatchedGlass | null;
};

/**
 * Match a beer to host's glass collection
 * Returns ranked glasses with rationale
 */
export function matchBeerToGlasses(
  beer: Beer,
  hostGlasses: { glassType: GlassType; size: string }[]
): MatchResult {
  const recommended: MatchedGlass[] = [];
  const other: MatchedGlass[] = [];

  for (const hostGlass of hostGlasses) {
    // Direct string match between beer.style and glass.beerStyles[]
    const isMatch = hostGlass.glassType.beerStyles.includes(beer.style);

    const matchedGlass: MatchedGlass = {
      glass: hostGlass.glassType,
      size: hostGlass.size,
      tier: isMatch ? 'recommended' : 'other',
      rationale: isMatch
        ? getPairingRationale(hostGlass.glassType.id, beer.style)
        : getGenericRationale(hostGlass.glassType.id),
      rank: 0, // Will be set after sorting
    };

    if (isMatch) {
      recommended.push(matchedGlass);
    } else {
      other.push(matchedGlass);
    }
  }

  // Sort within tiers (could use glass.id alphabetically or maintain catalog order)
  recommended.forEach((g, i) => g.rank = i + 1);
  other.forEach((g, i) => g.rank = i + 1);

  const hasIdealMatch = recommended.length > 0;
  const bestAvailable = hasIdealMatch
    ? recommended[0]
    : (other.length > 0 ? other[0] : null);

  return {
    beer,
    recommendedGlasses: recommended,
    otherGlasses: other,
    hasIdealMatch,
    bestAvailable,
  };
}

/**
 * Get style-specific pairing rationale for recommended matches
 */
function getPairingRationale(glassId: string, beerStyle: string): string {
  const key = `${glassId}:${beerStyle}`;
  return PAIRING_RATIONALE[key] || 'A great match for this style.';
}

/**
 * Get generic rationale for non-ideal glasses
 */
function getGenericRationale(glassId: string): string {
  return GENERIC_RATIONALE[glassId] || 'Will work in a pinch.';
}

// Hardcoded rationale — see "Pairing Rationale Database" section below
const PAIRING_RATIONALE: Record<string, string> = {
  // Populated with glass:style combinations
};

const GENERIC_RATIONALE: Record<string, string> = {
  'pint': 'The classic workhorse. Not ideal for every style, but it gets the job done.',
  'mug': 'Sturdy and reliable. Great for casual drinking even if not the perfect match.',
  // ... etc
};
```

### Pattern 2: Multiple Bottom Sheets

**What:** Display ResultsSheet after BeerInfoSheet is closed (not stacked simultaneously).

**When to use:** User taps "Match to Glasses" button in BeerInfoSheet.

**Example:**
```typescript
// src/app/c/[userId]/page.tsx (modifications)
const [showInfoSheet, setShowInfoSheet] = useState(false);
const [showResultsSheet, setShowResultsSheet] = useState(false);
const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

function handleMatchToGlasses(beer: Beer) {
  const result = matchBeerToGlasses(beer, glasses);
  setMatchResult(result);
  setShowInfoSheet(false); // Close info sheet
  setShowResultsSheet(true); // Open results sheet
}

return (
  <>
    <BeerInfoSheet
      beer={selectedBeer}
      isOpen={showInfoSheet}
      onClose={() => setShowInfoSheet(false)}
      onMatchToGlasses={handleMatchToGlasses}
      onChangeBeer={handleChangeBeer}
    />

    <ResultsSheet
      matchResult={matchResult}
      isOpen={showResultsSheet}
      onClose={() => setShowResultsSheet(false)}
      onSaveToHistory={handleSaveToHistory}
      currentUser={currentUser}
      hostName={hostName}
    />
  </>
);
```

**Note:** react-modal-sheet v5.2.1 documentation does not explicitly address multiple simultaneous sheets. Recommended pattern is to close one before opening the next to avoid Z-index or backdrop conflicts.

### Pattern 3: Firestore History Tracking

**What:** Client-side subcollection operations for opt-in beer history.

**When to use:** User taps "Save to history" button in ResultsSheet.

**Example:**
```typescript
// src/lib/firebase/history-types.ts
export type HistoryEntry = {
  id: string;
  userId: string;
  hostUserId: string;
  hostName: string;
  beer: {
    name: string;
    style: string;
    abv: number | null;
    brewery: string;
  };
  recommendedGlass: {
    glassId: string;
    glassName: string;
  };
  timestamp: number;
};

// src/lib/firebase/history-db.ts
import { db } from './config';
import { collection, addDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import type { HistoryEntry } from './history-types';

export async function saveHistoryEntry(
  userId: string,
  hostUserId: string,
  hostName: string,
  beer: Beer,
  recommendedGlass: { glassId: string; glassName: string }
): Promise<void> {
  const historyRef = collection(db, `users/${userId}/history`);

  await addDoc(historyRef, {
    userId,
    hostUserId,
    hostName,
    beer: {
      name: beer.name,
      style: beer.style,
      abv: beer.abv,
      brewery: beer.brewery,
    },
    recommendedGlass,
    timestamp: Date.now(),
  });
}

export async function getUserHistory(userId: string): Promise<HistoryEntry[]> {
  const historyRef = collection(db, `users/${userId}/history`);
  const q = query(historyRef, orderBy('timestamp', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HistoryEntry));
}

export async function getHistoryCountByHost(userId: string, hostUserId: string): Promise<number> {
  const historyRef = collection(db, `users/${userId}/history`);
  const q = query(historyRef, where('hostUserId', '==', hostUserId));

  const snapshot = await getDocs(q);
  return snapshot.size;
}
```

### Anti-Patterns to Avoid

- **Don't open multiple sheets simultaneously**: Close BeerInfoSheet before opening ResultsSheet to avoid Z-index conflicts and confusing UX.
- **Don't auto-save history**: Requirements specify opt-in via "Save to history" button. Auto-saving violates user expectations.
- **Don't use fuzzy matching for beer styles**: Beer catalog styles and glass catalog beerStyles arrays use exact string values. Direct string matching is sufficient.
- **Don't query Firestore history on every page load**: Load history only on the dedicated /history page to minimize reads.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Beer style normalization | Custom fuzzy matching, Levenshtein distance | Direct string equality `beer.style === glassStyle` | Glass catalog already uses exact beer style names from beer styles catalog |
| Bottom sheet UI | Custom modal with gestures | react-modal-sheet | Already proven in BeerInfoSheet, handles swipe gestures, detents, backdrop |
| Timestamp formatting | Manual date math | `new Date(timestamp).toLocaleDateString()` or date-fns if needed | Simple display needs, no timezone complexity |
| History aggregation | Client-side grouping | Firestore `where()` query for host-specific counts | Firestore designed for filtering, client-side grouping requires fetching all entries |

**Key insight:** The existing glass catalog's `beerStyles[]` arrays are hand-curated with exact style names matching the beer catalog. Building a fuzzy matcher would add complexity without benefit and could introduce matching errors.

---

## Common Pitfalls

### Pitfall 1: Beer Style Name Mismatch
**What goes wrong:** Beer catalog uses "IPA" but glass catalog uses "American IPA". Direct string match fails.

**Why it happens:** Catalog data was entered independently without cross-validation.

**How to avoid:**
1. Audit the two catalogs: verify every beer.style value appears in at least one glass.beerStyles array.
2. If mismatches exist, update glass catalog to use exact beer style names OR create a normalization map.
3. Add TypeScript validation: create a union type of valid beer styles and use it for both catalogs.

**Warning signs:**
- All matches fall into "Other options" tier for common styles like IPA.
- Zero recommended matches for popular beers in the catalog.

### Pitfall 2: Empty Glass Collection Handling
**What goes wrong:** Host has zero glasses. Matching function crashes or returns empty result.

**Why it happens:** Constraints specify "still allow matching — show ideal glass type from catalog" but implementation doesn't handle this case.

**How to avoid:**
1. Check if `hostGlasses.length === 0` before running matching logic.
2. When zero glasses, return a special MatchResult with `idealGlassFromCatalog` field.
3. ResultsSheet displays the ideal glass from GLASS_CATALOG with a message like "You'll want a Tulip Glass for this IPA. Let your host know!"

**Warning signs:**
- Check-in page doesn't show "Match to Glasses" button when glass collection is empty.
- ResultsSheet crashes with "Cannot read property of undefined".

### Pitfall 3: Multiple Sheets Z-Index Conflict
**What goes wrong:** Opening ResultsSheet while BeerInfoSheet is still open causes backdrop conflicts or both sheets visible simultaneously.

**Why it happens:** react-modal-sheet doesn't explicitly prevent multiple sheets. Both have `isOpen={true}`.

**How to avoid:**
1. Always set first sheet's `isOpen={false}` BEFORE setting second sheet's `isOpen={true}`.
2. Use sequential state updates or a single state machine:
   ```typescript
   type SheetState = 'info' | 'results' | 'none';
   const [activeSheet, setActiveSheet] = useState<SheetState>('none');

   <BeerInfoSheet isOpen={activeSheet === 'info'} />
   <ResultsSheet isOpen={activeSheet === 'results'} />
   ```

**Warning signs:**
- Clicking backdrop closes one sheet but reveals another underneath.
- Two sheets animating simultaneously.
- Sheet.Backdrop receiving multiple `onTap` events.

### Pitfall 4: Firestore History Permissions
**What goes wrong:** User can't write to `users/{otherUserId}/history` — Firestore security rules block the write.

**Why it happens:** Default security rules restrict writes to `users/{userId}` where `userId === auth.uid`. History writes are to the CURRENT user's subcollection, not the host's.

**How to avoid:**
1. Ensure history is saved to `users/{currentUser.uid}/history`, NOT `users/{hostUserId}/history`.
2. Verify Firestore security rules allow authenticated users to write to their own subcollections:
   ```
   match /users/{userId}/history/{historyId} {
     allow read, write: if request.auth != null && request.auth.uid == userId;
   }
   ```

**Warning signs:**
- History save fails with "Missing or insufficient permissions".
- History entries appear in host's collection instead of drinker's.

### Pitfall 5: Rationale Text Becomes Stale
**What goes wrong:** Hardcoded rationale references beer styles that get renamed or removed.

**Why it happens:** PAIRING_RATIONALE map uses string keys like `"pint:American IPA"` but beer catalog changes "American IPA" to just "IPA".

**How to avoid:**
1. Create a validation script that checks every `glass.beerStyles` entry has a corresponding PAIRING_RATIONALE key.
2. Run validation in CI or as a pre-commit hook.
3. Use TypeScript const objects with keys as template literals for compile-time checking (if possible).

**Warning signs:**
- New beers show generic rationale instead of style-specific text.
- Console warnings about missing rationale keys.

---

## Pairing Rationale Database

Based on existing glass catalog `beerStyles[]` arrays and beer pairing research, here are the hardcoded rationale texts (casual pub vibe, two sentences each):

### Pint Glass Rationale

```typescript
const PINT_RATIONALE = {
  'pint:Pale Ale': 'The pint glass lets you appreciate the balanced hop-malt character without overcomplicating things. Perfect for casual drinking with this classic American style.',
  'pint:IPA': 'This glass shows off the beer\'s color and clarity while giving that hoppy aroma room to breathe. Not as fancy as a tulip, but it gets the job done.',
  'pint:Lager': 'Clean, simple, refreshing — just like this glass. The pint is a no-fuss choice that won\'t get in the way of the crisp lager flavor.',
  'pint:Amber Ale': 'The wide opening lets you take big sips of this malty, caramel-forward beer. A pint glass is the go-to for easy-drinking amber ales.',
  'pint:Porter': 'You\'ll get all those chocolate and coffee notes with plenty of room for the creamy head. A solid choice for darker, sessionable beers.',
};
```

### Tulip Glass Rationale

```typescript
const TULIP_RATIONALE = {
  'tulip:Belgian IPA': 'The tulip traps all those complex fruity esters and hop aromas right under your nose. Plus the stem keeps your hands from warming up the beer.',
  'tulip:Saison': 'The flared rim releases the funky, fruity, spicy character that makes saisons special. This glass was basically made for Belgian farmhouse ales.',
  'tulip:Sour Ale': 'The narrow opening concentrates the tart, funky aromas while the wide bowl gives carbonation room to settle. You want to smell this beer before every sip.',
  'tulip:Double IPA': 'This glass keeps your IPA smelling amazing by trapping those intense hop aromas. The stem also keeps your warm hands away from the cold beer.',
  'tulip:Belgian Strong Ale': 'The bulbous shape supports a thick head and channels all those dark fruit and spice aromas straight to your nose. Belgian beers deserve Belgian glassware.',
};
```

### Snifter Rationale

```typescript
const SNIFTER_RATIONALE = {
  'snifter:Imperial Stout': 'The wide bowl lets you swirl and warm the beer in your hand, releasing layers of chocolate, coffee, and boozy complexity. Sip this one slowly.',
  'snifter:Barley Wine': 'This glass concentrates intense aromas while letting the beer warm up a bit, which brings out the malt richness. Perfect for high-ABV sipping beers.',
  'snifter:Belgian Quad': 'The tapered top traps all those dark fruit, caramel, and spicy yeast aromas. Plus the short stem lets you warm the beer slightly for better flavor release.',
  'snifter:Imperial IPA': 'The snifter focuses those intense hop aromas into a smaller area, making every sniff amazing. Great for big, boozy, hop-forward beers you want to savor.',
  'snifter:Eisbock': 'The wide bowl and narrow top concentrate the rich malt sweetness and boozy warmth. This glass is built for strong, complex lagers you sip, not chug.',
};
```

### Weizen Glass Rationale

```typescript
const WEIZEN_RATIONALE = {
  'weizen:Hefeweizen': 'The tall, curvy shape shows off the hazy golden color and gives that fluffy white head plenty of room. This glass was literally designed for wheat beers.',
  'weizen:Witbier': 'The narrow bottom keeps carbonation lively while the wide top releases those citrus and coriander spice aromas. Perfect for cloudy Belgian-style wheat ales.',
  'weizen:Wheat Ale': 'The tapered design maintains the thick foam head while showcasing the beer\'s hazy appearance. Plus all that height keeps the beer fizzy longer.',
  'weizen:Dunkelweizen': 'The tall glass highlights the dark amber color and supports the signature banana-clove aroma. Just like a hefeweizen, but darker and richer.',
  'weizen:Kristalweizen': 'Even though this wheat beer is filtered clear, the weizen glass still enhances the yeast-driven banana and clove character. The wide top releases delicate aromas beautifully.',
};
```

### Goblet/Chalice Rationale

```typescript
const GOBLET_RATIONALE = {
  'goblet:Belgian Dubbel': 'The wide mouth encourages big sips of this rich, malty abbey ale. The thick head sticks around thanks to the inward curve at the rim.',
  'goblet:Belgian Tripel': 'This heavy, stemmed glass matches the intensity of the beer — strong, complex, and meant to be savored. The wide bowl supports a massive rocky head.',
  'goblet:Quad': 'The goblet\'s large opening lets you appreciate the dark fruit and caramel sweetness with every sip. Belgian monks knew what they were doing with this design.',
  'goblet:Abbey Ale': 'The sturdy, ornate design adds a ritualistic feel to drinking a monastery-inspired beer. Plus the wide rim releases complex malty and fruity aromas.',
  'goblet:Strong Ale': 'The thick glass and wide bowl are built for high-ABV beers you want to sip slowly. The shape helps maintain the head while showcasing rich malt character.',
};
```

### Pilsner Glass Rationale

```typescript
const PILSNER_RATIONALE = {
  'pilsner:Pilsner': 'The tall, slim glass shows off the beer\'s brilliant golden color and lively carbonation. The tapered shape also helps maintain the white foamy head.',
  'pilsner:Czech Lager': 'The narrow design preserves carbonation and channels delicate hop and malt aromas toward your nose. Perfect for crisp, clean European lagers.',
  'pilsner:Light Lager': 'The pilsner glass makes even simple beers look elegant by highlighting clarity and bubbles. The shape keeps the beer cold and refreshing.',
  'pilsner:Kolsch': 'This delicate German ale deserves a delicate glass. The pilsner shape showcases the pale golden color and maintains the subtle fruity-floral aroma.',
  'pilsner:Blonde Ale': 'The tall, slender shape highlights the beer\'s light color and crisp carbonation. A clean, simple glass for a clean, simple beer.',
};
```

### Stange Glass Rationale

```typescript
const STANGE_RATIONALE = {
  'stange:Kolsch': 'The traditional Cologne-style glass for Kolsch — narrow, straight-sided, and meant for small pours. Keeps the delicate beer cold and fresh sip after sip.',
  'stange:Gose': 'The slender cylinder preserves the bright, tart character and lively carbonation. Plus smaller pours mean you can appreciate the salty-sour balance without it warming up.',
  'stange:Berliner Weisse': 'The narrow shape concentrates the sharp, refreshing sourness while the small size encourages quick drinking before the beer warms. Traditional German sour beer glassware.',
  'stange:Light Lager': 'The straight sides and small size keep the beer ice-cold and carbonated. Perfect for crisp, light beers you want to drink fresh.',
  'stange:Altbier': 'This is how they serve Altbier in Düsseldorf — small pours in a narrow glass to keep the copper-colored ale fresh. The shape also highlights the malt-forward character.',
};
```

### Beer Mug Rationale

```typescript
const MUG_RATIONALE = {
  'mug:American Lager': 'The sturdy mug with a handle is perfect for casual drinking and large pours. Great for light lagers you want to enjoy at a barbecue or game day.',
  'mug:Oktoberfest': 'The thick glass keeps the beer cold while the handle prevents your hands from warming it up. Traditional Munich glassware for this fall festival classic.',
  'mug:Marzen': 'The heavy, durable design matches the hearty, malty character of this amber lager. Plus the mug holds a full liter if you\'re feeling ambitious.',
  'mug:Brown Ale': 'The wide mouth lets you appreciate the toasty, nutty malt flavors with every gulp. A no-nonsense glass for a no-nonsense beer.',
  'mug:Irish Red': 'The sturdy, thick-walled mug is perfect for sessionable reds you want to drink without fuss. The handle keeps the beer cold even during long conversations.',
};
```

### Generic Rationale (for "Other options" tier)

```typescript
const GENERIC_RATIONALE = {
  'pint': 'The classic workhorse. Not ideal for every style, but it gets the job done.',
  'tulip': 'Might not be a perfect match, but the tulip\'s shape still helps with aroma.',
  'snifter': 'Not the traditional choice, but it\'ll work if you want to sip slowly.',
  'weizen': 'Designed for wheat beers, but hey, any glass is better than the bottle.',
  'goblet': 'A bit fancy for this style, but it\'ll hold the beer just fine.',
  'pilsner': 'Meant for lighter beers, but the tall shape is still pleasant to drink from.',
  'stange': 'Pretty small for this beer, but it keeps things cold and fresh.',
  'mug': 'Not the ideal match, but a mug is always reliable for casual drinking.',
};
```

---

## Code Examples

Verified patterns from existing codebase:

### BeerInfoSheet Pattern (react-modal-sheet v5.2.1)

```typescript
// Source: src/components/beer/BeerInfoSheet.tsx
import { Sheet } from 'react-modal-sheet';

export default function BeerInfoSheet({ beer, isOpen, onClose }: Props) {
  if (!beer) return null;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="px-6 pb-8">
            {/* Content here */}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
```

**Key points:**
- `detent="content"` sizes sheet to content height
- `Sheet.Backdrop onTap={onClose}` enables swipe/tap to dismiss
- Component returns `null` when data is not available
- No explicit "close" button needed — backdrop handles dismissal

### Firestore Client-Side Pattern

```typescript
// Source: src/lib/firebase/public-glasses-db.ts (adapted for history)
import { db } from './config';
import { collection, getDocs } from 'firebase/firestore';

export async function getUserHistory(userId: string) {
  const historyRef = collection(db, `users/${userId}/history`);
  const snapshot = await getDocs(historyRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
```

**Key points:**
- Client-side operations (no server actions)
- Subcollection path: `users/{userId}/history`
- Use `getDocs()` for fetching collections
- Use `addDoc()` for creating new entries

### Check-In Page State Management

```typescript
// Source: src/app/c/[userId]/page.tsx (adapted for results sheet)
const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
const [showInfoSheet, setShowInfoSheet] = useState(false);
const [showResultsSheet, setShowResultsSheet] = useState(false);

function handleMatchToGlasses(beer: Beer) {
  // Close info sheet first, then open results sheet
  setShowInfoSheet(false);
  setShowResultsSheet(true);
}

return (
  <>
    <BeerInfoSheet
      isOpen={showInfoSheet}
      onClose={() => setShowInfoSheet(false)}
      onMatchToGlasses={handleMatchToGlasses}
    />

    <ResultsSheet
      isOpen={showResultsSheet}
      onClose={() => setShowResultsSheet(false)}
    />
  </>
);
```

**Key points:**
- Separate state variables for each sheet's visibility
- Close first sheet before opening second to avoid conflicts
- Pass handler functions to sheet components for state transitions

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-modal-sheet detent="content-height" | detent="content" | v5.0 (2024) | Renamed prop — use "content" not "content-height" |
| Firestore `get()` | `getDocs()` for collections, `getDoc()` for documents | Firebase v9 (2021) | Modular imports required, tree-shaking enabled |
| Manual beer-glass pairing logic | Glass catalog with `beerStyles[]` arrays | Phase 2 (2026-02) | Pairing rules already embedded in glass data |

**Deprecated/outdated:**
- `detent="content-height"` (v4 and earlier) — use `detent="content"` in v5+
- Firebase v8 namespace API (`firebase.firestore()`) — use modular imports from v9+

---

## Open Questions

1. **Empty glass collection UX**
   - What we know: Constraints specify showing "ideal glass from catalog" when host has zero glasses
   - What's unclear: Should this be a different UI in ResultsSheet, or should the matching algorithm return a special result type?
   - Recommendation: Return a `MatchResult` with `idealGlassFromCatalog: GlassType | null` field. ResultsSheet checks this and renders different UI ("You'll want a Tulip Glass — let your host know!").

2. **History pagination**
   - What we know: User history could grow large over time (100+ entries)
   - What's unclear: Should history page paginate or load all entries?
   - Recommendation: Start with loading all entries (Firestore queries are fast). Add pagination if user testing shows slow loads (unlikely for <1000 entries).

3. **Match quality indicator color values**
   - What we know: Constraints specify "color dot/bar for match quality" — Recommended (green), Other (gray)
   - What's unclear: Exact Tailwind color classes
   - Recommendation: Use `bg-green-500` for recommended, `bg-gray-400` for other. Adjust after visual review.

4. **Beer style name audit**
   - What we know: Glass catalog has 40 total beerStyles entries (8 glasses × 5 styles each). Beer catalog has 20 styles.
   - What's unclear: Do all beer styles appear in glass catalog beerStyles arrays? Are there typos or mismatches?
   - Recommendation: Run a validation script before implementing matching logic. Cross-reference every unique beer.style with all glass.beerStyles values. Fix mismatches.

---

## Sources

### Primary (HIGH confidence)

**Glass Catalog Data:**
- `/src/lib/data/glass-catalog.ts` — 8 glass types with beerStyles arrays (project codebase)

**Beer Catalog Data:**
- `/src/lib/beer/styles.ts` — 20 beer styles across 6 categories (project codebase)
- `/src/lib/beer/catalog.ts` — 63 beers with style field (project codebase)

**Existing Component Patterns:**
- `/src/components/beer/BeerInfoSheet.tsx` — react-modal-sheet usage with detent="content" (project codebase)
- `/src/app/c/[userId]/page.tsx` — Check-in page state management (project codebase)

**Package Versions:**
- `/package.json` — react-modal-sheet v5.2.1, Firebase v12.9.0 (project codebase)

### Secondary (MEDIUM confidence)

**Beer-to-Glass Pairing Research:**
- [WebstaurantStore IPA Glass Guide](https://www.webstaurantstore.com/blog/2402/best-ipa-glasses.html) — Verified IPA glass recommendations (goblet, snifter, specialized IPA glass)
- [Kegworks Beer Glassware Guide](https://www.kegworks.com/blog/beer-glassware-guide-beer-glass-types-uses) — Comprehensive beer style to glass type mapping with rationale
- [WSET Beer Glass Guide](https://www.wsetglobal.com/knowledge-centre/blog/2024/how-to-pick-the-perfect-beer-glass/) — Educational resource on glass selection
- [Daily Meal Tulip Glass for Double IPA](https://www.thedailymeal.com/1543198/serve-double-ipa-beer-tulip-glass/) — Casual explanation of tulip glass benefits for IPAs
- [Beer Cartel Glass Styles Guide](https://beercartel.com.au/blogs/beer-news/blog-beer-glass-styles-which-beer-goes-with-which-glass) — Beer-to-glass pairing reference
- [ChemistryViews Weizen Glass Design](https://www.chemistryviews.org/exploring-the-design-of-the-wheat-beer-glass/) — Scientific explanation of weizen glass shape benefits
- [The Beer Times Snifter Guide](https://www.thebeertimes.com/en/beer-glassware-snifter-glass/) — Snifter glass rationale for high-ABV beers

**react-modal-sheet Documentation:**
- [react-modal-sheet GitHub](https://github.com/Temzasse/react-modal-sheet) — Official documentation for v5.2.1
- [react-modal-sheet npm](https://www.npmjs.com/package/react-modal-sheet) — Package registry page with usage examples

**Firestore Data Modeling:**
- [Cloud Firestore Data Model](https://firebase.google.com/docs/firestore/data-model) — Official Firebase documentation on collections and subcollections
- [Firestore Data Structure Guide](https://firebase.google.com/docs/firestore/manage-data/structure-data) — Best practices for structuring data
- [Building a Time Machine with Firestore](https://medium.com/google-cloud/building-a-time-machine-with-firestore-a-complete-guide-to-data-history-tracking-3bd1d506250c) — History tracking pattern with subcollections
- [Fireship Advanced Data Modeling](https://fireship.io/lessons/advanced-firestore-nosql-data-structure-examples/) — Practical Firestore patterns including history tracking

### Tertiary (LOW confidence)
None — all critical findings verified with HIGH or MEDIUM confidence sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All libraries already in use, versions confirmed in package.json
- Architecture: HIGH — Patterns directly from existing codebase (BeerInfoSheet, Firestore operations)
- Pairing rules: MEDIUM — Based on beer expertise articles, cross-verified with multiple sources
- Pitfalls: MEDIUM — Inferred from common Firestore/React patterns and react-modal-sheet limitations

**Research date:** 2026-03-01
**Valid until:** 30 days (stable ecosystem — React, Firebase, beer pairing principles don't change rapidly)
