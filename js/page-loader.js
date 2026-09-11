export function createPageLoader({ app, nav, pages, onPageLoaded }) {
    async function loadPage(viewName, updateUrl = true) {
        const selectedView = pages[viewName] ? viewName : 'setup';
        const page = pages[selectedView];

        try {
            const response = await fetch(page.file);
            if (!response.ok) throw new Error(`Could not load ${page.file}`);
            app.innerHTML = await response.text();
        } catch (error) {
            app.innerHTML = '<section class="empty-view"><h1>Page unavailable.</h1><p>This page could not be loaded. Check that the site is being served from a local web server.</p></section>';
            console.error(error);
        }

        document.title = `${page.title} | Server Guide`;
        nav.querySelectorAll('.nav-button').forEach((button) => {
            button.setAttribute('aria-current', button.dataset.view === selectedView ? 'page' : 'false');
        });

        if (updateUrl) history.pushState({ view: selectedView }, '', `#${selectedView}`);
        await onPageLoaded(selectedView);
    }

    nav.addEventListener('click', (event) => {
        const button = event.target.closest('.nav-button');
        if (button) loadPage(button.dataset.view);
    });

    window.addEventListener('popstate', () => loadPage(window.location.hash.slice(1), false));

    return {
        start: () => loadPage(window.location.hash.slice(1) || 'setup', false)
    };
}
