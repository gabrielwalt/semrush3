---
name: writing-skills
description: Guide for creating and maintaining Claude Code skills. Use when creating a new skill, improving existing ones, or auditing the skill library.
disable-model-invocation: true
---

A skill answers: "What do I wish I'd known 30 minutes ago?"

## Non-negotiable rules

1. **Project-specific skills MUST be prefixed with `project-`** in both the directory name and the `name` frontmatter field. "Would this help on a completely different brand migration?" — if no, it gets the prefix. No exceptions.
2. **Skills are recipes, not state descriptions.** A skill teaches how to do something — a sequence of steps, a pattern to apply, a problem to solve. If it merely describes how something currently looks or works (layout dimensions, current color values, component behavior), it belongs in `PROJECT-BLOCKS.md` or another `PROJECT-*.md` file, not a skill. Ask: "Does this tell me *how to build or fix* something, or *what currently exists*?" — only the former is a skill.
3. **The skill index in `README.md` MUST be updated with every skill change** — creation, rename, deletion, or key insight change. A skill not listed there may as well not exist.
4. **Generic skills MUST NOT hardcode project-specific values** — no pixel breakpoints, no token values, no brand font names, no specific file names. Reference `PROJECT-DESIGN.md` for breakpoints/tokens, `PROJECT-IMPORT.md` for import file names, or use generic placeholders.
5. **Never modify the Rules section of AGENTS.md when adding skills** — skills extend the rules, they don't override them. The Rules section is the core contract.

The skill lifecycle is simple: a skill is either `project-` (carries project specifics) or generic — there is no draft tier. Improve weak skills in place.

## Creating a new skill

1. Create `skills/{problem-domain}/SKILL.md` at the project root
2. **Scope**: "Would this help on a different brand migration?" If no → prefix with `project-`
3. Add YAML frontmatter — see format below
4. Write the body: key insight first, then recipe, then pitfalls
5. Keep under 500 lines. Aim for ~20-30 lines for reference skills
6. **Add a row to `skills/README.md`** in the correct functional section
7. Verify the `name` field matches the directory name exactly

When capturing a procedural learning into a skill, follow `curating-project-knowledge`'s route-then-write loop — don't append a new skill if an existing one should absorb it.

## Context budget

Every loaded skill costs context tokens. Manage the budget:

- **"Always load" in `README.md` must stay at 3 skills or fewer** — only skills that apply to literally every action in every session. Currently: `session-startup`, `session-close`, `verify-before-claiming`. To add a 4th, you must merge or demote an existing one.
- **Always-load skills must be under 1.5KB each.** If a skill grows larger, extract the detailed content into a separate skill and reference it via `See also:`.
- **Prefer trigger-based loading over always-load.** A skill with a clear "Load when..." trigger (e.g., "about to edit shared CSS") will be loaded exactly when needed. An always-load skill sits in context even when irrelevant.
- **Use `See also:` to create loading chains.** If skill A is always loaded and often precedes work that needs skill B, add `See also: \`B\` (why)` to A. The agent will load B when it reaches that point — no need to always-load B.
- **Review after adding skills.** If `README.md` "Always load" grows past 3, or the total skill library grows past ~40, audit for merges and demotions.

## Keeping skills modular and connected

- **One domain per skill.** If a skill covers two distinct topics, keep it focused on the primary one and cross-reference the other.
- **Cross-reference, don't duplicate.** If content exists in another skill, point to it with a `See also:` line at the bottom rather than repeating it. One skill owns each concept.
- **Add `See also:` to every skill** that has natural neighbors — related patterns, prerequisites, or next-step workflows. Format: `See also: \`skill-name\` (why), \`other-skill\` (why)`
- **Add cross-references at the point of highest need.** When creating a skill, also add a `See also:` line pointing TO this new skill from the skills that are most likely to already be loaded when the new skill is needed. The goal: the agent encounters the reference at the moment it's most useful, not only if it happens to scan the README.
- **Keep skills compact.** Aim for 20-30 lines. If a skill grows past ~40 lines, look for content that belongs in a referenced skill instead.
- **Friction-based triggers.** If you encounter the same problem or workaround twice, it's a skill gap. Propose a skill before moving on.

