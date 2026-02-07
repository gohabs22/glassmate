# Phase 03: Glass Collection Management - Research

**Researched:** 2026-02-07
**Domain:** Firestore Data Modeling + Next.js App Router CRUD + SVG Assets
**Confidence:** HIGH

## Summary

Phase 3 implements a glass collection management system where hosts can browse a catalog of standard beer glass types, add them to their personal collection with type-specific size options, and access a visual reference guide. This phase centers on three technical domains: (1) Firestore data modeling for user-scoped collections with proper security rules, (2) Next.js App Router CRUD patterns using Server Actions and Server Components, and (3) responsive card grid layouts with SVG glass illustrations.

The standard approach uses a **root collection pattern** (`users/{userId}/glasses` as a subcollection) for each host's glass collection, with a shared catalog defined as static data or a root collection for reference. Server Components handle initial data fetching, while Server Actions manage mutations (add/remove glasses). Security rules enforce user ownership using `request.auth.uid` matching. For visuals, open-source SVG illustration libraries provide consistent line-art glass images that work well with monochrome styling.

Real-world glass sizes vary by type: pints are typically 16oz or 20oz (imperial), tulips 12-16oz, snifters 9-10oz, weizen glasses 16-22oz, mugs 16-32oz, pilsners 10-16oz, and goblets vary widely. The catalog should start with 8-10 core types rather than attempting comprehensive coverage. Card grids use Tailwind CSS's responsive grid utilities (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) with consistent gap spacing.

**Primary recommendation:** Use Firestore subcollections under `/users/{userId}/glasses` for glass collections, Server Actions for add/remove operations, Server Components for catalog browsing, and SVG Repo or Public Domain Vectors for glass illustrations. Do NOT use arrays for glass storage (breaks with 20+ items, can't query efficiently) or root-level collections for user glasses (can't properly secure per-user access).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| firebase/firestore | 11.x (current) | NoSQL database for glass collections | Official Firebase SDK, client-side CRUD with automatic caching and offline support |
| Next.js Server Actions | 16.x | Mutation operations (add/remove glasses) | Built-in Next.js pattern for form submissions and data mutations with automatic revalidation |
| Next.js Server Components | 16.x | Initial data fetching for catalog and collection | Server-side rendering with React cache() for request-level memoization |
| Zod | 3.x/4.x | Server Action input validation | TypeScript-first schema validation, already in project from Phase 2 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React useOptimistic | React 19.x | Optimistic UI updates | For immediate feedback when adding/removing glasses before server confirmation |
| React Suspense + loading.js | React 19.x / Next.js 16.x | Loading states for async Server Components | Show skeleton UI while fetching collection data |
| Tailwind CSS Grid | v4 | Responsive card grid layouts | Already in project, native grid utilities for 2-3 column layouts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Firestore subcollections | Arrays in user document | Arrays have 1MB document limit and can't query individual items efficiently; breaks at scale |
| Server Actions | Client-side mutations with useState | Loses progressive enhancement, requires more client-side error handling, no automatic revalidation |
| SVG illustrations | PNG/JPG images | Raster images don't scale cleanly, larger file sizes, can't easily recolor with CSS |
| Static glass catalog data | Firestore collection | Static data is simpler for read-only catalog (8-10 types), Firestore adds unnecessary complexity |

**Installation:**
```bash
# Already installed from Phase 1 & 2:
# - firebase (auth, firestore)
# - next
# - zod
# - tailwindcss

# No new dependencies required for Phase 3
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── glasses/                    # Glass management routes
│   │   │   ├── page.tsx               # Collection view (Server Component)
│   │   │   ├── catalog/
│   │   │   │   └── page.tsx           # Catalog browsing (Server Component)
│   │   │   └── guide/
│   │   │       └── page.tsx           # Glass reference guide (public)
│   │   └── layout.tsx                 # Already exists from Phase 2
│   └── guide/                          # Public glass guide (no auth)
│       └── page.tsx
├── lib/
│   ├── firebase/
│   │   ├── glasses-actions.ts          # Server Actions for add/remove glasses
│   │   └── glasses-db.ts               # DB operations (Firestore queries)
│   ├── validations/
│   │   └── glasses.ts                  # Zod schemas for glass data
│   └── data/
│       └── glass-catalog.ts            # Static glass type definitions
├── components/
│   ├── glasses/
│   │   ├── GlassCard.tsx              # Card display (Client Component for interactions)
│   │   ├── GlassCatalog.tsx           # Catalog grid (Server Component)
│   │   ├── GlassCollection.tsx        # User collection grid (Server Component)
│   │   ├── EmptyCollection.tsx        # Empty state component
│   │   └── GlassGuideCard.tsx         # Guide detail card
│   └── ui/
│       └── LoadingSkeleton.tsx        # Skeleton UI for loading states
└── public/
    └── assets/
        └── glasses/                    # SVG glass illustrations
            ├── pint.svg
            ├── tulip.svg
            ├── snifter.svg
            └── ...
```

