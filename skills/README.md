# Skills Index

Each skill is a directory with a `SKILL.md` file. Scan the "Load when..." column — if a trigger matches your situation, read that skill in full before proceeding.

To create a new skill: **LOAD `writing-skills/SKILL.md` in full before writing anything.** Then copy `_template.md`.

**Context budget:** Only the "Always load" skills are read every session. All other skills are loaded on demand via trigger matching. Do not load skills speculatively — load them when the trigger fires.

---

## Always load

These are tiny, high-impact skills that apply to every session. Load them at session start.

| Skill | Load when... |
|-------|-------------|
| [session-startup](session-startup/SKILL.md) | **ALWAYS** — at the start of every new session, before any work |
| [session-close](session-close/SKILL.md) | **ALWAYS** — at the end of every session before signing off |
| [verify-before-claiming](verify-before-claiming/SKILL.md) | **ALWAYS** — before writing "done", "fixed", "implemented", or any completion claim |

---

## Plan tasks

| Skill | Load when... |
|-------|-------------|
| [writing-plan-tasks](writing-plan-tasks/SKILL.md) | Creating or updating tasks in PROJECT-PLAN.md from user-reported gaps or enhancement requests |
| [executing-plan-tasks](executing-plan-tasks/SKILL.md) | Picking up a plan task to implement; need to confirm the problem before coding and verify after |

---

## Quality guards

Load these before making changes — they prevent regressions and guesswork.

| Skill | Load when... |
|-------|-------------|
| [regression-guard](regression-guard/SKILL.md) | About to edit CSS in `styles.css`, block wrappers, or any shared selector |
| [quality-tooling](quality-tooling/SKILL.md) | Verifying a CSS/style change, guarding a frozen page, starting a session, or capturing knowledge — run the deterministic checkers (`tools/quality/detect.mjs`, `project-state.mjs`, `km-check.mjs`) instead of eyeballing rules or guessing state |
| [styling-additively](styling-additively/SKILL.md) | Styling any page after the first; matching a new page to its original; tempted to edit an existing block/variant/section-style CSS (add new ones instead) |
| [block-visual-iteration](block-visual-iteration/SKILL.md) | Block is content-validated (GATE 1 passed) and the task is precise pixel-match delta closure against the original site — not for ad-hoc styling, iteration, or critique |
| [debug-block-decoration](debug-block-decoration/SKILL.md) | Block renders incorrectly (missing/partial content, images not showing) despite correct authored content; or a block renders differently across environments ("works on prod but not local") |
| [repo-cleanup](repo-cleanup/SKILL.md) | "Clean up the project", remove unused blocks/CSS/JS/assets, tidy the repo, simplify, or reconcile after a scope change — safe multi-pass cleanup that never moves a validated page |
| [validation-gates](validation-gates/SKILL.md) | A page reaches content or style completion; deciding whether a page is "done"; marking GATE 1 / GATE 2 in PROJECT-STATUS.md; a regression forces unfreezing a validated page |
| [unfreeze-page](unfreeze-page/SKILL.md) | About to edit CSS/JS a frozen (style-validated) page uses, or the user requests a change on a frozen page — detect impact, ask before unfreezing (`✅ 🔓`), re-freeze after re-validation |

---

## Layout & CSS

