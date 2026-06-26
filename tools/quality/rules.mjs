/**
 * Deterministic craft-floor rule registry.
 *
 * Each matcher is keyed to a `rule:craft-*` ID in skills/craft-floor/SKILL.md.
 * Matchers favour FALSE-NEGATIVES over false-positives: an over-eager checker
 * gets ignored. Project-specific allow-lists (palette, radius/spacing scale) are
 * LOADED from the committed tokens, never hardcoded here — per The
 * Executable-Rule Rule, the tokens are the source of truth.
 *
 * No dependencies, no network. ESM (.mjs).
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/* ----------------------------------------------------------------------------
 * Token / allow-list loading (the live allow-list, bound to committed tokens)
 * ------------------------------------------------------------------------- */

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const RGB_RE = /rgba?\(\s*[\d.]+[\s,]+[\d.]+[\s,]+[\d.]+(?:[\s,/]+[\d.%]+)?\s*\)/g;

/** Parse any css color literal to {r,g,b} 0-255, or null if not parseable. */
export function parseColor(raw) {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16));
    return { r, g, b };
  }
  m = s.match(/^#([0-9a-f]{4})$/);
  if (m) {
    const [r, g, b] = m[1].slice(0, 3).split('').map((c) => parseInt(c + c, 16));
    return { r, g, b };
  }
  m = s.match(/^#([0-9a-f]{6})$/);
  if (m) {
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
    };
  }
  m = s.match(/^#([0-9a-f]{8})$/);
  if (m) {
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
    };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (m) {
    return { r: +m[1], g: +m[2], b: +m[3] };
  }
  return null;
}

const COLOR_TOLERANCE = 6; // per-channel, matches DESIGN.md tolerance note

function colorsClose(a, b, tol = COLOR_TOLERANCE) {
  return a && b && Math.abs(a.r - b.r) <= tol && Math.abs(a.g - b.g) <= tol && Math.abs(a.b - b.b) <= tol;
}

/**
 * Structural (non-brand) colors: near-black, near-white, and near-grays. These
 * are text/shadow/hairline/overlay colors that every design uses; flagging them
 * as "off-palette" is noise. A color is structural when it's near-achromatic
 * (channels within 12 of each other) AND near an extreme or mid-gray.
 */
function isStructural({ r, g, b }) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const achromatic = max - min <= 14;
  return achromatic; // any near-gray (incl. black/white) is structural
}

/** WCAG relative luminance + contrast ratio. */
function luminance({ r, g, b }) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrastRatio(a, b) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

/**
 * Load the project allow-list: the set of brand colors + the radius/space scales
 * declared in styles/*.css :root, plus any hex colors named in PROJECT-DESIGN.md.
 * Returns { colors: [{r,g,b}], radii: Set<string>, tokenNames: Set<string> }.
 */
