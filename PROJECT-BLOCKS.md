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
| `pricing-nav` | Pricing toolkit sidebar — one row per link; marks the current page active (lavender pill). Also owns the pricing two-column page layout (sticky sidebar + content), scoped via `main:has(.pricing-nav)`. | pricing | ✅ styled (GATE 2 pending) |
| `pricing-plans` | Plan cards (3-up) with a functional Monthly/Annually toggle (segmented control; recomputes monthly = annual ×1.2). First authored row = toggle option list; rest = plan cards [name, tagline, price+struck, CTA, features]. | pricing | ✅ styled (GATE 2 pending) |
| `comparison-table` | Feature matrix (4-col grid: label + Pro/Guru/Business); "Yes"→check icon; sticky header; rows past 5 collapse behind Expand/Collapse details. | pricing | ✅ styled (GATE 2 pending) |
| `addons` | Add-on cards (4-up grid): h3 + price + bulleted features; same card elevation as plan cards. | pricing | ✅ styled (GATE 2 pending) |
| `accordion` | FAQ disclosure — native `<details>`/`<summary>` per row [question, answer]; first open; chevron rotates. | pricing | ✅ styled (GATE 2 pending) |

## Variants

| Variant | Base block | Purpose | Status |
|---------|-----------|---------|--------|
| `teaser-dark` | `teaser` | Self-painted dark card (black panel + enterprise-bg.webp, white text/CTA) — the Enterprise promo | ✅ styled |
| `carousel-articles` | `carousel` | Resources article cards: transparent, image-on-top (3:2), title link + muted description (+ tags row when present) | ✅ styled |
| `carousel-quotes` | `carousel` | Testimonial cards: surface-tint card, large quote (heading font) + author meta, no media. carousel.js extended additively to keep a 2nd (author) cell on media-less rows. | ✅ styled (GATE 2 pending) |

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

**Header detail (all closed at GATE 2):**
- Lavender **promo banner** above the nav ("TRY SEMRUSH ONE FOR FREE…") — 4th nav-fragment section, hoisted by header.js to `.nav-promo-banner`.
- **Products** and **Resources** are mega-menu dropdowns (nested `<ul>` in the nav fragment → stock `.nav-drop` toggle); Pricing/Enterprise are plain links.
- nav/footer fragment paths wired via `<meta name="nav">` / `<meta name="footer">` in `head.html` (site-wide) → `/content/nav`, `/content/footer`.

**Remaining Refined-fidelity note:** stats numbers render at 112px (vs source 180px) — capped to avoid clipping long values (e.g. 289M+); user-confirmed to keep.

## One-offs

*[Agent: record one-off registrations here.]*
