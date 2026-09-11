import { PAGE_DEFINITIONS } from './config.js';
import { createPageLoader } from './page-loader.js';
import { bindProfileBuilder } from './profile-builder.js';
import { initTheme } from './theme.js';

const app = document.getElementById('app');
const nav = document.querySelector('.site-nav');
const themeToggle = document.getElementById('theme-toggle');

initTheme(themeToggle);

const pageLoader = createPageLoader({
    app,
    nav,
    pages: PAGE_DEFINITIONS,
    onPageLoaded: async (viewName) => {
        if (viewName === 'setup') await bindProfileBuilder();
    }
});

pageLoader.start();
