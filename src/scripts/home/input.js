// Nothing on the home page scrolls. The window is a fixed scene; the wheel,
// touch drags and keys are read here and move only the sky.
import { drag, fling, hold, push } from '../sky.js';

// wheel and trackpad, anywhere on the page, the header bar included
addEventListener('wheel', e => {
  if (e.ctrlKey) return;                       // leave pinch and ctrl+wheel zoom alone
  e.preventDefault();
  const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1;
  const delta = e.deltaY * unit;
  push(delta, e.deltaMode === 0 && Math.abs(delta) < 50);   // trackpads are already smooth
}, { passive: false });

// touch: the sky follows the finger, then coasts
let touchY = null, samples = [];
addEventListener('touchstart', e => {
  hold();
  touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
  samples = touchY === null ? [] : [[performance.now(), touchY]];
}, { passive: true });
addEventListener('touchmove', e => {
  if (touchY === null || e.touches.length !== 1) return;
  if (e.cancelable) e.preventDefault();
  const y = e.touches[0].clientY;
  drag(touchY - y);
  touchY = y;
  samples.push([performance.now(), y]);
  if (samples.length > 5) samples.shift();
}, { passive: false });
function release() {
  if (touchY === null) return;
  touchY = null;
  // the speed of the last few moves, unless the finger had already come to rest
  const first = samples[0], last = samples[samples.length - 1];
  const span = last[0] - first[0];
  fling(span > 0 && performance.now() - last[0] < 80 ? (first[1] - last[1]) / span : 0);
}
addEventListener('touchend', release);
addEventListener('touchcancel', release);

// keys
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const page = innerHeight * 0.85;
  const onControl = e.target instanceof Element && e.target.closest('button, a');
  let move = 0;
  if (e.key === 'ArrowDown') move = 60;
  else if (e.key === 'ArrowUp') move = -60;
  else if (e.key === 'PageDown') move = page;
  else if (e.key === 'PageUp') move = -page;
  else if (e.key === ' ' && !onControl) move = e.shiftKey ? -page : page;
  if (!move) return;
  e.preventDefault();
  push(move);
});
