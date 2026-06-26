# PROJECT-IMPORT.md

Import strategy, URL sets, parser strategy, template-to-parser mapping.

## Import Strategy

DA project (`content.da.live/gabrielwalt/semrush3/`). Single-page scope — the homepage. ONE generic marker-driven parser reproduces the validated structure (`marker-driven-import`).

## URL Sets

- Homepage: `https://www.semrush.com/`

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

## Template-to-Parser Mapping

Single template (homepage) → single parser.

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

`tools/importer/sectionize.mjs` splits the flat stream into one top-level `<div>` per block group, keeping each block's eyebrow/heading default content with it. The hero parser emits `Section Metadata → Style: hero`; `scripts/aem.js decorateSections` consumes it into a `.hero` section class (the boilerplate's `decorateSections` was missing Section Metadata support — restored 2026-06-26).

**Always back up `content/index.plain.html` before re-running** — the importer overwrites it.
