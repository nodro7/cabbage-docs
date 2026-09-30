// The Csound grammar used for every `csound` code block, in the docs and on
// the marketing pages. It starts from csound.tmLanguage.json and adjusts it
// here, so the JSON file itself can be replaced without losing anything.
//
// The JSON files are imported rather than read from disk, because this module
// is loaded by Node directly and also bundled by Vite for the <Code> component.
import baseGrammar from './csound.tmLanguage.json' with { type: 'json' };
import csoundOpcodes from './csound-opcodes.json' with { type: 'json' };
import cabbageOpcodes from './cabbage-opcodes.json' with { type: 'json' };
import { jsonPatterns } from './json-grammar.mjs';

// Opcodes: the Csound list, plus the Cabbage opcodes and the Csound 7
// opcode-array opcodes (create, run) that the Csound list does not have.
const opcodes = [...csoundOpcodes, ...cabbageOpcodes];

const opcodePattern = `\\b(?:${opcodes
	.filter(Boolean)
	.map((w) => w.trim())
	.filter(Boolean)
	.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
	.sort((a, b) => b.length - a.length)
	.join('|')})\\b`;

// Work on a copy: imported JSON is shared.
const grammar = structuredClone(baseGrammar);

// Inject the opcode pattern directly on the parsed object to avoid JSON escape issues
grammar.repository.opcodes.patterns[0].match = opcodePattern;

// Csound 7 keyword the base grammar does not list.
const keywords = grammar.repository.keywords.patterns[0];
keywords.match = keywords.match.replace('(?:instr|', '(?:instr|struct|');

// Csound 7 type annotations (cutoff:k, sig:a[]). The rate letter is a type
// here, not one of the a(), i(), k() converter opcodes.
grammar.repository.types = {
	patterns: [
		{
			name: 'support.type.rate.csound',
			match: '(?<=:)[aikSfwpb](?:\\[\\])?(?![A-Za-z0-9_])',
		},
	],
};

// The <Cabbage> section of a .csd file is JSON.
grammar.repository.cabbage = {
	patterns: [
		{
			begin: '(<Cabbage>)',
			end: '(</Cabbage>)',
			beginCaptures: { 1: { name: 'keyword.control.tag.csound' } },
			endCaptures: { 1: { name: 'keyword.control.tag.csound' } },
			patterns: jsonPatterns,
		},
	],
};

// Pattern order. The Cabbage 2 widget names (button, form, line, table...)
// are left out: Cabbage 3 widgets are JSON, and the names shadowed Csound
// opcodes such as line and table.
grammar.patterns = [
	'comments',
	'preprocessor',
	'cabbage',
	'tags',
	'strings',
	'numbers',
	'keywords',
	'constants',
	'types',
	'opcodes',
	'variables',
	'macros',
	'operators',
	'punctuation',
].map((name) => ({ include: `#${name}` }));

export default grammar;
