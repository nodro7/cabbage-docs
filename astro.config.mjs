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
										{ label: "Introduction", slug: 'docs/intro' },
										{ label: "Download and Install", slug: 'docs/download' },
										{ label: "What's New in v.3", slug: 'docs/cabbage3' },
										{ label: "FAQs", slug: 'docs/faqs' },
										{
											label: "Using Cabbage 3",
											items: [
												{ label: "Overview", slug: 'docs/using_cabbage/overview' },
												{ label: "ARA Support", slug: 'docs/using_cabbage/ara_support' },
												{ label: "Audio Channel Configuration", slug: 'docs/using_cabbage/channels' },
												{ label: "Commands & Settings", slug: 'docs/using_cabbage/commands' },
												{ label: "Csound 7", slug: 'docs/using_cabbage/csound7' },
												{ label: "Exporting Instruments", slug: 'docs/using_cabbage/exporting_instruments' },
												{ label: "Working with Media Files", slug: 'docs/using_cabbage/media_files' },
												{ label: "Working with Multichannel Instruments", slug: 'docs/using_cabbage/multichannel' },
												{ label: "Reserved Csound Channels", slug: 'docs/using_cabbage/reserved_channels' },
												{ label: "Running Cabbage", slug: 'docs/using_cabbage/running_cabbage' },
												{ label: "Saving and Loading State", slug: 'docs/using_cabbage/saving_and_loading_state' },
												{ label: "Working with Instruments", slug: 'docs/using_cabbage/working_with_instruments' },
											],
										},
										{
											label: "UI Layout & Configuration",
											items: [
												{ label: "Overview", slug: 'docs/cabbage_widgets/intro' },
												{ label: "Button", slug: 'docs/cabbage_widgets/button' },
												{ label: "CheckBox", slug: 'docs/cabbage_widgets/checkbox' },
												{ label: "ComboBox", slug: 'docs/cabbage_widgets/combobox' },
												{ label: "File Button", slug: 'docs/cabbage_widgets/filebutton' },
												{ label: "Form", slug: 'docs/cabbage_widgets/form' },
												{ label: "GenTable", slug: 'docs/cabbage_widgets/gentable' },
												{ label: "Groupbox", slug: 'docs/cabbage_widgets/groupbox' },
												{ label: "HorizontalSlider", slug: 'docs/cabbage_widgets/horizontalslider' },
												{ label: "Image", slug: 'docs/cabbage_widgets/image' },
												{ label: "Keyboard", slug: 'docs/cabbage_widgets/keyboard' },
												{ label: "Label", slug: 'docs/cabbage_widgets/label' },
												{ label: "NumberSlider", slug: 'docs/cabbage_widgets/numberslider' },
												{ label: "OptionButton", slug: 'docs/cabbage_widgets/optionbutton' },
												{ label: "RotarySlider", slug: 'docs/cabbage_widgets/rotaryslider' },
												{ label: "VerticalSlider", slug: 'docs/cabbage_widgets/verticalslider' },
												{ label: "XY Pad", slug: 'docs/cabbage_widgets/xypad' },
											],
										},
										{
											label: "Custom Interfaces",
											items: [
												{ label: "Cabbage JS API", slug: 'docs/custom_interfaces/cabbagejs_api' },
												{ label: "Custom Interfaces", slug: 'docs/custom_interfaces/custominterfaces' },
												{ label: "Custom Widgets", slug: 'docs/custom_interfaces/customwidgets' },
												{ label: "Persisting Custom UI State", slug: 'docs/custom_interfaces/persisting_ui_state' },
											],
										},
										{
											label: "Opcodes",
											items: [
												{ label: "Introduction", slug: 'docs/cabbage_opcodes/intro' },
												{ label: "cabbageAraDump", slug: 'docs/cabbage_opcodes/cabbagearadump' },
												{ label: "cabbageAraGet", slug: 'docs/cabbage_opcodes/cabbagearaget' },
												{ label: "cabbageAraGetSourceSamples", slug: 'docs/cabbage_opcodes/cabbagearagetsourcesamples' },
												{ label: "cabbageAraGetStateJson", slug: 'docs/cabbage_opcodes/cabbagearagetstatejson' },
												{ label: "cabbageAraGetUpdate", slug: 'docs/cabbage_opcodes/cabbagearagetupdate' },
												{ label: "cabbageCreate", slug: 'docs/cabbage_opcodes/cabbagecreate' },
												{ label: "cabbageCreateFileName", slug: 'docs/cabbage_opcodes/cabbagecreatefilename' },
												{ label: "cabbageDump", slug: 'docs/cabbage_opcodes/cabbagedump' },
												{ label: "cabbageGet", slug: 'docs/cabbage_opcodes/cabbageget' },
												{ label: "cabbageGetFiles", slug: 'docs/cabbage_opcodes/cabbagegetfiles' },
												{ label: "cabbageGetValue", slug: 'docs/cabbage_opcodes/cabbagegetvalue' },
												{ label: "cabbageGetWidgets", slug: 'docs/cabbage_opcodes/cabbagegetwidgets' },
												{ label: "cabbageHasKey", slug: 'docs/cabbage_opcodes/cabbagehaskey' },
												{ label: "cabbageJsonGet", slug: 'docs/cabbage_opcodes/cabbagejsonget' },
												{ label: "cabbageJsonHas", slug: 'docs/cabbage_opcodes/cabbagejsonhas' },
												{ label: "cabbageJsonLen", slug: 'docs/cabbage_opcodes/cabbagejsonlen' },
												{ label: "cabbageJsonSet", slug: 'docs/cabbage_opcodes/cabbagejsonset' },
												{ label: "cabbageJsonType", slug: 'docs/cabbage_opcodes/cabbagejsontype' },
												{ label: "cabbageLoadState", slug: 'docs/cabbage_opcodes/cabbageloadstate' },
												{ label: "cabbageSaveState", slug: 'docs/cabbage_opcodes/cabbagesavestate' },
												{ label: "cabbageSendMessage", slug: 'docs/cabbage_opcodes/cabbagesendmessage' },
												{ label: "cabbageSet", slug: 'docs/cabbage_opcodes/cabbageset' },
												{ label: "cabbageSetValue", slug: 'docs/cabbage_opcodes/cabbagesetvalue' },
											],
										},
									],
		}),
	],
});
