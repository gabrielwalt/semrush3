/* global WebImporter */
// Solutions — Carousel block. Eyebrow ("Solutions") + section heading as default
// content above; one row per slide (image + title + subtitle).
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const h2 = element.querySelector('h2');
  const h3 = element.querySelector('h3'); // section sub-heading "Get seen…"
  const eyebrow = h2 ? h2.textContent.replace(/\s*\(\s*\d+\s*\)\s*$/, '').trim() : 'Solutions';
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

  const rows = [['Carousel']];
  element.querySelectorAll('.mp-toolkit').forEach((slide) => {
    const title = slide.querySelector('.mp-toolkit__title, h3');
    const subtitle = slide.querySelector('.mp-toolkit__subtitle, h4');
    const img = slide.querySelector('img');

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
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      textCell.appendChild(h);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent.trim();
      textCell.appendChild(p);
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
