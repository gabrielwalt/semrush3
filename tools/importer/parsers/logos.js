/* global WebImporter */
// Logos — single row of customer logos. The source duplicates the marquee
// group for the scrolling animation; emit only the first group.
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const firstGroup = element.querySelector('.mp-logo-marquee__group') || element;
  const cell = document.createElement('div');
  firstGroup.querySelectorAll('img').forEach((img) => {
    const src = abs(img.getAttribute('src'));
    if (!src || src === 'about:error') return;
    const pic = document.createElement('picture');
    const el = document.createElement('img');
    el.src = src;
    el.alt = img.getAttribute('alt') || '';
    pic.appendChild(el);
    cell.appendChild(pic);
  });
  const table = WebImporter.DOMUtils.createTable([['Logos'], [cell]], document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
