---
name: global-style-foundation
description: The capture-the-essence pass that builds the site's global design foundation (the workbench) BEFORE any block is styled. Analyzes several representative source pages, extracts the visual gist common to all of them, and formalizes it into brand tokens, type scale, spacing system, and default-content styling. Use right after migration-orientation and before per-block styling, or whenever the global foundation is missing/weak. NOT for styling an individual block (that's block-visual-iteration / styling-additively). Extends EXCAT `excat-complete-design-expert`.
---

Before forging any tool, level the workbench. This is **The Workbench-Before-Tools Rule** (AGENTS.md): the global foundation — brand tokens, type scale, spacing system, and the look of default content — is what every block later sits on. Build it once, from the *whole site's* visual gist, not from one page.

## When to run
- Right after `migration-orientation`, before the first page's per-block styling.
- When a project has imported content but has no solid global baseline yet.
- Skip on later pages that reuse an already-built foundation — the workbench is built **once per site**, then extended only if a genuinely new global need appears.

## Capture the gist across pages, not one page
A single page's styling is a tool; the *foundation* is what's common to **all** pages. Sample **at least 3 representative source pages** (homepage + two structurally different ones). For each, measure — never eyeball (`measure-then-implement`):

| Dimension | What to extract |
|-----------|-----------------|
| **Color** | Background(s), ink/text, the 1–2 brand accents, any dark-surface inversion. Note which colors are *system* (recur everywhere) vs *one-off* (one page). Only system colors become tokens. |
| **Type** | Heading font + body font; the size **scale** (display → h1…h4 → body-l → body-m) and the *ratio* between steps; weights; letter-spacing at display vs body; line-heights. |
| **Spacing** | Section padding (desktop/mobile), the block-to-block rhythm, container max-width, page edge padding. This becomes the vertical-spacing system. |
| **Default content** | How a bare title, paragraph, link, list, and CTA look with no block — the auto-styles authors rely on (`eds-content-patterns`). |
| **Buttons** | Shape, height, padding, primary/secondary/accent variants, hover. |

The test that you've found the *foundation* and not a page quirk: **a value earns a token only if it recurs across the sampled pages.** A value seen on one page is a candidate one-off, not foundation.

**Build each dimension with its deep-craft skill.** This skill is the *orchestration* (measure → which values are foundation → record). The *positive method* for rebuilding each dimension well lives in a dedicated skill — load the matching one when you build that dimension:
- **Type** → `typography-craft` (scale ratio, weight roles, measure, light-on-dark, font-loading-without-shift)
- **Color** → `color-craft` (role structure, 60-30-10, tinted neutrals, OKLCH ramps, dark mode)
- **Spacing/Layout** → `layout-craft` (hierarchy, rhythm, tool choice) + `vertical-spacing-system` (EDS mechanics)
- **Cross-device** → `responsive-adaptation` (input-method queries, breakpoints, overflow guards)

Then **clear the floor**: run `craft-floor` (+ its `tools/quality/detect.mjs` checker) over the result. Foundation = build it well (craft skills) AND clear the bar (craft-floor).

## Apply fidelity — how much to uplevel
Read the **site-default fidelity** from `PROJECT-DESIGN.md` (**first-match-wins**: per-page override → site default → Faithful). It governs how much license you have while building the foundation. **Guard:** if no fidelity is recorded in `PROJECT-DESIGN.md` at all, do NOT silently default to Faithful — stop and ask `migration-orientation` to establish it first. The Faithful fallback applies only once orientation has run and explicitly chose to leave it Faithful.

- **Faithful** — reproduce the measured system as-is. Tokens mirror the source values. Fix only outright defects (a contrast failure, a broken scale step).
- **Refined** — keep the brand's identity (its colors, its type voice, its spatial feel) but **regularize** it: snap an uneven type scale to a clean ratio, unify near-duplicate spacings into one system, raise body contrast to ≥4.5:1, give links/buttons consistent states. The source is a strong reference; the foundation is the source *done right*.
- **Reimagined** — keep the essence and the strongest concepts, rebuild the system to be graphically excellent. Most freedom, but still on-brand and still rock-solid.

At all three levels the result must be graphically solid — fidelity is *how close to the source*, never *how much craft*. **At Refined or Reimagined, load `craft-floor` and clear every threshold in it** (type-scale ratio, no-twin-sizes, distinct links, one spacing scale, focus + reduced-motion). At Faithful, skip the craft floor and mirror the source.

## Formalize into the foundation
1. **Write the tokens** into the project's global style files (brand colors/fonts, type scale, spacing, layout caps) — read the project's token files from `PROJECT-DESIGN.md`'s "Token Files" table.
2. **Wire the default-content styling** so bare authored content already looks on-brand (the vertical-spacing system + auto-styles), per `vertical-spacing-system` and `eds-content-patterns`.
3. **Record intent** in `PROJECT-DESIGN.md`'s Design System section: what each token is *for* and any named foundation rule you committed to (e.g. a body-contrast floor, a heading tracking value). Name load-bearing rules so they're citable later (`writing-skills`).

## Verify before claiming done (Bookend-Verification)
Success criteria, all checkable:
- [ ] ≥3 representative pages were measured, not guessed.
- [ ] Every token recurs across pages (no one-off masquerading as foundation).
- [ ] Default content (title/text/link/list/CTA) renders on-brand with **no block** applied — verify in preview.
- [ ] Body text contrast ≥4.5:1 against its background (non-negotiable at every fidelity).
- [ ] The fidelity stance was actually applied (Faithful mirrors; Refined regularizes; Reimagined rebuilds).
- [ ] `PROJECT-DESIGN.md` Design System reflects the tokens written.

## Pitfalls
- Building the foundation from one page → it bakes that page's quirks into every later page. Sample several.
- Promoting a one-off color/spacing to a token because it looked nice on one page — foundation = recurring only.
- Treating Refined as license to restyle the brand — regularize and strengthen, don't reinvent the identity.
- Styling blocks before the workbench exists — blocks then fight the foundation you add later. Foundation first.
- Eyeballing values instead of measuring — load `measure-then-implement`.

See also: `craft-floor` (thresholds to clear at Refined/Reimagined fidelity), `migration-orientation` (sets the fidelity this skill reads), `eds-migration-process` (foundation before blocks), `vertical-spacing-system` (spacing half of the foundation), `eds-content-patterns` (default-content auto-styles), `measure-then-implement` (measure the source, don't guess), `styling-additively` (per-block styling after this). Native `excat-complete-design-expert` — this skill adds the Workbench-Before-Tools gate, fidelity-conditional craft floor, and cross-page gist extraction.
