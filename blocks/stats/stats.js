// Stats — each authored row is one stat: [number, label, description] paragraphs.
// Render as a dark card (arrow panel + big number + label) with the description
// alongside it.
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'stats-list';

  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const paras = [...cell.querySelectorAll('p')];
    const [numberP, labelP, descP] = paras;

    const li = document.createElement('li');
    li.className = 'stats-item';

    const card = document.createElement('div');
    card.className = 'stats-card';
    const arrow = document.createElement('span');
    arrow.className = 'stats-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    const figures = document.createElement('div');
    figures.className = 'stats-figures';
    if (numberP) {
      const n = document.createElement('span');
      n.className = 'stats-number';
      n.textContent = numberP.textContent.trim();
      figures.append(n);
    }
    if (labelP) {
      const l = document.createElement('span');
      l.className = 'stats-label';
      l.textContent = labelP.textContent.trim();
      figures.append(l);
    }
    card.append(arrow, figures);
    li.append(card);

    if (descP) {
      const d = document.createElement('p');
      d.className = 'stats-desc';
      d.textContent = descP.textContent.trim();
      li.append(d);
    }
    list.append(li);
  });

  block.replaceChildren(list);
}
