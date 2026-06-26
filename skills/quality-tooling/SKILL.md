---
name: quality-tooling
description: The project's deterministic quality checkers under tools/quality/ — detect.mjs (craft-floor CSS/HTML linter) and project-state.mjs (structured project-state probe). Use when verifying a style/CSS change, guarding against regressions on frozen pages, starting a session, or whenever you'd otherwise eyeball craft rules or guess project state. These enforce The Executable-Rule Rule: run the checker, don't rely on memory.
---

Two Node scripts (ESM, no deps, no network) turn our prose rules into **executable** checks and our project state into **structured** facts (**The Executable-Rule Rule**, AGENTS.md). Run them instead of remembering rules or parsing prose.

## `tools/quality/detect.mjs` — craft-floor linter
Flags `craft-floor` violations keyed to its `rule:craft-*` IDs. The allow-list (palette, radius scale, tokens) is loaded LIVE from `PROJECT-DESIGN.md` + `styles/*.css` `:root` — never hardcoded, so it always reflects the current design system.

```bash
node tools/quality/detect.mjs <files...>          # human table
node tools/quality/detect.mjs <files...> --json    # machine output
node tools/quality/detect.mjs --all                 # scan styles/ + blocks/
```
- **Exit codes:** `0` clean · `2` findings · `1` usage error.
- **Covers (the `[auto]` rules in `craft-floor` — full definitions there):**

  | Rule ID | What it flags |
  |---------|---------------|
  | `craft-color-raw-inverse` | Literal `#fff` used as text color — use `--color-inverse` |
  | `craft-color-off-palette` | Color not in the DESIGN.md/token set (±6/channel; structural near-grays skipped) |
  | `craft-color-side-stripe` | `border-left`/`border-right` ≥2px solid in a brand color |
  | `craft-color-token-dup` | Token defined in >1 base `:root` block |
  | `craft-radius-raw` | `border-radius` literal that equals an existing `--radius-*` token value |
  | `craft-token-literal` | Single-value size/space/gap literal that equals a fixed token value |
  | `craft-token-near` | Single-value literal within ~6% of a fixed token (same category) |
  | `craft-token-unused` | Token defined but never consumed via `var()` — `--all` only |
  | `craft-breakpoint-stray` | `@media` width not in the foundation's sanctioned breakpoint set |
  | `craft-motion-reduced` | Animation with no `prefers-reduced-motion` guard |
  | `craft-cruft-placeholder` | `lorem` / `TODO` / `FIXME` in shipped CSS/content |

  Full threshold definitions and context for each rule live in `craft-floor`.
- **JSON shape:** `[{ file, line, ruleId, name, severity, snippet, detail }]`.
- **Triage, don't blindly fix:** a finding on a FROZEN page is either a real issue or an allow-list gap — never force a change onto a frozen page (`styling-additively`, `regression-guard`). Block-level warnings on non-foundation CSS are the known backlog (F06/F07 deferred), not regressions.

## `tools/quality/project-state.mjs` — project-state probe
Emits ground-truth JSON so you route on facts, not by reading prose status.

```bash
node tools/quality/project-state.mjs            # JSON
node tools/quality/project-state.mjs --scan      # JSON + the ready detect.mjs command for scanTargets
```
- **Fields:** `pages[]` (name, file, contentValidated, styleValidated, **frozen**), `frozen[]` (frozen content paths), `contentFiles[]`, `changedFiles[]` (read-only `git status --porcelain`), `tokenFiles[]`, `scanTargets[]` + `scanVia` (changed CSS first, else all foundation+blocks).
- `frozen` is derived from style-validated ✅ in the PROJECT-STATUS Pages table — it is the authoritative "do not touch" list for the **Frozen-Tools Rule**.
- Read-only: never runs mutating git.

## `tools/quality/km-check.mjs` — knowledge-management verifier
Dog-foods the Executable-Rule Rule for the KM stores (`curating-project-knowledge`). Run at session-close / pre-commit.

```bash
node tools/quality/km-check.mjs            # human table
node tools/quality/km-check.mjs --json      # machine output
```
- **Errors (exit 2):** a generic skill containing an unambiguous project literal (brand palette color, concrete `content/*.plain.html` path, repo owner/slug) → should be `project-`; `users/.current-user` tracked by git; a `users/<login>/` missing `ROLE.md`.
- **Warnings (advisory, never fail):** a generic skill that names the site domain or an actual project block; numbered steps sitting in a declarative store (`context.md`/`PROJECT-CONTEXT.md`) → likely a procedure → skill; store bloat past the line threshold.
- Exit non-zero only on errors. Read-only (uses `git ls-files`).

## The loop
1. **Session start / before a styling task:** `project-state.mjs` → know what's frozen and what changed.
2. **After a CSS/style edit, before claiming done:** `detect.mjs <changed files>` → exit 0 or every finding triaged. Cross-check changed files against `frozen` — a frozen file in the changed set is a red flag unless the change was explicitly authorized.
3. Pipe them: `project-state.mjs --scan` hands you the exact `detect.mjs` line for the current working-tree scope.

## Pitfalls
- Treating a `detect.mjs` warning as a mandate to edit — on a frozen page, fix the allow-list or accept it; don't shift the frozen page.
- Forgetting the allow-list is live — if you legitimately add a brand color, put it in `PROJECT-DESIGN.md`/tokens and the off-palette warning clears itself.
- Relying on the prose `craft-floor` rule when an `[auto]` checker exists — run the checker; it catches what the eye skips under load.
- Adding a new craft rule to `craft-floor` without a matcher — that's fine (the ID marks it ready), but if it's mechanically checkable, add a matcher to `tools/quality/rules.mjs` and note it here.

See also: `craft-floor` (the rules these enforce, with IDs), `verify-before-claiming` (runs detect before "done"), `regression-guard` (runs detect on shared-CSS consumers), `styling-additively` (checks `frozen` before touching a shared tool), `session-startup` (runs project-state at session start), `curating-project-knowledge` (the KM discipline `km-check.mjs` enforces), `writing-skills` (The Executable-Rule Rule)
