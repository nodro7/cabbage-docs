// The maths behind the Home page editor demo: a resonant low-pass filter's
// response, and how its two parameters read. Used by the page when it is
// built (for the first paint) and by the demo script in the browser.
//
// Both parameters are positions from 0 to 1, as a knob has.

/** Cutoff frequency in Hz: 20 Hz to 20 kHz on a logarithmic scale. */
export const cutoffHz = (cutoff) => 20 * Math.pow(1000, cutoff);

/** Filter Q, from 0.7 to 9.7. */
export const filterQ = (resonance) => 0.7 + resonance * 9;

/** "1.3 kHz" or "640 Hz" */
export function cutoffText(cutoff) {
	const hz = cutoffHz(cutoff);
	return hz < 1000 ? `${Math.round(hz)} Hz` : `${(hz / 1000).toFixed(1)} kHz`;
}

/** "0.50" */
export const resonanceText = (resonance) => resonance.toFixed(2);

/** "Q 5.2" */
export const qText = (resonance) => `Q ${filterQ(resonance).toFixed(1)}`;

/** Knob rotation: 270 degrees of travel, centred on straight up. */
export const knobDegrees = (value) => Math.round(-135 + value * 270);

/** The built-in widgets show plain numbers: "1262" for the cutoff in Hz. */
export const cutoffNumber = (cutoff) => String(Math.round(cutoffHz(cutoff)));

/** "0.500" */
export const resonanceNumber = (resonance) => resonance.toFixed(3);

/**
 * The arc of a built-in rotary slider as an SVG path, for a 64 x 64 viewBox.
 * It is centred, has a radius of 28 and covers 270 degrees, open at the
 * bottom. It starts at the bottom left and runs clockwise for the given
 * share of that sweep: 1 is the whole track, 0 is no arc at all.
 */
export function builtInArcPath(value) {
	if (value <= 0) return '';
	const point = (degrees) => {
		const angle = (degrees * Math.PI) / 180;
		return `${(32 + 28 * Math.cos(angle)).toFixed(2)} ${(32 + 28 * Math.sin(angle)).toFixed(2)}`;
	};
	const sweep = Math.min(1, value) * 270;
	return `M${point(135)} A28 28 0 ${sweep > 180 ? 1 : 0} 1 ${point(135 + sweep)}`;
}

/**
 * The response curve as an SVG path, for a 400 x 130 viewBox: 81 points
 * across the frequency range, with the level clamped to -40 dB and +24 dB.
 */
export function curvePath(cutoff, resonance) {
	const fc = cutoffHz(cutoff);
	const q = filterQ(resonance);
	let d = '';
	for (let i = 0; i <= 80; i++) {
		const f = 20 * Math.pow(1000, i / 80);
		const w = f / fc;
		const magnitude = 1 / Math.sqrt(Math.pow(1 - w * w, 2) + Math.pow(w / q, 2));
		const db = Math.max(-40, Math.min(24, 20 * Math.log10(magnitude)));
		const y = Math.min(130, 58 - db * 1.8);
		d += `${i ? ' L' : 'M'}${i * 5} ${y.toFixed(1)}`;
	}
	return d;
}

/** The same curve closed along the bottom edge, for the fill under it. */
export const curveFillPath = (line) => `${line} L400 130 L0 130 Z`;
