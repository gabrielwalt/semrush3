---
name: eds-code-conventions
description: CSS and JavaScript coding conventions for EDS blocks. Use when writing block CSS, block JS, or reviewing code for EDS standards. Extends EXCAT `excat-eds-developer`.
---

## CSS
- **Tokens, not literals (systematic tokenization).** Every `font-size`, `border-radius`, single-value `padding`/`margin`/`gap`, `letter-spacing`, `color`, and `transition` duration uses a `var(--token)` from `styles.css` — the style system only works if the same values are reused. Snap a near-match to the nearest token; add a NEW token (in `:root` + PROJECT-DESIGN) when a value recurs for one role with no token; leave only genuine one-offs as literals. **Don't swap a fixed literal for a responsive token** that shrinks under `@media` (see `typography-craft`). Run `node tools/quality/detect.mjs <files>` — `craft-token-literal` / `craft-radius-raw` flag missed swaps. Full rule: `craft-floor` Systematic-Tokenization Rule.
- Class names: `{block}-{part}` in kebab-case
- No positional selectors (`nth-child`) — use `decorate()` to add semantic classes
- No `!important` — use the `.full-width` escape hatch instead (see below)
- See `css-specificity-eds` when a rule isn't applying as expected

## Full-width escape hatch
See `full-width-escape-hatch` skill for the complete pattern. Key point: add `.full-width` class to the wrapper via JS, never duplicate the CSS rule in block stylesheets.

## JavaScript
- No layout coupling between blocks — each block is self-contained
- No `aem.js` edits
- `decorate()` must handle missing/optional content gracefully

## Clean and lean
- **Simple is always better.** If a simpler implementation works, use it. Never add complexity without documenting why it's needed.
- **No dirty hacks.** No workarounds for broken content in code (URL rewrites, fallback paths, `about:error` detection). Fix the content instead. If a content fix isn't possible, document the constraint and add a plan task — don't bury a workaround in block JS.
- **Fix at the right level.** Wrong image URL → fix in content. Wrong video path → fix in content. Missing media asset → fix via DA upload. Code workarounds for content problems create technical debt that outlives the original issue.
- **Clean up after yourself.** When resolving an issue, remove all previous failed attempts — leftover fallback files, dead code branches, temporary `let` where `const` sufficed. Review the diff before claiming done.
- **Code must be self-explanatory.** Add comments only to explain WHY, not WHAT. If something is unclear, it's probably technical debt — add it to the plan to be cleaned up.
- **Be proactive about code smells.** When touching any file, look for unnecessary complexity, dead code, or patterns that could be simpler. Add cleanup tasks to `PROJECT-PLAN.md` rather than ignoring them.

## Performance (EDS handles the rest — these few still bite)
EDS already delivers fast loads (no bundler, lazy blocks, optimized images) — don't add a perf pass or CWV tooling. But three things a block author can still break, so guard them:
- **Don't lazy-load above-the-fold media.** The hero/LCP image must load eagerly; `loading="lazy"` on it delays LCP. EDS eager-loads the first section — don't fight it.
- **Reserve space to avoid layout shift (CLS).** Give images/video/embeds explicit dimensions or `aspect-ratio` so content doesn't jump as they load.
- **Animate only `transform`/`opacity`** (bounded `filter`/`clip-path` ok) — never casually animate `width`/`height`/`top`/`left`/margins. See `motion-craft`.

## Quality
- `npm run lint` after every code change
- Verify visually at `localhost:3000`
- Screenshots under `/tmp/` only

See also: `full-width-escape-hatch` (detailed recipe), `css-specificity-eds` (when rules don't apply). Native `excat-eds-developer` covers the same ground at a generic level — this skill adds the no-`!important` rule, systematic tokenization requirement, clean-and-lean discipline, and the performance guards specific to this project.
