// "Copy example" buttons on the widget pages. Each button names the example
// file in data-copy-example; the text is fetched from that file, so what is
// copied is exactly what "Download .csd" gives you.
//
// The buttons are hidden until this script runs, because they cannot work
// without JavaScript. The download link beside each one always works.

const cache = new Map();

function load(url) {
	if (!cache.has(url)) {
		cache.set(
			url,
			fetch(url).then((response) => {
				if (!response.ok) throw new Error(`${response.status} for ${url}`);
				return response.text();
			})
		);
	}
	return cache.get(url);
}

async function copy(url) {
	const text = load(url);

	// Safari only allows a clipboard write that starts inside the click, so
	// hand it a promise for the text instead of waiting for the fetch first.
	if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
		try {
			const blob = text.then((value) => new Blob([value], { type: 'text/plain' }));
			await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
			return;
		} catch {
			// Try the next way.
		}
	}

	const value = await text;
	try {
		await navigator.clipboard.writeText(value);
		return;
	} catch {
		// Try the next way.
	}

	// Last resort, for contexts where the Clipboard API is not allowed.
	const area = document.createElement('textarea');
	area.value = value;
	area.setAttribute('readonly', '');
	area.style.position = 'fixed';
	area.style.opacity = '0';
	document.body.append(area);
	area.select();
	const copied = document.execCommand('copy');
	area.remove();
	if (!copied) throw new Error('copy failed');
}

for (const button of document.querySelectorAll('[data-copy-example]')) {
	const url = button.getAttribute('data-copy-example');
	const label = button.textContent;
	const status = button.closest('.cb-example')?.querySelector('[data-copy-status]');
	let reset;

	button.hidden = false;
	// Start the download early, so the text is usually ready by the click.
	button.addEventListener('pointerenter', () => load(url).catch(() => {}), { once: true });
	button.addEventListener('focus', () => load(url).catch(() => {}), { once: true });

	button.addEventListener('click', async () => {
		let message = 'Copied';
		try {
			await copy(url);
		} catch {
			message = 'Could not copy';
			cache.delete(url);
		}
		button.textContent = message;
		if (status) status.textContent = message === 'Copied' ? 'Example copied to the clipboard.' : 'The example could not be copied.';
		clearTimeout(reset);
		reset = setTimeout(() => {
			button.textContent = label;
			if (status) status.textContent = '';
		}, 2000);
	});
}
