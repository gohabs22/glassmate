# Phase 02: Role Selection & Authentication - Research

**Researched:** 2026-02-06
**Domain:** Next.js App Router + Firebase Authentication
**Confidence:** MEDIUM

## Summary

Firebase Authentication integrates with Next.js App Router through a carefully designed pattern that separates client-side auth state management from server-side verification. The standard approach uses Firebase's email/password authentication on the client, Next.js middleware for optimistic routing protection, and server components with a Data Access Layer (DAL) for secure data operations.

Firebase provides built-in session persistence through three modes (local, session, none), with "local" being the default for staying logged in across browser sessions. The auth state is managed client-side via `onAuthStateChanged` observers, while server-side protection happens at the middleware layer (optimistic checks) and DAL layer (secure verification).

For this phase's requirements (host auth, role-based dashboard, anonymous drinker flow), the recommended pattern is: (1) Client-side Firebase Auth for email/password signup/login, (2) Lightweight middleware for route protection using cookie-based checks, (3) Server Components with auth verification for protected pages, (4) Conditional routing based on auth state to direct hosts to dashboard and anonymous users to drinker flow.

**Primary recommendation:** Use Firebase Auth client SDK for authentication, Next.js middleware for optimistic route protection, and Server Components with session verification for dashboard access. Do NOT use heavy auth libraries like NextAuth.js since Firebase is already integrated and provides the necessary primitives.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| firebase/auth | 11.x (current) | Email/password authentication, session management | Official Firebase SDK, battle-tested with automatic token refresh and persistence |
| Next.js App Router | 15.x | Server Components, middleware, routing | Latest Next.js architecture with built-in auth patterns |
| Zod | 3.x | Server Action input validation | TypeScript-first schema validation, recommended by Next.js docs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.x | Client-side form state management | When you need complex form interactions beyond basic Server Actions |
| server-only | Latest | Prevent server code bundling in client | Mandatory for DAL functions to prevent security leaks |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Firebase Auth | NextAuth.js / Clerk | External libraries add complexity when Firebase is already integrated; Firebase is free tier, others have pricing |
| Direct auth checks | next-firebase-auth-edge | Adds abstraction layer; useful for complex apps but overkill for this phase's requirements |
| Manual form validation | Unvalidated forms | Never acceptable - always validate with Zod on server side |

**Installation:**
```bash
# Already installed from Phase 1:
# - firebase (auth, firestore)
# - next

# New for Phase 2:
npm install zod server-only
npm install --save-dev @types/node  # If not already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── (auth)/              # Grouped route - auth pages (login, signup)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/         # Grouped route - protected pages
│   │   ├── layout.tsx       # Dashboard layout with navigation
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── (drinker)/           # Grouped route - anonymous drinker flow
│   │   └── scan/
│   │       └── page.tsx
│   └── middleware.ts        # Route protection (optimistic checks)
├── lib/
│   ├── firebase/
│   │   ├── auth.ts          # Client-side auth instance (already exists)
│   │   └── auth-actions.ts  # Server Actions for signup/login
│   ├── auth/
│   │   ├── dal.ts           # Data Access Layer with session verification
│   │   └── session.ts       # Session cookie management (if needed)
│   └── validations/
│       └── auth.ts          # Zod schemas for email/password validation
└── components/
    ├── auth/
    │   ├── SignupForm.tsx
    │   └── LoginForm.tsx
    └── dashboard/
        └── DashboardNav.tsx
```

### Pattern 1: Firebase Client-Side Authentication with Server Actions

**What:** Firebase Auth SDK handles authentication on the client, with Server Actions handling form submission and validation. Auth state is managed by Firebase's `onAuthStateChanged` observer.

**When to use:** For all email/password authentication flows (signup, login, logout).

**Example:**
```typescript
// Source: Firebase official docs + Next.js docs
// lib/validations/auth.ts
import { z } from 'zod';

export const SignupFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .trim(),
});

export type SignupFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
```

