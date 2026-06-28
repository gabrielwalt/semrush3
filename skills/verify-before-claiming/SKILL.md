---
name: verify-before-claiming
description: Protocol for verifying work before reporting it complete. Load ALWAYS before saying "done", "fixed", "implemented", or any similar completion claim.
---

Never declare work complete from having written the code — verify the outcome. This is the close of **The Bookend-Verification Rule** (AGENTS.md); it has two bookends.

## Open: state checkable success criteria
Restate the request as **concrete, verifiable criteria** before touching anything (assert-then-confirm if ambiguous). Vague "fix the hero spacing" → checkable "hero top padding 120px desktop / 60px mobile; siblings unchanged." These criteria ARE the close checklist (step 7).

Before theorizing about a symptom, reproduce it on the user's exact route and seek the disconfirming fact first (`debug-block-decoration`).

## After any change — the close sequence
1. Re-read the edited file — change is exactly as intended.
2. `npm run lint` → zero errors.
3. After CSS: `node tools/quality/detect.mjs <files>` → exit 0 or every finding triaged; `project-state.mjs` → none of your files are `frozen` (else a regression unless authorized). Don't eyeball what a script checks (`quality-tooling`).
4. Load `localhost:3000` and **screenshot** — see the Screenshot-Is-Proof Rule.
5. Compare vs original (Gap) or confirm requested state (Enhancement); `executing-plan-tasks` if from a plan.
6. Confirm untouched siblings/parents didn't move (`regression-guard`).
7. Tick off each opening criterion against observed reality.
8. Only THEN write "done".

## The Screenshot-Is-Proof Rule (anything visual)
A screenshot of the rendered page is the proof; **DOM properties are supporting evidence, never proof.** "Done" is verified on local dev (`localhost:3000`) — real `aem.js` decoration makes it faithful; publish-correctness comes from the AGENTS.md NEVER list, not re-verifying on published.
- **Never claim "verified ✓" for visual work from `childElementCount` / `display` / `gridTemplateColumns` / `visibility` alone** — they pass while visibly broken (a `visibility:hidden` wrapper reports `display:block`; a 4-track grid with one collapsed item paints as one column). `grid-template-columns ×4` ≠ 4 columns rendered — count items in the screenshot.
- **Trust the user's "I can't see it"** over a green DOM readout — your probe is pointed wrong; screenshot and look.
- A GATE-2 visual claim needs the **screenshot + a vision defect list**, not the `excat-visual-critique` % alone (it's blind to overflow/overlap — `validation-gates`). Screenshots under `/tmp/` only.

## End-to-end
- Test **every** affected element, not one instance ("fix all videos" → verify all).
- Test the user's exact scenario (plays-on-scroll → scroll + confirm `currentTime > 0`, not `readyState`).
- Durability: a file fix → tracked by git (not gitignored); a URL fix → resolves from the user's env.
- Re-verify A after fixing B — don't reuse stale verification. Tag unconfirmed observations `[assumed]` vs `[verified]`.

## Cleanup before "done"
- Review the full diff — remove leftover files, dead code, failed attempts.
- A workaround (URL rewrite, fallback, error detection) → should it be a content fix? (`eds-code-conventions`); flag smells to `PROJECT-PLAN.md`.
- A re-import reproduced the reference? Run `content-fidelity.mjs <ref> <candidate>` (exit 0) — don't eyeball the diff (`quality-tooling`).

## Pitfalls
- "It should work" / lint-passing — necessary, not sufficient; visual proof required.
- Measuring your implementation instead of the original (`measure-then-implement`).
