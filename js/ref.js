/* Referral capture.
   Priority: ?ref= in the URL  >  last saved ref  >  "sydney".
   Rewrites every lipahub.com/register.php link, including the hotel cards that
   app.js re-renders every few seconds. */
(function () {
  "use strict";
  var DEFAULT_REF = "sydney", KEY = "hotelrate-ref";
  var SEL = 'a[href^="https://lipahub.com/register.php"]';
  function clean(v) { v = String(v || "").trim().replace(/^@+/, ""); return /^[A-Za-z0-9._-]{1,40}$/.test(v) ? v : ""; }

  var ref = "";
  try { ref = clean(new URLSearchParams(window.location.search).get("ref")); } catch (e) {}
  try {
    if (ref) localStorage.setItem(KEY, ref);
    else ref = clean(localStorage.getItem(KEY));
  } catch (e) {}
  if (!ref) ref = DEFAULT_REF;

  function fix(a) {
    try {
      var u = new URL(a.getAttribute("href"));
      if (u.searchParams.get("ref") === ref) return;
      u.searchParams.set("ref", ref);
      a.setAttribute("href", u.toString());
    } catch (e) {}
  }
  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches(SEL)) fix(root);
    var list = root.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) fix(list[i]);
  }

  function init() {
    scan(document);
    if ("MutationObserver" in window) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          for (var j = 0; j < muts[i].addedNodes.length; j++) {
            if (muts[i].addedNodes[j].nodeType === 1) scan(muts[i].addedNodes[j]);
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
