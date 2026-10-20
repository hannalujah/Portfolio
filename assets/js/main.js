/* Renders the page from window.PORTFOLIO (data/content.js or data/content-embedded.js).
   Every section is optional: if a page leaves out a container, that section is skipped. */
(function () {
  "use strict";

  const data = window.PORTFOLIO;
  if (!data) {
    console.error("data/content.js did not load: window.PORTFOLIO is missing.");
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hasUrl = (l) => l && typeof l.url === "string" && l.url.trim() !== "";
  // Pages in a subfolder set <html data-base="../">, so content paths like "assets/img/x.png"
  // are written once, relative to the site root, and resolved here.
  const BASE = document.documentElement.dataset.base || "";
  const asset = (u) => (u && !/^([a-z]+:|\/|#|\.\.\/)/i.test(u) ? BASE + u : u);
  const fill = (sel, html) => {
    const el = $(sel);
    if (el) el.innerHTML = html;
  };

  // A content file can define its own categories: { key: { label, badge, art } },
  // where `art` picks the placeholder drawing (research | academic | engineering).
  const CATEGORIES = data.categories || {
    research: { label: "Research", badge: "badge-accent" },
    academic: { label: "Academic", badge: "badge-warm" },
    engineering: { label: "Engineering", badge: "" }
  };

  const ICONS = {
    email: '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.2V17h16V7.2l-8 5.3-8-5.3zM5.6 7 12 11.2 18.4 7H5.6z"/></svg>',
    cv: '<svg viewBox="0 0 24 24"><path d="M6 2h8l6 6v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm7 1.5V9h5.5L13 3.5zM8 13h8v1.6H8V13zm0 3.4h8V18H8v-1.6z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3h.1c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6.5 9.6V16c0 2.2 2.9 4 6.5 4s6.5-1.8 6.5-4v-3.4L12 16.2l-6.5-3.6z"/></svg>',
    orcid: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.3 17.3H6.8V8.1h1.5v9.2zM7.6 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.1 1.1h3.6c3.4 0 4.9 2.4 4.9 4.6 0 2.4-1.9 4.6-4.9 4.6h-3.6V8.1zm1.5 1.4v6.5h2c2.4 0 3.4-1.6 3.4-3.2 0-1.8-1.2-3.3-3.4-3.3h-2z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>'
  };

  // Placeholder art for projects without an image, one per category.
  const PLACEHOLDERS = {
    research:
      '<svg viewBox="0 0 160 90" fill="none" stroke-width="1.6"><circle cx="80" cy="45" r="5" fill="var(--moon)" stroke="none"/><ellipse cx="80" cy="45" rx="22" ry="38" stroke="var(--dro)"/><path d="M83 49c18-9 22-38 8-44-12-5-17 18-8 44z" stroke="var(--nrho)"/><path d="M91 5c22 3 26 28 11 40" stroke="var(--xfer)" stroke-dasharray="4 4"/></svg>',
    academic:
      '<svg viewBox="0 0 160 90" fill="none" stroke-width="1.6"><circle cx="80" cy="45" r="30" stroke="var(--border)"/><rect x="72" y="37" width="16" height="16" rx="2" stroke="var(--accent)"/><path d="M50 45h22M88 45h22" stroke="var(--accent)"/><rect x="38" y="40" width="12" height="10" stroke="var(--dro)"/><rect x="110" y="40" width="12" height="10" stroke="var(--dro)"/><path d="M80 37V22" stroke="var(--nrho)" stroke-dasharray="3 3"/></svg>',
    engineering:
      '<svg viewBox="0 0 160 90" fill="none" stroke-width="1.6"><rect x="60" y="25" width="40" height="40" rx="4" stroke="var(--accent)"/><rect x="70" y="35" width="20" height="20" rx="2" stroke="var(--nrho)"/><path d="M68 25v-8M80 25v-8M92 25v-8M68 65v8M80 65v8M92 65v8M60 37h-8M60 53h-8M100 37h8M100 53h8" stroke="var(--muted)"/></svg>'
  };

  /* ---------------- Profile / hero ---------------- */
  const p = data.profile;
  document.querySelectorAll('[data-bind="name"]').forEach((el) => (el.textContent = p.name));
  $('[data-bind="role"]').textContent = p.role;
  $('[data-bind="tagline"]').textContent = p.tagline;
  $('[data-bind="initials"]').textContent = p.name.split(/\s+/).map((w) => w[0]).join("");
  $("#year").textContent = new Date().getFullYear();

  function actionButtons() {
    const L = p.links || {};
    const btns = [];
    if (p.cv) btns.push(`<a class="btn btn-primary" href="${esc(asset(p.cv))}" target="_blank" rel="noopener">${ICONS.cv}CV</a>`);
    if (emails[0]) btns.push(`<a class="btn" href="mailto:${esc(emails[0])}">${ICONS.email}Email</a>`);
    if (L.scholar) btns.push(`<a class="btn" href="${esc(L.scholar)}" target="_blank" rel="noopener">${ICONS.scholar}Scholar</a>`);
    if (L.github) btns.push(`<a class="btn" href="${esc(L.github)}" target="_blank" rel="noopener">${ICONS.github}GitHub</a>`);
    if (L.linkedin) btns.push(`<a class="btn" href="${esc(L.linkedin)}" target="_blank" rel="noopener">${ICONS.linkedin}LinkedIn</a>`);
    if (L.orcid) btns.push(`<a class="btn" href="${esc(L.orcid)}" target="_blank" rel="noopener">${ICONS.orcid}ORCID</a>`);
    return btns.join("");
  }
  const emails = [].concat((p.links && (p.links.emails || p.links.email)) || []);
  fill("#hero-actions", actionButtons());
  fill("#contact-actions", actionButtons());
  fill("#email-list", emails
    .map((e) => `<li>${ICONS.email}<a href="mailto:${esc(e)}">${esc(e)}</a></li>`)
    .join(""));

  /* ---------------- About ---------------- */
  if (p.photo && $("#about-photo")) {
    const img = $("#about-photo");
    img.src = asset(p.photo);
    img.hidden = false;
  }
  fill("#about-text", (data.about || []).map((t) => `<p>${esc(t)}</p>`).join(""));
  fill("#interests", (data.researchInterests || []).map((t) => `<li>${esc(t)}</li>`).join(""));

  fill(
    "#capabilities-grid",
    (data.capabilities || [])
      .map(
        (c) => `
      <article class="card capability">
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
        ${c.tags && c.tags.length ? `<div class="tags">${c.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
      </article>`
      )
      .join("")
  );
  // Education details may contain simple HTML (e.g. <strong>), so they are not escaped.
  fill("#education", (data.education || [])
    .map(
      (e) => `
      <article class="card edu-item">
        <div>
          <h3>${esc(e.degree)}</h3>
          <div class="meta">${esc(e.school)} · ${esc(e.location)}</div>
        </div>
        <div class="when">${esc(e.dates)}</div>
        ${e.details && e.details.length ? `<ul>${e.details.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
      </article>`
    )
    .join(""));

  /* ---------------- Publications ---------------- */
  function boldSelf(authors) {
    const safe = esc(authors);
    const me = esc(p.shortName || "");
    return me ? safe.split(me).join(`<strong>${me}</strong>`) : safe;
  }
  function linkChips(links) {
    return (links || [])
      .filter(hasUrl)
      .map((l) => `<a class="link-chip" href="${esc(asset(l.url))}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`)
      .join("");
  }
  fill("#pub-list", (data.publications || [])
    .map((pub) => {
      const statusClass = /published/i.test(pub.status) ? "badge-accent" : "badge-warm";
      const chips = linkChips(pub.links);
      return `
      <li class="card pub">
        <div class="pub-head">
          <span class="badge ${statusClass}">${esc(pub.status)}</span>
          <span class="badge">${esc(pub.date)}</span>
        </div>
        <h3 class="pub-title">${esc(pub.title)}</h3>
        <p class="pub-authors">${boldSelf(pub.authors)}</p>
        <p class="pub-venue">${esc(pub.venue)}</p>
        ${pub.highlights && pub.highlights.length ? `<ul>${pub.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        ${chips ? `<div class="pub-links">${chips}</div>` : ""}
      </li>`;
    })
    .join(""));

  /* ---------------- Projects ---------------- */
  const projects = (data.projects || [])
    .map((pr, i) => ({ ...pr, _i: i }))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a._i - b._i);

  function categoryBadge(cat) {
    const c = CATEGORIES[cat] || { label: cat || "Other", badge: "" };
    return `<span class="badge ${c.badge}">${esc(c.label)}</span>`;
  }

  function thumb(pr) {
    const src = pr.thumb || pr.image;
    if (src) return `<div class="project-thumb"><img src="${esc(asset(src))}" alt="" loading="lazy"></div>`;
    const art = (CATEGORIES[pr.category] && CATEGORIES[pr.category].art) || pr.category;
    return `<div class="project-thumb placeholder" aria-hidden="true">${PLACEHOLDERS[art] || PLACEHOLDERS.engineering}</div>`;
  }

  function renderFilters() {
    const counts = projects.reduce((acc, pr) => ((acc[pr.category] = (acc[pr.category] || 0) + 1), acc), {});
    const tabs = [["all", "All", projects.length]].concat(
      Object.keys(CATEGORIES)
        .filter((k) => counts[k])
        .map((k) => [k, CATEGORIES[k].label, counts[k]])
    );
    $("#filters").innerHTML = tabs
      .map(
        ([key, label, n], i) =>
          `<button class="filter-btn" role="tab" data-filter="${key}" aria-selected="${i === 0}">${esc(label)}<span class="count">${n}</span></button>`
      )
      .join("");
    $("#filters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      document.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-selected", b === btn));
      renderProjects(btn.dataset.filter);
    });
  }

  function renderProjects(filter = "all") {
    const list = filter === "all" ? projects : projects.filter((pr) => pr.category === filter);
    $("#project-grid").innerHTML = list.length
      ? list
          .map(
            (pr) => `
        <button class="card project-card" data-id="${esc(pr.id)}" aria-haspopup="dialog">
          ${thumb(pr)}
          <div class="project-content">
            <div class="project-meta">
              ${categoryBadge(pr.category)}
              ${pr.featured ? '<span class="badge badge-warm">Featured</span>' : ""}
              <span class="date">${esc(pr.date)}</span>
            </div>
            <h3>${esc(pr.title)}</h3>
            <p>${esc(pr.summary)}</p>
            <div class="tags">${(pr.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          </div>
        </button>`
          )
          .join("")
      : '<p class="empty-state">Nothing here yet.</p>';
  }

  const dialog = $("#project-dialog");

  function openProject(id, { updateHash = true } = {}) {
    const pr = projects.find((x) => x.id === id);
    if (!pr || typeof dialog.showModal !== "function") return;
    const chips = linkChips(pr.links);
    const gallery = (pr.gallery || [])
      .map(
        (g) => `<figure><a href="${esc(asset(g.src))}" target="_blank" rel="noopener"><img src="${esc(asset(g.src))}" alt="${esc(g.caption || "")}" loading="lazy"></a>${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`
      )
      .join("");
    $("#dialog-body").innerHTML = `
      ${pr.image ? `<div class="dialog-hero"><img src="${esc(asset(pr.image))}" alt=""></div>` : ""}
      <div class="dialog-content">
        <div class="project-meta">${categoryBadge(pr.category)}<span class="date">${esc(pr.date)}</span></div>
        <h3 id="dialog-title">${esc(pr.title)}</h3>
        <ul>${(pr.details && pr.details.length ? pr.details : [pr.summary]).map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        <div class="tags">${(pr.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${gallery ? `<div class="dialog-gallery">${gallery}</div>` : ""}
        ${chips ? `<div class="pub-links" style="margin-top:18px">${chips}</div>` : ""}
      </div>`;
    dialog.showModal();
    dialog.scrollTop = 0;
    if (updateHash) history.replaceState(null, "", "#project-" + pr.id);
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener("close", () => {
    if (location.hash.startsWith("#project-")) history.replaceState(null, "", "#projects");
  });
  dialog.addEventListener("click", (e) => {
    // Click on the backdrop or the close button
    if (e.target === dialog || e.target.closest("[data-close]")) closeDialog();
  });
  $("#project-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card) openProject(card.dataset.id);
  });

  renderFilters();
  renderProjects();

  /* ---------------- Experience ---------------- */
  fill("#timeline", (data.experience || [])
    .map(
      (x) => `
      <li class="tl-item reveal">
        <div class="tl-head">
          <h3>${esc(x.role)}</h3>
          <span class="tl-when">${esc(x.dates)}</span>
        </div>
        <p class="tl-org">${esc(x.org)} · ${esc(x.location)}</p>
        ${x.bullets && x.bullets.length ? `<ul>${x.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        ${x.tags && x.tags.length ? `<div class="tags tl-tags">${x.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
      </li>`
    )
    .join(""));

  /* ---------------- Teaching ---------------- */
  fill("#teach-grid", (data.teaching || [])
    .map(
      (t) => `
      <article class="card teach-card">
        <span class="badge">${esc(t.terms)}</span>
        <h3 style="margin-top:10px">${esc(t.course)}</h3>
        <p class="meta">Instructor: ${esc(t.instructor)}<br>${esc(t.school)}</p>
        <p>${esc(t.duties)}</p>
      </article>`
    )
    .join(""));

  /* ---------------- Skills / certs / awards ---------------- */
  fill("#skills-grid", (data.skills || [])
    .map(
      (g) => `
      <div class="card skill-group">
        <h3>${esc(g.group)}</h3>
        <div class="tags">${g.items.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      </div>`
    )
    .join(""));

  fill("#certs", (data.certifications || [])
    .map((c) => {
      const title = hasUrl(c) ? `<a href="${esc(asset(c.url))}" target="_blank" rel="noopener">${esc(c.title)}</a>` : esc(c.title);
      return `<li>${title} <span class="issuer">· ${esc(c.issuer)}</span></li>`;
    })
    .join(""));

  fill("#awards", (data.awards || []).map((a) => `<li>${esc(a)}</li>`).join(""));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  $(".theme-toggle").addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  /* ---------------- Mobile nav ---------------- */
  const navToggle = $(".nav-toggle");
  const navLinks = $("#nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------------- Active nav link + reveal on scroll ---------------- */
  if ("IntersectionObserver" in window) {
    const links = [...document.querySelectorAll(".nav-links a")];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

    if (!reduceMotion) {
      const rv = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("visible");
              rv.unobserve(en.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" }
      );
      // Project cards are skipped: they re-render on filter and have their own hover transform.
      document.querySelectorAll(".section .card:not(.project-card), .reveal").forEach((el) => {
        el.classList.add("reveal");
        rv.observe(el);
      });
    }
  }

  /* ---------------- Deep link: #project-<id> opens that project ---------------- */
  if (location.hash.startsWith("#project-")) {
    const id = location.hash.slice("#project-".length);
    $("#projects").scrollIntoView();
    openProject(id, { updateHash: false });
  }
})();
