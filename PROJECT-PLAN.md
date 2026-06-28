# PROJECT-PLAN.md

The single source of executable work. Always execute the first `🔲 Open` task unless directed otherwise. Mark a task `✅ Done` the moment it is complete.

| ID | Status | Priority | Task | Files | Acceptance |
|----|--------|----------|------|-------|------------|
| T-001 | ✅ Done | High | Run migration-orientation — capture authoring model, scope, sources, fidelity, and record the migration strategy in PROJECT-DESIGN.md before any implementation. | PROJECT-DESIGN.md | `## Migration Strategy` section filled; orientation conversation complete |
| T-002 | ✅ Done | High | Build the global style foundation (the workbench) — extract brand tokens, type scale, color, spacing, and default-content styling from the live semrush.com homepage at Refined fidelity. Record tokens in PROJECT-DESIGN.md. | styles/styles.css, PROJECT-DESIGN.md | `:root` tokens populated; type scale + color + spacing recorded; detect.mjs clean |
| T-003 | ✅ Done | High | Import the homepage content (DA `.plain.html`) and pass GATE 1 (content structure validation). | content/index.plain.html | GATE 1 passed 2026-06-26; structure validated by user |
| T-004 | ✅ Done | High | Style the homepage block-by-block to match the original (Refined), pass GATE 2. | blocks/*, styles/* | GATE 2 passed 2026-06-26 (~97% vs live); homepage frozen |
| T-005 | ✅ Done | High | Migrate the Pricing page (/pricing/seo/) — reuse the homepage's frozen block toolbox, style additively, pass GATE 1 + GATE 2. | tools/importer/*, blocks/*, content/pricing.* | GATE 1 + GATE 2 passed (content 2026-06-26, style 2026-06-27); pricing frozen; homepage unchanged (verified) |
| T-006 | ✅ Done | Med | Create the styleguide retrospectively (was skipped at project start). | content/styleguide/* | All styleguide routes render; blocks decorate; recorded in PROJECT-* (done 2026-06-28) |
| T-007 | ✅ Done | High | Site scope + template consolidation: discover URLs, group into canonical templates, triage marketing/programmatic/docs, record map. | PROJECT-TEMPLATES.md | 6 canonical templates + raw→canonical map + exclude/defer buckets recorded; wave-1 scope confirmed by gabrielwalt 2026-06-28 |

## Wave 1 — marketing-first import (user-confirmed scope 2026-06-28)

Scope: **pricing siblings** + **modern marketing-landings** only. Feature-detail, customer stories, and quiet-resource templates are explicitly DEFERRED to later rounds (see deferred tasks below). Full template analysis in `PROJECT-TEMPLATES.md`.

| ID | Status | Priority | Task | Files | Acceptance |
|----|--------|----------|------|-------|------------|
| T-008 | 🔲 Open | High | **Pricing fan-out — verify reuse on 1 sibling.** Pick one pricing sibling (e.g. `/pricing/local/`), run the existing `import-pricing.js` against it, sectionize, and confirm it reproduces the frozen pricing template (sidebar active-state, plan cards, compare table, add-ons, FAQ, quotes) with only data differing. Fix parser robustness if a sibling's plan/add-on/row counts differ. | tools/importer/import-pricing.js, tools/importer/urls-pricing.txt, content/pricing/local.plain.html | One sibling imports + sectionizes cleanly via the existing parser; renders on the frozen pricing template with no new CSS; deltas are data-only. GATE 1 on that sibling. |
| T-009 | 🔲 Open | High | **Pricing fan-out — bulk import remaining 8 siblings.** Add all 9 pricing URLs to `urls-pricing.txt`, back up content, bulk-import + sectionize, spot-check each renders. Update pricing-nav active-state per page. | tools/importer/urls-pricing.txt, content/pricing/*.plain.html | All 9 `/pricing/*` pages render on the frozen pricing template; pricing-nav marks the correct active sibling per page; homepage + /pricing/seo/ unchanged (regression-guard). |
| T-010 | 🔲 Open | High | **Generalize the marketing-landing template** from the frozen homepage. Pick the closest modern landing (`/semrush-free-trial/`), model its content (GATE 1) reusing the homepage toolbox (insights-form/teaser/logos/carousel/stats/quote + section styles); add only genuinely-missing blocks additively + their styleguide stories. Pass GATE 1 + GATE 2; freeze. This page becomes the marketing-landing reference. | tools/importer/parsers/*, tools/importer/import-landing.js, blocks/*, content/semrush-free-trial.plain.html | `/semrush-free-trial/` passes GATE 1 + GATE 2 against the live page at Refined fidelity; reuses homepage blocks first; any new block scoped + added to styleguide; homepage/pricing stay frozen (verified). |
| T-011 | 🔲 Open | Med | **Migrate remaining modern landings** (`/solutions/*` LP, `/company/` about) onto the T-010 template, reuse-first + additive. Confirm `/solutions/competitive-research/` redirect target. Decide empirically if a `marketing-landing:trial` vs `:product-solution` sub-variant recurs (only split if author-meaningful). | tools/importer/import-landing.js, content/*.plain.html | Each modern landing passes GATE 1 + GATE 2; sub-variant added only if a recurring author-meaningful difference is seen; earlier frozen pages unchanged. |

## Deferred — later rounds (not wave 1; recorded so scope is traceable)

| ID | Status | Priority | Task | Files | Acceptance |
|----|--------|----------|------|-------|------------|
| T-D01 | 🔲 Deferred | Low | **feature-detail template + import** (~45 `/features/*` + `/sem/` + `/stats/`). Legacy look — import content onto a new feature-detail template, then a dedicated styling round to bring onto the rebrand. | — | Deferred per user 2026-06-28; pick up after wave 1. |
| T-D02 | 🔲 Deferred | Low | **Quiet-resource templates** (listing-index, article/case-study incl. 80 customer stories, policy/info legal+security). Calmer content-focused styling round, separate design bar from loud marketing. | — | Deferred per user 2026-06-28. |
| T-D03 | 🔲 Deferred | Low | **Documentation corpora** (blog 1,405 / kb / academy / news) + **localized sitemaps** (de/fr/it/es/pt/ja). Opt-in only. | — | Out of default scope; only if user extends. |
