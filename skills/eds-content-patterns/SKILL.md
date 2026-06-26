---
name: eds-content-patterns
description: How EDS's runtime decoration turns authored HTML into auto-styles — content combinations that decorate predictably without a block (strong/em-link → CTA button, small-text-before-heading → eyebrow). Use when a CTA link isn't becoming a button, the button variant is wrong, an eyebrow isn't styling, or decorateButtons() isn't firing. For choosing which style to author, see eds-content-modeling. Extends helix `authoring-analysis`.
---

EDS transforms authored HTML patterns into decorated elements at runtime — these are **auto-styles** (rung 2 of the augmented-styles ladder in `eds-content-modeling`): specific combinations of *default content* that decorate predictably with no block needed. The principle: an auto-style must feel logical to authors and never surprise them — keep the trigger conditions tight so it never fires when unintended. The most common auto-style: links wrapped in `<strong>` or `<em>` become styled CTA buttons.

## CTA button decoration
```html
<p><strong><a href="...">Get started</a></strong></p>  → .button.primary
<p><em><a href="...">Learn more</a></em></p>           → .button.secondary
<p><strong><em><a>Try now</a></em></strong></p>         → .button.accent
<p><a href="...">Plain link</a></p>                     → no button, stays a link
```

The wrapping element (`<strong>`, `<em>`) determines the button variant. Import parsers must detect the visual weight of source CTAs and apply the matching wrapper — never hardcode one style.

## Eyebrow auto-style
A small line of text immediately *before* a heading is the eyebrow (kicker/pre-title). Author it as a plain short paragraph directly above the heading in default content — not inside a block, and not as its own heading level.
```html
<p>Stats and facts</p>   → eyebrow (small, uppercase, brand accent)
<h2>The data you need…</h2>
```
Style via the adjacency selector so it only fires in the intended position — keep the trigger tight (small text *directly* before a heading) so a normal paragraph never accidentally becomes an eyebrow:
```css
/* eyebrow = short <p> immediately preceding a heading */
.default-content-wrapper > p:has(+ h2),
.default-content-wrapper > p:has(+ h3) { /* eyebrow styling */ }
```

## Why a link isn't becoming a button
1. Missing wrapper — `<a>` must be inside `<strong>` or `<em>` inside a `<p>`
2. Extra text in the paragraph — `decorateButtons()` checks `p.textContent.trim() !== linkText` and skips if the `<p>` contains other text besides the link
3. `:only-child` false match — CSS `:only-child` ignores text nodes, so `p > a:only-child` matches even when there's text before the link. Use JS `p.textContent.trim() === a.textContent.trim()` instead

## Adjacent item borders (avoiding double borders)
```css
.item { border-top: 1px solid var(--border-color); }
.item:last-child { border-bottom: 1px solid var(--border-color); }
/* NOT border-top + border-bottom on every item — that doubles the visible border */
```

## Lint gotchas
- Font family names must NOT be quoted: `font-family: Inter, sans-serif` (not `'Inter'`)
- Vendor prefixes (`-webkit-`) fail `property-no-vendor-prefix` — remove unless absolutely needed
- `no-descending-specificity` — order selectors from least to most specific

## Pitfalls
- Block JS must not strip button formatting — style `.button` elements within the block's CSS scope
- EDS runs `decorateButtons()` globally during page load — blocks decorated later must call it explicitly if they inject new content

See also: `eds-content-modeling` (CTA type decisions), `css-specificity-eds` (specificity issues).
