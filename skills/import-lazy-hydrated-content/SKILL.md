---
name: import-lazy-hydrated-content
description: Source content present in the live DOM but missing from the imported .plain.html — because client JS injects it after load (video <source>s, carousel tags/labels, SPA-rendered grids). Use when a parser's hook validation passes on the live page but the bulk import drops that content, or when re-imported content is thinner than what you see in the browser.
---

The headless importer parses the page **before** (or without) the client JS that injects some content, so anything lazy-hydrated is absent at parse time — even though it's in the live DOM and the parser-validation hook (which runs against the hydrated page) shows it. **Suspect lazy hydration before debugging the parser selector.**

## The tell
A parser's PostToolUse validation shows the content, but `content/{path}.plain.html` after `run-bulk-import.js` does not. The selector is fine; the element just isn't there yet during bulk import. Common cases: `<video><source>` (empty `src` until scrolled), carousel/card category tags/labels, SPA-injected card grids.

## Recipe — hardcode-fallback in the parser
1. **Confirm it's hydration, not a bad selector:** does the value appear in the live `browser_evaluate` DOM but not in the imported `.plain.html`? If yes → hydration.
2. **Harvest the real values once** from the live page (`browser_evaluate`), keyed by a stable per-item signal (a title keyword, an index, a URL).
3. **Bake a map into the parser** and fall back to it only when the live extraction comes up empty:
```js
const TAG_MAP = [[/title keyword/i, 'News · Product Update'], /* … */];
const live = [...wrap.querySelectorAll('*')].map(e=>e.textContent.trim()).filter(Boolean).join(' · ');
const value = live || mapLookup(titleText); // live wins; map is the fallback
```
4. **Record the hardcoded values** in `PROJECT-IMPORT.md` (they're a snapshot of live data, not derivable from the imported DOM) so a future editor knows why they're literal.

## When NOT to hardcode
- **SPA-hydration limit (documented):** a whole card grid injected by client JS won't import even with networkidle + scroll. Don't burn cycles re-running — defer the page or import by another route, and note it (`marker-driven-import` pitfalls).
- If the value is genuinely author-managed and stable in the source markup, fix the selector instead — hardcoding is only for runtime-injected data that can't be parsed.

## Pitfalls
- Trusting the parser-validation hook as proof the import will contain the content — the hook runs against the **hydrated** page; bulk import doesn't. Verify the actual `.plain.html`.
- Hardcoding values that DO survive import → silently overrides real content and rots when the source changes. Always make the live extraction win, map only as fallback.

See also: `marker-driven-import` (the SPA-hydration limit + the single-parser strategy this extends), `video-in-eds` (video `<source>` is the canonical lazy-hydrated case — emit the link, hardcode the URL), `importer-parser-patterns` (parser table mechanics)
