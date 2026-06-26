---
name: color-craft
description: The positive method for rebuilding an elegant, on-brand color palette from a source site during migration — extract the source palette, structure it into roles, apply the 60-30-10 weight rule, tint neutrals toward the brand hue, build OKLCH ramps, and handle dark mode correctly. Use when building the color half of the global foundation, rebuilding a brand palette, or a page's color feels flat/timid/chaotic. Adapted from impeccable.style's colorize. Defers prohibitions + contrast thresholds to craft-floor.
---

A palette is brand voice. A migration must **rebuild the source's palette as a structured system with roles** — not collect arbitrary hexes, not impose a generic accent. This is the *positive construction method*; `craft-floor` owns the *prohibitions and thresholds* (contrast ≥4.5:1, distinct links, tokenize-inverse, side-stripe ban, off-palette lint) — clear those at the end, don't restate them here.

## Extract the source palette first (identity-preservation)
**Measure the original's actual colors** (`measure-then-implement`): background(s), ink, the 1–2 brand accents, any dark-surface inversion, semantic colors. **The brand's committed colors win** — reproduce them; never swap a brand's blue for a "nicer" hue. The color-strategy / named-reference step (below) is *Reimagined-only*.

## Structure into roles
A complete system has, at most:
| Role | Purpose |
|------|---------|
| **Primary** | brand, CTAs, key actions — 1 color, 3–5 shades |
| **Neutral** | text, backgrounds, borders — 9–11 shade scale |
| **Semantic** | success / error / warning / info — only if the product needs them |
| **Surface** | cards, modals, overlays — 2–3 elevation levels |

Skip secondary/tertiary unless genuinely needed — extra accents create decision fatigue.

## Apply color by weight, not pixel count (60-30-10)
- **60%** neutral backgrounds / surfaces / whitespace
- **30%** secondary: text, borders, inactive states
- **10%** accent: CTAs, highlights, focus, current selection
The accent works *because it's rare*. The classic failure is spraying the brand color everywhere "because it's the brand" — overuse kills its power. (Brand-register Drenched/Committed strategies deliberately exceed this — Reimagined only.)

## Build the ramps in OKLCH
- Use **OKLCH**, not HSL — perceptually uniform, equal lightness steps *look* equal.
- For a color's shades: hold hue + chroma, vary lightness; **reduce chroma as you approach white or black** (high chroma at the extremes looks garish).
- The hue is a brand decision from the source — don't drift toward reflex blue(250)/orange(60).

## Tinted neutrals (the cohesion move)
Pure gray reads lifeless next to a colored brand. Add **chroma 0.005–0.015 toward THIS brand's hue** to neutrals — subliminal, creates cohesion. **Never reflex-tint warm-orange or cool-blue** "because the brand feels that way" — that default-warm tint (`oklch(~97% 0.01 60)`) is the AI cream/sand/parchment tell. Tint toward the brand's *actual* hue, or stay truly neutral.

## Dark mode is not inverted light mode
- Depth comes from **surface lightness, not shadow** — build a 3-step surface scale (e.g. 15% / 20% / 25% lightness), same brand hue+chroma, varying lightness only.
- **Desaturate accents** slightly; **reduce body weight −1 step** (light-on-dark reads heavier — see `typography-craft`).
- Background is either pure black or a **brand-tinted near-black** (oklch 12–18%), not a generic charcoal.
- Redefine only the **semantic token layer** for dark; primitives stay.

## Alpha is a design smell
Heavy `rgba`/`hsla` usually means an incomplete palette — it creates unpredictable contrast. Define **explicit overlay colors** per context instead. Exception: focus rings / interactive states where see-through is the point. (This is why `craft-floor`'s Tokenize-Inverse rule wants `--color-inverse`, not scattered translucent whites.)

## Reimagined-only: color strategy
Only when fidelity is **Reimagined** and inventing: pick a strategy — Restrained (tinted neutrals + one accent ≤10%) / Committed (one saturated color 30–60%) / Full palette (3–4 roles) / Drenched (surface IS the color) — and **name it against a real reference** ("Stripe purple-on-white restraint", "Klim #ff4500 drench"). Unnamed ambition becomes beige. Faithful/Refined reproduce the source's strategy instead.

## Recipe
1. Measure system colors from ≥3 source pages — only colors that recur across pages earn a token (`measure-then-implement`).
2. Write tokens into the file named in `PROJECT-DESIGN.md` Token Files:
   `--color-brand-primary`, `--color-brand-accent`, `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`, plus any dark-surface inversion set.
3. For computed ramps use OKLCH (browser-native): `oklch(60% 0.15 240)` — not hsl. Tweak L for accessible contrast.
4. Apply roles in default-content styles: `body { background: var(--color-bg); color: var(--color-text); }`, links `var(--color-brand-primary)`, borders `var(--color-border)`.
5. Verify: run `node tools/quality/detect.mjs --all` — confirm no off-palette colors; check body-text contrast ≥4.5:1 and link contrast ≥3:1.

## Verify
- [ ] Source palette measured first; committed brand colors reproduced (not swapped).
- [ ] Roles assigned (primary/neutral/surface, semantic if needed); no rainbow.
- [ ] 60-30-10 by visual weight; accent stays rare.
- [ ] OKLCH ramps with chroma reduced at extremes; neutrals tinted toward the brand hue (not reflex warm/cool).
- [ ] Dark surfaces: depth via surface-lightness, desaturated accents, −1 body weight.
- [ ] `craft-floor` color prohibitions all clear (contrast, distinct-link, tokenize-inverse, side-stripe) — run the checker.

## Pitfalls
- Collecting every hex the source uses into a flat token list instead of structuring into roles — reproduce the *system*, not the soup.
- Reflex-tinting neutrals warm/cool — the cream/sand monoculture tell. Tint toward the brand's own hue or stay neutral.
- "Inverting" light mode for dark — rebuild depth via surface lightness, not by flipping values.
- Applying the strategy/named-reference step to a Faithful/Refined import — that re-skins the brand. Reimagined only.

See also: `craft-floor` (color prohibitions + contrast thresholds), `global-style-foundation` (routes here for the color dimension), `measure-then-implement` (measure the source palette first), `context-adaptive-blocks` (dark-surface inversion), `typography-craft` (light-on-dark weight compensation pairs with dark-mode color)