```typescript
// lib/firebase/auth-actions.ts
'use server'

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { SignupFormSchema, SignupFormState } from '@/lib/validations/auth';

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  // 1. Validate with Zod
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Create user with Firebase
    await createUserWithEmailAndPassword(auth, email, password);

    // 3. Redirect happens client-side after successful auth state change
    return { errors: {} };
  } catch (error: any) {
    // 4. Handle Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      return {
        errors: {
          email: ['This email is already registered'],
        },
      };
    }

    return {
      errors: {
        _form: ['An error occurred. Please try again.'],
      },
    };
  }
}
```

```typescript
// components/auth/SignupForm.tsx
'use client'

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { signup } from '@/lib/firebase/auth-actions';
import { useEffect } from 'react';

export function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signup, { errors: {} });

  // Listen for auth state changes and redirect when signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        {state.errors?.email && (
          <p className="text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
        {state.errors?.password && (
          <p className="text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <p className="text-red-600">{state.errors._form[0]}</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### Pattern 2: Lightweight Middleware for Optimistic Route Protection

**What:** Next.js middleware performs fast, cookie-based checks to redirect unauthenticated users before pages load. Does NOT query database or perform heavy operations.

**When to use:** For protecting dashboard routes and redirecting authenticated users away from auth pages.

**Example:**
```typescript
// Source: Next.js official docs
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected and public routes
  const isProtectedRoute = path.startsWith('/dashboard');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup');

  // Check for Firebase auth cookie (set by Firebase SDK)
  // Firebase sets cookies automatically when using persistence: 'local'
  const hasAuthCookie = request.cookies.has('__session'); // Or your Firebase cookie name

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Pattern 3: Data Access Layer (DAL) with Server Component Auth Verification

**What:** A centralized module using `cache()` and `'server-only'` that verifies authentication before accessing protected data. Used in Server Components.

**When to use:** For all Server Components that need to verify user identity or fetch user-specific data.

**Example:**
```typescript
// Source: Next.js official docs
// lib/auth/dal.ts
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase/auth';

export const verifySession = cache(async () => {
  // Get Firebase auth token from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('__session')?.value;

  if (!token) {
    redirect('/login');
  }

  // Verify token with Firebase Admin SDK (if using server-side verification)
  // Or rely on client-side Firebase Auth state

  return { isAuth: true, token };
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  // Get current user from Firebase Auth or Firestore
  // This is cached per request thanks to React cache()

  return { id: 'user-id', email: 'user@example.com' };
});
```

```typescript
// app/(dashboard)/dashboard/page.tsx
import { verifySession, getCurrentUser } from '@/lib/auth/dal';

export default async function DashboardPage() {
  await verifySession(); // Redirects if not authenticated
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <div>
        <a href="/dashboard/glasses">Manage My Glasses</a>
        <a href="/scan">Check In Somewhere</a>
      </div>
    </div>
  );
}
```

### Pattern 4: Conditional Root-Level Routing Based on Auth State

**What:** Root page (`/`) checks auth state and conditionally routes to dashboard (hosts) or drinker flow (anonymous users).

**When to use:** For the landing page that needs to support both user types.

**Example:**
```typescript
// Source: Next.js docs + community patterns
// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore.has('__session');

  if (hasAuthCookie) {
    // Host is logged in - redirect to dashboard
    redirect('/dashboard');
  } else {
    // Anonymous user - redirect to drinker flow
    redirect('/scan');
  }
}
```

### Pattern 5: Firebase Session Persistence Configuration

**What:** Configure Firebase Auth to persist sessions across browser restarts using "local" persistence mode (default behavior).

**When to use:** During Firebase initialization to ensure "stay logged in" functionality.

**Example:**
```typescript
// Source: Firebase official docs
// lib/firebase/clientApp.ts (enhanced)
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase (already exists)
let firebaseApp: FirebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Set persistence to 'local' (persists across browser sessions)
// Note: This is the default, but explicitly setting it ensures clarity
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence);

export { firebaseApp, auth };
```

### Anti-Patterns to Avoid

- **Heavy middleware operations:** Never query Firestore or perform expensive operations in middleware. This runs on EVERY request including prefetches, causing severe performance degradation.

- **Context providers in root layout:** React Context is not supported in Server Components. Using `<AuthProvider>` in root layout prevents child Server Components from accessing auth state.

