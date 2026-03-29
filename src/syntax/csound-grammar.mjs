import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const opcodes = JSON.parse(
	readFileSync(resolve(__dirname, 'csound-opcodes.json'), 'utf-8')
);

const opcodePattern = `\\b(?:${opcodes
	.filter(Boolean)
	.map((w) => w.trim())
	.filter(Boolean)
	.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
	.sort((a, b) => b.length - a.length)
	.join('|')})\\b`;

const grammar = JSON.parse(
	readFileSync(resolve(__dirname, 'csound.tmLanguage.json'), 'utf-8')
);

// Inject the opcode pattern directly on the parsed object to avoid JSON escape issues
grammar.repository.opcodes.patterns[0].match = opcodePattern;

export default grammar;
