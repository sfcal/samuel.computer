// The sky: stars above, clouds below, and how far between them the page has
// turned. The bar's button moves it on every page; on the home page scrolling
// input does too (see home/input.js). Everything else follows from here: the
// styles read --day, and scripts watch().
import { keep, recall } from './state.js';

const root = document.documentElement;
const clouds = document.getElementById('clouds');
const stars = document.getElementById('stars');
const phase = document.getElementById('phase');
const TILE = 181;                 // height of the cloud tile, in CSS pixels
const STAR_TILE = 640;            // height of the star tile as drawn
const STAR_SPEED = 0.5;           // the stars are far away, so they drift at half speed
const FADE = 1500;                // pixels of scrolling from full night to full day
const DRIFT = 0.25;               // how much of a page's own scroll the sky follows
// Base.astro places the layers before the first paint with copies of TILE,
// STAR_TILE, STAR_SPEED, FADE and the easing in place(): change them there too

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// For other scripts to read, never to write: pixels scrolled, the eased
// fraction of day (0 under the stars, 1 once the clouds are fully in), and
// which half of that we are in.
export const sky = { scrolled: 0, day: -1, night: null };

let target = 0;                   // where the sky is heading, in pixels scrolled
let velocity = 0;                 // coasting speed after a touch flick, px per ms
let glide = null;                 // a timed move, started by the bar's button
let drift = 0;                    // extra slide while a page scrolls; never changes day or night
let raf = 0, lastTime = 0;
const watchers = [];

// call fn(sky) now and again after every move
export function watch(fn) {
  watchers.push(fn);
  fn(sky);
}

// a repeating layer only needs its offset within one tile; snap that to whole
// device pixels to keep the pixel art crisp
function slide(layer, offset, tile) {
  const dpr = devicePixelRatio || 1;
  const y = Math.round((offset % tile) * dpr) / dpr;
  layer.style.transform = `translate3d(0,${-y}px,0)`;
}

function place() {
  slide(clouds, sky.scrolled + drift, TILE);
  slide(stars, (sky.scrolled + drift) * STAR_SPEED, STAR_TILE);
  // night at the top; the stars fade out and the clouds show through below
  const t = Math.min(1, sky.scrolled / FADE);
  const day = Math.round(t * t * (3 - 2 * t) * 500) / 500;    // eased, in small steps
  if (day !== sky.day) {
    sky.day = day;
    root.style.setProperty('--day', day);
    const night = day < 0.5;
    if (night !== sky.night) {
      sky.night = night;
      root.classList.toggle('night', night);
      phase.setAttribute('aria-label', night ? 'Switch to day' : 'Switch to night');
    }
  }
  for (const fn of watchers) fn(sky);
}

function step(now) {
  const dt = Math.min(50, now - lastTime);
  lastTime = now;
  if (glide) {
    const k = Math.min(1, Math.max(0, (now - glide.start) / glide.ms));
    sky.scrolled = target = glide.from + (glide.to - glide.from) * (k * k * (3 - 2 * k));
    if (k >= 1) glide = null;
  } else if (velocity) {
    target += velocity * dt;
    if (target <= 0) { target = 0; velocity = 0; }             // the top of the sky is a hard stop
    sky.scrolled = target;
    velocity *= Math.pow(0.998, dt);
    if (Math.abs(velocity) < 0.02) velocity = 0;
  } else if (reducedMotion.matches || Math.abs(target - sky.scrolled) < 0.5) {
    sky.scrolled = target;
  } else {
    sky.scrolled += (target - sky.scrolled) * (1 - Math.pow(0.75, dt / 16.7));   // ease toward the target
  }
  place();
  raf = glide || velocity || sky.scrolled !== target ? requestAnimationFrame(step) : 0;
}

function kick() {
  if (!raf) { lastTime = performance.now(); raf = requestAnimationFrame(step); }
}

/* -- moving the sky by hand; the home page's scrolling input calls these -- */

// wheel and keys: head for a spot `delta` pixels on. `direct` moves there at
// once, for input that is already smooth.
export function push(delta, direct = false) {
  target = Math.max(0, target + delta);
  if (direct) sky.scrolled = Math.max(0, sky.scrolled + delta);
  velocity = 0; glide = null;
  kick();
}

// touch: stop where it is, follow the finger, then coast at the speed it left with
export function hold() {
  velocity = 0; glide = null;
}
export function drag(delta) {
  sky.scrolled = target = Math.max(0, target + delta);
  kick();
}
export function fling(speed) {
  velocity = reducedMotion.matches ? 0 : speed;
  kick();
}

// the bar's button: glide to the other half of the day (stars <-> clouds)
phase.addEventListener('click', () => {
  const to = sky.night ? FADE : 0;
  velocity = 0;
  if (reducedMotion.matches) { glide = null; sky.scrolled = target = to; place(); return; }
  glide = { from: sky.scrolled, to, start: performance.now(), ms: 1800 };
  kick();
});

// on a page that scrolls, the sky keeps its stars or clouds and only drifts a little
addEventListener('scroll', () => { drift = Math.max(0, scrollY) * DRIFT; place(); }, { passive: true });

// pick up where the last page left the sky, and leave it for the next one
function restore() {
  sky.scrolled = target = recall().scrolled ?? FADE;     // a first visit starts in daylight
  place();
}
keep(() => ({ scrolled: glide ? glide.to : target }));
addEventListener('pageshow', e => { if (e.persisted) restore(); });   // Back, to a page the browser kept alive
restore();
