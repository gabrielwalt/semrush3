---
name: validation-gates
description: The two explicit validation gates every page passes through — GATE 1 (content structure sign-off) and GATE 2 (visual/style sign-off) — what each requires, who marks it, and how to record it in PROJECT-STATUS.md. Use when a page reaches content or style completion, when deciding whether a page is "done", or when a regression forces an unfreeze. Both gates are user-confirmed; the agent never self-certifies.
---

A page is "done" only when the **user** confirms it — twice. The agent proposes; the user validates; the agent records. Never mark a gate passed on your own judgment.

## The two gates
| Gate | What passes it | Recorded as |
|------|----------------|-------------|
| **GATE 1 — content** | The content **structure** is user-approved: block names, the default-content/block/section split, and section boundaries match what the author should edit. Look-agnostic — purely "is this modeled right?" | `contentValidated` → ✅ in **column 3** (Content ✓) of the `## Pages` table |
| **GATE 2 — visual** | The page's **look** is user-approved against the source: the user explicitly confirms each block matches the original site at the page's fidelity level. | `styleValidated` → ✅ in **column 4** (Style ✓) of the `## Pages` table |

GATE 1 precedes GATE 2 — never run a style pass on content the user hasn't signed off (you'd polish a structure that may change). `block-visual-iteration` only fires after GATE 1.

## Mechanical pre-checks (run BEFORE asking for sign-off)
The user confirms *judgment*; a script confirms the *mechanics* first (Executable-Rule Rule). Don't ask for sign-off on output a checker would reject.
- **GATE 1:** after a re-import, `node tools/quality/content-fidelity.mjs <reference> <candidate>` → exit 0, or fix the parser for each `LOST`/`EXTRA` unit it names (`importer-diff-workflow`). Catches dropped/duplicated content (the A/B's missing content + Compare-Plans duplication) before you ask the user to validate the structure.
- **GATE 2:** `node tools/quality/detect.mjs <changed files>` (craft-floor) **and** `node tools/quality/css-no-producer.mjs <block>` — the latter flags block CSS class selectors **nothing produces** (a dead `<block>-*` selector → unstyled output, the footer-CSS saga). An ERROR there means the block renders unstyled even if the DOM looks right — fix before screenshotting. Also fires automatically as a PostToolUse hook on block-CSS edits.
- A green checker is necessary, not sufficient — the user still validates the look. A red checker blocks the ask.

## GATE 2 — the layered visual diff (three signals; (1)+(2) required)
**The over-claim trap:** the native `excat-visual-critique` extracts values from the **static `.plain.html`** and computes a similarity % — it **never renders pixels**, so overflow, clipping, overlap, and misalignment pass at ≥90%. *Never present a page as styled on the extraction % alone.* Layer three signals:
1. **Render the real decorated output + screenshot it** (the biggest fix). On `localhost:3000`, **gate on readiness before capturing** — `window.hlx === true`, `body.classList.contains('appear')`, the block's `[data-block-status="loaded"]` — then screenshot. Compare the screenshot of the **actual render**, not the static file.
2. **Vision critique (blocking).** View the source crop vs the migrated screenshot, per block/section/story, and **enumerate the top layout/overflow/alignment/clipping defects** — a defect list, not a single %. This is the eye extraction structurally lacks. **Prep the live source before capturing it** (dismiss consent overlays, scroll to hydrate lazy content, de-sticky — `measure-then-implement`) or the diff compares a banner-covered, half-loaded page.
3. **Deterministic extraction = ONE structural signal.** `excat-visual-critique` + the `block-visual-iteration` measure-diff are strong on token/spacing/typography/content/structure deltas the eye misses — keep them, **demoted from "the gate" to one of three.**
- *(Optional)* perceptual pixel-diff **only** for frozen-page regression (same-page baseline) — never source-vs-migrated (the DOM legitimately differs → false positives).
- **Diff against the styleguide** (`styleguide-generator`) when it exists — compare the block's stories so the verdict covers every meaningful combination, not one page instance.
- **Fidelity-aware verdict** (read the mode from `PROJECT-DESIGN.md`, set at `migration-orientation` #8): **Faithful** → flag every real mismatch against the source. **Refined / Reimagined** → classify each delta as *intended refinement* / *acceptable simplification* / *unintended miss*, and push to close only the last — don't chase a similarity % or report intended deviations as failures.
- **Latency (cost accepted, quality first):** capture all source+migrated screenshots in **one sequential sweep** (the Playwright MCP shares one browser), then **fan the vision critique out across parallel sub-agents** (reasoning isn't browser-bound).
- No completion claim passes GATE 2 without (1) the rendered screenshot **and** (2) the vision defect list (`verify-before-claiming`).

## Who marks it (the protocol)
1. Agent finishes the work and **asks for validation explicitly** — content: "validate the structure (split + block names)"; style: "are you satisfied with how it looks vs the original?" (per AGENTS.md concluding-answer rule).
2. **User confirms verbally.** That confirmation is the gate event — not the agent's own "looks right".
3. **Agent updates `PROJECT-STATUS.md`**: set ✅ in the matching column for that page's row; note the date/lock in Notes. `tools/quality/project-state.mjs` reads these flags as ground truth.

## What GATE 2 triggers — the freeze
The moment a page is style-validated, **`frozen = styleValidated AND not 🔓`** (`project-state.mjs`). Every block/variant/section-style it uses is now frozen — **The Frozen-Tools Rule**: style later pages **additively** so a shared tool never shifts under a validated page (`styling-additively`, `regression-guard`).

## Regression / reopening a gate
- A frozen page that must change is reopened by the **user**, not the agent. Mark its Style column `✅ 🔓` (design-open) — `project-state.mjs` then excludes it from `frozen`, suspending the Frozen-Tools Rule for it.
- When reopening, the shared-block ripple still applies: a change to a shared tool affects every page using it — verify those too. Load `unfreeze-page` for the full reopen protocol.
- A regression discovered on a *still-frozen* page is a red flag: a shared tool moved under it. Don't "fix" the frozen page — revert the change that shifted the shared tool (`regression-guard`).

## Pitfalls
- Agent self-certifying a gate ("this looks validated") — only a user confirmation passes a gate.
- Running GATE 2 before GATE 1 — styling a structure the user may still re-split.
- Editing a frozen page's CSS to fix a new page — that's the Frozen-Tools violation; style additively instead.
- Forgetting to set the ✅ after the user confirms — `project-state.mjs` then reports the page as unvalidated and routes wrongly.
- Unfreezing by editing the agent's own judgment — the 🔓 marker is a user decision recorded by the agent.

See also: `eds-migration-process` (the per-page workflow these gates bracket), `styling-additively` (the additive discipline GATE 2 enforces), `regression-guard` (catches a shared tool shifting under a frozen page), `quality-tooling` (`project-state.mjs` reads these flags), `unfreeze-page` (the reopen protocol when a frozen page must change)
