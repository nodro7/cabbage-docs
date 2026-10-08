// Widget and opcode examples: public/examples/<name>.csd is the single source. The docs
// pages render those files and link to them for download, so the page and
// the file can never drift apart again.
//
// Usage:
//   node scripts/examples.mjs status
//       Show where pluginId sits in each example file.
//
//   node scripts/examples.mjs plugin-id top|form [--all]
//       Rewrite the examples so pluginId is a top-level property ("top") or
//       a property of the form widget ("form"). Every change is validated:
//       the JSON must parse before and after, and nothing else may change.
//       By default only the examples used by a widget page are touched;
//       --all includes every file in public/examples.
//
//   node scripts/examples.mjs extract [--from <git-ref>]
//       Regenerate the files from the example blocks that used to be pasted
//       into the widget pages. The pages no longer contain those blocks, so
//       this reads them from git history (default: the last commit that had
//       them).
//
// No dependencies.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = 'src/content/docs/docs/widgets';
const opcodePagesDir = 'src/content/docs/docs/opcodes';
const examplesDir = join(root, 'public/examples');

/** The last commit in which the widget pages still contained their example blocks. */
const PAGES_WITH_BLOCKS = '7198a1d';

const [command, ...args] = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

/** horizontal-slider -> horizontalSlider */
const camel = (kebab) => kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

// ---------------------------------------------------------------- JSON helpers

/** The text between <Cabbage> and </Cabbage>, with its position in the file. */
function cabbageSection(text) {
	const match = /<Cabbage>([\s\S]*?)<\/Cabbage>/.exec(text);
	if (!match) return null;
	const start = match.index + '<Cabbage>'.length;
	return { json: match[1], start, end: start + match[1].length };
}

