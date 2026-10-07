// Moon: the full Moon, near side facing, gently wobbling, as a sphere of text
// characters. Where the browser has WebGPU, a shader adds the glow.
import { reducedMotion, sky, smoothstep, watch } from '../sky.js';
import { every } from '../ticker.js';

const box = document.getElementById('planet');
const hdrDisplay = matchMedia('(dynamic-range: high)');
const COLS = 40;                  // characters across the globe
const CELL_ASPECT = 0.7;          // cell width over height: rows packed tight, as in a dense terminal
const SPREAD = 1.3;               // the canvas is this many globes wide (see the CSS)
const TILT = 0.7;                 // north leans 40 degrees to the left, as the full Moon
                                  // hangs in an evening sky (and in the classic photographs)
// A very slight wobble, like the real Moon's libration but sped up: it rocks a
// few degrees side to side and nods a little, on two different slow beats.
const ROCK = { degrees: 4.5, seconds: 14 };
const NOD = { degrees: 3, seconds: 19 };
const FRAME_MS = 66;              // 15 frames a second suits text animation
const HDR_GAIN = 1.75;            // encoded-value boost for the brightest glyphs on an HDR
                                  // display; about 3.8x the luminance of SDR white
// the site's monospace face, read from the styles so the stack is written once (--font-mono in base.css)
const FONT = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
const RAMP = '.:-=+tvcxoB8%W#M@';  // characters from faintest to brightest
const DISC = '#030304';
const DEG = Math.PI / 180;

// a surface feature's position, with east and north directions at that spot
function place(lat, lon) {
  const cosLat = Math.cos(lat * DEG);
  const c = [cosLat * Math.sin(lon * DEG), Math.sin(lat * DEG), cosLat * Math.cos(lon * DEG)];
  const e = [Math.cos(lon * DEG), 0, -Math.sin(lon * DEG)];
  const n = [c[1] * e[2] - c[2] * e[1], c[2] * e[0] - c[0] * e[2], c[0] * e[1] - c[1] * e[0]];
  return { c, e, n };
}

// The dark lava plains (maria) at their real positions, as overlapping ovals:
// latitude, longitude, half-height, half-width (degrees of arc), darkness
// (lower is darker) and tint (above 0 brownish, below 0 bluish).
const MARIA = [
  [35, -17, 18, 21, 0.30, 0.5],     // Mare Imbrium
  [22, -58, 26, 19, 0.29, 0.2],     // Oceanus Procellarum
  [46, -52, 13, 15, 0.32, 0.2],     //   ... Sinus Roris, its northern reach
  [2, -50, 18, 19, 0.28, 0.1],      //   ... its southern reach
  [-12, -38, 10, 12, 0.30, 0.1],    //   ... down toward Humorum
  [7, -30, 10, 12, 0.32, 0.3],      // Mare Insularum
  [-10, -23, 9, 10, 0.30, 0.2],     // Mare Cognitum
  [-21, -16, 12, 14, 0.30, 0.2],    // Mare Nubium
  [-24, -39, 8.5, 8.5, 0.27, 0.1],  // Mare Humorum
  [11, -9, 5, 5.5, 0.34, 0.2],      // Sinus Aestuum
  [13, 4, 6, 6.5, 0.32, 0.3],       // Mare Vaporum
  [2, 1, 3.5, 5, 0.36, 0.2],        // Sinus Medii
  [27, 18, 12, 13, 0.31, 0.7],      // Mare Serenitatis
  [38, 30, 5, 7, 0.36, 0.3],        // Lacus Somniorum
  [17, 25, 6, 7, 0.27, -0.5],       // the strait between Serenitatis and Tranquillitatis
  [8, 31, 13, 16, 0.24, -1],        // Mare Tranquillitatis
  [-5, 28, 6, 6, 0.28, -0.4],       // Sinus Asperitatis
  [-15, 35, 7, 7, 0.29, 0.1],       // Mare Nectaris
  [-6, 51, 15, 11, 0.28, -0.3],     // Mare Fecunditatis
  [17, 59, 8, 10.5, 0.25, -0.2],     // Mare Crisium
  [56, 4, 5, 27, 0.35, 0.2],         // Mare Frigoris
  [57, -36, 4.5, 13, 0.36, 0.2],    //   ... its western arm
  [51.6, -9.4, 2.4, 2.8, 0.25, 0],   // Plato
  [-5, -68, 4, 4, 0.25, 0],          // Grimaldi
  [1, 87, 6, 5, 0.30, 0],           // Mare Smythii
  [13, 86, 6, 5, 0.32, 0],          // Mare Marginis
  [-39, 93, 9, 9, 0.36, 0],         // Mare Australe
].map(m => Object.assign(place(m[0], m[1]), {
  high: m[2], wide: m[3], shade: m[4], tint: m[5],
  reach: Math.cos(Math.min(89, Math.max(m[2], m[3]) * 1.6) * DEG),
}));

