# PROJECT-IMPORT.md

Import strategy, URL sets, parser strategy, template-to-parser mapping.

## Import Strategy

DA project (`content.da.live/gabrielwalt/semrush3/`). Single-page scope — the homepage. ONE generic marker-driven parser reproduces the validated structure (`marker-driven-import`).

## URL Sets

- Homepage: `https://www.semrush.com/`
- Pricing: `https://www.semrush.com/pricing/seo/` (`/pricing/` redirects here)

## Pricing page content model (T-005 — reuse-first against frozen homepage toolbox)

Decided 2026-06-26 (gabrielwalt): build the toolkit sidebar as a block; make interactive bits functional.

| # | Section | Block | Reuse / New |
|---|---------|-------|-------------|
| — | Header / footer | `header` / `footer` | **Reuse frozen** |
| 1 | Toolkit sidebar (SEO Classic, AI Visibility, Local…) | `pricing-nav` | **NEW** (links to sibling pricing pages) |
| 2 | Page title + Monthly/Annually toggle | default content h1 + `pricing-plans` toggle | h1 default; toggle in plans block |
| 3 | 3 plan cards (Pro/Guru/Business) | `pricing-plans` | **NEW** — interactive price toggle |
| 4 | Compare Plans matrix | `comparison-table` | **NEW** — expandable |
| 5 | Add-ons (4 cards) | `addons` | **NEW** |
| 6 | "Playing big?" enterprise demo | `teaser` | **Reuse** (additive content shape: checklist) |
| 7 | FAQ accordion (9 Q&A) | `accordion` | **NEW** — expand/collapse |
| 8 | Testimonials slider (5) | `carousel (carousel-quotes)` | **Reuse** carousel + new variant |

**Additive discipline:** all new blocks + the `carousel-quotes` variant are scoped to pricing; homepage blocks render unchanged (verify with `regression-guard` + re-critique homepage after).

**Marker note:** the pricing page uses **build-hashed CSS-module classes** (`Testimonials-module__…`, `_inAfterOutline_…`) — too brittle to target. Pricing parsers key on **structural/semantic markers** instead: `h1`, `h2`/`h3`, `ul > li`, `role="grid"`/`row`/`gridcell`, `role="region"` + its heading text, `blockquote`. Plan/add-on/testimonial counts (3/4/5) verified live.

## Homepage content model (GATE 1 candidate — proposed 2026-06-26)

Header promo banner, nav, and footer are site **chrome** — handled by nav/footer orchestrators after the body is styled, not by this parser.

| # | Section | Default content | Block | Notes |
|---|---------|-----------------|-------|-------|
| 1 | Hero | h1 + subhead | `insights-form` | Interactive placeholder; author owns only field/button labels, data is runtime |
| 2 | Logo strip | — | `logos` | Customer logo row (marquee) |
| 3 | Promo pair | — | `teaser` ×2 | "Your edge…" + "Bigger scale…" — two teaser blocks, each title+text+CTA |
| 4 | Solutions | eyebrow + heading | `carousel` | 9 cards: eyebrow + title + image |
| 5 | Stats | eyebrow + heading + CTA | `stats` | 5 metrics |
| 6 | Customer quote | eyebrow + heading | `quote` | logo + quote + attribution + stat |
| 7 | Resources | eyebrow + heading | `carousel (carousel-articles)` | 9 article cards — variant of the Solutions carousel |
| 8 | Final CTA | heading + subhead + CTA | — | default content on a distinctive section style |

## Parser Strategy

Detection cascade per `marker-driven-import`: section wrappers from the source `.mp-*` region classes → block detection by region role/heading → default content (eyebrow = small-text-before-heading, CTA = emphasized link).

### Teaser videos (autoplay)

The promo teasers carry autoplaying product videos. The source `<video>` lazy-loads its `<source>` (empty until scrolled in), so the URLs are hardcoded in the parsers (verified live):
- semrush-one: `https://www.semrush.com/static/videos/semrush_one.mp4`
- enterprise: `https://www.semrush.com/static/videos/enterprise_video.mp4`

Per `video-in-eds`, parsers emit a LINK — relative href slug (`/static/videos/<name>-mp4`, same-origin proxy) + full URL as link text — plus the poster `<picture>` as a fallback frame. `blocks/teaser/teaser.js` finds the video link (matches `.mp4|.webm` in link *text*, not the CTA), builds a muted/loop/playsinline `<video>`, and plays it via IntersectionObserver (reduced-motion → poster only).

## Template-to-Parser Mapping

- **homepage** → `import-homepage.js` (parsers: hero, logos, teaser-one, teaser-enterprise, solutions, stats, quote, resources)
- **pricing** → `import-pricing.js` (parsers: pricing-nav, pricing-plans, comparison-table, addons, accordion, quotes + inline enterprise-teaser). Sections routed by structural markers + `role="region"` heading text. Testimonials AND the billing toggle both use the lazy-hydration fallback (`import-lazy-hydrated-content`) — the Monthly/Annually periodicity group is client-rendered, so the toggle defaults to `['Monthly','Annually']` when parse-time extraction yields < 2. Run `sectionize.mjs` after import (handles both templates' block classes).

**Driver-rebuild pattern (pricing).** Unlike the homepage driver (which parses in place against a clean source DOM), the pricing driver resolves ALL source elements UP FRONT, runs each parser (which returns its block wrapper), then rebuilds `main` from ONLY those returned wrappers (`main.replaceChildren(...wrappers)`). This discards un-parsed source content by construction — fixing three GATE-1 issues: the duplicate "Compare Plans" flat list (kept only the `comparison-table`), the duplicated `<h1>`, and the raw `[x]/[ ]` toggle glyph text. Resolving sources first matters because `pricing-plans` replaces a large common ancestor that also contains the grid + downstream regions; resolving up front means their detachment is harmless. **Every pricing parser must `return wrapper;`** for this to work.

**Toggle shape.** The billing toggle emits as a BULLETED LIST in one cell (not stacked `<p>`, not multi-column cells) — a list is the only multi-value shape that survives the import's markdown roundtrip intact; the block JS turns each `<li>` into a toggle option.

## Import + sectionize workflow (run in order)

The html2md import pipeline **flattens section boundaries** (`<hr>` markers are stripped), so a post-import step re-splits the content into EDS sections.

```sh
SKILL=/home/node/.excat-marketplace/excat/skills/excat-content-import
# 1. bundle
bash $SKILL/scripts/aem-import-bundle.sh --importjs tools/importer/import-homepage.js
# 2. import (writes content/index.plain.html)
node $SKILL/scripts/run-bulk-import.js --import-script tools/importer/import-homepage.bundle.js --urls tools/importer/urls-homepage.txt
# 3. sectionize (splits the flat output into 8 sibling section divs; applies hero section-metadata)
node tools/importer/sectionize.mjs content/index.plain.html
```

`tools/importer/sectionize.mjs` splits the flat stream into one top-level `<div>` per block group, keeping each block's eyebrow/heading default content with it. The hero parser emits `Section Metadata → Style: hero`; the boilerplate's `decorateSections` doesn't read Section Metadata, so `decorateSectionMetadata()` in `scripts/scripts.js` consumes it into a `.hero` section class (runs in `decorateMain` right after `decorateSections`). This lives in `scripts.js`, NOT `aem.js` — `aem.js` is the upstream-managed library and edits get overwritten on lib updates (per `eds-code-conventions`).

**Always back up `content/index.plain.html` before re-running** — the importer overwrites it.
