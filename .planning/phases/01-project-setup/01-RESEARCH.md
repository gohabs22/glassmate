# Phase 1: Project Setup - Research

**Researched:** 2026-02-05
**Domain:** iOS Swift/SwiftUI project initialization with backend integration
**Confidence:** HIGH

## Summary

This research covers the foundational setup for a native iOS app using Swift/SwiftUI with Firebase or Supabase backend integration. The iOS ecosystem has matured significantly, with Swift Package Manager (SPM) becoming the standard dependency manager (CocoaPods enters read-only mode December 2026), SwiftUI's MVVM pattern well-established, and NavigationStack replacing deprecated NavigationView since iOS 16.

For this beer glass matching app, the recommendation is to use **Firebase** over Supabase for the backend. While Supabase offers better pricing and PostgreSQL flexibility, Firebase provides superior mobile SDK maturity, better offline support, real-time sync capabilities essential for multi-device scenarios, and more authentication providers. Since this is a mobile-first project with requirements for QR scanning, real-time data, and both anonymous and authenticated users, Firebase's mobile-optimized features are the better fit.

The standard 2026 setup involves: Xcode 16.2+, iOS 16.0 minimum deployment target, Swift Package Manager for dependencies, feature-based project structure (not file-type-based), MVVM architecture with ObservableObject ViewModels, and NavigationStack for navigation.

**Primary recommendation:** Create Xcode project with iOS 16.0 minimum, integrate Firebase SDK via SPM, establish feature-based folder structure with Core/Features/UI separation, implement basic NavigationStack-based navigation, and configure Firebase services (Auth, Firestore, Storage) using proper SwiftUI lifecycle patterns with UIApplicationDelegateAdaptor.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SwiftUI | iOS 16.0+ | UI framework | Native Apple framework, declarative UI, MVVM-friendly |
| Firebase iOS SDK | 11.x+ | Backend services | Mature mobile SDKs, offline support, real-time sync, comprehensive auth |
| Swift Package Manager | Built-in | Dependency management | Apple-native, CocoaPods deprecated Dec 2026, faster builds |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| FirebaseAuth | 11.x+ | Authentication | Email/password, anonymous, OAuth providers (Google, Apple, etc.) |
| FirebaseFirestore | 11.x+ | NoSQL database | Document-based data storage with offline persistence |
| FirebaseStorage | 11.x+ | File storage | Image uploads, cloud storage with Firebase integration |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Firebase | Supabase Swift SDK v2.41.0 | Better pricing, PostgreSQL/SQL, but weaker mobile SDK maturity, less real-time optimization for mobile |
| Swift Package Manager | CocoaPods 1.12.0+ | Legacy projects only; CocoaPods becomes read-only Dec 2026 |
| SwiftUI | UIKit | More mature but verbose; SwiftUI is modern standard for new apps |

**Installation:**
```swift
// Add via Xcode: File > Add Packages
// Repository: https://github.com/firebase/firebase-ios-sdk

// In Xcode project, add these products:
// - FirebaseAuth
// - FirebaseFirestore
// - FirebaseStorage
```

## Architecture Patterns

### Recommended Project Structure
```
BeerGlassApp/
├── App/                    # App-level files
│   ├── BeerGlassApp.swift  # @main entry point with @UIApplicationDelegateAdaptor
│   └── AppDelegate.swift   # Firebase initialization
├── Core/                   # Shared infrastructure
│   ├── Services/           # Firebase, auth, data services
│   ├── Models/             # Shared domain models
│   ├── Extensions/         # Swift/SwiftUI extensions
│   └── Config/             # Constants, environment config
├── Features/               # Feature modules (not file-type folders)
│   ├── Auth/               # Authentication feature
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Models/
│   ├── Home/               # Home hub feature
│   └── Navigation/         # Root navigation coordinator
├── UI/                     # Reusable UI components
│   ├── Components/         # Buttons, cards, etc.
│   └── Theme/              # Colors, fonts, styles
└── Resources/
    ├── Assets.xcassets
    ├── GoogleService-Info.plist
    └── Info.plist
```