- **Unvalidated Server Actions:** Every Server Action MUST validate input with Zod schema before processing. Never trust client-side form data.

- **Client-side route protection only:** Always verify auth on the server (middleware + Server Components). Client-side checks can be bypassed.

- **Forgetting 'server-only' import:** Always add `import 'server-only'` at the top of DAL files to prevent accidental client bundling of server code.

- **Enabling "Create Signup" in Firebase Console for restricted apps:** For admin dashboards or restricted applications, disable the signup API in Firebase Console to prevent unauthorized registrations.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email/password validation | Custom regex and checks | Zod schema with `.email()` and `.regex()` | Zod provides type safety, composability, and handles edge cases like whitespace trimming |
| Form submission state | Manual useState + fetch | useActionState with Server Actions | Built-in pending state, progressive enhancement, works without JS |
| Auth state management | Custom user context/provider | Firebase `onAuthStateChanged` observer | Handles token refresh, multi-tab sync, persistence automatically |
| Session cookies | Manual cookie encryption/signing | Firebase Auth persistence + optional custom cookies | Firebase manages tokens securely; if you need custom cookies, use `jose` library for JWT |
| Route protection logic | if/else in every page | Middleware + DAL pattern | Centralized, cached, runs once per request |
| Password hashing | bcrypt or custom hashing | Firebase Auth handles this | Firebase securely hashes passwords server-side with industry-standard algorithms |

**Key insight:** Firebase Authentication is a complete auth solution, not just a user database. It handles session management, token refresh, password hashing, and security rules. Don't rebuild these primitives.

## Common Pitfalls

### Pitfall 1: Firebase Auth Only Works Client-Side (Not True)
**What goes wrong:** Developers assume Firebase Auth only works in Client Components, leading to prop drilling or incorrect context usage.

**Why it happens:** Firebase's client SDK (`firebase/auth`) only works in client environment, but this doesn't mean auth verification can't happen server-side.

**How to avoid:** Use Firebase Admin SDK server-side for token verification, or rely on cookie-based session checks in middleware/DAL. The pattern is: client-side Firebase SDK for sign-in/sign-up, server-side verification for protected operations.

**Warning signs:** Seeing `'use client'` on every page that checks auth, or extensive use of context providers.

### Pitfall 2: Not Setting Up Firebase Auth Persistence
**What goes wrong:** Users get logged out when they close and reopen the browser, even though "stay logged in" is intended.

**Why it happens:** Forgetting to configure persistence, or accidentally setting it to "session" or "none" mode instead of "local".

**How to avoid:** Explicitly call `setPersistence(auth, browserLocalPersistence)` during initialization, or verify the default persistence is set correctly. Test by closing browser completely and reopening.

**Warning signs:** User complaints about having to log in repeatedly, or auth state not persisting after browser restart.

### Pitfall 3: Middleware Performance Degradation from Heavy Operations
**What goes wrong:** App becomes extremely slow, especially during development with Fast Refresh. Build times increase to 10-20 minutes.

**Why it happens:** Middleware runs on EVERY route, including prefetched routes. Database queries or heavy computations multiply this cost.

**How to avoid:** Keep middleware to optimistic checks only - read cookies, check for token existence, and redirect. Never query Firestore, never call external APIs, never do crypto operations.

**Warning signs:** Slow page loads, middleware taking >100ms, increased Vercel function invocations.

### Pitfall 4: Insecure Firebase Security Rules
**What goes wrong:** Any logged-in user can access all data, or worse, anonymous users can read/write protected data.

**Why it happens:** Using `auth != null` as the only security check, or leaving development rules (`allow read, write: if true`) in production.

**How to avoid:** Security rules must check BOTH authentication (`request.auth != null`) AND authorization (`request.auth.uid == userId`). Always verify ownership of resources.

**Warning signs:** Firebase Console warnings about insecure rules, ability to access other users' data in testing.

### Pitfall 5: Race Conditions with onAuthStateChanged
**What goes wrong:** Components render before auth state is initialized, showing wrong UI (login form when user is actually logged in).

**Why it happens:** `onAuthStateChanged` fires asynchronously. Initial renders happen before Firebase checks if user is authenticated.

