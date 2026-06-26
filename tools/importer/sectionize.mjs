#!/usr/bin/env node
/*
 * Post-import sectionizer.
 *
 * The html2md import pipeline flattens section boundaries (<hr> markers are
 * stripped), leaving all content inside a single top-level <div>. EDS represents
 * sections as SEPARATE top-level <div> siblings. This script re-splits the flat
 * stream into sibling section divs so the dev server / DA renders one section per
 * block group.
 *
 * Section model (homepage): a new section begins at
 *   - a default-content heading/eyebrow run that introduces a block, OR
 *   - a standalone block that follows a previous section's block/metadata.
 * A trailing `.section-metadata` div stays in the section it closes.
 *
 * Usage: node tools/importer/sectionize.mjs content/index.plain.html
 */
import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from '/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/jsdom/lib/api.js';

const BLOCK_CLASSES = ['insights-form', 'logos', 'teaser', 'carousel', 'stats', 'quote'];

function isBlock(el) {
  return el.tagName === 'DIV'
    && BLOCK_CLASSES.some((c) => el.classList.contains(c));
}
function isSectionMeta(el) {
  return el.tagName === 'DIV' && el.classList.contains('section-metadata');
}
function isDefaultContent(el) {
  return !isBlock(el) && !isSectionMeta(el);
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node sectionize.mjs <plain.html path>');
  process.exit(1);
}

const html = readFileSync(file, 'utf-8');
const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);
const { document } = dom.window;
const wrapper = document.body.children[0];
if (!wrapper) process.exit(0);

const items = [...wrapper.children];
const sections = [];
let current = [];
let prevWasBlockOrMeta = false;

items.forEach((el) => {
  // Each block (including each teaser) starts its own full-width section.
  const startNew = current.length > 0 && (
    (isBlock(el) && prevWasBlockOrMeta)
    || (isDefaultContent(el) && prevWasBlockOrMeta)
  );
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
console.log(`Sectionized ${file} into ${sections.length} sections.`);
