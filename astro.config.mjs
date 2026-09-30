// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import csoundGrammar from './src/syntax/csound-grammar.mjs';
import { redirects } from './src/data/redirects.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://cabbageaudio.com',
	// Old URLs keep working: Astro writes a small redirect page for each entry.
	redirects,
	markdown: {
		shikiConfig: {
			langs: [csoundGrammar],
		},
	},
	integrations: [
		starlight({
			title: 'Cabbage',
			description: 'A framework for audio software development.',
			// The docs share the site header, footer and tokens through these overrides.
			components: {
				Head: './src/components/starlight/Head.astro',
				Header: './src/components/starlight/Header.astro',
				Footer: './src/components/starlight/Footer.astro',
				MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
			},
			customCss: [
				'@fontsource-variable/instrument-sans/wdth.css',
				'@fontsource-variable/jetbrains-mono/index.css',
				'./src/styles/tokens.css',
				'./src/styles/components.css',
				'./src/styles/starlight.css',
			],
			// Adding a doc page is a one-file change: each group lists its folder.
			// Order within a group is alphabetical by file name unless a page sets
			// sidebar.order in its frontmatter.
			sidebar: [
				{ label: 'Introduction', slug: 'docs' },
				{ label: 'Download and Install', slug: 'docs/download' },
				{ label: 'What is new in v3', slug: 'docs/whats-new' },
				{ label: 'FAQs', slug: 'docs/faqs' },
				{ label: 'Using Cabbage 3', collapsed: true, autogenerate: { directory: 'docs/using' } },
				{ label: 'Widgets', collapsed: true, autogenerate: { directory: 'docs/widgets' } },
				{ label: 'Custom interfaces', collapsed: true, autogenerate: { directory: 'docs/custom-ui' } },
				{ label: 'Opcodes', collapsed: true, autogenerate: { directory: 'docs/opcodes' } },
			],
		}),
	],
});
