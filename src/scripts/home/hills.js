// Hills: layered sine-wave ridges, dithered down to two colours.
import { reducedMotion } from '../sky.js';
import { keep, recall } from '../state.js';
import { every } from '../ticker.js';
import { seat } from './house.js';

const box = document.getElementById('hills');
const canvas = box.firstElementChild;
const ctx = canvas.getContext('2d');
const LAYERS = 9;
const DOT = 2;              // size of one dither dot, in CSS pixels
const FRAME_MS = 33;        // the drift is slow, so 30 frames a second is plenty
const TAU = Math.PI * 2;
// the only two colours used: a pale leaf "paper" and a deep green "ink"
const LIGHT = 0xff000000 | (0xb5 << 16) | (0xf2 << 8) | 0xe6;   // #e6f2b5
const DARK  = 0xff000000 | (0x1a << 16) | (0x55 << 8) | 0x34;   // #34551a
// the pair as a table (0 dark, 1 light). Whether a dot is light is a coin toss
// the processor cannot guess, so its colour is looked up, not branched on.
const SHADE = Uint32Array.of(DARK, LIGHT);
// 8x8 ordered-dither thresholds; fixed to the screen, so the dots hold
// still while the ridges move through them
const BAYER = Float64Array.from([
   0, 32,  8, 40,  2, 34, 10, 42,   48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,   60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,   51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,   63, 31, 55, 23, 61, 29, 53, 21,
], v => (v + 0.5) / 64);

// The same hills for the whole visit: their random numbers come from a small
// seeded generator (mulberry32), and the seed is carried from page to page.
const seed = recall().hills ?? Math.floor(Math.random() * 2 ** 32);
keep(() => ({ hills: seed }));
let state = seed;
function random() {
  let t = state += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
const rnd = (lo, hi) => lo + random() * (hi - lo);

// each ridge is the sum of three sine waves. The waves stay where they are and
// only sway a little back and forth (a small swing of their phase, each on its
// own slow beat), so the hills breathe in place instead of rolling past.
const layers = Array.from({ length: LAYERS }, (_, i) => {
  const depth = i / (LAYERS - 1);                     // 0 at the back, 1 in front
  const waves = [
    { length: rnd(0.55, 1.0), weight: 1.0,  swing: 0.2,  period: rnd(22, 34) },
    { length: rnd(0.28, 0.48), weight: 0.35, swing: 0.28, period: rnd(15, 24) },
    { length: rnd(1.3, 2.1),  weight: 0.5,  swing: 0.14, period: rnd(36, 55) },
  ].map(w => Object.assign(w, { phase: rnd(0, TAU), beat: rnd(0, TAU) }));
  const tone = 0.74 - 0.66 * depth;                   // share of light dots: pale far, dark near
  return {
    waves, tone,
    line: tone >= 0.5 ? DARK : LIGHT,                 // ridge outline, in whichever colour shows
    mid: 0.25 + 0.68 * Math.pow(depth, 0.9),          // ridge line, as a fraction of height
    amp: (0.135 - 0.035 * depth) / 1.85,              // per unit of summed weights
  };
});

let cols = 0, rows = 0, image = null, pixels = null;
let skyline = null;         // per column, how far down from the top of the canvas the hills begin
const ridge = new Float32Array(LAYERS);
const sway = new Float64Array(LAYERS * 3);

function resize() {
  cols = Math.ceil(box.clientWidth / DOT);
  rows = Math.ceil(box.clientHeight / DOT);
  // a hidden or collapsed window has no area; wait for the next resize
  if (cols < 1 || rows < 1) { image = null; return; }
  canvas.width = cols;
  canvas.height = rows;
  canvas.style.width = cols * DOT + 'px';
  canvas.style.height = rows * DOT + 'px';
  image = ctx.createImageData(cols, rows);
  pixels = new Uint32Array(image.data.buffer);
  skyline = new Float32Array(cols);
}

function draw(seconds) {
  const glow = rows * 0.2;      // how far the lit crest of each ridge fades down its slope
  // where each wave is in its sway right now
  let n = 0;
  for (const layer of layers) {
    for (const w of layer.waves) sway[n++] = w.swing * Math.sin(TAU * seconds / w.period + w.beat);
  }
  for (let x = 0; x < cols; x++) {
    let k = 0, top = 0;
    for (let i = 0; i < LAYERS; i++) {
      const layer = layers[i];
      let y = 0;
      for (const w of layer.waves) {
        y += w.weight * Math.sin(TAU * x / cols / w.length + w.phase + sway[k++]);
      }
      ridge[i] = rows * (layer.mid + layer.amp * y);
      if (i === 0 || ridge[i] < top) top = ridge[i];
    }
    skyline[x] = top;
    // Paint the column from the nearest ridge back: each ridge shows from its
    // own line down to where a nearer one has already taken over, so no dot
    // has to go looking for the ridge that covers it.
    let end = rows;
    for (let i = LAYERS - 1; i >= 0; i--) {
      const r = ridge[i];
      const from = Math.ceil(r);                      // the first dot on or under the ridge line
      if (from >= end) continue;                      // hidden behind the nearer ridges
      const layer = layers[i];
      pixels[from * cols + x] = layer.line;           // that first dot is the outline
      for (let y = from + 1, p = y * cols + x; y < end; y++, p += cols) {
        const tone = layer.tone + 0.3 * Math.max(0, 1 - (y - r) / glow);
        pixels[p] = SHADE[+(tone > BAYER[(y & 7) * 8 + (x & 7)])];
      }
      end = from;
    }
    // open sky above the far ridge
    for (let y = 0; y < end; y++) pixels[y * cols + x] = 0;
  }
  ctx.putImageData(image, 0, 0);
  seat(skyline, DOT, rows);     // the house sits on the skyline
}

const loop = every(FRAME_MS, now => draw(now / 1000));

function run() {
  resize();
  if (!image) { loop.stop(); return; }
  // sizing the canvas wipes it, so paint now rather than show a blank frame
  if (reducedMotion.matches) { loop.stop(); draw(0); }
  else { draw(performance.now() / 1000); loop.start(); }
}

new ResizeObserver(run).observe(box);       // also reports the size the box starts with
reducedMotion.addEventListener('change', run);
