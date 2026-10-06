// Call draw(now) on animation frames, at most once every `ms` milliseconds.
// Returns a switch; nothing runs until start(), and frames stop by themselves
// while the tab is hidden.
export function every(ms, draw) {
  let raf = 0, last = -Infinity;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last >= ms) { last = now; draw(now); }
  }
  return {
    start() {
      if (!raf) { last = -Infinity; raf = requestAnimationFrame(frame); }
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
