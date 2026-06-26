---
name: writing-plan-tasks
description: How to write verifiable plan tasks in PROJECT-PLAN.md. Load when creating or updating tasks from user-reported gaps or enhancement requests. Ensures the planning agent understands what's asked before writing the task.
---

A plan task that the implementing agent can't independently verify will cause fix → check → misunderstand → redo loops. The planning agent must **understand and confirm the request** before writing the task — and the task must be written so the implementing agent can verify the outcome.

## Step 0 — classify the task type

Every task is **Gap** or **Enhancement**. Label it `**Type:** Gap|Enhancement` right after the priority line.

| Type | Meaning | How to verify |
|------|---------|---------------|
| **Gap** | Current implementation differs from the original site | Compare original site vs. localhost — delta visible on both |
| **Enhancement** | New behavior diverging from the original site | Only the current implementation matters — original is irrelevant |

Infer from wording: "fix / missing / wrong / broken / doesn't match" → **Gap**. "add / change to / make it / I want" → **Enhancement**.

## Step 1 — Verify the premise yourself BEFORE writing the task

Do not transcribe the user's words — confirm the situation first.

- **Gap:** open the original site AND localhost at the same section. Identify the specific delta (element, CSS property, missing node, wrong value). If you **can't see the gap** → STOP, ask the user to point to the exact difference.
- **Enhancement:** open localhost. Confirm the thing to change exists in its current form. If the request is **ambiguous or already in the requested state** → STOP, ask the user to clarify.

## Step 2 — Describe it in concrete terms

- **Gap:** `What's wrong` (observable delta, actual vs expected) · `Evidence` (selector, computed values) · `Root cause` (missing rule / JS error / content gap) · `Fix approach`.
- **Enhancement:** `Current state` · `Requested change` (specific outcome) · `Implementation` (what/where/value).

## Step 3 — Write verifiable steps

Numbered steps the implementing agent MUST do. Each step names an element, property, and concrete value — never "confirm it looks right".

- **Gap:** inspect original → note value · confirm wrong value on localhost · fix in [file] · reload, confirm value now matches original · compare both sites for regressions · after 2 failed attempts, stop and ask.
- **Enhancement:** confirm current value on localhost · change in [file] · reload, confirm new value · check siblings for regressions · if intent unclear, stop and ask — don't iterate on assumptions.

---

## Handle uncertainty (both types)

| Situation | Action |
|-----------|--------|
| **Gap:** Can see gap but not root cause | Write task with "What's wrong" + "Evidence". Put "Root cause: TBD — implementing agent must investigate." |
| **Gap:** Cannot see the gap at all | **Do not write the task.** Ask the user to point to the difference. |
| **Enhancement:** Request is ambiguous | Ask: "I see [current state] — could you clarify what should change?" |
| **Enhancement:** Already in the requested state | Ask: "It appears [thing] is already [state] — am I looking at the right element?" |
| **Either:** No clean fix exists | Document what was attempted and why it failed. Suggest alternatives. Escalate to user. |

---

## Task template

```markdown
### HXX — 🔲 Open — [Short title]

**Priority:** P0/P1/P2
**Type:** Gap | Enhancement
**Affected files:** [exact file paths]

<!-- For Gap tasks: -->
**What's wrong:** [Delta — element, property, actual vs expected.]
**Evidence:** [How confirmed — selectors, computed values.]
**Root cause:** [Why — missing rule, wrong value, content gap.]
**Fix approach:** [What to change, where, what value.]

<!-- For Enhancement tasks: -->
**Current state:** [What exists now.]
**Requested change:** [What user wants.]
**Implementation:** [What to change, where, what value.]

**Verification (implementing agent MUST do all):**
[Numbered steps — see templates above per type.]

**Acceptance criteria:** [Single sentence, measurable.]
```

## Pitfalls
- Not labeling Gap vs. Enhancement → implementing agent inspects the wrong thing.
- Writing a Gap task without seeing the gap → wrong problem described, wrong fix applied.
- Writing an Enhancement task without checking current state → agent changes something that already matches.
- Verification steps that say "confirm it looks right" → say "confirm `margin-bottom` computes to `12px`".
- Huge tasks with 6+ sub-problems → split. Each task = one verifiable change.

See also: `executing-plan-tasks` (how the implementing agent should work), `verify-before-claiming` (verifying before saying "done"), `measure-then-implement` (measuring before guessing), `regression-guard` (checking for side-effects), `curating-project-knowledge` (the loop that routes a reflected consequence here as a task)
