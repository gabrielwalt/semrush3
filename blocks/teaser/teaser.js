// Teaser — converts the media cell's video link into an autoplaying, muted,
// looping product video (poster as the fallback frame). Playback is driven by an
// IntersectionObserver so it only plays in view; respects reduced-motion.
export default function decorate(block) {
  // Find the VIDEO link specifically — the full URL lives in the link text
  // (EDS rewrites the href slug), so match on textContent, not the CTA button.
  const link = [...block.querySelectorAll('a[href]')]
    .find((a) => /\.(mp4|webm)(\?|$)/i.test(a.textContent.trim()));
  if (!link) return;
  const srcText = link.textContent.trim();

  const poster = block.querySelector('picture img');
  const mediaCell = link.closest('div');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const video = document.createElement('video');
  video.className = 'teaser-video';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'auto';
  if (poster) video.poster = poster.src;

  const source = document.createElement('source');
  source.src = srcText;
  source.type = `video/${srcText.match(/\.(mp4|webm)/i)[1].toLowerCase()}`;
  video.appendChild(source);

  // Replace the link (and the redundant poster image) with the video.
  link.closest('p')?.remove();
  poster?.closest('p')?.remove();
  mediaCell.prepend(video);

  if (reduceMotion) {
    // Show the poster frame only; don't autoplay.
    video.removeAttribute('autoplay');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(video);
}
