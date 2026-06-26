#!/usr/bin/env node
/**
 * tools/quality/detect.mjs — deterministic craft-floor checker.
 *
 * Scans CSS/HTML files for craft-floor violations (skills/craft-floor/SKILL.md),
 * keyed to `rule:craft-*` IDs. The allow-list (palette, radius scale, tokens) is
 * loaded LIVE from PROJECT-DESIGN.md + styles/*.css :root — never hardcoded.
 *
 * Usage:
 *   node tools/quality/detect.mjs [files...] [--json] [--all]
 *     (no files) + --all   → scans styles/*.css + blocks/* /*.css
 *     --json                → machine output; default is a human table
 * Exit: 0 = clean, 2 = findings, 1 = usage/error.
 *
 * No dependencies, no network. ESM.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { RULES, loadAllowList } from './rules.mjs';

/**
 * Find the bodies of base-level `:root { ... }` blocks (those NOT nested inside
 * an @media / @supports / @container). Returns [{start,end}] char offsets of the
 * content between the braces. Works on comment-blanked CSS.
 */
function baseRootRanges(css) {
  const ranges = [];
  const re = /(^|[\s,}])\:root\b[^{]*\{/g;
  let m;
  while ((m = re.exec(css))) {
    const braceOpen = css.indexOf('{', m.index);
    // is this :root enclosed by an unclosed @-rule before it? scan brace balance
    // of @media/@supports/@container regions.
    if (enclosedByAtRule(css, m.index)) continue;
    // brace-match to find the close
    let depth = 1;
    let i = braceOpen + 1;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
    }
    ranges.push({ start: braceOpen + 1, end: i - 1 });
    re.lastIndex = i;
  }
  return ranges;
}

/** True if char offset `pos` sits inside an open @media/@supports/@container block. */
function enclosedByAtRule(css, pos) {
  const head = css.slice(0, pos);
  // walk braces, tracking whether each open brace belongs to an at-rule
  const stack = [];
  const atRe = /@(media|supports|container)[^{};]*\{|\{|\}/g;
  let m;
  while ((m = atRe.exec(head))) {
    if (m[0] === '}') stack.pop();
    else stack.push(m[0][0] === '@'); // true if this brace is an at-rule brace
  }
  return stack.some(Boolean);
}

const ROOT = process.cwd();
const args = process.argv.slice(2);
const json = args.includes('--json');
const all = args.includes('--all');
const files = args.filter((a) => !a.startsWith('--'));

function globCss(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) globCss(p, acc);
    else if (/\.(css|html)$/.test(e)) acc.push(p);
  }
  return acc;
}

let targets = files;
if (targets.length === 0 && all) {
  targets = [...globCss(join(ROOT, 'styles')), ...globCss(join(ROOT, 'blocks'))];
}
if (targets.length === 0) {
  process.stderr.write('usage: node tools/quality/detect.mjs <files...> [--json] [--all]\n');
  process.exit(1);
}