### Pattern 1: SwiftUI App Lifecycle with Firebase
**What:** Initialize Firebase using UIApplicationDelegateAdaptor in SwiftUI app lifecycle
**When to use:** All SwiftUI apps using Firebase (required for proper initialization)
**Example:**
```swift
// Source: https://firebase.google.com/docs/ios/setup
import SwiftUI
import FirebaseCore

@main
struct BeerGlassApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            NavigationStack {
                ContentView()
            }
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
```

### Pattern 2: MVVM with ObservableObject
**What:** Separate business logic into ViewModels using @ObservableObject and @Published
**When to use:** All features with state management or data fetching
**Example:**
```swift
// Source: SwiftUI MVVM best practices (multiple verified sources)
import SwiftUI

// ViewModel
@MainActor
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var errorMessage: String?

    func signIn(email: String, password: String) async {
        // Business logic here
    }
}

// View
struct AuthView: View {
    @StateObject private var viewModel = AuthViewModel()

    var body: some View {
        // UI binds to viewModel's @Published properties
    }
}
```

### Pattern 3: NavigationStack with Value-Based Navigation
**What:** Use NavigationStack (iOS 16+) with value-based navigation instead of deprecated NavigationView
**When to use:** All navigation scenarios; essential for programmatic navigation and deep linking
**Example:**
```swift
// Source: https://developer.apple.com/documentation/swiftui/navigationstack
import SwiftUI

enum Route: Hashable {
    case home
    case glassDetail(id: String)
    case qrScanner
}

struct RootNavigationView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .home:
                        HomeView()
                    case .glassDetail(let id):
                        GlassDetailView(id: id)
                    case .qrScanner:
                        QRScannerView()
                    }
                }
        }
    }
}
```

### Pattern 4: Environment Configuration
**What:** Store configuration values (API URLs, feature flags) in separate Config.swift, never hardcode secrets
**When to use:** Always, from project start
**Example:**
```swift
// Source: iOS environment best practices (verified sources)
// Core/Config/Config.swift
enum Config {
    static let minimumIOSVersion = "16.0"
    static let appName = "Beer Glass Matcher"

    #if DEBUG
    static let apiBaseURL = "https://dev-api.example.com"
    #else
    static let apiBaseURL = "https://api.example.com"
    #endif
}

// GoogleService-Info.plist location:
// Place at project root, add to all targets
// DO NOT rename, DO NOT place in subfolders (breaks Firebase initialization)
```

### Anti-Patterns to Avoid
- **File-type folders (Models/, Views/, ViewModels/ at root):** Hard to maintain as app grows; group by feature instead
- **Using NavigationView:** Deprecated in iOS 16; use NavigationStack instead
- **Initializing Firebase in View.onAppear:** Must initialize in AppDelegate for proper functionality
- **Storing Firebase config in subfolder:** GoogleService-Info.plist must be at project root or Firebase won't find it
- **Using CocoaPods for new projects:** CocoaPods becomes read-only Dec 2026; use SPM instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication flow | Custom auth system | FirebaseAuth | Handles token refresh, session management, email verification, password reset, OAuth flows, anonymous auth upgrade |
| Offline data sync | Custom sync logic | Firestore offline persistence | Handles conflict resolution, network state detection, automatic retry, queue management |
| Secure credential storage | Custom encryption | iOS Keychain Services | Hardware-backed encryption, secure enclave integration, OS-managed security |
| Image caching | Custom cache manager | Kingfisher or Nuke SPM package | Memory/disk management, prefetching, image processing, GIF support |
| Navigation coordinator | Custom router pattern | NavigationStack with NavigationPath | Native deep linking, state restoration, back stack management |
| Environment config | Manual build script switching | Xcode Build Configurations + .xcconfig files | Built-in Xcode feature, scheme-based, source control friendly |

**Key insight:** Firebase services handle mobile-specific edge cases (offline mode, background sync, network transitions, token refresh) that are deceptively complex. SwiftUI's native navigation and state management tools (NavigationStack, @Published, @StateObject) are now mature enough to avoid third-party routing libraries.

