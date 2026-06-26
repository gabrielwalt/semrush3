# PROJECT-DESIGN.md

## Migration Strategy

_Recorded 2026-06-26 via migration-orientation._

| # | Input | Decision |
|---|-------|----------|
| 1 | Authoring model | **Document Authoring (DA / da.live)** — content in Word/Google Docs, import target is `content/*.plain.html` |
| 2 | Scope | **Single page** — the homepage |
| 3 | Site analysis first? | No — single-page scope, go straight to global foundation then the homepage |
| 4 | Starting page | **Homepage** (https://www.semrush.com/) |
| 5 | Content source | Live source site (https://www.semrush.com/) |
| 6 | Design source | Same as content source (live site) |
| 7 | Additional resources | None — extract foundation from the live site |
| 8 | Fidelity (site default) | **Refined** — keep the brand identity, regularize weak spots and uplevel craft |
| 9 | Templates/content to improve | None flagged |
| 10 | Reuse (existing library/design system) | None |
| 11 | Per-page fidelity overrides | None |
| 12 | Constraints | None stated |

**Brand notes from source inspection:** Semrush ("An Adobe Company" — recently acquired by Adobe). Bold black display headlines, signature purple/lavender accent (~#7B57E0 / lavender `#C5A3FF`-ish banner), soft pastel gradient hero backgrounds. Homepage sections observed: hero with search form + customer logo strip, "Your edge"/"Bigger scale" promo pair, Solutions carousel (9 cards), Stats & facts, customer quote, Resources carousel (9 articles), CTA + footer.

## Design Tokens

*[Agent: fill the project's CSS `:root` tokens after global-style-foundation. Leave the empty `:root {}` until real values exist — a fake token poisons detect.mjs's allow-list.]*

```css
:root {
}
```

## Typography

*[Agent: record the type scale, weights, and roles after global-style-foundation.]*

## Color

*[Agent: record the brand palette and color roles after global-style-foundation.]*

## Spacing

*[Agent: record the spacing system after global-style-foundation.]*

## Breakpoints

*[Agent: record responsive breakpoints after global-style-foundation.]*

## Block Inventory

*[Agent: record blocks/variants/section-styles as they are validated.]*
