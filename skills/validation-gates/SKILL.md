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