**How to avoid:** Add loading state while waiting for initial auth check. Pattern: `const [loading, setLoading] = useState(true)` initially, set to `false` after first `onAuthStateChanged` callback.

**Warning signs:** Flash of unauthenticated content (FOUC), incorrect redirects on page load.

### Pitfall 6: Unauthorized User Registration via Firebase Signup API
**What goes wrong:** Unauthorized users can create accounts via the Firebase Authentication REST API even when signup form is "protected".

**Why it happens:** Firebase's email/password provider allows direct API calls to create users by default. Client-side form hiding isn't security.

**How to avoid:** For restricted apps (admin dashboards, invite-only), disable the "Create User" setting in Firebase Console. Implement server-side invitation system with Cloud Functions.

**Warning signs:** Unexpected user accounts appearing in Firebase Auth, bypass of invite-only flows.

### Pitfall 7: Firebase Auth Errors Not Handled Properly
**What goes wrong:** Generic error messages confuse users ("An error occurred") when specific issues exist (weak password, email already used).

**Why it happens:** Not checking `error.code` from Firebase Auth errors, or not mapping codes to user-friendly messages.

**How to avoid:** Always catch Firebase errors and check `error.code`. Map common codes to helpful messages:
- `auth/email-already-in-use` → "This email is already registered"
- `auth/invalid-email` → "Please enter a valid email address"
- `auth/weak-password` → "Password must be at least 6 characters"
- `auth/user-not-found` → "No account found with this email"
- `auth/wrong-password` → "Incorrect password"

**Warning signs:** User confusion, support requests about vague error messages.

## Code Examples

Verified patterns from official sources:

### Complete Signup Flow with Error Handling
```typescript
// Source: Firebase docs + Next.js docs
// lib/firebase/auth-actions.ts
'use server'

import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { SignupFormSchema, SignupFormState } from '@/lib/validations/auth';

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  // 1. Validate
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // 3. Optional: Create user profile in Firestore
    // await createUserProfile(userCredential.user.uid, { email });

    return { errors: {} };
  } catch (error) {
    const authError = error as AuthError;

    // 4. Handle specific Firebase errors
    switch (authError.code) {
      case 'auth/email-already-in-use':
        return {
          errors: { email: ['This email is already registered'] },
        };
      case 'auth/invalid-email':
        return {
          errors: { email: ['Please enter a valid email address'] },
        };
      case 'auth/weak-password':
        return {
          errors: { password: ['Password must be at least 6 characters'] },
        };
      default:
        console.error('Signup error:', authError);
        return {
          errors: { _form: ['Failed to create account. Please try again.'] },
        };
    }
  }
}
```

### Complete Login Flow with Session Persistence
```typescript
// Source: Firebase docs
// lib/firebase/auth-actions.ts
'use server'

import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { LoginFormSchema, LoginFormState } from '@/lib/validations/auth';

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Session persists automatically due to browserLocalPersistence
    return { errors: {} };
  } catch (error) {
    const authError = error as AuthError;

    switch (authError.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        // Don't distinguish between these for security
        return {
          errors: { _form: ['Invalid email or password'] },
        };
      case 'auth/invalid-email':
        return {
          errors: { email: ['Please enter a valid email address'] },
        };
      case 'auth/too-many-requests':
        return {
          errors: { _form: ['Too many failed attempts. Please try again later.'] },
        };
      default:
        console.error('Login error:', authError);
        return {
          errors: { _form: ['Failed to sign in. Please try again.'] },
        };
    }
  }
}
```

### Auth State Observer with Loading State
```typescript
// Source: Firebase docs + React best practices
// components/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Important: set loading false after first check
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Logout Action
```typescript
// Source: Firebase docs
// lib/firebase/auth-actions.ts
'use server'

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { redirect } from 'next/navigation';

