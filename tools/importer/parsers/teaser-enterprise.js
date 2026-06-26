/* global WebImporter */
// Teaser (teaser-dark) — "Enterprise" promo card. Two cells: text (heading +
// body + white-outline CTA "Book a demo") and a media cell (product visual).
// Dark variant: black panel + enterprise background image, white text.
function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2, h3');
  const body = element.querySelector('p');
  const link = element.querySelector('a[href]');
  const video = element.querySelector('video');
  const img = element.querySelector('img');
  const poster = (video && video.getAttribute('poster')) || (img && img.getAttribute('src'));

  const textCell = document.createElement('div');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.appendChild(h);
  }
  if (body) {
    const p = document.createElement('p');
    p.textContent = body.textContent.trim();
    textCell.appendChild(p);
  }
  if (link) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    const a = document.createElement('a');
    a.href = abs(link.getAttribute('href'));
    a.textContent = link.textContent.trim();
    em.appendChild(a);
    p.appendChild(em);
    textCell.appendChild(p);
  }

  // Media cell — autoplaying product video (link + relative href) + poster fallback.
  const mediaCell = document.createElement('div');
  const videoUrl = 'https://www.semrush.com/static/videos/enterprise_video.mp4';
  const vp = document.createElement('p');
  const va = document.createElement('a');
  va.href = '/static/videos/enterprise_video-mp4'; // relative slug → same-origin proxy
  va.textContent = videoUrl;
  vp.appendChild(va);
  mediaCell.appendChild(vp);
  const src = abs(poster);
  if (src && src !== 'about:error') {
    const pp = document.createElement('p');
    const pic = document.createElement('picture');
    const el = document.createElement('img');
    el.src = src;
    el.alt = heading ? heading.textContent.trim() : '';
    pic.appendChild(el);
    pp.appendChild(pic);
    mediaCell.appendChild(pp);
  }

  const table = WebImporter.DOMUtils.createTable([['Teaser (teaser-dark)'], [textCell, mediaCell]], document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
