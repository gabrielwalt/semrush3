/* global WebImporter */
// FAQ accordion — 2-column rows [Title (question), Content (answer)] under the
// 'Accordion' block name (matches the EDS accordion convention). Heading goes
// above as default content. `element` is the FAQ region (routed by the driver).
export default function parse(element, { document }) {
  const wrapper = document.createElement('div');
  const heading = element.querySelector('h2');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    wrapper.appendChild(h);
  }

  const rows = [['Accordion']];
  element.querySelectorAll('h3').forEach((q) => {
    const question = q.textContent.replace(/\s+/g, ' ').trim();
    if (!question) return;
    // answer: the nearest following region/panel sibling, else the panel
    // labelled by the question text.
    let answer = '';
    const headingHost = q.closest('button') ? q.closest('button').parentElement : q.parentElement;
    const sib = headingHost ? headingHost.nextElementSibling : null;
    if (sib && (sib.getAttribute('role') === 'region' || /region|panel|answer|content/i.test(sib.className))) {
      answer = sib.textContent.replace(/\s+/g, ' ').trim();
    } else {
      const region = q.closest('[role="region"]');
      const panel = region ? region.querySelector(`[aria-label="${question}"]`) : null;
      if (panel) answer = panel.textContent.replace(/\s+/g, ' ').trim();
    }

    const titleCell = document.createElement('div');
    titleCell.textContent = question;
    const contentCell = document.createElement('div');
    if (answer) { const p = document.createElement('p'); p.textContent = answer; contentCell.appendChild(p); }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}
