// Apply saved theme before React mounts to avoid a flash of the default
// palette. Mirrors loadState()/migrate() in App.jsx for the theme field
// only; safe to fall through if anything goes wrong.
//
// This file is loaded via <script src="/theme-init.js"> from index.html
// so we can drop 'unsafe-inline' from script-src in the CSP. The file
// must stay as a tiny vanilla script — no imports, no module syntax —
// because it runs before everything else and must be sub-millisecond.
(function () {
  try {
    var raw = localStorage.getItem("db_state");
    var theme = null;
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === 1 && parsed.d && typeof parsed.d.theme === "string") {
        theme = parsed.d.theme;
      }
    }
    if (!theme) theme = localStorage.getItem("db_theme"); // legacy fallback
    if (!theme) theme = "system";
    var resolved = theme;
    if (theme === "system") {
      resolved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "paper" : "twilight";
    }
    document.documentElement.dataset.theme = resolved;
  } catch (e) { /* default theme will apply via CSS */ }
})();
