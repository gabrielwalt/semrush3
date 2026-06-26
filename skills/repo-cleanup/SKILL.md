---
name: repo-cleanup
description: How to run a complete, safe cleanup of an EDS migration project — remove dead blocks/CSS/JS/assets, refactor divergent blocks toward existing ones, and bring all project docs current, WITHOUT moving any style-validated page. Use when the user says "clean up the project", "remove unused blocks/CSS/JS", "tidy the repo", "simplify", or after a scope change that leaves orphans.
---

A cleanup deletes shared code (blocks, CSS, JS, assets). The danger is silently breaking a **style-validated** page. So the whole job is bracketed by one rule:

**The Cleanup-Safety Gate (must enforce).** Before deleting anything, capture a render baseline of every validated page. After every pass, re-render and **diff vs baseline — they must be byte-identical.** A diff = you removed something load-bearing; revert and narrow. This operationalizes **The Frozen-Tools Rule** (AGENTS.md). Never skip the baseline.

```bash
# Baseline the validated pages (adjust paths to the project's validated set + dev server)
mkdir -p /tmp/cleanup-baseline
for p in "" "content/about" "content/products/"; do
  n=$(echo "$p" | tr '/' '_'); [ -z "$n" ] && n=index
  curl -sS "http://localhost:3000/$p" -o "/tmp/cleanup-baseline/$n.html"
done
# After each pass, re-fetch into /tmp/cleanup-after and: diff -q baseline/$n.html after/$n.html
```

## Before you start
1. Read `PROJECT-STATUS.md` → which pages are **style-validated** (frozen) vs not. Only frozen pages gate deletions; non-validated pages are fair game to refactor.
2. Capture the baseline (above).
3. "Unused in content" ≠ "safe to delete" — EDS **infrastructure** (`header`, `footer`, `fragment`) and intentional **backward-compat redirects** never appear as content classes. Confirm a thing's purpose before removing it; check `PROJECT-BLOCKS.md` for "deliberate" notes.

## The cleanup passes (run in this order; verify after each)
Order matters: docs first (so you're working from truth), then content-driven removals, then code, then assets. Each pass is independently verifiable.

| # | Pass | What to do | How to find it |
|---|------|------------|----------------|
| 1 | **Docs current** | Make every `PROJECT-*.md`, `skills/README.md`, `AGENTS.md` match reality (block inventory, tokens, import scripts, page table, plan tasks). Stale tasks for deleted pages → remove. | Grep docs for names of things you'll touch; reconcile after. |
| 2 | **Guideline conformance** | Every block/section follows `eds-code-conventions`, or is explicitly marked an exception with a one-line why. Flag `!important` on non-wrappers, hardcoded values that should be tokens, SVGs run through `createOptimizedPicture`. | `eds-code-conventions`; grep for smells. |
| 3 | **Unused blocks** | Remove block dirs used in **0** content files AND not infra/redirect. Their CSS/JS go with them. | count `class="<block>"` across `content/**/*.plain.html`. |
| 4 | **Block consolidation** (non-validated pages only) | On pages whose content isn't validated yet, refactor divergent/near-duplicate blocks to an **existing** block — add a variant only if it must stay uniquely identifiable (`eds-content-modeling`). Don't touch validated pages' blocks. | Compare block inventory; look for blocks doing the same job. |
| 5 | **Unused CSS** | Remove selectors/rules targeting blocks, variants, section-styles, or template classes that no content uses. Remove design tokens (`--x`) referenced nowhere. | grep each token/selector across `styles/`, `blocks/`, `content/`. |
| 6 | **Unused / simplifiable JS** | Remove functions/exports never called/imported. Simplify dead branches, redundant guards, duplicated logic (extract a shared helper). **Never** flag EDS lifecycle hooks (`loadEager`/`loadLazy`/`decorateMain`/block `decorate`) as unused — the framework calls them. | grep each function name repo-wide. |
| 7 | **Orphaned import infra** | Remove parsers, `urls-*.txt`, `.bundle.js`, and `tools/importer/parsers/*` that served only deleted pages. Keep shared helpers. | which importers serve a surviving page? the rest are orphans. |
| 8 | **Orphaned assets** | Remove `/svg/`, `/icons/`, media referenced by no surviving content or CSS. | grep each filename across `content/` + `styles/` + `blocks/`. |
| 9 | **Lint + final diff** | `npx eslint` + `npx stylelint` clean. Re-diff ALL validated pages vs baseline — byte-identical. | the Cleanup-Safety Gate. |

## Further EDS/EMA cleanup candidates (include when present)
- **Unused section styles** (`section-*`) and **page templates** (`template-*`) — same test as blocks: not in any content `Style`/`template` metadata → remove the CSS.
- **Duplicate/near-duplicate variants** — consolidate per `eds-content-modeling`'s one-off discipline (a variant only earns its name if its look is genuinely distinct).
- **Leftover backups** — `*.plain.html.bak`, `*.orig`, temp dirs from prior imports.
- **Backward-compat redirect blocks** — if remote/published content no longer references the old block names, they can go (confirm with the user — they exist for a reason).
- **Stale `.bundle.js`** — re-bundle any parser whose source you edited; delete bundles whose source you removed.
- **`lazy-styles.css` vs `styles.css` split** — below-the-fold/section CSS belongs in lazy; eager CSS should stay minimal (perf).
- **Unreferenced icons** in `/icons/` (EDS `decorateIcons` only pulls `:icon-name:` tokens that appear in content).
- **Dead skills** in `skills/` — skills describing removed patterns; reconcile `skills/README.md`.

## Verify before claiming done (Bookend-Verification)
- [ ] All validated pages byte-identical to baseline (the gate).
- [ ] `eslint` + `stylelint` exit 0.
- [ ] Every removed thing confirmed unreferenced repo-wide (no dangling import/`@import`/`href`).
- [ ] Docs reconciled — no `PROJECT-*.md` names a thing you deleted.
- [ ] Each deletion logged in the summary so the user can see scope.

## Pitfalls
- Deleting before baselining → you can't prove a validated page didn't move. Baseline FIRST, always.
- Treating "0 content usage" as "safe to delete" → infra (`header`/`footer`/`fragment`) and redirect blocks have 0 usage but are needed. Confirm purpose.
- Removing a token/selector that a **validated** page uses → the diff catches it; if a pass shows a diff, revert that specific removal, don't push through.
- Flagging EDS lifecycle hooks as "unused JS" → they're framework-invoked; never remove them.
- Refactoring a **validated** page's blocks "while cleaning" → out of scope; only non-validated pages get consolidation (`styling-additively`).
- Running an SVG through `createOptimizedPicture` left in place → it's a latent bug (can't rasterize to WebP); guard `.svg` (see `repo-hosted-svg-references`).
- Doing it all in one giant pass → you can't tell which change caused a diff. One pass, one verify.

See also: `styling-additively` (Frozen-Tools discipline — the safety core), `regression-guard` (measure shared CSS before/after), `eds-code-conventions` (the guidelines pass 2 checks against), `eds-content-modeling` (block/variant consolidation in pass 4), `repo-hosted-svg-references` (the SVG/optimize pitfall), `verify-before-claiming` (the closing bookend)
