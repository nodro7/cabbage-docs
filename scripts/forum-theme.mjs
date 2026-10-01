// Prepares the Discourse theme in forum-theme/ and packs it for upload.
//
//   npm run forum-theme
//
// It
//   1. copies the theme's assets into forum-theme/assets/: the two fonts
//      from the same packages the site uses, their licences, and the mark
//   2. checks the theme: about.json is valid, every asset it names exists,
//      and the text colours of both palettes meet 4.5:1 on their grounds
//   3. writes forum-theme.zip, the file an admin uploads to Discourse
//
// The assets are committed, so the folder is complete as it stands. The zip
// is not committed. No dependencies beyond Node.

import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (...parts) => join(root, ...parts);
const theme = at('forum-theme');

// ---------------------------------------------------------------- 1. assets

const fontFiles = 'node_modules/@fontsource-variable';
const ASSETS = [
	[`${fontFiles}/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2`, 'instrument-sans-latin.woff2'],
	[`${fontFiles}/instrument-sans/files/instrument-sans-latin-ext-wdth-normal.woff2`, 'instrument-sans-latin-ext.woff2'],
	[`${fontFiles}/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2`, 'jetbrains-mono-latin.woff2'],
	[`${fontFiles}/jetbrains-mono/files/jetbrains-mono-latin-ext-wght-normal.woff2`, 'jetbrains-mono-latin-ext.woff2'],
	['scripts/fonts/OFL-InstrumentSans.txt', 'OFL-InstrumentSans.txt'],
	['scripts/fonts/OFL-JetBrainsMono.txt', 'OFL-JetBrainsMono.txt'],
	['public/img/cabbage-mark.svg', 'cabbage-mark.svg'],
];

await mkdir(join(theme, 'assets'), { recursive: true });
for (const [from, to] of ASSETS) await copyFile(at(from), join(theme, 'assets', to));

// ---------------------------------------------------------------- 2. checks

const problems = [];
const about = JSON.parse(await readFile(join(theme, 'about.json'), 'utf8'));

for (const [name, path] of Object.entries(about.assets ?? {})) {
	try {
		await stat(join(theme, path));
	} catch {
		problems.push(`about.json: asset "${name}" points at ${path}, which does not exist`);
	}
}

// The twelve colours every Discourse palette has. One left out would fall
// back to the value of Discourse's light palette, which is wrong in a dark one.
const BASE_COLOURS = ['primary', 'secondary', 'tertiary', 'quaternary', 'header_background', 'header_primary', 'highlight', 'selected', 'hover', 'danger', 'success', 'love'];

/** WCAG relative luminance of a six-digit hex colour. */
function luminance(hex) {
	const [r, g, b] = [0, 2, 4]
		.map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}

// Text colours, and the grounds each of them can sit on. A name missing
// from a palette is skipped: Discourse then derives the colour itself.
const TEXT = [
	'primary', 'primary-high', 'primary-medium', 'primary-low-mid', 'primary-500', 'primary-700',
	// In a dark palette Discourse swaps some greys for these.
	'secondary-medium', 'primary-med-or-secondary-high', 'primary-high-or-secondary-low', 'primary-low-mid-or-secondary-high', 'primary-low-mid-or-secondary-low',
	'tertiary', 'tertiary-medium', 'quaternary', 'danger', 'success', 'love',
];
const GROUNDS = ['secondary', 'primary-very-low', 'primary-low', 'hover', 'selected', 'selected-hover', 'header_background', 'tertiary-low', 'tertiary-very-low', 'danger-low', 'success-low'];
const PAIRS = [
	...TEXT.flatMap((text) => GROUNDS.map((ground) => [text, ground])),
	// The header and code blocks have text colours of their own.
	...['header_primary', 'header_primary-high', 'header_primary-medium', 'header_primary-low-mid'].map((text) => [text, 'header_background']),
	...['hljs-comment', 'hljs-punctuation', 'hljs-keyword', 'hljs-attr', 'hljs-attribute', 'hljs-title', 'hljs-name', 'hljs-string', 'hljs-symbol', 'hljs-variable'].map((text) => [text, 'hljs-bg']),
	['primary', 'highlight'],
	['primary', 'inline-code-bg'],
	// Filled buttons and count badges write in the page colour.
	['secondary', 'danger'],
	['secondary', 'success'],
	['secondary', 'tertiary'],
	['secondary', 'tertiary-medium'],
];

let checked = 0;
for (const [name, colours] of Object.entries(about.color_schemes ?? {})) {
	for (const base of BASE_COLOURS) {
		if (!colours[base]) problems.push(`${name}: "${base}" is missing`);
	}
	for (const [key, hex] of Object.entries(colours)) {
		if (!/^[0-9a-f]{6}$/.test(hex)) problems.push(`${name}: "${key}" must be six lower-case hex digits, got "${hex}"`);
	}
	for (const [text, ground] of PAIRS) {
		if (!colours[text] || !colours[ground]) continue;
		checked++;
		const ratio = contrast(colours[text], colours[ground]);
		if (ratio < 4.5) problems.push(`${name}: ${text} (#${colours[text]}) on ${ground} (#${colours[ground]}) is ${ratio.toFixed(2)}:1, below 4.5:1`);
	}
}

