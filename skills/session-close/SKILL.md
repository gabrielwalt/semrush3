---
name: session-close
description: What to do at the end of a session before handing off. Load when the session is ending or a task is fully complete.
---

At the end of every session (or when the user signals they're done):

## Close sequence
1. **Mark completed tasks** — in `PROJECT-PLAN.md`, change `🔲 Open` → `✅ Done` for every task completed this session
2. **Update `PROJECT-STATUS.md`** — update the progress table and "Current Focus" section
3. **Capture skills** — for every non-obvious problem solved this session, create or update a skill
4. **Note current focus** — add a brief note to `PROJECT-STATUS.md` so the next session knows where to resume

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

See also: `curating-project-knowledge` (run the capture+curate pass at close — route any durable learning to its home, consolidate, reflect, surface consequences)
