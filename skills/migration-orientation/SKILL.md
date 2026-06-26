---
name: migration-orientation
description: The mandatory setup conversation that runs BEFORE any import on a new migration. Fire when PROJECT-DESIGN.md has no Migration Strategy section, or the user says "let's migrate X" / "start a new project / site". Do NOT fire when a strategy is already recorded — load `eds-migration-process` instead. Extends EXCAT `excat-site-migration`.
---

A migration never starts with an import. It starts with a conversation. This skill is the gate for **The Brand-Foundation-First Rule** (AGENTS.md): no content import, no styling, until every decision below is settled and recorded.

If a strategy is already recorded in `PROJECT-DESIGN.md` — **stop, do not re-run**. Read it and say: "I found an existing strategy in `PROJECT-DESIGN.md` — [brief summary]. Want to continue from there, or revise something?"

## Before asking anything — inspect and assert

Before Round 1, do this silently:
1. **Visit the source URL** (if provided) with Playwright — note the visual language, nav page types, and whether the design feels strong or dated.
2. **Read `PROJECT-DESIGN.md`** and `PROJECT-STATUS.md` if they exist — some answers may already be recorded.
3. **Look at `PROJECT.md`** or `AGENTS.md` for any project-level guidance.

Derive as many answers as you can from inspection. Assert those; only ask about the rest. A well-inspected source site should resolve 4–5 of the 12 inputs before the first question lands.

## The conversation — assert-then-confirm, one round at a time

Do not dump all questions at once. Assert what inspection makes obvious, ask only what remains open. **Offer a concrete default for every open question.** Cover the 12 inputs across up to 3 rounds. Skip any the inspection already answers.

---

### Round 1 — Foundations (ask these first, everything else depends on them)

| # | Input | Default if not stated |
|---|-------|-----------------------|
| **1** | **Authoring model** — Document Authoring (DA / da.live, content in Word/Google Docs) or CrossWalk (Universal Editor / XWalk, content in AEM)? | **DA** — assume DA unless the user or project files say XWalk |
| **2** | **Scope** — single page, a set of pages/templates, or the full site? Roughly how many pages? | **Full site** unless the prompt says otherwise |
| **3** | **Site analysis first?** — should the agent catalog all URLs and group them into templates before touching any page, or go straight to a starting page? | **Yes for full-site scope**; no for single-page |
| **4** | **Starting page** — which page to migrate first after orientation and the global foundation? | **Homepage**, or the page the user mentions; otherwise the most visually representative page found during inspection |

Assert the authoring model immediately. For scope, if the user mentioned a URL or said "the whole site", assert that.

---

### Round 2 — Sources, fidelity, and resources

| # | Input | Default if not stated |
|---|-------|-----------------------|
| **5** | **Content source** — live source site, an export/crawl, another URL, or author-supplied content? | **Live source site** at the URL provided |
| **6** | **Design source** — same site (most common), a different site, or a Figma file? | **Same as content source** |
| **7** | **Additional resources** — Figma links, brand guidelines, style guides, reference EDS implementations, fonts, icon sets, existing token files? | None — ask explicitly: "Do you have a Figma file, brand guidelines, or any reference to share before we build the foundation?" |
| **8** | **Fidelity** — site-wide default on the Faithful / Refined / Reimagined scale (defined below) | **Faithful** for a strong, modern-looking source; **Refined** if the source looks dated or uneven; assert based on inspection |
| **9** | **Templates or content to improve** — are any pages/templates meant to be enhanced or redesigned in the process, rather than just copied? | None — pure migration, unless the user signals otherwise |

For fidelity: inspect the source first, then assert — don't offer a menu.

---

### Round 3 — Overrides and constraints (only if gaps remain after Round 2)

| # | Input | Default if not stated |
|---|-------|-----------------------|
| **10** | **Reuse** — existing EDS block library, design system, or prior project blocks to reuse? | None |
| **11** | **Per-page fidelity overrides** — any page/template with a different fidelity than the site default? | None |
| **12** | **Constraints** — strict brand rules, pages flagged as off-limits, accessibility bar, templates to avoid copying, anything the agent must not touch or change? | None |

---

## Authoring model implications

Settle in Round 1 — shapes everything downstream.

| | Document Authoring (DA) | CrossWalk / XWalk |
|---|---|---|
| **Content lives in** | Word / Google Docs via da.live | AEM repository (JCR XML) |
| **Block authoring** | Tables in docs → `.plain.html` | Component definitions + models JSON |
| **Import target** | `.plain.html` files in `content/` | JCR XML via `excat-xwalk-expert` |
| **Key skill** | `marker-driven-import`, `importer-parser-patterns` | `excat-xwalk-expert` |
| **Default** | ✓ yes | Only if explicitly confirmed |

If the user says XWalk, load `excat-xwalk-expert`. If unclear, assert DA — cost of being wrong is low.

## Fidelity scale (site default; per-page overridable)

**First-match-wins:** (1) explicit per-page override; (2) site default; (3) Faithful.

- **Faithful** — match the source closely; deviate only to fix outright bugs.
- **Refined** — keep the brand identity; regularize weak spots and uplevel craft.
- **Reimagined** — keep the essence; rebuild for graphical excellence.

Fidelity governs *how close to the original*, never *how much craft* — the foundation is rock-solid at every level. Full definitions and how each level shapes the foundation build live in `global-style-foundation`. Orientation's job is only to **capture the user's chosen level**, not to re-explain the framework.

## Record the strategy (then the gate is passed)

Write all 12 inputs into `PROJECT-DESIGN.md` under `## Migration Strategy` (create it if absent — it belongs at the top, before the token inventory). All round-table inputs go here.

Verify before claiming done (**Bookend-Verification**): section exists, all inputs recorded, user confirmed fidelity and authoring model.

## What comes next

- **Full-site scope + catalog first** → run `excat-site-scope` / `excat-site-catalog` / `excat-url-discovery` to inventory pages and group into templates, then `import-content-scoping` to triage. Report back before touching any page.
- **Single-page or skip catalog** → go directly to `global-style-foundation` (the workbench) → first page content → gates → per-block styling.

Orientation sets direction. It does not import, style, or commit anything itself.

## Pitfalls
- Importing before the strategy is recorded — that's what **Brand-Foundation-First** prevents.
- Skipping the authoring model — DA vs XWalk can't be retrofitted.
- Treating Reimagined as lower quality — it is *freer of the original*, not lower craft.
- Recording a single fidelity and forgetting per-page overrides — a weak legacy template copied Faithfully drags the whole migration.
- Assuming no additional resources without asking — a Figma file found in Round 2 can save days.

See also: `global-style-foundation` (next step), `eds-migration-process` (full workflow this gates), `import-content-scoping` (URL triage for full-site scope), `excat-xwalk-expert` (if XWalk), `measure-then-implement` (Faithful means measure).
