// The commands shown in the palette section of the Home page.
//
// Titles match contributes.commands in the vscabbage package.json. Every
// Cabbage command has the category "Cabbage", so the palette shows
// "Cabbage: <title>".

export type Command = {
	title: string;
	/**
	 * Default keyboard shortcut, shown at the end of the row when set.
	 * TODO(G): the docs give Ctrl+S for Compile and Ctrl+E for Edit Mode, but
	 * the extension manifest declares no keybindings. Left empty until
	 * confirmed, with the macOS equivalents.
	 */
	key: string;
	description: string;
	link: { label: string; href: string };
};

export const commands: Command[] = [
	{
		title: 'Compile Cabbage Instrument',
		key: '',
		description:
			'Saves the .csd and opens the instrument in a panel beside your code. While the Cabbage server is running, every save rebuilds the interface.',
		link: { label: 'Working with instruments', href: '/docs/using/working-with-instruments/' },
	},
	{
		title: 'Edit Mode',
		key: '',
		description:
			'Right-click to add widgets, drag them into place and change their properties in a panel. The JSON in your file is rewritten as you go.',
		link: { label: 'Working with instruments', href: '/docs/using/working-with-instruments/' },
	},
	{
		title: 'Create Vanilla VST3 Synth Project (Custom UI)',
		key: '',
		description:
			'Scaffolds a complete plugin with a plain HTML, CSS and JavaScript front end, already wired to the Cabbage JS API. Bring Svelte, React or Vue when you are ready.',
		link: { label: 'Custom interfaces', href: '/docs/custom-ui/custom-interfaces/' },
	},
	{
		title: 'Export as CLAP Effect',
		key: '',
		description:
			'Exports the instrument as a plugin. Effects and synths build as VST3 or CLAP, and as AUv2 on macOS, where MIDI effects are supported too.',
		link: { label: 'Exporting instruments', href: '/docs/using/exporting/' },
	},
	{
		title: 'Export as VST3 Effect (ARA)',
		key: '',
		description:
			'Builds an ARA plugin, which gives Csound direct access to the audio on the DAW timeline instead of waiting for it in real time.',
		link: { label: 'ARA support', href: '/docs/using/ara-support/' },
	},
	{
		title: 'Start Recording to WAV',
		key: '',
		description: 'Records the instrument output to a WAV file while you play, in 16-bit or 32-bit float.',
		link: { label: 'Commands and settings', href: '/docs/using/commands/' },
	},
	{
		title: 'Make for Daisy',
		key: '',
		description: 'Compiles the current .csd for the Electrosmith Daisy hardware platform.',
		link: { label: 'Commands and settings', href: '/docs/using/commands/' },
	},
	{
		title: 'Update old-style Cabbage code to JSON',
		key: '',
		description: 'Converts Cabbage 2 widget code to the JSON format that Cabbage 3 uses.',
		link: { label: 'What is new in Cabbage 3', href: '/docs/whats-new/' },
	},
];

/** The command that is selected when the page loads. */
export const defaultCommand = 3;
