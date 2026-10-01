// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import { favicon, iconLinks } from './src/data/icons.mjs';
import { redirects } from './src/data/redirects.mjs';
import calloutRole from './src/lib/callout-role.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://cabbageaudio.com',
	// Old URLs keep working: Astro writes a small redirect page for each entry.
	redirects,
	// Spaces between inline elements are kept as written in the components.
	// Astro 7's default strips them the way JSX does, which glues a word to
	// the link or code element on the next line.
	compressHTML: true,
	markdown: {
		// Sätteri is Astro's Markdown processor. Starlight adds its own plugins
		// (callouts, heading links) to whatever is configured here.
		processor: satteri({ hastPlugins: [calloutRole()] }),
	},
	vite: {
		build: {
			rolldownOptions: {
				// Astro marks each .mdx page with a "use astro:head-inject" directive
				// for its own use, and the bundler then warns, once per page, that it
				// drops it. Nothing needs the directive to survive, so that check is
				// off and real warnings stay visible.
				checks: { moduleLevelDirective: false },
			},
		},
	},
	integrations: [
		starlight({
			title: 'Cabbage',
			description: 'A framework for audio software development.',
			// src/pages/404.astro is the page for every unknown address, docs included.
			disable404Route: true,
			favicon,
			head: [
				...iconLinks.map((attrs) => ({ tag: /** @type {const} */ ('link'), attrs })),
				// The social image for docs pages. A page can set its own in frontmatter.
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://cabbageaudio.com/og/default.png' } },
			],
			plugins: [
				// /llms.txt, /llms-full.txt and /llms-small.txt: the docs in a form that
				// AI assistants can read. Most of them know Cabbage 2 syntax and get
				// Cabbage 3 JSON wrong; this gives them a current source.
				starlightLlmsTxt({
					projectName: 'Cabbage 3',
					description:
						'Cabbage 3 is a framework for audio software development. Instruments are written in Csound 7, interfaces are described in JSON or built with HTML, CSS and JavaScript, and plugins are exported as VST3, CLAP or AU from VS Code.',
					details: [
						'Important notes:',
						'',
						'- These docs describe Cabbage 3. Its syntax is different from Cabbage 2: widgets are JSON objects inside a `<Cabbage>` section, and all names are camelCase. Cabbage 2 names such as `rslider` and `combobox` are now `rotarySlider` and `comboBox`.',
						'- Cabbage 3 requires Csound 7 and is used through a VS Code extension, not a standalone IDE.',
						'- The widgets that ship with Cabbage are for prototyping. Custom interfaces are built with web technologies and the Cabbage JS API.',
					].join('\n'),
				}),
			],
			// The docs share the site header, footer and tokens through these overrides.
			components: {
				Head: './src/components/starlight/Head.astro',
				Header: './src/components/starlight/Header.astro',
				PageTitle: './src/components/starlight/PageTitle.astro',
				Footer: './src/components/starlight/Footer.astro',
				MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
			},
			// Code block options (themes, grammar, line numbers) live in ec.config.mjs.
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
				{ label: 'What is new in v3', slug: 'docs/whats-new' },
				{ label: 'FAQs', slug: 'docs/faqs' },
				{ label: 'Using Cabbage 3', collapsed: true, items: [{ autogenerate: { directory: 'docs/using' } }] },
				{ label: 'Widgets', collapsed: true, items: [{ autogenerate: { directory: 'docs/widgets' } }] },
				{ label: 'Custom interfaces', collapsed: true, items: [{ autogenerate: { directory: 'docs/custom-ui' } }] },
				{ label: 'Opcodes', collapsed: true, items: [{ autogenerate: { directory: 'docs/opcodes' } }] },
			],
		}),
	],
});
