# PROJECT-BLOCKS.md

Block + variant + section-style inventory; one-off registry.

## Blocks

| Block | Purpose | Used on | Status |
|-------|---------|---------|--------|
| `insights-form` | Interactive placeholder — visitor enters a domain, backend returns insights. Author owns field placeholder + button label only. | homepage hero | ✅ styled (hero) |
| `logos` | Customer logo rotating marquee (2 duplicated groups, CSS scroll, pauses on hover, reduced-motion → static wrap) | homepage | ✅ styled |
| `teaser` | Full-width promo card: 2 cols (text + autoplaying product video w/ poster fallback), rich bg panel; one per section | homepage (×2) | ✅ styled |
| `carousel` | Horizontal scroll-snap card slider (right-edge bleed, prev/next arrows in header) | homepage (solutions, resources) | ✅ styled (Solutions); articles variant pending |
| `stats` | Metric rows: dark card (green-gradient arrow panel + big number + label) with description alongside | homepage | ✅ styled |
| `quote` | Customer testimonial: dark quote card (logo + quote + author) beside a light highlight-stat card | homepage | ✅ styled |

## Variants

| Variant | Base block | Purpose | Status |
|---------|-----------|---------|--------|
| `teaser-dark` | `teaser` | Self-painted dark card (black panel + enterprise-bg.webp, white text/CTA) — the Enterprise promo | ✅ styled |
| `carousel-articles` | `carousel` | Resources article cards: transparent, image-on-top (3:2), title link + muted description (+ tags row when present) | ✅ styled |

## Section Styles

| Section style | Purpose | Defined in | Status |
|---------------|---------|-----------|--------|
| `hero` | Centered content over the brand pastel gradient (mint→lavender→white) | `styles/styles.css` | ✅ validated |
| `dark` | Dark surface, light text | `styles/styles.css` | (foundation, unused yet) |
| `light` | Surface-tint background | `styles/styles.css` | (foundation, unused yet) |
| `flush` | Full-bleed (zero section padding) | `styles/styles.css` | (foundation, unused yet) |

## One-offs

*[Agent: record one-off registrations here.]*
