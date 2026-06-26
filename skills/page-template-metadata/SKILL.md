---
name: page-template-metadata
description: Apply page-wide styles in EDS via a template metadata class on <body>. Use when one page type needs different styling from another and you need a body-level class (e.g. body.homepage) to scope CSS — instead of :has() or per-block overrides. Extends helix `content-modeling`.
---

EDS reads `<meta name="template">` and applies it as a class on `document.body`. A page template is the top rung of the augmented-styles ladder (see `eds-content-modeling`) — the mechanism is below; the *when-to-create* decision is the important part.

## When to create a page template (be conservative)
- Only when **many things change together** page-wide, so one template replaces a pile of per-block variants + section styles the author would otherwise apply by hand (e.g. a blog template that auto-blocks title/paragraph/image into a blog header AND restyles carousel/tabs for blog pages). The author applies one template instead of remembering N tweaks.
- It should be **obvious** a template is needed: a clearly distinct page type with its own rules. Detect from many signals changing together across a set of pages — not a single difference (a single difference is a section style or variant).
- **Keep the count low.** Prefer climbing back down the ladder (section style, variant, auto-style) before adding a template.
- **Exception — throw-away templates:** fine for bespoke landing/campaign pages. Mark with the `oneoff-` prefix, a header comment stating scope + which page(s), and an entry in the `PROJECT-BLOCKS.md` one-off registry. Delete when those pages go.

## Recipe
1. **Author the Metadata block in content — this is the PRIMARY mechanism.** Add it as its own top-level section (the last section is fine):
```html
<div><div class="metadata">
  <div><div>template</div><div>homepage</div></div>
</div></div>
```
2. EDS `decorateTemplateAndTheme()` adds the value verbatim as a body class (here `class="homepage"`)
3. **Make the import script EMIT this metadata** so a re-import reproduces it (else the next import silently drops the template and the page loses its whole look). In the importer's afterTransformer:
```js
var meta = WebImporter.DOMUtils.createTable([['Metadata'], ['template', 'homepage']], document);
element.appendChild(meta);
```
4. Use `body.homepage main` in CSS for page-specific styles
5. **Fallback in `scripts.js` is a BACKUP only — never the sole mechanism:**
```js
if (doc.querySelector('.some-page-specific-block')) {
  document.body.classList.add('homepage');
}
```

## Pitfalls
- **Fallback-only template = fragile.** If the page works via the scripts.js fallback but has no authored metadata AND the importer doesn't emit it, the template silently breaks the day the fallback selector changes, and a re-import won't restore it. Always wire all three: authored metadata (primary) + importer emission + fallback (backup). Verify the body class comes from the metadata, not just the fallback.
- The authored Metadata block is consumed by EDS (removed from the DOM) — it must NOT render as visible text. If you see "template template-x" on the page, it's malformed (wrong cell structure or not its own section).
- Don't use `%`-based positioning for backgrounds on tall `main` elements
- `:has()` has limited browser support — prefer body classes via metadata
- Patterns in `/icons/` are local; `/content/images/` come from remote
- Reaching for a template when a section style would do — a single page-wide difference (e.g. just a background) is a section style, not a template

Naming: new templates use a `template-<page-type>` metadata value → `body.template-<page-type>`. Any pre-existing bare body classes are grandfathered (see `PROJECT-DESIGN.md`). Full convention: `eds-content-modeling`.

## Stacked templates (comma-split metadata)
`decorateTemplateAndTheme()` splits the metadata value on commas and applies each as a body class. So `template: template-dark, template-landing` → `body.template-dark.template-landing`. Use this to layer a **generic single-concern template** (e.g. `template-dark` that ONLY inverts colors, reusable by any page) under a **thin page-specific template** (type/spacing/bespoke looks). A dark template means contained blocks auto-adapt with no per-block dark variant (see `context-adaptive-blocks`). Wire the importer to emit the full comma value, and the scripts.js fallback to add BOTH classes.

See also: `eds-content-modeling` (the full augmented-styles ladder + section-style-vs-template decision), `context-adaptive-blocks` (a dark template makes contained blocks auto-invert — no per-block variant).
