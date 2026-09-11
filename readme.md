# Server Guide

A lightweight Minecraft server guide and profile builder. The site provides setup instructions, joining and application information, and practical how-to guides in a small client-side web app.

## Features

- Modpack setup and profile generation
- Joining and application guidance
- How-to guides
- Hash-based navigation for setup, join, and guides views
- Light and dark theme support
- Responsive layout for desktop and mobile screens

## Run locally

The app loads page content and data with browser requests, so serve the project through a local HTTP server instead of opening `index.html` directly.

With Python installed:

```bash
python3 -m http.server 5500
```

Then open [http://localhost:5500](http://localhost:5500) in a browser.

To stop the server, press `Ctrl+C` in the terminal running it.

## Project structure

```text
index.html                 Main application shell
css/                       Base, layout, component, responsive, and page styles
data/                      Profile builder options
js/app.js                  Application bootstrap
js/config.js               Page definitions and titles
js/page-loader.js          Hash navigation and dynamic page loading
js/profile-builder.js      Setup profile builder behavior
js/theme.js                Theme switching
pages/                     HTML content for each application view
```

## Editing content

- Update page copy in `pages/`.
- Update profile choices in `data/profile-options.json`.
- Update shared styling in `css/` and page-specific styling in `css/pages/`.
- Add or rename views in `js/config.js`, then add the corresponding page file and navigation control.

No package installation or build step is required.

## Git workflow

Use `main` for everyday development. Cloudflare should deploy from `production`.

```bash
# Work on the site
```

```bash
git switch main
```
```bash
git pull --ff-only origin main
```


```bash
# Publish completed work to the deployment branch
```

```bash
git switch production
```
```bash
git pull --ff-only origin production
```
```bash
git merge --ff-only main
```
```bash
git push origin production
```
```bash
# Return to the working branch
```
```bash
git switch main
```

Keep the `production` branch deployable. Test changes on `main` before promoting them.

## Releases and tags

Tags identify fixed versions and are separate from the `main` and `production` branches. The `V2` tag is still used by the profile builder download URL in `data/profile-options.json`, so do not delete it unless that URL and its GitHub Release are replaced.

Older tags can be deleted if their GitHub Releases and download links are no longer needed. Deleting a tag from GitHub can make links that reference that tag unavailable, so check the release assets first.
