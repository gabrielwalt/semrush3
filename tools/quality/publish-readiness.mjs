#!/usr/bin/env node
/**
 * publish-readiness — verify a project's EDS publish preconditions BEFORE the user
 * publishes, so the gap surfaces here (with the exact fix) instead of at the Publish
 * click with a misleading error. Reads LIVE (git remote + project.json + fstab.yaml +
 * head.html + content links); no hardcoded org/site/host. No network by default.
 *
 * Two failure modes it keeps UN-conflated (see debug-eds-publish):
 *   #1 "preview org/site is not configured" = client settings / site not connected
 *      (empty previewOrg/previewSite) — NOT fstab.
 *   #2 publish 404 / content-bus error = missing fstab / Code Sync.
 * Plus the published-path trap: a `/content/…` absolute path 404s at the EDS site root.
 *
 * Usage:
 *   node tools/quality/publish-readiness.mjs            # file checks (offline)
 *   node tools/quality/publish-readiness.mjs --probe     # + best-effort live 404 probe
 *   node tools/quality/publish-readiness.mjs --json
 * Exit: 0 ready / pristine · 2 a precondition fails · 1 usage error.
 * Generic: no project literals.
 */

import {
  readFileSync, existsSync, readdirSync, statSync,
} from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const findings = [];
const err = (msg, fix) => findings.push({ severity: 'error', msg, fix });
const warn = (msg, fix) => findings.push({ severity: 'warn', msg, fix });

function readIf(rel) {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

/** Owner/repo from the git remote, if any (never hardcoded). */
function gitRemote() {
  try {
    const url = execSync('git config --get remote.origin.url', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const m = url.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    return m ? { owner: m[1], repo: m[2] } : null;
  } catch { return null; }
}

function loadProjectJson() {
  const raw = readIf('project.json');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { err('project.json is present but not valid JSON', 'Fix the JSON syntax.'); return null; }
}

/** First-match-wins key lookup, tolerant of EMA project.json shape variation. */
function pick(obj, ...keys) {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== '') return obj[k];
    if (obj.project && obj.project[k] != null && obj.project[k] !== '') return obj.project[k];
  }
  return undefined;
}