// Young craters with bright rays: latitude, longitude, core radius, ray length, strength
const RAYED = [
  [-43, -11, 2.6, 55, 1.0],   // Tycho, whose rays cross half the disc
  [10, -20, 3.2, 15, 0.85],   // Copernicus
  [8, -38, 2.2, 9, 0.75],     // Kepler
  [24, -47, 2.2, 7, 1.0],     // Aristarchus
  [16, 47, 1.8, 9, 0.75],     // Proclus
  [-9, 61, 2.4, 8, 0.6],      // Langrenus
  [-32, 54, 2.2, 14, 0.75],   // Stevinus
  [-24.5, -64, 2.0, 10, 0.75],// Byrgius
  [73, -10, 2.2, 14, 0.7],    // Anaxagoras
  [62, 50, 1.8, 9, 0.6],      // Thales
  [16, 16, 1.4, 5, 0.5],      // Menelaus
].map((r, i) => Object.assign(place(r[0], r[1]), { core: r[2], rays: r[3], strength: r[4], id: i, reach: Math.cos(r[3] * DEG) }));

const seed = 1969;                // fixed, so it is the same Moon on every visit
// smooth 3D noise from an integer hash, for ragged edges and surface texture
function hash(h) {
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const mix = (a, b, k) => a + (b - a) * k;
function noise(x, y, z) {
  const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
  const fx = x - x0, fy = y - y0, fz = z - z0;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  // each corner's hash stirs together an x, a y and a z term; the eight
  // corners share six of those between them, so each is worked out once
  const xa = Math.imul(x0, 374761393), xb = Math.imul(x0 + 1, 374761393);
  const ya = Math.imul(y0, 668265263), yb = Math.imul(y0 + 1, 668265263);
  const za = Math.imul(z0, 2147483647) ^ seed, zb = Math.imul(z0 + 1, 2147483647) ^ seed;
  return mix(
    mix(mix(hash(xa ^ ya ^ za), hash(xb ^ ya ^ za), u), mix(hash(xa ^ yb ^ za), hash(xb ^ yb ^ za), u), v),
    mix(mix(hash(xa ^ ya ^ zb), hash(xb ^ ya ^ zb), u), mix(hash(xa ^ yb ^ zb), hash(xb ^ yb ^ zb), u), v),
    w);
}
function fbm(x, y, z, octaves) {
  let sum = 0, amp = 0.5, total = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x, y, z); total += amp;
    x = x * 2.1 + 5.3; y = y * 2.1 + 1.7; z = z * 2.1 + 9.2; amp *= 0.5;
  }
  return sum / total;
}

const dot = (a, x, y, z) => a[0] * x + a[1] * y + a[2] * z;

