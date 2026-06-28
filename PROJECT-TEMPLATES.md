# PROJECT-TEMPLATES.md

Page template inventory (chrome → template → sub-category hierarchy). Built from site-catalog discovery + visual analysis 2026-06-28 and consolidated per the Entropy-Reduction Rule (`import-template-consolidation`). The raw site has 50+ structural page shapes; they collapse to **one chrome and six canonical templates**.

## Chrome (one, site-wide)

Every in-scope page uses the **marketing chrome** already migrated and frozen: sticky header (Semrush "An Adobe Company" logo, Products/Pricing/Resources/Enterprise nav, Log In outline + Sign Up ink pill, lavender promo banner) + footer (Get-started CTA band, link columns, social, legal, oversized SEMRUSH wordmark). Blog/newsroom add a section sub-nav but keep the same frame. **No product-app shell is in scope.** A canonical template never spans chromes — here there is only one, so all templates share it.

## Canonical templates

| # | Template | Purpose | Look | Reference page | Status |
|---|----------|---------|------|----------------|--------|
| 1 | **pricing** | Plan selection + compare + FAQ | Modern rebrand | `/pricing/seo/` | ✅ FROZEN (built T-005) |
| 2 | **marketing-landing** | Loud conversion landing (hero + section stack + CTA bands) | Modern rebrand, bold | homepage `/` | ✅ FROZEN foundation; template not yet generalized |
| 3 | **feature-detail** | Single product/feature landing | **Legacy** (orange CTAs, line-art hero, narrow container) | `/features/site-audit/` | 🔲 DEFERRED — content + own styling round later |
| 4 | **listing-index** | Card grid + filters/pagination | Quiet (modern palette) | `/company/stories/` | 🔲 DEFERRED — quiet-resource round |
| 5 | **article / case-study** | Long-form: TOC + stat tiles + prose + pull-quote | Quiet | `/company/stories/leafly/` | 🔲 DEFERRED — quiet-resource round |
| 6 | **policy / info** | Jump-links + accordion reference text | Quiet, utilitarian | `/company/security/`, `/company/legal/*` | 🔲 DEFERRED — quiet-resource round |

### Sub-categories (only the ones that recur and are author-meaningful)
- `pricing` — none; all 9 siblings are the same template with different plan data (drift = data, not structure).
- `marketing-landing` — possible `:product-solution` (feature-led) vs `:trial` (conversion-led) split; **decide empirically** when generalizing the template, don't pre-mint.
- `article` — `article:case-study` (customer stories) vs `article:editorial` (blog posts) may differ enough to warrant variants; revisit in the quiet round.

## Many-to-one map (raw → canonical)

| Raw group (count) | Canonical | Action |
|---|---|---|
| `/pricing/{seo,semrush-one,ai,traffic-and-market,local,content,social,advertising,pr,enterprise}/` (9) | **pricing** | INCLUDE wave 1 — fan out the frozen parser |
| `/semrush-free-trial/`, `/solutions/*` (redirects to trial LP), `/company/` (about) | **marketing-landing** | INCLUDE wave 1 — generalize from homepage toolbox |
| `/features/*` (~45 detail) + `/sem/` (legacy) + `/stats/` (legacy data) | **feature-detail** | DEFER — legacy look; import + style in its own later round |
| `/features/` index, `/company/stories/` index, `/blog/` `/news/` indexes | **listing-index** | DEFER — quiet-resource round |
| `/company/stories/*` (80), blog posts (1,405) | **article / case-study** | DEFER — quiet-resource round |
| `/company/legal/*` (4), `/company/security/`, `/company/global-issues/`, `/api-*` terms | **policy / info** | DEFER — quiet-resource round |

## Excluded — programmatic / database-backed (NOT migrated)

Datasets rendered as pages, regenerated from source — out of scope per the Content-Triage Rule:
`/website/*` (thousands of domain-analysis pages, paginated), `/trending-websites/*` (per-country), `/content-hub/*`, `/free-tools/*` (21+), `/vs/*` (competitor compare), `/apps/*` (app marketplace), `/popular/*`, `/eyeon/*`, `/company/trusted-data-provider/*` (18 data studies).

## Deferred — documentation / resource corpora (opt-in later phase)

Separately-maintained, own fidelity bar: `/blog/*` (1,405), `/kb/*`, `/academy/*`, `/news/*` + `/company/newsroom/*` (29), and **all localized sitemaps** (de/fr/it/es/pt/ja `.semrush.com`). English `www` only for now.

## Wave-1 scope (user-confirmed 2026-06-28)
INCLUDE now: **pricing** (9 siblings) + **marketing-landing** (modern only). DEFER feature-detail (whole family), customer stories (80 + index), and all quiet-resource templates to their own later round with calmer styling. `/sem/` and `/stats/` render legacy → they ride with feature-detail, not wave 1 (verify at execution).

## Reference-page rule
Templates 1–2 reference an already-FROZEN page — new work reconciles onto existing blocks (Toolbox-First), never spawns parallel blocks. Templates 3–6 get their reference + styling when their round begins.
