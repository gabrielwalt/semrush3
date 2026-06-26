/* global WebImporter */
// Testimonials slider → Carousel (carousel-quotes) variant. Heading default
// content above; one row per testimonial: [quote, author + role]. `element` is
// the testimonials region (routed by the driver on heading text). Dedupe the
// slider's duplicated slides by quote text.
//
// The slider lazy-loads — only ~1 slide is in the DOM at bulk-import parse time
// (import-lazy-hydrated-content). Fall back to the full set (harvested live
// 2026-06-26) when fewer than 2 unique quotes are found in the markup.
const FALLBACK_TESTIMONIALS = [
  ["In the first 5 years of RockContent's existence Semrush has helped us to become Brazil's biggest digital marketing blog.", 'Vitor Peçanha', 'Co-Founder, Rock Content'],
  ['By using Semrush, my team saves a lot of time by working on the right content and in a more data-driven way. Everything we do here is backed up with data, and your tool is giving us more ammunition.', 'Idan Segal', 'Organic Growth Lead, Wix'],
  ['The most important thing I can have really is data. Data is my currency. I need to support initiatives, business cases - any tools that give me insight I find incredibly useful. Semrush is a very solid package that delivers exactly that.', 'Nick Wilsdon', 'Product Owner, Search, Vodafone Group'],
  ['Encouraged by our successes with Semrush software, I was asked to rollout Semrush to the rest of the university including all the faculties. With the help of Semrush, we empowered every single marketing team within the university to do what was done for the central sites.', 'Shefali Joshi', 'Marketing Optimization Analyst, Monash University'],
  ['The competition is really tough. It’s getting harder to compete for the top 3 positions when it comes to the most popular KWs. You have to really deep dive into keyword research to find those untapped opportunities. Semrush helps us get to the very bottom of it to identify new type of terms can really help to drive the demand.', 'James Gibbons', 'Growth Manager, Skyscanner'],
];

export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    wrapper.appendChild(h);
  }

  const rows = [['Carousel (carousel-quotes)']];
  const seen = new Set();
  const collected = [];
  element.querySelectorAll('blockquote, p').forEach((quoteEl) => {
    const text = quoteEl.textContent.replace(/\s+/g, ' ').trim();
    // testimonial quotes are long; skip short labels and dupes
    if (text.length < 40 || seen.has(text)) return;
    const slide = quoteEl.closest('[role="group"], li, div');
    let name = '';
    let role = '';
    if (slide) {
      const leaves = [...slide.querySelectorAll('*')]
        .filter((e) => !e.children.length && e.textContent.trim() && e.textContent.trim() !== text)
        .map((e) => e.textContent.trim());
      [name, role] = leaves;
    }
    seen.add(text);
    collected.push([text, name || '', role || '']);
  });

  // Lazy-loaded slider: only ~1 slide present at parse time → use the full set.
  const testimonials = collected.length >= 2 ? collected : FALLBACK_TESTIMONIALS;

  testimonials.forEach(([text, name, role]) => {
    const quoteCell = document.createElement('div');
    const bq = document.createElement('blockquote');
    bq.textContent = text;
    quoteCell.appendChild(bq);

    const authorCell = document.createElement('div');
    if (name) { const p = document.createElement('p'); const s = document.createElement('strong'); s.textContent = name; p.appendChild(s); authorCell.appendChild(p); }
    if (role) { const p = document.createElement('p'); p.textContent = role; authorCell.appendChild(p); }
    rows.push([quoteCell, authorCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}
