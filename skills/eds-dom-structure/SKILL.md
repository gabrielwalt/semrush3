---
name: eds-dom-structure
description: EDS section and block DOM structure — the wrapper/container/block chain and how authored table rows become nested cell divs. Use when a CSS selector doesn't match, you need to know where EDS places blocks in the DOM tree, or you need to look up an EDS platform feature in the official aem.live docs. Extends helix `authoring-analysis`, EXCAT `excat-eds-developer`.
---

Blocks are NOT children of the section's inner `<div>`. They're **siblings** at the section level, each in their own `-wrapper > -container > .block` chain.

## DOM tree
```
main > .section.{block}-container
  ├── .default-content-wrapper        ← h1, p, links
  ├── .{block}-wrapper                ← full-width shell
  │     └── .{block}-container        ← max-width constraint
  │           └── .{block}.block      ← element passed to decorate()
  └── .section-metadata               ← consumed at build → classes on .section
```

## Selector cheat sheet
| Target | Selector |
|--------|----------|
| Default content | `main > .section > .default-content-wrapper` |
| Block wrapper | `main > .section > .{block}-wrapper` |
| Adjacent wrappers | `[class$="-wrapper"] + [class$="-wrapper"]` |
| Block root in decorate() | `block` argument (already the `.block` element) |

## Block table inner DOM (multi-cell rows)
Inside the `.block` element, EDS transforms authored table rows into nested divs:
```
.block > div (row 1)
  ├── div (cell 1)
  └── div (cell 2)
.block > div (row 2)
  └── div (single cell)
```
For a single-row block with N cells: `.block > div > div:nth-child(1..N)`. `.block > div > div` matches each cell div. For multi-cell blocks like footer-links (5 columns in one row), the 5 column `<div>`s are children of the single row `<div>`.

## What survives the plain pipeline (model for it)
The DA "plain" pipeline is **lossy**: it **flattens nested `<div>`s and strips all authored `class`/`id`/`style`/`data-*`**. What survives:
- top-level **section** `<div>`s (the `---` boundaries),
- **table-authored blocks** (rows → cells → the `-wrapper > -container > .block` chain above),
- **Section Metadata** (consumed → classes on `.section`),
- semantic **default content** (headings, paragraphs, lists, links, images).

So **model multi-column / structured layout as sections + Section Metadata or a table-block — NEVER as nested authored `<div>`s, and NEVER reconstruct stripped structure in JS** (content-signature tagging, hardcoded column counts). If your structure relies on an authored class surviving, it won't. (AGENTS.md NEVER list; modeling recipe → `eds-content-modeling`.)

## Visibility-reveal lifecycle
EDS keeps blocks and sections `visibility: hidden` until their decoration completes and sets `[data-block-status="loaded"]`; then `body.appear` reveals the page. Implications:
- A block whose `decorate()` **throws** never reaches `loaded` → stays hidden (occupies space, paints blank).
- **Naming a non-block wrapper with a block class** makes it match the hidden rule but it never gets `data-block-status` → invisible forever. Never do it (→ `debug-block-decoration`).
- When verifying, gate on readiness (`window.hlx === true`, `body.appear`, `[data-block-status="loaded"]`) before screenshotting (`validation-gates`).

## Pitfalls
- `.section.{block}-container` is on the **section**, not the block — confusing naming
- Section metadata disappears from DOM after decoration — only its classes remain
- Never add `{block}-wrapper` or `{block}-container` classes in JS — reserved by EDS
- EDS wraps `<img>` in `<picture>` only when img is direct child of `<div>` — detect both: `el.querySelector('picture') || el.querySelector('img')`
- Making a section `display: flex` for side-by-side blocks: the `[class$="-wrapper"] + [class$="-wrapper"]` spacing rule will misalign — override `margin-top: 0` on wrappers in that section

## EDS docs lookup
When stuck on a platform feature, full-text search the official docs:
```bash
curl -s https://www.aem.live/docpages-index.json | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'
```
Or Google `site:www.aem.live <query>`.

## Pitfall: local vs remote serving
AEM CLI serves the main page from the remote origin — local `.plain.html` edits don't change `localhost:3000/path`. Only `localhost:3000/path.plain.html` serves the local file.

## DA content limitations
- `<video>` not supported in DA — use link + poster `<picture>`. Block JS builds the player.
- SVGs stripped by `html2md` — inject manually or use external URLs.

See also: `css-specificity-eds` (why selectors don't apply), `vertical-spacing-system` (block spacing rules), `eds-content-modeling` (how to model so structure survives the pipeline), `debug-block-decoration` (the visibility-reveal / named-wrapper trap), `validation-gates` (readiness gate before screenshotting).
