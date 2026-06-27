import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // The footer content is authored as separate top-level sections, each tagged
  // via Section Metadata (footer-cta / footer-column / footer-social / footer-legal)
  // so the classes survive the DA/EDS publish flatten. The only layout assembly
  // left is wrapping the consecutive footer-column sections into one grid — driven
  // entirely by that class, no content heuristics.
  const columnSections = footer.querySelectorAll('.footer-column');
  if (columnSections.length) {
    const grid = document.createElement('div');
    grid.className = 'footer-columns';
    columnSections[0].before(grid);
    columnSections.forEach((section) => grid.append(section));
  }

  block.append(footer);
}
