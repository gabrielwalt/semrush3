/* global WebImporter */
// Homepage hero SECTION parser (not an EDS "Hero" block).
// The Semrush hero is centered default content (h1 + subtitle) over a pastel
// gradient, plus an interactive search tool. We emit:
//   - default content: h1 + subtitle paragraph
//   - an "Insights Form" block (interactive placeholder) whose only author-managed
//     content is the field placeholder + button label; results are runtime data.
export default function parse(element, { document }) {
  const h1 = element.querySelector('.mp-hero__title, h1');
  if (!h1) return;
  const subtitle = element.querySelector('.mp-hero__subtitle');
  const combo = element.querySelector('input, [role="combobox"], .mp-search__input');
  // The submit button — NOT the country-filter button (aria-label "Filter by country", text "us").
  const buttons = [...element.querySelectorAll('button')]
    .filter((b) => !/country/i.test(b.getAttribute('aria-label') || ''));
  const submit = element.querySelector('button[type="submit"], .mp-search__button')
    || buttons[buttons.length - 1];

  const wrapper = document.createElement('div');

  const heading = document.createElement('h1');
  heading.textContent = h1.textContent.trim();
  wrapper.appendChild(heading);

  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent.trim();
    wrapper.appendChild(p);
  }

  const placeholder = (combo && (combo.getAttribute('placeholder') || combo.getAttribute('aria-label'))) || 'Enter your website';
  const buttonLabel = (submit && submit.textContent.trim()) || 'Get insights';
  const formCell = document.createElement('div');
  const p1 = document.createElement('p');
  p1.textContent = placeholder.trim();
  formCell.appendChild(p1);
  const p2 = document.createElement('p');
  p2.textContent = buttonLabel.trim();
  formCell.appendChild(p2);
  const formTable = WebImporter.DOMUtils.createTable([['Insights Form'], [formCell]], document);
  wrapper.appendChild(formTable);

  // Section Metadata — the hero section style (centered content + pastel gradient).
  // Must be the LAST element in the section.
  const sectionMeta = WebImporter.DOMUtils.createTable([['Section Metadata'], ['Style', 'hero']], document);
  wrapper.appendChild(sectionMeta);

  // The logo marquee is nested INSIDE .mp-hero on the source; move it out as a
  // sibling so it survives this replaceWith and the logos parser can process it.
  const marquee = element.querySelector('.mp-logo-marquee');
  if (marquee) element.after(marquee);

  element.replaceWith(wrapper);
}
