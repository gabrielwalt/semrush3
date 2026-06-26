---
name: curating-project-knowledge
description: Turn a user's prompt into durable project knowledge — decide what to capture, where it goes, and capture it cleanly. Load whenever the user reveals a durable decision/constraint/fact/preference/correction or a reusable procedure, or before writing any learning into a project file. NOT for session-scoped directives.
---

The agent turns casual prompts into durable knowledge — guidelines, project context, reusable skills — by actively noticing, asking, and capturing (**The Puzzle-Piece Rule**, AGENTS.md). Capture itself is simple: skip what doesn't belong, route by one test, write it down.

## Active curation (the valuable part)
As you work, notice capture-worthy moments and engage the user:
- "This is a reusable procedure — capture it as a skill?"
- "You've said X twice — make it a project guideline?"
- "This contradicts what we recorded — which holds?"
- "I'm missing context on Y — can you clarify?"
Challenge gaps and contradictions; don't passively log.

## What NOT to capture (skip-list)
- **Derivable from code/git** (a selector, DOM structure, a past fix) → skip; re-discoverable.
- **Session-scoped** ("for now", "today", "this session", "just this") → keep in working context.
- **Already recorded** → update the existing entry in place; never append a duplicate.

## Where it goes (first match wins)
1. **Task / intention (to DO later)** → `users/<login>/plan.md` (checkbox item).
2. **Procedure (ordered steps / how-to)** → a **skill** in `skills/`: `project-` if it carries project specifics (paths, tokens, selectors, brand/site names), else generic.
3. **Fact a structured `PROJECT-*` file owns** (tokens→DESIGN, blocks→BLOCKS, import→IMPORT, templates→TEMPLATES) → put it there.
4. **Fact another collaborator would need (project-wide)** → `PROJECT-CONTEXT.md`.
5. **Else (personal / unproven)** → `users/<login>/context.md`.

## Capture cleanly
- **Write the fact in its home** — one dense declarative line, no timestamps, no "the user said". Moving = write in the new home, delete the old line. No ceremony.
- **Consolidate in place** when you touch a file: merge a near-duplicate, fix a contradiction (newer/confirmed wins).
- **Promotion is trivial**: personal → project = move the line to `PROJECT-CONTEXT.md` once it proves general.
- Run `tools/quality/km-check.mjs` to catch misplacement/bloat.

## Pitfalls
- Appending without reading the file → log, not curation.
- Persisting a session-scoped directive → apply the skip-list first.
- A procedure dumped in context, or a bare fact minted as a skill → route by the steps-test.
- Project literals in a generic skill → it's a `project-` skill.

See also: `writing-skills` (how to write the skill once you've decided it is one), `session-startup` (reads the folder + PROJECT-CONTEXT), `quality-tooling` (`km-check.mjs`).