| Skill | Load when... |
|-------|-------------|
| [css-specificity-eds](css-specificity-eds/SKILL.md) | A CSS rule isn't applying; computed style shows wrong value |
| [eds-dom-structure](eds-dom-structure/SKILL.md) | Selector doesn't match; need to know where EDS puts blocks in the DOM |
| [vertical-spacing-system](vertical-spacing-system/SKILL.md) | Foundation spacing + universal block-spacing variants; blocks touching with no gap; sections too far apart; page rhythm wrong |
| [full-width-escape-hatch](full-width-escape-hatch/SKILL.md) | Setting up the max-width container; block needs to escape it; tempted to write `!important` on wrapper |
| [css-pitfalls-eds](css-pitfalls-eds/SKILL.md) | Fixing stylelint `no-descending-specificity` errors; a background image suddenly renders at native size after shorthand consolidation; `position: sticky` breaks on an element whose ancestor has `overflow: hidden`; a `backdrop-filter` glass effect is invisible or inner corners bleed |
| [eds-code-conventions](eds-code-conventions/SKILL.md) | Writing block CSS or JS; reviewing code for EDS standards |
| [responsive-adaptation](responsive-adaptation/SKILL.md) | Making an imported page work on mobile/touch; a hover-only interaction breaks on touch; long author text overflows a block; any responsive refinement pass |
| [interaction-states-eds](interaction-states-eds/SKILL.md) | Building/auditing a CTA, form field, nav dropdown, carousel control, tab, or clickable element; a dropdown/menu is clipped or invisible; a focus ring is missing; placeholder used as a label (the 8 interactive states) |

---

## Design craft (rebuild an elegant brand foundation)

The *positive method* for building each foundation dimension well, from impeccable.style. Pair with `craft-floor` (the minimum bar) and `global-style-foundation` (the orchestration). The four dimensions: typography, color, layout, motion.

| Skill | Load when... |
|-------|-------------|
| [typography-craft](typography-craft/SKILL.md) | Rebuilding a brand's type system from a source; building the type half of the foundation; type feels generic/muddy (scale ratio, weight roles, measure, light-on-dark, font-loading) |
| [color-craft](color-craft/SKILL.md) | Rebuilding a brand palette; building the color half of the foundation; color feels flat/timid/chaotic (roles, 60-30-10, tinted neutrals, OKLCH ramps, dark mode) |
| [layout-craft](layout-craft/SKILL.md) | Building a page/block's composition; layout feels "off" despite right colors/fonts; hierarchy unclear (squint test, rhythm, flex/grid/container-query, optical alignment) |
| [motion-craft](motion-craft/SKILL.md) | Adding/refining a block's transitions; page feels static or over-animated (fade-rise-on-every-section); deciding if a motion earns its place (budget, duration-by-role, ease-out, accessible) |
| [scroll-reveal-animations](scroll-reveal-animations/SKILL.md) | Implementing scroll-triggered reveals, number count-up, or bar/chart fill in EDS without gating content or breaking reduced-motion (the mechanics; motion-craft owns the judgment) |

---

## Nav & Header

| Skill | Load when... |
|-------|-------------|
| [nav-header-eds](nav-header-eds/SKILL.md) | Header broken; nav invisible; mega menu won't animate; sticky not working; transparent bg issues; mobile click delegation |

---

## Content & Authoring

| Skill | Load when... |
|-------|-------------|
| [eds-content-patterns](eds-content-patterns/SKILL.md) | Auto-styles: link not becoming a CTA button; button style wrong; eyebrow not styling; `decorateButtons()` not triggering |
| [eds-content-modeling](eds-content-modeling/SKILL.md) | **Augmented-styles hub** — block vs variant vs section style vs page template; naming; cell/column conventions; one-off discipline |
| [container-block-vs-section-style](container-block-vs-section-style/SKILL.md) | A container (tabs/accordion/carousel) must hold a variety of content or reuse existing blocks; inner block content renders unstyled; "block or section style?" |
| [context-adaptive-blocks](context-adaptive-blocks/SKILL.md) | A block needs a dark/inverted look only because its CONTAINER (section style / page template) is dark; deciding whether to add a `*-dark`/`*-inverse` variant; "do authors really need the dark variant", "template already inverts colors" |
| [page-template-metadata](page-template-metadata/SKILL.md) | Applying page-level styles via metadata template classes; deciding whether a page template is warranted (be conservative) |
| [eds-section-style-icons](eds-section-style-icons/SKILL.md) | Section needs a decorative icon or badge injected via CSS (not authored content) |

---

## Blocks & Patterns

