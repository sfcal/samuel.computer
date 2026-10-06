// "Samuel Calvert" in glass, rising and fading in with the day.
import { reducedMotion, sky, watch } from '../sky.js';

const root = document.documentElement;
const box = document.getElementById('name');
const svg = box.querySelector('svg');
const text = document.getElementById('name-text');
const RISE_FROM = 0.3, RISE_TO = 0.85;   // the stretch of the night-to-day fade over which it arrives
const NS = 'http://www.w3.org/2000/svg';
const TRACKING = -0.03;                  // letter-spacing in ems: set close, so the letters nearly touch
let size = 0;                            // the letter size, in pixels
let faded, dropped;                      // the opacity and the drop the box was last given

// The name's typeface, DynaPuff Bold, is chosen by the styles: --font-display
// lists it first and its stand-ins after. Only the face itself is asked for
// below; a stand-in this machine lacks would fail the whole request.
const FACE = (getComputedStyle(root).getPropertyValue('--font-display').trim() ||
  "DynaPuff, 'Arial Rounded MT Bold', system-ui, sans-serif").split(',')[0];

// lay the name out at one letter size and report the room it needs
function layout(lines, px) {
  const leading = px * 0.98;
  text.setAttribute('font-size', px);
  text.setAttribute('letter-spacing', TRACKING * px);
  text.replaceChildren(...lines.map((line, i) => {
    const span = document.createElementNS(NS, 'tspan');
    span.setAttribute('x', 0);
    span.setAttribute('y', Math.round(leading * i));
    span.textContent = line;
    return span;
  }));
  return text.getBBox();                                      // the ink actually drawn, whatever the font
}

// Size the letters to the window and the box to the letters. The box is
// measured from the drawn text itself, then centred, so it cannot hang off
// an edge; on a narrow screen the name goes on two lines to stay large.
function fit() {
  const vw = root.clientWidth, vh = innerHeight;
  if (!vw || !vh) return;
  const lines = vw < 640 ? ['Samuel', 'Calvert'] : ['Samuel Calvert'];
  size = Math.round(lines.length > 1
    ? Math.max(30, Math.min(vw * 0.2, vh * 0.11, 120))
    : Math.max(30, Math.min(vw * 0.1, vh * 0.2, 170)));
  let ink = layout(lines, size);
  const pad = px => Math.ceil(px * 0.28);                     // room around the ink for rim, gloss and shadow
  const most = vw - 24 - pad(size) * 2;                       // the widest the ink may be
  if (ink.width > most && ink.width > 0) {                    // too wide for this window: shrink to fit
    size = Math.max(16, Math.floor(size * most / ink.width));
    ink = layout(lines, size);
  }
  const margin = pad(size);
  const width = Math.ceil(ink.width) + margin * 2, height = Math.ceil(ink.height) + margin * 2;
  // move the text so its ink sits centred in the box
  for (const span of text.children) {
    span.setAttribute('x', Math.round(margin - ink.x));         // ink.x was measured with x at 0
    span.setAttribute('y', Math.round(+span.getAttribute('y') + margin - ink.y));
  }
  box.style.width = width + 'px';
  box.style.height = height + 'px';
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  // scale the soft inner glow and shade to the letter size
  document.getElementById('edge-glow-shift').setAttribute('dy', (size * 0.09).toFixed(2));
  document.getElementById('edge-glow-soft').setAttribute('stdDeviation', (size * 0.05).toFixed(2));
  document.getElementById('edge-shade-shift').setAttribute('dy', (-size * 0.08).toFixed(2));
  document.getElementById('edge-shade-soft').setAttribute('stdDeviation', (size * 0.05).toFixed(2));
  show();                                                     // the drop is counted in letter sizes
}

// ease that overshoots a little, so it springs up and settles, as the house does
const pop = k => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);

// Put the box where the sky, the letter size and the viewer's taste for motion
// say it belongs. Called whenever one of those changes, and on every move of
// the sky, so it touches a style only when the value is new.
function show() {
  const k = Math.min(1, Math.max(0, (sky.day - RISE_FROM) / (RISE_TO - RISE_FROM)));
  const up = reducedMotion.matches ? 1 : pop(k);
  const drop = Math.round((1 - up) * size * 0.6);
  if (k !== faded) {
    faded = k;
    box.style.opacity = k;
    box.style.visibility = k > 0 ? 'visible' : 'hidden';
  }
  if (drop !== dropped) {
    dropped = drop;
    box.style.transform = 'translate(-50%, calc(-50% + ' + drop + 'px))';
  }
}

// Fitting makes the browser lay the text out to measure it, so however often
// it is asked for between two frames, it is done once, on the next one.
let queued = 0;
function refit() {
  queued ||= requestAnimationFrame(() => { queued = 0; fit(); });
}

addEventListener('resize', refit);
// lay the name out again once its typeface has arrived
document.fonts.load('700 80px ' + FACE).then(refit, () => {});
document.fonts.ready.then(refit);
reducedMotion.addEventListener('change', show);
fit();
watch(show);
