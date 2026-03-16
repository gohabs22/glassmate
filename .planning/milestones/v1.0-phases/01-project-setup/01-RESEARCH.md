# Phase 1: Project Setup - Research

**Researched:** 2026-02-06
**Domain:** Next.js + Firebase Web Application Setup
**Confidence:** HIGH

## Summary

Phase 1 establishes a Next.js 16.1 (App Router) project with Firebase SDK 12.9.0 integration for authentication and Firestore. The standard approach uses `create-next-app` with TypeScript, ESLint, and Tailwind CSS, then integrates Firebase through dedicated configuration modules to prevent re-initialization issues.

Next.js 16.1 (released December 2025) is built on React 19 stable APIs and includes Turbopack as the default bundler. Firebase SDK v12.9.0 uses the modular API pattern (firebase/app, firebase/auth, firebase/firestore). The integration pattern centralizes Firebase initialization in a `lib/firebase/` directory to isolate concerns and enable both client and server-side usage.

Deployment to Vercel is zero-configuration and automatically optimized for Next.js. Firebase Hosting is also an option but requires the Blaze (pay-as-you-go) plan for server-side rendering via Cloud Functions.

**Primary recommendation:** Use `create-next-app@latest` with TypeScript + ESLint + App Router, integrate Firebase with centralized initialization pattern, and deploy to Vercel for zero-config hosting.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1+ | React framework with App Router, SSR, and routing | Official Vercel framework, zero-config deployment, built on React 19 |
| React | 19 | UI library | Required by Next.js 16, stable concurrent rendering APIs |
| TypeScript | 5.x | Type safety | Built-in Next.js support, catches errors at build time |
| Firebase SDK | 12.9.0+ | Backend services (Auth, Firestore) | Modular API, tree-shakeable, generous free tier |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 3.x | Utility-first CSS framework | Default in create-next-app, rapid styling |
| ESLint | 9.x (flat config) | Code linting | Included by create-next-app, uses eslint-config-next |
| Turbopack | (built-in) | Fast bundler for dev/build | Default bundler in Next.js 16, replaces Webpack |
| firebase/auth | (part of SDK) | Firebase Authentication | User sign-in, auth state management |
| firebase/firestore | (part of SDK) | Cloud Firestore database | Real-time database with offline support |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Firestore full SDK | firebase/firestore/lite | 50% smaller bundle but no real-time listeners or offline persistence |
| Vercel hosting | Firebase Hosting + Cloud Functions | Requires Blaze plan, slower cold starts, loses CDN caching benefits |
| TypeScript | JavaScript | Less safety, no autocomplete, harder to maintain |

**Installation:**
```bash
# Create Next.js project (interactive prompts)
npx create-next-app@latest

# Or non-interactive with all flags
npx create-next-app@latest my-app --typescript --eslint --tailwind --app --turbopack --src-dir --import-alias "@/*"

# Add Firebase SDK
npm install firebase
```

## Architecture Patterns

### Recommended Project Structure
```
my-app/
├── .env.local                 # Environment variables (gitignored)
├── src/
│   ├── app/                   # App Router - routing and pages
│   │   ├── layout.tsx         # Root layout (wraps all routes)
│   │   ├── page.tsx           # Home page (/)
│   │   ├── globals.css        # Global styles (Tailwind directives)
│   │   └── (routes)/          # Route groups or nested routes
│   ├── lib/                   # Utilities and configuration
│   │   └── firebase/          # Firebase initialization modules
│   │       ├── config.ts      # Firebase config object
│   │       ├── clientApp.ts   # Client-side Firebase app
│   │       ├── auth.ts        # Auth instance and helpers
│   │       └── firestore.ts   # Firestore instance and helpers
│   └── components/            # Reusable React components
├── public/                    # Static assets (images, favicon)
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration (auto-generated)
└── eslint.config.mjs          # ESLint flat config (Next.js 16+)
```

### Pattern 1: Centralized Firebase Initialization
**What:** Initialize Firebase once in dedicated modules, export instances
**When to use:** Always - prevents re-initialization on hot reload
**Example:**
```typescript
// Source: https://firebase.google.com/codelabs/firebase-nextjs
// lib/firebase/clientApp.ts
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initialization on hot reload
export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];
```

```typescript
// lib/firebase/auth.ts
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './clientApp';

export const auth = getAuth(firebaseApp);
```

```typescript
// lib/firebase/firestore.ts
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './clientApp';

export const db = getFirestore(firebaseApp);
```

