---
name: executing-plan-tasks
description: How to execute tasks from PROJECT-PLAN.md. Load when picking up a plan task to implement. Covers understanding the task, confirming the problem, implementing, and verifying — differently for Gap vs Enhancement tasks.
---

Before writing a single line of code, you must understand the task well enough to verify both the problem and the solution. If you can't verify the problem exists, you can't verify you fixed it.

## Step 1 — Read the task and classify it

Check the **Type** label (`Gap` or `Enhancement`); if absent, infer it. See `writing-plan-tasks` for the full Gap-vs-Enhancement definition and how to verify each.

- **Gap** = differs from the original site → verify by comparing both sites.
- **Enhancement** = new behavior not on the original → verify on localhost only.

## Step 2 — Confirm the problem exists (BEFORE coding)

- **Gap:** inspect the element on the original AND localhost. Confirm the delta is real and matches the task. If already fixed → mark `✅ Done`. If you still can't see the gap after careful inspection → **STOP, ask the user.** Never fix a problem you can't see.
- **Enhancement:** inspect localhost. Confirm the current state matches the task's "before". If it already matches the requested outcome → **STOP, ask the user.**

## Step 3 — Implement

1. Read all files listed in "Affected files" before touching anything.
2. Load relevant skills (check `skills/README.md` triggers).
3. Make the change. Keep it minimal — one task = one focused change.
4. Run `npm run lint` — fix any errors before proceeding.

## Step 4 — Verify the fix (AFTER coding)

Run the full verification protocol from `verify-before-claiming` before marking done. Task-specific checkpoints:

- **Gap tasks:** confirm the specific property now matches the original site; visually compare at the same viewport width.
- **Enhancement tasks:** confirm the element now has the requested state/value.
- **If the fix doesn't work: do NOT iterate blindly.** Re-read the task. Re-inspect. Try one more approach.
- **After 2 failed attempts: STOP.** Update the task with what you tried and why it failed. Ask the user.
- If no clean fix exists: document what you tried, suggest alternative approaches (content vs CSS vs JS level), ask the user.

## Step 5 — Mark done

Only after verification passes:
1. Mark the task `✅ Done` in `PROJECT-PLAN.md`.
2. Update `PROJECT-STATUS.md` if the task closes a known issue.
3. Move to the next `🔲 Open` task.

## Pitfalls
- Implementing without confirming the problem exists → you fix the wrong thing or break something that was fine.
- For Gap tasks: only checking localhost, not the original site → you have no reference for what "correct" looks like.
- For Enhancement tasks: checking the original site → irrelevant, wastes time, may confuse you.
- "It should work" is not verification. "I confirmed `margin-bottom` is now `12px`" is verification.
- Iterating 3+ times on the same fix → you're going in circles. Stop and ask.

See also: `writing-plan-tasks` (how tasks should be structured), `verify-before-claiming` (never say "done" without checking), `measure-then-implement` (measure values, don't guess), `regression-guard` (check for side-effects), `block-visual-iteration` (systematic visual comparison workflow)
