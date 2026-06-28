#!/usr/bin/env node
/*
 * Post-import sectionizer (see skills/post-import-sectionizer).
 *
 * The html2md import pipeline strips <hr> wherever it's emitted, flattening the
 * page into a single top-level <div>. EDS renders one section per top-level <div>
 * sibling (decorateSections), so a flattened import gets zero section styling.
 * This script re-splits the flat stream into sibling section divs.
 *
 * A new section begins at:
 *   - a default-content heading/eyebrow run that follows a block/metadata, OR
 *   - a block that follows a previous section's block/metadata.
 * A trailing `.section-metadata` div stays in the section it closes.
 *
 * Generic: the block-class list is derived LIVE from blocks/ (never hardcoded).
 * Usage: node tools/importer/sectionize.mjs content/index.plain.html
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

/** Block classes = the directory names under blocks/ (live, never hardcoded). */
function blockClasses(root = process.cwd()) {
  const dir = join(root, 'blocks');
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

const BLOCK_CLASSES = blockClasses();
const isBlock = (el) => el.tagName === 'DIV' && BLOCK_CLASSES.some((c) => el.classList.contains(c));
const isSectionMeta = (el) => el.tagName === 'DIV' && el.classList.contains('section-metadata');
const isDefaultContent = (el) => !isBlock(el) && !isSectionMeta(el);

const file = process.argv[2];
if (!file) {
  process.stderr.write('Usage: node tools/importer/sectionize.mjs <plain.html path>\n');
  process.exit(1);
}
if (!existsSync(file)) {
  process.stderr.write(`File not found: ${file}\n`);
  process.exit(1);
}

const html = readFileSync(file, 'utf-8');
const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);
const { document } = dom.window;
const wrapper = document.body.children[0];
if (!wrapper) process.exit(0); // empty / nothing to split

const items = [...wrapper.children];
const sections = [];
let current = [];
let prevWasBlockOrMeta = false;

items.forEach((el) => {
  const startNew = current.length > 0
    && prevWasBlockOrMeta
    && (isBlock(el) || isDefaultContent(el));
  if (startNew) {
    sections.push(current);
    current = [];
  }
  current.push(el);
  prevWasBlockOrMeta = isBlock(el) || isSectionMeta(el);
});
if (current.length) sections.push(current);

// Rebuild: one top-level <div> per section.
const out = document.createElement('div');
sections.forEach((group) => {
  const sec = document.createElement('div');
  group.forEach((el) => sec.appendChild(el));
  out.appendChild(sec);
});

writeFileSync(file, out.innerHTML, 'utf-8');
process.stdout.write(`Sectionized ${file} into ${sections.length} section(s) (blocks: ${BLOCK_CLASSES.join(', ') || 'none found'}).\n`);