### Pattern 2: Environment Variables with NEXT_PUBLIC_ Prefix
**What:** Firebase client config requires NEXT_PUBLIC_ prefix for browser access
**When to use:** Always for client-side Firebase config values
**Example:**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="myapp.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="myapp-12345"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="myapp-12345.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
```

### Pattern 3: App Router File-Based Routing
**What:** Use special files (page.tsx, layout.tsx, loading.tsx, error.tsx) for routing
**When to use:** Always - it's how App Router works
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/project-structure
// app/layout.tsx - Root layout (required)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx - Home page
export default function HomePage() {
  return <h1>Welcome</h1>
}

// app/dashboard/page.tsx - /dashboard route
export default function DashboardPage() {
  return <h1>Dashboard</h1>
}
```

### Anti-Patterns to Avoid
- **Initializing Firebase in components:** Causes re-initialization on every render, breaks hot reload
- **Omitting NEXT_PUBLIC_ prefix:** Client code cannot access env vars without this prefix
- **Using Admin SDK in client bundles:** Admin SDK will fail in browser, only use in API routes or server components
- **Mixing Pages Router and App Router:** Stick to App Router for new projects (Next.js 13+)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication UI | Custom login forms from scratch | Firebase Auth + pre-built UI library | Email verification, password reset, OAuth providers, security rules |
| Environment variable management | Custom config loading | Next.js built-in env vars with NEXT_PUBLIC_ | Automatic loading, type-safe, works in all rendering modes |
| Firebase initialization | Initialize on every import | Centralized singleton pattern with getApps() check | Prevents re-initialization, works with hot reload |
| Project scaffolding | Manual file creation | create-next-app CLI | Correct TypeScript config, ESLint setup, import aliases, optimal defaults |
| Linting configuration | Custom ESLint rules | eslint-config-next | Optimized for Next.js, includes React rules, Core Web Vitals checks |

**Key insight:** Firebase + Next.js integration has subtle gotchas (re-initialization, SSR vs client-side, environment variables) that are solved by following established patterns. Don't reinvent the wheel.

## Common Pitfalls

### Pitfall 1: Firebase Re-initialization on Hot Reload
**What goes wrong:** Firebase throws errors when initializeApp() is called multiple times in development
**Why it happens:** Next.js hot reload re-executes module code, re-initializing Firebase
**How to avoid:** Use `getApps().length` check before calling initializeApp()
**Warning signs:** Console errors like "Firebase app already initialized" during development

### Pitfall 2: Missing NEXT_PUBLIC_ Prefix on Client-Side Env Vars
**What goes wrong:** Environment variables are undefined in browser code
**Why it happens:** Next.js only exposes env vars with NEXT_PUBLIC_ prefix to the client bundle
**How to avoid:** Prefix all client-side Firebase config vars with NEXT_PUBLIC_
**Warning signs:** `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` works, but `process.env.FIREBASE_API_KEY` is undefined in components

### Pitfall 3: Using Firebase Admin SDK in Client Code
**What goes wrong:** Build fails or runtime errors in browser
**Why it happens:** Admin SDK uses Node.js APIs not available in browsers
**How to avoid:** Only import Admin SDK in API routes, server components, or getServerSideProps
**Warning signs:** Build errors mentioning Node.js modules (fs, http, crypto) when using Admin SDK

### Pitfall 4: Using Firestore Full SDK When Lite Would Suffice
**What goes wrong:** Larger bundle size (3+ seconds slower load time)
**Why it happens:** Full SDK includes real-time listeners and offline persistence that may not be needed
**How to avoid:** Evaluate if real-time updates are required; use firebase/firestore/lite if only doing simple queries
**Warning signs:** Large bundle size warnings, slow initial page load

### Pitfall 5: Expecting Firebase Hosting to Work Like Vercel
**What goes wrong:** SSR requires Cloud Functions and Blaze plan, cold starts, loss of CDN caching
**Why it happens:** Firebase Hosting is primarily for static sites; dynamic SSR needs Cloud Functions
**How to avoid:** Use Vercel for Next.js unless you have a specific reason to use Firebase Hosting
**Warning signs:** Slow page loads on Firebase Hosting, unexpected Firebase billing

### Pitfall 6: Not Handling FIREBASE_PRIVATE_KEY Quotes in .env
**What goes wrong:** Private key parsing fails when using Admin SDK (server-side)
**Why it happens:** Private keys contain newlines and special characters that need proper escaping
**How to avoid:** Wrap FIREBASE_PRIVATE_KEY value in quotes in .env.local, or use .replace(/\\n/g, '\n')
**Warning signs:** "Invalid service account" errors when initializing Admin SDK

## Code Examples

Verified patterns from official sources:

### Creating a New Next.js Project
```bash
# Source: https://nextjs.org/docs/app/getting-started/installation
# Interactive (recommended for first-time)
npx create-next-app@latest

# Non-interactive with all flags
npx create-next-app@latest my-app \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --turbopack \
  --src-dir \
  --import-alias "@/*"
```