// The Moon's surface at a latitude and longitude (degrees): brightness 0 to 1,
// how much of the spot is mare, and that mare's tint.
function surface(lat, lon) {
  const cosLat = Math.cos(lat * DEG), y = Math.sin(lat * DEG);
  const x = cosLat * Math.sin(lon * DEG), z = cosLat * Math.cos(lon * DEG);

  // maria: inside any oval, with the outline roughened so it is not a clean ellipse
  const ragged = (fbm(x * 4.2 + 2, y * 4.2 + 6, z * 4.2 + 4, 3) - 0.5) * 1.1;
  let mare = 0, shade = 0, tint = 0, weight = 0;
  for (const m of MARIA) {
    if (dot(m.c, x, y, z) < m.reach) continue;
    const up = Math.asin(dot(m.n, x, y, z)) / DEG, across = Math.asin(dot(m.e, x, y, z)) / DEG;
    const inside = 1 - smoothstep(0.7, 1.15, (up / m.high) ** 2 + (across / m.wide) ** 2 + ragged);
    if (inside <= 0) continue;
    mare = Math.max(mare, inside);
    shade += m.shade * inside; tint += m.tint * inside; weight += inside;
  }
  if (weight) { shade /= weight; tint /= weight; }

  // highlands are bright and rough; maria are dark and smooth
  const rough = fbm(x * 6.5 + 11, y * 6.5 + 4, z * 6.5 + 7, 3) - 0.5;
  let bright = 0.72 + rough * 0.22;
  bright += (shade + rough * 0.1 - bright) * mare;

  // rayed craters: a white core, a bright apron, and thin streaks fanning out
  for (const r of RAYED) {
    const along = dot(r.c, x, y, z);
    if (along < r.reach) continue;
    const away = Math.acos(Math.min(1, along)) / DEG;
    const bearing = Math.atan2(dot(r.e, x, y, z), dot(r.n, x, y, z));
    const streak = smoothstep(0.54, 0.7, noise(Math.cos(bearing) * 6.2 + r.id * 13.1, Math.sin(bearing) * 6.2 + r.id * 7.3, 0.5));
    const fade = Math.pow(1 - away / r.rays, 1.5);
    const apron = 1 - smoothstep(r.core, r.core * 3.2, away);
    bright += r.strength * (0.36 * streak * fade + 0.14 * apron);
    bright += (1 - bright) * (1 - smoothstep(r.core * 0.6, r.core * 1.5, away)) * r.strength;
  }
  return [Math.min(1, Math.max(0, bright)), mare, tint];
}

/* -- the characters, drawn with the ordinary 2D canvas -- */
let side = 0;                     // canvas side, CSS pixels
let pixels = 0;                   // canvas side, device pixels
let cellW = 0, cells = [];
let font = '';                    // the characters' font at this size

// work out, once per size, which character cells fall on the globe and which
// spot of the (leaning) planet each one looks at
function layoutCells() {
  const globe = side / SPREAD, edge = (side - globe) / 2;
  cellW = globe / COLS;
  font = '700 ' + (cellW / 0.6).toFixed(2) + 'px ' + FONT;
  const cellH = cellW / CELL_ASPECT;
  const rows = Math.round(globe / cellH);
  const top = edge + (globe - rows * cellH) / 2;
  cells = [];
  const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < COLS; i++) {
      const px = edge + (i + 0.5) * cellW, py = top + (j + 0.5) * cellH;
      const nx = (px - side / 2) / (globe / 2), ny = -(py - side / 2) / (globe / 2);
      const rr = nx * nx + ny * ny;
      if (rr > 0.985) continue;
      const nz = Math.sqrt(1 - rr);
      // the same point with the planet's lean undone
      const ox = nx * cosT + ny * sinT, oy = -nx * sinT + ny * cosT;
      cells.push({
        px, py,
        ox, oy, oz: nz,                            // where this cell looks, on an upright Moon
        limb: smoothstep(0, 0.36, nz),             // the rim fades, the face is evenly lit
      });
    }
  }
}