## Common Pitfalls

### Pitfall 1: Firebase Swizzling Not Disabled in SwiftUI
**What goes wrong:** Firebase may not properly track app lifecycle events or receive push notifications
**Why it happens:** SwiftUI apps require explicit swizzling disable; this is a known Firebase + SwiftUI issue
**How to avoid:** Add `FirebaseAppDelegateProxyEnabled = NO` to Info.plist, use UIApplicationDelegateAdaptor
**Warning signs:** Push notifications not received, analytics events missing, silent failures

### Pitfall 2: GoogleService-Info.plist Not in Bundle Root
**What goes wrong:** Firebase initialization fails with "Could not locate configuration file" error
**Why it happens:** Clicking "Create folder reference" instead of "Create groups" in Xcode moves plist into subfolder within bundle
**How to avoid:** When adding plist, ensure "Create groups" is selected, verify plist is at YourApp.app/GoogleService-Info.plist (not YourApp.app/Resources/GoogleService-Info.plist)
**Warning signs:** `FirebaseApp.configure()` crashes or prints plist not found error

### Pitfall 3: Using NavigationView Instead of NavigationStack
**What goes wrong:** Navigation bugs, deprecated warnings, no programmatic navigation support
**Why it happens:** Old tutorials and Stack Overflow answers use NavigationView (pre-iOS 16 API)
**How to avoid:** Always use NavigationStack for iOS 16+ projects; NavigationView is deprecated
**Warning signs:** Xcode deprecation warnings, can't implement deep linking, navigation state issues

### Pitfall 4: Setting iOS Minimum Below 16.0 for New Projects
**What goes wrong:** Miss modern SwiftUI features (NavigationStack, Layout protocol, etc.), compatibility issues with iOS 13-15 SwiftUI bugs
**Why it happens:** Trying to support older devices, unaware of iOS 16 SwiftUI improvements
**How to avoid:** Set deployment target to iOS 16.0 minimum; iOS 16 is recommended baseline for 2026 apps per ecosystem best practices
**Warning signs:** Can't use NavigationStack, workarounds for iOS 13/14/15 SwiftUI bugs

### Pitfall 5: Hardcoding API Keys or Secrets in Code
**What goes wrong:** Secrets exposed in Git repo and in compiled binary (easily reverse-engineered)
**Why it happens:** Convenience during prototyping, lack of awareness of security risks
**How to avoid:** Never commit secrets; use .xcconfig files (gitignored) for development, server-side auth for production. For truly sensitive keys, fetch from authenticated backend API
**Warning signs:** Keys visible in Git history, keys visible when decompiling .app bundle

### Pitfall 6: Not Using @MainActor for ViewModels
**What goes wrong:** "Publishing changes from background threads not allowed" purple warnings, UI update crashes
**Why it happens:** Async Firebase calls complete on background threads, updating @Published properties off main thread
**How to avoid:** Mark all ViewModels with `@MainActor` annotation to ensure all property updates happen on main thread
**Warning signs:** Purple runtime warnings in Xcode console about main thread publishing

### Pitfall 7: Mismatched Bundle Identifier in GoogleService-Info.plist
**What goes wrong:** Firebase silently fails to connect, no data syncs, authentication doesn't work
**Why it happens:** Copy-pasting plist from another project, typo in bundle ID during Firebase project setup
**How to avoid:** Verify bundle identifier in Xcode matches `BUNDLE_ID` in GoogleService-Info.plist exactly
**Warning signs:** Firebase console shows no data, Analytics not recording events, Auth methods fail silently

## Code Examples

Verified patterns from official sources:

### Complete Firebase SwiftUI Setup
```swift
// Source: https://firebase.google.com/docs/ios/setup
// BeerGlassApp.swift
import SwiftUI
import FirebaseCore
import FirebaseAuth
import FirebaseFirestore
import FirebaseStorage

@main
struct BeerGlassApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            NavigationStack {
                ContentView()
            }
        }
    }
}

// AppDelegate.swift
class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()

        // Optional: Enable Firestore offline persistence
        let settings = FirestoreSettings()
        settings.isPersistenceEnabled = true
        Firestore.firestore().settings = settings

        return true
    }
}
```

