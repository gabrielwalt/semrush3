---
name: session-close
description: What to do at the end of a session before handing off. Load when the session is ending or a task is fully complete.
---

At the end of every session (or when the user signals they're done):

## Close sequence
1. **Mark completed tasks** — in `PROJECT-PLAN.md`, change `🔲 Open` → `✅ Done` for every task completed this session
2. **Update `PROJECT-STATUS.md`** — update the progress table and "Current Focus" section
3. **Capture skills** — for every non-obvious problem solved this session, create or update a skill
4. **Run the promotion check** — for any durable learning captured this session, apply the promotion test (`curating-project-knowledge`): a `PROJECT-CONTEXT.md` fact/procedure that would help **the next project from a different source** graduates into a generic skill
5. **Check the styleguide AND author library are in sync** — if the project maintains a styleguide and any block, variant, section style, or template was added or changed this session, confirm its styleguide page/story was added in the same breath (the Styleguide-Mirrors-Inventory Rule). A styleguide missing the newest tool gives false confidence. The styleguide is never frozen, so this is always a safe edit — fix the drift now, don't defer it. **For build-fresh projects, also confirm the author-facing library tracked it** — DA block library or UE component definition — when a *new block or variant* was added (the Styleguide-Twins-The-Library Rule; edge-case stories alone don't need a library change). → `styleguide-generator`
6. **Note current focus** — add a brief note to `PROJECT-STATUS.md` so the next session knows where to resume

## The skill capture test
Ask: "If the next agent starts fresh, what non-obvious thing would they have to re-discover?"
If the answer is anything actionable, write it as a skill.

## Current Focus update format
```
**Last updated:** YYYY-MM-DD
**Branch:** `branch-name`
**Active task:** {task-id} — {task name}
**Last completed:** {what was just finished}
**Next up:** {next task(s)}
**Blocker:** None (or describe blocker)
```

## Pitfalls
- Updating `PROJECT-STATUS.md` with "done" when the task hasn't been verified visually
- Forgetting to add new skills to `skills/README.md` — the skill exists but is never found
- Leaving `PROJECT-PLAN.md` with ambiguous task states — next session won't know where to start
- Closing a session that added a block/variant/style without adding its styleguide story — the styleguide silently drifts from `PROJECT-BLOCKS.md` and stops being a trustworthy reference

See also: `curating-project-knowledge` (run the capture+curate pass at close — route any durable learning to its home, consolidate, reflect, surface consequences), `styleguide-generator` (the styleguide sync check at step 5 — never-frozen, mirrors the block inventory)
