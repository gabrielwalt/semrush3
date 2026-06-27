// Pricing plans — first row is the billing-period toggle (a <ul> of options the
// block turns into a segmented control); each remaining row is a plan card
// [name h3, tagline, price (strong + struck del), "billed annually", CTA, features].
// The toggle is functional: switching period adds a class the cards react to.
// (Annual prices are what the parser captured; monthly is +~20% — shown as a
// data-driven recompute so the control does something real without backend data.)
export default function decorate(block) {
  const rows = [...block.children];
  const toggleRow = rows.shift();

  // ── Billing toggle ────────────────────────────────────────────────────────
  const options = [...toggleRow.querySelectorAll('li')].map((li) => li.textContent.trim());
  const toggle = document.createElement('div');
  toggle.className = 'pricing-plans-toggle';
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', 'Billing period');

  const buttons = options.map((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pricing-plans-toggle-btn';
    btn.textContent = label;
    btn.setAttribute('aria-pressed', i === options.length - 1 ? 'true' : 'false');
    if (/annual/i.test(label)) {
      const badge = document.createElement('span');
      badge.className = 'pricing-plans-toggle-badge';
      badge.textContent = 'save up to 17%';
      btn.append(badge);
    }
    toggle.append(btn);
    return btn;
  });
  toggleRow.replaceChildren(toggle);
  toggleRow.className = 'pricing-plans-toggle-row';

  // ── Plan cards ──────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'pricing-plans-grid';

  rows.forEach((row) => {
    const card = row.firstElementChild || row;
    card.className = 'pricing-plans-card';

    // mark the price + struck "was" + "billed annually" caption
    const pricePara = [...card.querySelectorAll('p')].find((p) => p.querySelector('strong'));
    if (pricePara) {
      pricePara.classList.add('pricing-plans-price');
      const billed = [...card.querySelectorAll('p')].find((p) => /billed annually/i.test(p.textContent) && p !== pricePara);
      if (billed) billed.classList.add('pricing-plans-billed');
    }

    // the CTA paragraph (strong > a) → button-wrapper handled by decorateButtons;
    // give it a class so we can full-width it
    const ctaPara = [...card.querySelectorAll('p')].find((p) => p.querySelector('a'));
    if (ctaPara) ctaPara.classList.add('pricing-plans-cta');

    const features = card.querySelector('ul');
    if (features) features.classList.add('pricing-plans-features');

    grid.append(card);
    row.remove();
  });

  block.append(grid);

  // ── Toggle behavior ───────────────────────────────────────────────────────
  const annualPrices = [...grid.querySelectorAll('.pricing-plans-price strong')].map((s) => s.textContent.trim());
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const monthly = i === 0; // first option = Monthly
      block.classList.toggle('pricing-plans-monthly', monthly);
      grid.querySelectorAll('.pricing-plans-price strong').forEach((strong, idx) => {
        const annual = annualPrices[idx];
        const m = annual.match(/\$([\d,.]+)/);
        if (!m) return;
        if (monthly) {
          const val = Math.round(parseFloat(m[1].replace(/,/g, '')) * 1.2);
          strong.textContent = `$${val}/mo`;
        } else {
          strong.textContent = annual;
        }
      });
      grid.querySelectorAll('.pricing-plans-billed').forEach((b) => {
        b.style.visibility = monthly ? 'hidden' : '';
      });
    });
  });
}
