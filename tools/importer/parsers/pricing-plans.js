/* global WebImporter */
// Pricing plans — the page title + billing toggle + 3 plan cards.
// `element` is the page h1. Emits: default-content h1, then a Pricing Plans
// block whose FIRST row is the billing-period toggle (clean labels the block JS
// turns into a control — never raw [x]/[ ] checkbox text), then one row per
// plan: [name, tagline, price, CTA, features].
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const h1 = element;
  const scope = h1.closest('main') || document;
  const planList = [...scope.querySelectorAll('ul')]
    .find((ul) => ul.querySelector(':scope > li h2'));
  if (!planList) return null;

  // Consume the whole title+toggle+plans block: the common ancestor of h1 + planList.
  let container = planList;
  while (container.parentElement && !container.parentElement.contains(h1)) {
    container = container.parentElement;
  }
  container = container.parentElement || planList.parentElement;

  const wrapper = document.createElement('div');

  // Default content: the page title (exactly once).
  const heading = document.createElement('h1');
  heading.textContent = h1.textContent.replace(/\s+/g, ' ').trim();
  wrapper.appendChild(heading);

  const rows = [['Pricing Plans']];

  // Billing toggle → clean labels as a BULLETED LIST in one cell. The block JS
  // turns each list item into a toggle option. A list is the only multi-value
  // shape that survives the import's markdown roundtrip intact (stacked <p> and
  // multi-column rows both collapse to one glued string). Keep only the two real
  // periods (Monthly/Annually); drop [x]/[ ] glyphs and the decorative "save …%".
  const toggleGroup = [...scope.querySelectorAll('[role="group"], [role="radiogroup"]')]
    .find((g) => /periodicity|monthly|annual/i.test(g.textContent));
  const seen = new Set();
  let options = [];
  if (toggleGroup) {
    options = [...toggleGroup.querySelectorAll('label, [role="radio"]')]
      .map((l) => (l.getAttribute('aria-label') || l.textContent).replace(/[[\]x☐☑✓]/g, '').replace(/\s+/g, ' ').trim())
      .map((label) => label.replace(/\s*save up to[^,]*$/i, '').trim())
      .filter((label) => /^(monthly|annually|annual)$/i.test(label))
      .filter((label) => {
        const k = label.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }
  // Lazy-hydration fallback: the periodicity group is client-rendered and its
  // labels vary at import parse time. The two periods are stable, so default to
  // them when extraction yields fewer than 2 (import-lazy-hydrated-content).
  if (options.length < 2) options = ['Monthly', 'Annually'];
  {
    const cell = document.createElement('div');
    const ul = document.createElement('ul');
    options.forEach((label) => { const li = document.createElement('li'); li.textContent = label; ul.appendChild(li); });
    cell.appendChild(ul);
    rows.push([cell]);
  }

  planList.querySelectorAll(':scope > li').forEach((li) => {
    const name = li.querySelector('h2');
    const tagline = li.querySelector('h2 + p, p');
    const liText = li.textContent.replace(/\s+/g, ' ');
    const priceMatch = liText.match(/\$[\d,]+(?:\.\d+)?\s*\/\s*mo/i);
    const oldMatch = liText.match(/\$[\d,]+(?:\.\d+)?(?!\s*\/)/g); // bare prices (old/struck)
    const cta = li.querySelector('a[href]');
    const features = [...li.querySelectorAll('ul li')]
      .map((f) => f.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);

    const cell = document.createElement('div');
    if (name) { const h = document.createElement('h3'); h.textContent = name.textContent.trim(); cell.appendChild(h); }
    if (tagline && tagline !== name) { const p = document.createElement('p'); p.textContent = tagline.textContent.trim(); cell.appendChild(p); }
    if (priceMatch) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = priceMatch[0].replace(/\s+/g, '');
      p.appendChild(strong);
      // struck "was" price = the last bare $ value that isn't the /mo price
      const struck = oldMatch && oldMatch[oldMatch.length - 1];
      if (struck && !priceMatch[0].includes(struck)) {
        const del = document.createElement('del');
        del.textContent = ` ${struck}`;
        p.appendChild(del);
      }
      cell.appendChild(p);
      const billed = /billed annually/i.test(liText);
      if (billed) { const bp = document.createElement('p'); bp.textContent = 'billed annually'; cell.appendChild(bp); }
    }
    if (cta) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = abs(cta.getAttribute('href'));
      a.textContent = cta.textContent.trim();
      strong.appendChild(a); p.appendChild(strong); cell.appendChild(p);
    }
    if (features.length) {
      const ul = document.createElement('ul');
      features.forEach((f) => { const fi = document.createElement('li'); fi.textContent = f; ul.appendChild(fi); });
      cell.appendChild(ul);
    }
    rows.push([cell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  container.replaceWith(wrapper);
  return wrapper;
}