/** Index of the bracket that closes the one at `open`, skipping strings. */
function matchingClose(text, open) {
	let depth = 0;
	let inString = false;
	for (let i = open; i < text.length; i++) {
		const char = text[i];
		if (inString) {
			if (char === '\\') i++;
			else if (char === '"') inString = false;
		} else if (char === '"') inString = true;
		else if (char === '{' || char === '[') depth++;
		else if (char === '}' || char === ']') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/** Nesting depth at `index`, skipping strings. */
function depthAt(text, index) {
	let depth = 0;
	let inString = false;
	for (let i = 0; i < index; i++) {
		const char = text[i];
		if (inString) {
			if (char === '\\') i++;
			else if (char === '"') inString = false;
		} else if (char === '"') inString = true;
		else if (char === '{' || char === '[') depth++;
		else if (char === '}' || char === ']') depth--;
	}
	return depth;
}

/** The { ... } span of the form widget inside the JSON text. */
function formObject(json) {
	const type = /"type"\s*:\s*"form"/.exec(json);
	if (!type) return null;
	let open = type.index;
	while (open >= 0 && !(json[open] === '{' && matchingClose(json, open) > type.index)) open--;
	if (open < 0) return null;
	return { open, close: matchingClose(json, open) };
}

/** Where pluginId is: "top", "form", "both" or "none". */
function shapeOf(json) {
	const data = JSON.parse(json);
	const form = (data.widgets ?? []).find((widget) => widget?.type === 'form');
	const top = typeof data.pluginId === 'string';
	const inForm = typeof form?.pluginId === 'string';
	return top && inForm ? 'both' : top ? 'top' : inForm ? 'form' : 'none';
}

/** Key order does not matter when comparing before and after. */
const canonical = (value) =>
	JSON.stringify(value, (_, inner) =>
		inner && typeof inner === 'object' && !Array.isArray(inner)
			? Object.fromEntries(Object.entries(inner).sort(([a], [b]) => a.localeCompare(b)))
			: inner
	);

const STRING = '"(?:[^"\\\\]|\\\\.)*"';

/** Moves pluginId from the top level into the form widget. */
function topToForm(json) {
	const line = new RegExp(`^[ \\t]*"pluginId"[ \\t]*:[ \\t]*(${STRING})[ \\t]*,?[ \\t]*\\r?\\n`, 'm').exec(json);
	if (!line || depthAt(json, line.index) !== 1) throw new Error('top-level "pluginId" line not found');
	let out = json.slice(0, line.index) + json.slice(line.index + line[0].length);
	const form = formObject(out);
	if (!form) throw new Error('no form widget');
	let insertAt = form.close;
	while (/\s/.test(out[insertAt - 1])) insertAt--;
	out = `${out.slice(0, insertAt)}, "pluginId": ${line[1]}${out.slice(insertAt)}`;
	return out;
}

/** Moves pluginId from the form widget to the top level. */
function formToTop(json) {
	const form = formObject(json);
	if (!form) throw new Error('no form widget');
	const body = json.slice(form.open, form.close + 1);
	const inside =
		new RegExp(`,[ \\t]*"pluginId"[ \\t]*:[ \\t]*(${STRING})`).exec(body) ??
		new RegExp(`"pluginId"[ \\t]*:[ \\t]*(${STRING})[ \\t]*,[ \\t]*`).exec(body);
	if (!inside) throw new Error('"pluginId" not found in the form widget');
	const id = inside[1];
	let out =
		json.slice(0, form.open) +
		body.slice(0, inside.index) +
		body.slice(inside.index + inside[0].length) +
		json.slice(form.close + 1);

	// Insert as the first top-level property, lining its colon up with the others.
	const rootOpen = out.indexOf('{');
	const firstKey = /\n([ \t]*)"[^"\n]+"([ \t]*):/.exec(out.slice(rootOpen));
	if (!firstKey) throw new Error('no top-level property to align with');
	const indent = firstKey[1];
	let colon = 0;
	for (const key of out.matchAll(/^([ \t]*)("[^"\n]+")([ \t]*):/gm)) {
		if (key[1] === indent && depthAt(out, key.index + key[1].length) === 1) {
			colon = Math.max(colon, key[2].length + key[3].length);
		}
	}
	const padded = '"pluginId"'.padEnd(Math.max(colon, '"pluginId"'.length));
	const at = rootOpen + firstKey.index + 1;
	return `${out.slice(0, at)}${indent}${padded}: ${id},\n${out.slice(at)}`;
}

// ---------------------------------------------------------------- file lists

/** Example names used by a widget or opcode page (<WidgetExample|ExampleCode name="..." />). */
function usedExamples() {
	const names = new Set();
	for (const dir of [pagesDir, opcodePagesDir]) {
		for (const file of readdirSync(join(root, dir))) {
			if (!file.endsWith('.mdx')) continue;
			const text = readFileSync(join(root, dir, file), 'utf8');
			for (const match of text.matchAll(/<(?:WidgetExample|ExampleCode)\s+name="([^"]+)"/g)) names.add(match[1]);
		}
	}
	return [...names].sort();
}

const allExamples = () =>
	readdirSync(examplesDir)
		.filter((file) => file.endsWith('.csd'))
		.map((file) => file.replace(/\.csd$/, ''))
		.sort();

const pathOf = (name) => join(examplesDir, `${name}.csd`);

// ---------------------------------------------------------------- commands

function status() {
	const used = new Set(usedExamples());
	for (const name of allExamples()) {
		const section = cabbageSection(readFileSync(pathOf(name), 'utf8'));
		let shape = 'no <Cabbage> section';
		if (section) {
			try {
				shape = `pluginId: ${shapeOf(section.json)}`;
			} catch (error) {
				shape = `invalid JSON (${error.message})`;
			}
		}
		console.log(`${name.padEnd(18)} ${shape.padEnd(22)} ${used.has(name) ? 'used by a widget page' : ''}`);
	}
}

function pluginId() {
	const target = args.find((arg) => arg === 'top' || arg === 'form');
	if (!target) {
		console.error('Say where pluginId should go: "top" or "form".');
		process.exit(1);
	}
	const names = flag('--all') ? allExamples() : usedExamples();
	let changed = 0;
	let skipped = 0;
	let failed = 0;
	for (const name of names) {
		const file = pathOf(name);
		if (!existsSync(file)) {
			console.log(`${name}: skipped (no file)`);
			skipped++;
			continue;
		}
		const text = readFileSync(file, 'utf8');
		const section = cabbageSection(text);

		// Files this command has nothing to do with are skipped, not failed.
		let before;
		let shape;
		try {
			if (!section) throw new Error('no <Cabbage> section');
			before = JSON.parse(section.json);
			shape = shapeOf(section.json);
		} catch (error) {
			console.log(`${name}: skipped (${section ? 'the <Cabbage> section is not JSON' : error.message})`);
			skipped++;
			continue;
		}
		if (shape === target) {
			console.log(`${name}: already ${target}`);
			continue;
		}
		if (shape !== 'top' && shape !== 'form') {
			console.log(`${name}: skipped (pluginId is "${shape}", nothing to move)`);
			skipped++;
			continue;
		}

		try {
			const json = target === 'form' ? topToForm(section.json) : formToTop(section.json);

			// Validate: it parses, and only pluginId moved.
			const after = JSON.parse(json);
			const expected = structuredClone(before);
			const form = expected.widgets.find((widget) => widget?.type === 'form');
			if (target === 'form') {
				form.pluginId = expected.pluginId;
				delete expected.pluginId;
			} else {
				expected.pluginId = form.pluginId;
				delete form.pluginId;
			}
			if (canonical(after) !== canonical(expected)) throw new Error('the result changed more than pluginId');

			writeFileSync(file, text.slice(0, section.start) + json + text.slice(section.end));
			console.log(`${name}: pluginId moved to ${target === 'top' ? 'the top level' : 'the form widget'}`);
			changed++;
		} catch (error) {
			console.error(`${name}: left unchanged (${error.message})`);
			failed++;
		}
	}
	console.log(`\n${changed} file(s) changed, ${skipped} skipped, ${failed} failed.`);
	if (failed) process.exit(1);
}

function extract() {
	const ref = option('--from') ?? PAGES_WITH_BLOCKS;
	const git = (...gitArgs) => execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8' });
	const pages = git('ls-tree', '--name-only', ref, `${pagesDir}/`)
		.split('\n')
		.filter((path) => path.endsWith('.mdx'));
	let written = 0;
	for (const page of pages) {
		const name = camel(page.slice(pagesDir.length + 1).replace(/\.mdx$/, ''));
		const source = git('show', `${ref}:${page}`);
		const blocks = [...source.matchAll(/^```csound[^\n]*\n([\s\S]*?)^```/gm)]
			.map((match) => match[1])
			.filter((block) => block.includes('<CsoundSynthesizer>'));
		const unique = [...new Set(blocks)];
		if (unique.length === 0) {
			console.log(`${name}: no complete example in the page`);
			continue;
		}
		if (unique.length > 1) {
			console.error(`${name}: ${unique.length} different examples in the page, left alone`);
			continue;
		}
		writeFileSync(pathOf(name), unique[0].replace(/\s+$/, '') + '\n');
		console.log(`${name}: written from ${page}@${ref}`);
		written++;
	}
	console.log(`\n${written} file(s) written to public/examples.`);
}

if (command === 'status') status();
else if (command === 'plugin-id') pluginId();
else if (command === 'extract') extract();
else {
	console.error('Usage: node scripts/examples.mjs status | plugin-id top|form [--all] | extract [--from <git-ref>]');
	process.exit(1);
}