/** Extract the `/:` mountpoint value from fstab.yaml (scalar or nested url:). */
function fstabMount(yaml) {
  if (!yaml) return null;
  // scalar form:  /: https://content.da.live/org/site/
  let m = yaml.match(/^\s*\/\s*:\s*(\S+)\s*$/m);
  if (m) return m[1].replace(/^["']|["']$/g, '');
  // object form:  /:\n    url: https://author-...
  m = yaml.match(/^\s*\/\s*:\s*$[\s\S]*?\burl\s*:\s*(\S+)/m);
  if (m) return m[1].replace(/^["']|["']$/g, '');
  return null;
}

function classifyMount(mount) {
  if (/^https:\/\/content\.da\.live\/[^/]+\/[^/]+\/?$/.test(mount)) return 'da';
  if (/franklin\.delivery\/[^/]+\/[^/]+/.test(mount) && /adobeaemcloud\.com/.test(mount)) return 'ue';
  return null;
}

/** Scan a text for /content/ absolute paths (the published-root 404 trap). */
function scanContentPaths(label, text) {
  if (!text) return;
  // nav/footer meta with a /content/ value
  for (const m of text.matchAll(/<meta[^>]+name=["'](nav|footer)["'][^>]*content=["']([^"']*)["']/gi)) {
    if (/^\/content\//.test(m[2])) {
      err(`${label}: ${m[1]} meta points at "${m[2]}" (/content/…)`,
        'EDS serves at the site root → this 404s in production. Remove the meta (root default) or use /nav and /footer.');
    }
  }
  // any href/src to /content/…
  for (const m of text.matchAll(/(?:href|src)=["'](\/content\/[^"']*)["']/gi)) {
    err(`${label}: link to "${m[1]}" (/content/…)`,
      'Content serves at the site root on EDS → use a root-relative path without the /content/ prefix.');
  }
}

function listContentFiles() {
  const dir = join(ROOT, 'content');
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(plain\.html|html|md)$/.test(name)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const probe = args.includes('--probe');

  const remote = gitRemote();
  const proj = loadProjectJson();
  const fstab = readIf('fstab.yaml');
  const hasContent = existsSync(join(ROOT, 'content'));

  // Pristine boilerplate: nothing configured yet → nothing to gate.
  if (!proj && !fstab && !hasContent) {
    const out = 'pristine boilerplate — no project.json / fstab.yaml / content yet. '
      + 'Publish preconditions are checked once a project is bootstrapped and connected '
      + '(getting-started: push fstab.yaml + install AEM Code Sync).';
    if (json) process.stdout.write(`${JSON.stringify({ status: 'pristine', findings: [] }, null, 2)}\n`);
    else process.stdout.write(`✓ ${out}\n`);
    process.exit(0);
  }

  // (A) Published-path scan — always, the hard gate (offline, deterministic).
  scanContentPaths('head.html', readIf('head.html'));
  for (const f of listContentFiles()) scanContentPaths(f.replace(`${ROOT}/`, ''), readFileSync(f, 'utf8'));

  // (B) fstab presence + shape.
  const previewOrg = pick(proj, 'previewOrg');
  const previewSite = pick(proj, 'previewSite');
  const org = pick(proj, 'org', 'owner') || remote?.owner;
  const site = pick(proj, 'site', 'repo') || remote?.repo;

  if (!fstab) {
    err('fstab.yaml is missing', 'preview/publish needs it. Add the model-correct mountpoint '
      + '(DA: https://content.da.live/<org>/<site>/), push it to the repo, and install AEM Code Sync.');
  } else {
    const mount = fstabMount(fstab);
    if (!mount) {
      err('fstab.yaml has no resolvable `/:` mountpoint', 'Add a `mountpoints: { /: … }` entry.');
    } else if (!classifyMount(mount)) {
      err(`fstab mountpoint "${mount}" is not a recognized DA or UE/Crosswalk form`,
        'DA → https://content.da.live/<org>/<site>/ ; UE → …/bin/franklin.delivery/<org>/<repo>/main with type: markup, suffix: ".html".');
    } else if (classifyMount(mount) === 'da' && org && site) {
      const m = mount.match(/content\.da\.live\/([^/]+)\/([^/]+)/);
      if (m && (m[1] !== org || m[2] !== site)) {
        warn(`fstab DA mount (${m[1]}/${m[2]}) differs from derived org/site (${org}/${site})`,
          'Confirm the mountpoint org/site match the project — a mismatch serves the wrong content bus.');
      }
    }
  }

  // (C) previewOrg/previewSite resolution (failure mode #1 — client settings, NOT fstab).
  if (proj && (!previewOrg || !previewSite)) {
    err('previewOrg / previewSite is empty or unresolved in project.json',
      'This is the "preview org/site is not configured" client gate (NOT fstab). Re-select the site '
      + 'in the Console and RELOAD (settings are cached); confirm project.json resolves org/site.');
  }

  // (D) best-effort live probe (opt-in; advisory only).
  if (probe && org && site) {
    warn(`(probe requested) check https://main--${site}--${org}.aem.page/ manually`,
      'A 404 with /scripts/scripts.js loading = code-synced but no content (fstab/Code-Sync); '
      + 'a connection error = not connected. The file checks above are the hard gate.');
  }

  const errors = findings.filter((f) => f.severity === 'error');
  if (json) {
    process.stdout.write(`${JSON.stringify({ status: errors.length ? 'blocked' : 'ready', org, site, findings }, null, 2)}\n`);
  } else if (findings.length === 0) {
    process.stdout.write(`✓ publish-readiness: preconditions met (org=${org || '?'}, site=${site || '?'})\n`);
  } else {
    for (const f of findings) {
      process.stdout.write(`${f.severity === 'error' ? 'ERROR' : 'warn '} ${f.msg}\n       → ${f.fix}\n`);
    }
    process.stdout.write(`\n${errors.length} error(s), ${findings.length - errors.length} warning(s)\n`);
  }
  process.exit(errors.length > 0 ? 2 : 0);
}

main();
