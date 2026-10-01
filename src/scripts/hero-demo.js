// The editor demo on the Home page: one instrument, four interfaces.
//
// One state object holds the two parameters. Both knobs, both readouts and
// the response curve read from it, whichever interface is showing. There is
// no audio and nothing moves until the visitor acts.
//
// Without this script the page shows the Ink interface and main.js, and the
// switch is hidden.

import { curveFillPath, curvePath, cutoffHz, cutoffText, knobDegrees, qText, resonanceText } from './filter-curve.js';

const demo = document.querySelector('[data-demo]');

if (demo) {
	const state = { face: 'ink', cutoff: 0.6, resonance: 0.5 };

	const CUSTOM_FACES = ['bone', 'ink', 'pop'];
	const CAPTIONS = {
		custom: 'The same instrument with an interface of its own. It is a web page.',
		stock: 'Built-in widgets: a few lines of JSON and you have sound. Plain on purpose.',
	};

	const all = (selector) => [...demo.querySelectorAll(selector)];
	const one = (selector) => demo.querySelector(selector);

	const knobs = all('[data-knob]');
	const faceButtons = all('[data-demo-faces] [data-value]');

	// How each parameter is read out to assistive technology.
	const PARAMS = {
		cutoff: {
			min: 20,
			max: 20000,
			now: (value) => Math.round(cutoffHz(value)),
			text: cutoffText,
		},
		resonance: {
			min: 0,
			max: 1,
			now: (value) => Number(value.toFixed(2)),
			text: resonanceText,
		},
	};

	function render() {
		const custom = state.face !== 'stock';

		// Which interface, and which source file describes it.
		for (const button of faceButtons) button.setAttribute('aria-pressed', String(button.dataset.value === state.face));
		one('[data-face-custom]').hidden = !custom;
		one('[data-face-stock]').hidden = custom;
		if (custom) {
			const face = one('[data-face-custom]');
			for (const name of CUSTOM_FACES) face.classList.toggle(`face-${name}`, name === state.face);
		}
		one('[data-pane-js]').classList.toggle('is-current', custom);
		one('[data-pane-json]').classList.toggle('is-current', !custom);
		one('[data-ui-file]').textContent = custom ? 'main.js' : 'Savoy.csd';
		one('[data-caption]').textContent = custom ? CAPTIONS.custom : CAPTIONS.stock;

		// The two parameters.
		for (const knob of knobs) {
			const name = knob.dataset.knob;
			const param = PARAMS[name];
			knob.querySelector('[data-dial]').style.transform = `rotate(${knobDegrees(state[name])}deg)`;
			knob.setAttribute('aria-valuenow', String(param.now(state[name])));
			knob.setAttribute('aria-valuetext', param.text(state[name]));
		}
		for (const el of all('[data-readout="cutoff"]')) el.textContent = cutoffText(state.cutoff);
		for (const el of all('[data-readout="resonance"]')) el.textContent = resonanceText(state.resonance);
		for (const el of all('[data-readout="q"]')) el.textContent = qText(state.resonance);

		const line = curvePath(state.cutoff, state.resonance);
		one('[data-curve-line]').setAttribute('d', line);
		one('[data-curve-fill]').setAttribute('d', curveFillPath(line));
	}

	function setParam(name, value) {
		state[name] = Math.min(1, Math.max(0, value));
		render();
	}

	// Turn the drawn knobs into sliders.
	for (const knob of knobs) {
		const name = knob.dataset.knob;
		knob.setAttribute('role', 'slider');
		knob.setAttribute('aria-label', knob.dataset.label);
		knob.setAttribute('tabindex', '0');
		knob.setAttribute('aria-valuemin', String(PARAMS[name].min));
		knob.setAttribute('aria-valuemax', String(PARAMS[name].max));

		knob.addEventListener('keydown', (event) => {
			const steps = {
				ArrowUp: 0.01,
				ArrowRight: 0.01,
				ArrowDown: -0.01,
				ArrowLeft: -0.01,
				PageUp: 0.1,
				PageDown: -0.1,
			};
			if (event.key in steps) setParam(name, state[name] + steps[event.key]);
			else if (event.key === 'Home') setParam(name, 0);
			else if (event.key === 'End') setParam(name, 1);
			else return;
			event.preventDefault();
		});

		// Drag up or to the right to turn the knob up. 200px is the full range.
		let last = null;
		knob.addEventListener('pointerdown', (event) => {
			if (event.button !== 0) return;
			last = { x: event.clientX, y: event.clientY };
			knob.setPointerCapture(event.pointerId);
			knob.focus();
			event.preventDefault();
		});
		knob.addEventListener('pointermove', (event) => {
			if (!last) return;
			const delta = (event.clientX - last.x - (event.clientY - last.y)) / 200;
			last = { x: event.clientX, y: event.clientY };
			setParam(name, state[name] + delta);
		});
		const release = () => {
			last = null;
		};
		knob.addEventListener('pointerup', release);
		knob.addEventListener('pointercancel', release);
	}

	for (const button of faceButtons) {
		button.addEventListener('click', () => {
			state.face = button.dataset.value;
			render();
		});
	}

	one('[data-preview-label]').textContent = 'Preview, drag the knobs';
	render();
}
