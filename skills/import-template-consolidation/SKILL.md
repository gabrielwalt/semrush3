---
name: import-template-consolidation
description: Collapse the many raw page templates that site-catalog discovery produces into a handful of canonical templates BEFORE bulk import — so the migration reduces the source's accumulated entropy instead of reproducing it. Use after site scope/catalog analysis returns more than ~10 templates, when raw templates carry drift-suffix names (foo, foo-b, foo-c), when planning bulk import, or whenever deciding if a "new" page type is really new. Extends EXCAT `excat-site-analysis`.
---

Catalog discovery clusters by *structure*, so a site that drifted over years yields far more templates than it has real page types (e.g. `app-detail`, `app-detail-b…-e` are one type that diverged in incidental block count). **A migration is a chance to reduce entropy, not a mandate to reproduce it.** Map every raw template onto a small canonical set and normalize the drift at import time.

## The Entropy-Reduction Rule (gate — do this BEFORE bulk import)

You MUST NOT bulk-import one EDS template per raw discovered template. Before importing more than the validated reference pages:
1. Group the raw templates into **canonical templates** by *purpose*, not by discovered structure.
2. Produce a many-to-one map: every raw template → exactly one canonical template (or an explicit DEFER). No raw template silently dropped, none silently kept as its own type.
3. Get user sign-off on the **borderline** calls only (assert-then-confirm), then record the map in a PROJECT-* file as the authoritative template list. The raw names live only in the catalog as discovery output.

## The merge test: SAME APPEARANCE + SAME PURPOSE → one template

**Two raw templates are the same canonical template if and only if they share both a visual appearance and a purpose.** Block count and block order are NOT distinguishing axes — a page with 3 cards and a page with 6 cards in the same layout are the same template. State the test positively, then fold everything that passes it.

- **Appearance** = the rendered look: the **page chrome** (see below — the dominant axis), hero treatment, surface/background, the composition skeleton, the type scale in use. Judge it from the screenshot, not the DOM.
- **Purpose** = author intent: persuade/convert, describe one item, browse a set, read long-form, tell a customer story, gate an asset, state policy. Judge it from the content and URL role.

A raw template is **drift** (fold it in) when it matches an existing canonical template on BOTH axes. It earns its own canonical template only when it differs on appearance OR purpose — for example:
1. **Different purpose** — a listing-of-cards vs a long-form article vs a form-driven tool.
2. **A distinct dominant visual element** that defines the page — e.g. a feature-comparison spec table, a map embed, a drenched-color gated hero. (A different *count* of the same blocks is NOT this.)
3. **Different chrome** (see next section) — usually the strongest appearance signal.
4. **Explicit user instruction** to keep it separate.

First match wins. Suffix families (`-b`, `-c`, `-2`, `copy`) are drift until proven otherwise — they're discovery's over-split of one appearance.

## Chrome is the dominant appearance axis — bucket by it FIRST, empirically

A site often runs **more than one chrome** (page frame: nav/sidebar/footer system) — e.g. a marketing chrome AND a product-application shell AND a careers/sub-brand chrome. Chrome is the biggest visual divide; templates in different chromes are never the same template.

- **Bucket by the ACTUALLY RENDERED chrome, never by URL path.** A product-app shell can live under the same path prefix as marketing pages, and vice-versa. Read the chrome from the page itself (screenshot, or the page's framing CSS-module/class signature in the analysis), then assign the bucket.
- Decide per chrome whether it is **brand surface** (reproduce) or **product-UI surface** (do not reproduce — bring those pages onto the brand chrome, or exclude them). Confirm with the user.
- Only after chrome buckets are fixed do you group templates *within* a chrome by appearance + purpose.
- **A canonical template never spans chromes.** If a purpose appears in two chromes (e.g. a card-grid index in both the marketing chrome and the product-app shell), that is **two templates**, one per chrome — even though the purpose is identical. Chrome difference always splits.

## The three-level hierarchy: chrome → template → sub-category

Model the retained set as a **strict hierarchy**, not a flat list:

1. **Chrome** (top level) — the page frame. A hard boundary; nothing crosses it.
2. **Template** (within a chrome) — a distinct appearance + purpose: the page's dominant element and composition skeleton (landing, listing-index, detail, article, …).
3. **Sub-category** (within a template) — a real *variation of the same template* that shares its chrome, dominant element, and core skeleton but differs in a **meaningful, repeating** way that an author or a section-style/variant must express — NOT a block-count difference.

**When does a variation earn a sub-category vs. just fold in as drift?** A sub-category is warranted only when ALL hold:
- it shares the parent template's chrome AND dominant element AND skeleton (else it's a different template, not a sub-category);
- it differs in a way that **recurs across multiple pages** (a one-page quirk is drift, not a sub-category);
- the difference is **author-meaningful** — it changes what content the author supplies or which section-style/variant applies (e.g. a *gated* vs *ungated* resource; a *multi-row storefront home* vs a *single filtered listing*; a *light* vs *dark* landing). A different number of the same sections is NOT author-meaningful → fold in.