export function loadAllowList(root = process.cwd()) {
  const colors = [];
  const radii = new Set();
  const tokenNames = new Set();
  // Sanctioned responsive breakpoints — harvested LIVE from the global stylesheets'
  // @media conditions (the foundation owns the breakpoint system). CSS @media can't
  // read var(), so breakpoints can't be tokens; the global file's set IS the contract.
  const breakpoints = new Set();
  // px-value → token-name maps for FIXED (non-responsive) tokens only. A token
  // redefined under @media with a different value is "responsive" and must NOT be
  // suggested for a fixed literal (it would shrink on mobile — the documented hazard).
  const fontByPx = {}; // e.g. {'21':'--font-size-heading-s'}
  const spaceByPx = {}; // e.g. {'12':'--space-xxs'}
  const radiusByPx = {}; // e.g. {'8':'--radius-m'} (fixed radii only)
  const tokenDefs = {}; // name → Set of distinct values (to detect responsive tokens)

  const harvestColors = (str) => {
    for (const hit of [...(str.match(HEX_RE) || []), ...(str.match(RGB_RE) || [])]) {
      const c = parseColor(hit);
      if (c) colors.push(c);
    }
  };

  // The GLOBAL stylesheets are the design source of truth: every color they
  // already use is, by definition, part of the validated palette. Harvest them
  // all (token values AND colors used directly in rules — gradients, shadows).
  const styleFiles = ['styles/styles.css', 'styles/brand.css', 'styles/lazy-styles.css', 'styles/fonts.css'];
  for (const rel of styleFiles) {
    const p = join(root, rel);
    if (!existsSync(p)) continue;
    const css = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
    harvestColors(css);
    // harvest the global breakpoints from this foundation file's @media widths
    for (const bp of css.matchAll(/\(\s*(?:min-width|max-width|width)\s*[:<>=\s]*(\d+)px/gi)) {
      breakpoints.add(bp[1]);
    }
    for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      const name = m[1];
      const val = m[2].trim();
      tokenNames.add(name);
      (tokenDefs[name] = tokenDefs[name] || new Set()).add(val);
      if (/--radius-/.test(name)) {
        const px = val.match(/(\d+)px/);
        if (px) radii.add(px[1]);
      }
    }
  }

  // Build fixed-token px maps: only tokens with a SINGLE distinct value (no @media
  // override) qualify. First-writer-wins so the base/desktop value is canonical.
  for (const [name, vals] of Object.entries(tokenDefs)) {
    if (vals.size !== 1) continue; // responsive (multi-value) → skip
    const val = [...vals][0];
    const px = /^(\d+)px$/.exec(val);
    if (!px) continue;
    if (/--font-size-/.test(name) && !(px[1] in fontByPx)) fontByPx[px[1]] = name;
    if (/--space-/.test(name) && !(px[1] in spaceByPx)) spaceByPx[px[1]] = name;
    if (/--radius-/.test(name) && !/pill/.test(name) && !(px[1] in radiusByPx)) radiusByPx[px[1]] = name;
  }

  // PROJECT-DESIGN.md: any hex/rgb named in the design doc is an allowed brand color
  const designPath = join(root, 'PROJECT-DESIGN.md');
  if (existsSync(designPath)) harvestColors(readFileSync(designPath, 'utf8'));

  return {
    colors, radii, tokenNames, fontByPx, spaceByPx, radiusByPx, breakpoints,
  };
}

/* ----------------------------------------------------------------------------
 * Helpers shared by matchers
 * ------------------------------------------------------------------------- */

/** Strip /* *​/ comments so we don't match inside them; keep line count stable. */
function blankComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function* eachLine(text) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) yield { n: i + 1, line: lines[i] };
}

// Contexts where a raw white/literal is legitimately NOT "inverse ink"
const INVERSE_ALLOW_CTX = /gradient|mask|glass|box-shadow|background:\s*#fff|background-color:\s*#fff|background:\s*linear|outline/i;

// Near-match tolerance for the discrepancy checker: a literal within this fraction
// of a token's value (but not equal) is a "snap candidate" — almost certainly the
// same design intent expressed as a slightly-off one-off. 6% catches 20↔21, 46↔48,
// 60↔64, 11↔12 while leaving real adjacent scale steps (16 vs 18 = 12.5%) alone.
const NEAR_MATCH_TOLERANCE = 0.06;

/** Nearest token in a {px:name} map to `px`, excluding exact, within tolerance. */
function nearestToken(px, map, tol = NEAR_MATCH_TOLERANCE) {
  let best = null;
  for (const [tpx, name] of Object.entries(map)) {
    const t = Number(tpx);
    if (t === px) return null; // exact → not a near-match (craft-token-literal owns it)
    const diff = Math.abs(t - px) / t;
    if (diff <= tol && (!best || diff < best.diff)) best = { name, t, diff };
  }
  return best;
}

/* ----------------------------------------------------------------------------
 * The registry. Each rule: { id, area, name, severity, appliesTo, run(ctx) }
 *   ctx = { file, text, cssNoComments, allow }
 *   run returns [{ line, snippet, detail }]
 * ------------------------------------------------------------------------- */

