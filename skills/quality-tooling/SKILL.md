---
name: quality-tooling
description: The project's deterministic quality checkers under tools/quality/ — detect.mjs (craft-floor CSS/HTML linter), project-state.mjs (project-state probe), km-check.mjs (KM verifier), guard-hook.mjs (publish-correctness PreToolUse guard), css-no-producer.mjs (dead block-CSS selectors), publish-readiness.mjs (pre-publish preconditions), content-fidelity.mjs (GATE-1 content-loss). Use when verifying a style/CSS change, an import, publish-readiness, guarding regressions on frozen pages, starting a session, or whenever you'd otherwise eyeball rules or guess state. These enforce The Executable-Rule Rule: run the checker, don't rely on memory.
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

## `tools/quality/content-fidelity.mjs` — GATE-1 content-loss detector
Deterministic replacement for the eyeballed `diff -u` (`importer-diff-workflow`): compares a reference page vs a candidate on **content** (visible-text units, headings, images, block counts), **not** DOM identity — it normalizes DA media hashes and ignores the blockified tag tree, so a faithful re-import with a different tag tree passes while dropped/duplicated content fails.

```bash
node tools/quality/content-fidelity.mjs <reference.html> <candidate.html>
```
- **Exit 2:** names each `LOST` (in reference, missing from candidate) and `EXTRA` (duplicated/injected) text/heading/image/block unit. **Exit 0:** no loss/dup.
- Best used reference `.plain.html` (served truth) vs candidate `.plain.html` (re-import) — both chrome-stripped. Block-class list derived live from `blocks/`. Uses `jsdom` (devDependency).

## `tools/quality/publish-readiness.mjs` — pre-publish precondition gate
Verifies EDS publish preconditions BEFORE the user publishes, so a gap surfaces here (with the fix) instead of at the Publish click with a misleading error. Reads live (git remote + `project.json` + `fstab.yaml` + `head.html` + content links); no network by default.

```bash
node tools/quality/publish-readiness.mjs          # offline file checks
node tools/quality/publish-readiness.mjs --probe   # + advisory live 404-signature hint
node tools/quality/publish-readiness.mjs --json
```
- **ERROR (exit 2):** a `/content/…` path in `head.html` nav/footer meta or any content link (404s at the EDS root); `fstab.yaml` missing or an unrecognized mountpoint (not DA `content.da.live/<org>/<site>/` nor UE `…/franklin.delivery/<org>/<repo>/main`); empty/unresolved `previewOrg`/`previewSite`.
- **Keeps the two failure modes UN-conflated:** empty preview org/site = *client settings / site not connected* (re-select + reload — **NOT** fstab); missing fstab = *content-bus / Code Sync*. See `debug-eds-publish`.
- **Pristine boilerplate** (no project.json/fstab/content) → exits 0 with a "not yet connected" note. Run it as the **publish-ready gate** (`validation-gates` / `eds-migration-process`) before any "publish via Console" handoff.

## `tools/quality/css-no-producer.mjs` — dead block-CSS selector detector
Flags block CSS class selectors that **nothing produces**. EDS insight: the DA pipeline strips authored classes, so a block-part class (`<block>-<part>`) can only come from the block JS or the framework — a `<block>-*` selector the JS never emits is a **provably dead rule** (renders unstyled — the `footer.css` `.footer-cta`/`.footer-columns` saga). Detectable locally, no publish.

```bash
node tools/quality/css-no-producer.mjs <blocks-or-css...>   # human table
node tools/quality/css-no-producer.mjs --all                # scan blocks/
node tools/quality/css-no-producer.mjs --all --json          # machine output
```
- **ERROR (exit 2):** a `<block>-*` selector the block JS never produces (the strong dead-selector signal). **WARN:** any other untraced class (could be an authored variant / framework class) — never fails.
- "Produced" = class literal present in `<block>.js` or `scripts/scripts.js`, equals the block name, a standard EDS class, or every hyphen-segment (≥3 chars) appears in the JS (covers `nav-${c}`-style dynamic classes). Conservative — favours false-negatives.
- Runs as a **PostToolUse hook** (`--hook`) on block-CSS edits, surfacing findings as advisory feedback. Also a GATE-2 pre-check (`validation-gates`).

## `tools/quality/guard-hook.mjs` — publish-correctness PreToolUse guard
Enforces the **mechanically-decidable subset** of the AGENTS.md `NEVER (publish-correctness)` list as an always-on hook (wired in committed `.claude/settings.json`, matcher `Edit|MultiEdit|Write|Bash`). The AGENTS.md list is the primary *preventive* layer; this hook is the *after-the-fact* net for the cases most vital the agent never do.

- **Blocks (exit 2, reason to the agent):** editing `scripts/aem.js`/`lib-franklin.js`; writing `content/*.plain.html` directly (**except** `content/styleguide/` — net-new authored reference pages, `styleguide-generator`); a `/content/…` value in a `head.html` nav/footer meta; any `git` command; an `aem`/`hlx … publish`.
- **Fails OPEN** on bad/empty stdin or parse error — a buggy guard must never brick the agent (the AGENTS.md list still covers it).
- **Judgment DON'Ts are NOT here** (nested-div modeling, JS reconstruction, wrapper-naming) — un-decidable without false positives; they live in the AGENTS.md list only.
- Test a decision: `echo '{"tool_name":"Edit","tool_input":{"file_path":"scripts/aem.js"}}' | node tools/quality/guard-hook.mjs; echo $?` → `2`.

## The loop
1. **Session start / before a styling task:** `project-state.mjs` → know what's frozen and what changed.
2. **After a CSS/style edit, before claiming done:** `detect.mjs <changed files>` → exit 0 or every finding triaged. Cross-check changed files against `frozen` — a frozen file in the changed set is a red flag unless the change was explicitly authorized.
3. Pipe them: `project-state.mjs --scan` hands you the exact `detect.mjs` line for the current working-tree scope.

## Pitfalls
- Treating a `detect.mjs` warning as a mandate to edit — on a frozen page, fix the allow-list or accept it; don't shift the frozen page.
- Forgetting the allow-list is live — a legitimately-added brand color goes in `PROJECT-DESIGN.md`/tokens and the off-palette warning clears itself.
- Relying on the prose `craft-floor` rule when an `[auto]` checker exists — run the checker; it catches what the eye skips under load.
- Adding a new mechanically-checkable craft rule to `craft-floor` without a matcher — add one to `tools/quality/rules.mjs` and note it here (an ID with no matcher is fine, just marks it ready).

See also: `craft-floor` (the rules these enforce, with IDs), `verify-before-claiming` (runs detect before "done"), `regression-guard` (runs detect on shared-CSS consumers), `styling-additively` (checks `frozen` before touching a shared tool), `session-startup` (runs project-state at session start), `curating-project-knowledge` (the KM discipline `km-check.mjs` enforces), `writing-skills` (The Executable-Rule Rule)
