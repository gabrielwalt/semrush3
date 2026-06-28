---
name: typography-craft
description: The positive method for rebuilding an elegant, on-brand type system from a source site during migration — read the source's type voice, commit to a scale ratio, assign weight roles, set measure + light-on-dark compensation, and load fonts without layout shift. Use when building the typography half of the global foundation, rebuilding a brand's type system, or a page's type feels generic/muddy. Adapted from impeccable.style's typeset. Defers hard thresholds to craft-floor.
---

Typography carries most of a page's information and most of its brand voice. A migration must **rebuild the source's type as a clean, intentional system** — not copy arbitrary sizes, not impose a generic "best-practice" font. This is the *positive method*; `craft-floor` owns the *minimum thresholds* (ratio ≥1.25, no twin sizes, tracking floor ≥−0.04em, body ≥16px) — clear those at the end, don't restate the numbers here.

## Read the source first (identity-preservation)
Before rebuilding, **measure what the original actually uses** (`measure-then-implement`): heading + body font families, the weights in play, the real size at each level, line-heights, tracking. **The source brand's committed type identity wins** — if the original is Inter, you reproduce Inter; never "upgrade" a brand's shipped font to something you think is nicer. The font-selection/reflex-reject step (below) is for *Reimagined* pages only.

## Rebuild as a clean system
- **5-role scale** covers most needs: caption · secondary · body · subheading · heading. Map the source's sizes onto these roles; collapse near-duplicates.
- **Commit to ONE ratio** between steps — 1.25 (major third), 1.333 (perfect fourth), or 1.5. Pick the one closest to the source's de-facto ratio and make the scale consistent. A flat ~1.1× scale reads as uncommitted.
- **Semantic token names** (`--text-body`, `--text-heading`), never value names (`--font-16`).
- **Every title/font size is a token, and there's a token for every recurring size (craft-floor Systematic-Tokenization Rule).** No raw `font-size: 21px` in a block — if 21px recurs as a card-title role, it's `--font-size-heading-s`. Snap near-matches to the nearest token (46→48, a 20px quote within ~6% of the 21 card-title role — but only if it's the *same role*), add a token for a recurring gap in the scale (a 40px headline → `--font-size-heading-ml`), leave only true one-offs (bespoke stat numbers) as literals with a `/* why */`. The `craft-token-literal` (exact) + `craft-token-near` (≤6%, category-bound) checkers enforce this for fixed tokens.
- **Responsive type belongs ON the token, not inlined per breakpoint.** When a role's size changes across breakpoints (display 84→56, a pull-quote 26→20), define the token in base `:root` and override it inside the `@media :root` block — the block keeps one `var(--font-size-quote)` at every width. A role is also a semantic claim: a **pull-quote/blockquote is not a heading**, and an **icon glyph is not a heading** — give a distinct voice its own role token (`--font-size-quote`) even if its px sits near a heading step; don't fold voices into one token just because the numbers are close.
- **Weight roles**: define which weight serves which role (e.g. body / label / heading) and hold it — same role, same weight everywhere. ≤3–4 weights total; load only those you use.
- **Marketing/content headings** can use fluid `clamp(min, preferred, max)`; **body stays fixed**. Bound clamp so `max ≤ ~2.5×min` (wider breaks zoom/reflow).

## Readability
- **Measure 45–75ch** via `ch` units (`max-width: 65ch` on prose containers). Scale container width and font-size together so measure stays in band at every viewport.
- **Line-height by context**: tighter for headings (1.1–1.2), looser for body (1.5–1.7); narrow columns want tighter leading, wide columns more.
- **Light-on-dark needs three-axis compensation** — light text on a dark surface reads lighter and tighter, so bump all three: line-height +0.05–0.1, letter-spacing +0.01–0.02em, weight +1 step (regular→medium). Relevant to our dark templates/sections (`context-adaptive-blocks`). `<!-- rule:craft-typo-light-on-dark -->` is owned here; craft-floor points to it. **Caveat (EDS field-tested):** the "+1 weight step" assumes a **400** body baseline. If the brand's body is already ≥500 (common — many brands ship 500 everywhere), the weight axis is *pre-satisfied*; don't stack to 600 or dark body goes heavy. Only the line-height/tracking axes remain, and at a comfortable size + high contrast they're marginal — apply judgment, don't reflexively nudge.
- **Paragraph rhythm**: space between paragraphs OR first-line indent, never both (digital → space).
- **Tokenizing a `font-size` literal? Check the token's responsive behavior first (EDS field-tested).** The `--font-size-heading-*`/`--font-size-display` tokens are **responsive-variable** (they shrink under `@media`, e.g. heading-m 24→18px <768, heading-xl 64→32px <1024); `--font-size-body-*`, `--space-*`, `--tracking-*`, radius, color, and transition tokens are single-value/fixed → always safe to tokenize. Before swapping a literal for a responsive token, ask: is the literal inside an `@media` rule, and does the element render on mobile? If the token's mobile value would be wrong, keep the literal (with a one-line comment).

## Load fonts without layout shift
- `font-display: optional` (zero-shift, fallback if the font misses a ~100ms budget) vs `swap` (shows fallback, FOUT-swaps — use when the branded font matters on slow nets).
- **Metric-matched fallback** kills FOUT shift: a fallback `@font-face` with `size-adjust` / `ascent-override` / `descent-override` / `line-gap-override` tuned to the real font (Fontaine automates this).
- **Preload the critical weight only** (above-the-fold body), not every weight.
- **ALL-CAPS labels/eyebrows** need +5–12% letter-spacing (`letter-spacing: 0.05–0.12em`); default spacing makes caps touch.
- `tabular-nums` for aligned numeric data; `font-kerning: normal`; `font-optical-sizing: auto` for variable fonts.

## Reimagined-only: font selection (when genuinely inventing)
Only when fidelity is **Reimagined** and you're choosing a *new* font (not reproducing the source):
1. Write three concrete physical-object brand-voice words ("warm and mechanical and opinionated"), not "modern"/"elegant".
2. List the fonts you'd reach for by reflex — if any are in the **reflex-reject list**, reject them (training-data defaults that create monoculture): Fraunces, Newsreader, Lora, Crimson, Playfair, Cormorant, Syne, IBM Plex *, Space Mono/Grotesk, Inter, DM Sans/Serif, Outfit, Plus Jakarta Sans, Instrument Sans/Serif.
3. Pair on a contrast axis (serif+sans, geometric+humanist) — or one family in multiple weights (often stronger than a timid pair). Never pair two similar-but-not-identical sans.
4. **NEVER apply this to reproduce a source brand** — identity-preservation always wins over the reject list.

## Recipe
1. Measure the type scale from ≥3 source pages (`measure-then-implement`); confirm each size recurs before tokenizing.
2. Write tokens into the file named in `PROJECT-DESIGN.md` Token Files:
   `--font-heading`, `--font-body`, `--font-size-display` → `--font-size-s`, `--font-weight-bold`, `--font-weight-regular`, `--line-height-heading`, `--line-height-body`.
3. Put `@font-face` declarations in `styles/fonts.css`; always include `font-display: swap`.
4. Wire into default-content styles: `h1 { font-family: var(--font-heading); font-size: var(--font-size-h1); line-height: var(--line-height-heading); }` — repeat for h2–h4, p, and the display size.
5. Verify: above-fold heading loads without layout shift (`aem up`, throttle to Slow 3G, watch for CLS); body contrast ≥4.5:1 against its background.

## Verify
- [ ] Source type measured first; committed identity reproduced (not "upgraded").
- [ ] One ratio, 5 roles, semantic tokens, ≤4 weights with defined roles.
- [ ] 45–75ch measure; context-appropriate line-heights; light-on-dark 3-axis applied on dark surfaces.
- [ ] Fonts load without shift (display + metric-matched fallback); craft-floor's Real-Font rule passes.
- [ ] `craft-floor` thresholds all clear (run its checks).

## Pitfalls
- Copying the source's arbitrary sizes verbatim instead of rebuilding a coherent scale — reproduce the *intent*, regularize the *system*.
- Applying the reflex-reject list to a Faithful/Refined import — that "corrects" the brand away from its identity. It's Reimagined-only.
- Fixing light-on-dark on one axis (just lighter weight) — fix all three or it still reads off.

See also: `craft-floor` (the type thresholds this method must clear), `global-style-foundation` (the foundation pass that routes here for the type dimension), `measure-then-implement` (measure the source before rebuilding), `vertical-spacing-system` (line-height as the base unit for vertical rhythm), `context-adaptive-blocks` (dark surfaces where light-on-dark compensation applies)
