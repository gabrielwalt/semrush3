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

## Pitfalls
- Block name in header must match folder name (capitalized: `'My Block'` → `blocks/my-block/`)
- Forgetting `element.replaceWith()` leaves original DOM — block not created
- Section Metadata must come AFTER all blocks in its section
- Use `innerHTML` (not `textContent`) for headings that may contain inline markup
- Section boundaries (`<hr>`) go in `beforeTransform`, not parsers

See also: `marker-driven-import` (the overall single-parser, marker-driven strategy + validation loop — read this first when designing a parser), `repo-hosted-svg-references` (**The Heavy-SVG-In-Code Rule** — when a parser pulls a large image/illustration ≥80KB, emit a `/svg/` link reference, not an embedded picture, or preview/publish 409s), `eds-content-patterns` (the auto-styles the output conventions above rely on — eyebrow, CTA buttonization), `video-in-eds` (emitting video links + source-CMS URL quirks), `eds-dom-structure` (output section structure), `eds-content-modeling` (content decisions).
