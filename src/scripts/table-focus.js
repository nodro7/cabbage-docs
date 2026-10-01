// Wide tables in the docs scroll sideways on a narrow screen. This gives a
// table that scrolls a focus stop, so it can be scrolled with the arrow
// keys, and takes the stop away again once the table fits.
//
// Chrome and Firefox do this on their own. Safari does not, and neither do
// the accessibility checkers.

const tables = document.querySelectorAll('.sl-markdown-content table');

function update() {
	for (const table of tables) {
		if (table.scrollWidth > table.clientWidth) table.setAttribute('tabindex', '0');
		else table.removeAttribute('tabindex');
	}
}

if (tables.length) {
	update();
	window.addEventListener('resize', update);
}
