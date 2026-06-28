---
name: styleguide-generator
description: Build and maintain a Storybook-like styleguide for an EDS project — a set of real content pages that render every default-content element, every block × variant × section style, and every page template through the actual CSS/JS. Use when the foundation is set and you want a living visual reference + GATE-2 diff target, after validating a new block/variant/section-style/template, or when a no-render stage needs something reviewable.
---

A styleguide is not a build artifact — it's a set of **real EDS content pages** that exercise every default-content element, block, variant, section style, and page template through the **actual decoration**, so it renders exactly as production does. It is three things at once: a living visual reference, the **GATE-2 diff target** (`block-visual-iteration` / T-001 diff against it, not a static file), and the reviewable artifact to show at no-render foundation stages.

**The Styleguide-Mirrors-Inventory Rule.** The styleguide must always match `PROJECT-BLOCKS.md`. A styleguide missing the newest variant is worse than none — it gives false confidence. Update it in the **same step** a block/variant/section-style/template is validated (spot-and-act; re-checked at `session-close`).

Opt-in per project: `migration-orientation` asks whether to maintain a styleguide and records it in `PROJECT-DESIGN.md`. If yes, scaffold it right after `global-style-foundation` (before the first import) with just default-content + the blocks the first page needs; grow it as blocks are built.

## Stories — the meaningful content combinations (Storybook, applied reasonably)
A **story** is a named scenario showing one way a block is really used. Borrow Storybook's idea — exercise a component's meaningful states — but stay lean: create a **small curated set** per block, only combinations that **change the rendering**, never a full cross-product. Each story renders on the block's page under a labeled heading.

**The Stories-Cover-Edge-Cases Rule.** A block isn't done until its styleguide page renders every story that changes its layout — so author-content edge cases surface here, on the styleguide, not on a live page.

Pick stories from these axes (include one only when it changes rendering):
- **Optional content present vs absent** — with / without image, eyebrow, description.
- **Media type** — image vs video, where the block accepts media.
- **Count that shifts layout** — 0 / 1 / 2 / many of a repeating element (CTAs, cards, items); cover the boundaries that re-flow.
- **Content extremes** — long heading / long copy (wrap + overflow) and the short case.
- **Each variant**, and **each section-style context** the block sits in (especially dark/inverse).

Reasonable, not exhaustive: **3–6 stories** cover most blocks; if two render identically, keep one.

## Use it to verify (the styleguide is the test surface)
- **New block** → add its page with all meaningful stories; confirm each renders (no-image, image-as-video, 0/1/2-CTA included) before GATE 2.
- **New variant / section style** → add a story for it (and block × that context); confirm the meaningful combinations hold.
- **Improving a block's look** → re-render **all** the block's stories; confirm the change is right across every one — a fix for the 2-CTA case must not break the 0-CTA case.
- **Importing a template** → scan the styleguide as the **block census** (Toolbox-First): compose the page from existing blocks/combinations before forging anything new — often no new code is needed.

## Recipe
Author under a `/styleguide/` path — net-new authored pages (NOT imported), the one content the agent writes directly (exempt from *content = import script* + the guard hook). Keep it **out of site nav/sitemap** (internal reference). Use representative sample copy, never `lorem`.

| Page | Renders |
|------|---------|
| `/styleguide` (index) | Overview + links to every page; a legend of all CTA/button forms |
| `/styleguide/default-content` | Every semantic element: `h1`–`h6`, paragraph, lead, `ul`/`ol`, blockquote, inline (link/bold/italic/code), table, image, eyebrow, button/CTA variants — shows global type + spacing |
| `/styleguide/blocks/<block>` | One page **per block**: the block under each meaningful **story** (see Stories) — variants, section-style contexts, and content edge-cases (no-image / image-as-video / 0·1·2 CTAs) |
| `/styleguide/sections` | Each section style applied to the same sample content, so styles compare side by side |
| `/styleguide/templates` | One page per page template (the chrome) — if templates exist |

- **Generate from the inventory:** read `PROJECT-BLOCKS.md` (blocks, variants, section styles) + `blocks/` + page templates. One page per block keeps it scannable and lets a critique/diff target a single block.
- **Build from real blocks/content**, not hand-written classes — the pipeline strips authored classes, and only real decoration is a faithful reference.
- **Use it:** GATE-2 diffs the styleguide page against the source; orientation/foundation stages point the user at it ("nothing renders yet, but review `/styleguide/default-content`"); teammate onboarding.

## Pitfalls
- Drift from `PROJECT-BLOCKS.md` → false confidence. Update in lockstep, not "later".
- Linking it into site nav or publishing it as a public page — it's an internal reference; keep it unlinked.
- `lorem`/`TODO` placeholder → trips `detect.mjs` `craft-cruft-placeholder` and looks unreal; use realistic sample copy + the element's own label.
- One giant page → a diff can't target a single block. Split one page per block.
- Hand-authoring HTML with block classes → stripped by the pipeline + not a faithful render. Author through the real blocks.
- **Combinatorial explosion** — a story for every option crossed with every other; keep the 3–6 that change rendering, not an exhaustive matrix.

See also: `migration-orientation` (asks the styleguide opt-in, records it), `global-style-foundation` (the foundation it showcases; scaffold the styleguide right after), `eds-content-modeling` (the block/variant/section-style/template taxonomy it enumerates; add stories when creating one), `block-visual-iteration` (verify a look-improvement across all stories), `validation-gates` (GATE-2 diffs against it), `eds-migration-process` (template composition = styleguide as block census; point users at it at no-render stages).
