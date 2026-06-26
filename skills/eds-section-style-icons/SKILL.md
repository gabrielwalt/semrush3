---
name: eds-section-style-icons
description: Inject decorative icons or images into sections via CSS pseudo-elements bound to section style classes. Use when a section needs a visual element (icon, badge) that shouldn't be in authored content.
---

Use a `::before` or `::after` pseudo-element on the section's `.default-content-wrapper` to inject decorative visuals tied to a section style class.

## Recipe
```css
/* Bind to the section style class (not the block class) */
.section.section-featured > .default-content-wrapper::before {
  content: '';
  display: block;
  width: 136px;
  height: 136px;
  margin: 0 auto 32px;
  background: url('/icons/my-icon.svg') no-repeat center / contain;
}
```

Place the icon SVG in `/icons/`. The pseudo-element is purely decorative — no content authoring needed.

**Note:** Always bind to the section's style class(es), not to a block-specific class. This makes the icon reusable across any block in sections with that style.

## Variant — same glyph repeated per item (e.g. a badge before every list item)
When the original shows the SAME decorative mark on every card/row (e.g. an award badge left of each label), it's still code, not content (one repeated glyph the author doesn't manage). Bind `::before` to the REPEATING element and size it with `flex: 0 0` so it sits inline beside the text:
```css
.cards-awards .cards-awards-card-body::before {
  content: '';
  flex: 0 0 50px;      /* fixed track so the label flows beside it */
  width: 50px; height: 54px;
  background: url('/icons/award-badge.svg') no-repeat center / contain;
}
```
First copy the source's inline SVG verbatim into `/icons/` (the html2md import pipeline strips inline SVGs, so they never reach the content). If badges DIFFER per item, they're author-managed content — author them as images instead.

## Pitfalls
- Icons in `/icons/` are served locally by the dev server. Icons in `/content/images/` come from remote and may 404 locally.
- Use `::before` for icons above the heading, `::after` for below.
- Don't bind to the block class (e.g., `.stats-visibility`) — this prevents the icon from appearing in other blocks within the same styled section.

See also: `eds-content-modeling` (section styles), `page-template-metadata` (page-level styling)
