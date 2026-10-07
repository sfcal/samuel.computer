// A small pixel cow that walks the header bar by day and sleeps at night.
import { reducedMotion, sky } from './sky.js';
import sheet from '../assets/cow.png?url';

const pasture = document.getElementById('pasture');
const canvas = pasture.firstElementChild;
const ctx = canvas.getContext('2d');
const COW_W = 25, COW_H = 20;     // one frame of the sheet, in its own pixels
const SPEED = 9;                  // sprite pixels walked per second
const STEP_MS = 240;              // time per walking frame
const Z_MS = 850;                 // time per snore
const REST_MS = 900;              // pause before turning round, and after waking
canvas.width = COW_W;
canvas.height = COW_H;

// The frames sit side by side in cow.png: one standing, two walking and two
// sleeping, each facing right and then left. Asleep, the outline is slate
// rather than black, so it shows on the dark bar at night.
const FRAME = { stand: 0, walk: 1, sleep: 3 };
const img = new Image();
img.src = sheet;

// it carries on from where it stood on the last page
let was = null;
try { was = JSON.parse(sessionStorage.getItem('cow')); } catch {}   // storage is blocked or the record is damaged: start anywhere
let scale = 2, room = 0;          // drawn size, and how far there is to walk
let x = was ? was.x : -1, facing = was ? was.facing : Math.random() < 0.5 ? -1 : 1;
let step = 0, stepAt = 0, restUntil = 0, last = 0, wasNight = null;
addEventListener('pagehide', () => {
  try { sessionStorage.setItem('cow', JSON.stringify({ x, facing })); } catch {}
});

function fit() {
  const width = pasture.clientWidth;
  scale = width >= 110 ? 2 : 1;                     // a smaller cow where the bar is tight
  room = width - COW_W * scale;
  canvas.style.display = room < 4 ? 'none' : '';
  canvas.style.width = COW_W * scale + 'px';
  canvas.style.height = COW_H * scale + 'px';
  if (x < 0) x = Math.random() * Math.max(room, 0);
  x = Math.min(Math.max(x, 0), Math.max(room, 0));
}

// one moment of the cow's life, every frame
function live(now) {
  requestAnimationFrame(live);
  const dt = Math.min(100, now - last);
  last = now;
  const night = sky.night;
  if (wasNight === true && !night) restUntil = now + REST_MS;      // just woken: stand a moment
  wasNight = night;
  let pose = 'stand';
  if (night) {
    pose = 'sleep';
    if (reducedMotion.matches) step = 0;
    else if (now - stepAt >= Z_MS) { step ^= 1; stepAt = now; }
  } else if (!reducedMotion.matches && room >= 4 && now >= restUntil) {
    pose = 'walk';
    x += facing * SPEED * scale * dt / 1000;
    if (x >= room) { x = room; facing = -1; restUntil = now + REST_MS; }
    else if (x <= 0) { x = 0; facing = 1; restUntil = now + REST_MS; }
    if (now - stepAt >= STEP_MS) { step ^= 1; stepAt = now; }
  }
  const frame = (FRAME[pose] + (pose === 'stand' ? 0 : step)) * 2 + (facing < 0 ? 1 : 0);
  ctx.clearRect(0, 0, COW_W, COW_H);
  ctx.drawImage(img, frame * COW_W, 0, COW_W, COW_H, 0, 0, COW_W, COW_H);
  canvas.style.transform = `translateX(${Math.round(x)}px)`;
}

img.decode().catch(() => {}).then(() => {
  new ResizeObserver(fit).observe(pasture);
  fit();
  requestAnimationFrame(live);
});
