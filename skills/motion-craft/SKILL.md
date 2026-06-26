---
name: motion-craft
description: The positive method for adding purposeful motion when migrating a brand — reproduce the source's motion voice, spend the motion budget on the few moments that earn it (feedback, state-change, one signature entrance), pick duration by role and ease-out (never bounce/elastic), and keep it accessible + performant. Use when building/refining a block's transitions, when a page feels static or (worse) over-animated with fade-rise-on-every-section, or when deciding whether a motion is worth adding. Adapted from impeccable.style's animate. Defers hard thresholds to craft-floor's motion rules.
---

Motion conveys state, gives feedback, and clarifies hierarchy — it is not decoration. A migration **reproduces the source's motion voice** (does the brand move confidently, calmly, playfully?) and regularizes it; it does not invent choreography the source never had. This is the *positive method*; `craft-floor` owns the thresholds (reduced-motion guard, no-bounce easing, tokenized durations) — clear those, don't restate them.

## The motion budget — spend it where it earns its place
One well-rehearsed entrance beats scattered micro-interactions. Before adding any motion, name *why* it's there:
- **Feedback** — an action with no visual acknowledgment (button press, form submit, copy). Almost always worth it.
- **State-change** — smoothing a jarring instant swap (menu open, tab switch, expand/collapse, show/hide).
- **One signature moment** — at most one hero/entrance per page, if the brand's voice calls for it.
- **Everything else is a candidate for cutting.** Animation fatigue is a real cost.

## The AI tell to refuse
**Fade-and-rise reveal on every scrolled section is the #1 generative-design tell — match-and-refuse it.** A whole section fading up on scroll is not a list and is not choreography; it just delays content. If you're about to add `opacity:0 → translateY` on each section as it enters the viewport — stop. Legitimate scroll motion is a **sibling stagger** within a genuine list (cards in a grid, list items): cap it (10 items × 50ms = 500ms total; reduce per-item delay or cap the count beyond that), use `animation-delay: calc(var(--i) * 50ms)`, and **the default must already be visible** (never gate content visibility on a class-triggered transition — it never fires on hidden tabs / headless renders and ships the section blank → `craft-floor` craft-motion-intentional).

## Duration by role (the 100/300/500 feel)
Timing matters more than easing for "feels right". Pick by what's moving, then tokenize it (`craft-floor` craft-motion-duration-token):

| Duration | Role |
|----------|------|
| 100–150ms | instant feedback — button press, toggle, color shift |
| 200–300ms | state change — menu/tooltip/hover, tab indicator |
| 300–500ms | layout change — accordion, modal, drawer |
| 500–800ms | the one entrance — hero reveal (only if earned) |

- **Exit ≈ 75% of enter duration** — leaving feels quicker than arriving.
- **Ease-out, never bounce/elastic** (dated, draws attention to itself — `craft-floor` craft-motion-intentional owns the curve list). Reserve `ease-in`/`ease-in-out` for exits.

## Animate cheap properties; never layout casually
- `transform` + `opacity` are the reliable default. `filter`/`backdrop-filter`/`clip-path`/`mask`/`box-shadow` are legitimate for depth/glass/wipes **when verified smooth and bounded to a small area** (`contain` where it helps).
- **Never casually animate `width`/`height`/`top`/`left`/margins.** Expand/reflow via `grid-template-rows` (0fr→1fr) or a FLIP transform, not animated `height`.
- `will-change` only on the `:hover`/`.animating` state, never blanket across the page.
- Scroll triggers use **IntersectionObserver, unobserved after firing once** — not scroll listeners.

## EDS notes
- The project ships a **global `prefers-reduced-motion` guard** (`*` in styles.css) — a new block's animation is covered site-wide, but still verify (`craft-floor` craft-motion-reduced).
- Durations come from the project transition tokens (`PROJECT-DESIGN.md`), not magic numbers.
- Don't add page-load choreography to a migrated marketing page; the content is the point, and lazy-loaded blocks make orchestrated entrances unreliable.

## Recipe
1. Button / interactive element hover: `transition: background-color 150ms ease-out, box-shadow 150ms ease-out` — never transition `all`.
2. Overlay / dropdown open: `transition: opacity 200ms ease-out, transform 200ms ease-out, visibility 200ms` with `visibility: hidden → visible` (not `display: none`).
3. Section entry (scroll-reveal): delegate to `scroll-reveal-animations` for the IntersectionObserver mechanics; keep duration ≤400ms.
4. Never animate `height` or `width` — use `max-height` or `transform: scaleY()` to avoid layout recalc.
5. Wrap the entire motion block in reduced-motion guard:
   `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
6. Verify: toggle `prefers-reduced-motion: reduce` in DevTools — all motion must stop; functional state changes (dropdown open/close) must still work via `visibility`, not motion.

## Verify
- [ ] Every motion has a named reason (feedback / state-change / the one entrance) — the rest cut.
- [ ] No fade-rise-on-every-section; scroll motion is a capped sibling stagger over a real list, default already visible.
- [ ] Duration matches role and is a token; exit ≈ 75% of enter; ease-out (no bounce/elastic).
- [ ] Only transform/opacity (or bounded filter/clip) animated — no casual layout-property animation.
- [ ] `craft-floor` motion rules clear (reduced-motion guard, intentional, tokenized duration).

## Pitfalls
- Inventing motion the source brand never had — reproduce its voice, don't impose choreography.
- Fade-rise on every section (the tell) instead of one earned entrance + real feedback.
- Animating `height`/`width` for expand/collapse → jank; use `grid-template-rows` or FLIP.
- Gating content visibility on a scroll/hover class → blank section on hidden tabs and headless renders.

See also: `craft-floor` (the motion thresholds this method must clear — reduced-motion, intentional, duration-token), `interaction-states-eds` (the state set that motion gives feedback for), `responsive-adaptation` (motion on touch — `@media (hover: none)`), `global-style-foundation` (foundation pass this sits under)