A sub-category is implemented as a **variant or section-style of the parent template** (`eds-content-modeling`), never as a separate template + parser. Name it `{template}:{sub}` (e.g. `listing-index:storefront-home`, `resource-detail:gated`). If you cannot name the recurring, author-meaningful difference, there is no sub-category — fold it in.

**Decide sub-categories empirically:** sample a handful of pages per template, look at the screenshots, and only split out a sub-category you can see recurring. Don't invent sub-categories speculatively — most templates need none.

## Recipe
1. **Bucket every page by rendered chrome first** (empirically — screenshot/class signature, never URL path).
2. Within each chrome, for each raw template gather: purpose (from URL + description), page count, and the **block-type signature** of its representative page (collapse consecutive dups). Group by appearance + purpose; same purpose + signatures differing only by count/order = one template.
3. **Sample a handful of pages per template** and look at the screenshots — confirm the merges hold and detect any recurring, author-meaningful **sub-categories** (split those out as `{template}:{sub}` variants, not new templates).
4. Draft the hierarchy (chrome → template → sub-category) and the many-to-one map in a table.
5. For each template pick a **reference page** — prefer an already-validated/LOCKED page (it's the frozen exemplar). New work reconciles onto existing blocks (Toolbox-First; see `styling-additively`), it does not spawn parallel blocks.
6. **Reconcile against templates already built this project** — if a prior page already created a template for this purpose+chrome, map onto it; never add a parallel template for the same intent.
7. Confirm borderline calls with the user; record the approved hierarchy in a PROJECT-* file (e.g. `PROJECT-TEMPLATES.md`).
8. At import, route each page to its template (+ sub-category variant) and **normalize drift** — reproduce the canonical structure, not the page's incidental extra/missing sections.

## Anti-patterns (match-and-refuse)
- About to generate one EDS template/parser per discovered template? **Stop** — map to canonical templates first; one raw template per EDS template imports the source's entropy.
- Treating a suffix variant (`-b/-c/-d`) as distinct because block *count* differs? **Stop** — count/order is drift; same appearance + purpose = one template.
- Assigning chrome bucket by URL path? **Stop** — chrome is rendered, not a path property. Read the actual frame from the screenshot or class signature.
- Merging same-purpose templates from **different chromes**? **Stop** — chrome always splits.
- Minting a separate template + parser for a variation that shares chrome+dominant-element+skeleton? **Stop** — recurring author-meaningful difference = sub-category (a variant); one-page quirk or block-count difference = drift. Neither is a new template.
- Keeping a single-URL page as its own canonical template? **Stop** — import as a default-content one-off or DEFER.
- Reproducing every section of every drifted page faithfully? **Stop** — normalize toward the reference page; fidelity is to the canonical model, not historical inconsistency.

## Pitfalls
- Catalog "templates" are structural clusters, not editorial page types — re-read through the purpose lens before trusting the count.
- A high page-count raw template may still be one canonical type — count says "important", not "distinct".

See also: `import-content-scoping` (picks WHICH pages; this picks how FEW templates), `eds-content-modeling` (variant vs section-style vs template), `styling-additively` (reconcile onto existing/LOCKED blocks), `eds-migration-process` (where this sits before bulk import). Native `excat-site-analysis` covers the same ground at a generic level — this skill adds the Entropy-Reduction Rule, chrome-first bucketing, and the three-level hierarchy.