### Pattern 1: Firestore Subcollection for User Glass Collections

**What:** Each user's glass collection is stored as a subcollection under their user document (`users/{userId}/glasses/{glassId}`). Each glass document contains the glass type, selected size, and timestamp.

**When to use:** For user-scoped collections where you need to query/list all glasses for a specific user but don't need to query across all users.

**Example:**
```typescript
// Source: Firebase official docs + research findings
// lib/firebase/glasses-db.ts
import 'server-only';
import { collection, doc, getDocs, addDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firestore';

export type GlassInCollection = {
  id: string;
  glassType: string;        // e.g., "pint", "tulip", "snifter"
  size: string;             // e.g., "16oz", "20oz"
  addedAt: Timestamp;
};

// Fetch user's glass collection
export async function getUserGlasses(userId: string): Promise<GlassInCollection[]> {
  const glassesRef = collection(db, 'users', userId, 'glasses');
  const q = query(glassesRef, orderBy('addedAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as GlassInCollection[];
}

// Add glass to collection
export async function addGlassToCollection(
  userId: string,
  glassType: string,
  size: string
): Promise<string> {
  const glassesRef = collection(db, 'users', userId, 'glasses');
  const docRef = await addDoc(glassesRef, {
    glassType,
    size,
    addedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Remove glass from collection
export async function removeGlassFromCollection(
  userId: string,
  glassId: string
): Promise<void> {
  const glassRef = doc(db, 'users', userId, 'glasses', glassId);
  await deleteDoc(glassRef);
}
```

**Why this pattern:**
- **User ownership is explicit:** Path structure inherently ties glasses to users
- **Security rules are straightforward:** Match `{userId}` to `request.auth.uid`
- **Scales well:** Each user's collection is independent, no cross-user queries needed
- **Avoids array limitations:** No 1MB document limit, can add unlimited glasses, can query/filter individual items

### Pattern 2: Static Glass Catalog Data

**What:** Glass catalog definitions (types, names, descriptions, sizes, beer pairings) stored as a TypeScript constant rather than in Firestore. This is reference data that never changes per-user.

**When to use:** For read-only reference data that's the same for all users and doesn't need real-time updates.

