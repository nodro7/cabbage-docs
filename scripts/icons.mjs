// Generates the favicon and the app icons from the Cabbage mark.
//
//   npm run icons
//
// It reads public/img/cabbage-mark.svg and writes
//   public/favicon.svg            the mark, cropped to a square
//   public/favicon.ico            16, 32 and 48 px, for browsers that want an .ico
//   public/apple-touch-icon.png   180 x 180, on the dark page colour
//   public/img/icon-192.png       192 x 192 and
//   public/img/icon-512.png       512 x 512, for the web app manifest
//   public/site.webmanifest       names the two icons above
//
// The results are committed. The site build never runs this script. Run it
// again only if the mark or the dark --cb-chrome colour changes.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (...parts) => join(root, ...parts);

/** How much of an app icon the mark fills. The rest is background, which
 *  keeps the mark clear of the corners that phones round off or mask. */
const APP_ICON_FILL = 0.62;
/** Clear space around the mark in the favicon, as a share of its size. */
const FAVICON_MARGIN = 0.02;

// ---------------------------------------------------------------- the mark

const mark = await readFile(at('public/img/cabbage-mark.svg'), 'utf8');

// The drawing itself: the paths, without the wrapper or its metadata.
const drawing = mark
	.replace(/<metadata>[\s\S]*?<\/metadata>/, '')
	.replace(/^[\s\S]*?<svg[^>]*>/, '')
	.replace(/<\/svg>\s*$/, '')
	.trim();
if (!drawing.includes('<path')) throw new Error('cabbage-mark.svg: no paths found');

const viewBox = mark.match(/viewBox="([\d.\s-]+)"/)?.[1].trim().split(/\s+/).map(Number);
if (!viewBox || viewBox.length !== 4) throw new Error('cabbage-mark.svg: no viewBox found');
const [, , markWidth, markHeight] = viewBox;

// The mark does not fill its viewBox. Draw it large and trim the empty
// edges to find the box the ink really occupies, in SVG units.
const SCALE = 20;
const drawn = await sharp(Buffer.from(mark), { density: 72 * SCALE })
	.resize(Math.round(markWidth * SCALE), Math.round(markHeight * SCALE))
	.png()
	.toBuffer();
const { info } = await sharp(drawn).trim().toBuffer({ resolveWithObject: true });
const ink = {
	x: -info.trimOffsetLeft / SCALE,
	y: -info.trimOffsetTop / SCALE,
	width: info.width / SCALE,
	height: info.height / SCALE,
};

// A square around the ink, with a little clear space.
const side = Math.max(ink.width, ink.height) * (1 + 2 * FAVICON_MARGIN);
const square = [ink.x + ink.width / 2 - side / 2, ink.y + ink.height / 2 - side / 2, side, side]
	.map((value) => Number(value.toFixed(2)))
	.join(' ');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${square}">\n${drawing}\n</svg>\n`;

// ---------------------------------------------------------------- colour

// The app icons sit on the dark header colour. tokens.css is the source.
const tokens = await readFile(at('src/styles/tokens.css'), 'utf8');
const background = tokens.match(/--cb-chrome:\s*(#[0-9a-fA-F]{6})/)?.[1];
if (!background) throw new Error('tokens.css: --cb-chrome not found');

// ---------------------------------------------------------------- images

/** The mark alone on a transparent square. */
const plain = (size) => sharp(Buffer.from(faviconSvg), { density: 72 * 16 }).resize(size, size).png().toBuffer();

/** The mark centred on a filled square. */
async function appIcon(size) {
	const inner = Math.round(size * APP_ICON_FILL);
	return sharp({ create: { width: size, height: size, channels: 4, background } })
		.composite([{ input: await plain(inner), gravity: 'centre' }])
		.png()
		.toBuffer();
}

/** An .ico file that holds PNG images, which every current browser reads. */
function ico(images) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);
	let offset = header.length + 16 * images.length;
	const entries = images.map(({ size, png }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size, 0); // width
		entry.writeUInt8(size, 1); // height
		entry.writeUInt16LE(1, 4); // colour planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(png.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += png.length;
		return entry;
	});
	return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const manifest = {
	name: 'Cabbage',
	short_name: 'Cabbage',
	start_url: '/',
	display: 'browser',
	background_color: background,
	theme_color: background,
	icons: [192, 512].map((size) => ({ src: `/img/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
};

const files = {
	'public/favicon.svg': faviconSvg,
	'public/favicon.ico': ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await plain(size) })))),
	'public/apple-touch-icon.png': await appIcon(180),
	'public/img/icon-192.png': await appIcon(192),
	'public/img/icon-512.png': await appIcon(512),
	'public/site.webmanifest': JSON.stringify(manifest, null, '\t') + '\n',
};

for (const [path, contents] of Object.entries(files)) {
	await writeFile(at(path), contents);
	console.log(`${path}  ${Buffer.byteLength(contents)} bytes`);
}
