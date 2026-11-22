/**
 * iframe-loader.js
 * Finds the FIRST real iframe on the page, loads it, and makes it fill the
 * whole viewport. If none exists yet, keeps checking until one appears.
 *
 * Works with:
 *  - plain src, srcdoc, and lazy-load attributes (data-src, data-lazy-src,
 *    data-original, data-lazy, data-url), incl. src="about:blank" placeholders
 *  - iframes already in the HTML, injected later, or inside open shadow roots
 *  - hidden iframes (display:none, visibility, hidden attr, opacity 0)
 *  - stylesheet rules that fight the layout (all styles use !important)
 *  - parents with transform/filter/overflow/hidden that break position:fixed
 *    (the iframe is moved to <body> only if it can't fill the viewport in place)
 *  - frameworks that re-render the page, strip our styles or remove the iframe
 *  - mobile browsers (dvh units, safe-area insets)
 * Tiny tracking/ad iframes (width or height of 1px or less) are skipped.
 *
 * If the page URL contains ?back=1, a Back button bar is shown at the bottom.
 * Pressing it removes the iframe and bar, restores scrolling, strips any #hash
 * from the URL, then goes back like the browser's own Back button.
 * The script keeps running afterwards and picks up any NEW iframe that opens.
 *
 * Usage: <script src="iframe-loader.js" defer></script>
 */