**Example:**
```typescript
// Source: Research on beer glass types and sizes
// lib/data/glass-catalog.ts
export type GlassType = {
  id: string;
  name: string;
  description: string;
  availableSizes: string[];     // Type-specific sizes
  beerStyles: string[];         // 3-5 recommended beer styles
  svgPath: string;              // Path to SVG illustration
};

export const GLASS_CATALOG: GlassType[] = [
  {
    id: 'pint',
    name: 'Pint Glass',
    description: 'Classic pub glass for American ales, lagers, and IPAs',
    availableSizes: ['16oz', '20oz'],  // US pint, Imperial pint
    beerStyles: ['American IPA', 'Pale Ale', 'Lager', 'Amber Ale', 'Porter'],
    svgPath: '/assets/glasses/pint.svg',
  },
  {
    id: 'tulip',
    name: 'Tulip Glass',
    description: 'Curved glass that captures aromas, best for Belgian ales and IPAs',
    availableSizes: ['12oz', '16oz'],
    beerStyles: ['Belgian IPA', 'Belgian Strong Ale', 'Saison', 'Sour Ale', 'Double IPA'],
    svgPath: '/assets/glasses/tulip.svg',
  },
  {
    id: 'snifter',
    name: 'Snifter',
    description: 'Wide bowl for swirling and nosing, ideal for strong, complex beers',
    availableSizes: ['8oz', '10oz'],
    beerStyles: ['Imperial Stout', 'Barley Wine', 'Belgian Quad', 'Imperial IPA', 'Eisbock'],
    svgPath: '/assets/glasses/snifter.svg',
  },
  {
    id: 'weizen',
    name: 'Weizen Glass',
    description: 'Tall, curvaceous glass for wheat beers with thick foam heads',
    availableSizes: ['16oz', '20oz', '22oz'],
    beerStyles: ['Hefeweizen', 'Witbier', 'Wheat Ale', 'Dunkelweizen', 'Kristalweizen'],
    svgPath: '/assets/glasses/weizen.svg',
  },
  {
    id: 'goblet',
    name: 'Goblet/Chalice',
    description: 'Round bowl on a stem, designed for sipping Belgian ales',
    availableSizes: ['10oz', '13oz', '16oz'],
    beerStyles: ['Belgian Dubbel', 'Belgian Tripel', 'Quad', 'Abbey Ale', 'Strong Ale'],
    svgPath: '/assets/glasses/goblet.svg',
  },
  {
    id: 'pilsner',
    name: 'Pilsner Glass',
    description: 'Tall, slim glass showcasing clarity and carbonation of light beers',
    availableSizes: ['12oz', '14oz', '16oz'],
    beerStyles: ['Pilsner', 'Czech Lager', 'Light Lager', 'Kölsch', 'Blonde Ale'],
    svgPath: '/assets/glasses/pilsner.svg',
  },
  {
    id: 'stange',
    name: 'Stange Glass',
    description: 'Narrow cylindrical glass for Kölsch and delicate beers',
    availableSizes: ['6oz', '8oz', '10oz'],
    beerStyles: ['Kölsch', 'Gose', 'Berliner Weisse', 'Light Lager', 'Altbier'],
    svgPath: '/assets/glasses/stange.svg',
  },
  {
    id: 'mug',
    name: 'Beer Mug',
    description: 'Heavy, handled glass for large pours and casual drinking',
    availableSizes: ['16oz', '20oz', '32oz'],
    beerStyles: ['American Lager', 'Oktoberfest', 'Märzen', 'Brown Ale', 'Irish Red'],
    svgPath: '/assets/glasses/mug.svg',
  },
];

// Helper function to get glass by ID
export function getGlassType(id: string): GlassType | undefined {
  return GLASS_CATALOG.find(glass => glass.id === id);
}
```

**Why this pattern:**
- **Simpler than Firestore:** No need to seed database, manage updates, or query for static data
- **Type-safe:** TypeScript definitions catch errors at compile time
- **Fast:** No network requests, data is bundled with app
- **Version-controlled:** Changes to catalog tracked in git, easy to review
- **Can migrate later:** If catalog grows beyond 15-20 types or needs per-user customization, can move to Firestore

### Pattern 3: Server Actions for Glass Collection Mutations

**What:** Server Actions handle add/remove operations with Zod validation, returning structured error states for form feedback.

**When to use:** For all data mutations triggered by user interactions (buttons, forms).

**Example:**
```typescript
// Source: Next.js docs + Phase 2 research patterns
// lib/firebase/glasses-actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { addGlassToCollection, removeGlassFromCollection } from './glasses-db';
import { verifySession } from '@/lib/auth/dal';
import { z } from 'zod';

// Validation schemas
const AddGlassSchema = z.object({
  glassType: z.string().min(1, 'Glass type is required'),
  size: z.string().min(1, 'Size is required'),
});

export type GlassActionState = {
  success?: boolean;
  error?: string;
};

export async function addGlass(
  glassType: string,
  size: string
): Promise<GlassActionState> {
  // 1. Verify user is authenticated
  const session = await verifySession();
  if (!session.isAuth) {
    return { success: false, error: 'Not authenticated' };
  }

  // 2. Validate input
  const validated = AddGlassSchema.safeParse({ glassType, size });
  if (!validated.success) {
    return { success: false, error: 'Invalid glass data' };
  }

  try {
    // 3. Add to Firestore
    await addGlassToCollection(session.userId, glassType, size);

    // 4. Revalidate collection page to show new glass
    revalidatePath('/glasses');

    return { success: true };
  } catch (error) {
    console.error('Add glass error:', error);
    return { success: false, error: 'Failed to add glass' };
  }
}

export async function removeGlass(glassId: string): Promise<GlassActionState> {
  const session = await verifySession();
  if (!session.isAuth) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    await removeGlassFromCollection(session.userId, glassId);
    revalidatePath('/glasses');
    return { success: true };
  } catch (error) {
    console.error('Remove glass error:', error);
    return { success: false, error: 'Failed to remove glass' };
  }
}
```

