# Phase 8: Source Control - Research

**Researched:** 2026-08-11
**Domain:** GitHub repository setup, `gh` CLI, branch protection (classic API)
**Confidence:** HIGH

## Summary

The mechanics of pushing this repo to GitHub and configuring `dev`/`main` branches are straightforward and fully scriptable with the `gh` CLI, which is already installed (v2.92.0) and authenticated as `gohabs22` with `repo` scope. The local repo has 89 commits on `main`, a clean `.gitignore` (secrets already excluded — `.env.local` has never been committed), and `.planning/` is already tracked and ready to push as-is.

**There is one blocking conflict that must be resolved before this phase can be planned as scoped:** GitHub does not offer classic branch protection rules (nor the newer rulesets) on **private** repositories for accounts on the **GitHub Free** plan — only on Pro/Team/Enterprise. The user's locked decisions require both "private repository" AND "require PR / block direct pushes to main." These two decisions are mutually exclusive on a Free-plan personal account. This account (`gohabs22`, created 2025-08-22) could not be confirmed as Free vs Pro during research (the current `gh` token lacks the `user` scope needed to read plan info), but Free is the default for new personal accounts and should be assumed until verified.

**Primary recommendation:** Before planning proceeds, verify the GitHub account's plan (`gh auth refresh -s user` then `gh api user --jq .plan.name`, or check https://github.com/settings/billing). If it's Free, the plan (pun intended) must either (a) upgrade to GitHub Pro (~$4/month, cheapest fix, satisfies all locked decisions as-is), or (b) the user must be asked to relax one of the two conflicting decisions. This is a decision for the user, not something to silently work around — flag it explicitly at the start of planning/execution rather than discovering it mid-execution when the protection API call 404s.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| REPO-01 | Codebase is pushed to a GitHub repository with remote origin configured | `gh repo create --source=. --push` creates repo + remote + pushes full history in one step (verified via `gh repo create --help`) |
| REPO-02 | Main branch has protection rules (require PR, no direct push) | Classic branch-protection REST API (`PUT /repos/{owner}/{repo}/branches/{branch}/protection`) supports exactly the locked ruleset, but is GATED to private repos on paid plans — see Critical Finding below |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Repository setup**
- Private repository on GitHub
- Repo name: `glassmate`
- Add description and topics (e.g. "Beer-to-glass matching app", tags: nextjs, firebase, typescript)
- Default branch stays `main`

**Branch protection rules**
- Require pull requests to merge to main (no direct pushes)
- 0 required reviewers — can merge own PRs
- No admin bypass — even the owner must use a PR
- No required status checks for now (no CI yet)
- Block force pushes to main

**Repo hygiene**
- Push `.planning/` directory to GitHub (project history visible in repo)
- Add a basic README with project name, one-line description, and setup instructions
- Current `.gitignore` is sufficient (covers node_modules, .next, .env files)
- No LICENSE file — private repo

**Collaboration model**
- Solo project — no collaborators to add
- Two-branch model: `dev` branch for active work, `main` for milestone releases
- Direct pushes to `dev` are fine — protection only on `main`
- `dev` merges to `main` via PR at end of each milestone

### Claude's Discretion
- Merge strategy for dev-to-main PRs (merge commit vs squash)
- README content and formatting
- Repo description and topic choices
- Any additional .gitignore entries if discovered during setup

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

## Critical Finding: Private Repo + Branch Protection Requires a Paid Plan

**Confidence: HIGH** (verified directly against current GitHub docs, cross-checked with GitHub Community discussions from 2025-2026)

GitHub's own documentation states plainly:

> "Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in **public and private** repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server."

This applies to **both** the classic branch-protection-rules API and the newer repository-rulesets feature — neither is available for private repos on the Free tier. There is no workaround via a personal Free org either (same restriction applies to "GitHub Free for organizations").

**What this means concretely for this phase:**
- If the account is on GitHub Free: creating `glassmate` as private and then calling the branch-protection API will fail (403/404) — REPO-02 cannot be satisfied as written.
- If the account is on GitHub Pro (or higher): everything in the locked decisions works exactly as specified, no changes needed.

**Verification needed before/during planning:**
```bash
gh auth refresh -h github.com -s user   # requires interactive re-auth, asks user first
gh api user --jq '.plan.name'
```
Note: refreshing auth scope is an account-permission change — ask the user before running it, or have them check https://github.com/settings/billing directly and report back.

