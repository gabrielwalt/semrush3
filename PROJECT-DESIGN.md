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

## Token Files

| Purpose | File |
|---------|------|
| Brand tokens, type scale, color, spacing, default-content, buttons | `styles/styles.css` (`:root`) |
| `@font-face` declarations | `styles/fonts.css` |

_The code is the source of truth for exact values — this section records intent and roles. `detect.mjs` loads the allow-list from the `:root` tokens in `styles/styles.css`._

## Design Tokens

Foundation built 2026-06-26 from the current Semrush rebrand system (homepage + pricing — the two pages that share the live identity). The `/features/` page is the **legacy** template (orange CTA, "Factor A" font, 1120px container); its values were treated as one-offs, NOT foundation.

Token groups in `styles/styles.css` `:root`: fonts, font-weights, heading sizes (`--font-size-heading-xs…xl`, `--font-size-display`), body sizes, line-heights, letter-spacing, colors, spacing scale (`--space-3xs…3xl`), vertical rhythm (`--section-padding`, `--block-padding`), layout (`--content-width`, `--content-padding`, `--nav-height`), radius, transitions, z-index scale.

**Triage note (detect.mjs):** the foundation passes with **0 errors**. The remaining `craft-token-unused` warnings cover the spacing scale, z-index tiers, radii, and transition tokens that aren't consumed *yet* — they are the system vocabulary the homepage build (next task) will consume (carousels, sticky nav + dropdowns, cards). Kept deliberately at the foundation stage to avoid delete/re-add churn; revisit during repo-cleanup if any remain unused after the homepage is styled.

## Typography

- **Heading font:** Lazzer (Semrush brand display font; weights 400/500/600 — self-hosted in `fonts/lazzer-*.woff2`).
- **Body font:** Inter (variable, latin + latin-ext subsets, self-hosted).
- **Display heading:** 84px desktop / 44px mobile, weight 600, line-height 1.1, letter-spacing −0.03em (the brand's signature tight tracking).
- **Heading scale (desktop):** xl 64 · l 48 · m 32 · s 24 · xs 20 — a ~1.25–1.33 (perfect-fourth-ish) ratio, regularized at Refined fidelity. Headings shrink at <1024px via `@media :root` overrides.
- **Body:** 20px (body-l) / 18px (body-m) desktop, line-height 1.5.
- **Heading tracking** −0.02em; `text-wrap: balance` on headings, `pretty` on prose.

## Color

- **Ink (text):** `#181E15` — green-tinted near-black, the brand's actual ink (17:1 on white). **Not pure black.**
- **Muted text:** `#5E6068` (6.27:1 on white — headroom above the 4.5 floor).
- **Background:** `#FFF`; **surface** `#F4F4F2`; **border** `#E3E4E8`.
- **Brand (links/primary actions):** `#6A40D0` purple (6.45:1, distinct from ink per the Distinct-Link Rule); hover `#5733B0`.
- **Accent:** lavender `#C190FF` — used as a **button fill with ink text** (7.04:1), decorative only (fails as text on white, so never used as text color); hover `#B07CF5`.
- **Accent green:** `#18F0BF` — decorative only (the stats arrow-panel gradient pairs it with the lavender accent). Never used as text.
- **Dark surface:** `#181E15` (= ink) with inverse `#FFF` text; links invert to the lavender accent.

## Buttons (foundation rule)

Pill shape (`--radius-pill` 100px), Lazzer semibold, three variants:
- **primary** — ink `#181E15` fill, white text. **Never pure black** (design-team rule, see `PROJECT-CONTEXT.md` Brand).
- **secondary** — ink outline, transparent fill, inverts on hover.
- **accent** — lavender fill, ink text.

## Spacing

- **Scale:** 8-based — `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 120` (`--space-3xs…3xl`). Single scale, no off-scale gaps.
- **Section rhythm:** `--section-padding` 120px desktop / 64px mobile; `--block-padding` 24px between siblings (the `* + *` system).
- **Container:** `--content-width` 1440px max, `--content-padding` 32px desktop / 16px mobile.
- **Radius:** `--radius-s` 8px · `--radius-m` 16px · `--radius-pill` 100px.

## Breakpoints

Single site-wide set: **768px** (tablet) and **1024px** (desktop). The foundation uses `@media (width >= 1024px)` to scale type and rhythm up. Any block `@media` must snap to 768 or 1024 (enforced by `detect.mjs`).

## Block Inventory

See `PROJECT-BLOCKS.md` for the full block/variant/section-style inventory.

## Styleguide

A living styleguide was created retrospectively 2026-06-28 (the project skipped it at the start). It is a set of net-new authored reference pages under `content/styleguide/` that render every default-content element, the four section styles, and every block × variant through the real decoration — the GATE-2 diff target and the reviewable artifact at no-render stages. It is intentionally kept out of site nav/sitemap (internal reference). It must stay in lockstep with `PROJECT-BLOCKS.md` (the Styleguide-Mirrors-Inventory Rule): when a block/variant/section-style is added, add its story the same step.

| Page | Renders |
|------|---------|
| `/styleguide` | Index + CTA/button legend (primary/secondary/accent) |
| `/styleguide/default-content` | Every semantic element + the three button variants |
| `/styleguide/sections` | hero / dark / light / flush on the same sample content |
| `/styleguide/blocks/<block>` | One page per block, with meaningful stories (edge cases, variants, counts) — 11 block pages covering all 11 blocks + the teaser-dark, carousel-articles, carousel-quotes variants |

Local render route: `/content/styleguide/<path>` (clean, no `.html`).
