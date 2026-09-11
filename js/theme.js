const STORAGE_KEY = 'server-guide-theme';

function applyTheme(theme, toggle) {
    const isLight = theme === 'light';
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    toggle.querySelector('.theme-label').textContent = isLight ? 'Dark mode' : 'Light mode';
    toggle.querySelector('[aria-hidden="true"]').textContent = isLight ? '☾' : '☼';
    localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
}

export function initTheme(toggle) {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyTheme(savedTheme, toggle);

    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, toggle);
    });
}
