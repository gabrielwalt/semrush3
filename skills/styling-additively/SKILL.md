---
name: styling-additively
description: How to style a newly-imported page without breaking pages whose look is already validated. Use when starting to design/style any page after the first, when matching a new page to its original, or when tempted to edit an existing block/variant/section-style CSS. Treats the existing blocks, variants, and section styles as fixed building blocks you extend, not edit.
---

The blocks, variants, and section styles you already have are your **toolbox** — fixed tools you extend, never edit. Editing a shared style to fix the page in front of you silently breaks every validated page that uses it. Add new tools instead, so new CSS only touches the new page.

This skill operationalizes two Named Rules (AGENTS.md): **The Toolbox-First Rule** (reach for existing tools before forging new ones) and **The Frozen-Tools Rule** (a validated page's tools must never shift).

## Why
Each page tracks two flags: **content validated** and **style/look validated** (see `PROJECT-STATUS.md`). Once a page's look is validated, the blocks/variants/section-styles/templates it uses are **load-bearing** — they must keep rendering identically. The only safe way to make a new page look right is to add styling that the validated pages don't see.

**Know the frozen set before you touch anything — don't guess it.** Run `node tools/quality/project-state.mjs` (`quality-tooling`) and read `frozen`: those page files are the do-not-move set. A page marked `🔓 unfrozen` (design-open) is NOT in `frozen` — you may take design liberties there. **But unfrozen ≠ unshared** — see `regression-guard` for the full ripple-check protocol when editing shared CSS.

## The two-step process for styling a new page
**Step 1 — Toolbox-First: reproduce the look with what already exists.** Before writing any CSS, take stock of every block, variant, section style, and combination you already have. Try to reproduce the original page's look by *only* choosing among them: rename a block, switch to an existing variant, add a section style, combine them. Re-import / re-author the content with those choices. Even a content-validated page deserves this step — its structure may match the original with just different block names or variants. **Threshold to forge a new tool:** you can state, in one sentence, the specific look the existing toolbox cannot express. If you can't name what's missing, Step 1 isn't finished.

**Step 2 — Add only what's genuinely missing.** Whatever the existing blocks, variants, and section styles can't express becomes a *new* item:
- a brand-new block (a structure that never appeared on a validated page), or
- a new variant / section style / one-off (per the `eds-content-modeling` ladder), or
- a new page template (conservatively).
New items are seen only by the new page → validated pages can't move.

## Editing existing styles — the exception, handled with care
Sometimes a lean addition *to a base block's CSS* is correct rather than a new variant: when the block simply receives a **content shape it hasn't handled before** (e.g. a `teaser` with image-only, or title+video, or an extra `h3`). Handling a new content combination in the base styles is fine and preferred over a variant — a variant is for a different *look*, not a different *content set*. But:
- Only do this when the new rule is **additive** (targets elements/shapes the validated pages don't contain). A `.teaser h3` rule is safe if no validated teaser has an `h3`.
- If you must change an *existing* declaration, **measure the validated instances before and after** and confirm they didn't move (`regression-guard`).

## Lead with `excat-visual-critique` (discovery), then style additively (fix)
Before deciding what the new page is missing, **run the native `excat-visual-critique` skill against it** (Page mode, or Site mode when styling several pages — site mode runs parallel per-template sub-agents). Its extraction-based similarity % + categorized diffs tell you *exactly* which deltas are content/structural (→ fix the parser) vs styling/layout (→ a new variant/section-style here). That keeps Step 1 honest: you reuse-first against a real diff list, and you can name in one sentence what the toolbox can't express (the threshold to forge a new tool) because critique already itemized it. Reach for it aggressively on every page-styling task — it's the discovery engine; this skill is the additive-fix discipline.

## Verify the freeze held
After styling the new page, if there's any doubt the change was purely additive, run the full measurement protocol from `regression-guard` on the shared blocks. **Re-run `excat-visual-critique` on validated pages that share a touched block** — its per-block % is a fast regression signal (if a frozen page's block dropped below its prior %, the change wasn't additive).

## Pitfalls
- Editing a shared variant/section-style/`styles.css` rule "just a little" to fix the new page — the classic validated-page breaker.
- Reaching for a new variant when the difference is only a new *content shape* → extend base styles additively instead.
- Inventing a new block/variant before checking the existing blocks/variants/section-styles can already express the look (Step 1 skipped).
- Assuming additive = safe without checking: an additive selector can still match a validated page if that page has the same element. Confirm it doesn't.

See also: `excat-visual-critique` (run it first to itemize the deltas — Page/Site mode, parallel per-template sub-agents in site mode; discovers, doesn't fix), `block-visual-iteration` (the measure-first loop that closes each delta critique surfaced), `eds-content-modeling` (the block/variant/section/template ladder + naming), `context-adaptive-blocks` (before adding a `*-dark`/`*-inverse` variant — make the block adapt to its dark container instead), `regression-guard` (measure-before/after when touching shared CSS), `eds-migration-process` (per-page content/style validation gates), `measure-then-implement` (measure the original, don't guess)
