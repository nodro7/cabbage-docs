// Layouts for the title cards and the social images.
//
// A card is three layers, put together by scripts/title-cards.mjs:
//   1. a background: the dark ground and the green filter curve
//   2. the Cabbage mark
//   3. the text, laid out by satori from the trees below
//
// The numbers come from the approved title card design, which is 1920 x 1080.

const INK = '#f2f2f2';
const GROUND = '#181818';
const GREEN = '#93d200';
const GREEN_TEXT = '#a5e02b';
const MUTED = '#ababab';

// The filter response curve that runs along the bottom of every card.
// It starts well to the left of the card so it can be shifted right.
const CURVE = 'M-800 880 H1040 C1180 880 1290 860 1350 740 C1385 670 1425 670 1460 760 C1530 940 1620 1040 1760 1080';

/** Font family names. title-cards.mjs registers one static font under each. */
export const FONTS = {
	display: 'Cabbage Display', // Instrument Sans, width 80, weight 600
	brand: 'Cabbage Brand', // Instrument Sans, width 85, weight 700
	text: 'Cabbage Text', // Instrument Sans, width 100, weight 400
	mono: 'Cabbage Mono', // JetBrains Mono, weight 400
};

const div = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

/** The background layer as an SVG string. */
function background({ width, height, scale = 1, shiftX = 0, shiftY = 0 }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="${GROUND}"/>
<g transform="translate(${shiftX} ${shiftY}) scale(${scale})">
<path d="${CURVE} L-800 1080 Z" fill="${GREEN}" fill-opacity="0.09"/>
<path d="${CURVE}" fill="none" stroke="${GREEN}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;
}

/** The text layer: wordmark, label, title and site address. */
function textLayer({ width, height, padding, logo, wordmark, label, title, address }) {
	return div(
		{
			position: 'relative',
			flexDirection: 'column',
			justifyContent: 'space-between',
			width,
			height,
			padding: `${padding.top}px ${padding.x}px ${padding.bottom}px`,
			color: INK,
		},
		[
			// The mark sits to the left of the wordmark; it is a separate layer.
			div({ alignItems: 'center', height: logo.height }, [
				div(
					{ marginLeft: logo.width + wordmark.gap, fontFamily: FONTS.brand, fontSize: wordmark.size, lineHeight: 1, fontWeight: 700 },
					'Cabbage 3'
				),
			]),
			div({ flexDirection: 'column', maxWidth: title.maxWidth, marginBottom: title.marginBottom }, [
				...(label.text
					? [div({ marginBottom: label.gap, fontFamily: FONTS.mono, fontSize: label.size, lineHeight: 1, color: GREEN_TEXT }, label.text)]
					: []),
				...[title.text].flat().map((line) =>
					div(
						{
							fontFamily: FONTS.display,
							fontSize: title.size,
							lineHeight: title.lineHeight ?? 1,
							fontWeight: 600,
							letterSpacing: -0.015 * title.size,
							// Break long titles into lines of similar length.
							textWrap: 'balance',
						},
						// Keep "VS Code" on one line.
						line.replaceAll('VS Code', 'VS\u00a0Code')
					)
				),
			]),
			div(
				{ position: 'absolute', left: padding.x, bottom: address.bottom, fontFamily: FONTS.text, fontSize: address.size, lineHeight: 1, color: MUTED },
				'cabbageaudio.com'
			),
		]
	);
}

/**
 * A 1920 x 1080 title card: the opening frame of a video, its YouTube
 * thumbnail and its thumbnail on the site. The bottom right corner stays
 * free of text, because YouTube draws the duration there.
 */
export function titleCard({ label, title }) {
	const width = 1920;
	const height = 1080;
	const logo = { left: 120, top: 104, width: 104, height: 97 };
	return {
		width,
		height,
		logo,
		background: background({ width, height }),
		text: textLayer({
			width,
			height,
			padding: { top: 104, x: 120, bottom: 96 },
			logo,
			wordmark: { size: 54, gap: 28 },
			label: { text: label, size: 46, gap: 20 },
			// The design allows 1300px. 1140px keeps every line clear of the
			// point where the curve starts to rise.
			title: { text: title, size: 156, maxWidth: 1140, marginBottom: 150 },
			address: { size: 34, bottom: 72 },
		}),
	};
}

/**
 * A 1200 x 630 social image, in the same style. `title` is a string, or an
 * array of lines. The curve is moved right so its peak clears the title.
 */
export function socialCard({ label, title, titleSize = 104 }) {
	const width = 1200;
	const height = 630;
	const logo = { left: 72, top: 60, width: 64, height: 60 };
	return {
		width,
		height,
		logo,
		background: background({ width, height, scale: 0.625, shiftX: 260, shiftY: -45 }),
		text: textLayer({
			width,
			height,
			padding: { top: 60, x: 72, bottom: 56 },
			logo,
			wordmark: { size: 34, gap: 18 },
			label: { text: label, size: 28, gap: 14 },
			title: { text: title, size: titleSize, lineHeight: 1.02, maxWidth: 1000, marginBottom: 84 },
			address: { size: 22, bottom: 44 },
		}),
	};
}
