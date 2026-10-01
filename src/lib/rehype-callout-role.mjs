// Gives every callout in the docs (:::note, :::tip, :::caution, :::danger)
// the role "note".
//
// Starlight writes a callout as <aside aria-label="Note">. An aside with a
// name is a page landmark, so two notes on one page become two landmarks
// called "Note", which screen reader users cannot tell apart. A callout is
// a remark inside the text, not a region of the page, and "note" says that.
// Authors can go on writing plain :::note blocks.

export default function rehypeCalloutRole() {
	const visit = (node) => {
		if (node.type === 'element' && node.tagName === 'aside') {
			const classes = node.properties?.className;
			if (Array.isArray(classes) && classes.includes('starlight-aside')) node.properties.role = 'note';
		}
		node.children?.forEach(visit);
	};
	return (tree) => visit(tree);
}