export async function logout() {
  try {
    await signOut(auth);
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to sign out');
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router with getServerSideProps | App Router with Server Components | Next.js 13+ (2023) | Auth checks now happen in components/middleware, not page-level data fetching |
| NextAuth.js as default recommendation | Native Next.js auth patterns | Next.js 14+ docs (2024) | Next.js docs now recommend building auth with Server Actions + session cookies rather than third-party libraries |
| Firebase UI library | Custom forms with Server Actions | Next.js 13+ App Router | FirebaseUI doesn't integrate well with App Router; custom forms provide better UX |
| Context for auth state across Server Components | useAuth hook only in Client Components, DAL for Server Components | App Router era (2023+) | React Context doesn't work in Server Components; separation is now required |
| Global middleware for all routes | Targeted middleware with matchers | Next.js 12+ (2022) | Performance optimization - middleware only runs on necessary routes |

**Deprecated/outdated:**
- **next-firebase-auth:** Does not support Next.js App Router, abandoned for App Router projects
- **FirebaseUI Web:** Pre-built UI components that don't align with Server Actions pattern; build custom forms instead
- **Importing firebase/app in multiple places:** Use singleton pattern with `getApps()` guard to prevent re-initialization (already implemented in Phase 1)

## Open Questions

Things that couldn't be fully resolved:

1. **Firebase Admin SDK vs Client SDK for Server-Side Auth Verification**
   - What we know: Firebase Client SDK only works in browser. Admin SDK can verify tokens server-side but requires service account credentials.
   - What's unclear: Whether to use Admin SDK for server-side token verification or rely on cookie-based checks. Admin SDK is more secure but adds complexity.
   - Recommendation: Start with cookie-based checks (simpler, sufficient for this phase). Consider Admin SDK if/when strict server-side verification is needed for sensitive operations.

2. **Onboarding Wizard Library vs Custom Implementation**
   - What we know: Libraries like Onborda and OnboardJS exist for multi-step flows. Custom implementation with state management is also viable.
   - What's unclear: Whether a library is worth the dependency for a simple 2-step flow (account creation → add first glasses).
   - Recommendation: Build custom wizard with URL params or state management for Phase 2 simplicity. Revisit if wizard grows beyond 3-4 steps.

3. **Anonymous Firebase Auth vs No Auth for Drinkers**
   - What we know: Firebase supports anonymous authentication that can be upgraded later. Alternative is no auth at all for drinkers.
   - What's unclear: Whether anonymous auth provides value for drinkers who just scan QR codes without accounts.
   - Recommendation: Phase 2 requirement is "anonymous visitors go straight to drinker/scan flow" - implement WITHOUT Firebase anonymous auth. Drinkers don't need Firebase accounts. Only implement if future phases need to track drinker history.

## Sources

### Primary (HIGH confidence)
- Firebase Authentication Web Docs - https://firebase.google.com/docs/auth/web/start
- Firebase Password Authentication - https://firebase.google.com/docs/auth/web/password-auth
- Firebase Manage Users - https://firebase.google.com/docs/auth/web/manage-users
- Next.js Authentication Guide - https://nextjs.org/docs/app/building-your-application/authentication
- Next.js Forms Guide - https://nextjs.org/docs/app/guides/forms

### Secondary (MEDIUM confidence)
- next-firebase-auth-edge docs - https://next-firebase-auth-edge-docs.vercel.app/docs (library for App Router, verified against official patterns)
- Firebase Auth State Persistence - https://firebase.google.com/docs/auth/web/auth-state-persistence (official doc, couldn't fetch full content but verified key concepts)
- Firebase Security Rules and Auth - https://firebase.google.com/docs/rules/rules-and-auth (security best practices)
- Next.js App Router Authentication Tutorial - https://nextjs.org/learn/dashboard-app/adding-authentication (official learning path)

### Tertiary (LOW confidence - WebSearch only)
- Community patterns from DEV.to, Medium, and blog posts about Next.js + Firebase integration (multiple sources agree on middleware + Server Actions pattern)
- Clerk authentication guide - https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router (competitor product but validates Next.js patterns)
- Onboarding library comparisons - https://onboardjs.com/blog/5-best-react-onboarding-libraries-in-2025-compared (for wizard implementation options)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Firebase Auth and Next.js patterns verified through official documentation
- Architecture: HIGH - All major patterns sourced from Next.js and Firebase official docs
- Pitfalls: MEDIUM - Combination of official docs (security rules, error handling) and community-verified issues (middleware performance, race conditions)

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable domain, but Next.js updates frequently)
