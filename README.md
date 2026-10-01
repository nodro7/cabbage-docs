# cabbageaudio.com

The Cabbage 3 website: the marketing pages (Home, Install, Learn) and the Cabbage 3 documentation. It is one static site, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) and published to GitHub Pages.

## Run it

You need Node 22.18 or newer. The deploy uses Node 24.

```bash
npm install
npm run dev
```

The dev server prints its address, usually http://localhost:4321.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server. |
| `npm run build` | Builds the static site to `dist/`. |
| `npm run preview` | Serves the build locally. |
| `npm run check` | Builds, then checks every internal link, anchor, redirect and sitemap entry. The deploy runs this. |
| `npm run title-cards` | Regenerates the video title cards, thumbnails and social images. |
| `npm run icons` | Regenerates the favicon and app icons from the logo. |

## Where things are

| Path | What is there |
|---|---|
| `src/content/docs/docs/` | The documentation, in Markdown. Its URLs start with `/docs/`. |
| `src/pages/` | Home, Install, Learn and the 404 page. |
| `src/components/` | `site/` is the shared header, footer and buttons. `home/`, `install/` and `docs/` belong to those pages. `starlight/` holds the overrides that give the docs the same header and footer. `properties/` holds the property descriptions shared by the widget pages. |
| `src/data/` | The lists the pages are built from: videos, palette commands, navigation, redirects and install notes. |
| `src/styles/tokens.css` | Every colour, type size and spacing value, for both themes. |
| `src/scripts/` | The browser scripts, one small module per interactive piece. |
| `src/syntax/` | The Csound grammar and the code colours. |
| `public/examples/` | The `.csd` examples shown on the widget pages. |
| `scripts/` | Node scripts: link checker, title cards, icons and examples. |
| `title-cards/` | The 1920 x 1080 title cards, for the video editor and YouTube. |

## Common jobs

### Add a doc page

Create a Markdown file in one of the folders under `src/content/docs/docs/` (`using`, `widgets`, `custom-ui` or `opcodes`). Start it with a title and a one-sentence description:

```md
---
title: "Presets"
description: "How to save and recall presets from a Cabbage instrument."
---
```

That is all. The page appears in the sidebar under its folder, in alphabetical order by file name. To place it elsewhere in its group, add this to the frontmatter:

```md
sidebar:
  order: 2
```

A few conventions keep the docs consistent:

- Link to other pages with a full path and a trailing slash, for example `/docs/widgets/button/`. `npm run check` reports any link that does not resolve.
- Give every code fence a language: `csound` for Csound and whole `.csd` files, and `json`, `js`, `html` or `bash` for the rest.
- Use `:::note` and `:::caution` for callouts.
- Do not repeat the title as a `#` heading. Start sections at `##`.

### Add or change a widget example

Each widget page shows the file in `public/examples/` that matches its name, and offers it for download. Edit the `.csd` file and the page follows. A new widget page needs two lines:

```mdx
<WidgetExample name="rotarySlider" />
<ExampleCode name="rotarySlider" />
```

If `public/img/widgets/rotarySlider.png` exists, the panel shows it as a screenshot.

### Add a video

Add one line to `src/data/videos.ts` with the ID from the YouTube URL, then make its title card and thumbnail:

```bash
npm run title-cards
```

Commit the new files in `title-cards/` and `public/img/videos/`. The Learn page, the counts in the headings and the order of the lessons all come from that one list.

### Add a command to the Home page palette

Add an entry to `src/data/commands.ts`. Use the command's title exactly as the extension shows it.

### Move or rename a page

Rename the file, then add the old path to `src/data/redirects.mjs` so old links keep working. `npm run check` confirms that the redirect was built and that nothing on the site still links to the old address.

### Change a colour or a type size

Edit `src/styles/tokens.css`. The site, the docs and the code blocks all read from it. Run `npm run title-cards` and `npm run icons` afterwards if the change should show in the generated images.

## The release shown on the Install page

The version number, date and download links are read from the GitHub releases of [rorywalsh/vscabbage](https://github.com/rorywalsh/vscabbage) when the site is built. Nothing is fetched in the visitor's browser. The site rebuilds every day, so a new release appears within a day, or at once if you run the deploy workflow by hand.

If GitHub cannot be reached during a build, the build still succeeds. It uses `src/data/release-fallback.json`, and the download buttons link to the releases page. Update that file when a major release ships. To see the fallback locally:

```bash
CABBAGE_RELEASE_OFFLINE=1 npm run build
```

Set `GITHUB_TOKEN` in the environment to avoid GitHub's rate limit for anonymous requests. The deploy workflow does this.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages. It runs on every push to `main`, once a day, and on demand from the Actions tab. It runs `npm run check`, so a broken link stops the deploy.

One-time setup in the repository settings:

1. Under Pages, set the source to GitHub Actions.
2. Set the custom domain to `cabbageaudio.com`. `public/CNAME` already names it.

GitHub pauses scheduled workflows in a public repository that has had no activity for 60 days. It sends an email first, and one click in the Actions tab turns the schedule back on.

## Ground rules

- No analytics, no cookies and no third-party requests when a page loads. Fonts are served from the site. YouTube is contacted only after someone presses play on a video.
- Dark is the default theme and light must be complete. Both meet WCAG 2.2 AA with the colour pairs in `tokens.css`.
- The brand green `#93d200` is for fills, never for text on a light background.
- Everything interactive works with the keyboard, and the pages still make sense without JavaScript.
- Product claims on the marketing pages must match the docs.

## Open questions

Placeholders that wait for an answer are marked `TODO(G)`:

```bash
grep -rn "TODO(G)" src
```
