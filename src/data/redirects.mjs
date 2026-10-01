// Old URL to new URL. Astro writes a small redirect page for each entry,
// because GitHub Pages has no server-side redirects. The link checker
// (scripts/check-links.mjs) reads this list too.
//
// To move a page: rename the file, then add its old path here.

/** Docs folders that were renamed, with the pages whose file names changed. */
const movedSections = {
	using_cabbage: {
		to: 'using',
		pages: {
			ara_support: 'ara-support',
			channels: 'audio-channels',
			commands: 'commands',
			csound7: 'csound7',
			exporting_instruments: 'exporting',
			media_files: 'media-files',
			multichannel: 'multichannel',
			overview: 'overview',
			reserved_channels: 'reserved-channels',
			running_cabbage: 'running-cabbage',
			saving_and_loading_state: 'saving-and-loading-state',
			working_with_instruments: 'working-with-instruments',
		},
	},
	cabbage_widgets: {
		to: 'widgets',
		pages: {
			intro: 'overview',
			button: 'button',
			checkbox: 'checkbox',
			combobox: 'combobox',
			filebutton: 'file-button',
			form: 'form',
			gentable: 'gentable',
			groupbox: 'groupbox',
			horizontalslider: 'horizontal-slider',
			image: 'image',
			keyboard: 'keyboard',
			label: 'label',
			numberslider: 'number-slider',
			optionbutton: 'option-button',
			rotaryslider: 'rotary-slider',
			verticalslider: 'vertical-slider',
			xypad: 'xy-pad',
		},
	},
	custom_interfaces: {
		to: 'custom-ui',
		pages: {
			cabbagejs_api: 'js-api',
			custominterfaces: 'custom-interfaces',
			customwidgets: 'custom-widgets',
			persisting_ui_state: 'persisting-ui-state',
		},
	},
	cabbage_opcodes: {
		to: 'opcodes',
		pages: {
			intro: 'overview',
			cabbagearadump: 'cabbagearadump',
			cabbagearaget: 'cabbagearaget',
			cabbagearagetsourcesamples: 'cabbagearagetsourcesamples',
			cabbagearagetstatejson: 'cabbagearagetstatejson',
			cabbagearagetupdate: 'cabbagearagetupdate',
			cabbagecreate: 'cabbagecreate',
			cabbagecreatefilename: 'cabbagecreatefilename',
			cabbagedump: 'cabbagedump',
			cabbageget: 'cabbageget',
			cabbagegetfiles: 'cabbagegetfiles',
			cabbagegetvalue: 'cabbagegetvalue',
			cabbagegetwidgets: 'cabbagegetwidgets',
			cabbagehaskey: 'cabbagehaskey',
			cabbagejsonget: 'cabbagejsonget',
			cabbagejsonhas: 'cabbagejsonhas',
			cabbagejsonlen: 'cabbagejsonlen',
			cabbagejsonset: 'cabbagejsonset',
			cabbagejsontype: 'cabbagejsontype',
			cabbageloadstate: 'cabbageloadstate',
			cabbagesavestate: 'cabbagesavestate',
			cabbagesendmessage: 'cabbagesendmessage',
			cabbageset: 'cabbageset',
			cabbagesetvalue: 'cabbagesetvalue',
		},
	},
};

/** Single pages, old path to new path. */
const movedPages = {
	'/download': '/install/',
	'/docs/download': '/install/',
	'/faq': '/docs/faqs/',
	'/docs/introduction': '/docs/',
	'/docs/intro': '/docs/',
	'/docs/cabbage3': '/docs/whats-new/',
};

/** @type {Record<string, string>} */
export const redirects = { ...movedPages };

for (const [from, { to, pages }] of Object.entries(movedSections)) {
	for (const [oldName, newName] of Object.entries(pages)) {
		redirects[`/docs/${from}/${oldName}`] = `/docs/${to}/${newName}/`;
	}
}
