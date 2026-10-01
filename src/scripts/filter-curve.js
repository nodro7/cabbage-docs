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
