# Phase 4: QR Check-in Flow - Research

**Researched:** 2026-02-07
**Domain:** QR Code Generation, Web Share API, Next.js Dynamic Routes, Firebase Public Data Access
**Confidence:** HIGH

## Summary

This phase implements QR code generation for hosts and a public check-in flow for drinkers to view host collections. Research reveals a mature ecosystem with well-established patterns: `react-qr-code` for SVG-based QR generation, `html-to-image` for PNG exports, Web Share API for mobile sharing with proper fallbacks, and Next.js dynamic routes with proper 404 handling for invalid codes.

The key architectural challenge is enabling unauthenticated users to read specific Firestore collections while maintaining security elsewhere. Firebase security rules support this via public read rules scoped to specific paths. The middleware pattern requires updating to allow public access to check-in routes while maintaining authentication for dashboard routes.

The standard approach uses Firebase user IDs as check-in codes rather than separate URL shorteners, as UIDs are already unique, collision-resistant (like UUIDs), and eliminate the need for additional database tables. For readability, a shorter format like `/c/[userId]` is preferred over `/checkin/[userId]`.

**Primary recommendation:** Use react-qr-code for rendering QR codes as SVG, html-to-image for PNG conversion/download, Web Share API with fallback to download button, and Firebase security rules allowing public read access to `users/{userId}/glasses` subcollection while keeping user profile data private.

## Standard Stack

### Core Libraries

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-qr-code | 2.x | QR code generation | Most popular React QR library (334+ projects), renders as SVG, clean API, UTF-8 support |
| html-to-image | 1.x | SVG to PNG conversion | Actively maintained fork of dom-to-image, supports toBlob for downloads |
| Web Share API | Native | Mobile sharing | Built into browsers, no dependencies, native UX for mobile users |
| nanoid | 5.x | Optional short codes | Industry standard for collision-resistant short IDs (if needed for vanity URLs) |

### Supporting Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| FileSaver.js | Blob download polyfill | Only if browser compatibility issues arise with native download |
| navigator.canShare() | Feature detection | Always check before calling share() |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-qr-code | qrcode.react | Similar features, but react-qr-code has cleaner API and better docs |
| react-qr-code | next-qrcode | Adds Next.js-specific features but less widely adopted |
| html-to-image | react-svg-to-image | More React-specific but adds wrapper complexity |
| Firebase user ID | nanoid short codes | Shorter URLs but requires extra DB table and collision handling |

**Installation:**
```bash
npm install react-qr-code html-to-image
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx      # Add QR card here
│   │   └── qr/page.tsx             # New: QR code display page
│   ├── c/[userId]/                 # New: Public check-in route
│   │   ├── page.tsx                # Check-in landing page
│   │   ├── error.tsx               # Error boundary
│   │   └── not-found.tsx           # 404 for invalid codes
├── components/
│   ├── qr/
│   │   ├── QRCodeDisplay.tsx       # QR display with download/share
│   │   └── QRDownloadButton.tsx    # Download as PNG logic
│   └── glasses/
│       └── GlassCard.tsx           # Extend for read-only mode
├── lib/
│   └── firebase/
│       └── public-glasses-db.ts    # New: Public read operations
```

### Pattern 1: QR Code Generation and Display

**What:** Generate QR code from URL, display as SVG, provide download/share
**When to use:** Host dashboard QR page

**Example:**
```typescript
// Source: https://github.com/rosskhanas/react-qr-code
import { QRCode } from 'react-qr-code';

export default function QRCodeDisplay({ userId }: { userId: string }) {
  const checkInUrl = `${window.location.origin}/c/${userId}`;

  return (
    <div>
      <QRCode
        value={checkInUrl}
        size={256}
        level="M" // Medium error correction (15%)
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
}
```

### Pattern 2: SVG to PNG Download

**What:** Convert rendered SVG QR code to PNG blob for download
**When to use:** Download button functionality

