---
name: interaction-states-eds
description: Make every interactive element in a migrated EDS site complete and accessible across its states — design all eight interactive states (not just hover), use :focus-visible never bare outline:none, never use a placeholder as the only label, and avoid the overflow-clipping bug that hides absolutely-positioned dropdowns/mega-menus. Use when building or auditing a CTA, form field, nav dropdown, carousel control, tab, or any clickable element; when a dropdown/menu is clipped or invisible; or when a focus ring is missing. Adapted from impeccable.style's interaction-design, framed for EDS vanilla JS/CSS. Extends helix `building-blocks`.
---

A migrated element that only has a default + hover look is incomplete — keyboard users never see hover, and authored forms/menus break in states the source sample never exercised. Design the **full state set**, and avoid the two bugs that hide interactive content entirely (no focus ring, clipped overlay).

## The eight interactive states — design each that applies
Not every element needs all eight, but you must *decide* each, not default to hover-only:

| State | When | Treatment |
|-------|------|-----------|
| **Default** | at rest | base styling |
| **Hover** | pointer over (`@media (hover: hover)` only) | subtle lift / color shift — never the only affordance |
| **Focus** | keyboard / programmatic | visible `:focus-visible` ring (below) |
| **Active** | being pressed | pressed-in / darker |
| **Disabled** | not interactive | reduced opacity, `cursor: not-allowed`, no pointer events |
| **Loading** | processing | spinner / skeleton (forms, async CTAs) |
| **Error** | invalid | message + icon **below** the field, `aria-describedby` link |
| **Success** | completed | confirmation (check / color) |

**The common miss: designing hover without focus.** They're different — fix both. Hover lives behind `@media (hover: hover)` so it never sticks on touch (`responsive-adaptation`); functionality must never depend on hover.

## Focus rings: never bare `outline: none`
Removing the outline with no replacement is a WCAG violation. Use `:focus-visible` so only keyboard users see it:
```css
.btn:focus { outline: none; }              /* drop the default for mouse/touch */
.btn:focus-visible {                        /* keyboard only */
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
```
Ring: ≥2px, offset (outside the element), ≥3:1 contrast against adjacent colors, **consistent across every interactive element** — not buttons only (`craft-floor` craft-state-focus owns the floor). EDS ships a global `:where(...):focus-visible` ring in styles.css; a new custom control just needs to not override it away.

## Placeholders are not labels
A placeholder disappears on input and fails contrast as a label. **Always give an input a real label** — visible `<label>`, or `aria-label` when the design has no room for visible text (our search-style inputs). This is a real WCAG 4.1.2 gap, not a nicety; the detector/a11y pass flags unnamed inputs. Validate on **blur**, not every keystroke; put the error **below** the field.

## The dropdown/overlay clipping bug (mega-menu, tooltips, popovers)
**The single most common generated-code bug:** an `position: absolute` dropdown inside an ancestor with `overflow: hidden`/`auto`/`scroll` gets **clipped** — the menu is there but invisible/cut off. This bites our mega-menu and any card-hover popover.
- **Fix order:** (1) remove the unnecessary `overflow` on the ancestor if it isn't doing real work; (2) if the overflow must stay, lift the overlay out of the clip — `position: fixed` (escapes ancestor overflow) positioned from the trigger's `getBoundingClientRect()`, or the native **Popover API** (`popover` attribute puts it in the top layer, above all overflow/z-index, with light-dismiss for free).
- Don't paper over it by deleting a *needed* `overflow: hidden` elsewhere (e.g. a carousel clip) — fix the specific ancestor in the overlay's chain. See `vertical-spacing-system` (sticky also dies under ancestor `overflow:hidden`) and `nav-header-eds`.
- **44×44px minimum touch target** even when the visual is smaller — expand the hit area with a pseudo-element, don't inflate the visual (`layout-craft`).

## Verify
- [ ] Every interactive element has focus (`:focus-visible`), not just hover; hover gated to `@media (hover: hover)`.
- [ ] No bare `outline: none` without a `:focus-visible` replacement.
- [ ] Every input has a real label or `aria-label`; errors below the field, validate on blur.
- [ ] Dropdowns/menus not clipped by an ancestor `overflow`; touch targets ≥44px.
- [ ] Disabled/loading/error/success designed where the element can reach them (forms, async CTAs).

## Pitfalls
- Hover-only affordance → invisible to keyboard, sticky on touch.
- `outline: none` with no replacement → keyboard users lose all focus indication (WCAG fail).
- Placeholder as the only label → disappears on input, fails contrast, unnamed for AT.
- Absolute dropdown clipped by an ancestor's `overflow` → "the menu doesn't show" — fix the overflow chain or lift to fixed/popover, don't just bump z-index.

See also: `nav-header-eds` (mega-menu hover/touch + clipping in practice), `responsive-adaptation` (hover-vs-touch gating, 44px targets), `craft-floor` (craft-state-focus + reduced-motion floors), `motion-craft` (the feedback motion these states use), `layout-craft` (44px hit-area expansion). Native `building-blocks` covers the same ground at a generic level — this skill adds the eight-state framework, the overflow-clipping dropdown fix, and WCAG-grounded placeholder/focus-ring rules.
