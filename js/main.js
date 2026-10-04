/* ==========================================================
   main.js — navigation, footer, page flow, progress,
   page transitions, intro screen and page interactions.
   ========================================================== */

/* ---------- Site map (order = story order) ---------- */
const PAGES = [
  { id: "home",          file: "index.html",         title: "Home",          menuTitle: "Home",               sub: "Where it all begins",                   inNav: true },
  { id: "her-story",     file: "her-story.html",     title: "Her Story",     menuTitle: "Her Story",          sub: "Every chapter, at her own pace",        inNav: true },
  { id: "about-her",     file: "about-her.html",     title: "About Her",     menuTitle: "About Her",          sub: "The girl, the habits, the personality", inNav: true },
  { id: "family",        file: "family.html",        title: "Family",        menuTitle: "Family",             sub: "The little world that shaped her",      inNav: true },
  { id: "grandmother",   file: "grandmother.html",   title: "For Her Paati", menuTitle: "For Her Paati",      sub: "A quiet page",                          inNav: false },
  { id: "friendships",   file: "friendships.html",   title: "Friendships",   menuTitle: "Friendships",        sub: "People who make ordinary days better",  inNav: true },
  { id: "little-things", file: "little-things.html", title: "Little Things", menuTitle: "Little Things",      sub: "An unofficial field guide",             inNav: true },
  { id: "memories",      file: "memories.html",      title: "Memories",      menuTitle: "Memories",           sub: "Thirty-nine frames of her",             inNav: true },
  { id: "chapter-23",    file: "23.html",            title: "Chapter 23",    menuTitle: "Chapter 23",         sub: "The birthday page",                     inNav: true },
  { id: "final",         file: "final.html",         title: "Final Note",    menuTitle: "Final Note",         sub: "After all these pages…",                inNav: true }
];

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const CURRENT_PAGE = document.body.dataset.page || "home";

