---
name: bootstrap-project
description: Day-one initialization of a fresh EDS-migration boilerplate — scaffold the PROJECT-*.md stubs, verify the local toolchain, and hand off to migration-orientation. Fire when PROJECT-STATUS.md or PROJECT-PLAN.md do not exist. Do NOT fire once stubs already exist.
---

A fresh boilerplate has no `PROJECT-*.md` files — `session-startup` crashes and `detect.mjs`/`project-state.mjs` return no-ops. Scaffold the structure first; never invent content.

## Detect state
`ls PROJECT*.md` — three cases:
- **None exist** → full scaffold (all steps below).
- **Some missing** → create only the missing files; never overwrite an existing file that has real content.
- **All exist** → this skill should not have fired; hand to `migration-orientation`.

## Create stubs (tool-critical order)
| # | File | Required minimum |
|---|------|-----------------|
| 1 | `PROJECT-DESIGN.md` | `## Migration Strategy` (empty) · `## Design Tokens` containing an empty `:root {}` · `## Typography` · `## Color` · `## Spacing` · `## Breakpoints` · `## Block Inventory` |
| 2 | `PROJECT-STATUS.md` | `## Current Focus` (one-line placeholder) · `## Pages` table with EXACTLY this header + divider (5 columns — the parser is positional; this exact shape is required), no data rows: |
| 3 | `PROJECT-PLAN.md` | Task table + one `🔲 Open` seed task: "Run migration-orientation" |
| 4 | `PROJECT.md` | `## Project Identity` with blank agent-fill fields for: site URL, target EDS repo, authoring model, team contacts |
| 5 | `PROJECT-CONTEXT.md` | Topical headings `## Environment` · `## Constraints` · `## Brand` · `## Stakeholders` · `## Decisions`, each with the standard `*[Agent: record … here as it surfaces.]*` placeholder. Curated continuously per `curating-project-knowledge`. |
| 6–8 | `PROJECT-BLOCKS.md`, `PROJECT-IMPORT.md`, `PROJECT-TEMPLATES.md` | Empty section headings per AGENTS.md § Project Files |

`PROJECT-STATUS.md` `## Pages` header + divider — exact shape, no data rows:

```
| Page | URL | Content ✓ | Style ✓ | Notes |
|---|---|---|---|---|
```

## Do not run before stubs exist
Never call `detect.mjs`, `project-state.mjs`, or start `migration-orientation` until all stubs are created.

## Leave unknowns empty
Never invent: site URL, EDS repo, authoring model, brand colors/tokens. Write `*[Agent: fill after …]*` under each heading. A fake token in `:root` poisons `detect.mjs`'s allow-list.

## Verify toolchain (read-only checks)
- `npm ci` succeeds
- `aem up` serves `localhost:3000`
- `npx stylelint` runs without config errors
- `node tools/quality/detect.mjs --all` exits cleanly against the empty `:root`
- `node tools/quality/project-state.mjs` emits valid JSON, zero pages, no crash

*Node version management (`nvm`) is the user's responsibility — the harness has a fixed Node version.*

## Seed plan + status
- `PROJECT-STATUS.md` Current Focus: "Project initialized; migration-orientation pending."
- `PROJECT-PLAN.md`: the single seed `🔲 Open` task pointing at orientation.

## Pitfalls
- Inventing tokens or URLs in stubs → poisons `detect.mjs`'s allow-list and misleads orientation. Leave blank.
- Wrong `## Pages` heading (e.g. `## Pages table`) → `project-state.mjs` reads zero pages silently.
- Overwriting a hand-edited `PROJECT-*.md` on a partially-initialized project → create only what's missing.
- Running `git init` or committing — prohibited (AGENTS.md no-git rule); the fork is already a repo.
- Skipping the empty `:root {}` in `PROJECT-DESIGN.md` → `detect.mjs` has nothing to load (may crash).

See also: `migration-orientation` (fills strategy after this runs), `session-startup` (load this first on a fresh project — the precondition gate there ensures ordering), `quality-tooling` (the two tools this skill unblocks), `global-style-foundation` (fills tokens after orientation)
