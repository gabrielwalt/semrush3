---
name: verify-publish-readiness
description: Verify a project's EDS publish preconditions are in place (fstab mountpoint, preview org/site, no /content/ paths) and, if not, hand off the exact user-only steps. Use during project init (called by bootstrap-project) and before any "publish via the Console" handoff. EMA VERIFIES; the user owns connecting the project (getting-started flow).
---

**EMA verifies, it does not establish the connection.** Connecting the project to EDS / Code Sync is the **user's prerequisite**, done ahead per the documented getting-started flow. This skill checks the preconditions and, when one is missing, hands off the precise user steps — it never publishes or installs anything.

## Run the checker first (don't eyeball)
```bash
node tools/quality/publish-readiness.mjs        # offline file checks
node tools/quality/publish-readiness.mjs --probe # + advisory live 404 hint
```
It reads live (git remote + `project.json` + `fstab.yaml` + `head.html` + content links) and **keeps the two failure modes un-conflated** (see `debug-eds-publish`). A pristine boilerplate exits 0 ("not yet connected").

## What it verifies (and the fix it hands off)
1. **Authoring model** — DA (da.live) or UE/Crosswalk — derived from `project.json` / fstab shape.
2. **`fstab.yaml` mountpoint** matches the model (table below) and is consistent with `project.json` org/site.
3. **`previewOrg` / `previewSite`** resolve non-empty (the *"preview org/site is not configured"* client gate — **NOT** fstab).
4. **No `/content/` absolute paths** in `head.html` nav/footer meta or content links (they 404 at the EDS root).

## Model-correct mountpoint
| Model | `mountpoints: /:` value |
|---|---|
| **DA (da.live)** | `https://content.da.live/<org>/<site>/` (trailing slash) |
| **UE / Crosswalk** | object form: `url: https://author-p<prog>-e<env>.adobeaemcloud.com/bin/franklin.delivery/<org>/<repo>/main` + `type: markup` + `suffix: ".html"` |

EMA may write/fix this repo file as an assist (it's a repo file). Derive `<org>`/`<site>` from the git remote + `project.json` — never hardcode.

## Handoff when a precondition is missing (user-only steps)
Name the **exact** gap, then the steps only the user can do:
- Push `fstab.yaml` (model-correct mountpoint) to the repo.
- Install/grant the AEM Code Sync GitHub app (`github.com/apps/aem-code-sync`).
- **Re-select the site in the Console and RELOAD** — settings are cached, so a reload is required for `previewOrg`/`previewSite` to refresh.
- Then retry Preview/Publish.

Do not silently proceed past a missing precondition.

## Pitfalls
- Conflating "preview org/site not configured" (client settings) with a missing fstab (content-bus) — different causes, different fixes (`debug-eds-publish`).
- Assuming the boilerplate ships an fstab — it doesn't; it's added when the user connects the project.
- Trying to publish/install on the user's behalf — prohibited; verify + hand off.

See also: `debug-eds-publish` (symptom→cause→fix when publish fails), `bootstrap-project` (calls this at init), `quality-tooling` (`publish-readiness.mjs`), `nav-header-eds` (the root-path nav/footer rule).
