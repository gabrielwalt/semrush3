// Pricing toolkit sidebar — one authored row per link. Marks the link whose
// href matches the current pricing page as active (the source highlights the
// toolkit you're viewing).
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'pricing-nav-list';
  nav.setAttribute('aria-label', 'Pricing toolkits');

  const here = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  [...block.children].forEach((row) => {
    const a = row.querySelector('a');
    if (!a) return;
    let path;
    try { path = new URL(a.href).pathname.replace(/\/$/, ''); } catch { path = ''; }
    if (path && here.endsWith(path)) a.setAttribute('aria-current', 'page');
    nav.append(a);
  });

  block.replaceChildren(nav);
}
