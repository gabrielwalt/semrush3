---
name: repo-hosted-svg-references
description: Host heavy SVGs in the code repo and reference them from content with a plain link that a global script expands into an <img>. Use when DA/html2md rejects images during preview/publish with a (409) "Images N… have failed validation" error, when an SVG is too large to live in the document, or when you need an author-friendly way to place a code-hosted image anywhere. Extends helix `generate-import-html`.
---

DA/html2md validates every image embedded in a document and rejects oversized ones with a **(409) "Images N, M… have failed validation"** on preview/publish. The fix: host the heavy SVG in the **code repo** (served by EDS from the codeBasePath, never validated) and reference it from content with a **plain link**; a global script swaps the link for an `<img>` at render time.

## The Heavy-SVG-In-Code Rule (enforce proactively — don't wait for the 409)
**Any image asset ≥ 80KB must be repo-hosted under `/svg/` and referenced from content, never embedded in the document.** Measured threshold on this project: ≤40KB passes validation, ≥89KB fails — 80KB is the safe ceiling. This applies to the import parser too: a parser must emit a `/svg/` link for a heavy asset, not an embedded `<picture>`, so a re-import never reintroduces the failure.

**When to apply (any of these → use a `/svg/` reference):**
- You're about to embed an SVG (or any image) you know is large (product screenshots, full illustrations, graphs, infographics — typically ≥80KB).
- A preview/publish returns `(409) … Images … failed validation`.
- You're writing/editing a parser that pulls images whose source looks like a big illustration rather than a small icon/logo.

**Verify before importing or publishing** — scan content for oversized embedded images:
```bash
# Size every fetchable embedded SVG in content; flag anything > 80KB (DA-hosted .da.live
# URLs need auth — check those by attempting preview, or size the original source).
python3 -c "import re,glob;[print(f'{f}|{s}') for f in glob.glob('content/**/*.plain.html',recursive=True) for s in re.findall(r'<img[^>]*src=\"([^\"]*\.svg[^\"]*)\"',open(f).read()) if 'da.live' not in s]" \
  | while IFS='|' read -r f u; do sz=$(curl -sS -o /dev/null -w '%{size_download}' "$u"); [ "$sz" -gt 80000 ] && echo "OVER 80KB ($sz): $f → $u"; done
```
Empty output = clean. Any hit must become a `/svg/` reference before import/publish.

## Authoring syntax (minimal)
A normal link whose href is a `.svg` path under `/svg/`. The link **text becomes the alt**.
```html
<a href="/svg/graph-1.svg">Own every search result</a>   <!-- alt = "Own every search result" -->
<a href="/svg/graph-1.svg">/svg/graph-1.svg</a>          <!-- text == url → alt = "" -->
```

## Recipe
1. **Download the heavy SVG into `/svg/`** in the repo (the source-of-truth size limit is ~40KB–89KB; above it, validation fails). Filename is the reference key.
2. **`scripts/scripts.js` → `decorateSvgReferences(main)`** converts every `a[href]` whose pathname matches `/\/svg\/[^/]+\.svg$/` into `<picture><img src="${codeBasePath}${path}" alt="${linkText}">`. It runs in `decorateMain` **before `decorateBlocks`**, so block JS that scans for `picture, img` still works. If the link is the sole content of its `<p>`, the `<p>` is replaced too (no empty wrapper).
3. **Content**: replace the heavy `<picture><img …big.svg…></picture>` with `<a href="/svg/<name>.svg">alt</a>`.
4. **Import parser** (so re-import reproduces it): add a `svgRef(src, alt)` helper that maps a known source filename stem → `/svg/<name>.svg` link and returns it instead of the embedded picture. Pattern: `cell.appendChild(svgRef(...) || wrapImg(...))`. Re-bundle.

## Pitfalls
- **Never run an SVG through `createOptimizedPicture`** — the image service can't rasterize SVG to WebP, so the generated `<source>` breaks (img shows `naturalWidth: 0`). Any block that optimizes images must skip `/\.svg(\?|$)/` sources (guard the `.svg` case in the block's `createOptimizedPicture` call).
- The mechanism is **global, not block-specific** — it runs on all of `main`. Don't reimplement it per block.
- It must run **before** `decorateBlocks` or blocks that read `picture/img` (teaser, marquee, cards-icon) won't see the image.
- Verify the dev server serves `/svg/<name>.svg` (HTTP 200, `image/svg+xml`) — files added after the server starts are still served, but confirm with the rendered `img.naturalWidth > 0`.

See also: `video-in-eds` (same idea for video: reference a URL, script builds the element), `eds-code-conventions` (clean block JS), `marker-driven-import` (parser reproduces validated content). Native `generate-import-html` covers the same ground at a generic level — this skill adds the 80KB threshold rule, the `decorateSvgReferences()` global-script pattern, and the `createOptimizedPicture` SVG pitfall.