/* Safe storage helpers (private mode / blocked storage never breaks the site) */
const store = {
  get(key, fallback, session) {
    try {
      const raw = (session ? sessionStorage : localStorage).getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value, session) {
    try { (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
};

/* ---------- Visited pages ---------- */
function getVisited() {
  const v = store.get("td-visited", []);
  return Array.isArray(v) ? v : [];
}
function markVisited() {
  const visited = getVisited();
  if (!visited.includes(CURRENT_PAGE)) { visited.push(CURRENT_PAGE); store.set("td-visited", visited); }
  return visited;
}

/* ---------- Build header ---------- */
function buildHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const navLinks = PAGES.filter((p) => p.inNav).map((p) =>
    `<li><a href="${p.file}"${p.id === CURRENT_PAGE ? ' aria-current="page"' : ""}>${p.title}</a></li>`
  ).join("");

  const menuLinks = PAGES.map((p, i) =>
    `<li><a href="${p.file}" data-page-id="${p.id}"${p.id === CURRENT_PAGE ? ' aria-current="page"' : ""} style="transition-delay:${0.25 + i * 0.05}s">
        <span class="menu-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="menu-title">${p.menuTitle}</span>
        <span class="menu-seen">seen</span>
      </a></li>`
  ).join("");

  host.innerHTML = `
    <div class="scroll-progress" aria-hidden="true"></div>
    <nav class="site-nav" aria-label="Main navigation">
      <div class="nav-inner">
        <a class="brand" href="index.html" aria-label="Home — Trisha / Divya">
          <span class="brand-mark">T/D</span>
          <span>Trisha <span class="slash">/</span> Divya<small>Chapter 23</small></span>
        </a>
        <ul class="nav-links">${navLinks}</ul>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu-overlay">
          <span class="label">Menu</span>
          <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="visually-hidden">Open full menu</span>
        </button>
      </div>
    </nav>
    <div class="menu-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden="true">
      <div class="menu-inner">
        <ul class="menu-list">${menuLinks}</ul>
        <div class="menu-aside">
          <p class="hand">Ten little chapters.<br>One very specific girl.</p>
          <div class="explore-meter" aria-live="polite">
            <span class="explore-text"></span>
            <div class="bar"><span></span></div>
          </div>
          <p class="text-soft small mb-0">Made for 19 December · Turning 23</p>
        </div>
      </div>
    </div>`;
}

/* ---------- Build footer ---------- */
function buildFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  const links = PAGES.map((p) => `<li><a href="${p.file}">${p.title}</a></li>`).join("");
  host.className = "site-footer";
  host.innerHTML = `
    <div class="container">
      <div class="row g-4 g-lg-5 align-items-end">
        <div class="col-lg-7">
          <p class="footer-big">Made with friendship, memories, and <em>a little too much effort.</em></p>
        </div>
        <div class="col-lg-5">
          <ul class="footer-links">${links}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 — For Trisha <span class="slash">/</span> Divya</span>
        <span class="footer-explored"><span class="dots" aria-hidden="true"></span><span class="footer-explored-text"></span></span>
      </div>
    </div>`;
}

/* ---------- Next chapter block ---------- */
function buildNextChapter() {
  const host = document.querySelector("[data-next-chapter]");
  if (!host) return;
  const idx = PAGES.findIndex((p) => p.id === CURRENT_PAGE);
  const next = PAGES[idx + 1];
  if (!next) { host.remove(); return; }
  host.innerHTML = `
    <a class="next-chapter" href="${next.file}">
      <span class="nc-label">Next chapter · ${String(idx + 2).padStart(2, "0")}</span>
      <span class="nc-title">${next.menuTitle}</span>
      <span class="nc-sub">${next.sub}</span><br>
      <span class="nc-arrow" aria-hidden="true"><i class="bi bi-arrow-right"></i></span>
    </a>`;
}

/* ---------- Explore progress (menu + footer) ---------- */
function renderExploreProgress(visited) {
  const total = PAGES.length;
  const count = PAGES.filter((p) => visited.includes(p.id)).length;
  const text = count >= total
    ? "You've explored every chapter. She'd be impressed. Mildly."
    : `You've explored ${count} of ${total} chapters`;

  document.querySelectorAll(".explore-text").forEach((el) => (el.textContent = text));
  document.querySelectorAll(".explore-meter .bar span").forEach((el) => (el.style.width = (count / total) * 100 + "%"));
  document.querySelectorAll(".menu-list a").forEach((a) => a.classList.toggle("is-visited", visited.includes(a.dataset.pageId)));

  const dots = document.querySelector(".footer-explored .dots");
  if (dots) dots.innerHTML = PAGES.map((p) => `<i class="${visited.includes(p.id) ? "on" : ""}"></i>`).join("");
  const ft = document.querySelector(".footer-explored-text");
  if (ft) ft.textContent = `${count}/${total} chapters explored`;
}

/* ---------- Menu ---------- */
function initMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.getElementById("menu-overlay");
  if (!toggle || !overlay) return;

  const setOpen = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    overlay.setAttribute("aria-hidden", String(!open));
    toggle.querySelector(".label").textContent = open ? "Close" : "Menu";
    if (open) setTimeout(() => overlay.querySelector("a")?.focus({ preventScroll: true }), 450);
    else toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) setOpen(false);
    // simple focus trap
    if (e.key === "Tab" && document.body.classList.contains("menu-open")) {
      const items = [toggle, ...overlay.querySelectorAll("a")];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------- Scroll: nav state, progress bar, back-to-top ---------- */
function initScroll() {
  const nav = document.querySelector(".site-nav");
  const bar = document.querySelector(".scroll-progress");

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = `
    <svg viewBox="0 0 52 52" aria-hidden="true"><circle class="ring-bg" cx="26" cy="26" r="24"/><circle class="ring" cx="26" cy="26" r="24" stroke-dasharray="150.8" stroke-dashoffset="150.8"/></svg>
    <i class="bi bi-arrow-up" aria-hidden="true"></i>`;
  document.body.appendChild(toTop);
  const ring = toTop.querySelector(".ring");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? "auto" : "smooth" }));

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, y / max) : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 40);
      const goingDown = y > lastY && y > 420;
      nav.classList.toggle("is-hidden", goingDown && !document.body.classList.contains("menu-open"));
    }
    toTop.classList.toggle("is-visible", y > 700);
    ring.style.strokeDashoffset = String(150.8 * (1 - p));
    lastY = y;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Page transitions ---------- */
