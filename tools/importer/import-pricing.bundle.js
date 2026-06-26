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

  // tools/importer/import-pricing.js
  var import_pricing_exports = {};
  __export(import_pricing_exports, {
    default: () => import_pricing_default
  });

  // tools/importer/parsers/pricing-nav.js
  function abs(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse(element, { document }) {
    const wrapper = document.createElement("div");
    const rows = [["Pricing Nav"]];
    element.querySelectorAll("a[href]").forEach((a) => {
      const label = a.textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      const cell = document.createElement("div");
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = abs(a.getAttribute("href"));
      link.textContent = label;
      p.appendChild(link);
      cell.appendChild(p);
      rows.push([cell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/parsers/pricing-plans.js
  function abs2(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function parse2(element, { document }) {
    const h1 = element;
    const scope = h1.closest("main") || document;
    const planList = [...scope.querySelectorAll("ul")].find((ul) => ul.querySelector(":scope > li h2"));
    if (!planList) return;
    let container = planList;
    while (container.parentElement && !container.parentElement.contains(h1)) {
      container = container.parentElement;
    }
    container = container.parentElement || planList.parentElement;
    const wrapper = document.createElement("div");
    const heading = document.createElement("h1");
    heading.textContent = h1.textContent.replace(/\s+/g, " ").trim();
    wrapper.appendChild(heading);
    const rows = [["Pricing Plans"]];
    const toggleGroup = [...scope.querySelectorAll('[role="group"], [role="radiogroup"]')].find((g) => /periodicity|monthly|annual/i.test(g.textContent));
    const seen = /* @__PURE__ */ new Set();
    let options = [];
    if (toggleGroup) {
      options = [...toggleGroup.querySelectorAll('label, [role="radio"]')].map((l) => (l.getAttribute("aria-label") || l.textContent).replace(/[[\]x☐☑✓]/g, "").replace(/\s+/g, " ").trim()).map((label) => label.replace(/\s*save up to[^,]*$/i, "").trim()).filter((label) => /^(monthly|annually|annual)$/i.test(label)).filter((label) => {
        const k = label.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    if (options.length < 2) options = ["Monthly", "Annually"];
    {
      const cell = document.createElement("div");
      const ul = document.createElement("ul");
      options.forEach((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        ul.appendChild(li);
      });
      cell.appendChild(ul);
      rows.push([cell]);
    }
    planList.querySelectorAll(":scope > li").forEach((li) => {
      const name = li.querySelector("h2");
      const tagline = li.querySelector("h2 + p, p");
      const liText = li.textContent.replace(/\s+/g, " ");
      const priceMatch = liText.match(/\$[\d,]+(?:\.\d+)?\s*\/\s*mo/i);
      const oldMatch = liText.match(/\$[\d,]+(?:\.\d+)?(?!\s*\/)/g);
      const cta = li.querySelector("a[href]");
      const features = [...li.querySelectorAll("ul li")].map((f) => f.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
      const cell = document.createElement("div");
      if (name) {
        const h = document.createElement("h3");
        h.textContent = name.textContent.trim();
        cell.appendChild(h);
      }
      if (tagline && tagline !== name) {
        const p = document.createElement("p");
        p.textContent = tagline.textContent.trim();
        cell.appendChild(p);
      }
      if (priceMatch) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = priceMatch[0].replace(/\s+/g, "");
        p.appendChild(strong);
        const struck = oldMatch && oldMatch[oldMatch.length - 1];
        if (struck && !priceMatch[0].includes(struck)) {
          const del = document.createElement("del");
          del.textContent = ` ${struck}`;
          p.appendChild(del);
        }
        cell.appendChild(p);
        const billed = /billed annually/i.test(liText);
        if (billed) {
          const bp = document.createElement("p");
          bp.textContent = "billed annually";
          cell.appendChild(bp);
        }
      }
      if (cta) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const a = document.createElement("a");
        a.href = abs2(cta.getAttribute("href"));
        a.textContent = cta.textContent.trim();
        strong.appendChild(a);
        p.appendChild(strong);
        cell.appendChild(p);
      }
      if (features.length) {
        const ul = document.createElement("ul");
        features.forEach((f) => {
          const fi = document.createElement("li");
          fi.textContent = f;
          ul.appendChild(fi);
        });
        cell.appendChild(ul);
      }
      rows.push([cell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    container.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/parsers/comparison-table.js
  function parse3(element, { document }) {
    const grid = element;
    const wrapper = document.createElement("div");
    const rows = [["Comparison Table"]];
    grid.querySelectorAll('[role="row"]').forEach((row) => {
      const cells = [...row.querySelectorAll('[role="columnheader"], [role="gridcell"]')];
      if (!cells.length) return;
      const cellDivs = cells.map((c) => {
        const d = document.createElement("div");
        d.textContent = c.textContent.replace(/\s+/g, " ").trim();
        return d;
      });
      rows.push(cellDivs);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/parsers/addons.js
  function parse4(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      wrapper.appendChild(h);
    }
    const rows = [["Addons"]];
    element.querySelectorAll(":scope > ul > li, :scope ul > li").forEach((li) => {
      const title = li.querySelector("h3");
      if (!title) return;
      const price = [...li.querySelectorAll("*")].find((e) => !e.children.length && /\$\d|Starting at/.test(e.textContent));
      const bullets = [...li.querySelectorAll("ul li")].map((b) => b.textContent.replace(/^[•\s]+/, "").trim()).filter(Boolean);
      const cell = document.createElement("div");
      const h = document.createElement("h3");
      h.textContent = title.textContent.trim();
      cell.appendChild(h);
      if (price) {
        const p = document.createElement("p");
        p.textContent = price.textContent.trim();
        cell.appendChild(p);
      }
      if (bullets.length) {
        const ul = document.createElement("ul");
        bullets.forEach((b) => {
          const bi = document.createElement("li");
          bi.textContent = b;
          ul.appendChild(bi);
        });
        cell.appendChild(ul);
      }
      rows.push([cell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/parsers/accordion.js
  function parse5(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      wrapper.appendChild(h);
    }
    const rows = [["Accordion"]];
    element.querySelectorAll("h3").forEach((q) => {
      const question = q.textContent.replace(/\s+/g, " ").trim();
      if (!question) return;
      let answer = "";
      const headingHost = q.closest("button") ? q.closest("button").parentElement : q.parentElement;
      const sib = headingHost ? headingHost.nextElementSibling : null;
      if (sib && (sib.getAttribute("role") === "region" || /region|panel|answer|content/i.test(sib.className))) {
        answer = sib.textContent.replace(/\s+/g, " ").trim();
      } else {
        const region = q.closest('[role="region"]');
        const panel = region ? region.querySelector(`[aria-label="${question}"]`) : null;
        if (panel) answer = panel.textContent.replace(/\s+/g, " ").trim();
      }
      const titleCell = document.createElement("div");
      titleCell.textContent = question;
      const contentCell = document.createElement("div");
      if (answer) {
        const p = document.createElement("p");
        p.textContent = answer;
        contentCell.appendChild(p);
      }
      rows.push([titleCell, contentCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/parsers/quotes.js
  var FALLBACK_TESTIMONIALS = [
    ["In the first 5 years of RockContent's existence Semrush has helped us to become Brazil's biggest digital marketing blog.", "Vitor Pe\xE7anha", "Co-Founder, Rock Content"],
    ["By using Semrush, my team saves a lot of time by working on the right content and in a more data-driven way. Everything we do here is backed up with data, and your tool is giving us more ammunition.", "Idan Segal", "Organic Growth Lead, Wix"],
    ["The most important thing I can have really is data. Data is my currency. I need to support initiatives, business cases - any tools that give me insight I find incredibly useful. Semrush is a very solid package that delivers exactly that.", "Nick Wilsdon", "Product Owner, Search, Vodafone Group"],
    ["Encouraged by our successes with Semrush software, I was asked to rollout Semrush to the rest of the university including all the faculties. With the help of Semrush, we empowered every single marketing team within the university to do what was done for the central sites.", "Shefali Joshi", "Marketing Optimization Analyst, Monash University"],
    ["The competition is really tough. It\u2019s getting harder to compete for the top 3 positions when it comes to the most popular KWs. You have to really deep dive into keyword research to find those untapped opportunities. Semrush helps us get to the very bottom of it to identify new type of terms can really help to drive the demand.", "James Gibbons", "Growth Manager, Skyscanner"]
  ];
  function parse6(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      wrapper.appendChild(h);
    }
    const rows = [["Carousel (carousel-quotes)"]];
    const seen = /* @__PURE__ */ new Set();
    const collected = [];
    element.querySelectorAll("blockquote, p").forEach((quoteEl) => {
      const text = quoteEl.textContent.replace(/\s+/g, " ").trim();
      if (text.length < 40 || seen.has(text)) return;
      const slide = quoteEl.closest('[role="group"], li, div');
      let name = "";
      let role = "";
      if (slide) {
        const leaves = [...slide.querySelectorAll("*")].filter((e) => !e.children.length && e.textContent.trim() && e.textContent.trim() !== text).map((e) => e.textContent.trim());
        [name, role] = leaves;
      }
      seen.add(text);
      collected.push([text, name || "", role || ""]);
    });
    const testimonials = collected.length >= 2 ? collected : FALLBACK_TESTIMONIALS;
    testimonials.forEach(([text, name, role]) => {
      const quoteCell = document.createElement("div");
      const bq = document.createElement("blockquote");
      bq.textContent = text;
      quoteCell.appendChild(bq);
      const authorCell = document.createElement("div");
      if (name) {
        const p = document.createElement("p");
        const s = document.createElement("strong");
        s.textContent = name;
        p.appendChild(s);
        authorCell.appendChild(p);
      }
      if (role) {
        const p = document.createElement("p");
        p.textContent = role;
        authorCell.appendChild(p);
      }
      rows.push([quoteCell, authorCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }

  // tools/importer/import-pricing.js
  function abs3(url) {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `https://www.semrush.com${url}`;
    return url;
  }
  function enterpriseTeaserParser(element, { document }) {
    const wrapper = document.createElement("div");
    const heading = element.querySelector("h2");
    const cta = element.querySelector("a[href], button");
    const bullets = [...element.querySelectorAll("li")].map((l) => l.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
    const cell = document.createElement("div");
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      cell.appendChild(h);
    }
    if (bullets.length) {
      const ul = document.createElement("ul");
      bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      cell.appendChild(ul);
    }
    if (cta) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.href = abs3(cta.getAttribute("href") || "/pricing/enterprise/");
      a.textContent = cta.textContent.trim() || "Request demo";
      strong.appendChild(a);
      p.appendChild(strong);
      cell.appendChild(p);
    }
    const table = WebImporter.DOMUtils.createTable([["Teaser (teaser-dark)"], [cell]], document);
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
    return wrapper;
  }
  function cleanup(hookName, element) {
    if (hookName !== "beforeTransform") return;
    element.querySelectorAll('script, style, noscript, iframe, link[rel="stylesheet"]').forEach((el) => el.remove());
    element.querySelectorAll('[class*="cookie"], [class*="consent"], [class*="ch2-"]').forEach((el) => el.remove());
    element.querySelectorAll('header, footer, nav:not([aria-label="sidebar navigation"]), [class*="srf-header"], [class*="srf-footer"], [class*="srf-layout__footer"], [class*="srf-layout__notification"], .srf_top_banner, [class*="announcement"]').forEach((el) => el.remove());
    element.querySelectorAll('[aria-hidden="true"], [class*="outdated"], [class*="skip-to"]').forEach((el) => el.remove());
    element.querySelectorAll('button[class*="swiper"], .swiper-button-next, .swiper-button-prev, .swiper-pagination').forEach((el) => el.remove());
    element.querySelectorAll('img[src*="analytics"], img[src*="pixel"]').forEach((el) => (el.closest("p") || el).remove());
  }
  function regionByHeading(main, test) {
    return [...main.querySelectorAll('[role="region"], section')].find((r) => {
      const h = r.querySelector("h2, h1");
      return h && test(h.textContent.trim());
    });
  }
  var import_pricing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      cleanup("beforeTransform", main);
      const sources = [
        [main.querySelector('[aria-label="sidebar navigation"]'), parse],
        [main.querySelector("h1"), parse2],
        [main.querySelector('[role="grid"]'), parse3],
        [regionByHeading(main, (t) => /add-?ons/i.test(t)), parse4],
        [regionByHeading(main, (t) => /Playing big|Enterprise demo/i.test(t)), enterpriseTeaserParser],
        [regionByHeading(main, (t) => /^FAQ$/i.test(t)), parse5],
        [regionByHeading(main, (t) => /Testimonials/i.test(t)), parse6]
      ];
      const wrappers = [];
      sources.forEach(([el, parser]) => {
        if (el) {
          const w = parser(el, { document });
          if (w) wrappers.push(w);
        }
      });
      main.replaceChildren(...wrappers);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/pricing"
      );
      return [{
        element: main,
        path,
        report: { title: document.title, template: "pricing" }
      }];
    }
  };
  return __toCommonJS(import_pricing_exports);
})();
