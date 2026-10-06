// Bend the backdrop at the header bar's rim, like the edge of a glass slab.
// Only Chromium applies an SVG filter to a backdrop; elsewhere the plain blur stays.
const glass = document.getElementById('glass');
const image = document.getElementById('rim-map');
const displace = image.nextElementSibling;
const SETTLE_MS = 150;            // wait this long after the last resize before redrawing the map
let builds = 0;                   // counts maps drawn, so a slow one never replaces a newer one

// The filter shifts each backdrop pixel by an amount read from a map the size
// of the bar: neutral grey in the middle, and toward the rim a push inward
// that grows to the edge.
function buildMap() {
  const w = Math.round(glass.offsetWidth), h = Math.round(glass.offsetHeight);
  if (!w || !h) return;
  const RIM = Math.min(26, h * 0.2);    // how far in from the edge the bend reaches, px
  const SHIFT = RIM * 1.3;              // largest sideways shift, at the very edge, px
  const r = Math.min(parseFloat(getComputedStyle(glass).borderTopLeftRadius) || 0, w / 2, h / 2);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hx = w / 2 - r, hy = h / 2 - r;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // distance from the rounded edge, and the direction pointing inward
      const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2;
      const qx = Math.abs(px) - hx, qy = Math.abs(py) - hy;
      let depth, nx = 0, ny = 0;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy);
        depth = r - len;
        nx = -Math.sign(px) * qx / len; ny = -Math.sign(py) * qy / len;
      } else if (qx > qy) {
        depth = r - qx; nx = -Math.sign(px);
      } else {
        depth = r - qy; ny = -Math.sign(py);
      }
      let m = 0;
      if (depth < RIM) { const k = 1 - Math.max(depth, 0) / RIM; m = k * k; }
      const i = (y * w + x) * 4;
      d[i] = 128 + 127 * nx * m;       // R drives the horizontal shift
      d[i + 1] = 128;
      d[i + 2] = 128 + 127 * ny * m;   // B drives the vertical shift
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL('image/png');
  const build = ++builds;
  // decode the map first, then switch the filter on, so the bar is never
  // painted with a half-loaded map
  const pre = new Image();
  pre.src = url;
  pre.decode().catch(() => {}).then(() => {
    if (build !== builds) return;
    glass.classList.remove('refract');
    image.setAttribute('width', w);
    image.setAttribute('height', h);
    image.setAttribute('href', url);
    displace.setAttribute('scale', SHIFT * 2);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (build === builds) glass.classList.add('refract');
    }));
  });
}

if (navigator.userAgentData && CSS.supports('backdrop-filter', 'url(#rim-refraction)')) {
  // the map is drawn at once for the bar's first size, then only when a resize has settled
  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(buildMap, builds ? SETTLE_MS : 0);
  }).observe(glass);
}