**Recommended resolution path (in priority order):**
1. **Confirm plan first.** If already Pro/Team, no conflict — proceed as locked.
2. **If Free: upgrade to GitHub Pro.** Cheapest fix (~$4/month as of this research), satisfies every locked decision unmodified. This is a purchase decision — must be confirmed with the user, not assumed.
3. **If user won't upgrade:** the phase must renegotiate either "private" or "protection" — e.g., temporarily public repo (loses privacy), or documented-but-unenforced convention (fails success criterion #2 "pushing directly to main is blocked" since nothing GitHub-side would actually block it). Neither satisfies the phase goal as scoped; this should go back through `/gsd:discuss-phase` if it comes to this.

This finding should be surfaced to the user at the start of plan-phase or execute-phase — don't silently substitute a workaround.

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|---------------|
| `gh` (GitHub CLI) | 2.92.0 (installed) | Repo creation, push, branch protection, PR creation — all from one authenticated tool | Already installed & authenticated as `gohabs22` with `repo`, `workflow`, `read:org`, `gist` scopes; avoids manual token/web-UI steps |
| `git` | (system) | Local commit/branch/push operations | Already in use, 89 commits on `main` |

No new npm packages are needed for this phase — it's entirely git/GitHub tooling, not application code.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `gh` CLI for branch protection | GitHub web UI (Settings → Branches) | Web UI works identically but isn't scriptable/repeatable; `gh api` is preferred for a documented, reproducible plan step |
| Classic branch protection API | Repository Rulesets API | Rulesets are the newer/recommended GitHub mechanism long-term, but have the *same* Free-plan private-repo restriction, and `gh` CLI has no `gh ruleset create` (only `list`/`view`/`check`) — would require raw `gh api` POST to `/repos/{owner}/{repo}/rulesets` with a larger, more complex JSON payload for no functional benefit here. Classic branch protection API is simpler and sufficient for this phase's requirements (PR required, 0 reviewers, no admin bypass, no status checks, no force push). |

**No installation needed** — `gh` is already present and authenticated.

## Architecture / Workflow Patterns

### Recommended Command Sequence

**1. Handle uncommitted state first**
Local repo currently has one modified-but-uncommitted file (`.planning/config.json` per git status). This should be committed (or stashed) before creating/pushing the repo — the plan should account for this, not assume a clean tree.

**2. Create the GitHub repo from the existing local repo, and push in one step**
```bash
gh repo create glassmate \
  --private \
  --description "Beer-to-glass matching app" \
  --source=. \
  --remote=origin \
  --push
```
Source: `gh repo create --help` (fetched this session) — `--source` uses the current directory as the new repo's content, `--remote` names the local remote, `--push` pushes local commits (the current branch, `main`, with full history) in the same invocation. This single command satisfies REPO-01 (remote origin configured, full history pushed).

**3. Add topics** (not settable via `gh repo create`, needs a follow-up `gh repo edit`)
```bash
gh repo edit gohabs22/glassmate \
  --add-topic nextjs \
  --add-topic firebase \
  --add-topic typescript
```

**4. Create the `dev` branch and push it**
```bash
git checkout -b dev
git push -u origin dev
```
Default branch on GitHub stays `main` (per locked decision) — creating/pushing `dev` doesn't change that; GitHub's default branch is a separate repo setting (`gh repo edit --default-branch main`, but `main` is already default from repo creation since `--source=.` picks up the local repo's current branch as GitHub's default).

**5. Configure branch protection on `main`** (assuming plan supports private-repo protection — see Critical Finding)
```bash
gh api \
  --method PUT \
  repos/gohabs22/glassmate/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='null' \
  -F enforce_admins=true \
  -F required_pull_request_reviews[required_approving_review_count]=0 \
  -F required_pull_request_reviews[dismiss_stale_reviews]=false \
  -F required_pull_request_reviews[require_code_owner_reviews]=false \
  -f restrictions='null' \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```
Simpler and less error-prone as a JSON file passed via `--input`:
```json
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```
```bash
gh api --method PUT repos/gohabs22/glassmate/branches/main/protection --input protection.json
```

