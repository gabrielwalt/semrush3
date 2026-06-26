---
name: craft-floor
description: Concrete, checkable thresholds (type · color · spacing · motion) that every Refined or Reimagined foundation must clear. Load when building or auditing the global foundation, regularizing a weak source design, or a style system looks like AI output. NOT for Faithful imports — mirror the source instead. Run `quality-tooling` for the [auto] rules.
---

When fidelity is **Refined or Reimagined** (not Faithful — read it from `PROJECT-DESIGN.md` → Migration Strategy, first-match-wins per-page → site default), you have license to *regularize toward craft* rather than mirror the source. This is the floor every such foundation must clear. At **Faithful**, skip this — reproduce the measured source and fix only outright defects.

> **The Identity-Preservation Rule.** Every rule below regularizes toward *generic best practice* — but a **source brand's committed identity always wins** over generic best practice. If the original deliberately uses a "rejected" font (Inter, Playfair…), an unusual color, an editorial lane, or an off-grid signature move, **reproduce it — do not "correct" it.** These rules apply to choices YOU invent (Reimagined gaps, new variants), never to faithfully-reproduced brand decisions. Mis-applying a floor rule to override the brand is the one way this skill does harm. `<!-- rule:craft-identity-preservation -->`

Each rule is named so you can cite it, carries a threshold so it can be checked, and carries a stable `<!-- rule:id -->` so a script can enforce it (**The Executable-Rule Rule**). Measure, don't eyeball (`measure-then-implement`).

## Enforced by

Several rules below are checked deterministically — don't rely on memory, **run the checker** (`quality-tooling`):
```
node tools/quality/detect.mjs <changed css/html files> [--json]
```
The checker keys findings to the `rule:` IDs here and loads its color/scale allow-list from `PROJECT-DESIGN.md` + the `:root` tokens in `styles/*.css`. Exit 0 = clean, 2 = findings. Rules it covers are tagged **[auto]** below; the rest are judgment checks you run by eye in the preview.

## Typography
- **The One-Ratio Rule.** One consistent ratio across the whole scale, **≥ 1.25×** between adjacent steps. A 2× cliff mid-scale (e.g. 48→24 then 24→18) = two systems stitched together → regularize. (A deliberate display-tier→text-tier jump is allowed; document it.) <!-- rule:craft-typo-ratio -->
- **The No-Twin-Sizes Rule. [auto]** No two scale tokens may resolve to the **same px**. Two heading levels that render identically (or a heading == body) is a dead hierarchy level → collapse or respace. Slop. <!-- rule:craft-typo-twin-sizes -->
- **The Real-Font Rule.** If the heading font differs from body, it **MUST have a loaded `@font-face`** (verify in preview: `[...document.fonts].some(f=>/name/i.test(f.family) && f.status==='loaded')`). A declared-but-unloaded heading font silently falls back to the body default — the named slop *"invisible default (Inter/Roboto/Arial)"*. Also keep ≥ 2 weight-steps OR a font change between body and headings, or hierarchy reads flat. <!-- rule:craft-typo-real-font -->
- **The Display-Ceiling Rule.** Hero/display heading `clamp()` max **≤ 6rem (~96px)**. Above that the page is shouting, not designing. <!-- rule:craft-typo-display-ceiling -->
- **The Tracking-Floor Rule.** Display/heading `letter-spacing` **≥ −0.04em**. Tighter and letters touch — cramped, not designed. <!-- rule:craft-typo-tracking-floor -->
- **Balance headings.** `text-wrap: balance` on h1–h3 (even line lengths); `text-wrap: pretty` on long prose (kills orphans). <!-- rule:craft-typo-text-wrap -->
- **Sizes:** body **≥ 16px**; line-height **~1.5–1.6** body, **~1.1** display/heading; line length **45–75ch** (cap prose columns). <!-- rule:craft-typo-sizes -->
- **No scattered one-off `font-size`. [auto]** Sizes come from tokens. An off-scale per-component size (`21px`, `46px`) is slop unless it's a documented one-off. <!-- rule:craft-typo-offscale-size -->
- **Light-on-dark needs three-axis compensation.** Light text on a dark surface reads lighter and tighter — bump line-height +0.05–0.1, letter-spacing +0.01–0.02em, and weight +1 step. Full method in `typography-craft`. <!-- rule:craft-typo-light-on-dark -->

