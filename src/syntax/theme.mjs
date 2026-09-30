// Syntax themes for Expressive Code, one dark and one light.
//
// The token colours are read from the --cb-code-* values in
// src/styles/tokens.css, so that file stays the single source of truth.
// (Expressive Code needs literal colours inside a theme; var() is not
// accepted there. Frame and UI colours are set with CSS variables in
// astro.config.mjs instead.)
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// This module is loaded by Node directly and also bundled by Vite for the
// <Code> component, where import.meta.url points into the build output. So
// look next to this file first, then from the project root.
const tokensPath = [
	resolve(dirname(fileURLToPath(import.meta.url)), '../styles/tokens.css'),
	resolve(process.cwd(), 'src/styles/tokens.css'),
].find((path) => existsSync(path));
if (!tokensPath) throw new Error('src/styles/tokens.css not found');
const tokensCss = readFileSync(tokensPath, 'utf-8');

/** The declarations inside the first rule that starts with `selector {`. */
function block(selector) {
	const start = tokensCss.indexOf(`${selector} {`);
	if (start === -1) throw new Error(`tokens.css: no "${selector}" rule`);
	return tokensCss.slice(start, tokensCss.indexOf('\n}', start));
}

function token(css, name) {
	const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,8})`));
	if (!match) throw new Error(`tokens.css: ${name} not found`);
	return match[1];
}

function palette(css) {
	return {
		bg: token(css, '--cb-bg'),
		fg: token(css, '--cb-fg'),
		keyword: token(css, '--cb-code-keyword'),
		string: token(css, '--cb-code-string'),
		comment: token(css, '--cb-code-comment'),
		punct: token(css, '--cb-code-punct'),
	};
}

/** A minimal VS Code-style theme: four colours, everything else is --cb-fg. */
function theme(type, colors) {
	return {
		name: `cabbage-${type}`,
		type,
		colors: {
			'editor.background': colors.bg,
			'editor.foreground': colors.fg,
		},
		tokenColors: [
			{
				scope: ['comment', 'punctuation.definition.comment'],
				settings: { foreground: colors.comment },
			},
			{
				scope: ['string', 'punctuation.definition.string'],
				settings: { foreground: colors.string },
			},
			{
				// Keywords, Csound opcodes, JSON keys and HTML tag names.
				scope: [
					'keyword',
					'storage',
					'entity.name.function.csound',
					'support.type.property-name',
					'punctuation.support.type.property-name',
					'entity.name.tag',
					'constant.language.null',
					'constant.language.undefined',
				],
				settings: { foreground: colors.keyword },
			},
			{
				// Punctuation, operators and the <Cabbage>, <CsInstruments> tags.
				scope: [
					'punctuation',
					'keyword.operator',
					'meta.brace',
					'storage.type.function.arrow',
					'keyword.control.tag.csound',
				],
				settings: { foreground: colors.punct },
			},
		],
	};
}

export const cbDark = theme('dark', palette(block(':root')));
export const cbLight = theme('light', palette(block(":root[data-theme='light']")));