const allow = loadAllowList(ROOT);
// Does styles.css carry a global reduced-motion guard covering `*`? If so, the
// motion rule is satisfied site-wide.
{
  const sp = join(ROOT, 'styles/styles.css');
  allow.globalReducedMotion =
    existsSync(sp) && /@media[^{]*prefers-reduced-motion[^{]*\{[\s\S]*?\*/.test(readFileSync(sp, 'utf8'));
}

const findings = [];
// project-wide token-dup: aggregate definitions across all scanned css
const tokenDefs = new Map(); // name -> [{file,line}]
// project-wide unused-token: every var(--x) reference seen anywhere
const tokenUses = new Set(); // name

for (const file of targets) {
  if (!existsSync(file)) {
    process.stderr.write(`skip (not found): ${file}\n`);
    continue;
  }
  const text = readFileSync(file, 'utf8');
  const ext = extname(file).toLowerCase();
  const appliesAs = ext === '.html' ? 'html' : 'css';
  const cssNoComments = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

  // collect token defs for cross-file dup detection — ONLY those defined at a
  // top-level `:root` (selector nesting depth 1). Re-declarations inside
  // @media / other selectors are legitimate responsive/scoped overrides, NOT
  // the "two :root owners" defect the One-Token-One-Home rule targets.
  if (appliesAs === 'css') {
    // every var(--token) reference — feeds the unused-token check below
    for (const u of cssNoComments.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) tokenUses.add(u[1]);
    // Count a token as a "home" definition only when it sits in a BASE :root
    // block — a :root NOT nested inside an at-rule (@media/@supports/@container).
    // Responsive :root overrides inside @media are legitimate, not the
    // "two owners" defect. Use brace-matched ranges over the char stream so
    // single-line and multi-line :root blocks behave identically.
    for (const range of baseRootRanges(cssNoComments)) {
      const body = cssNoComments.slice(range.start, range.end);
      const before = cssNoComments.slice(0, range.start);
      let lineBase = before.split('\n').length; // 1-based line of range.start
      body.split('\n').forEach((bl, j) => {
        const m = bl.match(/(--[a-z0-9-]+)\s*:\s*\S/);
        if (m) {
          const name = m[1];
          if (!tokenDefs.has(name)) tokenDefs.set(name, []);
          tokenDefs.get(name).push({ file, line: lineBase + j });
        }
      });
    }
  }

  for (const rule of RULES) {
    if (rule.appliesTo !== 'both' && rule.appliesTo !== appliesAs) continue;
    if (rule.id === 'craft-color-token-dup') continue; // handled project-wide below
    let hits = [];
    try {
      hits = rule.run({ file, text, cssNoComments, allow, appliesAs }) || [];
    } catch (e) {
      process.stderr.write(`rule ${rule.id} errored on ${file}: ${e.message}\n`);
    }
    for (const h of hits) {
      findings.push({ file: relative(ROOT, file), line: h.line, ruleId: rule.id, name: rule.name, severity: rule.severity, snippet: h.snippet, detail: h.detail });
    }
  }
}

// cross-file token duplication (One-Token-One-Home)
for (const [name, defs] of tokenDefs) {
  if (defs.length > 1) {
    const [, ...dups] = defs;
    for (const d of dups) {
      findings.push({
        file: relative(ROOT, d.file),
        line: d.line,
        ruleId: 'craft-color-token-dup',
        name: 'Token defined more than once',
        severity: 'error',
        snippet: `${name}`,
        detail: `${name} also defined at ${relative(ROOT, defs[0].file)}:${defs[0].line}`,
      });
    }
  }
}

// project-wide unused token (craft-token-unused) — a token defined but never
// referenced via var() anywhere is dead weight / a typo'd consumer. ONLY reliable
// on a full scan (--all): a partial file set can't see every consumer, so we'd
// false-positive on tokens used by files outside the set.
if (all && files.length === 0) {
  for (const [name, defs] of tokenDefs) {
    if (!tokenUses.has(name)) {
      const d = defs[0];
      findings.push({
        file: relative(ROOT, d.file),
        line: d.line,
        ruleId: 'craft-token-unused',
        name: 'Token defined but never referenced',
        severity: 'warn',
        snippet: name,
        detail: `${name} is defined but never used via var() — remove it or wire up the intended consumer`,
      });
    }
  }
}

findings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));

if (json) {
  process.stdout.write(JSON.stringify(findings, null, 2) + '\n');
} else if (findings.length === 0) {
  process.stdout.write(`✓ clean — ${targets.length} file(s), no craft-floor findings\n`);
} else {
  const bySev = { error: 0, warn: 0 };
  process.stdout.write(`\ncraft-floor findings (${findings.length}) across ${targets.length} file(s):\n\n`);
  let lastFile = '';
  for (const f of findings) {
    bySev[f.severity] = (bySev[f.severity] || 0) + 1;
    if (f.file !== lastFile) {
      process.stdout.write(`  ${f.file}\n`);
      lastFile = f.file;
    }
    process.stdout.write(`    L${f.line} [${f.ruleId}] ${f.detail}\n`);
  }
  process.stdout.write(`\n  ${bySev.error || 0} error, ${bySev.warn || 0} warn\n`);
}

process.exit(findings.length ? 2 : 0);
