// A small pixel cow that walks the header bar by day and sleeps at night.
import { reducedMotion, sky, watch } from './sky.js';
import { keep, recall } from './state.js';

const pasture = document.getElementById('pasture');
const canvas = pasture.firstElementChild;
const ctx = canvas.getContext('2d');
const COW_W = 25, COW_H = 20;     // the sprite's grid, in its own pixels
const SPEED = 9;                  // sprite pixels walked per second
const STEP_MS = 240;              // time per walking frame
const Z_MS = 850;                 // time per snore
const REST_MS = 900;              // pause before turning round, and after waking
canvas.width = COW_W;
canvas.height = COW_H;

function drawCow(pose, step, facing, night) {
  // on the dark bar at night a black outline would vanish, so it turns slate
  const K = night ? '#8b94a3' : '#141414', D = night ? '#3b4250' : '#2b2b2b';
  const W = '#f6f6f4', S = '#cfcfcc', P = '#e79a93', N = '#f3bbb5', zColor = '#e5e7eb';
  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  ctx.clearRect(0, 0, COW_W, COW_H);
  ctx.save();
  if (facing < 0) { ctx.translate(COW_W, 0); ctx.scale(-1, 1); }

  if (pose === 'sleep') {
    // lying down: legs folded away, chin on the ground, eyes shut
    r(0, 16, 5, 4, K); r(1, 17, 3, 2, W); r(1, 17, 1, 2, D);            // tail, curled on the ground
    r(4, 10, 15, 10, K); r(5, 11, 13, 8, W);                             // body
    r(5, 11, 3, 4, D); r(10, 12, 3, 3, D); r(14, 11, 3, 2, D); r(6, 16, 2, 2, D);
    r(5, 18, 13, 1, S);
    r(12, 17, 5, 3, K); r(13, 18, 3, 1, W);                              // a folded foreleg
    r(17, 9, 1, 2, K); r(24, 9, 1, 2, K);                                // horns
    r(17, 11, 8, 9, K); r(18, 12, 6, 7, W);                              // head
    r(19, 14, 2, 1, D); r(22, 14, 2, 1, D);                              // closed eyes
    r(19, 16, 5, 1, N); r(19, 17, 5, 2, P); r(20, 17, 1, 1, D); r(22, 17, 1, 1, D);
  } else {
    // standing; the two diagonal pairs of legs take turns lifting
    r(1, 6, 4, 1, K); r(1, 6, 3, 8, K); r(2, 7, 1, 4, W); r(2, 11, 1, 2, D);   // tail
    [5, 8, 13, 16].forEach((x, i) => {
      const lifted = pose === 'walk' && (i % 2 === step);
      const len = lifted ? 6 : 7;
      r(x, 13, 3, len, K); r(x + 1, 13, 1, len - 2, W); r(x + 1, 13 + len - 2, 1, 1, D);
    });
    r(11, 13, 2, 2, P); r(11, 15, 2, 1, K);                              // udder
    r(4, 5, 15, 9, K); r(5, 6, 13, 7, W);                                // body
    r(5, 6, 3, 4, D); r(10, 7, 3, 3, D); r(14, 6, 3, 2, D); r(6, 11, 2, 2, D);
    r(11, 12, 7, 1, S);
    r(17, 0, 1, 2, K); r(24, 0, 1, 2, K);                                // horns
    r(17, 2, 8, 9, K); r(18, 3, 6, 7, W);                                // head
    r(19, 5, 1, 2, D); r(22, 5, 1, 2, D);                                // eyes
    r(19, 7, 5, 1, N); r(19, 8, 5, 2, P); r(20, 8, 1, 1, D); r(22, 8, 1, 1, D);
  }
  ctx.restore();

  if (pose === 'sleep') {
    // z's drifting up from the head; drawn after the flip so they always read as z
    const z = (x, y, n) => { r(x, y, n, 1, zColor); for (let i = 1; i < n - 1; i++) r(x + n - 1 - i, y + i, 1, 1, zColor); r(x, y + n - 1, n, 1, zColor); };
    const hx = facing < 0 ? 3 : 18;
    z(hx, 5, 4);
    if (step === 1) z(hx + (facing < 0 ? -3 : 3), 0, 4);
  }
}

// it carries on from where it stood on the last page
const was = recall().cow;
let scale = 2, room = 0;          // drawn size, and how far there is to walk
let x = was ? was.x : -1, facing = was ? was.facing : Math.random() < 0.5 ? -1 : 1;
let step = 0, stepAt = 0, restUntil = 0, last = 0, wasNight = null;
let drawn = '', placed = -1, raf = 0, timer = 0;
keep(() => ({ cow: { x, facing } }));

function fit() {
  const width = pasture.clientWidth;
  scale = width >= 110 ? 2 : 1;                     // a smaller cow where the bar is tight
  room = width - COW_W * scale;
  canvas.style.display = room < 4 ? 'none' : '';
  canvas.style.width = COW_W * scale + 'px';
  canvas.style.height = COW_H * scale + 'px';
  canvas.style.top = Math.round((pasture.clientHeight - COW_H * scale) / 2) + 'px';
  if (x < 0) x = Math.random() * Math.max(room, 0);
  x = Math.min(Math.max(x, 0), Math.max(room, 0));
  wake();
}

// One moment of the cow's life. Asks for the next one only when there will be
// something new to show: every frame while it walks, once a snore while it
// sleeps, and not at all while it stands still.
function live(now) {
  const dt = Math.min(100, now - last);
  last = now;
  const night = sky.night;
  if (wasNight === true && !night) restUntil = now + REST_MS;      // just woken: stand a moment
  wasNight = night;
  let pose = 'stand', next = Infinity;                             // ms until the next moment
  if (night) {
    pose = 'sleep';
    if (reducedMotion.matches) step = 0;
    else {
      if (now - stepAt >= Z_MS) { step ^= 1; stepAt = now; }
      next = Z_MS - (now - stepAt);
    }
  } else if (!reducedMotion.matches && room >= 4) {
    next = 0;
    if (now >= restUntil) {
      pose = 'walk';
      x += facing * SPEED * scale * dt / 1000;
      if (x >= room) { x = room; facing = -1; restUntil = now + REST_MS; }
      else if (x <= 0) { x = 0; facing = 1; restUntil = now + REST_MS; }
      if (now - stepAt >= STEP_MS) { step ^= 1; stepAt = now; }
    }
  }
  const key = pose + step + facing + night;
  if (key !== drawn) { drawn = key; drawCow(pose, step, facing, night); }
  if (Math.round(x) !== placed) { placed = Math.round(x); canvas.style.transform = `translateX(${placed}px)`; }

  if (next === 0) raf = requestAnimationFrame(live);
  else if (next < Infinity) timer = setTimeout(wake, next);
}

// look again now: the day turned, the bar changed size, or a snore is due
function wake() {
  cancelAnimationFrame(raf);
  clearTimeout(timer);
  raf = requestAnimationFrame(live);
}

new ResizeObserver(fit).observe(pasture);
fit();
watch(() => { if (sky.night !== wasNight) wake(); });
reducedMotion.addEventListener('change', wake);
