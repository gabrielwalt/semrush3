---
name: verify-before-claiming
description: Protocol for verifying work before reporting it complete. Load ALWAYS before saying "done", "fixed", "implemented", or any similar completion claim.
---

Never declare work complete based on having written the code. Verify the outcome directly. This is the close of **The Bookend-Verification Rule** (AGENTS.md) — and the rule has *two* bookends.

## Open the task: state checkable success criteria (must enforce)
Before touching anything, restate the request as **concrete, verifiable success criteria** — the exact conditions that will prove the task done. Then confirm you read the request correctly (assert-then-confirm if any ambiguity remains). You cannot verify completion against a goal you never made checkable.
- Vague: "fix the hero spacing." Checkable: "hero top padding = 120px desktop / 60px mobile, matching the original; sibling sections unchanged."
- Carry these criteria to the close — step 6 below verifies each one. The criteria you open with ARE the checklist you close against.

## Before theorizing about a symptom
- **Reproduce the user's exact symptom on the exact route they used.** A different observation on a different route/URL is not their bug — and a tool reporting "X is broken" may just mean your probe was pointed wrong (sanity-check it loaded the runtime / the file exists where you looked).
- **Go find the disconfirming fact yourself.** "Other blocks work fine" kills a "decoration is broken" theory — don't wait to be corrected.
- **Envs differ but code+content are byte-identical → stale cache, not a code bug.** Force-reload the specific resource first.

## After any code change
1. Re-read the file you edited — confirm the change is exactly as intended.
2. Run `npm run lint` — zero errors.
3. **After CSS/style changes, run the deterministic checker** (`quality-tooling`): `node tools/quality/detect.mjs <changed files>` → exit 0, or every finding triaged (real fix vs allow-list gap). Don't eyeball craft rules a script can check (**The Executable-Rule Rule**). Then `node tools/quality/project-state.mjs` and confirm none of your changed files are in `frozen` — a frozen file you touched is a regression unless the change was explicitly authorized.
4. Load the page at `localhost:3000` — confirm the component renders correctly.
5. Compare against original site (for Gap tasks) or confirm requested state (for Enhancement tasks). Load `executing-plan-tasks` if working from a plan.
6. After CSS changes: check that untouched sibling/parent values didn't change. If they did, you introduced a regression — load `regression-guard`.
7. **Re-check each success criterion you opened the task with.** Tick them off one by one against observed reality. An unticked criterion means the task is not done.
8. Only THEN write "done".

## Verification must be end-to-end
- **Test EVERY affected element**, not just one instance. If the task says "fix all videos", verify ALL videos — not just the first one.
- **Test the user's exact scenario.** If a video should play on scroll, actually scroll to it and confirm `currentTime > 0`. Don't accept `readyState: 4` as proof of playback.
- **Test durability.** If a fix relies on a file, confirm the file is tracked by git (not gitignored). If a fix relies on a URL, confirm it resolves from the user's environment, not just yours.
- **Test after every change.** If you fix element A, then separately fix element B, re-verify A still works after B's change. Don't reuse earlier verification results.

## Cleanup before claiming done
- **Review the full diff** (`git diff`) before marking done. Remove leftover files, dead code, temporary variables, and failed attempts.
- **Check for hacks.** If you added a workaround (URL rewrite, fallback path, error detection), ask: should this be a content fix instead? Load `eds-code-conventions` for the clean-code rules.
- **Flag code smells.** If you see unclear code while working, add a cleanup task to `PROJECT-PLAN.md` — don't ignore it.

## Pitfalls
- "It should work" is a guess, not verification.
- Lint passing is necessary but not sufficient — visual verification is required.
- Measuring your implementation instead of the original — load `measure-then-implement` when matching values.
- Verifying one instance of a repeated element and assuming all are fixed.
- A prior verification becoming stale after subsequent code changes.
- A fix that works locally but relies on non-tracked assets (gitignored files, local-only state).
