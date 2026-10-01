// Gives every callout in the docs (:::note, :::tip, :::caution, :::danger)
// the role "note".
//
// Starlight writes a callout as <aside aria-label="Note">. An aside with a
// name is a page landmark, so two notes on one page become two landmarks
// called "Note", which screen reader users cannot tell apart. A callout is
// a remark inside the text, not a region of the page, and "note" says that.
// Authors can go on writing plain :::note blocks.
//
// This is a plugin for Sätteri, Astro's Markdown processor. It runs on the
// HTML tree, after Starlight has turned each :::note into an <aside>.

/** The class names of an element, however the tree stores them. */
function classesOf(node) {
	const value = node.properties?.className ?? node.properties?.class ?? '';
	return Array.isArray(value) ? value : String(value).split(/\s+/);
}

export default function calloutRole() {
	return {
		name: 'cabbage-callout-role',
		element: {
			filter: ['aside'],
			visit(node, ctx) {
				if (classesOf(node).includes('starlight-aside')) ctx.setProperty(node, 'role', 'note');
			},
		},
	};
}
