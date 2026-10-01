// Everything the Install page says that is not release data.

import type { Os } from '../lib/release';

export const install = {
	csoundReleasesUrl: 'https://github.com/csound/csound/releases',
	languageExtensionUrl: 'https://marketplace.visualstudio.com/items?itemName=kunstmusik.csound-vscode-plugin',

	/**
	 * The Cabbage extension will move to the VS Code Marketplace after launch.
	 * Set this to its Marketplace URL then: step 2 becomes one "Install from
	 * the Marketplace" button and the VSIX instructions move into a disclosure.
	 */
	marketplaceUrl: '',

	// TODO(G): are the Csound 7 and extension installers signed at launch?
	// Set this to true to remove the unsigned-installer notes for macOS and Windows.
	installersSigned: false,

	// TODO(G): the exact label of the status bar item that starts the server.
	// The docs call it "Run Cabbage".
	statusBarLabel: 'Run Cabbage',
};

export type System = {
	id: Os;
	label: string;
	/** The VS Code command palette shortcut on this system. */
	paletteKey: string;
	/** Shown under "Get Csound 7". */
	csoundNote?: string;
	/** An unsigned-installer note: left out when installersSigned is true. */
	noteIsAboutSigning?: boolean;
	/** A command to run in a terminal, shown with the note. */
	command?: { intro: string; text: string };
};

export const systems: System[] = [
	{
		id: 'macos',
		label: 'macOS',
		paletteKey: 'Cmd+Shift+P',
		csoundNote:
			'The Csound installer is not code-signed yet. If macOS blocks it, open System Settings, go to Privacy & Security, scroll to the bottom and choose Open Anyway.',
		noteIsAboutSigning: true,
		command: {
			intro: 'You may also need to sign the Csound framework yourself. Run this in Terminal:',
			text: 'codesign -s - /Applications/Csound/CsoundLib64.framework --timestamp --force --deep',
		},
	},
	{
		id: 'windows',
		label: 'Windows',
		paletteKey: 'Ctrl+Shift+P',
		csoundNote:
			'The Csound installer is not code-signed yet. When Windows warns that the app may be unsafe, choose More info, then Run anyway.',
		noteIsAboutSigning: true,
	},
	{
		id: 'linux',
		label: 'Linux',
		paletteKey: 'Ctrl+Shift+P',
		// TODO(G): Linux install notes.
		csoundNote: '[LINUX INSTALL NOTES, TO CONFIRM]',
	},
];
