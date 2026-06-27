// Comparison table — first row is the header [feature-label, Pro, Guru, Business];
// each following row is a feature with its per-plan values. Rows past the first
// few collapse behind an "Expand details" toggle (matches the source). A single
// cell in a row = a section subheading spanning all columns.
const VISIBLE_ROWS = 5;

export default function decorate(block) {
  const rows = [...block.children];
  const header = rows.shift();
  header.className = 'comparison-table-head';
  [...header.children].forEach((c, i) => { c.className = i === 0 ? 'comparison-table-feature' : 'comparison-table-value'; });

  rows.forEach((row, idx) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      row.className = 'comparison-table-subhead';
      cells[0].setAttribute('colspan', '4');
    } else {
      row.className = 'comparison-table-row';
      cells.forEach((c, i) => {
        c.className = i === 0 ? 'comparison-table-feature' : 'comparison-table-value';
        // bare "Yes" → check icon
        if (i > 0 && /^yes$/i.test(c.textContent.trim())) {
          c.classList.add('comparison-table-yes');
          c.textContent = '';
        }
      });
    }
    if (idx >= VISIBLE_ROWS) row.classList.add('comparison-table-hidden');
  });

  const hiddenCount = rows.length - VISIBLE_ROWS;
  if (hiddenCount > 0) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'comparison-table-expand';
    toggle.textContent = 'Expand details';
    toggle.addEventListener('click', () => {
      const expanded = block.classList.toggle('comparison-table-expanded');
      toggle.textContent = expanded ? 'Collapse details' : 'Expand details';
    });
    block.append(toggle);
  }
}
