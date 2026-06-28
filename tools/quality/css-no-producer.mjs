#!/usr/bin/env node
/**
 * css-no-producer — flag block CSS class selectors that NOTHING produces.
 *
 * EDS insight that makes this decidable: the DA "plain" pipeline strips all
 * authored class/id/style, so a block-part class (`<block>-<part>`) can ONLY come
 * from the block's own JS or the framework — never from authored content. A
 * `<block>-*` selector the block JS never emits is therefore a PROVABLY DEAD rule
 * (the footer.css `.footer-cta`/`.footer-columns` saga: styled, never applied,
 * unstyled in BOTH preview and published). This is detectable locally, no publish.
 *
 * Conservative by design (favour false-negatives — an over-eager checker gets
 * ignored): a selector is "produced" if its class token appears as a literal in
 * the block JS or scripts/scripts.js, equals the block name, or is a standard EDS
 * class. ERROR only for `<block>-*` dead selectors (the strong signal); everything
 * else untraced is a WARN (could be a content-authored variant or a framework class).
 *
 * Usage:
 *   node tools/quality/css-no-producer.mjs <blocks-or-css...>   # human table
 *   node tools/quality/css-no-producer.mjs --all                # scan blocks/
 *   node tools/quality/css-no-producer.mjs --all --json         # machine output
 * Exit: 0 clean (no errors) · 2 errors found · 1 usage error.
 * Generic: no project literals.
 */

import {
  readFileSync, existsSync, readdirSync, statSync,
} from 'node:fs';
import { join, basename, dirname } from 'node:path';

const ROOT = process.cwd();

// Standard classes the EDS framework / aem.js produce (never block-specific).
const STANDARD = new Set([
  'block', 'section', 'section-metadata', 'default-content-wrapper',
  'button', 'button-container', 'icon', 'hidden', 'appear', 'nav-drop',
]);

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/** All class-selector tokens used in a stylesheet, with first line number. */
function classTokens(css) {
  const lines = css.split('\n');
  const found = new Map(); // token -> first line
  lines.forEach((line, i) => {
    // ignore @keyframes percentages etc.; match .class in selectors
    for (const m of line.matchAll(/\.(-?[a-zA-Z_][\w-]*)/g)) {
      const tok = m[1];
      if (!found.has(tok)) found.set(tok, i + 1);
    }
  });
  return found;
}

/** Concatenated producer source text the block can emit classes from. */
function producerSource(blockDir, blockName) {
  let src = '';
  const js = join(blockDir, `${blockName}.js`);
  if (existsSync(js)) src += readFileSync(js, 'utf8');
  const scripts = join(ROOT, 'scripts', 'scripts.js');
  if (existsSync(scripts)) src += `\n${readFileSync(scripts, 'utf8')}`;
  return src;
}

function isProduced(tok, blockName, src) {
  if (tok === blockName) return true;
  if (STANDARD.has(tok)) return true;
  if (tok === `${blockName}-wrapper` || tok === `${blockName}-container`) return true;
  // literal class string emitted by JS (classList.add('x'), className='x', class="x")
  if (src.includes(tok)) return true;
  // dynamically-built classes: if every hyphen segment (≥3 chars) appears as a literal
  // in the producer JS, treat as produced — e.g. `nav-${c}` builds `.nav-tools` from the
  // literals 'nav' and 'tools'. This stays conservative: a dead selector like
  // `.footer-cta` keeps flagging because its unique segment ('cta') is absent from footer.js.
  if (tok.includes('-')) {
    const segs = tok.split('-').filter((s) => s.length >= 3);
    if (segs.length > 0 && segs.every((s) => src.includes(s))) return true;
  }
  return false;
}

function checkBlock(cssPath) {
  const blockDir = dirname(cssPath);
  const blockName = basename(cssPath, '.css');
  const css = stripComments(readFileSync(cssPath, 'utf8'));
  const src = producerSource(blockDir, blockName);
  const findings = [];
  for (const [tok, line] of classTokens(css)) {
    if (isProduced(tok, blockName, src)) continue;
    const blockPart = tok.startsWith(`${blockName}-`);
    findings.push({
      file: cssPath,
      line,
      token: tok,
      severity: blockPart ? 'error' : 'warn',
      detail: blockPart
        ? `.${tok} is a "${blockName}" block-part class that ${blockName}.js never produces — `
          + 'authored classes are stripped by the pipeline, so this selector is dead (unstyled output). '
          + 'Produce it in JS or re-model the structure in content.'
        : `.${tok} has no traced producer (block JS / scripts.js / standard class) — `
          + 'confirm it is an authored variant; otherwise it is a dead selector.',
    });
  }
  return findings;
}

/** Resolve args → list of block CSS files. */
function resolveTargets(args) {
  if (args.includes('--all')) {
    const blocksDir = join(ROOT, 'blocks');
    if (!existsSync(blocksDir)) return [];
    const out = [];
    for (const name of readdirSync(blocksDir)) {
      const css = join(blocksDir, name, `${name}.css`);
      if (existsSync(css)) out.push(css);
    }
    return out;
  }
  const out = [];
  for (const a of args) {
    if (a.startsWith('--')) continue;
    if (!existsSync(a)) continue;
    if (statSync(a).isDirectory()) {
      const name = basename(a);
      const css = join(a, `${name}.css`);
      if (existsSync(css)) out.push(css);
    } else if (a.endsWith('.css')) {
      out.push(a);
    }
  }
  return out;
}

/**
 * PostToolUse hook mode: read the tool call on stdin, and if it edited a block CSS,
 * surface any dead-selector findings as feedback (exit 2 = shown to the agent; the
 * edit already happened, so this is advisory, not a block). Fails open.
 */
function hookMode() {
  let payload = {};
  try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  const fp = String(payload?.tool_input?.file_path || '').replace(/\\/g, '/');
  const m = fp.match(/blocks\/([^/]+)\/\1\.css$/);
  if (!m) process.exit(0);
  if (!existsSync(fp)) process.exit(0);
  const findings = checkBlock(fp);
  if (findings.length === 0) process.exit(0);
  for (const f of findings) {
    const tag = f.severity === 'error' ? 'ERROR' : 'warn ';
    process.stderr.write(`css-no-producer ${tag} .${f.token} (${f.file}:${f.line})\n  ${f.detail}\n`);
  }
  process.exit(2);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--hook')) { hookMode(); return; }
  const json = args.includes('--json');
  const targets = resolveTargets(args);
  if (targets.length === 0) {
    process.stderr.write('usage: css-no-producer.mjs <blocks-or-css...> | --all [--json]\n');
    process.exit(1);
  }
  const all = targets.flatMap(checkBlock);
  const errors = all.filter((f) => f.severity === 'error');

  if (json) {
    process.stdout.write(`${JSON.stringify(all, null, 2)}\n`);
  } else if (all.length === 0) {
    process.stdout.write(`✓ css-no-producer clean — every class selector has a producer (${targets.length} block(s))\n`);
  } else {
    for (const f of all) {
      const tag = f.severity === 'error' ? 'ERROR' : 'warn ';
      process.stdout.write(`${tag} ${f.file}:${f.line}  .${f.token}\n       ${f.detail}\n`);
    }
    process.stdout.write(`\n${errors.length} error(s), ${all.length - errors.length} warning(s)\n`);
  }
  process.exit(errors.length > 0 ? 2 : 0);
}

main();
