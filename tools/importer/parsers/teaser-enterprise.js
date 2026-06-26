/* global WebImporter */
// Teaser (teaser-dark) — "Enterprise" promo card. On the source this sits on a
// dark panel (black bg + image) with white text and a white-outline CTA, so it
// gets the dark variant. Title + body + CTA "Book a demo".
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2, h3');
  const body = element.querySelector('p');
  const link = element.querySelector('a[href]');
  const img = element.querySelector('img');

  const cell = document.createElement('div');
  if (img) {
    const src = abs(img.getAttribute('src'));
    if (src && src !== 'about:error') {
      const pic = document.createElement('picture');
      const el = document.createElement('img');
      el.src = src;
      el.alt = img.getAttribute('alt') || '';
      pic.appendChild(el);
      cell.appendChild(pic);
    }
  }
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    cell.appendChild(h);
  }
  if (body) {
    const p = document.createElement('p');
    p.textContent = body.textContent.trim();
    cell.appendChild(p);
  }
  if (link) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    const a = document.createElement('a');
    a.href = abs(link.getAttribute('href'));
    a.textContent = link.textContent.trim();
    em.appendChild(a);
    p.appendChild(em);
    cell.appendChild(p);
  }
  const table = WebImporter.DOMUtils.createTable([['Teaser (teaser-dark)'], [cell]], document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