## Color
- **The Distinct-Link Rule.** In-text prose link color **MUST differ from body ink** (the brand hue, or a persistent non-hover underline). `--link-color == --text-color` makes links invisible until hover. Slop. (Scope to prose; heading-links and nav-lists are understood by context.) <!-- rule:craft-color-distinct-link -->
- **The One-Token-One-Home Rule. [auto]** Each token defined **exactly once**. Two `:root` owners defining the same token with different values → one is dead, and it's usually the one you wanted. Consolidate. <!-- rule:craft-color-token-dup -->
- **The Tokenize-Inverse Rule. [auto]** Dark-surface text uses a `--color-inverse` token, not `#fff` scattered across N files. Same for any repeated literal. (White card backgrounds and gradient/glass-mask stops are NOT inverse text — allow-listed.) <!-- rule:craft-color-raw-inverse -->
- **Palette restraint:** one brand hue + tinted neutrals + (if charts) ≤ 3 matched-lightness hues. Not a rainbow; not the AI defaults (purple→pink gradient, cyan neon, dark-mode glow). Off-palette colors are **[auto]** flagged against the DESIGN.md set. <!-- rule:craft-color-off-palette -->
- **Contrast with headroom. [auto]** body **≥ 4.5:1** (aim higher); large text ≥ 3:1; **muted text still ≥ 4.5:1** — a "muted" value sitting exactly at 5:1 has no margin for a later tint. Placeholder text needs the full 4.5:1, not the muted-gray default. <!-- rule:craft-color-contrast -->
- **Gray-on-color washes out.** Gray text on a colored background looks faded — use a darker shade of the background's own hue, or a transparency of the text color. <!-- rule:craft-color-gray-on-color -->
- **The Side-Stripe Ban. [auto]** Never `border-left`/`border-right` ≥2px as a colored accent stripe on cards, list items, callouts, or alerts (impeccable's #1 absolute ban — it's never intentional). Use a full hairline border, a 4–8% background tint of the accent, a leading glyph, or a numbered prefix instead. A 1px side border (table/divider hairline) or a near-gray side border is fine. <!-- rule:craft-color-side-stripe -->