function initPageTransitions() {
  const curtain = document.querySelector(".page-curtain");

  const reveal = () => document.body.classList.add("page-ready");
  // let the first paint happen, then lift the curtain
  requestAnimationFrame(() => setTimeout(reveal, REDUCED_MOTION ? 0 : 250));

  // when coming back via the browser's back button (bfcache)
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) { document.body.classList.remove("page-leaving"); reveal(); }
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target && a.target !== "_self") return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const url = new URL(a.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host) return;
    if (!/\.html$/.test(url.pathname) && !url.pathname.endsWith("/")) return;
    if (url.pathname === location.pathname && url.hash) return;

    e.preventDefault();
    if (curtain) {
      const page = PAGES.find((p) => url.pathname.endsWith(p.file));
      const mark = curtain.querySelector(".curtain-mark");
      if (mark && page) mark.textContent = page.menuTitle;
      curtain.classList.add("is-loading");
    }
    document.body.classList.add("page-leaving");
    setTimeout(() => { location.href = a.href; }, REDUCED_MOTION ? 0 : 560);
  });
}

/* ---------- Intro screen (index only) ---------- */
function startHero() {
  document.body.classList.add("hero-go");
  document.querySelectorAll("[data-split='manual']").forEach((el) => el.classList.add("play"));
}

function initIntro() {
  const intro = document.getElementById("intro");
  if (!intro) { startHero(); return; }

  const seen = store.get("td-intro-seen", false, true);
  if (seen) { intro.remove(); setTimeout(startHero, 450); return; }

  document.body.classList.add("intro-active");
  const btn = intro.querySelector(".intro-enter");
  setTimeout(() => btn && btn.focus({ preventScroll: true }), 3000);

  btn.addEventListener("click", () => {
    store.set("td-intro-seen", true, true);
    intro.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    setTimeout(startHero, REDUCED_MOTION ? 0 : 500);
    setTimeout(() => intro.remove(), 1400);
  });
}

/* ==========================================================
   PAGE INTERACTIONS
   ========================================================== */

/* "Did you know?" flip cards */
function initFlipCards() {
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.setAttribute("aria-pressed", "false");
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
  });
}

/* 23 things */
function initThings() {
  const grid = document.querySelector(".things-grid");
  if (!grid) return;
  const items = [...grid.querySelectorAll(".thing")];
  const progress = document.querySelector(".things-progress");
  const revealAll = document.querySelector("[data-reveal-all]");
  let celebrated = false;

  const update = () => {
    const open = items.filter((t) => t.classList.contains("is-open")).length;
    if (progress) progress.textContent = open === items.length
      ? "All 23 revealed. Told you — she's a lot. In the best way."
      : `${open} of ${items.length} revealed — tap a card to flip it`;
    if (open === items.length && !celebrated && window.launchConfetti) { celebrated = true; window.launchConfetti(160); }
  };

  items.forEach((t) => {
    t.setAttribute("aria-pressed", "false");
    t.addEventListener("click", () => {
      const isOpen = t.classList.toggle("is-open");
      t.setAttribute("aria-pressed", String(isOpen));
      update();
    });
  });

  revealAll?.addEventListener("click", () => {
    items.forEach((t, i) => setTimeout(() => {
      t.classList.add("is-open");
      t.setAttribute("aria-pressed", "true");
      if (i === items.length - 1) update();
    }, REDUCED_MOTION ? 0 : i * 70));
  });
  update();
}

