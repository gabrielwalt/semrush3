---
name: post-import-sectionizer
description: The html2md import pipeline flattens section boundaries — all blocks land in ONE top-level div instead of sibling section divs, so per-section styles (dark band, gradient hero) never apply. Use when an imported page renders as a single section, when <hr> section breaks vanish from .plain.html, or when Section Metadata won't apply its style class.
---

`html2md` strips `<hr>` **no matter where it's emitted** (parser, driver, or `beforeTransform`), collapsing the whole page into one top-level `<div>`. EDS renders one **section per top-level `<div>` sibling** (`decorateSections`), so a flattened import gets zero section styling. **Fix it with a deterministic post-import step, not by fighting the markdown pipeline.**

## Recipe — a repo sectionizer script, run after every import
1. After the import writes `content/<path>.plain.html`, run `node tools/importer/sectionize.mjs content/<path>.plain.html`. **Record this as a step in `PROJECT-IMPORT.md`'s import workflow so it's never skipped.**
2. The script reads the single flat wrapper `<div>`, walks its children, and splits into one top-level `<div>` per block group:
   - A new section starts at a **block** that follows another block/metadata, or at **default content** (eyebrow/heading) that follows a block/metadata — so each block keeps its own intro copy.
   - Keep `.section-metadata` inside the section it terminates.
3. The script derives the block-class list **from `blocks/`** (not a hardcoded list) so it works on any project (see `quality-tooling`).

**Deterministic boundary signal (optional, when grouping is ambiguous):** on the live source, a real section transition is a **background-color change** — compute each band's background in CIELAB and treat **ΔE > ~5** as a boundary (ignores near-identical backgrounds / anti-alias noise). Backs "where does a new section start?" with a measurement, not eyeballing.

## Section Metadata must be consumed (never by editing aem.js)
A section style only applies if `decorateSections` reads the `.section-metadata` div and turns `Style` values into section classes. The current boilerplate `scripts/aem.js` does this. **If it doesn't apply (you see "Style / hero" as visible text), do NOT edit `aem.js`** (AGENTS.md NEVER list — it's overwritten on the next lib update); the boilerplate's `aem.js` is current, so the cause is almost always a malformed `.section-metadata` table (wrong key, not last in section), not the handler. Fix the content/sectionizer output.

## Pitfalls
- Emitting `<hr>` in a parser/driver/`beforeTransform` to create sections → stripped by html2md, no effect. Sectionize after import instead.
- `main.replaceChildren(rebuiltDiv)` mid-transform → can blank the output (detaches the tree html2md tracks). Do the split in the standalone post-import script on the written `.plain.html`, not inside the transform.
- A structural wrapper div carrying a block class (e.g. `footer-cta`) → EDS tries to decorate it as a block (404 / `visibility:hidden`). **Don't add no-op `decorate(){}` stubs** (the JS-reconstruction anti-pattern, `eds-content-modeling`) — model the structure as sections + Section Metadata so no structural div carries a block class.

See also: `marker-driven-import` (the import flow this post-processes; "re-import flattens sections" pitfall), `importer-parser-patterns` (why `<hr>` can't make sections), `eds-dom-structure` (section wrapper chain `decorateSections` builds), `page-template-metadata` (Section Metadata → section classes), `quality-tooling` (the sectionizer derives its block list from `blocks/`).
