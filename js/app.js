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

  const list = shuffle(HOTELS.slice());
  const pages = Math.ceil(list.length / PER);
  let page = 0;
  let timer = null;

  const grid = $("grid");
  const dots = $("dots");

  dots.innerHTML = Array.from(
    { length: pages },
    (_, i) => `<button type="button" aria-label="Selection ${i + 1}" aria-current="false"></button>`
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
          <span class="rate" aria-label="Rated ${h.rating} out of 5">${h.rating.toFixed(1)}</span>
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

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (!reduceMotion) timer = setInterval(() => go(page + 1), EVERY);
  }

  dots.addEventListener("click", (e) => {
    const i = [...dots.children].indexOf(e.target.closest("button"));
    if (i > -1) { go(i); start(); }
  });
  grid.addEventListener("mouseenter", stop);
  grid.addEventListener("mouseleave", start);
  grid.addEventListener("focusin", stop);
  grid.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  render();
  start();

  /* ---------- Registration steps (modal, plus page list if present) ---------- */
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
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- Header shadow on scroll + footer year ---------- */
  const hd = document.querySelector(".header");
  const sc = () => hd.classList.toggle("solid", window.scrollY > 10);
  window.addEventListener("scroll", sc, { passive: true });
  sc();
  $("year").textContent = new Date().getFullYear();
})();
