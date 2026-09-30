// Widget examples. The files in public/examples are the single source: the
// docs pages render them with <ExampleCode> and link to them for download
// with <WidgetExample>, so the page and the file are always the same text.
//
// TODO(G): pluginId sits at the top level of each example, as the widgets
// overview documents. If Rory decides it belongs in the form widget, run
// `node scripts/examples.mjs plugin-id form`.

const files = import.meta.glob<string>('/public/examples/*.csd', {
	query: '?raw',
	import: 'default',
	eager: true,
});

// Screenshots are optional. Only the file names are needed here.
const screenshots = import.meta.glob('/public/img/widgets/*.png');

export type Example = {
	/** The widget type, which is also the file name without its extension. */
	name: string;
	fileName: string;
	/** Site path of the downloadable file. */
	href: string;
	/** The full text of the .csd file. */
	code: string;
	/** Site path of a screenshot, when public/img/widgets/<name>.png exists. */
	screenshot?: string;
};

export function getExample(name: string): Example {
	const code = files[`/public/examples/${name}.csd`];
	if (code === undefined) {
		throw new Error(`No example file public/examples/${name}.csd (asked for by a docs page).`);
	}
	return {
		name,
		fileName: `${name}.csd`,
		href: `/examples/${name}.csd`,
		code,
		screenshot: `/public/img/widgets/${name}.png` in screenshots ? `/img/widgets/${name}.png` : undefined,
	};
}
