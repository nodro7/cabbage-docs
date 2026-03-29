// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import csoundGrammar from './src/syntax/csound-grammar.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://cabbageaudio.com',
	markdown: {
		shikiConfig: {
			langs: [csoundGrammar],
		},
	},
	integrations: [
		starlight({
			title: 'Cabbage',
			logo: {
				src: './public/img/cabbage_transparent.svg',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/rorywalsh/vscabbage' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: 'Introduction', slug: 'docs/intro' },
				{ label: 'Download and Install', slug: 'docs/download' },
				{ label: "What's New in v.3", slug: 'docs/cabbage3' },
				{ label: 'FAQs', slug: 'docs/faqs' },
				{
					label: 'Using Cabbage 3',
					items: [
						{ label: 'Overview', slug: 'docs/using_cabbage/overview' },
						{ label: 'Running Cabbage', slug: 'docs/using_cabbage/running_cabbage' },
						{ label: 'Working with Instruments', slug: 'docs/using_cabbage/working_with_instruments' },
						{ label: 'Exporting Instruments', slug: 'docs/using_cabbage/exporting_instruments' },
						{ label: 'Reserved Channels', slug: 'docs/using_cabbage/reserved_channels' },
						{ label: 'Working with Media Files', slug: 'docs/using_cabbage/media_files' },
						{ label: 'Multichannel Instruments', slug: 'docs/using_cabbage/multichannel' },
						{ label: 'Commands & Settings', slug: 'docs/using_cabbage/commands' },
						{ label: 'ARA Support', slug: 'docs/using_cabbage/ara_support' },
					],
				},
				{
					label: 'UI Layout & Configuration',
					items: [
						{ label: 'Overview', slug: 'docs/cabbage_widgets/intro' },
						{ label: 'Form', slug: 'docs/cabbage_widgets/form' },
						{ label: 'Button', slug: 'docs/cabbage_widgets/button' },
						{ label: 'Checkbox', slug: 'docs/cabbage_widgets/checkbox' },
						{ label: 'ComboBox', slug: 'docs/cabbage_widgets/combobox' },
						{ label: 'FileButton', slug: 'docs/cabbage_widgets/filebutton' },
						{ label: 'GenTable', slug: 'docs/cabbage_widgets/gentable' },
						{ label: 'GroupBox', slug: 'docs/cabbage_widgets/groupbox' },
						{ label: 'Image', slug: 'docs/cabbage_widgets/image' },
						{ label: 'Keyboard', slug: 'docs/cabbage_widgets/keyboard' },
						{ label: 'Label', slug: 'docs/cabbage_widgets/label' },
						{ label: 'OptionButton', slug: 'docs/cabbage_widgets/optionbutton' },
						{ label: 'Horizontal Slider', slug: 'docs/cabbage_widgets/horizontalslider' },
						{ label: 'Vertical Slider', slug: 'docs/cabbage_widgets/verticalslider' },
						{ label: 'Rotary Slider', slug: 'docs/cabbage_widgets/rotaryslider' },
						{ label: 'Number Slider', slug: 'docs/cabbage_widgets/numberslider' },
						{ label: 'XY Pad', slug: 'docs/cabbage_widgets/xypad' },
					],
				},
				{
					label: 'Custom Interfaces',
					items: [
						{ label: 'Custom Widgets', slug: 'docs/custom_interfaces/customwidgets' },
						{ label: 'Custom Interfaces', slug: 'docs/custom_interfaces/custominterfaces' },
						{ label: 'CabbageJS API', slug: 'docs/custom_interfaces/cabbagejs_api' },
					],
				},
				{
					label: 'Opcodes',
					items: [
						{ label: 'Overview', slug: 'docs/cabbage_opcodes/intro' },
						{ label: 'cabbageCreate', slug: 'docs/cabbage_opcodes/cabbagecreate' },
						{ label: 'cabbageCreateFileName', slug: 'docs/cabbage_opcodes/cabbagecreatefilename' },
						{ label: 'cabbageDump', slug: 'docs/cabbage_opcodes/cabbagedump' },
						{ label: 'cabbageGet', slug: 'docs/cabbage_opcodes/cabbageget' },
						{ label: 'cabbageGetFiles', slug: 'docs/cabbage_opcodes/cabbagegetfiles' },
						{ label: 'cabbageGetValue', slug: 'docs/cabbage_opcodes/cabbagegetvalue' },
						{ label: 'cabbageLoadState', slug: 'docs/cabbage_opcodes/cabbageloadstate' },
						{ label: 'cabbageSaveState', slug: 'docs/cabbage_opcodes/cabbagesavestate' },
						{ label: 'cabbageSendMessage', slug: 'docs/cabbage_opcodes/cabbagesendmessage' },
						{ label: 'cabbageSet', slug: 'docs/cabbage_opcodes/cabbageset' },
						{ label: 'cabbageSetValue', slug: 'docs/cabbage_opcodes/cabbagesetvalue' },
					],
				},
			],
		}),
	],
});