## Spacing & Layout
- **The Systematic-Tokenization Rule. [auto]** Every `font-size`, `border-radius`, single-value `padding`/`margin`/`gap`, `letter-spacing`, `color`, `transition` duration, and recurring layout width uses a **token**, not a raw literal — the whole point of a style system is reusing the same values so the design stays coherent and one edit propagates everywhere. **Five directives:**
  1. **Snap exact matches.** A literal that *equals* a token value uses the token (`8px` padding→`--space-xs`, `84px` height→`--nav-height`). Zero-visual, always do it. (`craft-token-literal` [auto].)
  2. **Snap near-matches — the discrepancy finder.** A literal within **~6%** of a token, *in the same category*, is almost always the same intent expressed as a slightly-off one-off (`20px`→`--font-size-quote` 26? no — within the role; `46px`→`--font-size-heading-l` 48px; `6px`→`--radius-s` 5px; `60px` gap→`--space-2xl` 64px). Snap it **unless it's intentionally distinct**. Compare like-to-like only: a `font-size` snaps to a font token, `padding`/`gap` to a space token, `border-radius` to a radius token — never cross categories. (`craft-token-near` [auto], category-bound, ≤6%.)
  3. **Cover the gap — tokenize every meaningful value type.** A value that *recurs* (≥2–3× for one role) with no token earns a NEW token: title sizes, body sizes, the CTA system (height, padding, radius, every color × every state), border-radii, horizontal + vertical spacing, line-heights, letter-spacing, transition durations, z-index tiers, container/layout widths. Add it to `:root` + PROJECT-DESIGN; don't scatter the literal. Name **by role, not value** (`--font-size-quote`, not `--font-26`).
  4. **Responsive-aware tokens — keep breakpoint-specific values on the token.** If a role's value *changes per breakpoint* (a quote 26px desktop→20px mobile, display 84→56), define the token once in base `:root` and **override it inside the `@media` `:root` block** — the consumer keeps one `var()` and the token carries the responsive behavior. Do NOT inline per-breakpoint literals in the block. **The hazard mirror:** never snap a *fixed* literal (a stat figure, an icon glyph sized to a button, anything that must hold its px on mobile) to a *responsive* token — it would silently shrink. The [auto] checkers only ever suggest FIXED tokens, so following them is safe; the judgment call is yours when *adding* a token. (See `typography-craft`.)
  5. **Genuine one-offs stay literal — with a one-line `/* why */`.** A bespoke 180px hero stat, a 2px hairline, a single decorative offset. The comment is what stops a future pass (or the checker's reader) from "fixing" it. If it isn't worth a comment, it probably isn't a real one-off — tokenize it.

  **Tokenization is a discrepancy detector, not just DRY:** the near-match + exact checkers surface values that drifted off the system (the `20px` quote that should have been the quote role, the `46px` that meant `heading-l`). Run `detect.mjs --all` and a near-match finding is a question — "is this intentionally distinct, or did the system drift here?" Most are drift. <!-- rule:craft-token-literal --> <!-- rule:craft-token-near -->
- **The One-Spacing-Scale Rule. [auto]** A single scale (e.g. `8 / 16 / 24 / 48 / 96`). No **near-duplicate steps** (32 *and* 40 compete) and no **off-scale gaps** (a stray `13px` between your 8 and 16 is the canonical "random gap" slop). A recurring value used many times is a legitimate de-facto step — tokenize it rather than snap it (see PROJECT-DESIGN spacing note). <!-- rule:craft-space-scale -->
- **Rhythm, not uniformity.** Alternate tight and generous spacing; equal padding everywhere with everything shouting at one weight is slop. <!-- rule:craft-space-rhythm -->
- **The One-Radius Rule. [auto]** One radius system. `8` vs `10` vs `12px` fighting across components is noise no one perceives as intentional — pick the token values and hold them; raw radius literals where a `--radius-*` token exists are flagged. <!-- rule:craft-radius-raw -->
- **The Breakpoint-Consistency Rule. [auto]** One small set of responsive breakpoints site-wide (this project: 768 + 1024) — every block `@media` snaps to a sanctioned width, never a stray `900px` or `600px`. Breakpoints **can't be CSS tokens** (`@media` can't read `var()`, no build step), so consistency is enforced not tokenized: the foundation stylesheet owns the set, `detect.mjs` harvests it live and flags any `@media` width outside it. A genuinely-new breakpoint goes into the foundation first, then it's sanctioned. <!-- rule:craft-breakpoint-stray -->
- **The No-Dead-Tokens Rule. [auto]** A token defined but never referenced via `var()` is dead weight — it bloats the system and misleads the next reader into thinking it's load-bearing. Either wire up the intended consumer or delete it. (Especially watch for this after a refactor that re-pointed consumers.) `detect.mjs --all` flags every unreferenced token. <!-- rule:craft-token-unused -->
- **The Don't-Over-Tokenize Rule (lean counterweight).** Tokenize for *reuse and system coherence*, not reflexively. A value used **exactly once**, that doesn't belong to a role-family and won't recur, is better as a commented literal than as a single-use `--token` nobody else references (that just moves the magic number and adds indirection). The test: *"will a second element legitimately want this same value for the same reason?"* Yes → token. No → literal + `/* why */`. Snapping near-matches (≤6%) and covering recurring gaps are the priority; minting bespoke single-use tokens is the anti-pattern. Simplicity is the governing principle — a token must earn its place. <!-- rule:craft-token-overtokenize -->
- **The Z-Index-Scale Rule.** Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never arbitrary `999` / `9999`. <!-- rule:craft-layout-zindex -->
- **Cards are the lazy answer.** Use a card only when it's genuinely the best affordance; **nested cards are always wrong.** Identical icon+heading+text card grids repeated endlessly are a tell. <!-- rule:craft-layout-cards-lazy -->
- **Flexbox for 1D, Grid for 2D.** Don't default to Grid when `flex-wrap` would be simpler; for responsive grids without breakpoints use `repeat(auto-fit, minmax(280px, 1fr))`. <!-- rule:craft-layout-flex-grid -->

