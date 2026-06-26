---
name: marker-driven-import
description: How to design the import parser as ONE generic, marker-driven script that reproduces user-validated content exactly. Use when the user has validated a page's content structure and you need a reliable parser, when adding detection for a new block/variant/section-style/template, or when an import doesn't reproduce the validated output. For low-level table/DOM mechanics see importer-parser-patterns. Extends EXCAT `excat-import-script`, `excat-content-import`.
---

Once the user validates how a page's content should be structured, that `.plain.html` is the **reference truth**. Build ONE parser that reproduces it from the original page using the most generic markers possible — not a per-page script. Every block, block variant, section, section style, and page template the project uses should map to a clear **marker set**: a combination of DOM elements/attributes that identifies — with high likelihood — what content structure the markup converts to.

## The detection cascade (decide in this order)
For each piece of source markup, the parser decides, top-down:
1. **Page template** — from page-level markers (URL pattern, body/`<main>` class, a signature section sequence).
2. **New section or not** — what marker starts a new section (a top-level wrapper, a background change, a layout shift).
3. **Section style(s)** — markers that map to `section-*` (dark bg, centered layout, pattern). Background styles are mutually exclusive — pick one.
4. **Block or not** — does this section's content map to a block, or stay default content?
5. **Block variant(s)** — markers that map to `<block>-<variant>` (e.g. dark card → `teaser-dark`).
6. **Content structure** — headings (h1–6), paragraphs, lists, images (wrap in `<picture>`), links, `<strong>`/`<em>` → CTA emphasis.

Rules are **contextual**: inside a given page template, levels 2–6 may apply different rules; inside a given section style, block/variant/content detection may differ. Encode this as "within template X" / "within section-style Y" branches, not as separate scripts.

## Method
1. **Find the markers first.** For each target block/variant/section-style/template, inspect the original page and identify the smallest, most reliable DOM signal (tag, class, attribute, structural position) that distinguishes it. Prefer generic structural markers over brittle ones (a hardcoded class hash). Write these down — ideally the project's marker map lives in `PROJECT-IMPORT.md`.
2. **Generic first.** Aim for ~90% of the validated content reproduced by global, marker-based rules shared across all pages.
3. **Context exceptions for the last mile.** Only if global rules can't distinguish a case, add a narrow contextual exception (e.g. "the 3rd section on the pricing template gets `section-dark`"). Document it as an exception and why no general marker worked.

## Validation loop (never overwrite the reference)
The validated `content/*.plain.html` is the reference — **never let the import overwrite it.**
1. Import the validated page's URL to a **temporary location** (e.g. `/tmp/import-check/`), never `content/`. `run-bulk-import.js` writes to `content/` directly and has no `--output-dir` — so always back up first: `cp content/<path>.plain.html content/<path>.plain.html.bak` — or restore from the AEM endpoint: `curl -s 'https://<branch>--<repo>--<owner>.aem.page/<path>.plain.html' -o content/<path>.plain.html`.
2. Diff the temp output against the validated `content/<page>.plain.html`.
3. Iterate on the parser until the diff is empty (output === validated content).
4. **Re-run this diff after every parser change** — a change that fixes page A often regresses page B. The parser is correct only when every validated page still reproduces exactly.

## Pitfalls
- Writing a second parser/script per page instead of adding marker branches to the one parser — defeats the goal; only fork for fundamentally incompatible DOM.
- Importing onto `content/` and destroying the reference — always go to a temp dir and diff.
- `run-bulk-import.js` writes directly to `content/*.plain.html` with no `--output-dir` flag — it silently overwrites curated content (DA media hashes, spacing classes, section boundaries). Always back up before running: `cp content/<path>.plain.html /tmp/ref.html`. To restore after an accidental overwrite: `curl -s 'https://<branch>--<repo>--<owner>.aem.page/<path>.plain.html' -o content/<path>.plain.html`.
- Marker too specific (a build-hashed class) → breaks on the next source deploy. Prefer structural/semantic markers.
- Reaching for a context exception before exhausting generic markers — exceptions are the last mile, not the first.
- Changing a parser and not re-diffing ALL validated pages — silent cross-page regressions.
- **The Keep-The-Parent-Region Rule (region selection).** When a shape-driven parser walks `section`/`[role="region"]` wrappers, select **top-level** content regions (`!allSections.some(o => o !== s && o.contains(s))`) and walk their interior from within — NEVER filter to "innermost" regions. *If you're about to keep only leaf regions that contain no others — stop.* The author-meaningful block is usually the PARENT (it holds the h2/h3 headings); its children are heading-less sub-panels (FAQ answer panels, card columns, step lists). An innermost filter silently drops every heading and orphans the body — e.g. a FAQ `<section>` (h2 + N h3 questions) wrapping N heading-less answer-panel `div[role="region"]`s loses every question and keeps N orphan answers. Verify by counting h3s in output vs source after the change.
- A region walker that emits only the FIRST heading per region (e.g. `region.querySelector('h1,h2,h3')`) drops every sub-heading → orphaned paragraphs. For prose/editorial/FAQ regions, walk ALL `h1-4, p, ul, ol` in DOM order instead.
- **The Two-Shapes-One-Page Rule.** A "single" template can render in MORE THAN ONE DOM shape (a CMS migrated mid-life: older pages use `<section aria-label>` wrappers, newer ones use background-banded `<div>`s with no sections). Don't gate the body walk on a shape signal that can be absent or *transiently present* (a count of `<section>`/`[role=region]` — lazy hydration can leave one stray region that starves the other branch). Instead: build BOTH candidate bodies into throwaway fragments and KEEP the one that captured more content (by total text length — shape-agnostic). Verify per-page output size, not just "import succeeded".
- A bare-`<div>` lead/step/description is invisible to a `querySelectorAll('p')` walk. Newer CMS shapes put hero leads, "how-to" step copy, and card descriptions in `<div>`/`<span>`, not `<p>`. When a band renders as an orphaned heading or a hero with no lead, widen the walk to bare divs (excluding form controls so the tool widget isn't captured as the lead).
- A feature-grid `<li>` containing a nested `<h3>` label + description renders GLUED (`LabelDescription`) if emitted as `li.textContent`. Emit the nested heading + its description as separate `h3`+`p`, not one bullet.
- **Headless importer can't see client-hydrated grids.** Tool-grid/hub landing pages whose central card grid is injected by client JS import thin (hero only) even with networkidle + scroll — the grid isn't in the DOM at parse time. This is the documented SPA-hydration limit; don't burn cycles re-running. Defer those pages or import them by a different route, and note them as a known limitation.

See also: `importer-parser-patterns` (table/DOM mechanics), `eds-content-modeling` (what the markers should map TO — the augmented-styles ladder), `eds-migration-process` (where this fits in the per-page workflow).
