/* global WebImporter */
// Resources — Carousel (carousel-articles) variant. Eyebrow + heading above;
// one row per article (optional image + title link + description + tags).
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const h2 = element.querySelector('h2');
  const h3 = element.querySelector('h3');
  const eyebrow = h2 ? h2.textContent.replace(/\s*\(\s*\d+\s*\)\s*$/, '').trim() : 'Resources';
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow;
    wrapper.appendChild(p);
  }
  if (h3) {
    const h = document.createElement('h2');
    h.textContent = h3.textContent.trim();
    wrapper.appendChild(h);
  }

  const rows = [['Carousel (carousel-articles)']];
  element.querySelectorAll('article').forEach((article) => {
    const img = article.querySelector('img');
    const titleLink = article.querySelector('h3 a, a[href]');
    const desc = article.querySelector('p');
    const tags = article.querySelectorAll('[class*="tag"]');

    const imgCell = document.createElement('div');
    if (img) {
      const src = abs(img.getAttribute('src'));
      if (src && src !== 'about:error') {
        const pic = document.createElement('picture');
        const el = document.createElement('img');
        el.src = src;
        el.alt = img.getAttribute('alt') || '';
        pic.appendChild(el);
        imgCell.appendChild(pic);
      }
    }
    const textCell = document.createElement('div');
    if (titleLink) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = abs(titleLink.getAttribute('href'));
      a.textContent = titleLink.textContent.trim();
      h.appendChild(a);
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }
    const tagText = [...tags].map((t) => t.textContent.trim()).filter(Boolean).join(' · ');
    if (tagText) {
      const p = document.createElement('p');
      p.textContent = tagText;
      textCell.appendChild(p);
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
