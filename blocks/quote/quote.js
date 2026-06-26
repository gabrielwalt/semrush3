// Quote — customer testimonial. Row 1 = quote cell (logo + blockquote + author),
// row 2 = highlight stat cell (+number + label). Render as a dark quote card
// beside a light stat card.
export default function decorate(block) {
  const rows = [...block.children];
  const quoteCell = rows[0]?.querySelector(':scope > div') || rows[0];
  const statCell = rows[1]?.querySelector(':scope > div') || rows[1];

  const wrapper = document.createElement('div');
  wrapper.className = 'quote-layout';

  if (quoteCell) {
    const card = document.createElement('div');
    card.className = 'quote-card';
    while (quoteCell.firstChild) card.append(quoteCell.firstChild);
    // tag the author paragraph (the one with <strong>) for styling
    card.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('strong')) p.className = 'quote-author';
      else if (p.querySelector('picture, img')) p.className = 'quote-logo';
    });
    wrapper.append(card);
  }

  if (statCell) {
    const card = document.createElement('div');
    card.className = 'quote-stat';
    const paras = [...statCell.querySelectorAll('p')];
    if (paras[0]) paras[0].className = 'quote-stat-number';
    if (paras[1]) paras[1].className = 'quote-stat-label';
    while (statCell.firstChild) card.append(statCell.firstChild);
    wrapper.append(card);
  }

  block.replaceChildren(wrapper);
}
