/* global WebImporter */
// Add-ons — "Improve your plan with add-ons": eyebrow/heading default content
// above; an Addons block with one row per add-on card (title, price, bullets).
// `element` is the add-ons region (matched by heading text in the driver).
export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    wrapper.appendChild(h);
  }

  const rows = [['Addons']];
  element.querySelectorAll(':scope > ul > li, :scope ul > li').forEach((li) => {
    // only top-level add-on cards (those with their own h3)
    const title = li.querySelector('h3');
    if (!title) return;
    const price = [...li.querySelectorAll('*')]
      .find((e) => !e.children.length && /\$\d|Starting at/.test(e.textContent));
    const bullets = [...li.querySelectorAll('ul li')].map((b) => b.textContent.replace(/^[•\s]+/, '').trim()).filter(Boolean);

    const cell = document.createElement('div');
    const h = document.createElement('h3'); h.textContent = title.textContent.trim(); cell.appendChild(h);
    if (price) { const p = document.createElement('p'); p.textContent = price.textContent.trim(); cell.appendChild(p); }
    if (bullets.length) {
      const ul = document.createElement('ul');
      bullets.forEach((b) => { const bi = document.createElement('li'); bi.textContent = b; ul.appendChild(bi); });
      cell.appendChild(ul);
    }
    rows.push([cell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}
