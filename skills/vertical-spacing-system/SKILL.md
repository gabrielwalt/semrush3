---
name: vertical-spacing-system
description: EDS vertical spacing system — section padding plus the `* + *` block-margin rule, and the section/block spacing variants. Use when blocks touch with no gap, sections are too far apart, page rhythm is off, or position:sticky fails because an ancestor has overflow:hidden. Extends helix `building-blocks`.
---

This is the **foundation** of augmented styles (rung 1 in `eds-content-modeling`): the default vertical-margin system that makes any page typographically harmonious with zero authoring. Get it solid before reaching for variants. Sections use padding for vertical rhythm. Blocks/elements are spaced via `margin-top` on the universal `* + *` sibling selector. First/last child margins are zeroed so section padding handles the edges.

## Token values
Two tokens drive the system — `--section-padding` (section vertical rhythm) and `--block-padding` (between siblings inside a section), each with a smaller mobile value below the project's mobile breakpoint. See `PROJECT-DESIGN.md` for the actual values and breakpoint.

## The pattern (styles.css)
```css
main > .section { margin: 0; padding: var(--section-padding) 0; }
main > .section > * + * { margin-top: var(--block-padding); }
main > .section > *:first-child { margin-top: 0; }
main > .section > *:last-child { margin-bottom: 0; }
```

## Section style variants (via Section Metadata)
Common reusable section styles that adjust spacing/appearance — e.g. `section-flush` (`padding: 0`, for full-bleed blocks), `section-dark` (dark bg, light text), `section-centered` (centered flex column). See `eds-content-modeling` for the section-style naming convention and `PROJECT-DESIGN.md` for the set this project defines.

## Universal block spacing variants (via block class name)
These are the canonical **universal variants** — they apply to ANY block (the sibling-spacing example from the augmented-styles ladder). Prefix `block-`-style intent; apply by adding the class to the block name in authoring (e.g. `Carousel (spacing-top-small)`).
`spacing-top-none/small/large`, `spacing-bottom-none/small/large` — uses `:has()` selector to reach from wrapper to block class. Because they work on every block, define them once globally and never duplicate per-block.

## Pitfalls
- `main > .section > div { margin: auto }` overrides `* + *` because `div` has higher specificity — use `margin-left: auto; margin-right: auto` instead
- Block CSS must NOT set `padding-top/bottom` on the section container — the global rule handles it
- `overflow: hidden` on `html/body` breaks `position: sticky` — use `overflow-x: clip` instead. `overflow-x: clip` is the canonical fix when a section needs clipping AND has sticky children — full rule in `css-pitfalls-eds`.

See also: `eds-content-modeling` (where this fits in the augmented-styles ladder), `eds-dom-structure`, `full-width-escape-hatch`, `carousel-pattern-eds`. Native `building-blocks` covers the same ground at a generic level — this skill adds the two-token `* + *` pattern, the universal spacing variants, and the `overflow-x: clip` sticky fix.
