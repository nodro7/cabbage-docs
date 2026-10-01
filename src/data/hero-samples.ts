// The three code samples in the Home page editor demo.
//
// The two interface samples are both 15 lines, so the pane is the same
// height whichever one is showing.

/** Savoy.csd: the sound. It never changes, whichever interface is showing. */
export const savoyCsd = `instr Savoy
  cutoff:k = cabbageGetValue:k("cutoff")
  reso:k = cabbageGetValue:k("resonance")
  saw:a = vco2(0.4, 110)
  sig:a = moogladder(saw, tonek(cutoff, 10), reso)
  outs(sig, sig)
endin`;

/** Savoy.csd: the interface, as built-in widgets. */
export const cabbageJson = `<Cabbage>{
  "pluginId": "Svoy",
  "widgets": [
    { "type": "form", "caption": "Savoy",
      "size": { "width": 440, "height": 200 } },
    { "type": "rotarySlider", "channels": [ {
      "id": "cutoff",
      "range": { "min": 20, "max": 20000, "defaultValue": 1200 }
    } ] },
    { "type": "rotarySlider", "channels": [ {
      "id": "resonance",
      "range": { "min": 0, "max": 1, "defaultValue": 0.5 }
    } ] }
  ]
}</Cabbage>`;

/** main.js: the interface, as a web page that uses the Cabbage JS API. */
export const mainJs = `import { Cabbage } from './cabbage/cabbage.js';
const cutoff = document.querySelector('#cutoff');
const send = (gesture) => Cabbage.sendControlData(
  { channel: 'cutoff', value: +cutoff.value, gesture }, null);

// begin and end let the DAW record automation.
cutoff.addEventListener('pointerdown', () => send('begin'));
cutoff.addEventListener('input', () => send('value'));
cutoff.addEventListener('pointerup', () => send('end'));

// Follow the DAW when it moves the knob. Never send from here.
Cabbage.addMessageListener((msg) => {
  if (msg.command === 'parameterChange') redraw(msg.data ?? msg);
});
Cabbage.isReadyToLoad(null);`;

/** FilterBank.csd, from the Csound 7 page of the docs. */
export const filterBankCsd = `; Four resonant filters, created and run as one array.
instr FilterBank
  freq:i[] fillarray p5*0.75, p5, p5*1.333, p5*1.666
  obj:Opcode[] create reson, lenarray(freq)
  src:a rand linenr(p4, 0.1, 0.1, 0.01)
  sig:a[] run obj, src, freq, freq/p6, 2
  out sumarray(sig) / lenarray(sig)
endin`;
