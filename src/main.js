// Простой пример "нестандартного элемента": переключатель темы.
// TODO студент: замени или дополни своим.

const STORAGE_KEY = 'cv-theme';

const getInitialTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
};

const toggle = document.getElementById('theme-toggle');
applyTheme(getInitialTheme());

toggle?.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
