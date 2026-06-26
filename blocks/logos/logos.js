// Logos — rotating customer-logo marquee. The authored cell holds N <picture>
// logos (each wrapped in a <p> by EDS). Build one track containing two identical
// groups so the CSS scroll animation loops seamlessly.
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];

  const buildGroup = () => {
    const group = document.createElement('ul');
    group.className = 'logos-group';
    group.setAttribute('aria-hidden', 'false');
    pictures.forEach((pic) => {
      const li = document.createElement('li');
      li.append(pic.cloneNode(true));
      group.append(li);
    });
    return group;
  };

  const track = document.createElement('div');
  track.className = 'logos-track';
  const first = buildGroup();
  const second = buildGroup();
  second.setAttribute('aria-hidden', 'true'); // duplicate is decorative
  track.append(first, second);

  block.replaceChildren(track);
}
