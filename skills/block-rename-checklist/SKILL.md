---
name: block-rename-checklist
description: Block rename checklist for EDS. Use when renaming a block — name propagates to 12+ locations that all need updating.
---

A block name propagates to 12+ locations. Silently fails if you miss one.

## Steps
```bash
# 1. Rename directory and files
mv blocks/{old} blocks/{new}
mv blocks/{new}/{old}.js blocks/{new}/{new}.js
mv blocks/{new}/{old}.css blocks/{new}/{new}.css

# 2. Bulk-replace in each file
# CSS: .{old} class prefixes → .{new}
# JS: class name strings
# styles/styles.css: :has(.{old}), .section.{old}-container
# scripts/scripts.js: auto-block guards
# content/*.plain.html: class="{old}" → class="{new}"
# tools/importer/parsers/{old}.js → rename + update table header
# tools/importer/*.js: parser function name + registry key
# tools/importer/page-templates.json: block name

# 3. Verify nothing remains
grep -r "{old}" --include="*.js" --include="*.css" --include="*.html" --include="*.json" .

# 4. Lint
npm run lint
```

## Remote content still uses old name?
AEM CLI serves HTML from the remote server — you can't rename block classes in remote content without re-publishing. Keep a thin redirect at the old name:
```js
// blocks/{old}/{old}.js
import decorate from '../{new}/{new}.js';
export default decorate;
```
```css
/* blocks/{old}/{old}.css */
@import url('../{new}/{new}.css');
```
In the new block's CSS, include selectors for BOTH class names. Remove the redirect once content is re-published.

## Pitfalls
- EDS auto-generates `.{block}-container` on the section — CSS targeting that class must update
- Importer table header controls block name in imported content — capitalize correctly
- PROJECT-BLOCKS.md and PROJECT-STATUS.md reference block names — update those too
- `export { default } from '...'` triggers eslint `no-restricted-exports` — use `import` + `export default`