export const RULES = [
  {
    id: 'craft-color-raw-inverse',
    area: 'color',
    name: 'Raw #fff inverse ink (use --color-inverse)',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments }) {
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        if (!/(?:^|[^-])color\s*:/.test(line)) continue; // only `color:` (not background-color, border-color handled loosely)
        if (!/#fff\b|#ffffff\b/i.test(line)) continue;
        if (INVERSE_ALLOW_CTX.test(line)) continue;
        out.push({ line: n, snippet: line.trim(), detail: 'literal white as text color; use var(--color-inverse)' });
      }
      return out;
    },
  },
  {
    id: 'craft-color-off-palette',
    area: 'color',
    name: 'Color outside the DESIGN.md / token palette',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        const hits = [...(line.match(HEX_RE) || []), ...(line.match(RGB_RE) || [])];
        for (const hit of hits) {
          const c = parseColor(hit);
          if (!c) continue;
          if (isStructural(c)) continue; // near-black/white/gray text, shadows, hairlines
          if (allow.colors.some((a) => colorsClose(a, c))) continue;
          out.push({ line: n, snippet: line.trim(), detail: `color ${hit} not in allow-list (±${COLOR_TOLERANCE}/chan)` });
        }
      }
      return out;
    },
  },
  {
    id: 'craft-color-side-stripe',
    area: 'color',
    name: 'Side-stripe accent (border-left/right ≥2px colored)',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      // impeccable's #1 absolute ban: a colored border-left/right ≥2px used as an
      // accent stripe on cards/list-items/callouts. Use a full hairline border, a
      // background tint, or a leading glyph instead. A 1px side border is fine
      // (table/divider hairline); a near-structural (gray) border is fine.
      const out = [];
      // longhand: border-left: 4px solid <color>;  border-left-width + border-left-color handled too
      const shorthand = /border-(left|right)\s*:\s*([^;]+);?/i;
      for (const { n, line } of eachLine(cssNoComments)) {
        const m = line.match(shorthand);
        if (!m) continue;
        const val = m[2];
        const wpx = val.match(/(\d+)px/);
        if (!wpx || Number(wpx[1]) < 2) continue; // 0–1px is fine
        if (!/\bsolid\b/.test(val)) continue;
        // find a color in the value; skip if structural (gray hairline) or absent
        const colorHit = (val.match(HEX_RE) || [])[0] || (val.match(RGB_RE) || [])[0];
        const c = colorHit ? parseColor(colorHit) : null;
        // a var(--accent*/--brand*/--color*) reference also counts as "colored"
        const colorVar = /var\(--(?:accent|brand|color|primary)[a-z0-9-]*\)/i.test(val);
        if (c && isStructural(c)) continue; // gray side border = divider, fine
        if (!c && !colorVar) continue; // no detectable color → skip (favor false-neg)
        out.push({ line: n, snippet: line.trim(), detail: `border-${m[1]} ${wpx[1]}px solid as a colored accent stripe — use a full border, background tint, or leading glyph` });
      }
      return out;
    },
  },
  {
    id: 'craft-color-token-dup',
    area: 'color',
    name: 'Token defined more than once',
    severity: 'error',
    appliesTo: 'css',
    // operates on the whole project, invoked specially (see detect.mjs project-mode);
    // as a per-file check it finds dups within one file.
    run({ cssNoComments }) {
      const out = [];
      const seen = new Map();
      for (const { n, line } of eachLine(cssNoComments)) {
        const m = line.match(/(--[a-z0-9-]+)\s*:/i);
        if (!m) continue;
        const name = m[1];
        if (seen.has(name)) {
          out.push({ line: n, snippet: line.trim(), detail: `${name} also defined at line ${seen.get(name)}` });
        } else {
          seen.set(name, n);
        }
      }
      return out;
    },
  },
  {
    id: 'craft-radius-raw',
    area: 'spacing',
    name: 'Raw border-radius literal (use a --radius token)',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        const m = line.match(/border-radius\s*:\s*([^;]+);?/i);
        if (!m) continue;
        if (/var\(--/.test(m[1])) continue; // already tokenized
        // single-value px radii only; multi-value frame radii are intentional
        const px = m[1].trim().match(/^(\d+)px$/);
        if (!px) continue;
        if (px[1] === '0') continue;
        // Flag ONLY when the literal EQUALS an existing --radius token value — that's
        // the actionable, zero-visual swap. An off-scale radius (no matching token) is
        // an intentional component value, not slop (field-tested: flagging those was
        // noise). If a project wants every radius tokenized, add the token first.
        if (allow.radii.has(px[1])) {
          out.push({ line: n, snippet: line.trim(), detail: `raw ${px[1]}px radius equals an existing --radius-* token — use the token` });
        }
      }
      return out;
    },
  },
  {
    id: 'craft-token-literal',
    area: 'tokens',
    name: 'Single-value font-size/spacing literal that equals a FIXED token',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      // Systematic tokenization: a single-value font-size / padding / margin / gap
      // literal that EXACTLY equals a FIXED (non-responsive) token value should use
      // the token. Only fixed tokens are suggested (allow.fontByPx / spaceByPx are
      // built from single-definition tokens), so we never push a literal toward a
      // responsive token that would shrink it on mobile (the documented hazard).
      // Single-value only — multi-value shorthands (`12px 0`, `0 32px`) are skipped
      // to stay conservative (favor false-negatives).
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        // skip custom-property DEFINITIONS (`--container-padding: 32px;`) — those ARE
        // the tokens; we only flag literal USAGES on real properties.
        if (/^\s*--[a-z0-9-]+\s*:/.test(line)) continue;
        // font-size (leading boundary so `--font-size` defs / sub-props don't match)
        let m = line.match(/(?:^|[\s;{])font-size\s*:\s*([^;]+);?/i);
        if (m && !/var\(--/.test(m[1])) {
          const px = m[1].trim().match(/^(\d+)px$/);
          if (px && allow.fontByPx[px[1]]) {
            out.push({ line: n, snippet: line.trim(), detail: `font-size ${px[1]}px equals ${allow.fontByPx[px[1]]} — use the token` });
          }
        }
        // single-value padding / margin / gap — leading boundary so `scroll-margin`,
        // `--container-padding`, `column-gap`-as-`gap` etc. aren't substring-matched.
        m = line.match(/(?:^|[\s;{])(padding|margin|gap|row-gap|column-gap)\s*:\s*([^;]+);?/i);
        if (m && !/var\(--/.test(m[2])) {
          const px = m[2].trim().match(/^(\d+)px$/); // single value only
          if (px && allow.spaceByPx[px[1]]) {
            out.push({ line: n, snippet: line.trim(), detail: `${m[1]} ${px[1]}px equals ${allow.spaceByPx[px[1]]} — use the token` });
          }
        }
      }
      return out;
    },
  },
  {
    id: 'craft-token-near',
    area: 'tokens',
    name: 'Single-value literal within 6% of a FIXED token (snap to it)',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      // The discrepancy finder: a literal that is CLOSE to a fixed token value but
      // not equal is almost always the same design intent expressed as a one-off
      // (20px where the card-title token is 21px). Snap it. CATEGORY-BOUND — a
      // font-size only matches font tokens, spacing only spacing tokens, radius only
      // radius tokens — so we never suggest a radius for a font-size. Skips exact
      // matches (craft-token-literal owns those) and only-fixed tokens are in the
      // maps (no responsive-shrink hazard). Single-value only; favors false-negatives.
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        if (/^\s*--[a-z0-9-]+\s*:/.test(line)) continue; // skip token definitions
        let m = line.match(/(?:^|[\s;{])font-size\s*:\s*([^;]+);?/i);
        if (m && !/var\(--/.test(m[1])) {
          const px = m[1].trim().match(/^(\d+)px$/);
          const near = px && nearestToken(Number(px[1]), allow.fontByPx);
          if (near) out.push({ line: n, snippet: line.trim(), detail: `font-size ${px[1]}px is ${(near.diff * 100).toFixed(1)}% off ${near.name} (${near.t}px) — snap to the token unless intentionally distinct` });
        }
        m = line.match(/(?:^|[\s;{])(padding|margin|gap|row-gap|column-gap)\s*:\s*([^;]+);?/i);
        if (m && !/var\(--/.test(m[2])) {
          const px = m[2].trim().match(/^(\d+)px$/);
          const near = px && nearestToken(Number(px[1]), allow.spaceByPx);
          if (near) out.push({ line: n, snippet: line.trim(), detail: `${m[1]} ${px[1]}px is ${(near.diff * 100).toFixed(1)}% off ${near.name} (${near.t}px) — snap to the token unless intentionally distinct` });
        }
        m = line.match(/border-radius\s*:\s*([^;]+);?/i);
        if (m && !/var\(--/.test(m[1])) {
          const px = m[1].trim().match(/^(\d+)px$/);
          const near = px && px[1] !== '0' && nearestToken(Number(px[1]), allow.radiusByPx);
          if (near) out.push({ line: n, snippet: line.trim(), detail: `border-radius ${px[1]}px is ${(near.diff * 100).toFixed(1)}% off ${near.name} (${near.t}px) — snap to the token unless intentionally distinct` });
        }
      }
      return out;
    },
  },
  {
    id: 'craft-breakpoint-stray',
    area: 'tokens',
    name: 'Stray @media breakpoint not in the sanctioned set',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, allow }) {
      // The foundation defines the site's responsive breakpoints (e.g. 768/1024).
      // CSS @media can't read var(), so we enforce CONSISTENCY instead of tokens:
      // any block @media width outside the harvested set is drift — snap it to the
      // nearest sanctioned breakpoint or, if genuinely new, add it to the foundation.
      if (!allow.breakpoints || allow.breakpoints.size === 0) return [];
      const out = [];
      for (const { n, line } of eachLine(cssNoComments)) {
        if (!/@media/.test(line)) continue;
        for (const m of line.matchAll(/\(\s*(?:min-width|max-width|width)\s*[:<>=\s]*(\d+)px/gi)) {
          if (!allow.breakpoints.has(m[1])) {
            out.push({ line: n, snippet: line.trim(), detail: `@media ${m[1]}px is not a sanctioned breakpoint (${[...allow.breakpoints].sort((a, b) => a - b).join('/')}) — snap to one or add it to the foundation` });
          }
        }
      }
      return out;
    },
  },
  {
    id: 'craft-motion-reduced',
    area: 'motion',
    name: 'Animation without prefers-reduced-motion guard',
    severity: 'warn',
    appliesTo: 'css',
    run({ cssNoComments, file, allow }) {
      // file-local heuristic: if this file declares @keyframes or animation: <name>
      // and neither this file nor the global guard covers reduced-motion, flag once.
      const hasAnim = /@keyframes\s|animation\s*:\s*[a-z]/i.test(cssNoComments);
      if (!hasAnim) return [];
      if (/prefers-reduced-motion/.test(cssNoComments)) return [];
      // global guard in styles.css covers the whole site via `*`
      if (allow.globalReducedMotion) return [];
      const m = cssNoComments.match(/@keyframes\s|animation\s*:\s*[a-z]/i);
      const upto = cssNoComments.slice(0, m.index);
      const lineNo = upto.split('\n').length;
      return [{ line: lineNo, snippet: 'animation present', detail: 'no @media (prefers-reduced-motion: reduce) guard in this file or global' }];
    },
  },
  {
    id: 'craft-cruft-placeholder',
    area: 'cruft',
    name: 'Placeholder cruft (lorem / TODO / FIXME)',
    severity: 'warn',
    appliesTo: 'both',
    run({ text }) {
      // scan RAW text — TODO/FIXME usually live inside comments, which the
      // comment-stripped view would hide.
      const out = [];
      for (const { n, line } of eachLine(text)) {
        if (/\blorem ipsum\b|\bTODO\b|\bFIXME\b|\bXXX\b/i.test(line)) {
          out.push({ line: n, snippet: line.trim().slice(0, 80), detail: 'placeholder / TODO left in shipped file' });
        }
      }
      return out;
    },
  },
];

/** Convenience: rules by id. */
export const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));
