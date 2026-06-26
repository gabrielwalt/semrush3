/* global WebImporter */
// Quote — customer testimonial. Eyebrow + heading above; Quote block with
// company logo, blockquote, author, and a highlight stat.
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
  if (h2) {
    const p = document.createElement('p');
    p.textContent = h2.textContent.trim();
    wrapper.appendChild(p);
  }
  if (h3) {
    const h = document.createElement('h2');
    h.textContent = h3.textContent.trim();
    wrapper.appendChild(h);
  }

  const figure = element.querySelector('figure') || element;
  const logo = figure.querySelector('img');
  const quote = figure.querySelector('blockquote');
  // Author name + role: the figure's aria-label ("Name Role"), else the
  // non-empty leaf text nodes that follow the blockquote.
  let author = figure.getAttribute('aria-label');
  if (!author && quote) {
    const after = [...figure.querySelectorAll('*')]
      .filter((el) => !el.children.length && el.textContent.trim()
        && !quote.contains(el) && el.tagName !== 'IMG')
      .map((el) => el.textContent.trim());
    author = after.slice(0, 2).join(', ');
  }

  const rows = [['Quote']];

  const quoteCell = document.createElement('div');
  if (logo) {
    const src = abs(logo.getAttribute('src'));
    if (src && src !== 'about:error') {
      const pic = document.createElement('picture');
      const el = document.createElement('img');
      el.src = src;
      el.alt = logo.getAttribute('alt') || '';
      pic.appendChild(el);
      quoteCell.appendChild(pic);
    }
  }
  if (quote) {
    const bq = document.createElement('blockquote');
    bq.textContent = quote.textContent.trim();
    quoteCell.appendChild(bq);
  }
  if (author) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = author.trim();
    p.appendChild(strong);
    quoteCell.appendChild(p);
  }
  rows.push([quoteCell]);

  const statNumber = element.querySelector('.mp-client-testimonials__stats-block-number');
  const statText = element.querySelector('.mp-client-testimonials__stats-block-text');
  if (statNumber || statText) {
    const statCell = document.createElement('div');
    if (statNumber) {
      const p = document.createElement('p');
      p.textContent = statNumber.textContent.trim();
      statCell.appendChild(p);
    }
    if (statText) {
      const p = document.createElement('p');
      p.textContent = statText.textContent.trim();
      statCell.appendChild(p);
    }
    rows.push([statCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