| Skill | Load when... |
|-------|-------------|
| [carousel-pattern-eds](carousel-pattern-eds/SKILL.md) | Building horizontal scrolling carousel with right-edge bleed |
| [video-in-eds](video-in-eds/SKILL.md) | Implementing video; EDS rewrites video URLs in link hrefs |
| [repo-hosted-svg-references](repo-hosted-svg-references/SKILL.md) | DA/html2md (409) "Images … failed validation" on preview/publish; an SVG too large for the document; author-friendly link that a global script expands into an `<img>` |
| [measure-then-implement](measure-then-implement/SKILL.md) | Matching exact dimensions, colors, hover states, or responsive behavior; about to write a px value from memory |

---

## Import & Migration

| Skill | Load when... |
|-------|-------------|
| [bootstrap-project](bootstrap-project/SKILL.md) | Project uninitialized — no PROJECT-STATUS.md / PROJECT-PLAN.md yet; scaffold the PROJECT-* stubs and verify the toolchain before `migration-orientation` |
| [migration-orientation](migration-orientation/SKILL.md) | **First thing on any new project** — user says "let's migrate X / start a new site / start a migration"; `PROJECT-DESIGN.md` has no `## Migration Strategy` section. Runs the setup conversation (authoring model, scope, analysis approach, starting page, sources, fidelity, resources, overrides, constraints) and records the strategy before anything else happens |
| [import-content-scoping](import-content-scoping/SKILL.md) | Scoping which pages to import; site discovery returns tens of thousands of URLs; one URL group dwarfs all others; deciding marketing vs database-backed vs documentation content |
| [import-template-consolidation](import-template-consolidation/SKILL.md) | Catalog discovery returns >~10 templates or drift-suffix names (foo, foo-b, foo-c); planning bulk import; deciding if a "new" page type is really new — collapse raw templates into a handful of canonical ones, normalizing drift |
| [global-style-foundation](global-style-foundation/SKILL.md) | Right after orientation, before any block styling; building the global *workbench* (brand tokens, type scale, spacing, default-content styling) from the visual gist of ≥3 representative pages; global foundation missing or weak |
| [craft-floor](craft-floor/SKILL.md) | Building or auditing the global foundation at Refined/Reimagined fidelity; something looks like AI output (flat color, twin font sizes, arbitrary spacing, no focus rings). NOT for Faithful — mirror the source. Pair with `quality-tooling` to run the `[auto]` checks |
| [marker-driven-import](marker-driven-import/SKILL.md) | User validated a page's content; designing ONE generic marker-driven parser; adding detection for a new block/variant/section-style/template; import doesn't reproduce validated content |
| [importer-parser-patterns](importer-parser-patterns/SKILL.md) | Writing a block parser; parser validation failing; content structure questions (low-level table/DOM mechanics) |
| [importer-diff-workflow](importer-diff-workflow/SKILL.md) | After a parser/import change — diffing a re-imported page against its remote reference to catch content loss; `marker-driven-import` says "diff against reference" and you need the bash tooling |
| [eds-migration-process](eds-migration-process/SKILL.md) | Migration already oriented (strategy exists in `PROJECT-DESIGN.md`) — deciding what phase or page comes next, running content/design validation gates, checking progress. **Not for new projects** — load `migration-orientation` first |

---

## Block Renaming

| Skill | Load when... |
|-------|-------------|
| [block-rename-checklist](block-rename-checklist/SKILL.md) | Renaming a block — name propagates to 12+ locations; includes remote content redirect pattern |

---

## Skills Library

| Skill | Load when... |
|-------|-------------|
| [writing-skills](writing-skills/SKILL.md) | Creating a new skill; improving existing skill; auditing the skill library |
| [curating-project-knowledge](curating-project-knowledge/SKILL.md) | The user reveals a durable decision, constraint, fact, preference, or correction; integrating any learning into a project MD file; deciding whether it belongs in context, a skill, a checker, or a structured PROJECT file |

---

## Native EMA & EDS skills (built-in — for discovery)

These ship with the agent (the `excat:`, `edge-delivery-services:`, `forms-excat:`, `excat-commerce:`, `excat-figma:`, and `project-management:` plugins). They are **not** in `skills/` — invoke them directly by name. Use them for capabilities the project library doesn't cover (discovery, multi-agent orchestration, specialized page types, docs, handover).

