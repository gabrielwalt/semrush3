/* eslint-disable */
/* global WebImporter */

// Pricing page driver. The pricing page uses build-hashed CSS-module classes, so
// sections are routed by structural markers + heading text, not class names.
// Per-block parsers live in ./parsers/*.js (validated individually).

import pricingNavParser from './parsers/pricing-nav.js';
import pricingPlansParser from './parsers/pricing-plans.js';
import comparisonTableParser from './parsers/comparison-table.js';
import addonsParser from './parsers/addons.js';
import accordionParser from './parsers/accordion.js';
import quotesParser from './parsers/quotes.js';

function abs(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://www.semrush.com${url}`;
  return url;
}

// "Playing big? Request an Enterprise demo" → reuse the frozen Teaser block.
function enterpriseTeaserParser(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2');
  const cta = element.querySelector('a[href], button');
  const bullets = [...element.querySelectorAll('li')].map((l) => l.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);

  const cell = document.createElement('div');
  if (heading) { const h = document.createElement('h2'); h.textContent = heading.textContent.trim(); cell.appendChild(h); }
  if (bullets.length) {
    const ul = document.createElement('ul');
    bullets.forEach((b) => { const li = document.createElement('li'); li.textContent = b; ul.appendChild(li); });
    cell.appendChild(ul);
  }
  if (cta) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = abs(cta.getAttribute('href') || '/pricing/enterprise/');
    a.textContent = cta.textContent.trim() || 'Request demo';
    strong.appendChild(a); p.appendChild(strong); cell.appendChild(p);
  }
  const table = WebImporter.DOMUtils.createTable([['Teaser (teaser-dark)'], [cell]], document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}

// CLEANUP — strip chrome + non-content.
function cleanup(hookName, element) {
  if (hookName !== 'beforeTransform') return;
  element.querySelectorAll('script, style, noscript, iframe, link[rel="stylesheet"]').forEach((el) => el.remove());
  element.querySelectorAll('[class*="cookie"], [class*="consent"], [class*="ch2-"]').forEach((el) => el.remove());
  element.querySelectorAll('header, footer, nav:not([aria-label="sidebar navigation"]), [class*="srf-header"], [class*="srf-footer"], [class*="srf-layout__footer"], [class*="srf-layout__notification"], .srf_top_banner, [class*="announcement"]').forEach((el) => el.remove());
  element.querySelectorAll('[aria-hidden="true"], [class*="outdated"], [class*="skip-to"]').forEach((el) => el.remove());
  element.querySelectorAll('button[class*="swiper"], .swiper-button-next, .swiper-button-prev, .swiper-pagination').forEach((el) => el.remove());
  element.querySelectorAll('img[src*="analytics"], img[src*="pixel"]').forEach((el) => (el.closest('p') || el).remove());
}

// Find a top-level region by a heading-text predicate.
function regionByHeading(main, test) {
  return [...main.querySelectorAll('[role="region"], section')]
    .find((r) => {
      const h = r.querySelector('h2, h1');
      return h && test(h.textContent.trim());
    });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    cleanup('beforeTransform', main);

    // Resolve ALL source elements UP FRONT, before any parser runs. The
    // pricing-plans parser replaces a large common ancestor (title+toggle+plans)
    // that also contains the grid and downstream regions; resolving first means a
    // later parser's source element being detached from the live DOM is harmless
    // — each parser still builds and returns its wrapper from the held reference.
    const sources = [
      [main.querySelector('[aria-label="sidebar navigation"]'), pricingNavParser],
      [main.querySelector('h1'), pricingPlansParser],
      [main.querySelector('[role="grid"]'), comparisonTableParser],
      [regionByHeading(main, (t) => /add-?ons/i.test(t)), addonsParser],
      [regionByHeading(main, (t) => /Playing big|Enterprise demo/i.test(t)), enterpriseTeaserParser],
      [regionByHeading(main, (t) => /^FAQ$/i.test(t)), accordionParser],
      [regionByHeading(main, (t) => /Testimonials/i.test(t)), quotesParser],
    ];

    // Each parser builds a block wrapper and returns it. We collect ONLY those
    // wrappers and rebuild `main` from them, so any un-parsed source content (the
    // duplicate "Compare Plans" flat list, the original duplicate h1, stray toggle
    // glyph text) is discarded by construction.
    const wrappers = [];
    sources.forEach(([el, parser]) => { if (el) { const w = parser(el, { document }); if (w) wrappers.push(w); } });

    // Rebuild main from only the parsed block wrappers (flat sequence; the
    // sectionizer splits it into EDS sections afterwards).
    main.replaceChildren(...wrappers);

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/pricing',
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: 'pricing' },
    }];
  },
};