## SKILL.md format

```yaml
---
name: my-skill
description: What this does. When to use it. Key trigger phrases.
---
[Key insight — the one sentence that unblocks]

## Recipe
[Code, commands, tables. Zero prose.]

## Pitfalls
- [What fails → why. One line each.]
```

## Frontmatter fields

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Must match directory name. Lowercase, hyphens, max 64 chars |
| `description` | Yes | Claude uses this for auto-matching. Put key use case FIRST — truncated at 1,536 chars |
| `when_to_use` | No | Extra trigger phrases, appended to description |
| `disable-model-invocation` | No | Set `true` for user-only skills (side effects, workflows) |
| `allowed-tools` | No | Tools Claude can use without permission prompts when active |
| `context` | No | Set `fork` to run in isolated subagent context |
| `paths` | No | Glob patterns — skill only auto-loads for matching files |

## How skills load

- **Session start**: skill names and descriptions load (small context cost). Skill index in AGENTS.md also loads via `@AGENTS.md` in CLAUDE.md.
- **On invocation**: full SKILL.md body loads and stays in context
- **After compaction**: most recently invoked skills re-attached (5,000 tokens each, 25,000 total)
- **Symlink**: `.claude/skills → ../skills` enables native discovery. If missing: `mkdir -p .claude && ln -sf ../skills .claude/skills`

## Quality bar

- **Prescriptive**: "Do X" not "X happened"
- **Concrete**: actual selectors, actual values, actual commands
- **Scannable**: tables and code blocks beat paragraphs
- **No history, no justification**: just what works now

## Make skills operational

These seven habits separate a skill the agent *follows reliably* from one it skims and ignores. Distilled from studying skill libraries that drive agents well (e.g. impeccable.style). Apply them on top of the Quality bar above.

| Habit | What it means | Test |
|-------|---------------|------|
| **1. Gate the work, don't just describe it** | If a skill must happen before something else, open with a short ordered precondition: *"Before X, you MUST: (1)… (2)…"*. A gate is an instruction the agent executes, not background it absorbs. | Does the skill tell the agent what to do *first*, or only what's true? |
| **2. Name and number your rules** | Give a load-bearing rule a citable handle: `**The Reuse-First Rule.** Reproduce the look with existing blocks before adding any new one.` Named rules are stickier and quotable in later reasoning than an anonymous bullet. | Could the agent cite this rule by name in a later turn? |
| **3. Every rule carries a threshold or a precise trigger** | Replace "consider", "prefer", "might" with a number or an exact condition. `tracking ≥ -0.04em`, `body text ≥ 4.5:1`, "fires when a lower-specificity selector follows a higher one on the same element". A rule with no threshold can't be obeyed or checked. | Could two people disagree on whether the rule was followed? If yes, add the number/condition. |
| **4. List anti-patterns as match-and-refuse** | Name what the failure *looks like* and the rewrite: *"If you're about to write `border-left > 1px` as a colored accent — stop, use a full border or background tint instead."* Anti-references are first-class content, not an afterthought. | Does the skill say what NOT to do, concretely enough to recognize it mid-edit? |
| **5. Interview = assert-then-confirm** | For any step that asks the user: 2–3 questions per round, then wait. Never synthesize a whole doc from a one-line prompt for blanket sign-off. When one answer is obvious, name it and ask to confirm — *"This reads as Faithful, confirm?"* beats a four-option menu. | Is the agent proposing a default to confirm, or dumping a menu / guessing silently? |
| **6. Resolve ambiguity with first-match-wins** | When a choice has competing signals, give an *ordered* tie-breaker: *"Pick by first match: (1) explicit user instruction; (2) per-page override; (3) site default."* Ordered beats "it depends". | If two signals conflict, does the skill say which wins? |
| **7. Forceful voice for load-bearing rules** | "Never", "always", "MUST", "prohibited" for the rules that protect frozen work or prevent regressions. Reserve softer phrasing for genuine judgment calls. Forcefulness signals which rules are non-negotiable. | Does the strength of the verb match the cost of getting it wrong? |