**Field-to-decision mapping (verified against GitHub REST API docs, fetched this session):**
| Locked decision | API field | Value |
|---|---|---|
| Require PR to merge (no direct pushes) | presence of `required_pull_request_reviews` object | non-null |
| 0 required reviewers | `required_pull_request_reviews.required_approving_review_count` | `0` (API explicitly documents 0 as a valid value: "0 to not require reviewers") |
| No admin bypass | `enforce_admins` | `true` |
| No required status checks | `required_status_checks` | `null` |
| Block force pushes | `allow_force_pushes` | `false` (also the API default) |

**6. Verify protection took effect**
```bash
gh api repos/gohabs22/glassmate/branches/main/protection --jq '.required_pull_request_reviews, .enforce_admins, .allow_force_pushes'
```
And functionally: attempt a direct push to `main` from local and confirm it's rejected — this is the strongest verification of success criterion #2.

**7. README**
Replace the current `create-next-app` boilerplate README (currently generic Next.js scaffold text, `package.json` name is still `temp-scaffold`) with project name, one-line description, and setup instructions per locked decision. Consider also fixing `package.json`'s `"name": "temp-scaffold"` to `"glassmate"` while touching repo metadata — flagged as a discretionary hygiene item, not a hard requirement.

### Merge Strategy Recommendation (Claude's Discretion)
**Recommend: merge commit (not squash)** for `dev` → `main` PRs. Reasoning: the user's own decision explicitly values "project history visible in repo" (that's why `.planning/` is pushed at all) — squashing would collapse the granular commit history from `dev` into a single commit on `main`, working against that stated value. A merge commit preserves every intermediate commit while still marking the milestone boundary clearly via the merge commit itself.
```bash
gh repo edit gohabs22/glassmate --enable-merge-commit=true --enable-squash-merge=false --enable-rebase-merge=false
```
(Optional — enforces the single strategy at the repo-settings level rather than relying on remembering to pick the right button each time.)

### Anti-Patterns to Avoid
- **Creating the GitHub repo with `--add-readme` or `--gitignore`:** Would create a remote repo with its own initial commit (README/gitignore) diverging from local history before push — since local already has a full commit history and its own README, don't pass these flags; use `--source=.` instead so local content becomes the initial state.
- **Setting `required_pull_request_reviews` to `null` while still wanting "require PR":** `null` for that field actually *disables* the PR-required behavior entirely (falls back to allowing direct pushes, gated only by other restrictions). The object must be present (even with `required_approving_review_count: 0`) to enforce PR-only merging.
- **Assuming rulesets are a free upgrade path around the Free-plan limitation:** They are not — same plan gating applies (see Critical Finding).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Blocking direct pushes to main | Local pre-push git hook | GitHub server-side branch protection | A local hook only applies on the machine it's installed on and is trivially bypassed (different clone, `--no-verify`, GitHub web UI edits). Server-side protection is enforced regardless of client. |
| Repo + remote setup | Manual `git remote add` after creating repo via web UI | `gh repo create --source=. --push` | One command, scriptable, reproducible, avoids the multi-step manual dance and possible mistakes (wrong remote URL, forgetting `-u` on push, etc.) |

## Common Pitfalls

### Pitfall 1: Branch protection API silently unavailable on private + Free plan
**What goes wrong:** The `PUT .../protection` call returns an error (typically 403 "Upgrade to GitHub Pro or make this repository public to enable this feature" or similar), and if the plan doesn't account for this, execution stalls mid-phase.
**Why it happens:** Private-repo branch protection is a paid-plan-only GitHub feature (see Critical Finding).
**How to avoid:** Verify the account's plan *before* writing the phase plan, not during execution. Make plan-verification a Task 0 / prerequisite step.
**Warning signs:** Any 403/404 response from the branch-protection endpoint mentioning "upgrade" or "private repositories."

### Pitfall 2: Uncommitted changes at push time
**What goes wrong:** `.planning/config.json` currently shows as modified-but-uncommitted in `git status`. If `gh repo create --source=. --push` runs against a dirty tree, the push only sends committed history — the uncommitted change is silently left behind and not reflected on GitHub, potentially confusing later.
**How to avoid:** Have the plan explicitly commit (or discard) all pending changes before the create/push step.