**Why this pattern:**
- **Secure:** Runs on server, verifies auth before mutations
- **Validated:** Zod catches invalid data before Firestore operations
- **Automatic revalidation:** `revalidatePath()` refreshes Server Component data
- **Progressive enhancement:** Works without JavaScript (forms degrade gracefully)

### Pattern 4: Server Component Data Fetching with React cache()

**What:** Server Components fetch initial data using React's `cache()` to deduplicate requests within a single render.

**When to use:** For initial page loads displaying user's glass collection or catalog.

**Example:**
```typescript
// Source: Next.js docs
// app/(dashboard)/glasses/page.tsx
import { cache } from 'react';
import { verifySession } from '@/lib/auth/dal';
import { getUserGlasses } from '@/lib/firebase/glasses-db';
import { GLASS_CATALOG } from '@/lib/data/glass-catalog';
import { GlassCollection } from '@/components/glasses/GlassCollection';
import { EmptyCollection } from '@/components/glasses/EmptyCollection';

// Cache the fetch for the duration of the request
const getCachedUserGlasses = cache(async (userId: string) => {
  return await getUserGlasses(userId);
});

export default async function GlassesPage() {
  const session = await verifySession();
  const glasses = await getCachedUserGlasses(session.userId);

  if (glasses.length === 0) {
    return <EmptyCollection />;
  }

  // Enrich glasses with catalog data for display
  const enrichedGlasses = glasses.map(glass => {
    const glassType = GLASS_CATALOG.find(g => g.id === glass.glassType);
    return { ...glass, ...glassType };
  });

  return <GlassCollection glasses={enrichedGlasses} />;
}
```

**Why this pattern:**
- **Automatic deduplication:** Multiple components calling same function only fetch once
- **Server-side rendering:** Fast initial page load, no client-side loading spinners
- **Type-safe:** Full TypeScript support across Server Components

### Pattern 5: Optimistic UI for Instant Feedback

**What:** Use React's `useOptimistic` hook to immediately update UI when adding/removing glasses, then revert if the server action fails.

**When to use:** In Client Components wrapping Server Actions for better perceived performance.

**Example:**
```typescript
// Source: React 19 docs + Next.js optimistic updates research
// components/glasses/GlassCard.tsx
'use client'

import { useOptimistic, useTransition } from 'react';
import { addGlass } from '@/lib/firebase/glasses-actions';

type GlassCardProps = {
  glassType: string;
  name: string;
  size: string;
  isInCollection: boolean;
};

export function GlassCard({ glassType, name, size, isInCollection }: GlassCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticInCollection, setOptimisticInCollection] = useOptimistic(
    isInCollection,
    (state, newState: boolean) => newState
  );

  const handleAdd = async () => {
    startTransition(async () => {
      // Optimistically show as added
      setOptimisticInCollection(true);

      // Call server action
      const result = await addGlass(glassType, size);

      // If failed, state reverts automatically
      if (!result.success) {
        console.error(result.error);
      }
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{size}</p>
      <button
        onClick={handleAdd}
        disabled={optimisticInCollection || isPending}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {optimisticInCollection ? 'Added' : 'Add to Collection'}
      </button>
    </div>
  );
}
```

**Why this pattern:**
- **Instant feedback:** UI updates immediately, no waiting for server response
- **Automatic revert:** If server action fails, state rolls back
- **Built-in loading state:** `useTransition` provides `isPending` for disable states

### Pattern 6: Responsive Card Grid with Tailwind CSS v4

**What:** Use Tailwind's grid utilities for responsive layouts that adapt from 1 column (mobile) to 2-3 columns (desktop).

**When to use:** For displaying catalog cards and collection cards.

**Example:**
```typescript
// Source: Tailwind CSS docs + responsive grid research
// components/glasses/GlassCatalog.tsx
import { GLASS_CATALOG } from '@/lib/data/glass-catalog';
import { GlassCard } from './GlassCard';

export function GlassCatalog() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {GLASS_CATALOG.map(glass => (
        <GlassCard
          key={glass.id}
          glassType={glass.id}
          name={glass.name}
          description={glass.description}
          svgPath={glass.svgPath}
        />
      ))}
    </div>
  );
}
```

**Tailwind CSS v4 Grid Utilities:**
- `grid`: Enables CSS Grid layout
- `grid-cols-1`: 1 column on mobile
- `md:grid-cols-2`: 2 columns on medium screens (768px+)
- `lg:grid-cols-3`: 3 columns on large screens (1024px+)
- `gap-6`: Consistent spacing between cards (1.5rem)

