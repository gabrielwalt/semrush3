# PROJECT-CONTEXT.md

The project's wiki — durable, cross-cutting knowledge that fits no other PROJECT-* file and isn't a procedure.

## Environment

*[Agent: record environment facts here as they surface.]*

## Constraints

*[Agent: record constraints here as they surface.]*

## Brand

- **Buttons must never use pure black** (`#000` / `rgb(0,0,0)`). Design-team rule (stated 2026-06-26 by gabrielwalt). Use a brand color (purple accent) or an off-black token for button backgrounds/text — never pure black. Applies to all CTA/button styling across blocks.

## Stakeholders

*[Agent: record stakeholders here as they surface.]*

## Decisions

- **Final CTA ("Get started with Semrush today" + "Start free trial") belongs to the footer**, not the homepage body (decided 2026-06-26 by gabrielwalt). On the original it sits at the top of `<contentinfo>`, above the footer link columns. Build it as the footer's top band during footer migration. **How to apply:** don't add it as a standalone homepage section; the homepage import deliberately strips footer chrome.
- **Lazy-hydrated content doesn't survive bulk import** — the teaser `<video>` sources, the Resources article tag labels (News/Playbook/etc.), and similar are injected by client JS after load, so they're absent at the headless importer's parse time. Hardcode known values in parsers (as done for teaser video URLs) or accept their omission (Resources tags). **How to apply:** when source content is present in the live DOM but missing from `content/index.plain.html`, suspect lazy hydration before debugging the parser selector.
