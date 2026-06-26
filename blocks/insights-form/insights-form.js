// Insights Form — interactive placeholder. The author owns the field placeholder
// and the submit button label (the two paragraphs in the authored cell). The
// visitor enters a domain; results are returned by a backend at runtime.
export default function decorate(block) {
  const paras = [...block.querySelectorAll('p')];
  const placeholder = (paras[0]?.textContent || 'Enter your website').trim();
  const buttonLabel = (paras[1]?.textContent || 'Get insights').trim();

  const form = document.createElement('form');
  form.className = 'insights-form-control';
  form.setAttribute('role', 'search');

  const field = document.createElement('div');
  field.className = 'insights-form-field';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'domain';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  field.append(input);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button accent';
  submit.textContent = buttonLabel;

  form.append(field, submit);
  block.replaceChildren(form);
}
