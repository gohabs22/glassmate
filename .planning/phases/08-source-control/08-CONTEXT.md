# Phase 8: Source Control - Context

**Gathered:** 2026-08-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Push the existing codebase to GitHub and configure branch protection so direct pushes to main are blocked. This phase covers repo creation, initial push, branch setup, and protection rules. Deployment (Vercel) and Firebase production config are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Repository setup
- Private repository on GitHub
- Repo name: `glassmate`
- Add description and topics (e.g. "Beer-to-glass matching app", tags: nextjs, firebase, typescript)
- Default branch stays `main`

### Branch protection rules
- Require pull requests to merge to main (no direct pushes)
- 0 required reviewers — can merge own PRs
- No admin bypass — even the owner must use a PR
- No required status checks for now (no CI yet)
- Block force pushes to main

### Repo hygiene
- Push `.planning/` directory to GitHub (project history visible in repo)
- Add a basic README with project name, one-line description, and setup instructions
- Current `.gitignore` is sufficient (covers node_modules, .next, .env files)
- No LICENSE file — private repo

### Collaboration model
- Solo project — no collaborators to add
- Two-branch model: `dev` branch for active work, `main` for milestone releases
- Direct pushes to `dev` are fine — protection only on `main`
- `dev` merges to `main` via PR at end of each milestone

### Claude's Discretion
- Merge strategy for dev-to-main PRs (merge commit vs squash)
- README content and formatting
- Repo description and topic choices
- Any additional .gitignore entries if discovered during setup

</decisions>

<specifics>
## Specific Ideas

- Repo named "glassmate" — product-style name, not directory name
- Two-branch workflow mirrors the milestone-based development pattern already in use

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-source-control*
*Context gathered: 2026-08-11*
