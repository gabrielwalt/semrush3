---
name: css-specificity-eds
description: Diagnose why a CSS rule isn't winning in EDS — block wrappers carry !important on padding/max-width, and attribute selectors like [aria-expanded] outrank plain classes. Use when a rule isn't applying, the computed style shows an unexpected value, or a low-specificity selector (e.g. `* + *`) is being overridden.
---

EDS block wrappers carry `!important` on `padding` and `max-width`. Attribute selectors (`[aria-expanded='true']`) add specificity that beats plain class selectors.

## Debugging recipe
1. Inspect the element's computed style in the browser
2. Check what rule IS winning (look for `!important`, attribute selectors, or more-specific class chains)
3. Match or exceed that specificity in your fix

## Common fixes
| Problem | Why it fails | Fix |
|---------|-------------|-----|
| Block-spacing `* + *` margin overridden | The project rule is `main > .section > * + *` (styles.css) — a class rule on the same element beats it | Raise specificity by keeping the `main > .section >` descendant chain, or override with an equally-specific selector — do NOT switch to `[class$="-wrapper"]` |
| Desktop `display: flex` overridden | `[aria-expanded='true']` has higher specificity | Include the attribute selector in your desktop rule too |
| Block wrapper ignores your padding | Wrapper has `padding: 0 !important` | Use margin on the wrapper, or inner element padding |

See also: `debug-block-decoration` (if content/items are *missing or wrong* rather than mis-styled, the bug is in `decorate()` JS, not the cascade), `eds-dom-structure` (where EDS places block wrappers/classes the specificity chain targets)
