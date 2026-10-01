// Install page: show the steps for one operating system and let the visitor
// switch. Without this script all three systems are listed, each under its
// own heading. Nothing is fetched here.

const page = document.querySelector('[data-install]');
const control = document.querySelector('[data-os-control]');

if (page && control) {
	const sections = [...page.querySelectorAll('[data-os]')];
	const buttons = [...control.querySelectorAll('[data-value]')];
	const hint = control.querySelector('[data-os-hint]');

	// The visitor's system, or null on phones, tablets and anything unknown.
	function detect() {
		const platform = navigator.userAgentData?.platform ?? '';
		const agent = navigator.userAgent ?? '';
		const text = `${platform} ${agent}`;
		if (/Android|iPhone|iPad|iPod|CrOS|Chrome OS/i.test(text)) return null;
		if (/Win/i.test(text)) return 'windows';
		if (/Mac/i.test(text)) return 'macos';
		if (/Linux|X11/i.test(text)) return 'linux';
		return null;
	}

	function select(os) {
		for (const section of sections) section.hidden = section.dataset.os !== os;
		for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.value === os));
		page.dataset.selected = os;
	}

	control.hidden = false;
	const detected = detect();
	if (detected) select(detected);
	else if (hint) hint.textContent = 'Choose your operating system.';

	for (const button of buttons) {
		button.addEventListener('click', () => {
			select(button.dataset.value);
			if (hint) hint.textContent = '';
		});
	}
}
