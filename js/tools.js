(function () {
  "use strict";
  var BASE = "https://hotelrate.vercel.app/";
  var STORE = "hotelrate-tools-username";
  var $ = function (s) { return document.querySelector(s); };

  var input = $("#refInput"), hint = $("#refHint"), box = $("#linkBox"),
      copyBtn = $("#copyBtn"), waBtn = $("#waBtn"), status = $("#copyStatus"), statusTimer;
  var current = "";

  function setStatus(msg) {
    status.textContent = msg;
    clearTimeout(statusTimer);
    if (msg) statusTimer = setTimeout(function () { status.textContent = ""; }, 3000);
  }

  function update(showWarn) {
    var raw = input.value.trim().replace(/^@+/, "");
    var cleaned = raw.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40);
    if (cleaned !== input.value) input.value = cleaned;
    hint.classList.toggle("warn", !!showWarn);
    hint.textContent = showWarn ? "Only letters, numbers, dots, dashes and underscores are allowed." : "";
    current = cleaned;
    if (current) {
      var link = BASE + "?ref=" + encodeURIComponent(current);
      box.textContent = link;
      box.classList.remove("is-empty");
      copyBtn.disabled = false;
      waBtn.classList.remove("is-disabled");
      waBtn.removeAttribute("aria-disabled");
      waBtn.href = "https://wa.me/?text=" + encodeURIComponent(
        "Earn money by reviewing hotels with HotelRate, powered by LipaHub. See the hotels and register free here: " + link);
      try { localStorage.setItem(STORE, current); } catch (e) {}
    } else {
      box.textContent = "Enter your username above to generate your link";
      box.classList.add("is-empty");
      copyBtn.disabled = true;
      waBtn.classList.add("is-disabled");
      waBtn.setAttribute("aria-disabled", "true");
      waBtn.removeAttribute("href");
    }
  }

  input.addEventListener("input", function () {
    var before = input.value.trim().replace(/^@+/, "");
    update(before !== before.replace(/[^A-Za-z0-9._-]/g, ""));
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  copyBtn.addEventListener("click", function () {
    if (!current) return;
    var link = box.textContent;
    function done(ok) { setStatus(ok ? "Link copied to clipboard!" : "Couldn't copy automatically. Please select and copy the link."); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(function () { done(true); }, function () { done(fallbackCopy(link)); });
    } else { done(fallbackCopy(link)); }
  });

  waBtn.addEventListener("click", function (e) {
    if (!current) { e.preventDefault(); return; }
    waBtn.target = "_blank"; waBtn.rel = "noopener";
  });

  try { input.value = localStorage.getItem(STORE) || ""; } catch (e) {}
  update(false);

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