### Pattern 7: Firestore Security Rules for User-Scoped Collections

**What:** Security rules enforce that users can only read/write their own glass collections using `request.auth.uid` matching.

**When to use:** For all Firestore subcollections storing user-specific data.

**Example:**
```javascript
// Source: Firebase Security Rules docs + ownership patterns research
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow users to read their own document
      allow read: if request.auth != null && request.auth.uid == userId;

      // Glass collection (subcollection)
      match /glasses/{glassId} {
        // Users can read their own glasses
        allow read: if request.auth != null && request.auth.uid == userId;

        // Users can add glasses to their collection
        allow create: if request.auth != null && request.auth.uid == userId;

        // Users can delete their own glasses
        allow delete: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**Why this pattern:**
- **Per-user isolation:** Users cannot access other users' collections
- **Authentication required:** All operations require valid Firebase auth
- **Path-based security:** Document path structure enforces ownership
- **No update needed:** Glasses are presence-based, no updates required

### Anti-Patterns to Avoid

- **Storing glasses in an array field:** Arrays in Firestore have a 1MB document limit and can't be queried efficiently. Use subcollections instead.

- **Root-level glass collection with userId field:** Makes security rules complex and error-prone. Subcollections provide better security and organization.

- **Client-side validation only:** Always validate Server Action inputs with Zod. Client-side validation can be bypassed.

- **Fetching glass catalog from Firestore:** Static reference data doesn't need real-time sync. Use TypeScript constants for faster loading and simpler code.

- **Manual revalidation after mutations:** Use `revalidatePath()` in Server Actions to automatically refresh Server Component data.

- **Inline SVG in JSX:** Keep SVGs as separate files for reusability and easier management. Import or use `<Image>` component.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Empty state UI | Custom "no glasses" messages | Consistent EmptyCollection component | Reusable pattern with CTA button, maintains design system consistency |
| Loading skeletons | Spinner or "Loading..." text | Tailwind-based skeleton cards matching real cards | Better perceived performance, reduces layout shift |
| Form error handling | Alert boxes or toast notifications | Server Action error states with inline messages | Progressive enhancement, no JavaScript required, screen reader friendly |
| Glass size validation | String matching in components | Zod enum schema with available sizes | Type-safe, centralized validation, catches errors early |
| SVG icon management | Copy-paste SVG code | Centralized `/public/assets/glasses/` directory | Version controlled, cacheable, easy to swap illustrations |

**Key insight:** Firestore's subcollection pattern handles user-scoped data elegantly without custom authorization logic. Let the path structure (`users/{userId}/glasses`) enforce ownership rather than building permission checks manually.

## Common Pitfalls

### Pitfall 1: Using Arrays Instead of Subcollections for Glass Storage
**What goes wrong:** Storing glasses as an array field in the user document leads to hitting the 1MB document limit, inability to query individual glasses, and inefficient updates.

**Why it happens:** Arrays seem simpler initially for small lists ("I only have 5 glasses"). But this doesn't scale when users add more glasses or when you need to query/filter.

**How to avoid:** Always use subcollections for list data that can grow unbounded. Firestore subcollections are designed for this use case and have no size limits.

**Warning signs:** User document size growing, slow reads when fetching user data, inability to paginate glass list.

### Pitfall 2: Not Validating Server Action Inputs
**What goes wrong:** Client sends invalid glass type or size, causing Firestore errors or data corruption.

**Why it happens:** Trusting client-side form validation, forgetting that users can bypass client checks.

**How to avoid:** Every Server Action must validate inputs with Zod schemas before database operations. Treat all client data as untrusted.

**Warning signs:** Firestore errors in production logs, invalid data appearing in collections.

### Pitfall 3: Security Rules Not Matching Data Structure
**What goes wrong:** Users can read or write other users' glass collections, or authenticated operations fail unexpectedly.

**Why it happens:** Security rules written before finalizing data structure, or rules not updated when structure changes.

**How to avoid:** Write security rules alongside data model design. Test with Firebase Emulator using multiple user accounts to verify isolation.

**Warning signs:** Firestore permission denied errors for legitimate operations, ability to access other users' data in testing.

### Pitfall 4: Not Revalidating After Mutations
**What goes wrong:** After adding/removing a glass, the collection page shows stale data until manual refresh.

**Why it happens:** Forgetting that Server Components cache data by default and need explicit revalidation.

**How to avoid:** Always call `revalidatePath('/glasses')` in Server Actions after successful mutations. This invalidates Next.js cache and triggers fresh data fetch.

**Warning signs:** Users reporting "glass didn't appear after adding it", stale data on page.

### Pitfall 5: Fetching Glass Catalog from Firestore on Every Request
**What goes wrong:** Unnecessary Firestore reads for static catalog data, increased latency and costs.

**Why it happens:** Treating catalog like dynamic user data, not recognizing it's reference data.

**How to avoid:** Store catalog as a TypeScript constant (`GLASS_CATALOG`) in codebase. Only move to Firestore if catalog needs per-user customization or real-time updates.

**Warning signs:** High Firestore read counts for catalog data, slow catalog page loads.

### Pitfall 6: No Empty State for Zero Glasses
**What goes wrong:** Blank page shown when user has no glasses, confusing users about what to do next.

**Why it happens:** Focusing on "happy path" with existing data, not designing for initial state.

**How to avoid:** Explicitly check for empty collection (`glasses.length === 0`) and render a helpful empty state with clear CTA: "You haven't added any glasses yet. Browse Catalog".

**Warning signs:** User confusion about how to get started, support requests asking how to add glasses.

### Pitfall 7: SVG Styling Inconsistencies
**What goes wrong:** SVG illustrations have inconsistent sizes, colors, or stroke widths across different glass types.

**Why it happens:** Using SVGs from different sources without normalizing, or applying inconsistent CSS classes.

**How to avoid:** Source all SVGs from the same library, or normalize viewBox and stroke attributes. Apply consistent Tailwind classes: `w-32 h-32 stroke-current` for monochrome styling.

**Warning signs:** Visual inconsistency in card grid, some glasses appear larger/smaller than others.

## Code Examples

Verified patterns from official sources:

### Complete Server Action with Optimistic Updates
```typescript
// Source: Next.js docs + React 19 useOptimistic
// Client Component wrapping Server Action
'use client'

