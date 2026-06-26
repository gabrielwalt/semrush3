---
name: unfreeze-page
description: The protocol for when a change would affect one or more frozen (style-validated) pages — detect the impact, ask before unfreezing, and re-freeze after re-validation. Use when about to edit CSS/JS a frozen page uses, or when the user requests a change on a frozen page. The 🔓 unfreeze marker is always a user decision; the agent never self-unfreezes.
---

A frozen page's tools must never shift without the user's say-so (**The Frozen-Tools Rule**). Before any change that could reach a frozen page, detect the impact, ask, then unfreeze → change → re-freeze.

**TRIGGER:** about to edit CSS/JS that a frozen page uses, OR the user requests a change on a frozen page.

## Step 1 — Detect impact
Run `node tools/quality/project-state.mjs` for the `frozen[]` list (frozen content paths). Cross-check the files you're about to touch against those pages and the blocks/section-styles/templates they share. Three cases:

- **Certain impact** (the change definitively affects a frozen page's rendering):
  → **Stop.** Tell the user which frozen pages are affected and ask: proceed (unfreezing them) or stop? Touch nothing until the user confirms.
- **Grey zone** (might affect frozen pages depending on selector scope):
  → First try to **scope** the change so it can't reach frozen pages — add a variant class, section style, or template class to narrow the selector to only the pages being worked on. Example: instead of editing shared `.hero h2`, add `body.template-X .hero h2 { … }` (or a new `.hero-newvariant` class) so the change lands only on the page in progress and the frozen pages' selectors stay untouched.
  → If scoping is optimal: apply it, note it in the summary, continue.
  → If scoping would be a worse solution than the change itself: stop and ask the user, explaining the tradeoff.
- **No frozen pages affected:** proceed normally (`styling-additively` discipline still applies).

## Step 2 — Unfreeze (only after the user confirms)
Mark the page's Style column `✅ 🔓` in `PROJECT-STATUS.md`. `project-state.mjs` then excludes it from `frozen[]`, suspending the Frozen-Tools Rule for that page.

## Step 3 — Re-freeze
After the changes are validated by the user (GATE 2 re-run — the user explicitly confirms the page still looks right), remove the `🔓` and keep only `✅`.

## Pitfalls
- Unfreezing without asking — the `🔓` marker is always a user decision.
- Assuming a selector change is safe because it "looks" scoped — run `project-state.mjs` and check `frozen[]` first.
- Forgetting to re-freeze after the user re-validates — the page stays `🔓` indefinitely and loses Frozen-Tools protection.
- Over-scoping with variants when it's not needed — unnecessary variants pollute the block inventory.

See also: `regression-guard` (catches a shared tool shifting under a frozen page), `styling-additively` (the additive discipline that avoids unfreezing in the first place), `validation-gates` (the GATE 2 re-validation that gates re-freezing), `quality-tooling` (`project-state.mjs` `frozen[]`)
