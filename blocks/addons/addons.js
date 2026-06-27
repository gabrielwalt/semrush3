// Add-ons — one authored row per card [h3 title, price paragraph, feature list].
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'addons-grid';

  [...block.children].forEach((row) => {
    const card = row.firstElementChild || row;
    card.className = 'addons-card';
    const price = [...card.querySelectorAll('p')].find((p) => /\$|starting at/i.test(p.textContent));
    if (price) price.classList.add('addons-price');
    const list = card.querySelector('ul');
    if (list) list.classList.add('addons-features');
    grid.append(card);
  });

  block.replaceChildren(grid);
}
