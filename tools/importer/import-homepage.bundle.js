/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const h1 = element.querySelector(".mp-hero__title, h1");
    if (!h1) return;
    const subtitle = element.querySelector(".mp-hero__subtitle");
    const combo = element.querySelector('input, [role="combobox"], .mp-search__input');
    const buttons = [...element.querySelectorAll("button")].filter((b) => !/country/i.test(b.getAttribute("aria-label") || ""));
    const submit = element.querySelector('button[type="submit"], .mp-search__button') || buttons[buttons.length - 1];
    const wrapper = document.createElement("div");
    const heading = document.createElement("h1");
    heading.textContent = h1.textContent.trim();
    wrapper.appendChild(heading);
    if (subtitle) {
      const p = document.createElement("p");
      p.textContent = subtitle.textContent.trim();
      wrapper.appendChild(p);
    }
    const placeholder = combo && (combo.getAttribute("placeholder") || combo.getAttribute("aria-label")) || "Enter your website";
    const buttonLabel = submit && submit.textContent.trim() || "Get insights";
    const formCell = document.createElement("div");
    const p1 = document.createElement("p");
    p1.textContent = placeholder.trim();
    formCell.appendChild(p1);
    const p2 = document.createElement("p");
    p2.textContent = buttonLabel.trim();
    formCell.appendChild(p2);
    const formTable = WebImporter.DOMUtils.createTable([["Insights Form"], [formCell]], document);
    wrapper.appendChild(formTable);
    const sectionMeta = WebImporter.DOMUtils.createTable([["Section Metadata"], ["Style", "hero"]], document);
    wrapper.appendChild(sectionMeta);
    const marquee = element.querySelector(".mp-logo-marquee");
    if (marquee) element.after(marquee);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/logos.js
  function abs(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse2(element, { document }) {
    const wrapper = document.createElement("div");
    const firstGroup = element.querySelector(".mp-logo-marquee__group") || element;
    const cell = document.createElement("div");
    firstGroup.querySelectorAll("img").forEach((img) => {
      const src = abs(img.getAttribute("src"));
      if (!src || src === "about:error") return;
      const pic = document.createElement("picture");
      const el = document.createElement("img");
      el.src = src;
      el.alt = img.getAttribute("alt") || "";
      pic.appendChild(el);
      cell.appendChild(pic);
    });
    const table = WebImporter.DOMUtils.createTable([["Logos"], [cell]], document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/teaser-one.js
  function abs2(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse3(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2, h3");
    const body = element.querySelector("p");
    const link = element.querySelector("a[href]");
    const video = element.querySelector("video");
    const img = element.querySelector("img");
    const poster = video && video.getAttribute("poster") || img && img.getAttribute("src");
    const textCell = document.createElement("div");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.appendChild(h);
    }
    if (body) {
      const p = document.createElement("p");
      p.textContent = body.textContent.trim();
      textCell.appendChild(p);
    }
    if (link) {
      const p = document.createElement("p");
      const em = document.createElement("em");
      const a = document.createElement("a");
      a.href = abs2(link.getAttribute("href"));
      a.textContent = link.textContent.trim();
      em.appendChild(a);
      p.appendChild(em);
      textCell.appendChild(p);
    }
    const mediaCell = document.createElement("div");
    const videoUrl = "https://www.semrush.com/static/videos/semrush_one.mp4";
    const vp = document.createElement("p");
    const va = document.createElement("a");
    va.href = "/static/videos/semrush_one-mp4";
    va.textContent = videoUrl;
    vp.appendChild(va);
    mediaCell.appendChild(vp);
    const src = abs2(poster);
    if (src && src !== "about:error") {
      const pp = document.createElement("p");
      const pic = document.createElement("picture");
      const el = document.createElement("img");
      el.src = src;
      el.alt = heading ? heading.textContent.trim() : "";
      pic.appendChild(el);
      pp.appendChild(pic);
      mediaCell.appendChild(pp);
    }
    const table = WebImporter.DOMUtils.createTable([["Teaser"], [textCell, mediaCell]], document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/teaser-enterprise.js
  function abs3(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse4(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2, h3");
    const body = element.querySelector("p");
    const link = element.querySelector("a[href]");
    const video = element.querySelector("video");
    const img = element.querySelector("img");
    const poster = video && video.getAttribute("poster") || img && img.getAttribute("src");
    const textCell = document.createElement("div");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.appendChild(h);
    }
    if (body) {
      const p = document.createElement("p");
      p.textContent = body.textContent.trim();
      textCell.appendChild(p);
    }
    if (link) {
      const p = document.createElement("p");
      const em = document.createElement("em");
      const a = document.createElement("a");
      a.href = abs3(link.getAttribute("href"));
      a.textContent = link.textContent.trim();
      em.appendChild(a);
      p.appendChild(em);
      textCell.appendChild(p);
    }
    const mediaCell = document.createElement("div");
    const videoUrl = "https://www.semrush.com/static/videos/enterprise_video.mp4";
    const vp = document.createElement("p");
    const va = document.createElement("a");
    va.href = "/static/videos/enterprise_video-mp4";
    va.textContent = videoUrl;
    vp.appendChild(va);
    mediaCell.appendChild(vp);
    const src = abs3(poster);
    if (src && src !== "about:error") {
      const pp = document.createElement("p");
      const pic = document.createElement("picture");
      const el = document.createElement("img");
      el.src = src;
      el.alt = heading ? heading.textContent.trim() : "";
      pic.appendChild(el);
      pp.appendChild(pic);
      mediaCell.appendChild(pp);
    }
    const table = WebImporter.DOMUtils.createTable([["Teaser (teaser-dark)"], [textCell, mediaCell]], document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/solutions.js
  function abs4(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse5(element, { document }) {
    const wrapper = document.createElement("div");
    const h2 = element.querySelector("h2");
    const h3 = element.querySelector("h3");
    const eyebrow = h2 ? h2.textContent.replace(/\s*\(\s*\d+\s*\)\s*$/, "").trim() : "Solutions";
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow;
      wrapper.appendChild(p);
    }
    if (h3) {
      const h = document.createElement("h2");
      h.textContent = h3.textContent.trim();
      wrapper.appendChild(h);
    }
    const rows = [["Carousel"]];
    element.querySelectorAll(".mp-toolkit").forEach((slide) => {
      const title = slide.querySelector(".mp-toolkit__title, h3");
      const subtitle = slide.querySelector(".mp-toolkit__subtitle, h4");
      const img = slide.querySelector("img");
      const imgCell = document.createElement("div");
      if (img) {
        const src = abs4(img.getAttribute("src"));
        if (src && src !== "about:error") {
          const pic = document.createElement("picture");
          const el = document.createElement("img");
          el.src = src;
          el.alt = img.getAttribute("alt") || "";
          pic.appendChild(el);
          imgCell.appendChild(pic);
        }
      }
      const textCell = document.createElement("div");
      if (title) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        textCell.appendChild(h);
      }
      if (subtitle) {
        const p = document.createElement("p");
        p.textContent = subtitle.textContent.trim();
        textCell.appendChild(p);
      }
      rows.push([imgCell, textCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/stats.js
  function abs5(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse6(element, { document }) {
    const wrapper = document.createElement("div");
    const h2 = element.querySelector("h2");
    const h3 = element.querySelector("h3");
    if (h2) {
      const p = document.createElement("p");
      p.textContent = h2.textContent.trim();
      wrapper.appendChild(p);
    }
    if (h3) {
      const h = document.createElement("h2");
      h.textContent = h3.textContent.trim();
      wrapper.appendChild(h);
    }
    const cta = element.querySelector("a[href]");
    if (cta) {
      const p = document.createElement("p");
      const em = document.createElement("em");
      const a = document.createElement("a");
      a.href = abs5(cta.getAttribute("href"));
      a.textContent = cta.textContent.trim();
      em.appendChild(a);
      p.appendChild(em);
      wrapper.appendChild(p);
    }
    const rows = [["Stats"]];
    element.querySelectorAll("li").forEach((li) => {
      const countEl = li.querySelector(".mp-stats__item-count-wrapper");
      const paras = li.querySelectorAll("p");
      const cell = document.createElement("div");
      if (countEl) {
        const num = document.createElement("p");
        num.textContent = countEl.textContent.replace(/\s+/g, " ").trim();
        cell.appendChild(num);
      }
      if (paras.length) {
        const label = document.createElement("p");
        label.textContent = paras[0].textContent.trim();
        cell.appendChild(label);
        if (paras.length > 1) {
          const desc = document.createElement("p");
          desc.textContent = paras[paras.length - 1].textContent.trim();
          cell.appendChild(desc);
        }
      }
      rows.push([cell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/quote.js
  function abs6(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse7(element, { document }) {
    const wrapper = document.createElement("div");
    const h2 = element.querySelector("h2");
    const h3 = element.querySelector("h3");
    if (h2) {
      const p = document.createElement("p");
      p.textContent = h2.textContent.trim();
      wrapper.appendChild(p);
    }
    if (h3) {
      const h = document.createElement("h2");
      h.textContent = h3.textContent.trim();
      wrapper.appendChild(h);
    }
    const figure = element.querySelector("figure") || element;
    const logo = figure.querySelector("img");
    const quote = figure.querySelector("blockquote");
    let author = figure.getAttribute("aria-label");
    if (!author && quote) {
      const after = [...figure.querySelectorAll("*")].filter((el) => !el.children.length && el.textContent.trim() && !quote.contains(el) && el.tagName !== "IMG").map((el) => el.textContent.trim());
      author = after.slice(0, 2).join(", ");
    }
    const rows = [["Quote"]];
    const quoteCell = document.createElement("div");
    if (logo) {
      const src = abs6(logo.getAttribute("src"));
      if (src && src !== "about:error") {
        const pic = document.createElement("picture");
        const el = document.createElement("img");
        el.src = src;
        el.alt = logo.getAttribute("alt") || "";
        pic.appendChild(el);
        quoteCell.appendChild(pic);
      }
    }
    if (quote) {
      const bq = document.createElement("blockquote");
      bq.textContent = quote.textContent.trim();
      quoteCell.appendChild(bq);
    }
    if (author) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = author.trim();
      p.appendChild(strong);
      quoteCell.appendChild(p);
    }
    rows.push([quoteCell]);
    const statNumber = element.querySelector(".mp-client-testimonials__stats-block-number");
    const statText = element.querySelector(".mp-client-testimonials__stats-block-text");
    if (statNumber || statText) {
      const statCell = document.createElement("div");
      if (statNumber) {
        const p = document.createElement("p");
        p.textContent = statNumber.textContent.trim();
        statCell.appendChild(p);
      }
      if (statText) {
        const p = document.createElement("p");
        p.textContent = statText.textContent.trim();
        statCell.appendChild(p);
      }
      rows.push([statCell]);
    }
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/resources.js
  function abs7(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse8(element, { document }) {
    const wrapper = document.createElement("div");
    const h2 = element.querySelector("h2");
    const h3 = element.querySelector("h3");
    const eyebrow = h2 ? h2.textContent.replace(/\s*\(\s*\d+\s*\)\s*$/, "").trim() : "Resources";
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow;
      wrapper.appendChild(p);
    }
    if (h3) {
      const h = document.createElement("h2");
      h.textContent = h3.textContent.trim();
      wrapper.appendChild(h);
    }
    const rows = [["Carousel (carousel-articles)"]];
    element.querySelectorAll("article").forEach((article) => {
      const img = article.querySelector("img");
      const titleLink = article.querySelector("h3 a, a[href]");
      const desc = article.querySelector("p");
      const tags = article.querySelectorAll('[class*="tag"]');
      const imgCell = document.createElement("div");
      if (img) {
        const src = abs7(img.getAttribute("src"));
        if (src && src !== "about:error") {
          const pic = document.createElement("picture");
          const el = document.createElement("img");
          el.src = src;
          el.alt = img.getAttribute("alt") || "";
          pic.appendChild(el);
          imgCell.appendChild(pic);
        }
      }
      const textCell = document.createElement("div");
      if (titleLink) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = abs7(titleLink.getAttribute("href"));
        a.textContent = titleLink.textContent.trim();
        h.appendChild(a);
        textCell.appendChild(h);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }
      const tagText = [...tags].map((t) => t.textContent.trim()).filter(Boolean).join(" \xB7 ");
      if (tagText) {
        const p = document.createElement("p");
        p.textContent = tagText;
        textCell.appendChild(p);
      }
      rows.push([imgCell, textCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  }

  // tools/importer/import-homepage.js
  function cleanupTransformer(hookName, element) {
    if (hookName !== "beforeTransform") return;
    element.querySelectorAll('script, style, noscript, iframe, link[rel="stylesheet"]').forEach((el) => el.remove());
    element.querySelectorAll('[class*="cookie"], [class*="consent"], [class*="ch2-"]').forEach((el) => el.remove());
    element.querySelectorAll('header, footer, nav, [class*="srf-header"], [class*="srf-footer"], [class*="srf-layout__footer"], [class*="srf-layout__notification"], .srf_top_banner, .srf_announcement_banner, [class*="announcement"]').forEach((el) => el.remove());
    element.querySelectorAll('[aria-hidden="true"], .mp-visually-hidden, [class*="outdated"], [class*="skip-to"]').forEach((el) => el.remove());
    element.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination, button[class*="swiper"]').forEach((el) => el.remove());
    element.querySelectorAll('img[src*="analytics"], img[src*="bat.bing"], img[src*="pixel"], img[class*="ywa"]').forEach((el) => {
      const parent = el.closest("p") || el.closest("picture") || el;
      parent.remove();
    });
  }
  var parsers = {
    "hero": parse,
    "logos": parse2,
    "teaser-one": parse3,
    "teaser-enterprise": parse4,
    "solutions": parse5,
    "stats": parse6,
    "quote": parse7,
    "resources": parse8
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    blocks: [
      { name: "hero", instances: [".mp-hero"] },
      { name: "logos", instances: [".mp-logo-marquee"] },
      { name: "teaser-one", instances: [".mp-promo-cards.mp-semrush-one"] },
      { name: "teaser-enterprise", instances: [".mp-promo-cards.mp-enterprise"] },
      { name: "solutions", instances: [".mp-section.mp-toolkits"] },
      { name: "stats", instances: [".mp-section.mp-stats"] },
      { name: "quote", instances: [".mp-section.mp-client-testimonials"] },
      { name: "resources", instances: [".mp-section.mp-resources"] }
    ]
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      cleanupTransformer("beforeTransform", main);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (!parser) return;
        let el = block.element;
        if (block.name === "logos" && (!el || !el.isConnected)) {
          el = document.querySelector(block.selector);
        }
        if (!el) return;
        try {
          parser(el, { document, url, params });
        } catch (e) {
          console.error("Failed to parse " + block.name + ":", e);
        }
      });
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
