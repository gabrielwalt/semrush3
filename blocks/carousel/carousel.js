// Carousel — horizontal scroll-snap slider with prev/next arrows. Each authored
// row is [imageCell, textCell] (text = eyebrow h3 + subtitle p). Cards bleed past
// the right viewport edge; arrows live in the section header.
export default function decorate(block) {
  const track = document.createElement('div');
  track.className = 'carousel-track';

  [...block.children].forEach((row) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    const cells = [...row.children];
    const media = cells.find((c) => c.querySelector('picture, img'));
    const body = cells.find((c) => c !== media);
    // Body (eyebrow + headline) on top, media below — matches the source card.
    if (body) { body.className = 'carousel-card-body'; card.append(body); }
    if (media) { media.className = 'carousel-card-media'; card.append(media); }
    track.append(card);
  });

  block.replaceChildren(track);

  // Nav arrows — placed in the section's default-content-wrapper (header area)
  // so they bottom-align with the heading, outside the scrollable track.
  const section = block.closest('.section');
  const header = section?.querySelector('.default-content-wrapper');
  if (header) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'carousel-nav-btn carousel-nav-prev';
    prev.setAttribute('aria-label', 'Previous slide');
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'carousel-nav-btn carousel-nav-next';
    next.setAttribute('aria-label', 'Next slide');
    nav.append(prev, next);
    header.append(nav);

    const scrollByCard = (dir) => {
      const card = track.querySelector('.carousel-card');
      const amount = card ? card.getBoundingClientRect().width + 12 : 300;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    prev.addEventListener('click', () => scrollByCard(-1));
    next.addEventListener('click', () => scrollByCard(1));

    const updateDisabled = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    track.addEventListener('scroll', updateDisabled, { passive: true });
    updateDisabled();
  }
}
