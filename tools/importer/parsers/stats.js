/* global WebImporter */
// Stats — eyebrow + heading + "Learn more" CTA above; Stats block, one row per metric.
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
  const cta = element.querySelector('a[href]');
  if (cta) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    const a = document.createElement('a');
    a.href = abs(cta.getAttribute('href'));
    a.textContent = cta.textContent.trim();
    em.appendChild(a);
    p.appendChild(em);
    wrapper.appendChild(p);
  }

  const rows = [['Stats']];
  element.querySelectorAll('li').forEach((li) => {
    const countEl = li.querySelector('.mp-stats__item-count-wrapper');
    const paras = li.querySelectorAll('p');
    const cell = document.createElement('div');
    if (countEl) {
      const num = document.createElement('p');
      num.textContent = countEl.textContent.replace(/\s+/g, ' ').trim();
      cell.appendChild(num);
    }
    // first <p> = label, last <p> (if different) = description
    if (paras.length) {
      const label = document.createElement('p');
      label.textContent = paras[0].textContent.trim();
      cell.appendChild(label);
      if (paras.length > 1) {
        const desc = document.createElement('p');
        desc.textContent = paras[paras.length - 1].textContent.trim();
        cell.appendChild(desc);
      }
    }
    rows.push([cell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