(function () {
  "use strict";

  var POLL_MS = 500;   // how often to check while idle / watch for removal
  var BAR_PX = 20;     // height of the back button bar (excl. safe area)
  var SRC_ATTRS = ["data-src", "data-lazy-src", "data-original", "data-lazy", "data-url"];

  var showBack = false;
  try {
    showBack = new URLSearchParams(window.location.search).get("back") === "1";
  } catch (e) {}

  var BAR_H = "calc(" + BAR_PX + "px + env(safe-area-inset-bottom, 0px))";

  var target = null;     // the iframe we took over
  var bar = null;        // back button bar
  var ifrObs = null;     // watches the target for style tampering
  var tickTimer = null;  // debounce timer for DOM mutations
  var pollTimer = null;  // interval timer
  var rootObs = null;    // document-wide mutation observer
  var dismissed = typeof WeakSet === "function" ? new WeakSet() : null; // iframes closed via Back
  var saved = null;      // original inline overflow values

  /* ---------- finding iframes ---------- */

  function collect(root, out) {
    var i, list = root.querySelectorAll("iframe");
    for (i = 0; i < list.length; i++) out.push(list[i]);
    var all = root.querySelectorAll("*");
    for (i = 0; i < all.length; i++) {
      if (all[i].shadowRoot) collect(all[i].shadowRoot, out); // open shadow DOM
    }
    return out;
  }

  function num(attr) {
    if (attr == null || /%\s*$/.test(attr)) return null;
    var n = parseFloat(attr);
    return isNaN(n) ? null : n;
  }

  function isTracking(f) {
    var w = num(f.getAttribute("width")), h = num(f.getAttribute("height"));
    if ((w !== null && w <= 1) || (h !== null && h <= 1)) return true;
    var r = f.getBoundingClientRect();
    return (r.width > 0 && r.width <= 1) || (r.height > 0 && r.height <= 1);
  }

  function findFirst() {
    var list = collect(document, []);
    for (var i = 0; i < list.length; i++) {
      if (list[i] === target) continue;
      if (dismissed && dismissed.has(list[i])) continue;
      if (!isTracking(list[i])) return list[i];
    }
    return null;
  }

  /* ---------- loading ---------- */

  function load(f) {
    f.removeAttribute("loading"); // don't let native lazy-loading delay it
    if (f.hasAttribute("srcdoc")) return; // inline content loads on its own
    var cur = f.getAttribute("src");
    if (cur && cur !== "about:blank") return; // already has a real src
    for (var i = 0; i < SRC_ATTRS.length; i++) {
      var v = f.getAttribute(SRC_ATTRS[i]);
      if (v) {
        f.setAttribute("src", v);
        f.removeAttribute(SRC_ATTRS[i]);
        return;
      }
    }
  }

  /* ---------- layout ---------- */

  function set(el, prop, val) { el.style.setProperty(prop, val, "important"); }

  function applyStyles(f) {
    f.removeAttribute("hidden");
    f.setAttribute("frameborder", "0");
    var props = {
      "position": "fixed", "top": "0", "left": "0", "right": "auto", "bottom": "auto",
      "width": "100vw", "min-width": "0", "max-width": "none",
      "min-height": "0", "max-height": "none",
      "margin": "0", "padding": "0", "border": "0", "float": "none",
      "transform": "none", "clip": "auto", "clip-path": "none",
      "display": "block", "visibility": "visible", "opacity": "1",
      "pointer-events": "auto", "box-sizing": "border-box",
      "z-index": "2147483646", "background": "#fff"
    };
    for (var p in props) set(f, p, props[p]);

    // Later valid declarations win; unsupported ones are ignored.
    var sub = showBack ? " - " + BAR_PX + "px" : "";
    set(f, "height", "calc(100vh" + sub + ")");
    set(f, "height", "calc(100dvh" + sub + ")");
    if (showBack) set(f, "height", "calc(100dvh - " + BAR_H + ")");

    if (!saved) {
      saved = {
        html: document.documentElement.style.getPropertyValue("overflow"),
        htmlPri: document.documentElement.style.getPropertyPriority("overflow"),
        body: document.body ? document.body.style.getPropertyValue("overflow") : "",
        bodyPri: document.body ? document.body.style.getPropertyPriority("overflow") : ""
      };
    }
    set(document.documentElement, "overflow", "hidden");
    if (document.body) set(document.body, "overflow", "hidden");
  }

  // Ancestors with transform/filter/contain make "fixed" relative to them.
  function misplaced(f) {
    var r = f.getBoundingClientRect();
    return Math.abs(r.left) > 1 || Math.abs(r.top) > 1 ||
           Math.abs(r.width - window.innerWidth) > 2;
  }

  /* ---------- back button ---------- */

  function ensureBar() {
    if (!showBack) return;
    var host = document.body || document.documentElement;
    if (bar && bar.isConnected) return;

    bar = document.createElement("div");
    var props = {
      "position": "fixed", "left": "0", "bottom": "0", "width": "100vw",
      "height": BAR_H, "padding-bottom": "env(safe-area-inset-bottom, 0px)",
      "box-sizing": "border-box", "display": "flex", "align-items": "stretch",
      "background": "#111", "z-index": "2147483647", "transform": "none"
    };
    for (var p in props) set(bar, p, props[p]);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "\u2190 Back";
    btn.style.cssText = "flex:1;border:0;background:transparent;color:#fff;" +
      "font:600 16px system-ui,sans-serif;cursor:pointer;";
    btn.addEventListener("click", goBack);

    bar.appendChild(btn);
    host.appendChild(bar);
  }

  /* ---------- closing ---------- */

  function restoreOverflow() {
    var html = document.documentElement, body = document.body;
    html.style.removeProperty("overflow");
    if (saved && saved.html) html.style.setProperty("overflow", saved.html, saved.htmlPri);
    if (body) {
      body.style.removeProperty("overflow");
      if (saved && saved.body) body.style.setProperty("overflow", saved.body, saved.bodyPri);
    }
  }

  function stripHash() {
    if (!window.location.hash) return;
    try {
      window.history.replaceState(
        window.history.state, "", window.location.pathname + window.location.search
      );
    } catch (e) {}
  }

  // Close the current iframe: remove iframe + bar, restore scrolling.
  // The script keeps running so it can catch the NEXT iframe that opens.
  function teardown() {
    if (ifrObs) { ifrObs.disconnect(); ifrObs = null; }

    // Iframes already on the page right now are ignored from here on, so
    // only iframes that appear after this point get picked up.
    if (dismissed) {
      var existing = collect(document, []);
      for (var i = 0; i < existing.length; i++) dismissed.add(existing[i]);
    }

    // Removing the iframe also drops its entries from the session history,
    // so Back won't just step through the iframe's own navigations.
    if (target && target.parentNode) target.parentNode.removeChild(target);
    target = null;
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;

    restoreOverflow();
    saved = null; // re-capture the page's overflow when the next iframe opens
    stripHash();
  }

  function goBack() {
    var canGoBack = window.history.length > 1;
    var ref = document.referrer;
    teardown();
    if (canGoBack) window.history.back();   // same as the browser's Back button
    else if (ref) window.location.href = ref;
  }

  /* ---------- take over / watch ---------- */

  function take(f) {
    target = f;
    applyStyles(f);
    if (misplaced(f)) {
      // Moving an iframe reloads it, so only do it when truly necessary.
      (document.body || document.documentElement).appendChild(f);
      applyStyles(f);
    }
    load(f);
    ensureBar();

    if (ifrObs) ifrObs.disconnect();
    if (window.MutationObserver) {
      ifrObs = new MutationObserver(function () {
        if (target) { applyStyles(target); ifrObs.takeRecords(); }
      });
      ifrObs.observe(f, {
        attributes: true,
        attributeFilter: ["style", "class", "hidden", "width", "height"]
      });
      ifrObs.takeRecords();
    }
  }

  function tick() {
    if (target && target.isConnected) {
      ensureBar();
      return;
    }
    // nothing yet, or our iframe was removed: look again
    target = null;
    if (ifrObs) { ifrObs.disconnect(); ifrObs = null; }
    var f = findFirst();
    if (f) take(f);
  }

  function scheduleTick() {
    if (tickTimer) return;
    tickTimer = setTimeout(function () { tickTimer = null; tick(); }, 50);
  }

  function init() {
    tick();
    pollTimer = setInterval(tick, POLL_MS); // also covers shadow DOM, which can't be observed globally
    if (window.MutationObserver) {
      rootObs = new MutationObserver(scheduleTick);
      rootObs.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();