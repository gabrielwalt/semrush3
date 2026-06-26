---
name: video-in-eds
description: Video playback in EDS blocks. Use when implementing video, since EDS rewrites external media URLs in link hrefs. Extends helix `generate-import-html`.
---

EDS rewrites media URLs — the href becomes a local path without extension, but the link **textContent** preserves the original URL.

## Content pattern for videos
In `.plain.html`, video links must use **relative hrefs** (EDS-style slug) so EDS proxies the video same-origin:
```html
<!-- Correct — relative href, EDS proxies same-origin -->
<a href="/static/videos/my-video-mp4">https://www.example.com/static/videos/my_video.mp4</a>

<!-- Wrong — absolute href causes CORB on aem.page -->
<a href="https://www.example.com/static/videos/my_video.mp4">https://www.example.com/static/videos/my_video.mp4</a>
```

## JS extraction pattern
```js
cell.querySelectorAll('a').forEach((link) => {
  const text = link.textContent.trim();
  const match = text.match(/\.(mp4|webm|ogg)(\?|$)/);
  if (match) sources.push({ src: text, type: `video/${match[1]}` });
});
```

**Extensionless CMS video URLs.** Some CMSs/CDNs serve video from an asset endpoint with **no file extension** (e.g. a `cdn.../o/<id>?alt=media` form), so the `.mp4|webm|ogg` test misses them. Add a URL-shape detector alongside the extension check and default the type to `video/mp4`. Keep the concrete per-CMS matcher in project code (e.g. a `video-utils.js`), not here — see `PROJECT-IMPORT.md` for this project's detector.

## Autoplay
- Defer `<video>` creation to `window.load` (with `setTimeout` fallback) — creating during block decoration is too early for autoplay.
- For below-fold videos, use `IntersectionObserver` as the sole play controller — don't set `autoplay` attribute (causes play/pause race condition → `AbortError`).
- Always `.catch(() => {})` on `video.play()` — the promise can reject if interrupted.
- Set `preload="auto"` so video data loads before scrolling into view.
- Respect `prefers-reduced-motion`.

## Pitfalls
- Absolute cross-origin video URLs in href → CORB in Chrome. Use relative hrefs.
- `autoplay` + `IntersectionObserver` → race condition. Use observer only, no autoplay attribute.
- Never rely on `href` alone for the source URL — always check link textContent.
- AEM CLI serves the main page from remote — local `.plain.html` edits need DA re-upload to take effect.

See also: `eds-code-conventions` (clean implementation rules), `importer-parser-patterns` (emitting video as a link during import — the parser side of this). Native `generate-import-html` covers the same ground at a generic level — this skill adds the relative-href requirement, extensionless-URL detection pattern, and autoplay/IntersectionObserver race-condition rules.
