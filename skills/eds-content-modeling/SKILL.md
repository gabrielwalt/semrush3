---
name: eds-content-modeling
description: The authoritative decision framework for "augmented styles" — how to model authored content in EDS using a small set of baseline blocks expanded by variants, section styles, and page templates. Use when planning a block's authoring structure, deciding block vs variant vs section style vs template, or naming any of them. Not for debugging how EDS renders content (see eds-content-patterns).
---

Keep a **small set of baseline blocks**; expand with variants, section styles, and templates. Escalate only when a lower rung can't express it — lower rungs are cheaper to author and test. Goal: minimize the variant × section-style × template test matrix.

## The ladder (escalate only when the lower rung can't express it)

1. **Foundation — default content + brand styles.** The type scale, body text, images, lists, links, and the vertical-margin system that makes the page harmonious with zero authoring. Build this solid first. See `vertical-spacing-system`.
2. **Content-driven defaults (auto-styles / auto-blocks).** Specific *combinations of default content* decorate predictably — link emphasis → CTA style, small-text-before-heading → eyebrow, certain sequences → an auto-block. Must feel logical and never surprising. See `eds-content-patterns`.
3. **Blocks.** Semantic units the author reaches for deliberately.
4. **Block variants** (three tiers — see below).
5. **Section styles** — styling that spans multiple blocks AND default content.
6. **Page templates** — page-wide changes; create conservatively.

## Naming convention
All names are lowercase kebab-case. The prefix tells you what kind of thing it is and where the class lands in the DOM.

| Kind | Pattern | Class lands on | Examples |
|------|---------|----------------|----------|
| **Block** | `noun` — semantic, generic, context-free | block element | `teaser`, `carousel`, `cards`, `tabs` |
| **Block-specific variant** | `<block>-<adjective>` — prefixed with the block name | block element (alongside block name) | `carousel (carousel-compact)`, `teaser (teaser-reverse)` |
| **Universal variant** | `<property>-<value>` — bare, no prefix | block element | `spacing-top-small`, `spacing-bottom-none` |
| **Section style** | `section-<name>` | section wrapper (via Section Metadata) | `section-dark`, `section-centered`, `section-flush` |
| **Page template** | `template-<page-type>` as the metadata value | `<body>` (via template metadata, applied verbatim) | value `template-blog-post` → `body.template-blog-post` |
| **One-off (any of the above)** | base prefix + `oneoff-<context>` | as per its kind | `card (card-oneoff-pricing)`, `section-oneoff-product-hero` |

