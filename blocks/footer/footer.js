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

  // The link-columns section can arrive flattened: one wrapper holding a flat
  // sequence of <p><strong>heading</strong></p> + <ul> pairs (root /footer) OR
  // already-grouped column divs (/content/footer). footer.css's grid needs each
  // column as a direct child, so rebuild the grouping from the heading→list runs
  // whenever the section isn't already split into multiple column divs.
  const columns = footer.querySelector('.footer-columns');
  if (columns) {
    const host = columns.querySelector('.default-content-wrapper') || columns;
    const headingsAtTop = [...host.children].filter((c) => c.tagName === 'P' && c.querySelector('strong')).length;
    // footer.css lays out 4 columns; the flat source has 5 heading groups
    // (Support + Community are separate). Cap at 4 so Community stacks UNDER
    // Support in the last column (the rich /content layout), not as a 5th column.
    const MAX_COLUMNS = 4;
    if (headingsAtTop > 1) {
      const colDivs = [];
      let current = null;
      [...host.children].forEach((node) => {
        const isHeading = node.tagName === 'P' && node.querySelector('strong');
        if (isHeading && colDivs.length < MAX_COLUMNS) {
          current = document.createElement('div');
          current.className = 'footer-column';
          colDivs.push(current);
        }
        // overflow headings/lists fall through into the last column (current)
        if (current) current.append(node);
      });
      // Column divs must be DIRECT children of .footer-columns (the grid container),
      // not nested in .default-content-wrapper, or the grid sees one item.
      columns.replaceChildren(...colDivs);
    }
  }

  block.append(footer);
}
