// Learn page: a click on a video card swaps it for the YouTube player.
//
// Nothing is requested from YouTube until that click, and the player comes
// from youtube-nocookie.com. Without this script each card is an ordinary
// link to the video on YouTube.

document.addEventListener('click', (event) => {
	// Leave new-tab and other modified clicks to the browser.
	if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
	if (!(event.target instanceof Element)) return;
	const link = event.target.closest('a[data-video-id]');
	if (!link) return;
	event.preventDefault();

	const player = document.createElement('iframe');
	player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.videoId)}?autoplay=1&rel=0`;
	player.title = link.dataset.videoTitle ?? 'Video';
	player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
	player.allowFullscreen = true;

	// A player cannot sit inside a link, so the card becomes a plain block:
	// the player, then the title as a link to the video on YouTube.
	const card = document.createElement('div');
	card.className = link.className;
	const frame = document.createElement('div');
	frame.className = 'cb-video__frame';
	frame.append(player);
	card.append(frame);

	const title = link.querySelector('.cb-video__title');
	if (title) {
		const titleLink = document.createElement('a');
		titleLink.className = 'cb-video__title';
		titleLink.href = link.href;
		titleLink.textContent = title.textContent;
		card.append(titleLink);
	}

	link.replaceWith(card);
	player.focus();
});