Don't force all seven into every skill — a 20-line CSS-pitfall skill needs #2/#3/#4, not an interview cadence. Reach for the ones that fit the skill's job.

## Make rules executable, not just readable (The Executable-Rule Rule)

**A rule the agent must *remember* to apply is weaker than a rule a script *enforces*.** Distilled from studying impeccable.style: their power isn't better rules than ours — it's that their rules are **executable** (a deterministic detector flags violations and feeds them back) and their project context is **structured** (machine-readable signals + committed token files), so the agent operates on *facts*, not *memory*. Prose-only skills decay into "the agent should have remembered." Apply this when authoring or upgrading any skill whose rules are mechanically checkable:

| Habit | What it means |
|-------|---------------|
| **Give every checkable rule a stable ID** | A rule with a threshold (`tracking ≥ -0.04em`, `body ≥ 4.5:1`) gets a citable ID like `<!-- rule:craft-typo-tracking-floor -->`. The ID is the contract between the prose rule and any script/test that enforces it. Same idea as a Named Rule, but machine-addressable. |
| **Ask "could a script check this?"** | If yes, the skill should *point at* the script (`run \`node tools/quality/detect.mjs <files>\``), not just describe the rule. The script is the source of truth for the *check*; the skill explains the *why* and the *fix*. Don't duplicate the threshold in both — the script owns the number. |
| **Prefer structured signals over prose state** | When a skill needs to know project state (what's frozen, which gate a page is at, what changed), read it from a machine-readable probe, not by parsing a prose status doc. Prose drifts; a script reads ground truth (git, the filesystem, the tokens). |
| **Bind rules to the committed design tokens** | Project-specific values (palette, scale, spacing) live in `PROJECT-DESIGN.md` / token files and are loaded by the checker as lint input — never hardcoded into a generic skill (rule #4 above). The tokens are the allow-list. |

**The division of labor:** scripts handle *deterministic mechanics* (grep for off-palette colors, diff the git tree, parse frontmatter, probe a port); the agent handles *judgment* (is this delta intentional? does this serve the brand?). A skill that asks the agent to do a script's job (eyeball every `#fff`, remember every threshold) is a skill that will be skipped under load.

When a generic skill's rules become executable this way, note the enforcing command in the skill body and add the tool to `quality-tooling` (the skill that documents our deterministic checkers). A rule with an ID but no enforcer is fine — the ID marks it *ready* to be enforced later.

## Capturing anti-patterns from user corrections

This is the recipe behind **The Anti-Pattern-Capture Rule** (AGENTS.md). When the user corrects something you built:

1. **Qualify it.** Capture only when the wrongness is *self-evident in hindsight* — a thing no one would defend once seen ("don't edit a frozen block's CSS to fix a new page", "don't animate the image on card hover"). **Do NOT capture taste/judgment calls** ("I'd prefer more spacing here", "use blue not green") — those are preferences, not anti-patterns. Litmus test: would any competent migrator agree this was a mistake, not just a different choice? If no, skip it.
2. **Write it match-and-refuse** (habit #4): name what the bad version *looks like* so you can recognize it mid-edit, then the rewrite. *"If you're about to write `<the bad pattern>` — stop, do `<the fix>` instead."*
3. **Put it where it'll fire.** Add it to the Pitfalls (or a `## Anti-patterns` section) of the skill that owns that domain — not a generic dumping ground. If no skill owns it, that's a skill gap; create one.
4. **Name it if it's load-bearing.** A recurring, costly anti-pattern earns a citable handle and a row in AGENTS.md Named Rules.

## Improving an existing skill

| Signal | Action |
|--------|--------|
| Used it but still got stuck | Add to Recipe or Pitfalls |
| Contains stale info | Update to current implementation |
| Two skills answer same question | Merge, delete one, update AGENTS.md index |
| Claude doesn't auto-invoke it | Improve `description` with better trigger keywords |
| Claude invokes it too often | Make `description` more specific, or add `disable-model-invocation: true` |
