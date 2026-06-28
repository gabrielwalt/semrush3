---
name: debug-block-decoration
description: Debug a block whose decorate() JS emits wrong DOM — missing, partial, or duplicated items — even though the authored content is correct. Use when content is right in the editor but the rendered block drops items, AND when a block renders differently across environments. Trigger phrases "only shows one", "missing items", "only the first image", "block not rendering items", "images not showing", "works on prod but not local", "shows on aem.live but not locally", "renders differently across environments", "nav/footer/block not showing on live". NOT for styling/visual-mismatch issues (use css-specificity-eds or block-visual-iteration).
---

Block shows partial/no content despite correct authored content → the bug is in `decorate()` JS selector logic. Never chase infrastructure.

## Before theorizing about a symptom
- **Reproduce the user's exact symptom on their exact route** — a different observation on a different route isn't their bug; a tool's "X is broken" may mean your probe was pointed wrong (confirm it loaded the runtime / the file exists where you looked).
- **Go find the disconfirming fact yourself** ("other blocks work fine" kills a "decoration is broken" theory — don't wait to be corrected).
- **Envs differ but code+content byte-identical → stale cache**, not a code bug — force-reload the specific resource first.

## Recipe

1. **When you receive `<element_context>`, that IS the user's live preview.** Navigate to `http://localhost:3000/content/index` (or the relevant path) with playwright and inspect the DOM immediately. Don't navigate to `.html` — use the path without extension. **The bare root `http://localhost:3000/` does NOT inject the EDS runtime (only `livereload.js`), so NO blocks decorate there — it is not a valid preview route.** Before trusting any "nothing is decorated" observation, confirm the served HTML contains `scripts/aem.js` (`curl -s <url> | grep aem.js`). If it doesn't, you are on the wrong route, not looking at a decoration bug.
2. **Read the block's JS file** — the `decorate()` function. It's usually under 50 lines. Read it before doing anything else.
3. **Inspect the served DOM** for that block (playwright evaluate on the actual page):
   - What HTML does the block element contain AFTER decoration?
   - How many children does the cell have? What are their tags?
   - Are items individually wrapped or all inside one `<p>`?
4. **Trace `decorate()` line-by-line** against what you found:
   - `:scope > *` → only direct children. If items are nested deeper, it misses them.
   - `querySelector()` → returns FIRST match only. `querySelectorAll()` → returns ALL.
   - `el.querySelector('img')` on a `<p>` with 12 images → returns only image #1.
5. **Fix the selector.** Safest pattern for collecting all images:

```js
const items = [];
cell.querySelectorAll('img, picture').forEach((el) => {
  if (el.tagName === 'PICTURE') items.push(el);
  else if (!el.closest('picture')) items.push(el);
});
```

6. **Verify on localhost:3000** with playwright — confirm all items now render.

## Pitfalls

- `querySelector('img')` inside a wrapper with 12 images → returns only the first one. #1 cause of "only one item shows".
- `:scope > *` misses nested content — if EDS wraps items in `<p>`, direct-child selectors skip them.
- Never modify content files to work around a JS bug — if content is correct in the editor, block code is wrong.
- Never hardcode fallback URLs in block JS — masks bugs, creates debt.
- Don't theorize about CDN/auth/pipeline before reading the `decorate()` function. Read the code FIRST.
- **Preview ≠ published EDS — don't assume parity.** localhost:3000 (`aem up`) serves your local `content/` at the path you load and **proxies the published site for anything it lacks locally (can be stale)**; published EDS serves content at the **site root** (`/nav.plain.html`, not `/content/…`). The two can legitimately differ — "works locally" is not proof it's published-correct (the AGENTS.md NEVER list owns that).
- **Block occupies space but paints blank/invisible → the visibility-reveal lifecycle.** EDS keeps blocks/sections `visibility:hidden` until decoration sets `[data-block-status="loaded"]`. If you **name a non-block wrapper with a block class** (e.g. `wrapper.className = 'footer'`), it matches the hidden rule but never gets `data-block-status` set → invisible-but-occupies-space. **Never give a structural wrapper a block class** (NEVER list; lifecycle in `eds-dom-structure`).
- If your first theory is wrong, stop theorizing and read the block's `decorate()` function. Do not propose a second theory without having read the code.
- One env renders differently but the block's JS/CSS and `.plain.html` are byte-identical (verify with `md5sum` / `curl --compressed`) → it's a **stale CDN/proxy cache**, not a code bug. Hard-reload the specific resource (`/nav.plain.html`, the block's `.js`) before changing anything.

See also: `eds-dom-structure` (block DOM nesting), `verify-before-claiming` (confirm fix on user's URL). Native `excat-eds-debugger` runs a broader AEM troubleshooting workflow — **this read-the-`decorate()`-first recipe takes precedence** for the "renders partial/wrong DOM despite correct content" case.
