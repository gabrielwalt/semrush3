---
name: eds-migration-process
description: EDS site/page migration workflow and its two validation gates. Load when a Migration Strategy is already recorded in PROJECT-DESIGN.md and you need to know what phase comes next, which page to pick up, or how to run the content/design validation gates. Do NOT load for a brand-new project with no strategy — load `migration-orientation` first.
---

Orient first, level the workbench, then migrate page-by-page (content before design), then scale to bulk. Stop at two validation gates — never style content the user hasn't approved.

## Track two validation flags per page
Every page carries **content validated** and **style validated** flags (table in `PROJECT-STATUS.md`):
- **Content validated** (GATE 1) = default-content/block/section split and block names approved.
- **Style validated** (GATE 2) = page look approved against the original.
Once style is validated, the page's blocks/variants/section-styles/templates are **frozen** — later pages must style **additively** (`styling-additively`).

## Flow
0. **Orient the migration** (new site, before anything) — run `migration-orientation`: settle scope, content source, design source, **fidelity** (Faithful / Refined / Reimagined), reuse strategy, per-page overrides, and constraints. Record them in `PROJECT-DESIGN.md`'s `## Migration Strategy`. **Gate: no import until this exists.**
1. **Scope the site** — discover URLs and group pages into templates so you know the full scope and which pages are representative. See EMA skills below. Two scope gates apply here: (a) **what to import** — triage marketing vs database-backed vs documentation (`import-content-scoping`); (b) **how few templates** — collapse the raw discovered templates into a handful of canonical ones before any bulk import (`import-template-consolidation`, **The Entropy-Reduction Rule**). Catalog discovery over-splits; do not mint one EDS template per raw template.
2. **Build the global design foundation** (the *workbench*, once per site) — run `global-style-foundation`: capture the visual gist across ≥3 representative pages and formalize brand tokens, type scale, spacing system, and default-content styling, at the recorded fidelity. **Blocks are not styled until the workbench is level.**
3. **Pick a representative page** — prefer one that introduces new blocks.
4. **Phase 1 — Content** (two ordered steps — see below).
5. **🚦 GATE 1 — validate content structure** (below) before any design work.
6. **Phase 2 — Design** (two ordered steps — see below).
7. **🚦 GATE 2 — validate design** (below).
8. **Nav + footer** once the first page looks right.
9. **More pages** — repeat. Style each new page **reuse-first then additive** (Phase 2 step 2): reproduce the look with existing blocks/variants/section-styles before adding anything new, and keep additions scoped to the new page so style-validated pages stay frozen. Prefer pages that introduce new blocks. If in doubt that a change was purely additive, re-check the style-validated pages sharing a touched block (`styling-additively`).
10. **Bulk import** once representative pages and all block variants are covered.

## Phase 1 — Content (model first, script second)
**Do NOT start by running the import script.**
1. **Model the content first.** Study the source and decide default content vs blocks vs sections, section breaks, and block names (`eds-content-modeling`). This produces the validated `.plain.html` reference.
2. **Generate the import script to reproduce it.** Build ONE generic marker-driven parser (`marker-driven-import`). The script is generated *from* the modeling decisions.
- **The import script is source of truth thereafter.** Content changes (rename a block, re-split) → update the script; edits to `.plain.html` are temporary.

## Phase 2 — Design (workbench first, tools second)
The workbench (`global-style-foundation`) is built once per site before any page's blocks. Phase 2 assumes it exists.
1. **Confirm the workbench covers this page.** Brand tokens, type scale, and spacing should already render default content on-brand. If this page reveals a *genuinely global* gap, extend the foundation (not a block) and re-verify existing pages didn't move (`regression-guard`).
2. **Per-block styling — two ordered sub-steps (`styling-additively`), at the page's fidelity** (first-match-wins: per-page override → site default). **Faithful** = measure and match. **Refined** = reproduce intent, strengthen toward foundation. **Reimagined** = keep concept, rebuild for excellence. Then:
   - **2a. Reproduce the look with what already exists.** Before writing CSS, try to reproduce by choosing among existing blocks/variants/section-styles. Re-import with those choices.
   - **2b. Add only what's genuinely missing.** New block, variant, section style, or template — new items are seen only by the new page.
   - **Editing shared CSS is the exception.** Additive rules for a new content shape (teaser image-only, title+video) are fine. If you must change an *existing* declaration, measure the style-validated instances before/after (`regression-guard`).