### Firebase Client Initialization (Complete Pattern)
```typescript
// Source: https://firebase.google.com/docs/web/setup
// lib/firebase/config.ts
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// lib/firebase/clientApp.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export { firebaseApp };

// lib/firebase/auth.ts
import { getAuth, Auth } from 'firebase/auth';
import { firebaseApp } from './clientApp';

export const auth: Auth = getAuth(firebaseApp);

// lib/firebase/firestore.ts
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseApp } from './clientApp';

export const db: Firestore = getFirestore(firebaseApp);
```

### Using Firebase in a Component
```typescript
// Source: Firebase best practices
// app/page.tsx
'use client'; // Required for client-side Firebase

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
      {user ? <p>Logged in as {user.email}</p> : <p>Not logged in</p>}
    </div>
  );
}
```

### Environment Variables Setup
```bash
# Source: https://nextjs.org/docs/app/api-reference/config/environment-variables
# .env.local (create this file, it's gitignored by default)

# Client-side Firebase config (NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="myapp.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="myapp-12345"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="myapp-12345.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"

# Server-side secrets (NO NEXT_PUBLIC_ prefix)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@myapp.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | Next.js 13 (Oct 2022), stable in 14/15 | File-based routing in `app/` directory, built-in layouts, Server Components by default |
| Webpack | Turbopack | Default in Next.js 16 (Oct 2025) | Faster dev server, faster builds (Rust-based) |
| Firebase v8 SDK (namespaced) | Firebase v9+ SDK (modular) | Firebase v9 (Aug 2021) | Tree-shakeable imports, smaller bundles, better TypeScript support |
| ESLint legacy config (.eslintrc) | Flat config (eslint.config.mjs) | Next.js 16 (Oct 2025), ESLint 9 | Simpler config format, removed `next lint` command |
| React 18 | React 19 | Next.js 16 (Oct 2025) | Stable Actions, Suspense, concurrent rendering APIs |

**Deprecated/outdated:**
- **Pages Router (`pages/` directory):** Still supported but App Router is recommended for new projects
- **Firebase v8 SDK:** Still works but modular v9+ is recommended (smaller bundles, better tree-shaking)
- **next lint command:** Removed in Next.js 16, use `eslint` directly

## Open Questions

Things that couldn't be fully resolved:

1. **Firebase Hosting vs Vercel for this project**
   - What we know: Vercel is zero-config, Firebase Hosting requires Blaze plan for SSR
   - What's unclear: Actual cost comparison for low-traffic app, performance differences
   - Recommendation: Start with Vercel (free tier, zero-config), migrate to Firebase Hosting only if needed for Firebase integration benefits

2. **Firestore Lite vs Full SDK for this use case**
   - What we know: Lite is 50% smaller but lacks real-time listeners and offline persistence
   - What's unclear: Whether this beer glass app needs real-time updates
   - Recommendation: Defer decision until Phase 2 (Authentication), but default to full SDK for flexibility unless bundle size becomes an issue

3. **Firebase Admin SDK setup timing**
   - What we know: Admin SDK only works server-side (API routes, Server Components)
   - What's unclear: Whether Phase 1 needs Admin SDK or just client SDK
   - Recommendation: Phase 1 only needs client SDK (firebase/auth, firebase/firestore). Defer Admin SDK setup until server-side operations are needed.

## Sources

### Primary (HIGH confidence)
- Next.js Official Docs - Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Official Docs - Installation: https://nextjs.org/docs/app/getting-started/installation
- Firebase Official Docs - Web Setup: https://firebase.google.com/docs/web/setup
- Firebase Official Docs - Next.js Integration: https://firebase.google.com/docs/hosting/frameworks/nextjs
- Firebase Codelabs - Next.js Integration: https://firebase.google.com/codelabs/firebase-nextjs
- Firebase Release Notes: https://firebase.google.com/support/release-notes/js
- Next.js Blog - Next.js 16.1 Release: https://nextjs.org/blog/next-16-1

### Secondary (MEDIUM confidence)
- Firebase Blog - Firestore Lite: https://firebase.blog/posts/2023/03/trim-javascript-bundles-firestore-lite/
- Vercel Docs - Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- TheLinuxCode - Next.js ESLint 2026 Guide: https://thelinuxcode.com/nextjs-eslint-a-practical-modern-guide-for-2026/
- Next.js GitHub Releases: https://github.com/vercel/next.js/releases
- Firebase SDK GitHub Releases: https://github.com/firebase/firebase-js-sdk/releases

### Tertiary (LOW confidence)
- Medium articles on Next.js + Firebase integration (various authors)
- Community blog posts on Firebase authentication patterns
- Stack Overflow discussions (validated against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified with official Next.js and Firebase documentation, release notes
- Architecture: HIGH - Patterns from official Firebase codelab and Next.js project structure docs
- Pitfalls: MEDIUM-HIGH - Mix of official docs (environment variables, Admin SDK) and community experiences (verified where possible)

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable ecosystem, but verify Next.js/Firebase releases)
