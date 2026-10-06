// House: pops up from behind the hills as the sky turns to day. The hills hide
// its foot, so it is seated on their skyline and bobs as the ridges sway.
import { reducedMotion, sky, watch } from '../sky.js';

const house = document.getElementById('house');
const RISE_FROM = 0.25, RISE_TO = 0.8;   // the stretch of the night-to-day fade over which it rises
const SUNK = 0.2;                        // share of the house left hidden behind the ridge, so it sits in the land

// ease that overshoots a little, so the house springs up and settles
const pop = k => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);

let left = 0, size = 0;                  // where the house stands and how wide it is; only a resize changes these
let tops = null, dot = 0, rows = 0;      // the skyline, as the hills last drew it
let day = -1;                            // how far the sky had turned to day when last looked at
let shown = null;                        // the move last written to the page

function place() {
  if (!tops) return;                     // the hills have not been drawn yet
  // the lowest point of the skyline across the house's width: its foot hides behind that
  const from = Math.max(0, Math.floor(left / dot));
  const to = Math.min(tops.length - 1, Math.ceil((left + size) / dot));
  let low = 0;
  for (let x = from; x <= to; x++) if (tops[x] > low) low = tops[x];
  const bottom = Math.round((rows - low) * dot - size * SUNK);

  const k = Math.min(1, Math.max(0, (day - RISE_FROM) / (RISE_TO - RISE_FROM)));
  const up = reducedMotion.matches ? k : pop(k);
  const drop = Math.round((1 - up) * size * 1.3);          // fully down, its roof is below the skyline

  // one move from the foot of the screen does both: up to its seat, down by the drop
  const y = drop - bottom;
  if (y !== shown) {
    shown = y;
    house.style.transform = 'translate3d(0,' + y + 'px,0)';
  }
}

// The hills call this after every draw. `skyline` holds, for each column of
// dots, how far down from the top of the hills the land begins; a dot is
// `dotSize` CSS pixels and the hills are `height` dots tall.
export function seat(skyline, dotSize, height) {
  tops = skyline;
  dot = dotSize;
  rows = height;
  place();
}

// reading layout is costly, so do it here and not on every frame
function measure() {
  left = house.offsetLeft;
  size = house.offsetWidth;
  place();
}
addEventListener('resize', measure);
measure();

// rise with the day even while the hills hold still
watch(() => {
  if (sky.day !== day) { day = sky.day; place(); }
});