## 🚦 GATE 1 — content structure
Ask the user to confirm and wait:
- How content was split into default content vs blocks vs sections.
- **Block names** — any to rename?
- **Reuse/refactor** — can the original look be reached with existing blocks/variants/section-styles before inventing anything new? (`styling-additively`)

## 🚦 GATE 2 — design
**Run `excat-visual-critique` before presenting a page/block as styled — don't wait to be asked.** Block / Section / Page / **Site** mode; site mode parallelizes sub-agents per template. Then:
- Close each surfaced delta with `block-visual-iteration` (critique discovers + scores; that loop fixes).
- Ask the user to confirm against the source in Console preview: global look right? Each block match the reported %?
- Iterate on feedback (re-run critique to confirm % moved) before moving on.

## EMA skills by stage
Reach for these native EMA skills — suggest them to the user when they fit. **Where a project skill covers the same step (content modeling, parser strategy, visual QA), the project skill takes precedence** — see `skills/README.md` "Native EMA & EDS skills" for the full precedence map.
- **Scope the site (do this first for a new site):** `excat-site-scope` for a full scope report; `excat-site-catalog` to group pages into templates / page types; `excat-url-discovery` to list all URLs from the sitemap.
- **Migrate content:** `excat-site-migration` orchestrates the migration; `excat-page-analysis` analyzes one page's structure; `excat-import-infrastructure` / `excat-import-script` build parsers + transformers; `excat-content-import` runs the import for one or many pages.
- **Migrate design:** `excat-complete-design-expert` for site design tokens and block styling.
- **Validate / critique:** `excat-visual-critique` (see GATE 2).
- **Nav + footer:** `excat-navigation-orchestrator` (header/nav), `excat-footer-orchestrator` (footer) — require screenshots, run after the page is migrated.
- **Forms:** `excat-form-migration` for HTML → EDS Form blocks.
- **UI help:** `excat-ui-tour` when the user asks how to use the Console UI.

## Always
- Frame the next action as a suggestion: *"Next would be X — shall I go ahead?"*
- Actively invite feedback at each gate — the user's validation drives the next step.
- Consult `PROJECT-STATUS.md` to pick the next page or task.

## Pitfalls
- Don't lead Phase 1 with the import script — model the split first, generate the script to reproduce it second.
- Don't style blocks before the global foundation exists (**Workbench-Before-Tools**).
- Don't ignore the recorded fidelity — read it from `PROJECT-DESIGN.md` before styling.
- Don't let `.plain.html` drift from the script — content-structure changes must go back into the import script.
- Don't skip GATE 1 — broken structure is far harder to fix after styling.
- Don't edit a shared block/variant/section-style to fix a new page — add new styles instead (`styling-additively`).
- Don't mint a new variant for a different *content shape* — extend the base block's CSS additively.
- Re-import flattens section boundaries — restore section divs by hand after.
- `run-bulk-import.js` overwrites `content/*.plain.html` — back up first (`marker-driven-import`).
- Footer blocks must be in one section (no `<hr>`) or EDS renders rules between them.

See also: `migration-orientation` (step 0 — strategy recorded before any import), `global-style-foundation` (step 2 — the workbench), `styling-additively` (reuse-first, additive styling), `marker-driven-import` (ONE generic parser once content is validated), `eds-content-modeling` (block/variant/section/template decisions), `importer-parser-patterns` (writing parsers)