Rules:
- **Block names** are the *semantic meaning*, never context- or appearance-specific. `teaser` not `video-promo-teaser` (content decides it's a video; a variant decides it's expansible).
- **Block-specific variants** are prefixed with the block name (`carousel-compact`, `teaser-reverse`, `carousel-expansible`) and authored in parentheses after the block name. They imply a shared baseline with the bare block.
- **Keep variant/style names short for the author.** Name the look in one word — `dark`, `inverse`, `reverse`, `compact` — never a description like `dark-card-with-inverted-buttons`. If a treatment recurs across blocks/pages, make a generic short variant (e.g. a generic `dark`/`inverse`) and reuse it; layer a `oneoff-` on top only for the bits unique to one instance.
- **Universal variants** stay bare so any block can take them; the universal-vs-specific distinction is documented, not encoded in a prefix.
- **Section styles** always carry the `section-` prefix; background-color styles are mutually exclusive (see combinability rules below).
- **Page templates** use `template-` in the metadata value; EDS applies that value verbatim as the body class (`body.template-<page-type>`). New templates should adopt the `template-` prefix; any pre-existing bare body classes are grandfathered until refactored (see `PROJECT-DESIGN.md` for the ones this project carries).
- **One-offs may embed context in the name** (that's their whole point) — e.g. `section-oneoff-product-hero`, `card-oneoff-pricing`. They always carry the `oneoff-` token in addition to their kind's prefix, plus a registry row in `PROJECT-BLOCKS.md`. Context-embedding names are *only* acceptable on one-offs; reusable variants/styles must stay generic.
- **Decide one-off vs reusable by scanning other pages.** If a treatment appears for the same kind of content on more than one page, it is reusable and must get a generic name (refactor if currently context-named). If it is unique to one page/instance, it is a one-off. Often only *part* of a style is one-off: factor the generic part into a reusable variant and keep just the unique remainder as the `oneoff-`.

## Content ownership — what lives in content vs code
- **Anything translatable or author-managed lives in the content** (`.plain.html`), never injected by JS/CSS. If an author or translator would ever want to change it, it is content.
- **Scripts must not inject author-managed content** — block JS may build DOM structure, but the words/links inside come from the authored content. Exception: purely functional UI labels (e.g. "Previous slide" aria-labels) — not translatable editorial copy.
- **Styles must not add content images.** CSS may add *decorative* imagery (background textures, icon glyphs, pattern SVGs). Any image that carries meaning the author manages (a logo, a product shot, a photo) is content and belongs in the authored markup.
- **Decorative image files referenced from CSS/JS MUST live in `/icons/` (git-tracked code), never `/content/images/`.** `/content/images/` is author-managed content uploaded separately via the Console — files there are NOT in the code repo and 404 on the local dev server (it proxies them from remote). So a CSS `url()` pointing at `/content/images/` is both a content-ownership violation and a local-render bug. When you add or copy a decorative background, put the asset in `/icons/` and reference `/icons/<name>`. See `eds-section-style-icons`.
- Litmus test: "Would an author or translator ever need to edit this?" → yes = content; no/decorative = code (in `/icons/`).

## Blocks vs default content & content model
- **Prefer default content over blocks.** Eyebrows, section headings, subtitles, and CTAs introducing a block belong in the section's default content above the block — not in the block's first row.
- **Content determines materialization; variants/styles determine appearance & behavior.** Don't bake a one-off look or behavior into a block's identity (image → image teaser, video → video teaser is content's call; "expansible" is a variant).
- **Cell conventions, so a block can be transformed into a sibling block.** Keep row/cell layout systematic across similar blocks. If one uses `[h2, p, CTA]` in a text cell, don't split another into `[h2]` + `[p, CTA]` for the same logical content.
- **Columns are expensive for authors; rows are cheap.** Prefer 1–2 columns. 3–4 only with a strong reason. Never more. Good 2-column uses: image-left / content-right (image always left), or condensed-content-left / expanded-content-right.

## Blocks vs variants
- Prefer reuse + variants over new blocks. New block only when structure is fundamentally different or a variant needs >50% new JS/CSS.
- A variant is a CSS/JS toggle (class name) over the **same content structure** — not a different content model. Different row/cell layout = different block.
- **Reuse before inventing.** Before inventing any new block/variant/section-style, try to reproduce the target look with what already exists — rename, switch variant, add a section style, combine them. Only add a new item for what the existing blocks/variants/section-styles genuinely can't express.

## Variant vs. extending base styles — a key distinction
A **variant** is for a different *look* of the same content. A **new content shape** (the same block fed a combination it hasn't handled before — e.g. a `teaser` with image-only, or title+video, or an extra heading level) is NOT a variant: handle it by **adding additive rules to the base block's CSS/JS**, not by minting a variant. Litmus test: "Is the difference *how it looks* (→ variant) or *what content it contains* (→ extend base styles)?" Keep such base additions additive so blocks on already-validated pages don't move (`styling-additively`, `regression-guard`).

## Context-adaptive vs. variant — DON'T make the author restate the surface
Before adding any `*-dark` / `*-inverse` / `*-light` variant, ask **who owns the color**:
- The block looks dark only because the **surface behind it** is dark (a `section-dark` section or a dark page template)? → it's the CONTAINER's color, not the block's. Make the block **auto-adapt**: add container-scoped rules (`section-dark .<block>`, `body.template-dark .<block>`) so a *bare* block dropped on a dark surface inverts on its own. **No variant** — the author should never restate, on the block, a color the section/template already declares.
- The block's **own card** is painted dark (stays dark even on a light section)? → bake the dark surface into that self-styled variant so it's context-INDEPENDENT, and EXCLUDE it from the auto-adapt rules.
This is the block-level twin of the section-style color rule above ("which surface does the color touch?"). Smart, surface-aware blocks keep authoring lean: fewer variants, smaller test matrix. Full step-by-step + conversion recipe in `context-adaptive-blocks`.

## Stacked page templates — generic inversion + page specifics
A page template's metadata value is comma-split into multiple body classes, so templates **stack**: `template: template-dark, template-page` → `body.template-dark.template-page`. Factor a reusable, single-concern template (e.g. a generic `template-dark` that ONLY inverts colors) and apply it alongside a thin page-specific template (type, spacing, bespoke section looks). Any page can then opt into the generic inversion without copying it. A dark template that inverts colors means blocks inside it auto-adapt (above) — the page content needs no per-block dark variants.

## Placeholder blocks (interactive / data-driven)
Some blocks are **placeholders for an interactive feature** whose substance is *data*, not content — e.g. a widget where a visitor enters their website and a backend returns insights. The author places the block to position the feature; they don't author the data.
- These hold **little authored content** — typically just the CTA label and any on-page placeholder/helper text the author should control. Everything else (results, fetched data) is pulled from backend systems at runtime and is NOT content.
- Still follow content ownership: the few author-facing strings (CTA text, placeholder copy) live in the content; the dynamic data does not.
- Name them semantically by what they let the visitor do, like any block. Document clearly that the block is a placeholder and what data it pulls.

## Section styles
- For styling that spans **multiple blocks** and where **default content should also be able to get it** (e.g. background color, an arbitrary multi-column layout the author fills freely). That "default content wants it too" test is the key signal for a section style over a block variant. Prefix `section-`, set via Section Metadata.
- **Color rule — which surface does the color touch?** This is the deciding test for block style vs section style:
  - Color applies to the **inside of the block** (the card's own background, its text/buttons) → **block style/variant** (e.g. `teaser-dark`). It does not matter that two such blocks sit in one section; you could even split them into separate sections — the color still belongs to the block because it paints the block's own surface.
  - Color applies to the **surface the block (or default content) sits on** (the section background behind everything) → **section style** (e.g. `section-dark`).
- **Declare combinability in the spec.** State which styles combine and which are mutually exclusive. All background-color styles are mutually exclusive; a layout style (e.g. columns) MAY combine with a background style. Make it explicit so authors don't create conflicts.
- Can also be **throw-away** for one section that must stand out.

## Page templates
- Only when **many things change together** page-wide, so a single template replaces a pile of per-block variants and section styles the author would otherwise apply (e.g. a blog template that auto-blocks the title/paragraph/image into a blog header AND restyles carousel/tabs for that page type).
- **Be conservative — keep the count low.** It should be obvious a template is needed (a clearly different page type with its own rules). Detect from many signals changing together across a set of pages.
- Exception: **throw-away templates** are fine for landing/campaign pages that are bespoke one-offs.

## Throw-away discipline (applies to variants, section styles, templates)
- A one-off signals **"this style has only been designed and tested for the specific combination it appears in"** — not necessarily "used once." It may appear on a few pages, as long as usage stays low and infrequent.
- **Promotion threshold:** when a one-off's instances grow beyond a handful, promote it — harden it to work across variant/section/template combinations, give it a generic name, and drop the `oneoff-` token. A one-off that became common is a design smell.
- Mark every one-off three ways: (1) name with the `oneoff-` token, (2) a header comment in the CSS/JS stating its scope and which page(s) use it, (3) an entry in the **central one-off registry** — the single tracking table in `PROJECT-BLOCKS.md`. None may exist without a registry row.
- Throw-aways only need testing for their specific instance(s) — that's the point. When their pages are refactored or removed, delete the one-off *and* its registry row.

## Import parser styling rules
- Parsers extract all content from source DOM — never inject placeholders or hardcode editorial strings.
- Every styling choice (CTA type, heading level, variant, section style, template) is **derived from observable source-DOM signals** — never assumed. Detect dark backgrounds / layout patterns → emit matching Section Metadata or template metadata.

## Pitfalls
- A variant that needs a different content model is a different block.
- Section Metadata must be the LAST element inside its section div.
- Missing source content at import time → leave empty, don't invent.
- Reaching for a template/variant when default content + an auto-style would do.

See also: `container-block-vs-section-style` (tabs/accordion that must hold other decorated blocks), `styling-additively` (add new items, don't edit existing ones), `eds-content-patterns` (CTA + eyebrow auto-styles), `vertical-spacing-system` (foundation + universal spacing variants), `page-template-metadata` (template mechanism + conservative-creation rule), `importer-parser-patterns` (parser implementation), `PROJECT-BLOCKS.md` (block inventory + one-off registry). Native `edge-delivery-services:content-modeling` and `block-mapping-manager`/`block-variant-manager` cover generic modeling — **this augmented-styles ladder and naming convention take precedence** on this project.
