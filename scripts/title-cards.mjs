// Generates the title cards, the site thumbnails and the social images.
//
//   npm run title-cards
//
// For every video in src/data/videos.ts it writes
//   title-cards/<nn>-<name>.png        1920 x 1080, for the video editor and YouTube
//   public/img/videos/<id>.webp         640 x 360, the thumbnail on the site
//   public/img/videos/<id>-1280.webp   1280 x 720, for large and high-density screens
// and it writes the social images to public/og/ (1200 x 630).
//
// The results are committed. The site build never runs this script.
//
// How it works: satori lays out the text, with real fonts, and returns an SVG
// with the text as outlines. satori cannot use a variable font's width axis,
// so the condensed headline font is cut from the variable font first, with
// subset-font. sharp then stacks background, mark and text into one image.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import subsetFont from 'subset-font';
import { FONTS, socialCard, titleCard } from './lib/card-layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (...parts) => join(root, ...parts);

// src/data/videos.ts is TypeScript. Node runs it directly from version 22.18.
let videos;
let lessonLabel;
try {
	({ videos, lessonLabel } = await import('../src/data/videos.ts'));
} catch (error) {
	console.error(`Could not load src/data/videos.ts (${error.message}).\nThis script needs Node 22.18 or newer; you have ${process.version}.`);
	process.exit(1);
}

/** The social images: one default, and one each for Install, Learn and the docs. */
const SOCIAL = [
	{ file: 'default', label: '', title: ['Csound for the sound.', 'The web for everything you see.'], titleSize: 68 },
	{ file: 'install', label: 'Install', title: 'Install Cabbage 3' },
	{ file: 'learn', label: 'Learn', title: 'Learn Cabbage 3' },
	{ file: 'docs', label: 'Docs', title: 'Cabbage 3 documentation', titleSize: 88 },
];

// ---------------------------------------------------------------- fonts

/** A static font cut from a variable one, at fixed axis values. */
async function instance(file, axes) {
	const variable = await readFile(at('scripts/fonts', file));
	return subsetFont(variable, undefined, { targetFormat: 'sfnt', keepAllGlyphs: true, variationAxes: axes });
}

const fonts = [
	{ name: FONTS.display, data: await instance('InstrumentSans-Variable.ttf', { wdth: 80, wght: 600 }), weight: 600, style: 'normal' },
	{ name: FONTS.brand, data: await instance('InstrumentSans-Variable.ttf', { wdth: 85, wght: 700 }), weight: 700, style: 'normal' },
	{ name: FONTS.text, data: await instance('InstrumentSans-Variable.ttf', { wdth: 100, wght: 400 }), weight: 400, style: 'normal' },
	{ name: FONTS.mono, data: await instance('JetBrainsMono-Variable.ttf', { wght: 400 }), weight: 400, style: 'normal' },
];

// ---------------------------------------------------------------- rendering

const mark = await readFile(at('public/img/cabbage-mark.svg'));

/** Background, mark and text, stacked into one PNG buffer. */
async function render(card) {
	const text = await satori(card.text, { width: card.width, height: card.height, fonts });
	const logo = await sharp(mark, { density: 300 })
		.resize(card.logo.width, card.logo.height, { fit: 'fill' })
		.png()
		.toBuffer();
	return sharp(Buffer.from(card.background))
		.composite([
			{ input: logo, left: card.logo.left, top: card.logo.top },
			{ input: Buffer.from(text), left: 0, top: 0 },
		])
		.png({ compressionLevel: 9 })
		.toBuffer();
}

/** "08-building-a-simple-synth-plugin" */
function fileName(video) {
	const number = video.lesson === 'Overview' ? 0 : video.lesson;
	const name = video.shortTitle
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return `${String(number).padStart(2, '0')}-${name}`;
}

await mkdir(at('title-cards'), { recursive: true });
await mkdir(at('public/img/videos'), { recursive: true });
await mkdir(at('public/og'), { recursive: true });

let written = 0;

for (const video of videos) {
	const png = await render(titleCard({ label: lessonLabel(video), title: video.shortTitle }));
	await writeFile(at('title-cards', `${fileName(video)}.png`), png);
	await sharp(png).resize(640, 360).webp({ quality: 84 }).toFile(at('public/img/videos', `${video.id}.webp`));
	await sharp(png).resize(1280, 720).webp({ quality: 82 }).toFile(at('public/img/videos', `${video.id}-1280.webp`));
	written += 3;
	console.log(`${lessonLabel(video).padEnd(10)} ${video.shortTitle}`);
}

for (const social of SOCIAL) {
	const png = await render(socialCard(social));
	await writeFile(at('public/og', `${social.file}.png`), png);
	written += 1;
	console.log(`${'Social'.padEnd(10)} ${social.file}.png`);
}

console.log(`\n${written} files written: title-cards/, public/img/videos/ and public/og/.`);
