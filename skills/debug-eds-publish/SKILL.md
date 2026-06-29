---
name: debug-eds-publish
description: Diagnose why an EDS project fails to preview/publish, or why nav/footer/blocks break only after publish. Use on "preview org/site is not configured", publish 404 / content-bus errors, nav/footer 404 or blank on the published site, or "works locally but not on aem.live". Routes each symptom to its real cause — don't conflate them.
---

Two publish failure modes get conflated — they have **different causes and fixes**. Identify which one first, then use the table.

- **#1 — "preview org/site is not configured"** = the **live Console session can't read `previewOrg`/`previewSite`** — usually NOT a true config gap. Fix: re-select the site in the Console and **reload** (settings are cached); confirm `project.json` resolves org/site. **NOT fstab.**
  - **First, disprove a real gap with a 30-second probe:** is content already live? `curl https://main--<site>--<org>.aem.page/index.plain.html` (and `.aem.live`). **If 200, the site IS configured and previously previewed/published** — so "not configured" is a *session/credential* problem, not a missing connection. Don't send the user to re-connect Code Sync; send them to refresh the session.
  - **Tell: the Upload modal doesn't auto-populate org/site** (user types them by hand) AND publish then says "not configured" → the session's admin lookup is returning empty. Common trigger: **"Allow LLM to access admin.hlx.page on my behalf" was just toggled** — the console cached the pre-enabled state. Fix: **reload the Console** (and re-select the site) so the admin/IMS lookup re-runs; then the modal should auto-fill. If it still doesn't after reload, suspect the IMS token (expired/insufficient scope) or an `admin.hlx.page` site-config call failing — not the repo.
- **#2 — publish 404 / content-bus error** (`failed to load /index.md from content-bus: 404` *while* `/scripts/scripts.js` loads fine) = **fstab / Code Sync**. Fix: `fstab.yaml` mountpoint matches `project.json` org/site; the AEM Code Sync app is installed.

The 404 signature is the tell: if `scripts.js` loads but content 404s → content-bus (#2); if the client refuses before fetching → settings (#1).

## Symptom → cause → first check
| Symptom | Likely cause | First check / fix |
|---|---|---|
| "preview org/site not configured" | live session can't read preview org/site (usually NOT a real gap) | **probe `…aem.page/index.plain.html`**: if 200, site IS configured → reload the Console + re-select site (cached session/IMS lookup); **NOT fstab, NOT re-connecting Code Sync** |
| Upload modal doesn't auto-populate org/site + publish says "not configured" | session's `admin.hlx.page` lookup returns empty (often right after toggling "Allow LLM to access admin.hlx.page") | **reload the Console** so the IMS/admin lookup re-runs; if still empty, suspect IMS token scope/expiry, not the repo |
| publish 404 / content-bus error | missing fstab / Code Sync | fstab mountpoint vs `project.json`; Code Sync app installed (`verify-publish-readiness`) |
| nav/footer request `/content/…` on EDS → 404 | `/content/` leaked into `head.html` meta | remove the meta (root default) or use `/nav` `/footer`; the guard hook + `publish-readiness.mjs` flag it |
| nav/footer render UNSTYLED | block CSS targets classes nothing produces / pipeline flattened nested divs | model structure in content (sections + Section Metadata); run `css-no-producer.mjs`; check the published `.plain.html` carries the classes |
| footer occupies space but BLANK | `visibility:hidden` (named wrapper / reveal not firing) | don't name a wrapper with a block class; check `[data-block-status]` reveal (`eds-dom-structure`) |
| nav/footer missing entirely on one env | wrong fragment path (`/content/` vs root) | path must be the published **root** (`/nav`,`/footer`), never `/content/`; the loader **throws** if missing — fix the path, no fallback (`nav-header-eds`) |
| live broken right after deploy | stale cache | no-cache fetch of the deployed asset + **hard-reload BEFORE re-diagnosing** |

## Pitfalls
- Adding `fstab.yaml` to fix "preview org/site not configured" — that's #1 (client settings), not #2; fstab won't fix it.
- Re-diagnosing a "live is broken" report before a hard-reload — stale CDN/proxy cache mimics a code bug (`verify-before-claiming`).
- "Works locally" ≠ publish-correct — local `aem up` serves `content/` at root + proxies a stale published root; prevention is the AGENTS.md NEVER list, not a local pass.

See also: `verify-publish-readiness` (verify the preconditions before publishing), `nav-header-eds` (root-path nav/footer rule), `eds-dom-structure` (visibility-reveal lifecycle), `quality-tooling` (`publish-readiness.mjs`, `css-no-producer.mjs`).
