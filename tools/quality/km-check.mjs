#!/usr/bin/env node
/**
 * tools/quality/km-check.mjs — knowledge-management verifier.
 *
 * Dog-foods The Executable-Rule Rule for the KM stores (see
 * skills/curating-project-knowledge/SKILL.md + docs/multi-user-collaboration-plan.md).
 * Catches the mechanizable capture mistakes; the agent owns the judgment.
 *
 * Errors (deterministic, HIGH-precision — exit 2):
 *   - A generic skill (skills/<name>/, name NOT starting `project-`) containing an
 *     unambiguous PROJECT LITERAL — a brand palette color, a concrete
 *     content/*.plain.html path, or the repo owner/slug. Read live from
 *     PROJECT.md / PROJECT-DESIGN.md / styles/*.css (like detect.mjs reads the
 *     palette), never hardcoded here. → "should be a project- skill."
 *   - users/.current-user tracked by git.
 *   - A users/<login>/ folder missing ROLE.md.
 *
 * Warnings (heuristic — advisory, never fail the build):
 *   - A generic skill that names the site domain, or references an ACTUAL project
 *     block dir (illustrative leak — genericize or make it project-).
 *   - A context.md / PROJECT-CONTEXT.md entry with numbered/imperative steps → "may be a procedure → skill".
 *   - Store bloat (a context.md / PROJECT-CONTEXT.md past the line threshold) → "consolidate".
 *
 * Usage: node tools/quality/km-check.mjs [--json]
 * Exit: 0 = clean (or warnings only), 2 = errors. READ-ONLY (git ls-files only). No deps, ESM.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const json = process.argv.includes('--json');
const BLOAT_LINES = 200;

const findings = []; // { severity, kind, file, line, detail }
const add = (severity, kind, file, line, detail) => findings.push({ severity, kind, file, line, detail });

const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');
const listDirs = (p) => (existsSync(join(ROOT, p)) ? readdirSync(join(ROOT, p)).filter((e) => !e.startsWith('.') && statSync(join(ROOT, p, e)).isDirectory()) : []);

/* ---- project literals (live, never hardcoded) ------------------------- */
const normColor = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
const NEUTRAL = /^#(fff|ffffff|000|000000)$|^rgb\(255 255 255|^rgb\(0 0 0|^rgba?\(255, ?255, ?255|^rgba?\(0, ?0, ?0/;

function projectLiterals() {
  const colorSrc = read('PROJECT-DESIGN.md') + '\n' + read('styles/brand.css') + '\n' + read('styles/styles.css');
  const colors = new Set();
  for (const re of [/#[0-9a-fA-F]{3,8}\b/g, /rgba?\([^)]*\)/g, /oklch\([^)]*\)/g]) {
    for (const m of colorSrc.matchAll(re)) {
      const c = normColor(m[0]);
      if (c.length >= 4 && !NEUTRAL.test(c)) colors.add(c);
    }
  }
  const proj = read('PROJECT.md');
  const domains = new Set();
  const md = proj.match(/Source site\*\*\s*\|\s*https?:\/\/(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/i);
  if (md) domains.add(md[1].toLowerCase());
  const repoStrong = new Set(); // unambiguous repo literals (owner login + slug forms)
  const mr = proj.match(/github\.com\/([\w-]+)\/([\w-]+)/i);
  if (mr) {
    const owner = mr[1].toLowerCase();
    const name = mr[2].toLowerCase();
    repoStrong.add(owner);              // distinctive GH owner login
    repoStrong.add(`${name}--${owner}`); // aem.page slug
    repoStrong.add(`${owner}/${name}`);  // repo path
  }
  return { colors: [...colors], domains: [...domains], repoStrong: [...repoStrong], blocks: listDirs('blocks') };
}

/* ---- generic-skill checks --------------------------------------------- */
function checkGenericSkills(lit) {
  for (const name of listDirs('skills')) {
    if (name.startsWith('project-')) continue;
    const f = join('skills', name, 'SKILL.md');
    if (!existsSync(join(ROOT, f))) continue;
    const text = read(f);
    const lower = text.toLowerCase();
    const norm = normColor(text);
    const err = (d) => add('error', 'generic-skill-project-literal', f, null, d);
    const warn = (d) => add('warn', 'generic-skill-leak', f, null, d);

    // ERRORS — unambiguous project literals
    for (const c of lit.colors) if (norm.includes(c)) { err(`brand palette color "${c}" — should be a project- skill`); break; }
    for (const r of lit.repoStrong) if (lower.includes(r)) { err(`repo literal "${r}" — should be a project- skill`); break; }
    const cp = text.match(/\bcontent\/[A-Za-z0-9][\w./-]*\.plain\.html\b/); // placeholders (content/<x>, content/*) are skipped
    if (cp) err(`concrete content path "${cp[0]}" — should be a project- skill`);

    // WARNINGS — advisory leaks (illustrative examples; genericize or make project-)
    for (const d of lit.domains) if (lower.includes(d)) { warn(`names site domain "${d}" in an example — genericize (e.g. example.com) or make it project-`); break; }
    for (const b of lit.blocks) if (new RegExp(`blocks/${b}\\b`).test(text)) { warn(`references actual project block "blocks/${b}" — keep the example generic`); break; }
  }
}

/* ---- users/ store checks (errors) ------------------------------------- */
function checkUsers() {
  try {
    const tracked = execFileSync('git', ['ls-files', 'users/.current-user'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (tracked) add('error', 'current-user-tracked', 'users/.current-user', null, 'is tracked by git — must be gitignored (workspace-local cache)');
  } catch { /* not a git repo — skip */ }
  for (const name of listDirs('users')) {
    if (!existsSync(join(ROOT, 'users', name, 'ROLE.md'))) add('error', 'user-missing-role', `users/${name}`, null, `users/${name}/ is missing ROLE.md`);
  }
}

/* ---- declarative-store checks (warnings) ------------------------------ */
function checkStores() {
  const stores = ['PROJECT-CONTEXT.md', ...listDirs('users').map((n) => join('users', n, 'context.md'))];
  for (const s of stores) {
    if (!existsSync(join(ROOT, s))) continue;
    const lines = read(s).split('\n');
    if (lines.length > BLOAT_LINES) add('warn', 'store-bloat', s, null, `${lines.length} lines (> ${BLOAT_LINES}) — consolidate`);
    lines.forEach((ln, i) => {
      if (/^\s*\d+\.\s+\S/.test(ln) && !/\*\[Agent:/.test(ln)) add('warn', 'steps-in-store', s, i + 1, 'numbered step in a declarative store — may be a procedure → skill');
    });
  }
}

/* ---- run -------------------------------------------------------------- */
checkGenericSkills(projectLiterals());
checkUsers();
checkStores();

const errors = findings.filter((f) => f.severity === 'error');
const warns = findings.filter((f) => f.severity === 'warn');

if (json) {
  process.stdout.write(JSON.stringify(findings, null, 2) + '\n');
} else if (findings.length === 0) {
  process.stdout.write('✓ km-check clean — no misplacement, no tracked cache, no bloat\n');
} else {
  process.stdout.write(`\nkm-check findings (${errors.length} error, ${warns.length} warn):\n\n`);
  for (const f of findings) {
    const loc = f.line ? `${f.file}:${f.line}` : f.file;
    process.stdout.write(`  ${f.severity === 'error' ? '❌' : '⚠️ '} [${f.kind}] ${loc} — ${f.detail}\n`);
  }
  process.stdout.write('\n');
}

process.exit(errors.length ? 2 : 0);
