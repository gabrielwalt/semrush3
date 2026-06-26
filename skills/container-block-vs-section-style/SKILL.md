---
name: container-block-vs-section-style
description: Decide whether a UI "container" pattern (tabs, accordion, carousel, slider) should be an EDS block or a section style. Use when a pattern must wrap a VARIETY of content or REUSE existing blocks (teasers, cards), or when a block's inner content renders unstyled/undecorated. Trigger phrases "tabs content isn't styled", "should this be a block or section style", "needs to contain teasers/cards", "nested block not decorating".
---

A block consumes its rows as raw cells and EDS NEVER runs `decorate()` on blocks nested inside another block — so if a container must hold *real, decorated blocks* (teasers, cards, anything authored), it CANNOT be a block. Make it a **section style** instead: the panels become normal top-level blocks (which EDS decorates) and a small JS hook layers the container UI over them.

## The decision

Ask: **does this container need to hold a variety of content, or reuse existing blocks?**

| Answer | Materialize as | Why |
|--------|----------------|-----|
| YES — panels are teasers/cards/mixed default content the author composes freely | **Section style** (`section-<name>`) | Top-level blocks get decorated; author drops any block in; the container is just behavior+layout over them |
| NO — the container IS the content, fixed simple shape (e.g. image-only slides) | **Block** | Self-contained, no nested blocks needed; cheaper to author + test |

- **Tabs / accordion** → usually **section style**. Their whole point is switching between arbitrary rich panels (which often want to be teasers/cards). A tabs *block* can only render flat cell content, never real blocks → inner content shows up unstyled.
- **Carousel / slider of simple uniform items** (image-only cards, logo slides) → usually a **block**. The slides are a fixed simple shape with no need to be other blocks. Opposite case: keep it a block.
- Litmus: "Would an author ever want a *teaser* (or any block) as one panel/slide?" YES → section style. NO → block.

## Recipe — converting a container block to a section style

1. **JS hook** `scripts/section-tabs.js` (or `section-accordion.js`): `export default function(main){ main.querySelectorAll('.section.section-<name>').forEach(decorate); }`. In `decorate`, the panels are the section's top-level block wrappers (`child.matches('[class$="-wrapper"]')` and NOT `.default-content-wrapper`). Build the nav, lift each panel's leading heading into the control label, toggle `[hidden]`/`aria-selected`, add keyboard support.
2. **Wire it** in `scripts/scripts.js` `decorateMain()` AFTER `decorateBlocks(main)` — block wrappers exist synchronously from `decorateSections`, so the hook runs even before async block JS loads.
3. **CSS**: generic structure (nav layout, `[role=tabpanel][hidden]{display:none}`) in `lazy-styles.css` scoped `.section.section-<name>`; per-page look scoped under the template class.
4. **Parser**: emit intro as default content, then ONE block per panel (e.g. `Teaser (teaser-dark)`), then `addSection(wrapper, 'section-<name>')` for the Section Metadata. Each panel block's first heading = its tab label.
5. **Delete the old block** dir and its `page-templates.json` mapping (`blocks: ["<block>"]` → the panel block; `style: "section-<name>"`).

## Pitfalls
- Building the container as a block "just for now" → its inner teasers/cards never decorate (no JS runs on them); content renders unstyled. The fix is structural, not CSS.
- Running the hook before `decorateSections` → no `.section` wrappers yet, nothing matches.
- A media-less panel block may render an empty media half → add a text-only fallback class in the block JS (e.g. `teaser-text-only` collapses the grid to one column).

See also: `eds-content-modeling` (the augmented-styles ladder + section-style-vs-block color/surface rule), `marker-driven-import` (emitting section styles + per-panel blocks from the parser), `debug-block-decoration` (when a real nested block isn't decorating).