### Pitfall 3: `gh repo create` picks up the *current local branch* as the initial pushed branch
**What goes wrong:** If a plan step accidentally creates the `dev` branch and checks it out *before* running `gh repo create --push`, `dev` (not `main`) would become the first/default branch pushed to GitHub, conflicting with the locked "default branch stays main" decision.
**How to avoid:** Order matters — run `gh repo create --source=. --push` while still on `main`, and only create/push `dev` afterward as a separate step.

### Pitfall 4: `package.json` still says `"name": "temp-scaffold"`
**What goes wrong:** Not a functional bug, but inconsistent with the "glassmate" branding decision — worth a one-line fix while touching repo metadata in this phase (discretionary, not a hard requirement, but cheap to include).

## Code Examples

### Full one-shot repo creation + push (verified command reference from `gh repo create --help`, this session)
```bash
gh repo create glassmate --private --description "Beer-to-glass matching app" --source=. --remote=origin --push
```

### Branch protection payload (verified field semantics from GitHub REST API docs, this session)
```json
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

### Functional verification of "direct push blocked"
```bash
git checkout main
echo "test" >> README.md
git commit -am "test: verify protection"
git push origin main   # should be REJECTED if protection is correctly configured
git reset --hard HEAD~1   # clean up local test commit
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Classic branch protection rules (per-branch) | Repository Rulesets (pattern-based, more flexible, layered) | Rulesets GA'd ~2023-2024 | For this phase's simple single-branch needs, classic protection is still fully supported, simpler to configure via `gh api`, and has no functional disadvantage here. Rulesets would be the better choice if protecting multiple branch patterns or wanting bypass lists with finer-grained actor targeting — not needed for this phase. |

**Not deprecated:** the classic branch-protection REST API remains fully supported and is not scheduled for removal; GitHub docs present rulesets as an addition/evolution, not a replacement.

## Open Questions

1. **What GitHub plan is `gohabs22`'s account on?**
   - What we know: Account created 2025-08-22, currently `gh api user` doesn't expose `.plan` (token lacks `user` scope). Free is GitHub's default for new personal accounts.
   - What's unclear: Whether the user has since upgraded to Pro/Team, or intends to for this phase.
   - Recommendation: Ask the user directly at the start of planning/execution, or have them check https://github.com/settings/billing. Do not proceed with assuming branch protection will succeed on a private repo without this confirmation — build a verification/decision step into the plan itself.

2. **Is upgrading to GitHub Pro in scope for this phase if the account turns out to be Free?**
   - What we know: It's the simplest fix (~$4/month) and satisfies every locked decision without modification.
   - What's unclear: Whether the user is willing to pay for this, or would rather revisit the private/protection decision.
   - Recommendation: Surface as an explicit choice point in the plan rather than assuming either path.

## Sources

### Primary (HIGH confidence)
- `gh repo create --help`, `gh repo edit --help`, `gh api --help`, `gh ruleset --help` — fetched directly from installed `gh` v2.92.0 this session
- https://docs.github.com/en/rest/branches/branch-protection — fetched this session, confirms `required_approving_review_count` accepts 0, confirms private-repo Free-plan restriction verbatim
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets — fetched this session, confirms rulesets require GitHub Team/Enterprise
- Local repo inspection: `git status`, `git ls-files`, `git log`, `.gitignore` contents, `gh auth status`, `gh api user` — all run directly this session

### Secondary (MEDIUM confidence)
- WebSearch cross-verification of Free-plan private-repo branch protection restriction against multiple GitHub Community Discussion threads (#174400, #198686, #190190) — all corroborate the docs.github.com finding independently

### Tertiary (LOW confidence)
None — the one load-bearing claim (Free plan + private repo = no branch protection) was verified against official docs directly, not just search snippets.

## Metadata

**Confidence breakdown:**
- Standard stack (gh CLI usage): HIGH — commands verified against installed CLI's own `--help` output this session
- Architecture/command sequence: HIGH — each step verified against official `gh`/GitHub API docs
- Critical finding (plan gating): HIGH — verified against current official docs fetched this session, cross-checked with multiple independent community sources, but the *account's actual plan* itself is an unverified open question (LOW confidence on that one sub-fact only)
- Pitfalls: HIGH — derived directly from repo inspection (uncommitted file, package.json name, branch ordering) plus documented API semantics

**Research date:** 2026-08-11
**Valid until:** GitHub plan/pricing details should be re-checked if this research is used more than ~30 days later; the `gh` CLI command syntax is stable and long-lived.
