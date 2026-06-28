---
name: nav-header-eds
description: EDS nav/header patterns. Use when header is broken, nav is invisible, mega menu won't animate, sticky isn't working, or mobile/desktop state conflicts. Extends EXCAT `excat-navigation-orchestrator`.
---

Nav uses `aria-expanded='true'` on desktop (set by `toggleMenu` on init). Mobile CSS (`nav[aria-expanded='true'] .nav-sections { display: block }`) applies on desktop too unless you match that specificity in media queries.

## Fragment paths — published ROOT, never `/content/`
`header.js`/`footer.js` fetch the nav/footer fragment at the **published site root** — `/nav.plain.html`, `/footer.plain.html` — which is correct in BOTH `aem up` (serves `content/` at root) and published EDS.
- **Match-and-refuse:** about to write (or an orchestrator emitted) `/content/nav` or `/content/footer` — in `head.html` nav/footer meta, a fragment ref, or a fetch path? **Stop.** `/content/…` 404s at the EDS root. Correct `head.html` state = **no nav/footer meta** (stock default → `/nav` `/footer`) or an explicit `/nav` / `/footer`. (AGENTS.md NEVER list; the guard hook + `publish-readiness.mjs` flag a `/content/` value.)
- **Upstream note:** native `excat-navigation-orchestrator` is correct (root); native `excat-footer-orchestrator` emits the `/content/footer` model (wrong). Don't reimplement the orchestrators — if the footer one wrote `/content/`, fix the `head.html` meta to root and flag the upstream bug.
- A missing fragment **throws** (header/footer don't null-guard) — intentional, fail-loud for debugging; fix the path, never add a fallback (`eds-code-conventions`).
- **Footer structure:** don't give a footer fragment's structural wrapper divs a **block class** — EDS block-decorates them (404 for the missing `<class>.js`/`.css`, or `visibility:hidden`), which tempts no-op `decorate(){}` stubs. **Model footer columns as sections + Section Metadata**; structural wrappers stay plain divs. The stock `footer.js` only loads + appends the fragment — no per-column JS, no stubs (`eds-content-modeling` No-JS-Reconstruction; `post-import-sectionizer`).

## Quick fixes
| Symptom | Cause | Fix |
|---------|-------|-----|
| Nav items invisible on desktop | Mobile `display: block` beats desktop `display: flex` | Add `nav[aria-expanded='true']` to desktop selector |
| Chevrons below text instead of inline | `li` is block-level | `display: inline-flex; align-items: center` on `.nav-item` |
| Arrow/icon on a nav link not showing | `li > a::after` — `a` is wrapped in `<p>` | Use `li:last-child a::after` (no `>` before `a`) |
| Mega menu snaps instead of animating | Using `display: none/flex` toggle | Use `visibility + opacity + transform` with `transition` |
| Header not sticky | `position: sticky` broken by `overflow: hidden` ancestor | Use `position: fixed` with `top: var(--nav-top-offset, 0)` |
| Fixed header covers announcement bar | Announcement bar height varies | JS scroll listener: set `--nav-top-offset` to `Math.max(0, announcementRect.bottom)` |
| Gradient shows through header when dropdown opens | Only one element gets white bg | Toggle `.nav-open` on BOTH `.nav-wrapper` AND `header` element |
| Transparent bg needed on desktop | Opaque bg prevents gradient from showing through | Use `background: transparent` on desktop, `#fff` when `.nav-open` |

## Sticky header with announcement bar
```js
// In header decorate():
const announcement = document.querySelector('.announcement-bar-container');
if (announcement) {
  const updateNavOffset = () => {
    const { bottom } = announcement.getBoundingClientRect();
    navWrapper.style.setProperty('--nav-top-offset', `${Math.max(0, bottom)}px`);
  };
  updateNavOffset();
  window.addEventListener('scroll', updateNavOffset, { passive: true });
}
```
```css
header .nav-wrapper { position: fixed; top: var(--nav-top-offset, 0); left: 0; right: 0; z-index: 100; }
header { height: var(--nav-height); } /* reserves flow space */
```

## Transparent desktop background with open state
Use the project's desktop breakpoint (see `PROJECT-DESIGN.md`) for the media query — nav may switch hamburger→full-nav at a different breakpoint than content.
```css
@media (width >= <desktop-breakpoint>) {
  header .nav-wrapper { background-color: transparent; transition: background-color 0.2s ease-in-out; }
  /* Both selectors required — missing one causes gradient bleed through on the other */
  header.nav-open .nav-wrapper,
  header .nav-wrapper.nav-open { background-color: var(--nav-bg-open, #fff); }
}
```

## Mega menu animation
```css
.nav-mega-panel {
  opacity: 0; visibility: hidden; transform: translateY(-8px);
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s;
  display: flex;
  border-radius: 0 0 12px 12px;
  overflow: hidden; /* prevents promo image overflow */
}
.nav-item[aria-expanded='true'] > .nav-mega-panel {
  opacity: 1; visibility: visible; transform: translateY(0);
}
```

## Pitfalls
- The nav fragment loads as an ordered list of sections (typically brand / nav-sections / tools) and the decorate code maps classes by index — if the authored content reorders sections, the classes map to the wrong region. Check the project's nav block for the expected order.
- `position: sticky` silently fails if ANY ancestor has `overflow: hidden` — use `fixed` instead, or `overflow-x: clip` on the ancestor (see `vertical-spacing-system`)
- Pages without announcement bar need `--nav-top-offset` to default to `0` (CSS fallback handles this)
- Mobile: `closeOnFocusLost` fires with `e.relatedTarget === null` on tap — `nav.contains(null)` returns false, incorrectly closing menu. Fix: `if (!isDesktop.matches) return;` at top of `closeOnFocusLost`
- Mobile click delegation: nav item click handlers must guard against mega-panel clicks with `if (e.target.closest('.nav-mega-panel')) return;` — otherwise clicking headings, text, or list items inside panels bubbles up and closes the menu

See also: `vertical-spacing-system` (sticky/overflow rule), `interaction-states-eds` (dropdown overflow-clipping + hover-vs-touch + focus states), `debug-eds-publish` (nav/footer 404 or blank after publish), `eds-dom-structure` (visibility-reveal lifecycle behind a blank nav/footer)
