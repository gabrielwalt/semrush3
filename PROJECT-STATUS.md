# PROJECT-STATUS.md

## Current Focus

- Branch: main
- Active task: none — site scope + template consolidation done (T-007); wave-1 import plan ready (T-008…T-011)
- Last completed: Discovered semrush.com via sitemaps + visual analysis; consolidated 50+ raw page shapes → 1 chrome + 6 canonical templates (PROJECT-TEMPLATES.md); user confirmed wave-1 scope = pricing siblings + modern marketing-landings; rest deferred
- Next up: T-008 — verify pricing parser reuse on one sibling (e.g. /pricing/local/), then T-009 bulk fan-out of all 9 pricing pages. Then T-010 generalize marketing-landing from homepage.
- Note: 2 frozen pages (homepage, pricing/seo) + foundation. Style any new page additively. Keep styleguide + author block library in lockstep with PROJECT-BLOCKS.md.
- Author block library built 2026-06-28 (content/library/blocks/* + block-library.json for DA panel; tools/sidekick/library.json + library-metadata per variant for EMA reuse). Pending USER handoff: (1) DA panel — add `library` config row at admin.da.live/config/gabrielwalt/semrush3/ + publish; (2) EMA — publish /tools/sidekick/library.json + set Settings→Project→Library url to https://main--semrush3--gabrielwalt.aem.page/tools/sidekick/library.json. See PROJECT-IMPORT.md → Author block library.
- Note: two frozen pages now — homepage + pricing. Style any new page additively, never edit frozen blocks.
- Blocker: none

## Pages

| Page | URL | Content ✓ | Style ✓ | Notes |
|---|---|---|---|---|
| Foundation | — | — | ✅ | Global workbench validated by gabrielwalt 2026-06-26 (type/color/buttons read as Semrush) |
| Homepage | https://www.semrush.com/ | ✅ | ✅ | GATE 1 + GATE 2 passed (gabrielwalt 2026-06-26). FROZEN. ~97% vs live. Blocks: insights-form, logos, teaser(+dark), carousel(+articles), stats, quote, header, footer |
| Pricing | https://www.semrush.com/pricing/seo/ | ✅ | ✅ | GATE 1 + GATE 2 passed (gabrielwalt; content 2026-06-26, style 2026-06-27). FROZEN. Blocks: pricing-nav, pricing-plans, comparison-table, addons, accordion, carousel-quotes(variant), teaser-dark(reuse) |
| Styleguide | — | n/a | n/a | Living reference (internal) authored 2026-06-28 under content/styleguide/. Renders all default content, section styles, and every block × variant. NEVER frozen — the cumulative collection that grows with every new block/style/template (Styleguide-Never-Freezes Rule). Out of nav/sitemap. Keep in lockstep with PROJECT-BLOCKS.md |
