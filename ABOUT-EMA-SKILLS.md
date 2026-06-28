# About this boilerplate — EMA's skills, guardrails & self-learning layer

> What this fork of `aem-boilerplate` adds, why it matters, and how it works — for the curious reader first, the engineer second.

---

## What EMA is

**EMA — the Experience Modernization Agent — is a hosted, agentic platform for migrating and modernizing websites onto Adobe Edge Delivery Services (EDS).** You point it at an existing site; it converses with you, studies the source, and rebuilds the pages as clean, fast, author-friendly EDS content and code — vanilla JS + CSS, no build step, no framework. It runs in the browser at `aemcoder.aem.io`; you don't install anything.

EMA is an **agent**, not a wizard. It reasons, asks questions, proposes next steps, and does the work — but like any capable assistant, it's only as good as the judgment and discipline it brings to each decision. That judgment lives in its **skills**.

## Why skills are essential

A migration is a thousand small decisions: *Is this a heading or a block? Does this column survive the publishing pipeline? Does this page already exist as a reusable component? Is this "done", or does it just look done?* Get them wrong and you get a site that's brittle, off-brand, or quietly broken after publish.

**Skills are how the agent stops guessing.** Each skill is a short, battle-tested playbook for one of those decisions — *"what I wish I'd known 30 minutes ago."* The agent checks its skills before acting and distills every hard-won lesson back into them afterward, so it **never solves the same problem twice.** Skills are the difference between an agent that's clever once and an agent that gets reliably better.

---

## The pitch (the honest version)

The stock EDS boilerplate already ships a genuinely capable migration agent. **This fork takes that capable agent and gives it discipline, foresight, and a memory.**

The difference isn't magic — it's method:

- **It builds the house before decorating it.** Instead of diving headfirst into page one, it first establishes your brand foundation — type scale, color, spacing — and a **living styleguide**: a set of real pages showcasing every building block before a single page is migrated. You see and approve the *vocabulary* of your new site first. Everything after is built on that solid base, so the project grows organically but stays strongly structured.

- **It matches the ambition you actually want.** Up front it asks how faithful to stay to the original — copy it closely, regularize and uplevel it, or reimagine it — and *explains what each choice will mean* before you pick. Then it holds itself to that bar. Inspired by the best modern design-system practice (e.g. impeccable.style) and the latest SLICC migration techniques, it extracts a foundation and a fidelity that genuinely correspond to what you asked for — not a generic AI default.

- **It keeps itself honest.** This is the part that matters most. The agent will not tell you a block is "done" because the code looks right — it takes a screenshot and *looks*, the way you would. It trusts your "I can't see it" over its own green checkmarks. It measures the original instead of guessing. It runs deterministic checks that catch broken styling and lost content before it ever asks you to sign off. When it isn't sure, it says so and asks.

- **It can't quietly break your launch.** The most common ways a migration breaks *after you publish* — wrong paths, edited platform files, structure the pipeline silently strips — are now prevented mechanically, before they ever reach your site.

- **It learns.** Every non-obvious fix becomes a skill. The longer it works, the fewer mistakes it repeats — across this project and the next.

**The honest caveat:** it's still an AI agent. It can still misjudge a design call or misread an ambiguous page. What changed is that it's now *built to catch itself* — to verify before claiming, ask before guessing, and prove what it asserts — instead of confidently sailing past its own mistakes. That's not a smaller promise. For a migration, it's the whole game.

---

## What this means for you, concretely

**You'll be asked a short, purposeful set of questions up front** — and every option comes with its consequence spelled out, so you're never picking blind:

- **Authoring model** — Document Authoring (da.live) or Universal Editor / Crosswalk?
- **Scope** — one page, a set, or the whole site?
- **Fidelity** — *Faithful* (clean rebuild, close to source), *Refined* (keep the brand, uplevel the craft), or *Reimagined* (rethink it) — each with a plain-English note on what it does to the result.
- **Sources & resources** — the live site, a Figma file, brand guidelines, fonts?
- **A styleguide?** — recommended: maintain a living styleguide of your blocks as they're built (it doubles as the quality check). You choose.
- **Who you are** — just your GitHub username; it assumes you're the site owner and infers the rest from your first request. No interrogation. (If a second collaborator joins later, it notices and adapts.)

**Then it guides you through a clear, gated flow** rather than dumping a finished site on you:

