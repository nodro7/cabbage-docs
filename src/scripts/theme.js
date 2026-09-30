// Theme toggle. One button flips between dark and light. The choice is
// stored under Starlight's key so the docs and the marketing pages agree.

const KEY = 'starlight-theme';
const root = document.documentElement;
const systemLight = window.matchMedia('(prefers-color-scheme: light)');

function stored() {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function current() {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

// The label names the action, not the state.
function syncLabels() {
  const label = current() === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  for (const button of document.querySelectorAll('[data-theme-toggle]')) {
    button.setAttribute('aria-label', label);
  }
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage is unavailable: the choice lasts for this page only.
  }
  syncLabels();
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('[data-theme-toggle]')) {
    setTheme(current() === 'light' ? 'dark' : 'light');
  }
});

// Follow the system setting until the visitor has made a choice.
systemLight.addEventListener('change', () => {
  if (stored()) return;
  root.dataset.theme = systemLight.matches ? 'light' : 'dark';
  syncLabels();
});

syncLabels();
