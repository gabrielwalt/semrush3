---
name: post-import-sectionizer
description: The html2md import pipeline flattens section boundaries — all blocks land in ONE top-level div instead of sibling section divs, so per-section styles (dark band, gradient hero) never apply. Use when an imported page renders as a single section, when <hr> section breaks vanish from .plain.html, or when Section Metadata won't apply its style class.
---

`html2md` strips `<hr>` no matter where the parser inserts it, collapsing the whole page into one top-level `<div>`. EDS renders one **section per top-level `<div>` sibling** (`decorateSections`), so a flattened import gets zero section styling. **Fix it with a deterministic post-import step, not by fighting the markdown pipeline** — this is the documented "re-import flattens section boundaries, restore after" constraint.

## Recipe — a repo sectionizer script, run after every import
1. After `run-bulk-import.js`, run `node tools/importer/sectionize.mjs content/{path}.plain.html` (record this 3rd step in `PROJECT-IMPORT.md`'s import workflow so it's never skipped).
2. The script reads the single flat wrapper `<div>`, walks its children, and splits into one top-level `<div>` per block group:
   - A new section starts at a **block** that follows another block/metadata, or at **default content** (eyebrow/heading) that follows a block/metadata — so each block keeps its own intro copy.
   - Keep `.section-metadata` inside the section it terminates.
3. Inject Section Metadata in the script when a group needs a style class (e.g. group with >1 of a block → a `promo-pair` style) — build a `.section-metadata` div with a `Style` row.

## decorateSections must consume Section Metadata
The boilerplate `scripts/aem.js decorateSections` may be an **older version that ignores Section Metadata** (it renders "Style / hero" as visible text and 404s as a block). Restore the standard handler: read the `div.section-metadata` via `readBlockConfig`, apply `style` values as section classes (`toClassName`), set other keys as `dataset`, then remove the metadata div. Without this, no `section-metadata`-driven style ever applies.

## Pitfalls
- Inserting `<hr>` in the parser or driver to create sections → stripped by html2md, no effect. Sectionize after import instead.
- `main.replaceChildren(rebuiltDiv)` mid-transform → can blank the output (detaches the tree html2md tracks). Do the split in the standalone post-import script on the written `.plain.html`, not inside the transform.
- Classed wrapper divs in a fragment (e.g. `footer-cta`) → EDS tries to load them as blocks (404s). Add no-op `decorate(){}` stubs, or avoid single-classed structural divs.

See also: `marker-driven-import` (the import flow this post-processes; "re-import flattens sections" pitfall), `eds-dom-structure` (section wrapper chain `decorateSections` builds), `page-template-metadata` (Section Metadata → section classes)