1. **Foundation first** — it builds and shows you the brand tokens and the styleguide. *Nothing renders as a full page yet, and it tells you that's expected* — and points you at exactly what *is* reviewable now.
2. **Page by page, content before design** — it models each page's structure and asks you to **validate the content** (the split into headings, blocks, sections, and their names) before it styles anything.
3. **Then the look** — it styles the page, compares it to the original, and asks you to **validate the design**. Once you approve a page, that page is *frozen* — later work can't silently change it.
4. **Publish** — it verifies everything is publish-ready and hands you the steps; you stay in control of what goes live.

**How it keeps it real for you:**
- It shows you screenshots of the *actual rendered page*, not a description of what the code should produce.
- It tells you when something is verified vs. assumed.
- It never claims a page matches the original on a number alone — it points to specific, visible differences.
- It does the migration; **it never publishes or commits on your behalf** — those are always your call, through the console.

---

## Under the hood (for engineers)

Everything below is layered **on top of the stock `aem-boilerplate`** — the base ships a real migration toolchain; this fork adds the doctrine, skills, deterministic tooling, hooks, and memory that turn it into a guided, self-correcting, publish-safe system.

### 1. The doctrine layer — `AGENTS.md`

The always-loaded contract. Beyond the base guidance, it adds:

- **The always-on `NEVER` list (publish-correctness).** A short, prescriptive set of terse DON'Ts that prevent the failures that only surface *after publish* — never edit `scripts/aem.js`, never use a `/content/…` absolute path (EDS serves at the site root), never author structure as nested divs/authored classes (the pipeline strips them), never reconstruct stripped structure in JS, never name a non-block wrapper with a block class, never ship block CSS nothing produces, never write `content/*.plain.html` directly, never run git/publish, never overwrite content without backup, never call visual work "done" from DOM props alone. It lives in always-loaded context (not a skill that might not load), because the cost of forgetting one is a broken launch. The mechanically-decidable ones are *also* enforced by a hook (§4).
- **Named Rules** — citable doctrine handles the agent reasons with by name: *Workbench-Before-Tools*, *Brand-Foundation-First*, *Toolbox-First*, *Frozen-Tools*, *Bookend-Verification*, *Anti-Pattern-Capture*, *Executable-Rule*, *Heavy-SVG-In-Code*, *Puzzle-Piece*.
- **Explain-consequences-on-every-question** — every choice presented to the user carries its trade-off, not just a label.
- **Concluding-answer discipline** — every substantive reply ends with a summary that invites validation, one concrete next step, a skill-capture check, and a knowledge-capture check.
- **Safety** — no git, no AEM pushes, ever; the agent migrates, the user publishes.

### 2. The skills library — `skills/` (~50 skills, one source-of-truth index)

A curated, cross-referenced library, loaded on-demand by trigger so context stays lean. The load-bearing additions:

**Orientation & process**
- `migration-orientation` — the mandatory setup conversation (13 inputs across ≤3 rounds, assert-then-confirm), including the fidelity scale *with consequences* and the styleguide opt-in. Nothing imports until the strategy is recorded.
- `eds-migration-process` — the two-gate, content-before-design, workbench-before-tools workflow, with the publish-ready gate before any handoff.
- `bootstrap-project` — day-one scaffolding of the `PROJECT-*` files, a human-readable `README.md` (derived env URLs + doc links), and a clean-toolchain check.

**Foundation & craft (the impeccable-inspired layer)**
- `global-style-foundation` — build the brand *workbench* (tokens, type scale, spacing, default-content styling) from the visual gist of ≥3 pages, before any block. Provisions tokens on demand, and orients the user at no-render milestones.
- `craft-floor` + `typography-craft` / `color-craft` / `layout-craft` / `motion-craft` / `scroll-reveal-animations` — the *positive method* for building each foundation dimension well, with executable thresholds, applied conditionally on the chosen fidelity.

**Content modeling**
- `eds-content-modeling` — the augmented-styles ladder (default content → auto-styles → blocks → variants → section styles → templates), naming conventions, the **Typing Test**, interactive-control modeling, context-adaptive (dark-surface) blocks, and the **No-JS-Reconstruction Rule** (re-model in content; never rebuild stripped structure in JS).
- `eds-dom-structure` — the wrapper/container/block chain, **what survives the lossy plain pipeline**, and the **visibility-reveal lifecycle** (why a mis-named wrapper renders blank).
- `eds-content-patterns`, `container-block-vs-section-style`, `page-template-metadata`, `context-adaptive-blocks`, `eds-section-style-icons`.

