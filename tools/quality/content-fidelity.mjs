#!/usr/bin/env node
/*
 * content-fidelity — deterministic CONTENT-LOSS detector for GATE 1.
 *
 * Replaces the eyeballed `diff -u` (importer-diff-workflow): compares a reference
 * page against a candidate on CONTENT (visible text units, headings, images,
 * block counts) — NOT DOM identity. A blockified import intentionally has a
 * different tag tree and legitimately differs on DA media hashes / spacing classes,
 * so those are normalized/ignored. It flags what a re-import DROPPED or DUPLICATED
 * (the A/B's missing content + Compare-Plans duplication).
 *
 * Best used reference `.plain.html` (served truth) vs candidate `.plain.html`
 * (re-import) — both already chrome-stripped EDS content. Comparing raw source vs
 * output is noisier (nav/footer chrome reads as "loss") — compare main-content only.
 *
 * Usage: node tools/quality/content-fidelity.mjs <reference.html> <candidate.html>
 * Exit: 0 no loss/dup · 2 content differs · 1 usage error.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const TEXT_HOLDERS = 'h1,h2,h3,h4,h5,h6,p,li,a,button,td,th,figcaption,blockquote';

function blockClasses(root = process.cwd()) {
  const dir = join(root, 'blocks');
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
}
const BLOCKS = blockClasses();

const norm = (s) => s.replace(/\s+/g, ' ').trim();
/** Normalize an image src: drop DA media hash + query so re-import hashes match. */
const normSrc = (s) => (s || '').replace(/media_[0-9a-f]+/i, 'media_X').replace(/\?.*$/, '').replace(/^.*\//, '');

function extract(html) {
  const { document } = new JSDOM(`<!DOCTYPE html><body>${html}</body>`).window;
  const body = document.body;
  const units = [];
  body.querySelectorAll(TEXT_HOLDERS).forEach((el) => {
    const t = norm(el.textContent);
    if (t) units.push(t);
  });
  const headings = [...body.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => norm(h.textContent)).filter(Boolean);
  const images = [...body.querySelectorAll('img,picture source')].map((i) => normSrc(i.getAttribute('src') || i.getAttribute('srcset'))).filter(Boolean);
  const blocks = [];
  if (BLOCKS.length) {
    body.querySelectorAll('div').forEach((d) => {
      BLOCKS.forEach((b) => { if (d.classList.contains(b)) blocks.push(b); });
    });
  }
  return { units, headings, images, blocks };
}

/** Multiset diff: returns {missing:[{v,n}], extra:[{v,n}]} (n = count delta). */
function multisetDiff(ref, cand) {
  const count = (arr) => arr.reduce((m, v) => m.set(v, (m.get(v) || 0) + 1), new Map());
  const a = count(ref); const b = count(cand);
  const missing = []; const extra = [];
  for (const [v, n] of a) { const d = n - (b.get(v) || 0); if (d > 0) missing.push({ v, n: d }); }
  for (const [v, n] of b) { const d = n - (a.get(v) || 0); if (d > 0) extra.push({ v, n: d }); }
  return { missing, extra };
}

function main() {
  const [ref, cand] = process.argv.slice(2);
  if (!ref || !cand) { process.stderr.write('usage: content-fidelity.mjs <reference.html> <candidate.html>\n'); process.exit(1); }
  for (const f of [ref, cand]) if (!existsSync(f)) { process.stderr.write(`File not found: ${f}\n`); process.exit(1); }

  const a = extract(readFileSync(ref, 'utf8'));
  const b = extract(readFileSync(cand, 'utf8'));
  const out = [];
  const report = (label, { missing, extra }, trunc = 60) => {
    missing.forEach(({ v, n }) => out.push(`LOST   ${label}: "${v.slice(0, trunc)}"${n > 1 ? ` (×${n})` : ''}`));
    extra.forEach(({ v, n }) => out.push(`EXTRA  ${label}: "${v.slice(0, trunc)}"${n > 1 ? ` (×${n})` : ''} — duplicated/injected`));
  };
  report('text', multisetDiff(a.units, b.units));
  report('heading', multisetDiff(a.headings, b.headings));
  report('image', multisetDiff(a.images, b.images));
  if (BLOCKS.length) report('block', multisetDiff(a.blocks, b.blocks), 40);

  if (out.length === 0) {
    process.stdout.write(`✓ content-fidelity: no content loss or duplication (text ${a.units.length}, headings ${a.headings.length}, images ${a.images.length}, blocks ${a.blocks.length})\n`);
    process.exit(0);
  }
  out.forEach((l) => process.stdout.write(`${l}\n`));
  process.stdout.write(`\n${out.length} content difference(s) — a re-import must reproduce the reference exactly.\n`);
  process.exit(2);
}

main();