**Precedence:** where a project skill above covers the same ground, the **project skill wins** — it encodes our opinions (augmented-styles ladder, single marker-driven parser, clean-code rules). Load the project skill first; reach for the native one for the parts it points you to.

**Trigger `excat-visual-critique` aggressively — it's our delta-discovery engine, not an optional final check.** The v2 critique is **extraction-based**: it detects exact CSS/structural/content/interaction diffs and computes a weighted similarity %, in **Block / Section / Page / Site** modes (site mode runs **parallel sub-agents, one per template**). Run it at the START of any styling task and again to confirm a fix moved the % — on every block, section, page, or site styling pass, not only when the user says "critique". It **reports, never writes CSS**: critique discovers + scores the gaps, then the project's `block-visual-iteration` measure-first loop closes each one. This pairing is wired into `block-visual-iteration` (Step 0), `eds-migration-process` (GATE 2 opener), and `styling-additively` (discovery before additive fixes) — so styling work always opens with a critique.

| Native skill | Reach for it when... | Project skill that takes precedence |
|--------------|----------------------|--------------------------------------|
| `excat-site-scope`, `excat-site-catalog`, `excat-url-discovery`, `excat-site-analysis`, `excat-page-analysis` | Scoping a new site: discover URLs, group pages into templates, analyze one page's structure | `import-content-scoping` (triage marketing vs programmatic vs docs), `import-template-consolidation` (collapse raw templates before bulk import) |
| `excat-site-migration` | Orchestrating a full multi-page migration | `migration-orientation` (runs first — authoring model, scope, sources, fidelity); then `eds-migration-process` (the 2-gate per-page flow) |
| `excat-import-infrastructure`, `excat-import-script`, `excat-content-import` | Generating/running parsers + transformers, bulk import | `marker-driven-import`, `importer-parser-patterns` |
| `block-mapping-manager`, `block-variant-manager` | Tracking block variants/mappings across many pages | `eds-content-modeling` (naming + variant tiers) |
| `excat-complete-design-expert`, `excat-block-design-expert` | Extracting design tokens / styling a block from the source | `measure-then-implement`, `block-visual-iteration` |
| `excat-visual-critique` | **Aggressively, at the START of (and after) ANY styling pass** — extraction-based similarity % + categorized diffs vs original; Block/Section/Page/Site modes (site = parallel per-template sub-agents) | **Discovery engine** — discovers + scores gaps (never writes CSS); pairs with `block-visual-iteration` (Step 0) / `styling-additively` / GATE 2, which close them |
| `excat-navigation-orchestrator`, `excat-footer-orchestrator` | Migrating/instrumenting header or footer from the source (needs screenshots) | `nav-header-eds` (CSS/JS debugging of the result) |
| `excat-eds-developer`, `excat-eds-debugger` | General block development or debugging workflows | `eds-code-conventions`, `debug-block-decoration`, `css-specificity-eds` |
| `excat-xwalk-expert` | Converting HTML → JCR XML for Universal Editor / AEM authoring | — |
| `forms-excat:excat-form-migration` | Migrating an HTML form to an EDS Form block | — |
| `excat-commerce:*` | Migrating a PDP or PLP (Adobe Commerce) | — |
| `excat-figma:excat-figma-migration` | Building a block from a Figma design | — |
| `edge-delivery-services:docs-search`, `block-collection-and-party` | Looking up an aem.live feature or a reference block implementation | `eds-dom-structure` (has a docs-lookup recipe) |
| `edge-delivery-services:content-modeling`, `building-blocks`, `content-driven-development`, `testing-blocks`, `preview-import` | Generic EDS authoring/dev guidance | `eds-content-modeling`, `eds-code-conventions` |
| `excat-ui-tour` | User asks how to use the Console UI | — |
| `project-management:handover` (`admin`/`authoring`/`development`/`whitepaper`) | Generating handover/admin/author/dev docs or a branded PDF | — |
