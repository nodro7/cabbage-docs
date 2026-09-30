// A lenient JSON grammar, used for every `json` code block and for the
// <Cabbage> section of `csound` blocks.
//
// The docs are full of JSON fragments such as `"active": true` with no
// braces around them. A strict JSON grammar cannot tell that "active" is a
// key there, so this one goes by shape instead: a string followed by a colon
// is a key. It also accepts the <Cabbage> tags that wrap the JSON in a .csd.

/** Shared with the Csound grammar (see csound-grammar.mjs). */
export const jsonPatterns = [
	{
		name: 'support.type.property-name.json',
		match: '"(?:[^"\\\\]|\\\\.)*"(?=\\s*:)',
	},
	{
		name: 'string.quoted.double.json',
		begin: '"',
		end: '"',
		patterns: [{ name: 'constant.character.escape.json', match: '\\\\.' }],
	},
	{ name: 'constant.numeric.json', match: '-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b' },
	{ name: 'constant.language.json', match: '\\b(?:true|false|null)\\b' },
	{ name: 'comment.block.json', begin: '/\\*', end: '\\*/' },
	{ name: 'comment.line.double-slash.json', match: '//.*$' },
	{ name: 'punctuation.json', match: '[{}\\[\\],:]' },
];

export default {
	name: 'json',
	scopeName: 'source.json.cabbage',
	patterns: [{ name: 'keyword.control.tag.csound', match: '</?Cabbage>' }, ...jsonPatterns],
};
