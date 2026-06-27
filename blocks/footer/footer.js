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
  footer.className = 'footer';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // loadFragment's decoration strips the authored inner-div classes, so the four
  // sections arrive as plain default content. Re-tag each by its content
  // signature (not blind order) so footer.css can lay them out:
  //  - cta: has a heading (the "Get started…" band)
  //  - social: has the copyright/social row (an Adobe + © line)
  //  - legal: only legal links (Privacy / Terms) — small link list, no heading, no copyright
  //  - columns: the link-column grid (multiple lists) — everything else
  [...footer.children].forEach((section) => {
    const text = section.textContent;
    if (section.querySelector('h1, h2, h3')) {
      section.classList.add('footer-cta');
    } else if (/©|all rights reserved/i.test(text)) {
      section.classList.add('footer-social');
    } else if (section.querySelectorAll('ul').length === 1 && /privacy|terms/i.test(text)) {
      section.classList.add('footer-legal');
    } else {
      section.classList.add('footer-columns');
    }
  });

  block.append(footer);
}
