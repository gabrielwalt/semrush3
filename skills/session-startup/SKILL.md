---
name: session-startup
description: What to do at the start of every new session. Load at session start before responding to any request.
---

## Identity gate — first, every session
Establish who you're working with, but **assume the site owner** — don't interrogate role.
1. Read `users/.current-user` (gitignored, workspace-local). If present → that login is active; load `users/<login>/` and **proceed silently** (returning user → ask nothing).
2. **If absent — ask ONLY the GitHub username** ("What's your GitHub username? I can't read it from the environment."); write it to `users/.current-user`. Then branch:
   - **First user** (no other `users/<login>/` dirs exist) → assume **SITE OWNER**. Scaffold `users/<login>/` with `ROLE.md` (`Lead: yes`), empty `context.md`, `plan.md`. **Don't ask role** — infer focus/scope from the opening prompt and record it.
   - **New, different user** (login unseen AND other `users/<login>/` dirs exist) → **multi-user**: **warn** that another user (name them) is already on this project, then clarify **scope** (limited vs full) — inferred from their first prompt where possible, asked only if unclear. Default the newcomer to `Lead: no`.
3. Ask about role/lead only on a concrete reason (a freeze/ownership conflict, or the user volunteers it).
4. Until identity is known, don't capture to user files — ask first.

## Precondition gate — uninitialized project
If `PROJECT-STATUS.md` or `PROJECT-PLAN.md` is missing, the project is uninitialized → load `bootstrap-project` instead of the sequence below.

## Startup sequence
1. `PROJECT-STATUS.md` — done / in-progress / blockers; its "Current Focus" note is authoritative for resuming (don't use git log).
2. `PROJECT-CONTEXT.md` — accumulated wiki knowledge (skip if absent).
3. `node tools/quality/project-state.mjs` (`quality-tooling`) — ground-truth frozen / changed / content state; prefer it over inferring from prose.
4. `PROJECT-PLAN.md` — the first `🔲 Open` task is your starting point.
5. Scan `skills/README.md`; load skills matching the session's tasks (and any the user's message names).

Don't: re-read files you just read; propose a plan when one already exists; ask what to work on when open tasks exist — start the first.

## Pitfalls
- Starting without reading `PROJECT-PLAN.md` — you'll duplicate or skip tasks.
- Reading `AGENTS.md` but not `PROJECT-STATUS.md` — it doesn't tell you what's broken now.

See also: `executing-plan-tasks` (pick up and execute the first open task), `writing-plan-tasks` (create tasks from requests), `bootstrap-project` (uninitialized project).