/* "Her clock" converter on little-things */
function initClock() {
  const box = document.querySelector(".clock-box");
  if (!box) return;
  const conversions = [
    { her: "5 min",   real: "25 min",   note: "“I'm almost ready.” — a statement with no legal value." },
    { her: "2 min",   real: "20 min",   note: "A quick touch-up. Quick for whom, nobody knows." },
    { her: "Later",   real: "Tomorrow", note: "Replies are coming. Eventually. With full detail." },
    { her: "On my way", real: "Still choosing earrings", note: "Technically, the earrings are on their way." },
    { her: "Just 1 episode", real: "Season finale", note: "Comfort zone fully activated." },
    { her: "Starting Monday", real: "Some Monday", note: "Self-improvement: scheduled, sincerely, flexibly." }
  ];
  let i = 0;
  const herEl = box.querySelector("[data-her]");
  const realEl = box.querySelector("[data-real]");
  const noteEl = box.querySelector("[data-note]");
  const btn = box.querySelector("button");

  const show = () => {
    const c = conversions[i];
    [herEl, realEl, noteEl].forEach((el) => { el.style.opacity = 0; el.style.transform = "translateY(8px)"; });
    setTimeout(() => {
      herEl.textContent = c.her;
      realEl.textContent = c.real;
      noteEl.textContent = c.note;
      [herEl, realEl, noteEl].forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
    }, REDUCED_MOTION ? 0 : 220);
  };
  [herEl, realEl, noteEl].forEach((el) => (el.style.transition = "opacity .35s ease, transform .45s cubic-bezier(.22,1,.36,1)"));
  btn.addEventListener("click", () => { i = (i + 1) % conversions.length; show(); });
}

/* Diya for grandmother */
function initDiya() {
  const btn = document.querySelector("[data-light-diya]");
  if (!btn) return;
  const diya = document.querySelector(".diya");
  const msg = document.querySelector(".diya-message");
  btn.addEventListener("click", () => {
    diya.classList.add("is-lit");
    msg.classList.add("is-shown");
    btn.innerHTML = '<i class="bi bi-brightness-alt-high"></i> The lamp is lit';
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
  });
}

/* Secret message on final page */
function initSecret() {
  const btn = document.querySelector(".secret-btn");
  if (!btn) return;
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      btn.querySelector("span").textContent = "Okay, here it is…";
      if (!REDUCED_MOTION) popHearts(btn);
      setTimeout(() => panel.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "center" }), 450);
    }
  });
}

function popHearts(el) {
  const wrap = el.parentElement;
  wrap.style.position = "relative";
  for (let i = 0; i < 9; i++) {
    const h = document.createElement("i");
    h.className = "bi bi-heart-fill heart-pop";
    h.style.setProperty("--x", (Math.random() * 160 - 80).toFixed(0) + "px");
    h.style.setProperty("--s", (10 + Math.random() * 10).toFixed(0) + "px");
    h.style.animationDelay = (i * 0.08).toFixed(2) + "s";
    h.setAttribute("aria-hidden", "true");
    wrap.appendChild(h);
    setTimeout(() => h.remove(), 2600);
  }
}

/* Confetti on the 23 page */
function initBirthdayConfetti() {
  if (document.body.dataset.confetti !== "true") return;
  const fire = () => window.launchConfetti && window.launchConfetti(220);
  setTimeout(fire, REDUCED_MOTION ? 0 : 1300);
  document.querySelectorAll("[data-confetti-btn]").forEach((b) => b.addEventListener("click", fire));
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  buildNextChapter();
  const visited = markVisited();
  renderExploreProgress(visited);
  initMenu();
  initScroll();
  initPageTransitions();
  initIntro();
  initFlipCards();
  initThings();
  initClock();
  initDiya();
  initSecret();
  initBirthdayConfetti();
});
