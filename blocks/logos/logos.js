// Logos — customer logo strip. The authored cell holds N <picture> logos (each
// wrapped in a <p> by EDS). Flatten them into a single list of logo items.
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];
  const list = document.createElement('ul');
  list.className = 'logos-list';
  pictures.forEach((pic) => {
    const li = document.createElement('li');
    li.append(pic);
    list.append(li);
  });
  block.replaceChildren(list);
}
