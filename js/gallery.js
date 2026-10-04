/* ==========================================================
   gallery.js — masonry gallery with filters (memories.html)
   and a site-wide lightbox for every photo.
   Data comes from js/memories.js
   ========================================================== */

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CATEGORY_LABEL = { beautiful: "Beautiful", funny: "Funny", outings: "Out & About", memories: "Memories" };

  /* ---------- Gallery ---------- */
  function buildGallery() {
    const grid = document.getElementById("gallery");
    const bar = document.getElementById("gallery-filters");
    if (!grid || typeof memories === "undefined") return;

    grid.innerHTML = memories.map((m, i) => `
      <div class="masonry-item" data-category="${m.category}" style="transition-delay:${Math.min(i, 14) * 40}ms">
        <button type="button" class="photo-card" data-lightbox="gallery" aria-label="Open photo: ${m.caption}">
          <span class="cat-pill">${CATEGORY_LABEL[m.category]}</span>
          <img data-img="${m.key}" alt="${m.alt}">
          <span class="photo-caption">${m.caption}</span>
        </button>
      </div>`).join("");
    if (typeof resolveImages === "function") resolveImages(grid);

    if (bar) {
      bar.innerHTML = MEMORY_FILTERS.map((f) => {
        const count = f.id === "all" ? memories.length : memories.filter((m) => m.category === f.id).length;
        return `<button type="button" class="filter-btn${f.id === "all" ? " is-active" : ""}" data-filter="${f.id}" aria-pressed="${f.id === "all"}">${f.label}<span class="count">${count}</span></button>`;
      }).join("");
      bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (btn) applyFilter(btn.dataset.filter);
      });
    }

    // staggered entrance when the grid scrolls into view
    const items = [...grid.children];
    items.forEach((it) => it.classList.add("is-entering"));
    const show = () => items.forEach((it, i) => setTimeout(() => it.classList.remove("is-entering"), reduced ? 0 : i * 45));
    if ("IntersectionObserver" in window && !reduced) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { show(); io.disconnect(); }
      }, { threshold: 0.05 });
      io.observe(grid);
    } else show();

    function applyFilter(id) {
      bar.querySelectorAll(".filter-btn").forEach((b) => {
        const on = b.dataset.filter === id;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      let n = 0;
      items.forEach((it) => {
        const match = id === "all" || it.dataset.category === id;
        if (!match) { it.classList.add("is-hidden"); return; }
        it.classList.remove("is-hidden");
        it.classList.add("is-entering");
        it.style.transitionDelay = (reduced ? 0 : n++ * 45) + "ms";
        requestAnimationFrame(() => requestAnimationFrame(() => it.classList.remove("is-entering")));
      });
      const status = document.getElementById("gallery-status");
      if (status) status.textContent = `Showing ${n || items.filter((i) => !i.classList.contains("is-hidden")).length} photos`;
    }
  }

  /* ---------- Lightbox ---------- */
  function buildLightbox() {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = `
      <div class="lb-top">
        <span class="lb-count" aria-live="polite"></span>
        <button type="button" class="lb-btn lb-close" aria-label="Close photo viewer"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="lb-stage">
        <button type="button" class="lb-btn lb-prev" aria-label="Previous photo"><i class="bi bi-arrow-left"></i></button>
        <img alt="">
        <button type="button" class="lb-btn lb-next" aria-label="Next photo"><i class="bi bi-arrow-right"></i></button>
      </div>
      <p class="lb-caption"></p>`;
    document.body.appendChild(lb);

    const img = lb.querySelector(".lb-stage img");
    const cap = lb.querySelector(".lb-caption");
    const count = lb.querySelector(".lb-count");
    let list = [];
    let index = 0;
    let lastFocus = null;

    const visible = (el) => !el.closest(".is-hidden");

    const render = () => {
      const source = list[index].querySelector("img");
      img.classList.remove("is-shown");
      const swap = () => {
        img.src = source.currentSrc || source.src;
        img.alt = source.alt;
        cap.textContent = source.dataset.caption || "";
        count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
        const done = () => img.classList.add("is-shown");
        if (img.complete) requestAnimationFrame(done); else img.onload = done;
      };
      reduced ? swap() : setTimeout(swap, 160);
      const multi = list.length > 1;
      lb.querySelector(".lb-prev").hidden = !multi;
      lb.querySelector(".lb-next").hidden = !multi;
    };

    const open = (trigger) => {
      const group = trigger.dataset.lightbox || "page";
      list = [...document.querySelectorAll(`[data-lightbox="${group}"]`)].filter(visible);
      index = Math.max(0, list.indexOf(trigger));
      lastFocus = document.activeElement;
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      render();
      lb.querySelector(".lb-close").focus({ preventScroll: true });
    };
    const close = () => {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      img.classList.remove("is-shown");
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    const go = (d) => { index = (index + d + list.length) % list.length; render(); };

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-lightbox]");
      if (trigger && !lb.contains(trigger)) { e.preventDefault(); open(trigger); }
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) {
        const t = e.target.closest && e.target.closest("[data-lightbox]");
        if (t && t.tagName !== "BUTTON" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(t); }
        return;
      }
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        const f = [...lb.querySelectorAll("button:not([hidden])")];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => go(-1));
    lb.querySelector(".lb-next").addEventListener("click", () => go(1));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-stage")) close(); });

    // swipe on touch screens
    let sx = 0, sy = 0;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (dy > 90) close();
    }, { passive: true });
  }

  /* make non-button photo cards keyboard reachable */
  function prepPhotoCards() {
    document.querySelectorAll("figure[data-lightbox]").forEach((fig) => {
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      const img = fig.querySelector("img");
      const key = img && img.dataset.img;
      const caption = (key && typeof SITE_IMAGES !== "undefined" && SITE_IMAGES[key]) ? SITE_IMAGES[key].caption : "photo";
      if (!fig.hasAttribute("aria-label")) fig.setAttribute("aria-label", "Open photo: " + (img?.dataset.caption || caption));
      const capEl = fig.querySelector(".photo-caption");
      if (capEl && !capEl.textContent.trim()) capEl.textContent = img?.dataset.caption || caption;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildGallery();
    prepPhotoCards();
    buildLightbox();
  });
})();