### Service Layer Pattern for Firebase
```swift
// Source: iOS architecture best practices (verified patterns)
// Core/Services/AuthService.swift
import FirebaseAuth

@MainActor
class AuthService: ObservableObject {
    @Published var currentUser: User?
    @Published var isAuthenticated = false

    init() {
        // Listen for auth state changes
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.currentUser = user
            self?.isAuthenticated = user != nil
        }
    }

    func signIn(email: String, password: String) async throws {
        try await Auth.auth().signIn(withEmail: email, password: password)
    }

    func signOut() throws {
        try Auth.auth().signOut()
    }

    func signInAnonymously() async throws {
        try await Auth.auth().signInAnonymously()
    }
}
```

### Environment Object Injection Pattern
```swift
// Source: SwiftUI architecture patterns (verified best practices)
// BeerGlassApp.swift
@main
struct BeerGlassApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject private var authService = AuthService()

    var body: some Scene {
        WindowGroup {
            NavigationStack {
                if authService.isAuthenticated {
                    HomeView()
                } else {
                    AuthView()
                }
            }
            .environmentObject(authService)
        }
    }
}

// Any child view can access it
struct HomeView: View {
    @EnvironmentObject var authService: AuthService

    var body: some View {
        Text("User: \(authService.currentUser?.email ?? "Anonymous")")
    }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CocoaPods | Swift Package Manager | CocoaPods maintenance mode Aug 2024, read-only Dec 2026 | Must use SPM for new projects; CocoaPods still works but won't accept new pods |
| NavigationView | NavigationStack | iOS 16 (Sept 2022), now deprecated | NavigationStack required for modern navigation, deep linking, programmatic control |
| UIKit + Storyboards | SwiftUI | SwiftUI v1 (iOS 13, 2019), mature by iOS 16+ (2022+) | New apps should default to SwiftUI unless specific UIKit requirements |
| Manual AppDelegate setup | UIApplicationDelegateAdaptor | SwiftUI 2.0 (iOS 14, 2020) | SwiftUI apps use @UIApplicationDelegateAdaptor for lifecycle hooks |
| iOS 13 minimum | iOS 16 minimum | Industry shift 2025-2026 | iOS 16 baseline recommended for new apps in 2026 |
| @ObservedObject everywhere | @StateObject for ownership | SwiftUI 2.0 (iOS 14, 2020) | Use @StateObject when view creates the object, @ObservedObject when passed in |

**Deprecated/outdated:**
- **NavigationView:** Deprecated iOS 16+, replaced by NavigationStack
- **CocoaPods:** Entering maintenance mode, specs repo read-only Dec 2026
- **Firebase Dynamic Links:** Deprecated Aug 2025, use standard deep links + Firebase custom domains
- **Info.plist editing in Xcode 12 style:** Xcode 13+ uses Info tab in project settings for most keys

## Open Questions

Things that couldn't be fully resolved:

1. **Firebase vs Supabase for this specific project**
   - What we know: Firebase has better mobile SDK, Supabase has better pricing and SQL
   - What's unclear: User's budget tolerance and whether PostgreSQL/SQL benefits outweigh mobile SDK maturity gap
   - Recommendation: **Use Firebase** based on mobile-first nature of project (QR scanning, offline support critical for drinkers, real-time updates). If budget becomes an issue later, Firebase has free tier and Supabase migration is possible (both use similar patterns)

2. **Minimum iOS version: 15 vs 16**
   - What we know: Firebase requires iOS 15+, iOS 16 is 2026 recommended baseline, VisionKit DataScannerViewController requires iOS 16+
   - What's unclear: User's target audience device distribution
   - Recommendation: **Use iOS 16.0 minimum** because project requirements include VisionKit DataScannerViewController (iOS 16+ only), iOS 16 is industry baseline for 2026, and NavigationStack requires iOS 16

3. **Build configuration strategy for development/production**
   - What we know: Xcode supports Debug/Release configs, can create custom configs, .xcconfig files are best practice
   - What's unclear: Whether project needs multiple Firebase environments (dev/staging/prod)
   - Recommendation: **Start with single Firebase project** (Debug/Release both use same project), add dev/prod split only if testing requirements demand it (can add later via build configurations + multiple GoogleService-Info.plist files with build phase script)

## Sources

### Primary (HIGH confidence)
- [Firebase iOS Setup - Official Documentation](https://firebase.google.com/docs/ios/setup) - Installation, configuration, initialization
- [Firebase GitHub Repository](https://github.com/firebase/firebase-ios-sdk) - Latest SDK versions, requirements (Xcode 16.2+, 40+ products)
- [Supabase Swift SDK Documentation](https://supabase.com/docs/guides/getting-started/quickstarts/ios-swiftui) - Installation, initialization, features
- [Supabase Swift GitHub](https://github.com/supabase/supabase-swift) - v2.41.0, iOS 13.0+ support, feature set
- [Swift.org SwiftUI Getting Started](https://www.swift.org/getting-started/swiftui/) - Official project setup steps

### Secondary (MEDIUM confidence)
- [How to Structure a SwiftUI Project in 2026 - DEV Community](https://dev.to/__be2942592/how-to-structure-a-swiftui-project-in-2026-41m8) - Feature-based structure, MVVM with @MainActor
- [SwiftUI + Firebase Complete Guide - Medium](https://medium.com/@authfy/getting-started-with-swiftui-and-firebase-a-complete-guide-e7c25b7cd9c4) - SwiftUI-specific Firebase setup
- [Advanced SwiftUI Navigation Patterns - Medium Dec 2025](https://medium.com/@chandra.welim/advanced-swiftui-navigation-patterns-production-ready-code-7886e7ae1937) - NavigationStack patterns
- [Firebase iOS Learn More](https://firebase.google.com/docs/ios/learn-more) - SwiftUI swizzling requirement
- [iOS Project Structure Best Practices - Medium](https://medium.com/@omarbasaleh2/best-project-structure-for-swiftui-ef03d68da642) - Folder organization
- [CocoaPods Dying: Migrate to SPM - Capgo](https://capgo.app/blog/ios-spm-vs-cocoapods-capacitor-migration-guide/) - CocoaPods Dec 2026 read-only announcement
- [Supabase vs Firebase 2026 Comparison](https://thesoftwarescout.com/supabase-vs-firebase-2026-which-backend-should-you-choose/) - Backend comparison
- [iOS Environment Configuration Best Practices - NSHipster](https://nshipster.com/secrets/) - API key management
- [Xcode Build Configurations - Sarunw](https://sarunw.com/posts/how-to-set-up-ios-environments/) - Development/production environments
- [iOS 16 Minimum Version Recommendation 2026 - ecoatm](https://blog.ecoatm.com/what-minimum-ios-version-do-most-apps-need-in-2026/) - Industry baseline

### Tertiary (LOW confidence - WebSearch only)
- Various Stack Overflow discussions on Firebase SwiftUI pitfalls (not individually verified)
- Community discussions on MVVM in SwiftUI (not authoritative source)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Firebase docs, GitHub repos, Apple developer documentation verify all claims
- Architecture: HIGH - Multiple authoritative sources agree on feature-based structure, MVVM pattern, NavigationStack usage for iOS 16+
- Pitfalls: HIGH - Verified via official Firebase documentation (swizzling, plist location) and official Apple docs (NavigationStack deprecation, iOS version requirements)
- Firebase vs Supabase recommendation: MEDIUM - Based on multiple comparison sources and official docs, but project-specific tradeoffs involved

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable domain, Firebase iOS SDK updates quarterly but patterns stable)

**Key assumptions:**
- User has Mac with Xcode 16.2+ installed
- Project will target iOS 16.0+ (required for VisionKit DataScannerViewController per user's phase 4 requirements)
- Backend choice is Firebase (recommended over Supabase for mobile-first project)
- Swift Package Manager available (Xcode built-in)
- User has or will create Firebase project (free tier available)
