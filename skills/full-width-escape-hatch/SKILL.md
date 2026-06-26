---
name: full-width-escape-hatch
description: Global max-width container constraint and the full-width escape hatch. Load when setting up the container/centering pattern, a block needs to escape max-width, about to write !important on a wrapper, or need a full-bleed background.
---

Never use `max-width: none !important` or `padding: 0 !important` on block wrappers. The `.full-width` utility class handles this globally and cleanly.

## The container constraint (where max-width lives)
Sections (`main > .section`) have NO max-width — they span the full viewport so backgrounds can bleed edge-to-edge. The constraint goes on the block wrapper div:
```css
main > .section > div {
  max-width: var(--container-max-width);
  margin: auto;
  padding: 0 var(--container-padding);
}
```
A full-width block opts out by adding `.full-width` to its wrapper (recipe below).

## Recipe
```js
// In the block's decorate() function:
const wrapper = block.closest('[class$="-wrapper"]');
if (wrapper) wrapper.classList.add('full-width');
```

In `styles.css` (already defined globally — do NOT repeat in block CSS):
```css
main > .section > .full-width {
  max-width: none;
  padding: 0;
}
```

That's it. No CSS changes needed in the block file.

## When to use
- Block needs viewport-width bleed (marquee, announcement bar, video hero)
- Section background color must reach the viewport edge
- Any time you're tempted to write `max-width: 100% !important`

## Pitfalls
- Setting `.full-width` on the block itself (not the `-wrapper`) — it must be on the `-wrapper` element
- Repeating the `.full-width` CSS rule in the block's own CSS — it's global, don't duplicate
- Blocks without a `decorate()` JS file need a minimal JS file added to set the class
- Using `!important` in block CSS — violates project rules, use this pattern instead

See also: `eds-code-conventions` (no !important rule), `eds-dom-structure` (wrapper chain)
