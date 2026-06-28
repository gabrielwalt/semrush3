---
name: importer-parser-patterns
description: Low-level mechanics of an EDS import parser — createTable() block tables, replaceWith(), img/src attribute handling, picture wrapping, Section Metadata placement. Use when writing or fixing a block parser's table output. For the overall single-parser strategy, see marker-driven-import. Extends helix `generate-import-html`, EXCAT `excat-import-script`.
---

Parser receives a source DOM element and outputs EDS block tables via `createTable()`. First row = block name. Use `element.replaceWith()` to swap in the result.

## Table format
```js
// Single-cell block:
WebImporter.DOMUtils.createTable([['Block Name'], [contentDiv]], document);
// Multi-row:
WebImporter.DOMUtils.createTable([['Block Name'], [row1], [row2]], document);
// Two-column:
WebImporter.DOMUtils.createTable([['Block Name'], [leftCell, rightCell]], document);
// Section Metadata (always last in section):
WebImporter.DOMUtils.createTable([['Section Metadata'], ['Style', 'centered']], document);
```

## Parser structure
```js
export default function parse(element, { document }) {
  // 1. Extract from source DOM  2. Build content elements
  // 3. Create table(s)  4. element.replaceWith(wrapper)
}
```

## DOM access rules
- Use `getAttribute('src')` / `getAttribute('poster')` — NOT `.src` / `.poster` properties. Properties resolve against the browser context and return `about:error` for failed loads; the attribute returns the raw authored value.
- Always resolve relative paths to absolute: prefix paths starting with `/` with the source origin. EDS media pipeline needs full URLs.
- Skip images with `src="about:error"` or empty `src` — never emit broken references.
- SVGs in `<img>` tags survive the EDS pipeline, but inline SVGs and CSS background-image SVGs do not. Download them as files and reference via `<img>`.
- Wrap every `<img>` in `<picture>` — EDS requires this for media handling.
- Emit video as a **link + poster URL**, never a `<video>` element — DA/html2md drops `<video>`. (Source-CMS URL quirks, e.g. extensionless asset URLs, belong in `video-in-eds`.)

## Output structure conventions
These shape what the parser emits, independent of any one block:
- **Section header → default content ABOVE the block, not inside the block table.** An eyebrow + heading (+ section CTA) that introduces a block is authored as default content preceding it, so the section's `.default-content-wrapper` styles it (`eds-content-patterns`). Pulling it into the block table buries it and makes the block carry layout that isn't its job.
- **A CTA must be emitted as `<strong><a>` (primary) or `<em><a>` (secondary), never a plain `<a>`** — that authored emphasis is what `decorateButtons()` turns into a button (`eds-content-patterns`). A bare link stays a text link.
- **Section Metadata is the LAST table in its section**; background section-styles are mutually exclusive — emit one (`marker-driven-import`).
- **Interactive control (toggle / tabs / segmented) → emit clean option labels as a list**, one per item — never the source's `[x]/[ ]` checkbox text, and never glued multi-`<p>` cells (the roundtrip merges them). The block's JS makes it a control (`eds-content-modeling`).
- **Extract the source's SEO metadata → a Page Metadata block** — `<title>`, meta `description`, `canonical`, `og:*`, `twitter:*`, any JSON-LD. Migrated pages **silently lose** these otherwise. Emit as a Page Metadata key-value table (`page-template-metadata`).

## Section boundaries — sectionize AFTER import (don't fight html2md)
`html2md` **strips `<hr>` and section `<div>`s no matter where you emit them** — parser, driver, OR `beforeTransform` — collapsing the page into one top-level `<div>`. EDS renders one section per top-level `<div>` sibling, so a flattened import gets zero section styling. **Don't fight the markdown pipeline** — restore boundaries with the deterministic post-import step (`post-import-sectionizer` → `node tools/importer/sectionize.mjs <path>`), recorded in `PROJECT-IMPORT.md` so it's never skipped. (Emitting `<hr>` in a parser/driver to make sections has **no effect** — it's stripped.)

## DA / html2md cell gotchas (content-bus universal)
The markdown roundtrip mangles certain authored shapes — emit around them:
- **`<span class>` is stripped in cells** — never rely on a span class surviving; the class is gone after import (model via structure, not authored classes).
- **Mid-sentence inline must stay inside its text cell** — a `<strong>`/`<a>` split across cells glues or drops; keep an inline run in one cell.
- **Image + text belong in SEPARATE cells** — a `<p>`-wrapped image beside text in one cell mangles (`<p>`-in-`<p>`); give the image its own cell.
- **Multi-column block header needs `colspan="N"`** so the block-name row spans the N content columns.
- **Heading nested in a heading empties** — don't emit `<h3>` inside `<h2>`.
- **Broken image URL forms** (`about:error`, host-less/relative, cross-tenant) → skip or resolve to absolute; never emit them (see DOM access rules).
- **Replacing media requires a re-preview** — a swapped image won't update until the page is re-previewed.

## Pitfalls
- Block name in header must match folder name (capitalized: `'My Block'` → `blocks/my-block/`)
- Forgetting `element.replaceWith()` leaves original DOM — block not created
- Section Metadata must come AFTER all blocks in its section
- Use `innerHTML` (not `textContent`) for headings that may contain inline markup
- Trying to create section breaks with `<hr>` (in a parser, driver, or `beforeTransform`) → stripped by html2md, no effect. Sectionize AFTER import (`post-import-sectionizer`).

See also: `marker-driven-import` (the overall single-parser, marker-driven strategy + validation loop — read this first when designing a parser), `repo-hosted-svg-references` (**The Heavy-SVG-In-Code Rule** — when a parser pulls a large image/illustration ≥80KB, emit a `/svg/` link reference, not an embedded picture, or preview/publish 409s), `eds-content-patterns` (the auto-styles the output conventions above rely on — eyebrow, CTA buttonization), `video-in-eds` (emitting video links + source-CMS URL quirks), `eds-dom-structure` (output section structure), `eds-content-modeling` (content decisions).
