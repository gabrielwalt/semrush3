---
name: context-adaptive-blocks
description: Make a block adapt its look to the SURFACE it sits on (a dark section style or dark page template) instead of asking authors to add a matching variant. Use when a block needs a dark/inverted look only because its CONTAINER is dark, when deciding whether to add a `*-dark`/`*-inverse` variant, or when a section style / page template already inverts colors and contained blocks should follow automatically. Trigger phrases "do authors really need the dark variant", "block should adapt to the section", "template already inverts colors", "drop the redundant variant".
---

A block must adapt to the surface it sits on — never make the author restate, on the block, a color the container already declares. If a `section-<x>` or `template-<x>` inverts colors, blocks inside it inherit the inversion automatically; a per-block `*-dark`/`*-inverse` variant for that case is redundant and should not exist.

## The decision: who owns the color?
Run this before adding ANY `*-dark` / `*-inverse` / `*-light` block variant.

1. **Is the block dark because the SURFACE BEHIND it is dark** (a `section-dark` section, a `template-dark`/dark page)? → **Container-driven.** Do NOT add a variant. Add container-scoped rules to the block's CSS so it auto-inverts: `main .section.section-dark .<block> {…}` and `body.template-dark main .<block> {…}`. The author just drops the plain block in; it follows the surface. (See `eds-content-modeling` color rule — "surface the block sits on" = section/template concern.)
2. **Is the block dark because ITS OWN CARD is painted dark** (it stays dark on a light section too — a self-styled branded card)? → **Self-styled.** Bake the dark surface + white text + inverted buttons INTO that variant so it is context-INDEPENDENT (looks identical on any surface). It must NOT also auto-invert (exclude it: `:not([class*='oneoff'])` / `:not(.<self-variant>)`).
3. **Neither — the author genuinely wants a one-off different look on the same surface** → a real variant is justified. Name it per `eds-content-modeling`.

## Recipe — converting a redundant `*-dark` variant to context-adaptive
1. Confirm every instance of the variant sits on a dark container (grep content for the variant; check each section's `section-*` style / the page template). If all do → it's container-driven, proceed. If some are self-styled cards → those keep a self-contained variant (case 2).
2. In the block CSS, replace the `.<block>.<block>-dark …` rules with container-scoped rules: `main .section.section-dark .<block>:not([self-styled]) …` and `body.template-dark main .<block>:not([self-styled]) …`. Put them LAST in the file (highest specificity) and wrap in a scoped `/* stylelint-disable no-descending-specificity */ … /* stylelint-enable */` (the two container forms co-target the same elements).
3. Make the LIGHT-surface look the bare default, scoped `:not([self-styled])`, so a plain block on a light section still looks right.
4. Update parsers to emit the BARE block (drop the `*-dark` token) wherever the block lands on a dark container. Update the served `.plain.html` class string too (the stale token becomes a harmless no-op, but clean it).
5. For a page that was dark via a bespoke template, split out a generic `template-dark` (color inversion only) and stack it with the page template via comma metadata: `template: template-dark, template-page` → `body.template-dark.template-page`. Keep type/spacing/bespoke looks in the page layer.
6. Verify: dark page → block auto-inverts (container bg `none`/dark, text `#fff`); a self-styled card on a LIGHT page → still its own dark card (regression-check frozen pages).

## Pitfalls
- Adding `block-dark` when the darkness comes from the section/template — that's the redundancy this skill removes. Author shouldn't restate the surface.
- Auto-inverting a self-styled card too: it would lose its background on a dark page. Exclude self-styled variants from the container rules.
- Forgetting the `template-dark` stack: a bespoke dark template can't be reused by other pages. Factor the color inversion into a generic `template-dark`.
- Container rules placed before lower-specificity defaults → `no-descending-specificity`. Put them last + scoped disable.

See also: `eds-content-modeling` (the augmented-styles ladder + the "which surface does the color touch" rule this operationalizes), `styling-additively` (keep the conversion additive so frozen pages don't move), `page-template-metadata` (stacked template metadata mechanism), `css-specificity-eds` (why container-scoped rules win).
