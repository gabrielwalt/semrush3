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

## Chrome (header / footer)

| Block | Purpose | Content fragment | Status |
|-------|---------|------------------|--------|
| `header` | Sticky top nav: Semrush logo + nav links (Products/Pricing/Resources/Enterprise) + Log In (outline pill) / Sign Up (ink pill). Stock EDS nav JS; restyled to brand. | `content/nav.plain.html` | ✅ styled |
| `footer` | Final CTA band ("Get started…" + Start free trial accent pill) + 4 link columns + social + legal rows | `content/footer.plain.html` | ✅ styled |
| `footer-cta`, `footer-columns`, `footer-social`, `footer-legal` | No-op stub blocks — structural wrappers in the footer fragment styled by footer.css; stubs exist only to silence EDS block-load 404s | — | ✅ stubs |

**Header/footer simplifications (Refined fidelity — revisit if needed):**
- The lavender **promo banner** above the nav ("TRY SEMRUSH ONE FOR FREE") is omitted.
- **Products** and **Resources** are plain links, not mega-menu dropdowns (the stock nav supports dropdowns if we author nested `<ul>`s later).
- nav/footer fragment paths are wired via `<meta name="nav">` / `<meta name="footer">` in `head.html` (site-wide), pointing at `/content/nav` and `/content/footer`.

## One-offs

*[Agent: record one-off registrations here.]*
