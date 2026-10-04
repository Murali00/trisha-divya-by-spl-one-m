/* ==========================================================
   animations.js — scroll reveals, split text, counters,
   parallax, tilt, magnetic buttons, cursor glow, particles,
   sparkles, timeline progress and confetti.
   Everything respects prefers-reduced-motion.
   ========================================================== */

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Split text into letters ---------- */
  function splitText(el) {
    if (el.classList.contains("is-split")) return;
    const base = parseInt(el.dataset.splitDelay || "0", 10);
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const word = document.createElement("span");
            word.className = "word";
            [...part].forEach((ch) => {
              const line = document.createElement("span");
              line.className = "split-line";
              const c = document.createElement("span");
              c.className = "char";
              c.textContent = ch;
              c.style.setProperty("--i", i++);
              c.style.setProperty("--base", base + "ms");
              line.appendChild(c);
              word.appendChild(line);
            });
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    [...el.children].forEach((c) => c.setAttribute("aria-hidden", "true"));
    el.classList.add("is-split");
  }

  /* ---------- Word-by-word fade (reading effect) ---------- */
  function prepWordFade(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  }
  function updateWordFades() {
    document.querySelectorAll(".wordfade").forEach((el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const ws = el.querySelectorAll(".w");
      const on = Math.round(progress * ws.length);
      ws.forEach((w, i) => w.classList.toggle("on", i < on));
    });
  }

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const duration = parseInt(el.dataset.duration || "1800", 10);
    const format = (n) => (el.dataset.format === "comma" ? Math.round(n).toLocaleString("en-IN") : Math.round(n));
    if (reduced) { el.textContent = format(target); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Intersection observer (reveals) ---------- */
  function initReveals() {
    document.querySelectorAll("[data-split]").forEach(splitText);
    document.querySelectorAll(".wordfade").forEach(prepWordFade);

    const targets = document.querySelectorAll(
      "[data-reveal], [data-stagger], .img-reveal, [data-split]:not([data-split='manual']), [data-count], .tl-item, .meter, .num-23, [data-observe]"
    );

    if (!("IntersectionObserver" in window) || reduced) {
      targets.forEach((el) => {
        el.classList.add("is-visible", "is-drawn");
        if (el.dataset.count) animateCount(el);
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay + "s");
        el.classList.add("is-visible");
        if (el.classList.contains("num-23")) el.classList.add("is-drawn");
        if (el.dataset.count) animateCount(el);
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Parallax ---------- */
  const parallaxEls = [];
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach(({ el, speed }) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.translate = `0 ${offset.toFixed(1)}px`; /* `translate` composes with hover/zoom transforms */
    });
  }

  /* ---------- Timeline progress line ---------- */
  function updateTimeline() {
    document.querySelectorAll(".timeline").forEach((tl) => {
      const fill = tl.querySelector(".timeline-line span");
      if (!fill) return;
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    });
  }

  function initScrollEffects() {
    if (!reduced) {
      document.querySelectorAll("[data-parallax]").forEach((el) => parallaxEls.push({ el, speed: parseFloat(el.dataset.parallax) || 0.1 }));
    }
    let ticking = false;
    const run = () => {
      if (parallaxEls.length) updateParallax();
      updateTimeline();
      if (!reduced) updateWordFades();
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    window.addEventListener("resize", run);
    if (reduced) document.querySelectorAll(".wordfade .w").forEach((w) => w.classList.add("on"));
    run();
  }

  /* ---------- 3D tilt ---------- */
  function initTilt() {
    if (reduced || !finePointer) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const max = parseFloat(card.dataset.tilt) || 7;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.classList.add("is-tilting");
        card.style.setProperty("--ry", ((x - 0.5) * max * 2).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - y) * max * 2).toFixed(2) + "deg");
        card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (reduced || !finePointer) return;
    document.querySelectorAll(".btn-magnetic").forEach((btn) => {
      const strength = 0.32;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transition = "transform .7s cubic-bezier(.22,1,.36,1), color .5s, border-color .5s, box-shadow .5s";
        btn.style.transform = "";
        setTimeout(() => (btn.style.transition = ""), 700);
      });
    });
  }

  /* ---------- Cursor glow ---------- */
  function initCursorGlow() {
    if (reduced || !finePointer) return;
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; glow.classList.add("is-active"); }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
    const loop = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Floating particles (dust + very rare hearts) ---------- */
  function initParticles() {
    if (reduced || document.body.dataset.particles === "off") return;
    const canvas = document.createElement("canvas");
    canvas.id = "particles";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    let w, h, dpr, parts = [];
    const heartsAllowed = document.body.dataset.hearts !== "off";

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      const count = Math.round(Math.min(46, (innerWidth * innerHeight) / 32000));
      parts = Array.from({ length: count }, () => make(true));
    };

    const make = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      r: (Math.random() * 1.8 + 0.6) * dpr,
      vy: -(Math.random() * 0.25 + 0.08) * dpr,
      vx: (Math.random() - 0.5) * 0.12 * dpr,
      a: Math.random() * 0.45 + 0.15,
      heart: heartsAllowed && Math.random() < 0.06,
      phase: Math.random() * Math.PI * 2
    });

    const drawHeart = (x, y, s) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
      ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
      ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
      ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
      ctx.fill();
    };

    let running = true;
    const loop = (t) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t / 2400 + p.phase) * 0.15 * dpr;
        if (p.y < -20) parts[i] = make(false);
        const alpha = p.a * (0.6 + 0.4 * Math.sin(t / 900 + p.phase));
        if (p.heart) {
          ctx.fillStyle = `rgba(185, 127, 124, ${alpha * 0.55})`;
          drawHeart(p.x, p.y, p.r * 4.2);
        } else {
          ctx.fillStyle = `rgba(191, 154, 95, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      requestAnimationFrame(loop);
    };

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(loop);
    });
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(loop);
  }

  /* ---------- Sparkles around special words ---------- */
  function initSparkles() {
    const star = '<svg viewBox="0 0 24 24"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z"/></svg>';
    document.querySelectorAll(".sparkle").forEach((el) => {
      const spots = [[-8, -6], [100, 10], [92, 82], [8, 90], [50, -14]];
      spots.forEach(([x, y], i) => {
        const s = document.createElement("span");
        s.className = "spark";
        s.setAttribute("aria-hidden", "true");
        s.innerHTML = star;
        s.style.left = x + "%";
        s.style.top = y + "%";
        s.style.animationDelay = (i * 0.45).toFixed(2) + "s";
        const size = 8 + (i % 3) * 4;
        s.style.width = s.style.height = size + "px";
        el.appendChild(s);
      });
    });
  }

  /* ---------- Twinkling star field ---------- */
  function initStarFields() {
    document.querySelectorAll(".star-field").forEach((field) => {
      const n = parseInt(field.dataset.stars || "26", 10);
      for (let i = 0; i < n; i++) {
        const s = document.createElement("i");
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
        s.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + "s";
        field.appendChild(s);
      }
    });
  }

  /* ---------- Confetti (only called on the 23 page) ---------- */
  window.launchConfetti = function (amount) {
    if (reduced) return;
    let canvas = document.getElementById("confetti");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    const colors = ["#b97f7c", "#94585a", "#bf9a5f", "#e7d4b2", "#ecd5cf", "#7a5a48", "#ffffff"];
    const pieces = Array.from({ length: amount || 180 }, (_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        x: (fromLeft ? 0.05 : 0.95) * canvas.width,
        y: canvas.height * 0.75,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 9 + 4) * dpr,
        vy: -(Math.random() * 15 + 9) * dpr,
        w: (Math.random() * 8 + 5) * dpr,
        h: (Math.random() * 5 + 3) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        shape: Math.random() < 0.25 ? "circle" : "rect",
        life: 0
      };
    });
    const gravity = 0.32 * dpr;
    const drag = 0.985;
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach((p) => {
        p.life++;
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < canvas.height + 40) alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life / 320);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.h / 1.5, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life / 8)));
        ctx.restore();
      });
      if (alive && pieces[0].life < 360) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initScrollEffects();
    initTilt();
    initMagnetic();
    initCursorGlow();
    initParticles();
    initSparkles();
    initStarFields();
  });
})();
