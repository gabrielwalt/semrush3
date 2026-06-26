---
name: responsive-adaptation
description: Adapt an imported design across devices and input methods — not just scale it down. Detect input method (pointer/hover) not just screen size, use content-driven mobile-first breakpoints, art-direct responsive images, and guard against author-content overflow. Use when making an imported page work on mobile/touch, when a hover-only interaction breaks on touch, when long author-entered text blows out a block, or for any responsive refinement pass. Adapted from impeccable.style's adapt. Extends helix `building-blocks`.
---

The trap is treating responsive as *scaling pixels*. The job is **rethinking the experience for the new context** — a desktop layout faithfully imported still needs deliberate adaptation for touch and small screens. Reproduce the source's responsive intent where it has one; where the source is weak (desktop-only), adapt it properly.

## Detect input method, not just screen size
Screen size doesn't tell you the input method (a laptop can have a touchscreen; a tablet can have a keyboard). Gate behavior on capability:
```css
@media (pointer: coarse) { .button { padding: 12px 20px; } } /* touch → bigger target */
@media (hover: hover)   { .card:hover { transform: translateY(-2px); } } /* mouse → hover ok */
@media (hover: none)    { /* touch → NO hover-only reveal; use active/visible state */ }
```
**Critical: never gate functionality on hover — touch users can't hover.** This directly affects our mega-menu/nav (`nav-header-eds`): a dropdown that only opens on hover is unusable on touch. Touch targets are **≥44×44px** (expand the hit area, not the visual — see `layout-craft`).

## Adapt, don't scale (desktop → mobile)
- Multi-column → **single column / vertical stack**; fixed widths → full-width.
- **Progressive disclosure**: prioritize primary content; push secondary into `<details>`/accordions/tabs. `<details>/<summary>` is a zero-JS collapse.
- Complex top/side nav → hamburger/drawer (our nav already does this — verify the touch path).
- Don't *hide* core functionality on mobile (`display:none` still downloads and removes access) — make it work.
- Keep the **same information architecture** across contexts; don't build a divergent mobile IA.

## Content-driven, mobile-first breakpoints
- Write **mobile-first** (`min-width` queries) — base styles for narrow, layer complexity up.
- **Let content choose breakpoints**: start narrow, widen until the design breaks, add a breakpoint there. Don't chase device sizes. Breakpoints are in `PROJECT-DESIGN.md` — 640/768/1024 usually suffice.
- Use `clamp()` for fluid values that need no breakpoint; container queries for components that adapt to their container (`layout-craft`).
- `env(safe-area-inset-*)` + `viewport-fit=cover` for notched phones where relevant.

## Responsive images
- **`srcset` + `sizes`** for resolution switching (browser picks by viewport × DPR):
  ```html
  <img src="hero-800.jpg" srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
       sizes="(max-width: 768px) 100vw, 50vw" alt="...">
  ```
- **`<picture>`** for *art direction* — a different crop/composition at mobile vs desktop (not just a smaller file). EDS handles much of `srcset` automatically; reach for `<picture>` only when the crop must change.

## Guard author-entered content (overflow resilience)
Authored CMS text can be far longer than the sample content. Make blocks survive it:
- `min-width: 0` on flex/grid children — without it a long unbroken word blows out the track.
- `overflow-wrap: break-word` (and `hyphens: auto` where appropriate) on text containers.
- `-webkit-line-clamp` to cap multi-line text where the design needs a fixed height.
- Avoid fixed widths on text containers; test each block with a deliberately long string.

## Verify
- [ ] Tested the actual breakpoints (`measure-then-implement` at each) — not just eyeballed one width.
- [ ] No interaction depends on hover; touch path works (`@media (hover: none)` covered); targets ≥44px.
- [ ] Mobile-first `min-width`; breakpoints placed where the design breaks, per PROJECT-DESIGN.
- [ ] Long author text doesn't overflow any block (`min-width:0` + `overflow-wrap`).
- [ ] Core functionality present on every context (nothing hidden away on mobile).

## Pitfalls
- Scaling a desktop layout down instead of rethinking it (cramped, unusable touch targets).
- A hover-only dropdown/reveal that dies on touch — the most common responsive bug in imported designs.
- Trusting DevTools emulation only — it misses real touch, CPU, and font-rendering differences; check a real device when possible.

See also: `nav-header-eds` (hover-vs-touch nav, the hamburger/drawer path), `measure-then-implement` (measure each breakpoint, don't guess), `layout-craft` (44px hit-area, container queries, single-column reflow), `vertical-spacing-system` (mobile section/block spacing), `PROJECT-DESIGN.md` (the project's breakpoints).
