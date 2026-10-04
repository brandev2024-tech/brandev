/* =============================================================================
   Alfred Calawa — main.js
   Renders all content from window.SITE_CONFIG and wires up interactions.
   You shouldn't need to edit this file to change content. Use siteConfig.js.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) { console.error("siteConfig.js failed to load"); return; }

  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = () => mqReduce.matches;
  const fine = () => mqFine.matches && !mqReduce.matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, "0");
  const P = C.pricing;
  const money = (n) => P.currency + Math.round(n).toLocaleString(P.locale || undefined);

  /* ---------------------------------------------------------------- icons */
  const ICON_PATHS = {
    web: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M3 9h18"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    cart: '<circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.5 3.5h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6.6"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8z"/>',
    merge: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M8.5 6.5c4 0 4 5.5 7 5.5M8.5 17.5c4 0 4-5.5 7-5.5"/>',
    globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.8 4 6 4 9.5s-1.2 6.7-4 9.5c-2.8-2.8-4-6-4-9.5s1.2-6.7 4-9.5z"/>',
    wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0-5.9 5.9L3 18v3h3l5.8-5.8a4.5 4.5 0 0 0 5.9-5.9l-2.9 2.9-2.4-.6-.6-2.4 2.9-2.9z"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>',
    download: '<path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    motorcycle: '<circle cx="5" cy="17" r="3.5"/><circle cx="19" cy="17" r="3.5"/><path d="M5 17l4-6h6l4 6M15 11l-1.6-4H16.5M7.5 9H12"/>',
    tent: '<path d="M2 20h20M4 20 12 5l8 15M10 20l2-5 2 5"/>',
    mountain: '<path d="m3 20 6-10 4 6 2-3 6 7H3z"/><path d="m7.4 12.7 1.6 1.3 1.6-1.3"/>',
    run: '<circle cx="15" cy="4.5" r="1.8"/><path d="M7 21l3.5-6 3 2.5V21M5 11.5l3.5-3 4.5 1 2 3.5 3.5 1M10.5 15l2.5-5.5"/>',
    crosshair: '<circle cx="12" cy="12" r="8"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r="1.2"/>',
    tools: '<path d="M14.7 6.3a4.5 4.5 0 0 0-5.9 5.9L3 18v3h3l5.8-5.8a4.5 4.5 0 0 0 5.9-5.9l-2.9 2.9-2.4-.6-.6-2.4 2.9-2.9z"/>',
    binoculars: '<circle cx="6.5" cy="15.5" r="3.5"/><circle cx="17.5" cy="15.5" r="3.5"/><path d="M10 15.5h4M4.5 12.5 7 5h2.5l.5 7.5M19.5 12.5 17 5h-2.5l-.5 7.5"/>',
    flame: '<path d="M12 21.5c-3.9 0-6.5-2.7-6.5-6.3 0-4.8 4.5-6.8 4.5-12 3 2 4.2 4.6 3.6 7.3 1-.5 2-1.8 2.3-3.3 1.8 1.8 2.6 4.6 2.6 7.7 0 3.9-2.6 6.6-6.5 6.6z"/>',
    camera: '<path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    phonecall: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.code}</svg>`;

  /* ------------------------------------------------- placeholder imagery */
  // Generates a stylised illustration (SVG data URI) for projects without screenshots.
  const HUES = [[124, 58, 237], [79, 70, 229], [167, 139, 250], [56, 189, 248], [109, 40, 217]];
  function mockImage(kind, seed, label) {
    const [r, g, b] = HUES[seed % HUES.length];
    const acc = `rgb(${r},${g},${b})`;
    const W = 1200, H = 750;
    const bg = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16161d"/><stop offset="1" stop-color="rgb(${r * 0.25 | 0},${g * 0.25 | 0},${b * 0.25 | 0})"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
    let body = "";
    if (kind === "phone") {
      const phone = (x, y, rot, tiles) => {
        let t = "";
        for (let i = 0; i < tiles; i++) {
          const cx = 20 + (i % 2) * 120, cy = 110 + Math.floor(i / 2) * 150;
          t += `<rect x="${cx}" y="${cy}" width="108" height="100" rx="12" fill="${i % 3 === 0 ? acc : "#2a2a35"}" opacity="${i % 3 === 0 ? 0.85 : 1}"/><rect x="${cx}" y="${cy + 110}" width="70" height="8" rx="4" fill="#3a3a48"/><rect x="${cx}" y="${cy + 124}" width="40" height="8" rx="4" fill="${acc}" opacity=".6"/>`;
        }
        return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect width="268" height="560" rx="36" fill="#0e0e13" stroke="#3a3a48" stroke-width="3"/><rect x="104" y="14" width="60" height="8" rx="4" fill="#2a2a35"/><rect x="20" y="48" width="150" height="16" rx="8" fill="#e8e8ee" opacity=".8"/><rect x="20" y="74" width="90" height="10" rx="5" fill="#5a5a6a"/>${t}<rect x="20" y="500" width="228" height="40" rx="20" fill="${acc}"/></g>`;
      };
      body = phone(330, 110, -8, 6) + phone(620, 80, 6, 6);
    } else {
      let rows = "";
      for (let i = 0; i < 5; i++) {
        const y = 430 + i * 44;
        rows += `<rect x="330" y="${y}" width="700" height="34" rx="6" fill="${i % 2 ? "#1d1d26" : "#22222c"}"/><rect x="346" y="${y + 12}" width="${120 + ((i * 37) % 90)}" height="10" rx="5" fill="#4a4a58"/><rect x="900" y="${y + 9}" width="${60 + (i % 3) * 14}" height="16" rx="8" fill="${acc}" opacity="${0.35 + (i % 3) * 0.2}"/>`;
      }
      let bars = "";
      for (let i = 0; i < 12; i++) {
        const h = 40 + ((i * 53 + seed * 31) % 120);
        bars += `<rect x="${710 + i * 26}" y="${390 - h}" width="16" height="${h}" rx="4" fill="${acc}" opacity="${0.4 + (i % 4) * 0.15}"/>`;
      }
      let cards = "";
      for (let i = 0; i < 3; i++) {
        cards += `<rect x="${330 + i * 124}" y="210" width="112" height="90" rx="12" fill="#22222c"/><rect x="${346 + i * 124}" y="228" width="50" height="8" rx="4" fill="#5a5a6a"/><rect x="${346 + i * 124}" y="250" width="${60 + i * 8}" height="22" rx="6" fill="${i === 0 ? acc : "#e8e8ee"}" opacity="${i === 0 ? 1 : 0.75}"/>`;
      }
      body = `<g><rect x="120" y="90" width="960" height="610" rx="18" fill="#101016" stroke="#2e2e3a" stroke-width="2"/><rect x="120" y="90" width="960" height="44" rx="18" fill="#191920"/><circle cx="150" cy="112" r="6" fill="#ff5f57"/><circle cx="172" cy="112" r="6" fill="#febc2e"/><circle cx="194" cy="112" r="6" fill="#28c840"/><rect x="420" y="102" width="360" height="20" rx="10" fill="#24242e"/><rect x="140" y="150" width="160" height="530" rx="12" fill="#16161d"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="160" y="${178 + i * 40}" width="${i === 1 ? 120 : 90}" height="12" rx="6" fill="${i === 1 ? acc : "#3a3a48"}"/>`).join("")}<rect x="330" y="160" width="260" height="20" rx="10" fill="#e8e8ee" opacity=".85"/>${cards}<rect x="700" y="210" width="330" height="190" rx="12" fill="#1a1a22"/>${bars}${rows}</g>`;
    }
    const t = "";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${bg}${body}${t}</svg>`);
  }
  /* ================================================================ RENDER */

  // ---- simple text bindings
  const nameParts = C.profile.name.trim().split(/\s+/);
  const binds = {
    initials: C.profile.initials,
    name: C.profile.name,
    firstNames: nameParts.slice(0, -1).join(" ") || C.profile.name,
    lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
    title: C.profile.title,
    rolesText: C.profile.roles.join(", "),
    valueStatement: C.profile.valueStatement,
    location: C.profile.location,
    workMode: C.profile.workMode,
    bio: C.profile.bio,
  };
  $$("[data-bind]").forEach((el) => { const v = binds[el.dataset.bind]; if (v != null) el.textContent = v; });

  // ---- availability
  const booked = C.availability.status === "booked";
  root.classList.toggle("is-booked", booked);
  $$("[data-status]").forEach((el) => {
    const text = el.dataset.status === "short"
      ? (booked ? C.availability.shortBooked : C.availability.shortAvailable)
      : (booked ? C.availability.bookedText : C.availability.availableText);
    el.innerHTML = `<span class="status__dot" aria-hidden="true"></span><span>${esc(text)}</span>`;
  });

  // ---- section numbering ("01 / About") — skips hidden sections automatically
  const testimonialsOn = Array.isArray(C.testimonials) && C.testimonials.length > 0;
  $("#testimonials").hidden = !testimonialsOn;
  if ($("#hobbies")) $("#hobbies").hidden = !(Array.isArray(C.hobbies) && C.hobbies.length);
  $$("section[data-label]").filter((s) => !s.hidden).forEach((s, i) => {
    const eb = $(".eyebrow", s);
    if (eb) eb.innerHTML = `<b>${pad(i + 1)}</b>&nbsp;/&nbsp;${esc(s.dataset.label)}`;
  });

  // ---- about
  (function renderAbout() {
    // One portrait, in the hero: transparent WebP + PNG fallback (made by tools/process_photo.py)
    const ph = C.profile.photo || {};
    const fallback = ph.fallback || ph.jpg || "";
    const portrait = $(".hero__portrait");
    if (ph.webp || fallback) {
      const img = $("img", portrait), src = $("source", portrait);
      if (ph.webp) src.srcset = ph.webp; else src.remove();
      img.src = fallback || ph.webp;
      img.alt = ph.alt || C.profile.name;
      portrait.hidden = false;
    }
    $(".about__story").innerHTML = C.about.story.map((p) => `<p>${esc(p)}</p>`).join("");
    $(".facts").innerHTML = C.about.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
    const openTo = C.availability.openTo.map((t) => `<span class="tag tag--accent">${esc(t)}</span>`).join("");
    $(".facts").insertAdjacentHTML("afterend", `<div class="open-to" aria-label="Open to">${openTo}</div>`);
    $(".about__actions").innerHTML =
      `<a href="#contact" class="btn btn--accent" data-magnetic>Work with me <span class="btn__arrow" aria-hidden="true">↗</span></a>` +
      (C.profile.resume ? `<a href="${esc(C.profile.resume)}" class="btn btn--ghost" download data-magnetic>${icon("download")} Resume (PDF)</a>` : "");
  })();

  // ---- services
  $(".services").innerHTML = C.services.map((s, i) => `
    <article class="service">
      <div class="service__top">
        <span class="service__icon">${icon(s.icon)}</span>
        <span class="service__num mono">${pad(i + 1)}</span>
      </div>
      <div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="service__more"><div>
          <ul class="service__list">${s.items.map((it) => `<li class="tag">${esc(it)}</li>`).join("")}</ul>
          <a href="#contact" class="service__link" data-plan="${esc(s.pricingId || "")}">Get a quote <span aria-hidden="true">→</span></a>
        </div></div>
      </div>
    </article>`).join("");

  // ---- skills + marquee
  const logoSrc = (it) => it.src || (it.devicon ? `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${it.devicon}.svg` : "");
  const logoImg = (it, size) => {
    const src = logoSrc(it);
    if (!src) return `<span class="skill__fallback" aria-hidden="true">${esc(it.name.slice(0, 2))}</span>`;
    return `<img src="${esc(src)}" alt="" width="${size}" height="${size}" loading="lazy" decoding="async" class="${it.invertDark ? "invert-dark" : ""}" data-fallback="${esc(it.name.slice(0, 2))}" />`;
  };
  // Stack section is optional (removed from index.html); the logo marquee below still uses C.skills
  const skillsEl = $(".skills");
  if (skillsEl) skillsEl.innerHTML = C.skills.map((g, gi) => `
    <div class="skills__group reveal">
      <h3><span>${pad(gi + 1)}</span>${esc(g.group)}</h3>
      <ul class="skills__items">${g.items.map((it) => `<li class="skill">${logoImg(it, 24)}<span>${esc(it.name)}</span></li>`).join("")}</ul>
    </div>`).join("");

  const allTech = C.skills.flatMap((g) => g.items);
  const marqueeGroup = (hidden) =>
    `<div class="marquee__group"${hidden ? ' aria-hidden="true"' : ""}>${allTech.map((it) => `<span class="marquee__item">${logoImg(it, 26)}${esc(it.name)}</span><span class="marquee__sep" aria-hidden="true">✦</span>`).join("")}</div>`;
  $(".marquee__track").innerHTML = marqueeGroup(false) + marqueeGroup(true);

  // swap broken logos for a text fallback
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.fallback) {
      const span = document.createElement("span");
      span.className = "skill__fallback"; span.setAttribute("aria-hidden", "true");
      span.textContent = img.dataset.fallback;
      img.replaceWith(span);
    }
  }, true);

  // ---- projects
  const projects = C.projects.map((p, i) => ({ ...p, _i: i }));
  const projImg = (p, n = 0) => (p.images && p.images[n]) || mockImage(p.mock, p._i + n, p.title);
  const isPh = (p, n = 0) => !(p.images && p.images[n]);
  const quoteTypeFor = (p) =>
    p.quoteType ||
    (p.categories.includes("government") ? "enterprise"
      : p.categories.includes("android") ? "android"
      : p.categories.includes("tools") ? "automation"
      : p.type === "Website" ? "website" : "web-system");
  const projectLinks = (p) => {
    if (p.confidential) return "";
    const l = p.links || {};
    return [
      l.demo && `<a href="${esc(l.demo)}" target="_blank" rel="noopener">${icon("external")} Live demo</a>`,
      l.repo && `<a href="${esc(l.repo)}" target="_blank" rel="noopener">${icon("code")} Source</a>`,
      l.caseStudy && `<a href="${esc(l.caseStudy)}" target="_blank" rel="noopener">${icon("doc")} Case study</a>`,
    ].filter(Boolean).join("");
  };
  const catLabel = (id) => (C.projectFilters.find((f) => f.id === id) || { label: id }).label;

  let currentFilter = "all";
  $(".filters").innerHTML = C.projectFilters.map((f) => {
    const count = f.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(f.id)).length;
    if (!count) return "";
    return `<button type="button" class="filter" data-filter="${esc(f.id)}" aria-pressed="${f.id === "all"}">${esc(f.label)}<sup>${count}</sup></button>`;
  }).join("");

  function renderProjects() {
    const list = projects.filter((p) => currentFilter === "all" || p.categories.includes(currentFilter));
    const wrap = $(".projects");
    if (!list.length) { wrap.innerHTML = `<p class="projects__empty">No projects in this category yet.</p>`; return; }
    wrap.innerHTML = list.map((p, k) => {
      const links = projectLinks(p);
      return `
      <article class="project ${p.confidential ? "is-confidential" : ""} reveal" style="--d:${(k % 3) * 0.08}s" data-tilt>
        <div class="project__media">
          <div class="project__badges">
            ${p.categories.map((c) => `<span class="tag">${esc(catLabel(c))}</span>`).join("")}
            ${p.confidential ? `<span class="tag tag--lock">${icon("lock")} Confidential: internal system</span>` : ""}
          </div>
          <img src="${projImg(p)}" alt="${isPh(p) ? "Illustration" : "Screenshot"} of ${esc(p.title)}" width="1200" height="750" loading="lazy" decoding="async" />
        </div>
        <div class="project__body">
          <div class="project__head">
            <div>
              <h3>${esc(p.title)}</h3>
              <p class="project__tagline">${esc(p.tagline)}</p>
            </div>
            <button type="button" class="project__open" data-project="${p._i}" aria-label="Open case study: ${esc(p.title)}">${icon("arrow")}</button>
          </div>
          <p class="project__summary">${esc(p.summary)}</p>
          <dl class="project__meta">
            <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
            <div><dt>Impact</dt><dd>${esc(p.impact)}</dd></div>
          </dl>
          ${links ? `<div class="project__links">${links}</div>` : ""}
        </div>
      </article>`;
    }).join("");
    observeReveals(wrap);
    bindTilt(wrap);
  }

  $(".filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn || btn.dataset.filter === currentFilter) return;
    currentFilter = btn.dataset.filter;
    $$(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const cards = $$(".project");
    if (reduced() || !cards.length) return renderProjects();
    cards.forEach((c) => c.classList.add("is-hiding"));
    setTimeout(renderProjects, 260);
  });

  // ---- stats
  $(".stats__grid").innerHTML = C.stats.map((s) => `
    <div class="stat">
      <p class="stat__value"><span class="count" data-to="${Number(s.value) || 0}">0</span><span>${esc(s.suffix)}</span></p>
      <p class="stat__label mono">${esc(s.label)}</p>
    </div>`).join("");

  // ---- pricing
  $(".pricing__intro").textContent = P.intro;
  $(".pricing__note").textContent = P.note;
  const hourlyOn = P.hourly && P.hourly.enabled;
  const hourlyBtn = $('.seg__btn[data-mode="hourly"]');
  if (hourlyOn) hourlyBtn.textContent = `${P.hourly.label}: ${money(P.hourly.rate)}/hr`;
  else $(".seg").remove();

  $(".pricing").innerHTML = P.plans.map((pl, i) => `
    <article class="plan ${pl.featured ? "plan--featured" : ""} reveal" style="--d:${(i % 3) * 0.08}s" data-tilt>
      ${pl.featured && pl.badge ? `<span class="plan__badge">${esc(pl.badge)}</span>` : ""}
      <h3>${esc(pl.title)}</h3>
      <p class="plan__desc">${esc(pl.desc)}</p>
      <div class="plan__price">
        <span class="plan__from">${pl.price == null ? "Pricing" : "Starting at"}</span>
        <span class="plan__amount" data-plan-price="${i}"><span class="swap">${planPrice(pl, "project")}</span></span>
        <span class="plan__hint" data-plan-hint="${i}"></span>
      </div>
      <p class="plan__timeline">${icon("clock")} ${esc(pl.timeline)}</p>
      <ul class="plan__list">${pl.includes.map((x) => `<li>${icon("check")}<span>${esc(x)}</span></li>`).join("")}</ul>
      <a href="#contact" class="btn ${pl.featured ? "btn--accent" : "btn--ghost"}" data-plan="${esc(pl.id)}">Get a quote <span class="btn__arrow" aria-hidden="true">↗</span></a>
    </article>`).join("");

  function planPrice(pl, mode) {
    if (pl.price == null) return "Custom quote";
    if (mode === "hourly" && hourlyOn && !pl.suffix) return `${money(P.hourly.rate)}<small> / hr</small>`;
    return `${money(pl.price)}${pl.suffix ? `<small> ${esc(pl.suffix)}</small>` : ""}`;
  }
  function setPricingMode(mode) {
    $$(".seg__btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    moveSegPill();
    P.plans.forEach((pl, i) => {
      const swap = $(`[data-plan-price="${i}"] .swap`);
      const hint = $(`[data-plan-hint="${i}"]`);
      const apply = () => {
        swap.innerHTML = planPrice(pl, mode);
        swap.classList.remove("is-out");
        hint.textContent = mode === "hourly" && pl.price != null && !pl.suffix
          ? `≈ ${Math.max(5, Math.round(pl.price / P.hourly.rate / 5) * 5)} hrs for a typical project`
          : "";
      };
      if (reduced()) return apply();
      swap.classList.add("is-out");
      setTimeout(apply, 200);
    });
  }
  function moveSegPill() {
    const seg = $(".seg");
    if (!seg) return;
    let pill = $(".seg__pill", seg);
    if (!pill) { pill = document.createElement("span"); pill.className = "seg__pill"; seg.prepend(pill); }
    const on = $('.seg__btn[aria-pressed="true"]', seg);
    pill.style.width = on.offsetWidth + "px";
    pill.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  if (hourlyOn) {
    $(".seg").addEventListener("click", (e) => { const b = e.target.closest(".seg__btn"); if (b) setPricingMode(b.dataset.mode); });
    requestAnimationFrame(moveSegPill);
    addEventListener("resize", moveSegPill);
    document.fonts && document.fonts.ready.then(moveSegPill);
  }

  // ---- estimator
  const E = P.estimator;
  const estType = $("#est-type"), estUnits = $("#est-units"), estOut = $("#est-units-out");
  estType.innerHTML = E.types.map((t) => `<option value="${esc(t.id)}">${esc(t.label)}</option>`).join("");
  $(".est-addons").innerHTML =
    E.addons.map((a) => `<label class="chip"><input type="checkbox" value="${esc(a.id)}" /><span>${esc(a.label)} <small>+${money(a.price)}</small></span></label>`).join("") +
    `<label class="chip"><input type="checkbox" value="__rush" /><span>${esc(E.rush.label)} <small>+${Math.round((E.rush.multiplier - 1) * 100)}%</small></span></label>`;

  let estShown = { low: 0, high: 0 }, estTarget = { low: 0, high: 0 }, estRaf = 0;
  const estType_ = () => E.types.find((t) => t.id === estType.value) || E.types[0];
  function syncUnits(reset) {
    const t = estType_();
    estUnits.max = t.max;
    if (reset) estUnits.value = t.included;
    $(".est-unit-label").textContent = t.unit[0].toUpperCase() + t.unit.slice(1);
    estOut.textContent = estUnits.value;
    estUnits.style.setProperty("--p", ((estUnits.value - estUnits.min) / (estUnits.max - estUnits.min)) * 100 + "%");
  }
  function computeEstimate() {
    const t = estType_();
    const units = +estUnits.value;
    let total = t.base + Math.max(0, units - t.included) * t.perUnit;
    const checked = $$(".est-addons input:checked").map((i) => i.value);
    E.addons.forEach((a) => { if (checked.includes(a.id)) total += a.price; });
    if (checked.includes("__rush")) total *= E.rush.multiplier;
    const low = Math.round(total / 1000) * 1000;
    const high = Math.round((low * E.spread) / 1000) * 1000;
    return { low, high, t, units, addons: E.addons.filter((a) => checked.includes(a.id)).map((a) => a.label), rush: checked.includes("__rush") };
  }
  function updateEstimate() {
    syncUnits(false);
    const r = computeEstimate();
    estTarget = { low: r.low, high: r.high };
    cancelAnimationFrame(estRaf);
    if (reduced()) { estShown = { ...estTarget }; return paintEstimate(); }
    const from = { ...estShown }, t0 = performance.now(), dur = 650;
    const step = (now) => {
      const k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      estShown = { low: from.low + (estTarget.low - from.low) * e, high: from.high + (estTarget.high - from.high) * e };
      paintEstimate();
      if (k < 1) estRaf = requestAnimationFrame(step);
    };
    estRaf = requestAnimationFrame(step);
  }
  function paintEstimate() {
    $(".est-low").textContent = money(estShown.low);
    $(".est-high").textContent = money(estShown.high);
  }
  estType.addEventListener("change", () => { syncUnits(true); updateEstimate(); });
  estUnits.addEventListener("input", updateEstimate);
  $(".est-addons").addEventListener("change", updateEstimate);
  syncUnits(true);
  updateEstimate();

  // ---- process
  $(".process").innerHTML = C.process.map((s, i) => `
    <li class="step reveal" style="--d:${i * 0.15}s">
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.desc)}</p>
    </li>`).join("");

  // ---- experience
  // Experience + hobbies sections are optional (removed from index.html); render only if present
  if ($(".timeline")) $(".timeline").innerHTML = `<span class="timeline__fill" aria-hidden="true"></span>` + C.experience.map((x) => `
    <li class="tl ${x.current ? "tl--current" : ""} reveal">
      <p class="tl__dates mono">${esc(x.dates)}</p>
      <h3>${esc(x.role)}${x.current ? ` <span class="badge-present">Present</span>` : ""}</h3>
      ${x.org ? `<p class="tl__org">${esc(x.org)}</p>` : ""}
      ${x.points && x.points.length
        ? `<ul class="tl__points">${x.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`
        : x.desc ? `<p class="tl__desc">${esc(x.desc)}</p>` : ""}
    </li>`).join("");

  // ---- beyond the code (hobbies bento)
  const hobbiesOn = !!$(".bento") && Array.isArray(C.hobbies) && C.hobbies.length > 0;
  if (hobbiesOn) {
    $(".hobbies__intro").textContent = C.hobbiesIntro || "";
    $(".bento").innerHTML = C.hobbies.map((h, i) => {
      const hasSlot = "photo" in h;
      const media = !hasSlot ? "" : h.photo
        ? `<div class="hobby__media"><img src="${esc(h.photo)}" alt="${esc(h.title)}" loading="lazy" decoding="async" /></div>`
        : `<div class="hobby__media hobby__media--ph" aria-hidden="true">${icon("camera")}<span class="mono">Photo placeholder</span><small>${esc(h.title)}: add a photo in siteConfig.js</small></div>`;
      return `
      <article class="hobby ${h.size ? "hobby--" + esc(h.size) : ""} ${hasSlot ? "hobby--photo" : ""} reveal" style="--d:${(i % 4) * 0.06}s">
        ${media}
        ${h.size === "wide" && !hasSlot ? `<span class="hobby__deco" aria-hidden="true">${icon(h.icon)}</span>` : ""}
        <div class="hobby__body">
          <span class="hobby__icon">${icon(h.icon)}</span>
          <h3>${esc(h.title)}</h3>
          <p>${esc(h.caption)}</p>
        </div>
      </article>`;
    }).join("");
  }

  // ---- testimonials
  if (testimonialsOn) {
    $(".testimonials").innerHTML = C.testimonials.map((t) => `
      <figure class="quote-card reveal">
        <blockquote>“${esc(t.quote)}”</blockquote>
        <figcaption><b>${esc(t.name)}</b>${esc(t.role || "")}</figcaption>
      </figure>`).join("");
  }

  // ---- FAQ (section is optional; removed from index.html)
  if ($(".faq")) $(".faq").innerHTML = C.faq.map((f, i) => `
    <div class="faq__item reveal">
      <h3><button type="button" class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span>
      </button></h3>
      <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div>
    </div>`).join("");
  $(".faq")?.addEventListener("click", (e) => {
    const q = e.target.closest(".faq__q");
    if (!q) return;
    const open = q.getAttribute("aria-expanded") !== "true";
    q.setAttribute("aria-expanded", String(open));
    $("#" + q.getAttribute("aria-controls")).classList.toggle("is-open", open);
  });

  // ---- contact
  (function renderContact() {
    const ct = C.contact;
    $(".contact__reply").textContent = ct.replyNote;
    const link = $(".contact__email-link");
    link.textContent = ct.email; link.href = "mailto:" + ct.email;
    $(".copy-email").innerHTML = icon("copy");
    if (ct.phone) $(".contact__phone").innerHTML = `<a href="tel:${esc(ct.phone.replace(/[^\d+]/g, ""))}">${esc(ct.phone)}</a>`;
    $(".socials").innerHTML = C.socials.map((s) =>
      `<li><a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener me" aria-label="${esc(s.label)}">${icon(s.icon)}</a></li>`).join("") +
      `<li><a class="icon-btn" href="mailto:${esc(ct.email)}" aria-label="Email">${icon("mail")}</a></li>`;
    const opt = (v, l) => `<option value="${esc(v)}">${esc(l ?? v)}</option>`;
    $("#q-type").innerHTML = `<option value="">Select a project type…</option>` + P.plans.map((p) => opt(p.id, p.title)).join("") + opt("other", "Something else");
    $("#q-budget").innerHTML = `<option value="">Select a range…</option>` + ct.budgets.map((b) => opt(b)).join("");
    $("#q-timeline").innerHTML = `<option value="">Select a timeline…</option>` + ct.timelines.map((t) => opt(t)).join("");
  })();

  const fe = $(".footer__email");
  fe.textContent = C.contact.email; fe.href = "mailto:" + C.contact.email;
  $(".footer__meta").textContent = `© ${new Date().getFullYear()} ${C.profile.name} · ${C.profile.location} · ${C.profile.workMode.replace(/\.$/, "")}`;

  /* ============================================================ INTERACTIONS */

  let menuOpen = false;

  // ---- scroll reveal + counters + timeline dots
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  function observeReveals(scope = document) {
    $$(".reveal:not(.is-in)", scope).forEach((el) => {
      if (reduced()) el.classList.add("is-in"); else revealIO.observe(el);
    });
  }
  observeReveals();

  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target, to = +el.dataset.to;
      if (reduced()) { el.textContent = to.toLocaleString(); return; }
      const t0 = performance.now(), dur = 1800;
      const tick = (now) => {
        const k = clamp((now - t0) / dur, 0, 1);
        const v = k === 1 ? to : to * (1 - Math.pow(2, -10 * k));
        el.textContent = Math.round(v).toLocaleString();
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  $$(".count").forEach((c) => countIO.observe(c));

  const tlEl = $(".timeline"), tlFill = $(".timeline__fill");
  function updateTimeline() {
    if (!tlEl) return;
    const r = tlEl.getBoundingClientRect();
    const p = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
    tlFill.style.setProperty("--tp", reduced() ? 1 : p);
  }

  // ---- toast
  let toastT;
  function toast(msg) {
    const t = $(".toast");
    t.textContent = msg; t.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-visible"), 2400);
  }

  // ---- copy email
  $(".copy-email").addEventListener("click", async () => {
    const email = C.contact.email;
    try { await navigator.clipboard.writeText(email); }
    catch {
      const ta = document.createElement("textarea"); ta.value = email; document.body.append(ta); ta.select();
      try { document.execCommand("copy"); } catch {} ta.remove();
    }
    const b = $(".copy-email"); b.innerHTML = icon("check");
    toast("Email copied to clipboard");
    setTimeout(() => (b.innerHTML = icon("copy")), 1800);
  });

  // ---- theme
  function setTheme(next, origin) {
    const apply = () => {
      root.setAttribute("data-theme", next);
      $$('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", next === "dark" ? "#0B0B0F" : "#F4F1EA"));
    };
    try { localStorage.setItem("theme", next); } catch {}
    if (!document.startViewTransition || reduced()) return apply();
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" });
    });
  }
  $(".theme-toggle").addEventListener("click", (e) => setTheme(root.dataset.theme === "dark" ? "light" : "dark", e.currentTarget));

  // ---- smooth scroll (Lenis) — skipped for reduced motion
  let lenis = null;
  if (window.Lenis && !reduced()) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const navH = () => $("#nav").offsetHeight;
  function scrollToEl(target, cb) {
    if (lenis) lenis.scrollTo(target, { offset: target.id === "top" ? 0 : -navH() - 12, duration: 1.2, onComplete: cb });
    else { target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }); if (cb) setTimeout(cb, reduced() ? 0 : 700); }
  }

  // anchor links + "Get a quote" pre-selection
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    if (menuOpen) closeMenu();
    const plan = a.dataset.plan;
    if (plan != null && plan !== "") prefillQuote(plan);
    if (a.classList.contains("est-cta")) prefillFromEstimate();
    scrollToEl(target, () => {
      if (id === "contact") $("#q-name").focus({ preventScroll: true });
    });
    history.replaceState(null, "", id === "top" ? location.pathname : "#" + id);
  });

  function prefillQuote(planId) {
    const sel = $("#q-type");
    if ([...sel.options].some((o) => o.value === planId)) {
      sel.value = planId;
      sel.dispatchEvent(new Event("change"));
    }
  }
  function prefillFromEstimate() {
    const r = computeEstimate();
    prefillQuote(r.t.id);
    const desc = $("#q-desc");
    if (!desc.value.trim()) {
      desc.value = `Estimator: ${r.t.label}, ${r.units} ${r.t.unit}` +
        (r.addons.length ? `, add-ons: ${r.addons.join(", ")}` : "") +
        (r.rush ? ", rush delivery" : "") +
        `. Estimated ${money(r.low)}–${money(r.high)}.\n\nAbout my project: `;
    }
  }

  // ---- nav: scrolled state, progress bar, active link, floating CTA
  const nav = $("#nav"), bar = $(".progress span"), fab = $(".fab");
  let heroVisible = true, contactVisible = false, footerVisible = false;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    updateTimeline();
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const updateFab = () => fab.classList.toggle("is-visible", !heroVisible && !contactVisible && !footerVisible && !menuOpen);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; updateFab(); }, { rootMargin: "-40% 0px 0px 0px" }).observe($(".hero"));
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; updateFab(); }, { threshold: 0.05 }).observe($("#contact .contact__grid"));
  new IntersectionObserver(([e]) => { footerVisible = e.isIntersecting; updateFab(); }).observe($(".footer"));

  const navLinks = $$(".nav__links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // ---- mobile menu
  const menu = $("#menu"), burger = $(".burger");
  function openMenu() {
    menuOpen = true; menu.hidden = false;
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    requestAnimationFrame(() => menu.classList.add("is-open"));
    lenis ? lenis.stop() : (document.body.style.overflow = "hidden");
    updateFab();
    setTimeout(() => $("a", menu).focus(), 200);
  }
  function closeMenu() {
    menuOpen = false;
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
    lenis ? lenis.start() : (document.body.style.overflow = "");
    setTimeout(() => { if (!menuOpen) menu.hidden = true; }, reduced() ? 0 : 700);
    updateFab();
  }
  burger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener("keydown", (e) => {
    if (!menuOpen) return;
    if (e.key === "Escape") { closeMenu(); burger.focus(); }
    if (e.key === "Tab") { // keep focus inside menu + burger
      const items = [burger, ...$$("a", menu)];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  addEventListener("resize", () => { if (menuOpen && innerWidth >= 1024) closeMenu(); });


  // ---- hero: split letters, then reveal
  $$(".hero .split").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "word";
            [...part].forEach((ch) => {
              const c = document.createElement("span"); c.className = "char"; c.textContent = ch;
              c.style.setProperty("--i", i++); w.append(c);
            });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  });
  $(".hero__title").setAttribute("aria-label", C.profile.name);
  $$(".hero__title > *").forEach((el) => el.setAttribute("aria-hidden", "true"));
  const ready = () => requestAnimationFrame(() => root.classList.add("is-loaded"));
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]) : Promise.resolve()).then(ready);

  // ---- typing role line
  (function typer() {
    const el = $(".typer"), roles = C.profile.roles;
    if (!el || !roles.length) return;
    if (reduced()) { el.textContent = roles.join(" · "); return; }
    let r = 0, i = 0, del = false;
    const tick = () => {
      const word = roles[r];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      let delay = del ? 35 : 75;
      if (!del && i === word.length) { del = true; delay = 1600; }
      else if (del && i === 0) { del = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1400);
  })();

  // ---- magnetic buttons
  function bindMagnetic(scope = document) {
    if (!fine()) return;
    $$("[data-magnetic]", scope).forEach((el) => {
      if (el._mag) return; el._mag = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }
  bindMagnetic();

  // ---- 3D tilt + glow position
  function bindTilt(scope = document) {
    if (!fine()) return;
    $$("[data-tilt]", scope).forEach((el) => {
      if (el._tilt) return; el._tilt = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }
  bindTilt();

  // service card spotlight
  $(".services").addEventListener("pointermove", (e) => {
    const card = e.target.closest(".service"); if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  // ---- custom cursor (desktop, fine pointer, motion OK)
  (function cursor() {
    if (!fine()) return;
    root.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      cur.classList.remove("is-hidden");
    }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = "a, button, select, label, summary, [data-tilt], input[type=range], input[type=checkbox]";
    document.addEventListener("pointerover", (e) => cur.classList.toggle("is-hover", !!e.target.closest(hoverSel)));
    document.addEventListener("pointerdown", () => cur.classList.add("is-down"));
    document.addEventListener("pointerup", () => cur.classList.remove("is-down"));
    document.documentElement.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
  })();

  // ---- hero canvas: dot field that gently reacts to the mouse
  (function heroCanvas() {
    const canvas = $(".hero__canvas"), hero = $(".hero");
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [], running = false, visible = true, t = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const GAP = 30;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) pts.push({ x, y });
      draw();
    }
    function draw() {
      const rgb = getComputedStyle(root).getPropertyValue("--dot").trim() || "242,241,236";
      const accent = getComputedStyle(root).getPropertyValue("--accent").trim();
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08;
      const R = 160;
      for (const p of pts) {
        const wave = reduced() ? 0 : Math.sin(t * 0.0008 + p.x * 0.012 + p.y * 0.008) * 2.2;
        let x = p.x, y = p.y + wave;
        const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy);
        let a = 0.12, s = 1.1;
        if (d < R) {
          const f = 1 - d / R;
          x += (dx / (d || 1)) * f * 14; y += (dy / (d || 1)) * f * 14;
          a += f * 0.55; s += f * 1.4;
        }
        // fade dots towards the left/bottom so text stays crisp
        const fade = clamp(x / w + 0.25, 0.25, 1) * clamp(1.15 - y / h, 0.2, 1);
        ctx.fillStyle = d < R * 0.35 ? accent : `rgba(${rgb},${a * fade})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    function frame(now) {
      if (!running) return;
      t = now; draw(); requestAnimationFrame(frame);
    }
    function start() { if (!running && visible && !reduced() && !document.hidden) { running = true; requestAnimationFrame(frame); } }
    function stop() { running = false; }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if (fine()) {
      hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; });
      hero.addEventListener("pointerleave", () => { mouse.tx = -9999; mouse.ty = -9999; });
    }
    new MutationObserver(() => { if (!running) draw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    resize(); start();
  })();

  // ---- project modal
  const modal = $(".modal"), modalInner = $(".modal__inner");
  modalInner.setAttribute("data-lenis-prevent", "");
  function openProject(idx) {
    const p = projects[idx];
    const d = p.detail || {};
    const shots = (p.images && p.images.length > 1 ? p.images.slice(1) : p.images && p.images.length ? [] : [null, null]).map((src, n) =>
      `<figure>${src ? `<img src="${esc(src)}" alt="Screenshot ${n + 1} of ${esc(p.title)}" loading="lazy" />` : `<img src="${mockImage(p.mock, p._i + n + 1)}" alt="Illustration of ${esc(p.title)}" loading="lazy" />`}</figure>`).join("");
    const links = projectLinks(p);
    let n = 0;
    const step = (title, html) => html ? `<section class="case__step"><h4><span>${pad(++n)}</span>${title}</h4>${html}</section>` : "";
    modal.classList.toggle("is-confidential", !!p.confidential);
    modalInner.innerHTML = `
      <div class="modal__bar"><button type="button" class="icon-btn modal__close" aria-label="Close">${icon("close")}</button></div>
      <div class="modal__hero">
        <img src="${projImg(p)}" alt="${isPh(p) ? "Illustration" : "Screenshot"} of ${esc(p.title)}" />
      </div>
      <div class="modal__content">
        <header>
          <div class="project__badges" style="position:static;margin-bottom:1rem">
            ${p.categories.map((c) => `<span class="tag">${esc(catLabel(c))}</span>`).join("")}
            ${p.confidential ? `<span class="tag tag--lock">${icon("lock")} Confidential: internal system</span>` : ""}
          </div>
          <h2 class="modal__title" id="modal-title">${esc(p.title)}</h2>
          <p class="modal__tagline">${esc(p.tagline)}</p>
        </header>
        <dl class="modal__facts">
          <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>Type</dt><dd>${esc(p.type)}</dd></div>
          <div><dt>Impact</dt><dd>${esc(p.impact)}</dd></div>
        </dl>
        <div class="case">
          ${step("Problem", d.problem && `<p>${esc(d.problem)}</p>`)}
          ${step("Solution", d.solution && `<p>${esc(d.solution)}</p>`)}
          ${step("Features", d.features && d.features.length && `<ul>${d.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`)}
          ${step("Screenshots", shots && `<div class="modal__shots">${shots}</div>`)}
          ${step("Result", d.result && `<p>${esc(d.result)}</p>`)}
        </div>
        ${p.confidential ? `<p class="modal__notice">${icon("lock")} This is an internal system. Screenshots are blurred or mocked to protect confidential data, and live links aren't public.</p>` : ""}
        <div class="modal__actions">
          <a href="#contact" class="btn btn--accent" data-plan="${esc(quoteTypeFor(p))}" data-close-modal>Start a similar project <span class="btn__arrow" aria-hidden="true">↗</span></a>
          ${links ? `<div class="project__links" style="align-self:center">${links}</div>` : ""}
        </div>
      </div>`;
    modal.showModal();
    modalInner.scrollTop = 0;
    if (lenis) lenis.stop();
    bindMagnetic(modal);
  }
  function closeModal() {
    if (!modal.open) return;
    const done = () => { modal.classList.remove("is-closing"); modal.close(); };
    if (reduced()) return done();
    modal.classList.add("is-closing");
    modal.addEventListener("animationend", done, { once: true });
  }
  modal.addEventListener("close", () => { if (lenis) lenis.start(); });
  modal.addEventListener("cancel", (e) => { e.preventDefault(); closeModal(); });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal__close")) closeModal();
    if (e.target.closest("[data-close-modal]")) { modal.classList.remove("is-closing"); modal.close(); }
  });
  $(".projects").addEventListener("click", (e) => {
    const b = e.target.closest(".project__open");
    if (b) openProject(+b.dataset.project);
  });

  // ---- quote form
  const form = $("#quote-form");
  const fields = {
    name: { el: $("#q-name"), check: (v) => (v.trim().length >= 2 ? "" : "Please enter your name.") },
    email: { el: $("#q-email"), check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address.") },
    projectType: { el: $("#q-type"), check: (v) => (v ? "" : "Please choose a project type.") },
    description: { el: $("#q-desc"), check: (v) => (v.trim().length >= 15 ? "" : "Tell me a little more (at least 15 characters).") },
    link: { el: $("#q-link"), check: (v) => { if (!v.trim()) return ""; try { new URL(v.trim()); return ""; } catch { return "Please enter a full link starting with https://"; } } },
  };
  function validateField(f) {
    const msg = f.check(f.el.value);
    const err = $("#" + f.el.id + "-err");
    f.el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) f.el.setAttribute("aria-describedby", err.id); else f.el.removeAttribute("aria-describedby");
    err.textContent = msg;
    return !msg;
  }
  Object.values(fields).forEach((f) => {
    f.el.addEventListener("blur", () => { if (f.el.value) validateField(f); });
    f.el.addEventListener("input", () => { if (f.el.getAttribute("aria-invalid") === "true") validateField(f); });
    f.el.addEventListener("change", () => { if (f.el.getAttribute("aria-invalid") === "true") validateField(f); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bad = Object.values(fields).filter((f) => !validateField(f));
    if (bad.length) { bad[0].el.focus(); $(".quote__status").textContent = "Please fix the highlighted fields."; return; }

    const data = Object.fromEntries(new FormData(form));
    const status = $(".quote__status"), btn = $(".quote__submit");
    if (data._gotcha) return showSuccess("Thanks!"); // bot
    delete data._gotcha;
    const typeLabel = $("#q-type").selectedOptions[0].textContent;
    const endpoint = C.contact.formEndpoint;

    if (!endpoint) {
      // No backend configured → open the visitor's email app with everything pre-filled.
      const lines = [
        `Name: ${data.name}`, `Email: ${data.email}`, data.organization && `Organization: ${data.organization}`,
        `Project type: ${typeLabel}`, data.budget && `Budget: ${data.budget}`, data.timeline && `Timeline: ${data.timeline}`,
        data.link && `Files / references: ${data.link}`,
      ].filter(Boolean);
      const body = lines.join("\n") + "\n\n" + data.description;
      location.href = `mailto:${C.contact.email}?subject=${encodeURIComponent("Project inquiry: " + typeLabel)}&body=${encodeURIComponent(body)}`;
      return showSuccess("Your email app should open with the request ready. Just hit send. " + C.contact.replyNote);
    }

    btn.disabled = true; btn.classList.add("is-loading");
    $(".quote__submit-label").textContent = "Sending…"; status.textContent = "";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, projectType: typeLabel, _subject: "Project inquiry: " + typeLabel, _replyto: data.email }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      showSuccess(`Thanks, ${data.name.split(" ")[0]}! ${C.contact.replyNote}`);
    } catch (err) {
      status.innerHTML = `Something went wrong sending your request. Please email me directly at <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a>.`;
    } finally {
      btn.disabled = false; btn.classList.remove("is-loading");
      $(".quote__submit-label").textContent = "Send request";
    }
  });
  function showSuccess(msg) {
    const s = $(".quote__success");
    $("p", s).textContent = msg;
    s.hidden = false;
    $(".quote__status").textContent = "";
    $(".quote__again", s).focus({ preventScroll: true });
  }
  $(".quote__again").addEventListener("click", () => {
    form.reset();
    Object.values(fields).forEach((f) => f.el.removeAttribute("aria-invalid"));
    $(".quote__success").hidden = true;
    $("#q-name").focus();
  });

  // initial projects render (after helpers exist)
  renderProjects();
  bindMagnetic();

  // Person structured data for search engines
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Person",
    name: C.profile.name, jobTitle: C.profile.title,
    description: C.profile.bio, email: "mailto:" + C.contact.email,
    address: { "@type": "PostalAddress", addressLocality: "Baguio City", postalCode: "2600", addressCountry: "PH" },
    homeLocation: { "@type": "Place", name: C.profile.location },
    sameAs: C.socials.map((s) => s.url),
    knowsAbout: allTech.map((t) => t.name),
  });
  document.head.append(ld);
})();
