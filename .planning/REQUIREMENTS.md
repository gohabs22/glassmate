# Requirements: Beer Glass App

**Defined:** 2026-04-12
**Core Value:** When a drinker scans a beer at a host's place, they instantly see the best available glass to use — the matching engine that connects beer style to host glassware is the ONE thing that must work.

## v2 Requirements

Requirements for public deployment. Each maps to roadmap phases.

### Source Control

- [ ] **REPO-01**: Codebase is pushed to a GitHub repository with remote origin configured
- [ ] **REPO-02**: Main branch has protection rules (require PR, no direct push)

### Deployment

- [ ] **DEPLOY-01**: Vercel project is connected to GitHub repo with automatic deploys on push to main
- [ ] **DEPLOY-02**: Preview deploys are generated for pull requests
- [ ] **DEPLOY-03**: App is accessible via a working public Vercel URL

### Firebase Production

- [ ] **FIRE-01**: Production Firebase credentials are configured as Vercel environment variables
- [ ] **FIRE-02**: Firebase Auth domain is configured for the production URL
- [ ] **FIRE-03**: Firestore security rules are deployed to the production Firebase project
- [ ] **FIRE-04**: Firestore backups or export schedule is configured

### Verification

- [ ] **VERIFY-01**: End-to-end flow works on public URL (signup, add glass, QR, check-in, match, history)

## Future Requirements (Deferred)

- Custom domain configuration
- CI/CD pipeline with automated tests
- Monitoring and alerting (uptime, error tracking)
- CDN and performance optimization
- Staging environment

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom domain | Start with Vercel URL, add later if needed |
| Native mobile apps | Web-first, native deferred |
| New app features | This milestone is deployment-only |
| Staging environment | Single environment sufficient for now |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REPO-01 | Phase 8 | Pending |
| REPO-02 | Phase 8 | Pending |
| DEPLOY-01 | Phase 9 | Pending |
| DEPLOY-02 | Phase 9 | Pending |
| DEPLOY-03 | Phase 9 | Pending |
| FIRE-01 | Phase 10 | Pending |
| FIRE-02 | Phase 10 | Pending |
| FIRE-03 | Phase 10 | Pending |
| FIRE-04 | Phase 10 | Pending |
| VERIFY-01 | Phase 10 | Pending |

**Coverage:**
- v2 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-04-12*
*Last updated: 2026-04-12 — traceability updated after v2.0 roadmap creation*