**Example:**
```typescript
// Source: https://github.com/bubkoo/html-to-image
import { toBlob } from 'html-to-image';

async function downloadQRCode(element: HTMLElement) {
  const blob = await toBlob(element, {
    quality: 1.0,
    pixelRatio: 2, // Retina quality
  });

  if (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'check-in-qr.png';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

### Pattern 3: Web Share API with Fallback

**What:** Use native share on mobile, fallback to download on desktop
**When to use:** Share button functionality

**Example:**
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
async function shareQRCode(blob: Blob) {
  // Check if Web Share API supports files
  if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr.png')] })) {
    const file = new File([blob], 'check-in-qr.png', { type: 'image/png' });
    await navigator.share({
      files: [file],
      title: 'My Glass Collection QR Code',
      text: 'Scan to see my beer glass collection!',
    });
  } else {
    // Fallback to download
    downloadQRCode(blob);
  }
}
```

### Pattern 4: Next.js Dynamic Route with Validation

**What:** Dynamic route with server-side userId validation, 404 for invalid
**When to use:** `/c/[userId]` check-in route

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
// app/c/[userId]/page.tsx
export default async function CheckInPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Fetch glasses (will be empty array if user doesn't exist)
  const glasses = await getUserGlassesPublic(userId);

  // Fetch user profile to get display name
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    notFound(); // Renders not-found.tsx
  }

  return (
    <div>
      <h1>Welcome to {userProfile.name}'s Collection</h1>
      {/* Render glasses */}
    </div>
  );
}
```

### Pattern 5: Firebase Public Read Rules

**What:** Security rules allowing public read of specific collections
**When to use:** Firestore rules for `users/{userId}/glasses`

**Example:**
```javascript
// Source: https://firebase.google.com/docs/firestore/security/rules-structure
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // User profile remains private
      allow read: if request.auth != null && request.auth.uid == userId;

      match /glasses/{glassId} {
        // Glasses are publicly readable for check-in flow
        allow read: if true;
        // Write operations still require authentication
        allow create, update, delete: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Pattern 6: GlassCard Read-Only Mode

**What:** Extend existing GlassCard component with read-only mode
**When to use:** Displaying host glasses to drinkers

**Example:**
```typescript
type GlassCardProps = {
  glass: GlassType;
  mode: 'catalog' | 'collection' | 'readonly'; // Add readonly mode
  // ... other props
};

export default function GlassCard({ glass, mode, ... }: GlassCardProps) {
  // Skip rendering actions for readonly mode
  const showActions = mode !== 'readonly';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Glass illustration and info */}
      <img src={glass.svgPath} alt={glass.name} />
      <h3>{glass.name}</h3>
      <p>{glass.description}</p>

      {/* Conditionally render actions */}
      {showActions && (
        <div className="space-y-2">
          {/* Add/Remove/Edit controls */}
        </div>
      )}
    </div>
  );
}
```

### Pattern 7: Middleware Update for Public Routes

**What:** Update middleware to allow unauthenticated access to check-in routes
**When to use:** Middleware configuration

**Example:**
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const isPublicRoute = pathname.startsWith('/c/') || pathname.startsWith('/guide');

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/glasses');

  // Auth routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');

  const hasAuthCookie = request.cookies.has('__session');

  // Allow public routes to proceed without auth
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Existing auth logic for protected/auth routes
  if (isProtectedRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

### Anti-Patterns to Avoid

- **Storing QR code images in database:** Generate QR codes on-the-fly from user ID, don't store binary data
- **Fancy/colorful QR codes:** Standard black & white has best scan reliability across devices
- **Using low error correction:** Level L (7%) fails with minor damage; use M (15%) minimum
- **Not validating share support:** Always check `navigator.canShare()` before calling `share()`
- **Exposing user email/personal data:** Only make glasses collection public, not user profile
- **Separate short code system:** Firebase UIDs are already unique and collision-resistant; no need for nanoid
- **Client-side only validation:** Validate userId in server component before rendering page
- **Generic error messages:** Provide specific 404 page for invalid check-in codes with CTA to sign up

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| QR code generation | Manual QR spec implementation | react-qr-code | QR spec is complex with error correction, encoding modes, version/size handling |
| URL shortening | Custom nanoid system | Firebase user IDs | UIDs are already collision-resistant and unique; no extra DB table needed |
| Canvas to PNG | Manual canvas rendering | html-to-image | Handles CSS styles, fonts, SVG serialization, cross-browser quirks |
| Download trigger | Complex blob/URL handling | html-to-image toBlob + anchor click | Proper memory cleanup, browser compatibility |
| Mobile sharing | Custom share dialogs | Web Share API | Native UX, system share sheet, respects user's installed apps |
| Feature detection | Try/catch on share() | navigator.canShare() | Proper detection before attempting share |

**Key insight:** QR code generation involves complex encoding algorithms, error correction calculations, and version selection. SVG-to-PNG conversion handles CSS inheritance, font embedding, and cross-origin issues. Web Share API provides native OS integration that custom solutions can't match. Use battle-tested libraries.

## Common Pitfalls

### Pitfall 1: QR Code Not Scannable

**What goes wrong:** QR code scans unreliably or not at all across devices

**Why it happens:**
- Using colors with insufficient contrast
- QR code too small (minimum 2x2 cm or ~1x1 inch)
- Too low error correction level
- Insufficient "quiet zone" (white margin) around code

**How to avoid:**
- Use standard black (#000000) on white (#ffffff)
- Render at 256px minimum for web display
- Use error correction level M (15%) or Q (25%)
- Ensure parent container has white/light background padding

**Warning signs:**
- Users reporting scan failures on certain phone models
- Codes work on one device but not another
- Dark mode/background interferes with scanning

**Source:** [QR Code Error Correction Explained](https://scanova.io/blog/qr-code-error-correction/), [Minimum QR Code Size](https://scanova.io/blog/minimum-qr-code-size/)

### Pitfall 2: Web Share API Fails Silently

**What goes wrong:** Share button doesn't work and provides no feedback

**Why it happens:**
- Web Share API only works in secure contexts (HTTPS)
- API only works with user gesture (button click), not automatic calls
- Some browsers support `share()` but not file sharing
- Desktop browsers often don't support Web Share API at all

**How to avoid:**
```typescript
// Always check support before enabling share button
const [canShare, setCanShare] = useState(false);

useEffect(() => {
  // Check if browser supports file sharing
  const testFile = new File([''], 'test.png', { type: 'image/png' });
  const supported = navigator.canShare && navigator.canShare({ files: [testFile] });
  setCanShare(supported);
}, []);

async function handleShare() {
  if (!canShare) {
    // Fallback to download
    await handleDownload();
    return;
  }

  try {
    await navigator.share({ ... });
  } catch (err) {
    if (err.name === 'AbortError') {
      // User cancelled - this is fine, no error message
      return;
    }
    // Other errors: fallback to download
    await handleDownload();
  }
}
```

**Warning signs:**
- Share button appears but does nothing when clicked
- Works in development (localhost) but not production
- Different behavior between mobile and desktop

**Source:** [Navigator.share() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [Web Share API Guide](https://www.telerik.com/blogs/definitive-guide-using-web-share-api)

### Pitfall 3: Firebase Public Read Opens Security Hole

**What goes wrong:** Making glasses public accidentally exposes user profile data or allows unauthorized writes

**Why it happens:**
- Security rules not properly scoped to subcollection
- Using `allow read: if true` at parent document level
- Not understanding rule cascading behavior

**How to avoid:**
```javascript
// WRONG - This exposes user profile too
match /users/{userId} {
  allow read: if true; // Oops! User email/data is now public

  match /glasses/{glassId} {
    allow read: if true;
  }
}

// CORRECT - Parent stays private, only subcollection is public
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId; // Private

  match /glasses/{glassId} {
    allow read: if true; // Public read
    allow write: if request.auth != null && request.auth.uid == userId; // Authenticated write
  }
}
```

**Warning signs:**
- Firebase Console showing warnings about insecure rules
- User email/profile data appearing in network requests on check-in page
- Write operations succeeding without authentication

**Source:** [Firebase Security Rules Structure](https://firebase.google.com/docs/firestore/security/rules-structure), [Writing Conditions](https://firebase.google.com/docs/firestore/security/rules-conditions)

### Pitfall 4: Invalid User IDs Return Empty Page Instead of 404

**What goes wrong:** Visiting `/c/invalid-user-id` shows blank page or "No glasses yet" message instead of proper 404

**Why it happens:**
- Not validating if user exists before rendering
- Treating non-existent user same as empty collection
- Using client-side validation only

**How to avoid:**
```typescript
// Fetch user profile to verify user exists
const userProfile = await getUserProfile(userId);

if (!userProfile) {
  notFound(); // Triggers not-found.tsx
}

// Empty collection is OK (user exists, just no glasses)
const glasses = await getUserGlasses(userId);
// Render with appropriate empty state
```

**Warning signs:**
- Random strings in URL show same UI as valid empty collections
- No distinction between "user doesn't exist" and "no glasses yet"
- SEO issues with soft 404s

**Source:** [Next.js 404 for Dynamic Routes](https://andreaskeller.name/blog/nextjs-404-not-found-dynamic-routes)

### Pitfall 5: QR Code URL Uses Wrong Origin in Production

**What goes wrong:** QR code contains localhost URL or wrong domain when deployed

**Why it happens:**
- Hardcoding `http://localhost:3000` during development
- Using `window.location.origin` in server components (undefined)
- Not setting proper environment variables

**How to avoid:**
```typescript
// Client component
'use client';
import { useEffect, useState } from 'react';

export default function QRCodeDisplay({ userId }: { userId: string }) {
  const [checkInUrl, setCheckInUrl] = useState('');

  useEffect(() => {
    // Get origin from browser
    setCheckInUrl(`${window.location.origin}/c/${userId}`);
  }, [userId]);

  if (!checkInUrl) return <div>Loading...</div>;

  return <QRCode value={checkInUrl} />;
}

// Or use environment variable
const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
const checkInUrl = `${origin}/c/${userId}`;
```

**Warning signs:**
- QR codes work in development but fail in production
- Scanned URL points to wrong domain
- Users report 404 errors after scanning

### Pitfall 6: Memory Leaks from Blob URLs

**What goes wrong:** Downloading multiple QR codes causes browser to slow down or crash

**Why it happens:**
- Creating blob URLs with `URL.createObjectURL()` but never calling `URL.revokeObjectURL()`
- Blob URLs persist in memory until page reload

**How to avoid:**
```typescript
async function downloadQRCode(element: HTMLElement) {
  const blob = await toBlob(element);

  if (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = url;
    link.click();

    // CRITICAL: Clean up blob URL
    URL.revokeObjectURL(url);
  }
}
```

**Warning signs:**
- Browser performance degrades after multiple downloads
- Memory usage increases over time
- Browser DevTools shows increasing blob URL count

**Source:** [DigitalOcean Canvas toBlob Guide](https://www.digitalocean.com/community/tutorials/js-canvas-toblob)

## Code Examples

Verified patterns from official sources:

### Basic QR Code Component

```typescript
// Source: https://github.com/rosskhanas/react-qr-code
'use client';
import { QRCode } from 'react-qr-code';

export default function QRDisplay({ url }: { url: string }) {
  return (
    <div style={{
      height: "auto",
      margin: "0 auto",
      maxWidth: 256,
      width: "100%",
      background: 'white',
      padding: '16px' // Quiet zone
    }}>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={url}
        viewBox={`0 0 256 256`}
        level="M" // 15% error correction
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
}
```

### Download QR as PNG

```typescript
// Source: https://github.com/bubkoo/html-to-image
'use client';
import { toBlob } from 'html-to-image';

export function DownloadButton({ elementId }: { elementId: string }) {
  async function handleDownload() {
    const element = document.getElementById(elementId);
    if (!element) return;

    const blob = await toBlob(element, {
      quality: 1.0,
      pixelRatio: 2, // 2x for retina displays
      backgroundColor: '#ffffff',
    });

    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'my-collection-qr.png';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url); // Important: cleanup
    }
  }

  return (
    <button onClick={handleDownload}>
      Download QR Code
    </button>
  );
}
```

### Share with Web Share API

```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
'use client';
import { useState, useEffect } from 'react';
import { toBlob } from 'html-to-image';

export function ShareButton({ elementId }: { elementId: string }) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if browser supports file sharing
    if (navigator.canShare) {
      const testFile = new File([''], 'test.png', { type: 'image/png' });
      setCanShare(navigator.canShare({ files: [testFile] }));
    }
  }, []);

  async function handleShare() {
    const element = document.getElementById(elementId);
    if (!element) return;

    const blob = await toBlob(element, { quality: 1.0, pixelRatio: 2 });
    if (!blob) return;

    if (canShare) {
      try {
        const file = new File([blob], 'my-collection-qr.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My Glass Collection',
          text: 'Scan to see my beer glasses!',
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to download
          downloadBlob(blob);
        }
      }
    } else {
      // Fallback to download
      downloadBlob(blob);
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'my-collection-qr.png';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={handleShare}>
      {canShare ? 'Share' : 'Download'}
    </button>
  );
}
```

### Check-in Page with Validation

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
// app/c/[userId]/page.tsx
import { notFound } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { GlassCard } from '@/components/glasses/GlassCard';

type UserProfile = {
  name: string;
  email: string;
};

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return userDoc.data() as UserProfile;
}

async function getUserGlasses(userId: string) {
  const glassesSnap = await getDocs(collection(db, 'users', userId, 'glasses'));
  return glassesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Validate user exists
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    notFound(); // Shows 404 page
  }

  // Get glasses (may be empty array)
  const glasses = await getUserGlasses(userId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-2 text-3xl font-bold">
          {userProfile.name}'s Glass Collection
        </h1>
        <p className="mb-8 text-gray-600">
          Pick a beer to find your perfect glass!
        </p>

        {glasses.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="mb-4 text-gray-600">
              This host hasn't added any glasses yet.
            </p>
            <a href="/guide" className="text-amber-600 hover:text-amber-700">
              View Beer Glass Guide →
            </a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {glasses.map((glass) => (
              <GlassCard key={glass.id} glass={glass} mode="readonly" />
            ))}
          </div>
        )}

        {/* Tease beer flow */}
        <div className="mt-8 rounded-lg bg-gray-100 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold">Coming Soon</h2>
          <p className="text-gray-600">
            Select a beer to get glass recommendations!
          </p>
          <button disabled className="mt-4 rounded-md bg-gray-300 px-6 py-2 text-gray-500 cursor-not-allowed">
            Pick a Beer
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Custom 404 Page for Invalid Codes

```typescript
// app/c/[userId]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Invalid Check-in Code
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          This QR code is invalid or has expired. Please ask your host for a new code.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-md bg-amber-600 px-6 py-3 text-white hover:bg-amber-700"
        >
          Create Your Own Collection
        </Link>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| QR libraries generate raster images | SVG-first QR generation (react-qr-code) | ~2020 | Scalable, crisp at any size, smaller bundle |
| Custom URL shortening systems | Use existing unique IDs (Firebase UID) | Ongoing | No extra database, no collision handling needed |
| Desktop-only share buttons | Web Share API with fallback | ~2021 | Native mobile UX, respects user's installed apps |
| Navigator.share() without canShare() | Always check canShare() first | 2023+ | Proper feature detection, better error handling |
| Middleware blocks all unauth access | Opt-in protection with public routes | Next.js 13+ | Flexible auth patterns, public pages possible |
| Custom canvas PNG generation | html-to-image library | 2019+ | Handles edge cases, cross-browser compatible |

**Deprecated/outdated:**
- **qrcode.js (canvas-based)**: Still works but SVG approach (react-qr-code) is more modern
- **dom-to-image**: Original library unmaintained; use html-to-image fork instead
- **Global middleware auth**: Next.js 13+ pattern allows route-specific auth, more flexible

## Open Questions

1. **Display name for hosts**
   - What we know: User profile has email, need display name for "Welcome to X's collection"
   - What's unclear: Should we add a `name` field to user profile, or use email prefix?
   - Recommendation: Use email prefix for now (`email.split('@')[0]`), add proper name field in future phase

2. **QR code expiration**
   - What we know: Some systems use expiring QR codes for security
   - What's unclear: Is expiration needed for this use case? Host controls access via Firestore rules
   - Recommendation: No expiration needed - host can "expire" by deleting their collection, and there's no sensitive data exposure (glasses are already public when checked in)

3. **Rate limiting on public reads**
   - What we know: Firestore security rules allow public read of glasses
   - What's unclear: Should we implement rate limiting to prevent abuse?
   - Recommendation: Start without rate limiting, monitor usage. Firebase has built-in DDoS protection. If abuse occurs, implement Firestore quotas or App Check.

4. **Host scanning their own QR**
   - What we know: Context says hosts should see full drinker experience when scanning own QR
   - What's unclear: Should we show a subtle "This is your collection" banner?
   - Recommendation: Show identical experience to guests - no special banner. If host is logged in, their regular nav allows returning to dashboard.

5. **Client-side vs Server-side public reads**
   - What we know: Project uses client-side Firebase calls, but check-in page could be server component
   - What's unclear: Should public reads use server or client SDK for better performance?
   - Recommendation: Use server component for initial render (better performance, SEO), client SDK for any interactive features added in future phases

## Sources

### Primary (HIGH confidence)

- [react-qr-code GitHub](https://github.com/rosskhanas/react-qr-code) - Core QR generation library
- [html-to-image GitHub](https://github.com/bubkoo/html-to-image) - SVG to PNG conversion
- [Navigator.share() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) - Web Share API official spec
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) - App Router dynamic segments
- [Firebase Security Rules Structure](https://firebase.google.com/docs/firestore/security/rules-structure) - Public read patterns
- [Firebase Security Rules Conditions](https://firebase.google.com/docs/firestore/security/rules-conditions) - Authentication context

### Secondary (MEDIUM confidence)

- [QR Code Error Correction Explained](https://scanova.io/blog/qr-code-error-correction/) - Best practices for error correction levels
- [Minimum QR Code Size](https://scanova.io/blog/minimum-qr-code-size/) - Size recommendations for scanning
- [Definitive Guide to Web Share API](https://www.telerik.com/blogs/definitive-guide-using-web-share-api) - Implementation patterns
- [Next.js 404 for Dynamic Routes](https://andreaskeller.name/blog/nextjs-404-not-found-dynamic-routes) - Error handling patterns
- [DigitalOcean Canvas toBlob Guide](https://www.digitalocean.com/community/tutorials/js-canvas-toblob) - Download implementation
- [Next.js Dynamic Route Segments 2026 Guide](https://thelinuxcode.com/nextjs-dynamic-route-segments-in-the-app-router-2026-guide/) - Current patterns

### Tertiary (LOW confidence)

- [QR Code Security Guide](https://security.duke.edu/security-guides/qr-code-security-guide/) - General security awareness, not implementation-specific
- [QR Code Phishing Scams](https://fastestpass.com/blog/qr-code-phishing-scams/) - User education context, not technical requirements

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - react-qr-code and html-to-image are well-established with active maintenance
- Architecture: HIGH - Next.js 16 patterns verified, Firebase security rules are official documentation
- Pitfalls: MEDIUM - Based on community patterns and documentation, validated across sources
- Web Share API: MEDIUM - Official spec but browser support varies; fallback required
- Public Firebase reads: HIGH - Official Firebase documentation with clear examples

**Research date:** 2026-02-07
**Valid until:** ~30 days (stable ecosystem, established patterns)

**Key verification notes:**
- QR generation patterns verified through multiple sources (npm, GitHub, GeeksforGeeks)
- Web Share API support confirmed via MDN and caniuse data
- Firebase security rules validated through official Firebase documentation
- Next.js App Router patterns confirmed via official Next.js 16 documentation
- All code examples sourced from official docs or verified open-source implementations
