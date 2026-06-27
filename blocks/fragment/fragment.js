/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

// eslint-disable-next-line import/no-cycle
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
/**
 * Fetches a fragment's .plain.html, bridging the root-vs-/content path difference
 * between the local EMA preview (serves under /content/) and EDS (serves at the
 * site root). Tries the given path first; if it 404s, retries once with the
 * /content prefix toggled. Whichever returns 200 wins.
 * @param {string} path The fragment path (no extension), e.g. /footer or /content/footer
 * @returns {Response|null} The OK response, or null if neither path resolves
 */
async function fetchFragment(path) {
  const primary = await fetch(`${path}.plain.html`);
  if (primary.ok) return primary;
  const alt = path.startsWith('/content/')
    ? path.replace(/^\/content/, '')
    : `/content${path}`;
  const fallback = await fetch(`${alt}.plain.html`);
  return fallback.ok ? fallback : null;
}

export async function loadFragment(path) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    const resp = await fetchFragment(path);
    if (resp && resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) block.replaceChildren(...fragment.childNodes);
}
