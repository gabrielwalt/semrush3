/* global WebImporter */
// Pricing toolkit sidebar — links to sibling pricing pages (SEO Classic,
// AI Visibility, Local, …). Emitted as a Pricing Nav block: one row per link.
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const rows = [['Pricing Nav']];
  element.querySelectorAll('a[href]').forEach((a) => {
    const label = a.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;
    const cell = document.createElement('div');
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = abs(a.getAttribute('href'));
    link.textContent = label;
    p.appendChild(link);
    cell.appendChild(p);
    rows.push([cell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}
