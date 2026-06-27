// FAQ accordion — each authored row is [question, answer]. Builds a native
// <details>/<summary> disclosure per row so it works without JS and is
// keyboard-accessible. First item open by default (matches the source).
export default function decorate(block) {
  [...block.children].forEach((row, idx) => {
    const [titleCell, contentCell] = row.children;
    const details = document.createElement('details');
    details.className = 'accordion-item';
    if (idx === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'accordion-summary';
    summary.textContent = (titleCell?.textContent || '').trim();

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    if (contentCell) panel.append(...contentCell.childNodes);

    details.append(summary, panel);
    row.replaceWith(details);
  });
}
