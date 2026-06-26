---
name: regression-guard
description: How to prevent introducing new bugs while fixing existing ones. Load before any CSS or JS change that touches shared or global code (styles.css, block wrappers, section classes).
---

Every CSS edit on shared selectors risks affecting elements you didn't intend to change. The highest-stakes case: a block/variant/section-style used by a page whose **look is already validated** — editing its CSS to fix a new page silently breaks the validated one. Prefer adding new styles over editing shared ones (`styling-additively`); when you must edit shared CSS, this recipe is mandatory.

## Recipe
1. Before editing: identify all elements that share the selector you're about to change. **Run `node tools/quality/project-state.mjs`** (`quality-tooling`) to see which pages are `frozen` (do-not-touch) vs `unfrozen`/in-progress — that tells you whose look you must not move.
2. Record their current key values (font-size, margin, padding, color, display)
3. Make the change
4. Check ALL identified elements — not just the one you were fixing. **Run `node tools/quality/detect.mjs <the shared file + its consumers>`** to catch token/contrast/radius regressions a script can see; triage every finding.
5. If any untouched element changed: undo, find a more specific selector, try again

## Unfrozen ≠ unshared
A page being `🔓 unfrozen` (design-open) lifts the *don't-touch* rule, **not** the *check-the-ripple* rule. A page typically shares blocks (`header` / `footer` and any reused card/hero/carousel block) with other pages — editing a shared block to improve the (unfrozen) page still changes every other page that uses it. After any shared-block edit, re-verify every page that uses it, frozen or not.

## Common regression triggers
| What you change | What it can break |
|---|---|
| `h2` global styles | Every h2 on the page |
| `.section > div` | All section containers |
| `.button` / `.button-wrapper` | CTAs in every block |
| `styles.css` root tokens | Anything using that token |
| `main > .section` padding | All section spacing |
| Block wrapper CSS | Other blocks sharing wrapper pattern |

## Pitfalls
- Fixing one block's margin by editing the global section rule — breaks every section
- "It looks fine in the block I'm working on" — check ALL sections, not just the one
- Removing a CSS custom property — silently breaks all blocks that inherit it

See also: `styling-additively` (add new blocks/variants/section-styles instead of editing existing ones — protects validated pages), `verify-before-claiming` (always load after changes), `css-specificity-eds` (specificity debugging)
