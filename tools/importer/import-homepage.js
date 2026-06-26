/* eslint-disable */
/* global WebImporter */

// Single source of truth: the per-block parsers live in ./parsers/*.js and are
// validated individually by the parser hook. This driver only wires them to the
// page-template selectors and runs cleanup. esbuild inlines these imports at bundle time.

import heroParser from './parsers/hero.js';
import logosParser from './parsers/logos.js';
import teaserOneParser from './parsers/teaser-one.js';
import teaserEnterpriseParser from './parsers/teaser-enterprise.js';
import solutionsParser from './parsers/solutions.js';
import statsParser from './parsers/stats.js';
import quoteParser from './parsers/quote.js';
import resourcesParser from './parsers/resources.js';

// CLEANUP TRANSFORMER (beforeTransform)
function cleanupTransformer(hookName, element) {
  if (hookName !== 'beforeTransform') return;

  element.querySelectorAll('script, style, noscript, iframe, link[rel="stylesheet"]').forEach((el) => el.remove());
  element.querySelectorAll('[class*="cookie"], [class*="consent"], [class*="ch2-"]').forEach((el) => el.remove());
  // site chrome: header, nav, footer, promo banner
  element.querySelectorAll('header, footer, nav, [class*="srf-header"], [class*="srf-footer"], [class*="srf-layout__footer"], [class*="srf-layout__notification"], .srf_top_banner, .srf_announcement_banner, [class*="announcement"]').forEach((el) => el.remove());
  element.querySelectorAll('[aria-hidden="true"], .mp-visually-hidden, [class*="outdated"], [class*="skip-to"]').forEach((el) => el.remove());
  // carousel controls
  element.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination, button[class*="swiper"]').forEach((el) => el.remove());
  // analytics pixels
  element.querySelectorAll('img[src*="analytics"], img[src*="bat.bing"], img[src*="pixel"], img[class*="ywa"]').forEach((el) => {
    const parent = el.closest('p') || el.closest('picture') || el;
    parent.remove();
  });
}

// CONFIGURATION
const parsers = {
  'hero': heroParser,
  'logos': logosParser,
  'teaser-one': teaserOneParser,
  'teaser-enterprise': teaserEnterpriseParser,
  'solutions': solutionsParser,
  'stats': statsParser,
  'quote': quoteParser,
  'resources': resourcesParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  blocks: [
    { name: 'hero', instances: ['.mp-hero'] },
    { name: 'logos', instances: ['.mp-logo-marquee'] },
    { name: 'teaser-one', instances: ['.mp-promo-cards.mp-semrush-one'] },
    { name: 'teaser-enterprise', instances: ['.mp-promo-cards.mp-enterprise'] },
    { name: 'solutions', instances: ['.mp-section.mp-toolkits'] },
    { name: 'stats', instances: ['.mp-section.mp-stats'] },
    { name: 'quote', instances: ['.mp-section.mp-client-testimonials'] },
    { name: 'resources', instances: ['.mp-section.mp-resources'] },
  ],
};

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        pageBlocks.push({ name: blockDef.name, selector, element: el });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    cleanupTransformer('beforeTransform', main);

    // Hero must run first (it relocates the nested logo marquee out of .mp-hero).
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (!parser) return;
      // Re-resolve the element for logos: the hero parser moves it, so query fresh.
      let el = block.element;
      if (block.name === 'logos' && (!el || !el.isConnected)) {
        el = document.querySelector(block.selector);
      }
      if (!el) return;
      try {
        parser(el, { document, url, params });
      } catch (e) {
        console.error('Failed to parse ' + block.name + ':', e);
      }
    });

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
