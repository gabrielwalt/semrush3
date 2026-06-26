/* global WebImporter */
// Teaser — "Semrush One" promo card. Two cells: text (heading + body + outline
// CTA "Try for free") and a media cell (the product visual / video poster).
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

  // Text cell
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
    // Source CTA is an outline button → secondary (<em>).
    const p = document.createElement('p');
    const em = document.createElement('em');
    const a = document.createElement('a');
    a.href = abs(link.getAttribute('href'));
    a.textContent = link.textContent.trim();
    em.appendChild(a);
    p.appendChild(em);
    textCell.appendChild(p);
  }

  // Media cell — autoplaying product video. Per video-in-eds: emit a LINK with a
  // relative href (EDS proxies same-origin) and the full URL as textContent; the
  // block JS builds the <video>. Include the poster image as a fallback frame.
  const mediaCell = document.createElement('div');
  const videoUrl = 'https://www.semrush.com/static/videos/semrush_one.mp4';
  const vp = document.createElement('p');
  const va = document.createElement('a');
  va.href = '/static/videos/semrush_one-mp4'; // relative slug → same-origin proxy
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

  const table = WebImporter.DOMUtils.createTable([['Teaser'], [textCell, mediaCell]], document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
}