**Import (the SLICC-informed layer)**
- `marker-driven-import` — ONE generic, marker-driven parser that reproduces validated content; **rebuild-from-wrappers** as the default driver (no leaked content); remote author-edit-loss safety.
- `importer-parser-patterns` — table mechanics, DA/html2md **cell gotchas** (`<span>` stripping, image+text cells, `colspan`, broken-URL forms), interactive-control output, and **source SEO-metadata → Page Metadata** extraction.
- `post-import-sectionizer` — html2md strips `<hr>` *wherever* emitted, so section boundaries are restored by a deterministic post-import step, not by fighting the pipeline.
- `importer-diff-workflow`, `import-content-scoping`, `import-template-consolidation`, `repo-hosted-svg-references`.

**The styleguide as test surface**
- `styleguide-generator` — a Storybook-like styleguide built from real EDS pages: default content, one page per block × variant × section style, and page templates. Borrows Storybook's idea of **"stories"** (named, meaningful content combinations — no image / image-as-video / 0·1·2 CTAs) but kept lean (3–6 per block). It is simultaneously a living reference, the **GATE-2 diff target**, and the verification surface for every new block, variant, look-change, and template reuse.

**Validation & "keeping it real"**
- `validation-gates` — GATE 1 (content) and GATE 2 (design), user-confirmed; mechanical pre-checks before sign-off; the **three-signal layered visual diff** (rendered-screenshot + vision critique + deterministic extraction) that replaces an extraction-only score blind to overflow/overlap; and the **fidelity-aware verdict**.
- `verify-before-claiming` (always-loaded) — **The Screenshot-Is-Proof Rule**: a screenshot is the proof, DOM properties are supporting evidence only; trust the user's "I can't see it"; the open-criteria/close-checklist bookend.
- `block-visual-iteration`, `measure-then-implement` (measure the original; **prep the source** — dismiss consent, hydrate lazy, de-sticky — before measuring/diffing).

**Freeze, reuse & regression**
- `styling-additively` (Toolbox-First; **The Additive-or-Ask Rule**), `regression-guard`, `unfreeze-page` — so a validated page never silently moves under later work.

**Publish correctness**
- `verify-publish-readiness` (EMA verifies, the user connects), `debug-eds-publish` (the two un-conflated failure modes + symptom→cause table), `nav-header-eds` (root-path nav/footer rule, footer structure).

**Knowledge management & meta**
- `writing-skills` (the quality bar + the Executable-Rule discipline), `curating-project-knowledge` (the Puzzle-Piece Rule + a two-rung **promotion ladder** with `[verified]/[assumed]` honesty tags), `session-startup` / `session-close`, `quality-tooling`.

### 3. Deterministic quality tooling — `tools/quality/` + `tools/importer/`

The **Executable-Rule Rule** made real: rules that *a script can check* are checked by a script, so the agent operates on facts, not memory. Each is dependency-light, reads project state live (never hardcoded), and exits non-zero on failure.