function drawGlyphs(ctx, seconds) {
  if (!side) return;                               // nothing to draw in a zero-sized window
  // the wobble: a small turn about the vertical axis, then a small tip toward the viewer
  const rock = ROCK.degrees * DEG * Math.sin(seconds / ROCK.seconds * Math.PI * 2);
  const nod = NOD.degrees * DEG * Math.sin(seconds / NOD.seconds * Math.PI * 2 + 1.3);
  const cosR = Math.cos(rock), sinR = Math.sin(rock), cosN = Math.cos(nod), sinN = Math.sin(nod);
  const scale = pixels / side;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, side, side);
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // a dark disc first, so stars do not shine through the gaps
  ctx.globalAlpha = 1;
  ctx.fillStyle = DISC;
  ctx.beginPath();
  ctx.arc(side / 2, side / 2, side / SPREAD / 2 - cellW * 0.5, 0, Math.PI * 2);
  ctx.fill();

  for (const c of cells) {
    const x = c.ox * cosR + c.oz * sinR, z1 = c.oz * cosR - c.ox * sinR;
    const y = c.oy * cosN - z1 * sinN, z = c.oy * sinN + z1 * cosN;
    const [bright, mare, tint] = surface(Math.asin(Math.max(-1, Math.min(1, y))) / DEG, Math.atan2(x, z) / DEG);
    const index = Math.min(RAMP.length - 1, Math.floor(Math.pow(bright, 0.85) * c.limb * RAMP.length));
    // warm grey highlands; each mare leans brown or blue, as in enhanced-colour photographs
    const level = 60 + 195 * bright;
    const brown = Math.max(0, tint) * mare, blue = Math.max(0, -tint) * mare;
    const r = level * (1 - 0.12 * blue), g = level * (0.97 - 0.05 * brown - 0.02 * blue), b = level * (0.94 - 0.09 * brown + 0.1 * blue);
    ctx.globalAlpha = 0.4 + 0.6 * c.limb;
    ctx.fillStyle = 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
    ctx.fillText(RAMP[index], c.px, c.py);
  }
}

/* -- the glow: a GPU shader over those characters -- */
const SHADER = `
  struct Params { gain: f32 };
  @group(0) @binding(0) var<uniform> params: Params;
  @group(0) @binding(1) var glyphSampler: sampler;
  @group(0) @binding(2) var glyphs: texture_2d<f32>;

  struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f };

  @vertex
  fn vertex(@builtin(vertex_index) index: u32) -> VertexOut {
    var corners = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
    let p = corners[index];
    var out: VertexOut;
    out.position = vec4f(p, 0.0, 1.0);
    out.uv = vec2f(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
    return out;
  }

  const GLOBE = ${(0.5 / SPREAD).toFixed(4)}; // globe radius as a fraction of the canvas: half of one SPREAD
  const SHINE = vec3f(0.78, 0.82, 0.92);      // pale moonlight

  fn tap(uv: vec2f) -> vec4f { return textureSampleLevel(glyphs, glyphSampler, uv, 0.0); }

  @fragment
  fn fragment(in: VertexOut) -> @location(0) vec4f {
    let d = length(in.uv - vec2f(0.5)) / GLOBE;   // 0 at the centre, 1 at the limb
    let mid = tap(in.uv);

    // bloom: average the neighbourhood along a spiral
    var glow = vec3f(0.0);
    var total = 0.0;
    for (var i = 0; i < 48; i++) {
      let f = (f32(i) + 0.5) / 48.0;
      let a = f32(i) * 2.399963;
      let w = 1.0 - f * 0.75;
      glow += tap(in.uv + vec2f(cos(a), sin(a)) * sqrt(f) * 0.03).rgb * w;
      total += w;
    }
    glow /= total;

    // a faint halo of moonlight just off the limb
    var halo = 0.0;
    if (d > 0.97) { halo = 0.16 * exp(-(d - 0.97) * 9.0); }

    var color = mid.rgb * 1.1 + glow * 1.15 + SHINE * halo;

    // on an HDR display, push the brightest parts past ordinary white
    let peak = max(color.r, max(color.g, color.b));
    color *= 1.0 + (params.gain - 1.0) * smoothstep(0.25, 0.9, peak);

    // premultiplied output; colour above alpha adds light over the stars
    return vec4f(color, clamp(max(mid.a, peak), 0.0, 1.0));
  }`;

async function startShader() {
  if (!navigator.gpu) return null;
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return null;
  const device = await adapter.requestDevice();
  const module = device.createShaderModule({ code: SHADER });
  const pipeline = await device.createRenderPipelineAsync({
    layout: 'auto',
    vertex: { module, entryPoint: 'vertex' },
    fragment: { module, entryPoint: 'fragment', targets: [{ format: 'rgba16float' }] },
    primitive: { topology: 'triangle-list' },
  });
  return { device, pipeline };
}

