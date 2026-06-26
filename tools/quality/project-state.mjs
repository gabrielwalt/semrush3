#!/usr/bin/env node
/**
 * tools/quality/project-state.mjs — structured project-state probe.
 *
 * Emits machine-readable ground truth so the agent routes on FACTS, not by
 * parsing prose (per The Executable-Rule Rule). Reads:
 *   - PROJECT-STATUS.md "## Pages" table → per-page content/style validation gate
 *   - content/**​/*.plain.html            → the actual content files present
 *   - read-only git                       → working-tree changes
 *   - styles/*.css                        → which files define :root tokens
 *
 * Usage:
 *   node tools/quality/project-state.mjs           → JSON to stdout
 *   node tools/quality/project-state.mjs --scan     → also prints the detect.mjs
 *                                                     command for the scan targets
 *
 * READ-ONLY. Uses only `git status/diff` (never add/commit/push/checkout).
 * No network, no deps. ESM.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const scan = process.argv.includes('--scan');

/* ---- content files present -------------------------------------------- */
function glob(dir, re, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) glob(p, re, acc);
    else if (re.test(e)) acc.push(relative(ROOT, p));
  }
  return acc;
}
const contentFiles = glob(join(ROOT, 'content'), /\.plain\.html$/).sort();

/* ---- parse the PROJECT-STATUS "## Pages" table ------------------------ */
// Map a page's row to its content file. Order: explicit path in Notes wins;
// else derive generically from the URL/path column (strip domain → content path);
// else fall back to EDS platform conventions by name (index/nav/footer).
function nameToContentPath(name, url, notes) {
  const inNotes = notes.match(/content\/[\w/-]+\.plain\.html/);
  if (inNotes) return inNotes[0];
  if (url && url !== '—') {
    const path = url
      .replace(/^https?:\/\/[^/]+/i, '') // strip protocol + domain
      .replace(/[?#].*$/, '')             // strip query/hash
      .replace(/^\/+|\/+$/g, '');         // strip leading/trailing slashes
    return path === '' ? 'content/index.plain.html' : `content/${path}.plain.html`;
  }
  const n = name.toLowerCase();
  if (/^home(page)?$/.test(n)) return 'content/index.plain.html';
  if (/^nav/.test(n)) return 'content/nav.plain.html';
  if (/^footer/.test(n)) return 'content/footer.plain.html';
  return null;
}

const pages = [];
const statusPath = join(ROOT, 'PROJECT-STATUS.md');
if (existsSync(statusPath)) {
  const md = readFileSync(statusPath, 'utf8');
  const section = md.split(/^##\s+Pages\s*$/m)[1] || '';
  const tableEnd = section.split(/^##\s+/m)[0];
  for (const line of tableEnd.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    // expect: ['', Page, URL, ContentValidated, StyleValidated, Notes, '']
    if (cells.length < 6) continue;
    const [, name, url, content, style, notes] = cells;
    if (!name || /^Page$/i.test(name) || /^-+$/.test(name)) continue; // header / divider
    const contentValidated = content.includes('✅');
    const styleValidated = style.includes('✅');
    const unfrozen = style.includes('🔓'); // user explicitly reopened for design work
    pages.push({
      name,
      url: url === '—' ? null : url,
      file: nameToContentPath(name, url, notes || ''),
      contentValidated,
      styleValidated,
      unfrozen,
      // frozen = style-validated AND not explicitly unfrozen (Frozen-Tools Rule,
      // suspended for design-open pages)
      frozen: styleValidated && !unfrozen,
    });
  }
}

const frozen = pages.filter((p) => p.frozen && p.file).map((p) => p.file);

/* ---- read-only git working-tree changes ------------------------------- */
function gitChanges() {
  try {
    const out = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out
      .split('\n')
      .filter(Boolean)
      .map((l) => ({ status: l.slice(0, 2).trim(), file: l.slice(3) }));
  } catch {
    return []; // git unavailable or not a repo — degrade gracefully
  }
}
const changes = gitChanges();
const changedFiles = changes.map((c) => c.file);

/* ---- token files + scan targets --------------------------------------- */
const tokenFiles = ['styles/styles.css', 'styles/brand.css', 'styles/lazy-styles.css']
  .filter((f) => existsSync(join(ROOT, f)) && /:root/.test(readFileSync(join(ROOT, f), 'utf8')));

// scan targets for the detector: changed css/html first (most relevant), else all foundation+blocks
const changedStyle = changedFiles.filter((f) => /\.(css|html)$/.test(f) && existsSync(join(ROOT, f)));
const scanTargets = changedStyle.length
  ? changedStyle
  : [...glob(join(ROOT, 'styles'), /\.css$/), ...glob(join(ROOT, 'blocks'), /\.css$/)];

const state = {
  generatedAt: new Date().toISOString(),
  pages,
  frozen,
  contentFiles,
  changedFiles,
  tokenFiles,
  scanTargets,
  scanVia: changedStyle.length ? 'git-changes' : 'all-foundation-and-blocks',
};

if (scan) {
  process.stdout.write(JSON.stringify(state, null, 2) + '\n');
  process.stdout.write('\n# To check craft-floor on the scan targets:\n');
  process.stdout.write(`node tools/quality/detect.mjs ${state.scanTargets.join(' ')}\n`);
} else {
  process.stdout.write(JSON.stringify(state, null, 2) + '\n');
}
