---
name: block-visual-iteration
description: Block is content-validated (GATE 1 passed) and the task is precise pixel-match delta closure against the original site — not for ad-hoc styling, iteration, or critique
---

When asked to visually improve a block, follow this recipe instead of ad-hoc screenshot comparisons.

## Step 0 — Run `excat-visual-critique` FIRST (don't eyeball the deltas)
**Before measuring anything by hand, launch the native `excat-visual-critique` skill** — the project's primary delta-discovery engine. Reach for it aggressively on *every* block/section/page/site styling task, not just when the user says "critique". It does deterministic, extraction-based comparison (exact CSS/structural/content/interaction diffs + a weighted similarity %) far more thoroughly than a hand-built diff; **site mode parallelizes sub-agents per template**. Trigger it by mode:

| You're styling… | Invoke critique in | 
|------|------|
| one block | **Block mode** (`blockName`, optional `page`) |
| a section the user selected | **Section mode** (`element_context`) |
| a whole page | **Page mode** (`originalUrl` + `migratedPath`) |
| the whole site / many pages | **Site mode** (parallel per-template sub-agents) |

Critique **detects and reports** (it never writes CSS itself) — its similarity % and categorized diff list become the worklist this measure-first loop then closes precisely. Let critique own *discovery*; this skill owns *the fix*. Prerequisite: import + `brand.css` exist (critique will tell you if not). Skip Step 0 only for a brand-new block that has no original to compare against.

**Critique is the structural signal, not the whole verdict.** Its % comes from values extracted off the **static file** — it is **blind to rendered-pixel defects** (overflow, clipping, overlap, misalignment, a one-item grid in a 4-track template). A page can score ≥90% and be visibly broken. So pair it with the **rendered-screenshot vision pass** (Step 5) — that's the GATE-2 layered diff (`validation-gates`).

**Read the fidelity mode first** (`PROJECT-DESIGN.md`). This pixel-match loop is the **Faithful** discipline. Under **Refined/Reimagined**, don't chase the % to parity — classify each delta as *intended refinement* / *acceptable simplification* / *unintended miss* and close only the last (`validation-gates` fidelity-aware verdict).

## Recipe (close each delta critique surfaced)

### 1. Measure original (programmatic, not screenshot)
Follow `measure-then-implement` for all values before implementing any fix — never guess a px value or color. **Prep the source first** (dismiss consent, hydrate lazy content, de-sticky — `measure-then-implement`). Use `evaluate` to extract computed styles from every element in the original block:
```js
// For each element: fontSize, fontWeight, lineHeight, letterSpacing, textTransform,
// color, backgroundColor, padding, margin, gap, borderRadius, width, height, position
```
Record the **section header** (eyebrow + heading) AND the **block content** separately.

### 2. Measure ours the same way
Same evaluate script on `localhost:3000`. Use `setTimeout` (3s) to wait for block JS decoration.

### 3. Produce a comparison table
Create a property-by-property diff table. Flag any value that differs. This is more reliable than visual comparison for catching letter-spacing, line-height, and margin differences that screenshots don't reveal.

### 4. Fix all differences in one batch
Apply CSS changes for ALL flagged properties at once, not one at a time.

### 5. Re-measure, then verify the RENDER with a screenshot (required, not optional polish)
Run step 2 again and confirm all measured values match (extraction is cheap ~2k and exact for property values — letter-spacing, line-height, color). **Then capture a readiness-gated screenshot** (`window.hlx === true`, `body.appear`, the block's `[data-block-status="loaded"]`) **and look at it.** Extraction is **blind to layout defects** (overflow, clipping, overlap, wrong rendered column count) — the screenshot is the only thing that catches those, so it is **required**, not just final confirmation. Diff the block's **styleguide stories** where they exist; for many blocks/stories, fan the visual review across **parallel sub-agents**.

## Pitfalls
- Don't compare active/hover states unless you trigger them first on both sites
- Section header styles come from the section's `.default-content-wrapper`, not the block itself — measure both
- Body-level inherited properties (font-weight, letter-spacing) affect all blocks — check global styles too
- When fixing one element, verify you didn't regress adjacent elements (load `regression-guard`)
- Improving a block's look on ONE instance — re-render **all** the block's styleguide stories and confirm the change holds across every combination (a fix for the 2-CTA case must not break the 0-CTA/no-image case). The styleguide, not the single page, is the verification surface (`styleguide-generator`).
- For sticky / scroll / long pages, capture **per-section screenshots, not `fullPage`** — fullPage double-renders sticky elements and is huge.
- **Do NOT adopt iteration caps (e.g. "max 3") or a flat 85/95% similarity threshold** — they conflict with the fidelity-aware critique (`validation-gates`). Borrow only **draft-first anti-perfectionism**: produce a fast first pass, then close deltas *by intent*, not to hit a number.

See also: `excat-visual-critique` (**run it first, Step 0**), `measure-then-implement` (how to extract values + responsive verification), `regression-guard` (full regression protocol), `styleguide-generator` (verify a look-change across all the block's stories, not one instance), `executing-plan-tasks` (Gap vs Enhancement verification). **Division of labor: critique discovers + scores the gaps; this loop closes them precisely** — it adds the `evaluate`-based measure-then-diff-table loop and Step 0 / Step 1–5 fix discipline on top of the generic native critique.
