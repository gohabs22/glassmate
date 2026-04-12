# Roadmap: Beer Glass App

## Milestones

- ✅ **v1.0 MVP** — Phases 1-7 (shipped 2026-03-15)
- 🚧 **v2.0 Deployment** — Phases 8-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-7) — SHIPPED 2026-03-15</summary>

- [x] Phase 1: Project Setup (2/2 plans) — completed 2026-02-06
- [x] Phase 2: Role Selection & Authentication (3/3 plans) — completed 2026-02-07
- [x] Phase 3: Glass Collection Management (3/3 plans) — completed 2026-02-07
- [x] Phase 4: QR Check-in Flow (3/3 plans) — completed 2026-02-08
- [x] Phase 5: Beer Lookup (3/3 plans) — completed 2026-02-18
- [x] Phase 6: Matching & Recommendations (3/3 plans) — completed 2026-03-15
- [x] Phase 7: Audit Gap Fixes (1/1 plan) — completed 2026-03-15

Full details: .planning/milestones/v1.0-ROADMAP.md

</details>

### 🚧 v2.0 Deployment (In Progress)

**Milestone Goal:** Make the Beer Glass App publicly accessible via GitHub, Vercel, and production Firebase.

- [ ] **Phase 8: Source Control** - Codebase on GitHub with branch protection
- [ ] **Phase 9: Deployment Pipeline** - Vercel connected to GitHub with auto-deploys and public URL
- [ ] **Phase 10: Firebase Production + Verification** - Production credentials wired, security rules deployed, end-to-end confirmed

## Phase Details

### Phase 8: Source Control
**Goal**: The codebase lives on GitHub with guardrails that prevent accidental direct pushes to main
**Depends on**: Nothing (first phase of v2.0)
**Requirements**: REPO-01, REPO-02
**Success Criteria** (what must be TRUE):
  1. Codebase is accessible at a remote GitHub URL with full commit history
  2. Pushing directly to main is blocked — changes must go through a pull request
  3. The local repo has a remote origin configured and `git push` targets GitHub
**Plans**: TBD

Plans:
- [ ] 08-01: Push codebase to GitHub and configure branch protection

### Phase 9: Deployment Pipeline
**Goal**: Every push to main automatically deploys to a live public URL, and every pull request gets a preview deploy
**Depends on**: Phase 8
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Merging a PR to main triggers a new Vercel production deployment without manual steps
  2. Opening a pull request generates a unique preview URL for that branch
  3. A public Vercel URL loads the app (even if Firebase isn't wired yet)
**Plans**: TBD

Plans:
- [ ] 09-01: Create Vercel project, connect to GitHub, confirm public URL and auto-deploy

### Phase 10: Firebase Production + Verification
**Goal**: The production app is fully wired to Firebase with correct credentials, security rules, and a backup schedule — and the complete user flow works end-to-end on the public URL
**Depends on**: Phase 9
**Requirements**: FIRE-01, FIRE-02, FIRE-03, FIRE-04, VERIFY-01
**Success Criteria** (what must be TRUE):
  1. A new user can sign up on the public Vercel URL and their account is created in production Firebase Auth
  2. A host can add glasses, generate a QR code, and the QR URL resolves on the live site
  3. A drinker scanning the QR can search for a beer and receive a glass recommendation on the public URL
  4. Firestore rejects unauthorized reads/writes (security rules enforced in production)
  5. A Firestore backup or export schedule is configured and confirmed active
**Plans**: TBD

Plans:
- [ ] 10-01: Configure production Firebase credentials as Vercel env vars, set Auth domain, deploy Firestore security rules
- [ ] 10-02: Configure Firestore backup schedule, run full end-to-end verification on public URL

## Progress

**Execution Order:**
Phases execute in numeric order: 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Setup | v1.0 | 2/2 | Complete | 2026-02-06 |
| 2. Role Selection & Authentication | v1.0 | 3/3 | Complete | 2026-02-07 |
| 3. Glass Collection Management | v1.0 | 3/3 | Complete | 2026-02-07 |
| 4. QR Check-in Flow | v1.0 | 3/3 | Complete | 2026-02-08 |
| 5. Beer Lookup | v1.0 | 3/3 | Complete | 2026-02-18 |
| 6. Matching & Recommendations | v1.0 | 3/3 | Complete | 2026-03-15 |
| 7. Audit Gap Fixes | v1.0 | 1/1 | Complete | 2026-03-15 |
| 8. Source Control | v2.0 | 0/1 | Not started | - |
| 9. Deployment Pipeline | v2.0 | 0/1 | Not started | - |
| 10. Firebase Production + Verification | v2.0 | 0/2 | Not started | - |
