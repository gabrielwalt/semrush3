---
name: scroll-reveal-animations
description: Add scroll-triggered and data animations (sibling-stagger reveal, number count-up, bar/chart fill) to an EDS site without gating content or breaking reduced-motion. Use when a migrated page feels static and the brand wants dynamic/innovative motion, when animating stat figures or charts on scroll-in, or when adding entrance reveals to card grids. The EDS-mechanics companion to motion-craft (which owns the design judgment).
---

The trap with scroll animations is **gating content on a class** — `opacity:0` in the stylesheet means a no-JS render, a headless crawler, or a reduced-motion user sees a blank section. The discipline: **content is visible by default; the hidden-then-animate state is added by JS only when motion is allowed.** This skill is the EDS recipe; `motion-craft` owns *whether/where* a motion earns its place (budget, the fade-rise tell, duration-by-role).

## Architecture (EDS)
- One module `scripts/scroll-animations.js`, `export default initScrollAnimations(main)`, imported in the **lazy phase** of `scripts.js` (after `loadSections`, so every block is decorated). Wrap in `try/catch` — animation is enhancement-only, never block the page.
- **First line:** `const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;` then `if (REDUCED) return;` in the entry — reduced-motion users get the final, visible state untouched.
- **IntersectionObserver, `unobserve` after firing once.** Never scroll listeners.
- Reveal/animate classes (`reveal-ready`, `bar-ready`) carry the hidden/transition state and are added **only by JS**; the CSS for them lives in `lazy-styles.css`.

## The three motions
1. **Sibling-stagger reveal** — only on a *genuine list* (card grid, carousel track), never a whole section (the fade-rise tell — `motion-craft`). JS adds `reveal-ready` + `--reveal-i` per item, then `reveal-in` on first view; CSS transitions `opacity`+`transform` with `transition-delay: calc(var(--reveal-i) * var(--reveal-stagger))`. Cap total stagger (~10 items).
2. **Count-up** — parse the figure preserving prefix/suffix (`28B`, `239M+`, `7.9`), animate 0→target with ease-out-quart over ~1.1s via `requestAnimationFrame`, **land exactly on the authored text** on the final frame. Set `font-variant-numeric: tabular-nums` so width doesn't jitter. Only target elements whose text *starts with a digit*.
3. **Bar / chart fill** — when a block sets bar width inline (e.g. `bar-fill.style.width`), stash it (`dataset.barTarget`), add a `width` transition class, then **zero the inline width** (inline beats CSS, so you must set `style.width='0%'` in JS), and on first view restore `style.width = dataset.barTarget` with a small per-bar `transitionDelay` cascade.

## Tokens
Add ease-out curves + reveal timing to the foundation `:root` (never magic numbers): `--ease-out-quart`/`--ease-out-expo` (motion-craft: ease-out, never bounce/elastic), `--reveal-duration`, `--reveal-stagger`. The global `prefers-reduced-motion` guard in `styles.css` is a second safety net that settles any transition.

## Verify
- [ ] Emulate `prefers-reduced-motion: reduce` → 0 `reveal-ready`/`bar-ready` classes, all content at final visible state (opacity 1, bars at real width, numbers at authored value).
- [ ] Count-up lands on the exact authored string (sample mid-flight to confirm it animates, final to confirm it lands).
- [ ] Reveal only on real lists; no section-wide fade-up.
- [ ] Desktop + mobile both animate; lint + `detect.mjs` clean.

## Pitfalls
- `opacity:0` in CSS not gated behind a JS-added class → blank section for no-JS/reduced-motion/crawlers.
- Forgetting inline width beats the stylesheet → the bar never collapses; zero it in JS.
- Counting up a worded heading → restrict to text starting with a digit.
- Re-running on scroll (listener) instead of IntersectionObserver-once → jank + repeat fires.
- Animating `width`/`height`/`top` casually elsewhere — keep to transform/opacity (and the bar's width, which is the intentional data motion). See `eds-code-conventions` perf note.

See also: `motion-craft` (the design judgment — budget, fade-rise tell, duration-by-role, ease-out), `interaction-states-eds` (hover/active feedback states that pair with these), `eds-code-conventions` (lazy-phase loading + perf guardrail), `craft-floor` (reduced-motion + duration-token rules), `measure-then-implement` (measure timings, don't guess)
