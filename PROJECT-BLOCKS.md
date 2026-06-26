# PROJECT-BLOCKS.md

Block + variant + section-style inventory; one-off registry.

## Blocks

| Block | Purpose | Used on | Status |
|-------|---------|---------|--------|
| `insights-form` | Interactive placeholder — visitor enters a domain, backend returns insights. Author owns field placeholder + button label only. | homepage hero | ✅ styled (hero) |
| `logos` | Customer logo strip (centered wrapping row) | homepage | ✅ styled |
| `teaser` | Promo card: title + body + CTA | homepage (×2) | ✅ styled |
| `carousel` | Horizontal card slider | homepage (solutions, resources) | 🔲 not styled |
| `stats` | Metric grid (number + label + description) | homepage | 🔲 not styled |
| `quote` | Customer testimonial: logo + quote + author + stat | homepage | 🔲 not styled |

## Variants

| Variant | Base block | Purpose | Status |
|---------|-----------|---------|--------|
| `teaser-dark` | `teaser` | Self-painted dark card (black bg, white text/CTA) — the Enterprise promo | ✅ styled |
| `carousel-articles` | `carousel` | Article cards (title link + description + tags) for Resources | 🔲 not styled |

## Section Styles

| Section style | Purpose | Defined in | Status |
|---------------|---------|-----------|--------|
| `hero` | Centered content over the brand pastel gradient (mint→lavender→white) | `styles/styles.css` | ✅ validated |
| `promo-pair` | Two teasers side-by-side (flex, ≥1024px); injected by sectionize.mjs when a section holds >1 teaser | `styles/styles.css` | ✅ styled |
| `dark` | Dark surface, light text | `styles/styles.css` | (foundation, unused yet) |
| `light` | Surface-tint background | `styles/styles.css` | (foundation, unused yet) |
| `flush` | Full-bleed (zero section padding) | `styles/styles.css` | (foundation, unused yet) |

## One-offs

*[Agent: record one-off registrations here.]*
