// The favicon and app icon links for <head>. The marketing layout and the
// Starlight config both read this list, so the two cannot drift.
// The files themselves are written by scripts/icons.mjs (`npm run icons`).

/** The main favicon: the Cabbage mark as an SVG. */
export const favicon = '/favicon.svg';

/** The other icon links, as attributes for a <link> element. */
export const iconLinks = [
	// For browsers that do not take an SVG favicon.
	{ rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
	{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
	{ rel: 'manifest', href: '/site.webmanifest' },
];
