/* global WebImporter */
// Comparison table — the "Compare Plans" feature matrix (role="grid").
// Emitted as a Comparison Table block: header row (feature, Pro, Guru, Business)
// then one row per feature with its per-plan values.
export default function parse(element, { document }) {
  const grid = element;
  const wrapper = document.createElement('div');
  const rows = [['Comparison Table']];

  grid.querySelectorAll('[role="row"]').forEach((row) => {
    const cells = [...row.querySelectorAll('[role="columnheader"], [role="gridcell"]')];
    if (!cells.length) return;
    const cellDivs = cells.map((c) => {
      const d = document.createElement('div');
      // collapse to the meaningful label/value (strip tooltips/icons)
      d.textContent = c.textContent.replace(/\s+/g, ' ').trim();
      return d;
    });
    rows.push(cellDivs);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  wrapper.appendChild(table);
  element.replaceWith(wrapper);
  return wrapper;
}