const definitions = await readFile(join(theme, 'common/color_definitions.scss'), 'utf8');

// Colours written as dark-light-choose(light, dark): each value is read on
// the page and on a hovered row of the palette it belongs to.
const isDark = (colours) => luminance(colours.primary) > luminance(colours.secondary);
for (const [, name, light, dark] of definitions.matchAll(/--cb-(heat-[\w-]+):\s*#\{dark-light-choose\(#([0-9a-f]{6}),\s*#([0-9a-f]{6})\)\}/g)) {
	for (const [scheme, colours] of Object.entries(about.color_schemes ?? {})) {
		const text = isDark(colours) ? dark : light;
		for (const ground of ['secondary', 'hover']) {
			if (!colours[ground]) continue;
			checked++;
			const ratio = contrast(text, colours[ground]);
			if (ratio < 4.5) problems.push(`${scheme}: --cb-${name} (#${text}) on ${ground} (#${colours[ground]}) is ${ratio.toFixed(2)}:1, below 4.5:1`);
		}
	}
}

// The green button: ink on the fill, at rest and hovered.
const green = Object.fromEntries([...definitions.matchAll(/--cb-(green[\w-]*):\s*#([0-9a-f]{6})/g)].map((m) => [m[1], m[2]]));
for (const fill of ['green', 'green-hover']) {
	checked++;
	if (!green[fill] || !green['green-ink']) problems.push(`color_definitions.scss: --cb-${fill} or --cb-green-ink not found`);
	else if (contrast(green['green-ink'], green[fill]) < 4.5) problems.push(`button ink on --cb-${fill} is below 4.5:1`);
}

if (problems.length) {
	console.error(`\n${problems.length} problem(s) in forum-theme:\n`);
	for (const problem of problems) console.error('  ' + problem);
	console.error('');
	process.exit(1);
}

// ---------------------------------------------------------------- 3. zip

/** Every file under a folder, as paths relative to it, in a stable order. */
async function filesIn(dir, base = dir) {
	const out = [];
	for (const name of (await readdir(dir)).sort()) {
		if (name === '.DS_Store') continue;
		const full = join(dir, name);
		if ((await stat(full)).isDirectory()) out.push(...(await filesIn(full, base)));
		else out.push(relative(base, full).split('\\').join('/'));
	}
	return out;
}

/** A zip archive of { name, data } entries. Dates are fixed, so the same
 *  input always gives the same file. */
function zip(entries) {
	const DOS_TIME = 0;
	const DOS_DATE = (2026 - 1980) << 9 | 1 << 5 | 1; // 1 January 2026
	const local = [];
	const central = [];
	let offset = 0;
	for (const { name, data } of entries) {
		const nameBytes = Buffer.from(name, 'utf8');
		const packed = deflateRawSync(data, { level: 9 });
		const fields = Buffer.alloc(26);
		fields.writeUInt16LE(20, 0); // version needed
		fields.writeUInt16LE(0x0800, 2); // names are UTF-8
		fields.writeUInt16LE(8, 4); // deflate
		fields.writeUInt16LE(DOS_TIME, 6);
		fields.writeUInt16LE(DOS_DATE, 8);
		fields.writeUInt32LE(crc32(data), 10);
		fields.writeUInt32LE(packed.length, 14);
		fields.writeUInt32LE(data.length, 18);
		fields.writeUInt16LE(nameBytes.length, 22);

		const localHeader = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), fields, nameBytes]);
		local.push(localHeader, packed);

		const tail = Buffer.alloc(16);
		tail.writeUInt32LE(0o100644 << 16 >>> 0, 6); // an ordinary file
		tail.writeUInt32LE(offset, 10);
		central.push(Buffer.concat([Buffer.from([0x50, 0x4b, 0x01, 0x02, 20, 3]), fields, tail.subarray(0, 14), nameBytes]));
		central.at(-1).writeUInt32LE(offset, 42);

		offset += localHeader.length + packed.length;
	}
	const directory = Buffer.concat(central);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(entries.length, 8);
	end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(directory.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...local, directory, end]);
}

const names = await filesIn(theme);
const archive = zip(await Promise.all(names.map(async (name) => ({ name, data: await readFile(join(theme, name)) }))));
await writeFile(at('forum-theme.zip'), archive);

console.log(`forum-theme: ${ASSETS.length} assets copied, ${checked} colour pairs meet 4.5:1.`);
console.log(`forum-theme.zip written: ${names.length} files, ${(archive.length / 1024).toFixed(0)} KB.`);
