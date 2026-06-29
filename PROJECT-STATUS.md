# PROJECT-STATUS.md

## Current Focus

- Branch: main
- Active task: none — site scope + template consolidation done (T-007); wave-1 import plan ready (T-008…T-011)
- Last completed: Discovered semrush.com via sitemaps + visual analysis; consolidated 50+ raw page shapes → 1 chrome + 6 canonical templates (PROJECT-TEMPLATES.md); user confirmed wave-1 scope = pricing siblings + modern marketing-landings; rest deferred
- Next up: T-008 — verify pricing parser reuse on one sibling (e.g. /pricing/local/), then T-009 bulk fan-out of all 9 pricing pages. Then T-010 generalize marketing-landing from homepage.
- Note: 2 frozen pages (homepage, pricing/seo) + foundation. Style any new page additively. Keep styleguide + author block library in lockstep with PROJECT-BLOCKS.md.
- Author block library FULLY WORKING in the DA editor 2026-06-29 (user confirmed: blocks list, variants unfold, insert works). Took FOUR things to get there (all in memory da-library-cors-header): (1) demo pages published into DA, (2) **CORS header** `access-control-allow-origin: *` on `/**` via tools.aem.live/tools/headers-edit (else list empty), (3) `library` config sheet row (Blocks//block-library.json/main) at da.live/config, (4) **absolute block paths** in block-library.json (relative → unfolds empty; fixed + pushed) + **DevTools disable-cache reload** (plain hard-reload insufficient). EMA reuse path verified via real excatops MCP tools (get_library_catalog→11, get_block_details→teaser 2 variants); Library url set to https://main--semrush3--gabrielwalt.aem.page/tools/sidekick/library.json. Harmless leftover: console `content.da.live/...block-library.json 404` (expected probe-then-fallback). EMA upload→publish bug (needs Console reload after toggling admin access) — user filing.
- Note: two frozen pages now — homepage + pricing. Style any new page additively, never edit frozen blocks.
- Blocker: none

## Pages

| Page | URL | Content ✓ | Style ✓ | Notes |
|---|---|---|---|---|
| Foundation | — | — | ✅ | Global workbench validated by gabrielwalt 2026-06-26 (type/color/buttons read as Semrush) |
| Homepage | https://www.semrush.com/ | ✅ | ✅ | GATE 1 + GATE 2 passed (gabrielwalt 2026-06-26). FROZEN. ~97% vs live. Blocks: insights-form, logos, teaser(+dark), carousel(+articles), stats, quote, header, footer |
| Pricing | https://www.semrush.com/pricing/seo/ | ✅ | ✅ | GATE 1 + GATE 2 passed (gabrielwalt; content 2026-06-26, style 2026-06-27). FROZEN. Blocks: pricing-nav, pricing-plans, comparison-table, addons, accordion, carousel-quotes(variant), teaser-dark(reuse) |
| Styleguide | — | n/a | n/a | Living reference (internal) authored 2026-06-28 under content/styleguide/. Renders all default content, section styles, and every block × variant. NEVER frozen — the cumulative collection that grows with every new block/style/template (Styleguide-Never-Freezes Rule). Out of nav/sitemap. Keep in lockstep with PROJECT-BLOCKS.md |
