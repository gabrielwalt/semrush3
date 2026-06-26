---
name: measure-then-implement
description: Pixel-matching an original site's dimensions, spacing, colors, hover states, or responsive behavior. Measure programmatically before implementing — never guess a px value or color from memory.
---

If you don't know a value, measure it — never guess. Guessing creates a correction loop (too big → too small → still wrong) that costs multiple prompts. Pixel-match requires measuring programmatically, not eyeballing. Hover colors come from stylesheet rules (can't trigger `:hover` via JS).

## When to measure (not guess)
- Any specific px value: font-size, height, width, padding, gap, margin
- Any color that isn't a project design token
- Any animation duration or easing
- Logo, icon, or image sizes
- Always measure the ORIGINAL site, not your own implementation

## Recipe
```js
// Dimensions & spacing
const rect = el.getBoundingClientRect();
const style = window.getComputedStyle(el);
const gap = sibling2.getBoundingClientRect().left - sibling1.getBoundingClientRect().right;

// Hover colors (from stylesheets)
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (rule.selectorText?.includes(':hover')) { /* read rule.style */ }
    }
  } catch (e) { /* cross-origin */ }
}
```

**Workflow:** Measure at desktop breakpoint → implement → measure at each smaller breakpoint → add overrides → verify match. See `PROJECT-DESIGN.md` for project breakpoints.

## Responsive verification
Verify at every project breakpoint (widths in `PROJECT-DESIGN.md`). Use playwright:
```js
await page.setViewportSize({ width: desktopWidth, height: 900 });
const s = await page.evaluate(() => {
  const el = document.querySelector('.target');
  return { width: el.getBoundingClientRect().width, padding: getComputedStyle(el).padding };
});
// Repeat at each breakpoint
```
Common EDS pattern is mobile-first: base styles, then `@media (width >= tabletBreakpoint)` then `(width >= desktopBreakpoint)`.

## Pitfalls
- "Approximately 50px" is a guess, not a measurement
- Screenshot comparison misses letter-spacing, line-height, and sub-pixel differences
- `duration: 0s` in computed style usually means JS-controlled — use CSS transitions instead
- SVG `naturalWidth`/`naturalHeight` may be much larger than visual content
- Background SVG positions change per breakpoint — check each one
- Nav uses a different breakpoint than content for the hamburger/full-nav switch — see `nav-header-eds`

See also: `nav-header-eds` (nav-specific breakpoint behavior), `regression-guard` (check siblings didn't move)
