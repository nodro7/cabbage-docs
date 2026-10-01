// Install page: let the visitor switch between operating systems.
//
// The page names the visitor's own system in <head>, before the first paint
// (data-os on <html>), and the styles show only that one. This script marks
// the matching button and handles the switch. Without it all three systems
// are listed, each under its own heading. Nothing is fetched here.

const control = document.querySelector('[data-os-control]');

if (control) {
	const root = document.documentElement;
	const buttons = [...control.querySelectorAll('[data-value]')];
	const hint = control.querySelector('[data-os-hint]');

	function select(os) {
		root.dataset.os = os;
		for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.value === os));
	}

	// Set in <head>. Missing on phones, tablets and anything unknown.
	const detected = root.dataset.os;
	if (detected) select(detected);
	else if (hint) hint.textContent = 'Choose your operating system.';

	for (const button of buttons) {
		button.addEventListener('click', () => {
			select(button.dataset.value);
			if (hint) hint.textContent = '';
		});
	}
}
