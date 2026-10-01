// The command palette on the Home page: pick a command on the left, read
// what it does on the right. Without this script the page lists all the
// commands instead.

const palette = document.querySelector('[data-palette]');

if (palette) {
	const buttons = [...palette.querySelectorAll('[data-command]')];
	const title = palette.querySelector('[data-command-title]');
	const description = palette.querySelector('[data-command-description]');
	const link = palette.querySelector('[data-command-link]');

	for (const button of buttons) {
		button.addEventListener('click', () => {
			for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
			title.textContent = button.dataset.title;
			description.textContent = button.dataset.description;
			link.textContent = button.dataset.linkLabel;
			link.href = button.dataset.linkHref;
		});
	}
}
