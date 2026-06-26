---
name: carousel-pattern-eds
description: Build a horizontal scroll-snap carousel/slider in EDS that bleeds past the right viewport edge with a left edge aligned to the content column. Use when building a card slider or carousel, or when scroll-snap cards won't offset/peek correctly. Covers the max() left-margin formula and section overflow clipping. Extends helix `building-blocks`.
---

Carousels use section-level overflow clipping, margin-based left alignment, and last-child margin for right spacing. The wrapper escapes the global max-width container.

## Recipe
1. **Section clips**: `.carousel-container { overflow: hidden }` — the section is the clipping boundary. Cards bleed past the visible area but are clipped, creating the "peek" effect where the next card is partially visible.
2. **Wrapper escapes container**: `.carousel-wrapper.full-width` — JS adds `full-width` class to remove max-width constraints.
3. **Slider left alignment via `max()` margin** (not padding): `margin: 0 0 0 max(var(--container-padding), calc((100vw - var(--container-max-width)) / 2))` — this formula ensures the first card aligns with the content area's left edge at ALL viewport widths. At narrow viewports, `container-padding` wins. At wide viewports (>1440px), the `calc` centers the offset to match the max-width container. Padding on `overflow-x: auto` flex containers does NOT reliably offset scroll-snap items — use `margin-left` on the slider itself.
4. **Last card right spacing via margin**: `.carousel > div:last-child { margin-right: var(--container-padding) }` — instead of `padding-right` on the track (which has the same scroll-snap problem).
5. **Track scrolls**: `display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none`
6. **Cards**: `flex-shrink: 0; scroll-snap-align: start` — set card width to match the design (measure the original; see `measure-then-implement`).
7. **Nav buttons** placed in `.default-content-wrapper` via JS, positioned with `position: absolute; right: container-padding; bottom: 0` to bottom-align with the section heading. Hidden below the project's desktop breakpoint (`PROJECT-DESIGN.md`).

## Pitfalls
- **Never use `padding` on the scrollable container for first/last card offset** — `padding` on an `overflow-x: auto` flex container doesn't work reliably with `scroll-snap-type: x mandatory`. The first card snaps to position 0 of the scroll area, overlapping the padding. Use `margin-left` on the container and `margin-right` on the last child instead.
- **Section `overflow: hidden` is required** — without it, the cards extend past the viewport and there's no peek/clip effect.
- **Don't put nav buttons inside the scrollable area** — they'll scroll with the cards. Place them in the section header area outside the block.
- **On touch devices a horizontal swipe can trigger browser back/forward navigation** — set `overscroll-behavior-x: contain` on the scroll track to keep the gesture inside the carousel.

## How the original site works
The original site uses Swiper.js with `overflow: visible` on the swiper container and `overflow: hidden` on the parent `<section>`. The EDS implementation achieves the same effect with native scroll-snap + section overflow clipping.

See also: `full-width-escape-hatch` (container constraint + full-width escape hatch), `eds-dom-structure` (wrapper chain). Native `building-blocks` covers the same ground at a generic level — this skill adds the `max()` left-margin formula and native scroll-snap approach for this project's Swiper-to-EDS migration.