## State & motion (Polish)
- **The All-Elements-Focus Rule.** `:focus-visible` on **every** interactive element (links, inputs, custom buttons, carousel nav) — not buttons only. Hover alone is not focus. <!-- rule:craft-state-focus -->
- **The Reduced-Motion-Baseline Rule. [auto]** Every animation/transition needs a `@media (prefers-reduced-motion: reduce)` fallback (typically crossfade or instant). An infinite marquee or hover transition with no reduced-motion guard is incomplete, not polished. <!-- rule:craft-motion-reduced -->
- **Motion is intentional.** Ease out with exponential curves (ease-out-quart/quint/expo) — no bounce/elastic. Don't animate layout properties unless truly needed. Reveal animations must enhance an already-visible default (never gate content visibility on a class-triggered transition — it never fires on hidden tabs/headless renderers and ships the section blank). <!-- rule:craft-motion-intentional -->
- **Tokenize durations. [auto]** Replace literal `0.2s`/`0.3s` in foundation rules with the transition token. A magic-number duration is slop. <!-- rule:craft-motion-duration-token -->
- **No placeholder cruft. [auto]** No `lorem`, no `TODO`, no stray placeholder strings in shipped CSS/content. <!-- rule:craft-cruft-placeholder -->

## Distill (remove what doesn't earn its place)
- **No dead tokens / `@font-face` / alias layers. [auto]** 0-use tokens, unused `@font-face` (e.g. leftover Roboto fallbacks), and alias-token layers that just re-point to real tokens — delete. Every token/rule must justify its existence. <!-- rule:craft-distill-dead -->
- **Competing treatments → consolidate.** Multiple card styles / button variants doing the same job → one. Three fonts where one works → one. <!-- rule:craft-distill-consolidate -->

## Verify (Bookend)
- [ ] Fidelity is Refined/Reimagined (else this skill doesn't apply).
- [ ] **Ran `node tools/quality/detect.mjs` on the changed files** — exit 0, or every finding triaged (real fix vs allow-list gap; never a forced change to a frozen page).
- [ ] Type scale: single ratio ≥1.25, no twin sizes, heading font actually loaded, display clamp ≤6rem, tracking ≥−0.04em — confirmed in preview.
- [ ] Links visually distinct from text; every token defined once; contrast ≥4.5:1 incl. muted.
- [ ] One spacing scale + one radius system; no off-scale gaps; semantic z-index.
- [ ] focus-visible + reduced-motion on all interactive/animated elements.
- [ ] No dead tokens / `@font-face` / alias layers left behind.

## Pitfalls
- Applying this to a **Faithful** import → you "improve" the brand away from its spec. Check fidelity first.
- Treating these as taste → they're a floor, not a redesign. Reimagined goes *above* the floor; Refined just *clears* it.
- Hardcoding project values into this skill or into fixes — read the actual scale/tokens from `PROJECT-DESIGN.md` and the project's token files. The detector's allow-list is those committed tokens, never a literal in the script.
- Trusting the prose rule when a `[auto]` checker exists — run the checker; it catches what the eye skips under load.

This skill is the **floor** (the minimum bar). The **positive method** for building each dimension well lives in the craft skills: `typography-craft`, `color-craft`, `layout-craft`, and `responsive-adaptation`. Use those to *build*; use this to *check the result clears the bar*.

See also: `quality-tooling` (the detector that enforces the `[auto]` rules + the project-state probe), `global-style-foundation` (builds the workbench this floor is checked against; routes into the craft skills per dimension), `typography-craft` · `color-craft` · `layout-craft` · `motion-craft` · `responsive-adaptation` (the positive build methods this floor backstops; motion-craft owns the positive method behind the craft-motion-* rules), `interaction-states-eds` (the 8-state set + focus-ring/label/clipping the craft-state-focus rule backstops), `measure-then-implement` (measure before asserting any value), `migration-orientation` (sets the fidelity that gates this skill), `vertical-spacing-system` (the spacing half), `eds-content-patterns` (default-content/link auto-styles), `writing-skills` (the impeccable-derived authoring habits + The Executable-Rule Rule behind these IDs)