| Tool | What it enforces |
|------|------------------|
| `detect.mjs` | The craft-floor CSS/HTML linter — off-palette color, dead/unused tokens, raw literals, side-stripe accents, stray breakpoints, missing reduced-motion guards. |
| `project-state.mjs` | Ground-truth JSON of which pages are frozen/changed — so freeze decisions read facts, not prose. |
| `km-check.mjs` | Verifies the knowledge stores: no project literals leak into a generic skill, no misplaced procedures, no bloat. |
| `content-fidelity.mjs` | **Content-loss detector** (adapted from SLICC's `dom-equality`): diffs reference vs candidate on visible text, headings, images, block counts — normalizing media hashes and ignoring the blockified tag tree — so a faithful re-import passes while *dropped or duplicated* content fails. |
| `css-no-producer.mjs` | Flags block CSS selectors **nothing produces** — a `<block>-*` rule the JS never emits is provably dead (renders unstyled), caught locally without publishing. |
| `publish-readiness.mjs` | Pre-publish gate: `/content/` paths, fstab mountpoint, preview org/site — keeping the two failure modes (client-settings vs content-bus) **un-conflated**. |
| `guard-hook.mjs` | The publish-correctness PreToolUse guard (see §4). |
| `tools/importer/sectionize.mjs` | Restores section boundaries the pipeline flattens; block-class list derived live from `blocks/`. |

### 4. Committed hooks — `.claude/settings.json`

Two always-on hooks ship with the fork (committed, so they fire for everyone):

- **PreToolUse `guard-hook.mjs`** — *blocks* the mechanically-decidable, most-vital NEVER violations before they happen: editing `scripts/aem.js`, writing `content/*.plain.html` (except the styleguide), a `/content/` path in `head.html` nav/footer meta, and any `git`/publish command. The always-on list prevents; the hook is the after-the-fact net for the cases where a slip is unrecoverable. (Fails open — a buggy guard never bricks the agent.)
- **PostToolUse `css-no-producer.mjs`** — surfaces dead block-CSS selectors as feedback the moment a block stylesheet is edited.

### 5. Shared memory — the `PROJECT-*` files

Structured, human-readable documents the agent reads every session and updates as it works: `PROJECT.md`, `-DESIGN`, `-STATUS`, `-PLAN`, `-BLOCKS`, `-IMPORT`, `-TEMPLATES`, and `-CONTEXT` (the project wiki). Tools parse them; skills read them; nothing important lives only in the agent's head between sessions.

### 6. Knowledge management & multi-user — `users/`

Per-user memory (`context.md`, `plan.md`, `ROLE.md`), an **assume-the-owner identity gate** (ask only the GitHub username; infer the rest; warn and adapt when a second collaborator appears), and a promotion ladder that graduates a proven project fact into a generic skill for the *next* migration.

### 7. The verification stack — how it stays honest

The single most important behavioral change, enforced across `verify-before-claiming`, `validation-gates`, and the checkers:

- **A screenshot of the rendered page is the proof.** DOM properties (`childElementCount`, computed `display`, `gridTemplateColumns`) pass while a page is visibly broken — a `visibility:hidden` wrapper reports `display:block`; a four-track grid with one item paints as one column. Only the rendered pixels tell the truth.
- **The GATE-2 layered diff** pairs that rendered screenshot + a vision critique that *names* defects with the deterministic extraction signal — because an extraction-only similarity score is structurally blind to overflow, clipping, and overlap.
- **Content-loss is caught deterministically** before content sign-off; **dead styling** is caught before design sign-off; **publish-readiness** before the publish handoff.
- **Confidence is tagged** (`[verified]` vs `[assumed]`), and the user's lived observation outranks a green readout.

### 8. The inspirations

- **impeccable.style** — the craft floor (executable thresholds for typography, color, layout, motion), the positive method for rebuilding a brand foundation, and the discipline that rules should be *enforced*, not merely remembered.
- **SLICC migration skills** — the content-fidelity checker (from `dom-equality`), the cross-project learnings ladder, the DA/html2md cell-and-layout gotchas, source-page prep before measuring, the Typing Test and deterministic decomposition signals (CxR layout, ΔE section boundaries), and version-before-overwrite safety. (The DOM-preserving overlay engine was evaluated and deliberately deferred — too much complexity for the value, given the blockify path.)

---

## The value, in one list (vs. bare `aem-boilerplate`)

1. **Foundation- and styleguide-first** workflow — a sustainable base before page-one, not after.
2. **A fidelity contract** (Faithful / Refined / Reimagined) chosen with consequences and honored at every gate.
3. **A living styleguide** that is also the test surface for every block, variant, and look-change.
4. **Publish-correctness by prevention** — an always-on NEVER list + a blocking hook for the unrecoverable cases.
5. **Honest verification** — screenshot-is-proof, a layered visual diff that sees real pixels, deterministic content-loss and dead-CSS detection, and trust-the-user.
6. **Six deterministic checkers + a sectionizer + two committed hooks** that turn recall-based rules into enforced facts.
7. **A guided, gated, two-validation process** that keeps you in control and oriented even at no-render stages.
8. **Persistent shared memory** (`PROJECT-*`) and **per-user / multi-user memory** (`users/`).
9. **A self-learning skill library** with a quality bar, anti-pattern capture, and a cross-project promotion ladder.
10. **A clean, lean codebase discipline** — no dirty hacks, fail-loud over silent degradation, fix-at-the-right-level, upstream-mergeable changes.

*The base boilerplate can migrate a site. This fork migrates it on a foundation, proves what it builds, prevents what breaks launches, and gets better every time it's used.*
