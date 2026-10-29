(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ---------- Rotating hotel grid: 6 at a time ---------- */
  const PER = 6;
  const EVERY = 6000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* whole pages only, so no hotel repeats within one cycle */
  const list = shuffle(HOTELS.slice()).slice(0, Math.floor(HOTELS.length / PER) * PER || HOTELS.length);
  const pages = Math.ceil(list.length / PER);
  let page = 0;
  let timer = null;

  const grid = $("grid");
  const dots = $("dots");

  dots.innerHTML = Array.from(
    { length: pages },
    (_, i) => `<button type="button" aria-label="Show hotels ${i * PER + 1} to ${Math.min((i + 1) * PER, list.length)}" aria-current="false"></button>`
  ).join("");

  /* Always show a full row set: wrap around so the last page is never short */
  const itemsFor = (p) =>
    Array.from({ length: Math.min(PER, list.length) }, (_, i) => list[(p * PER + i) % list.length]);

  const card = (h, i) => `
    <article class="card" style="--i:${i}">
      <div class="media">
        <img src="${h.img}" alt="${esc(h.name)}, ${esc(h.city)}" loading="lazy" width="800" height="533" onerror="this.remove()">
        <span class="pill">${h.flag} ${esc(h.city)}</span>
        <span class="chip-pay">Pay per review<b>KSh ${h.pay}</b></span>
      </div>
      <div class="body">
        <div class="top">
          <h3>${esc(h.name)}</h3>
        </div>
        <p class="desc">${esc(h.desc)}</p>
        <button class="btn btn-ink" type="button" data-hotel="${esc(h.name)}">Review this hotel</button>
      </div>
    </article>`;

  function render() {
    grid.innerHTML = itemsFor(page).map(card).join("");
    [...dots.children].forEach((d, i) => d.setAttribute("aria-current", String(i === page)));
  }

  function go(n) {
    page = ((n % pages) + pages) % pages;
    if (reduceMotion) return render();
    grid.classList.add("out");
    setTimeout(() => {
      render();
      grid.classList.remove("out");
    }, 350);
  }

  /* Auto-rotation runs only while the grid is on screen, the tab is visible,
     and the visitor hasn't paused it or is interacting with it. */
  const pauseBtn = $("pause");
  let userPaused = reduceMotion; /* reduced motion: start paused, never auto-advance */
  let inView = false;
  let holding = false;

  const syncPause = () => {
    pauseBtn.setAttribute("aria-pressed", String(userPaused));
    pauseBtn.setAttribute("aria-label", userPaused ? "Resume automatic hotel rotation" : "Pause automatic hotel rotation");
  };
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (userPaused || !inView || holding || document.hidden) return;
    timer = setInterval(() => go(page + 1), EVERY);
  }
  pauseBtn.addEventListener("click", () => { userPaused = !userPaused; syncPause(); start(); });
  syncPause();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; start(); }, { threshold: 0.2 }).observe(grid);
  } else { inView = true; }

  dots.addEventListener("click", (e) => {
    const i = [...dots.children].indexOf(e.target.closest("button"));
    if (i > -1) { go(i); start(); }
  });
  const hold = (v) => () => { holding = v; start(); };
  grid.addEventListener("mouseenter", hold(true));
  grid.addEventListener("mouseleave", hold(false));
  grid.addEventListener("focusin", hold(true));
  grid.addEventListener("focusout", hold(false));
  grid.addEventListener("touchstart", hold(true), { passive: true });
  grid.addEventListener("touchend", () => setTimeout(hold(false), 4000), { passive: true });
  document.addEventListener("visibilitychange", start);

  render();

  /* ---------- Registration steps ---------- */
  const stepsHTML = STEPS.map((s) => `<li><b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>`).join("");
  ["regSteps", "mSteps"].forEach((id) => { const el = $(id); if (el) el.innerHTML = stepsHTML; });

  /* ---------- Registration modal ---------- */
  const modal = $("modal");
  let lastFocus = null;

  const openModal = (hotel) => {
    lastFocus = document.activeElement;
    $("mHotel").textContent = hotel
      ? `You chose ${hotel}. Register and activate your account to review it.`
      : "Create and activate your account to start reviewing.";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("close").focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  document.addEventListener("click", (e) => {
    const h = e.target.closest("[data-hotel]");
    if (h) return openModal(h.dataset.hotel);
    if (e.target.closest(".js-register")) openModal();
  });
  $("close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") return closeModal();
    if (e.key === "Tab") {
      const f = [...modal.querySelectorAll("a[href],button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Install app button ---------- */
  const installBtn = $("installBtn");
  const installTip = $("installTip");
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  let deferred = null;

  if (!standalone) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferred = e;
      installBtn.hidden = false;
    });
    if (isIOS) installBtn.hidden = false; /* Safari has no install prompt: show a tip instead */
  }
  installBtn.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      installBtn.hidden = true;
    } else if (isIOS) {
      installTip.hidden = !installTip.hidden;
    }
  });
  window.addEventListener("appinstalled", () => { installBtn.hidden = true; installTip.hidden = true; });
  document.addEventListener("click", (e) => {
    if (!installTip.hidden && !e.target.closest("#installBtn, #installTip")) installTip.hidden = true;
  });

  /* ---------- Header shadow on scroll + footer year ---------- */
  const hd = document.querySelector(".header");
  const sc = () => hd.classList.toggle("solid", window.scrollY > 10);
  window.addEventListener("scroll", sc, { passive: true });
  sc();
  $("year").textContent = new Date().getFullYear();
})();
