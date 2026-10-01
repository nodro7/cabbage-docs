// Inlined in <head> on the marketing pages so the right theme is set before
// first paint. Same rule as Starlight's ThemeProvider: the stored choice
// under "starlight-theme" wins, otherwise the system preference, otherwise dark.
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem('starlight-theme');
  } catch (e) {}
  var theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
  document.documentElement.dataset.theme = theme;
  // Lets the styles tell whether scripts run, before anything is painted.
  document.documentElement.classList.add('js');
})();
