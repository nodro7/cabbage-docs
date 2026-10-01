// Checks the built site in dist/ for broken internal links.
// Run after a build: `npm run check` does both.
//
// It checks that:
// - every internal href and src in every HTML page points at a file that exists
// - every #fragment points at an id on the target page
// - every redirect in src/data/redirects.mjs has a redirect page, and its
//   target is a real page
// - no redirect page is listed in the sitemap
//
// No dependencies. Exits with code 1 if anything is wrong.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { redirects } from '../src/data/redirects.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://cabbageaudio.com';

if (!existsSync(dist)) {
	console.error('dist/ not found. Run `npm run build` first.');
	process.exit(1);
}

/** Every .html file under dist, as paths relative to dist. */
function htmlFiles(dir = dist) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
		else if (name.endsWith('.html')) out.push(relative(dist, full).split('\\').join('/'));
	}
	return out;
}

const cache = new Map();
function read(file) {
	if (!cache.has(file)) cache.set(file, readFileSync(join(dist, file), 'utf8'));
	return cache.get(file);
}

const idCache = new Map();
function idsIn(file) {
	if (!idCache.has(file)) {
		const ids = new Set();
		for (const match of read(file).matchAll(/\s(?:id|name)="([^"]+)"/g)) ids.add(match[1]);
		idCache.set(file, ids);
	}
	return idCache.get(file);
}

/** Maps a site path such as /docs/faqs/ to a file in dist, or null. */
function resolve(pathname) {
	const clean = decodeURIComponent(pathname);
	if (clean.endsWith('/')) {
		const file = posix.join(clean, 'index.html').slice(1);
		return existsSync(join(dist, file)) ? file : null;
	}
	const file = clean.slice(1);
	if (existsSync(join(dist, file)) && statSync(join(dist, file)).isFile()) return file;
	return null;
}

const redirectSources = new Set(Object.keys(redirects).map((from) => from.replace(/\/$/, '')));
const isRedirectPage = (file) => redirectSources.has('/' + file.replace(/\/?index\.html$/, ''));

const problems = [];
const pages = htmlFiles();
let checked = 0;

for (const file of pages) {
	const html = read(file);
	const pageUrl = new URL('/' + file.replace(/index\.html$/, ''), SITE);

	for (const tag of html.matchAll(/<[a-zA-Z][^>]*>/g)) {
		for (const attr of tag[0].matchAll(/\s(href|src)="([^"]*)"/g)) {
			const raw = attr[2].replace(/&amp;/g, '&');
			if (!raw || /^(mailto:|tel:|data:|javascript:)/.test(raw)) continue;

			let target;
			try {
				target = new URL(raw, pageUrl);
			} catch {
				problems.push(`${file}: cannot parse "${raw}"`);
				continue;
			}
			if (target.origin !== SITE) continue; // external
			checked++;

			const targetFile = resolve(target.pathname);
			if (!targetFile) {
				const missingSlash = resolve(target.pathname + '/');
				problems.push(
					missingSlash
						? `${file}: "${raw}" needs a trailing slash`
						: `${file}: "${raw}" does not exist`
				);
				continue;
			}
			if (target.hash && targetFile.endsWith('.html')) {
				const id = decodeURIComponent(target.hash.slice(1));
				if (id && !idsIn(targetFile).has(id)) {
					problems.push(`${file}: "${raw}" points at a missing #${id}`);
				}
			}
			// Internal links should go straight to the page, not through a redirect.
			if (attr[1] === 'href' && !isRedirectPage(file) && isRedirectPage(targetFile)) {
				problems.push(`${file}: "${raw}" links to a redirect; use the new URL`);
			}
		}
	}
}

// Redirects: each old path has a page, and its target is a real page.
for (const [from, to] of Object.entries(redirects)) {
	const stub = posix.join(from, 'index.html').slice(1);
	if (!existsSync(join(dist, stub))) {
		problems.push(`redirect ${from}: no redirect page was built`);
		continue;
	}
	if (!read(stub).includes(`url=${to}`)) {
		problems.push(`redirect ${from}: page does not redirect to ${to}`);
	}
	const targetFile = resolve(new URL(to, SITE).pathname);
	if (!targetFile) problems.push(`redirect ${from}: target ${to} does not exist`);
	else if (isRedirectPage(targetFile)) problems.push(`redirect ${from}: target ${to} is itself a redirect`);
}

// Sitemap: redirect pages stay out of it.
const sitemap = join(dist, 'sitemap-0.xml');
let sitemapCount = 0;
if (existsSync(sitemap)) {
	for (const match of readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
		sitemapCount++;
		const path = new URL(match[1]).pathname.replace(/\/$/, '');
		if (redirectSources.has(path)) problems.push(`sitemap: lists the redirect ${path}`);
	}
} else {
	problems.push('sitemap-0.xml was not built');
}

if (problems.length) {
	console.error(`\n${problems.length} problem(s) found:\n`);
	for (const problem of problems) console.error('  ' + problem);
	console.error('');
	process.exit(1);
}

console.log(
	`Links OK: ${checked} internal links in ${pages.length} pages, ` +
		`${Object.keys(redirects).length} redirects, ${sitemapCount} sitemap entries.`
);