import { useOptimistic, useTransition } from 'react';
import { addGlass, removeGlass } from '@/lib/firebase/glasses-actions';

type Glass = {
  id: string;
  glassType: string;
  size: string;
};

type OptimisticAction =
  | { type: 'add'; glass: Glass }
  | { type: 'remove'; id: string };

export function GlassCollectionOptimistic({ initialGlasses }: { initialGlasses: Glass[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticGlasses, setOptimisticGlasses] = useOptimistic(
    initialGlasses,
    (state, action: OptimisticAction) => {
      if (action.type === 'add') {
        return [...state, action.glass];
      } else {
        return state.filter(g => g.id !== action.id);
      }
    }
  );

  const handleAdd = async (glassType: string, size: string) => {
    const tempId = `temp-${Date.now()}`;
    startTransition(async () => {
      setOptimisticGlasses({ type: 'add', glass: { id: tempId, glassType, size } });
      const result = await addGlass(glassType, size);
      if (!result.success) {
        console.error('Failed to add glass:', result.error);
      }
    });
  };

  const handleRemove = async (glassId: string) => {
    startTransition(async () => {
      setOptimisticGlasses({ type: 'remove', id: glassId });
      const result = await removeGlass(glassId);
      if (!result.success) {
        console.error('Failed to remove glass:', result.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {optimisticGlasses.map(glass => (
        <div key={glass.id} className="rounded-lg border p-4">
          <p className="font-semibold">{glass.glassType}</p>
          <p className="text-sm text-gray-600">{glass.size}</p>
          <button
            onClick={() => handleRemove(glass.id)}
            disabled={isPending}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Empty State Component
```typescript
// Source: Next.js empty state research + UX best practices
// components/glasses/EmptyCollection.tsx
import Link from 'next/link';

export function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        {/* Icon or illustration */}
        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        You haven't added any glasses yet
      </h2>
      <p className="mb-6 max-w-sm text-gray-600">
        Start building your collection by browsing our catalog of beer glass types.
      </p>
      <Link
        href="/glasses/catalog"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Browse Catalog
      </Link>
    </div>
  );
}
```

### Loading Skeleton for Glass Cards
```typescript
// Source: React Suspense + Tailwind skeleton patterns
// components/ui/LoadingSkeleton.tsx
export function GlassCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-4">
      {/* Glass illustration skeleton */}
      <div className="mb-4 h-32 w-32 rounded bg-gray-200" />
      {/* Title skeleton */}
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      {/* Description skeleton */}
      <div className="mb-4 h-3 w-full rounded bg-gray-200" />
      {/* Button skeleton */}
      <div className="h-10 w-full rounded bg-gray-200" />
    </div>
  );
}

export function GlassCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <GlassCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Glass Reference Guide Card
```typescript
// Source: Beer pairing research + card layout patterns
// components/glasses/GlassGuideCard.tsx
import Image from 'next/image';
import { GlassType } from '@/lib/data/glass-catalog';

type GlassGuideCardProps = {
  glass: GlassType;
  showAddButton?: boolean;
  onAdd?: (glassType: string, size: string) => void;
};

export function GlassGuideCard({ glass, showAddButton, onAdd }: GlassGuideCardProps) {
  return (
    <div className="rounded-lg border p-6">
      {/* Glass illustration */}
      <div className="mb-4 flex justify-center">
        <Image
          src={glass.svgPath}
          alt={glass.name}
          width={128}
          height={128}
          className="h-32 w-32"
        />
      </div>

      {/* Glass name and description */}
      <h3 className="mb-2 text-lg font-semibold">{glass.name}</h3>
      <p className="mb-4 text-sm text-gray-600">{glass.description}</p>

      {/* Available sizes */}
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium text-gray-500">Available Sizes</p>
        <div className="flex flex-wrap gap-2">
          {glass.availableSizes.map(size => (
            <span key={size} className="rounded bg-gray-100 px-2 py-1 text-xs">
              {size}
            </span>
          ))}
        </div>
      </div>

      {/* Beer style pairings */}
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium text-gray-500">Best For</p>
        <ul className="text-sm text-gray-700">
          {glass.beerStyles.slice(0, 5).map(style => (
            <li key={style} className="list-inside list-disc">
              {style}
            </li>
          ))}
        </ul>
      </div>

      {/* Add to collection button (if logged in) */}
      {showAddButton && onAdd && (
        <button
          onClick={() => onAdd(glass.id, glass.availableSizes[0])}
          className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add to Collection
        </button>
      )}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Arrays for user lists | Firestore subcollections | Firestore best practices (2020+) | Avoids document size limits, enables efficient queries, better security isolation |
| Client-side mutations with useState | Server Actions with revalidation | Next.js 13+ App Router (2023) | Progressive enhancement, automatic cache invalidation, simpler error handling |
| useEffect for data fetching | Server Components with React cache() | Next.js 13+ (2023) | Eliminates client-side loading states, faster initial page load, request-level deduplication |
| PNG/JPG for icons | SVG assets | Modern web (2015+) | Scalable, smaller file size, CSS-styleable, crisp on all screen densities |
| Custom loading spinners | Tailwind skeleton UI matching real content | Modern UX patterns (2020+) | Reduces perceived loading time, prevents layout shift, better user experience |
| Manual optimistic updates | React useOptimistic hook | React 19 (2024) | Built-in automatic rollback, less boilerplate, safer state management |

**Deprecated/outdated:**
- **Firestore arrays for collections:** Use subcollections instead (arrays hit 1MB limit and can't query efficiently)
- **Custom authentication middleware:** Use Firebase Security Rules for database access control (more secure, declarative)
- **Client-side CRUD with useState:** Use Server Actions (progressive enhancement, automatic revalidation)
- **Raster images for icons:** Use SVG (scalable, styleable, smaller)

## Open Questions

Things that couldn't be fully resolved:

1. **SVG Illustration Source Selection**
   - What we know: Multiple free SVG sources exist (SVG Repo, Public Domain Vectors, FreeSVG), all offer monochrome line-art options suitable for beer glasses
   - What's unclear: Which specific library provides the most consistent set of 8-10 glass types with matching style/stroke width
   - Recommendation: Start with SVG Repo (https://www.svgrepo.com/) for initial prototyping. Search for "beer glass line art" and download consistent set. Can swap sources later if needed without code changes (just replace SVG files in `/public/assets/glasses/`).

2. **Exact Size Selection UI Pattern**
   - What we know: Each glass type has 2-3 size options, user needs to select one when adding to collection
   - What's unclear: Best UI pattern for size selection - dropdown in card, modal with size options, or dedicated size picker step
   - Recommendation: Start with simple dropdown or radio buttons directly in the "Add" flow. Context decision says "quick-add button" with "no confirmation step", so include size picker inline on catalog card for fastest flow.

3. **Catalog Expansion Strategy**
   - What we know: Starting with 8-10 core types, may expand to 15-20 later
   - What's unclear: At what point to migrate from static TypeScript data to Firestore collection, and how to handle migration
   - Recommendation: Keep static data until 20+ types or when per-user catalog customization is needed. Migration path: seed Firestore from TypeScript constant, update components to fetch from Firestore, add admin UI for catalog management.

4. **Real-time vs Snapshot Queries**
   - What we know: Firestore supports both `getDocs()` (one-time fetch) and `onSnapshot()` (real-time listener) for collections
   - What's unclear: Whether glass collection needs real-time updates across devices/tabs
   - Recommendation: Use `getDocs()` (one-time fetch) for simplicity. Real-time is unnecessary for single-user collection management. User adds/removes glasses on one device at a time. If multi-device sync becomes a requirement, can migrate to `onSnapshot()` without major refactoring.

## Sources

### Primary (HIGH confidence)
- [Firebase Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices) - Official data modeling guidance
- [Firebase Firestore Data Model](https://firebase.google.com/docs/firestore/data-model) - Collection and document structure
- [Firebase Choose a Data Structure](https://firebase.google.com/docs/firestore/manage-data/structure-data) - Root collections vs subcollections
- [Firebase Security Rules Get Started](https://firebase.google.com/docs/firestore/security/get-started) - User ownership patterns
- [Firebase Security Rules Conditions](https://firebase.google.com/docs/firestore/security/rules-conditions) - Auth-based rules
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/13/app/building-your-application/data-fetching/server-actions-and-mutations) - Official Server Actions patterns
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - Data fetching in Server Components
- [React useOptimistic](https://react.dev/reference/react/useOptimistic) - Official React 19 hook documentation
- [Tailwind CSS Grid Template Columns](https://tailwindcss.com/docs/grid-template-columns) - Responsive grid utilities

### Secondary (MEDIUM confidence)
- [Beer Glass Guide - Beer Wrangler](https://www.beerwrangler.com/beer-glass-guide) - Glass types and sizes
- [Beer Glass Sizes Chart - KaTom](https://www.katom.com/learning-center/beer-glass-sizes.html) - Standard glass sizes
- [Beer Glassware - Wikipedia](https://en.wikipedia.org/wiki/Beer_glassware) - Glass type encyclopedia
- [Beer Glassware Pairing Guide - Rapids Wholesale](https://rapidswholesale.com/blog/best-glassware-for-every-beer-style/) - Beer style to glass pairings
- [Beer Glass Types and Uses - KegWorks](https://www.kegworks.com/blog/beer-glassware-guide-beer-glass-types-uses) - Glass pairing guide
- [How to Setup Firebase Firestore with Next.js 14](https://mydevpa.ge/blog/how-to-setup-firebase-firestore-with-nextjs-14) - CRUD patterns verified
- [Firestore NoSQL Data Modeling - Fireship.io](https://fireship.io/lessons/firestore-nosql-data-modeling-by-example/) - Real-world data modeling examples
- [7+ Firestore Query Performance Best Practices for 2026](https://estuary.dev/blog/firestore-query-best-practices/) - Optimization patterns
- [Optimistic UI with Server Actions in Next.js - Medium](https://medium.com/@mishal.s.suyog/optimistic-ui-with-server-actions-in-next-js-a-smoother-user-experience-6b779e4293a9) - Optimistic update patterns

### Tertiary (LOW confidence - WebSearch only)
- SVG Repo, Public Domain Vectors, FreeSVG - Multiple sources for open-source SVG illustrations (quality varies, need to evaluate specific glass sets)
- Community blog posts about Firestore subcollections vs arrays (concepts verified but implementation details vary)
- Next.js empty state UI patterns from PureCode AI and MakerKit (general patterns, not specific to this project)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All core libraries (Firebase, Next.js, Zod) verified through official docs and Phase 2 research
- Architecture: HIGH - Firestore subcollections, Server Actions, Server Components all standard patterns from official sources
- Pitfalls: HIGH - Security rules, validation, empty states all documented in official guides and verified in Phase 2 research
- Glass data: MEDIUM - Beer glass sizes and pairings from multiple credible sources (industry guides, Wikipedia), sizes cross-verified
- SVG sources: LOW - Multiple options exist but haven't evaluated specific glass illustration sets for consistency

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - Firestore and Next.js are stable, React 19 useOptimistic is new but documented)