/* -- putting it on screen -- */
let paint = null;                 // draws the Moon; set once a renderer is chosen
let rebuild = null;               // sizes that renderer's canvases to the box
let showing = false;              // whether the Moon can be seen, and so is being drawn

// With reduced motion the Moon holds still, redrawn once a second only so a
// GPU canvas cannot be left blank.
const frame = now => paint(reducedMotion.matches ? 0 : now / 1000);
const moving = every(FRAME_MS, frame), still = every(1000, frame);

// start drawing afresh at the pace motion allows, or stop
function pace() {
  moving.stop();
  still.stop();
  if (showing) (reducedMotion.matches ? still : moving).start();
}

// draw only while the Moon can be seen, that is until day has faded it out
function show() {
  const visible = sky.day < 1;
  if (visible !== showing) { showing = visible; pace(); }
}

// one frame straight away, for when the picture itself has changed
function redraw() {
  if (showing) frame(performance.now());
}

// Fit the Moon to its box. This is asked whenever the size may have changed,
// but the cells, the canvas and the GPU's texture are only rebuilt if it has.
function fit() {
  const width = box.clientWidth;
  const across = Math.max(2, Math.round(width * Math.min(devicePixelRatio, 2)));
  if (width === side && across === pixels) return;
  side = width;
  pixels = across;
  layoutCells();
  rebuild();
  redraw();
}

// plain renderer: the characters straight onto the visible canvas
function useCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  rebuild = () => { canvas.width = canvas.height = pixels; };
  paint = seconds => drawGlyphs(ctx, seconds);
  box.replaceChildren(canvas);
  box.classList.add('flat');
}

// shader renderer: characters onto a hidden canvas, then through the GPU
function useShader({ device, pipeline }) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgpu');
  const glyphCanvas = document.createElement('canvas');
  const glyphCtx = glyphCanvas.getContext('2d');
  const uniforms = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
  let texture = null, bindGroup = null;

  // Set up the canvas for the display it is on. The configuration survives a
  // resize, so this is only asked again when the display's range changes.
  function configure() {
    const wanted = hdrDisplay.matches ? 'extended' : 'standard';
    context.configure({
      device, format: 'rgba16float', alphaMode: 'premultiplied',
      colorSpace: 'display-p3', toneMapping: { mode: wanted },
    });
    // browsers without HDR canvases quietly keep "standard"; ask what we got
    const extended = wanted === 'extended' && context.getConfiguration().toneMapping?.mode === 'extended';
    device.queue.writeBuffer(uniforms, 0, new Float32Array([extended ? HDR_GAIN : 1, 0, 0, 0]));
  }

  function size() {
    canvas.width = canvas.height = glyphCanvas.width = glyphCanvas.height = pixels;
    if (texture) texture.destroy();
    texture = device.createTexture({
      size: [pixels, pixels], format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniforms } },
        { binding: 1, resource: sampler },
        { binding: 2, resource: texture.createView() },
      ],
    });
  }
  size();
  // Before anything is swapped: a browser whose WebGPU cannot make this kind
  // of canvas says so here, and the plain renderer carries on.
  configure();

  rebuild = size;
  paint = seconds => {
    drawGlyphs(glyphCtx, seconds);
    device.queue.copyExternalImageToTexture({ source: glyphCanvas }, { texture, premultipliedAlpha: true }, [pixels, pixels]);
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store',
      }],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
  };

  // e.g. the window moved to another display: its range, and perhaps its pixels, are different
  hdrDisplay.addEventListener('change', () => { fit(); configure(); redraw(); });
  device.lost.then(() => { useCanvas(); rebuild(); redraw(); });   // fall back if the GPU goes away
  box.replaceChildren(canvas);
  box.classList.remove('flat');
  redraw();
}

useCanvas();                                         // show something at once
fit();
startShader().then(gpu => { if (gpu) useShader(gpu); }).catch(() => {});

new ResizeObserver(fit).observe(box);
addEventListener('resize', fit);                     // a zoom can change the pixels under the box but not its size
reducedMotion.addEventListener('change', pace);
document.fonts.load('700 16px ' + FONT, RAMP).then(redraw, () => {});   // the first frames may come before the font

watch(show);                                         // day fades the Moon out; night brings it back
