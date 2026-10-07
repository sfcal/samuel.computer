// Moon: the full Moon, near side facing, gently wobbling, as a sphere of text
// characters whose shades are read off a picture of its surface. Where the
// browser has WebGPU, a shader adds the glow.
import { reducedMotion, sky, smoothstep, watch } from '../sky.js';
import { every } from '../ticker.js';
import TEXTURE from '../../assets/moon.png?url';

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

// The surface is one picture: an equirectangular map of the Moon, made once
// from the surface model this file used to carry (27 maria as ragged ovals,
// 11 rayed craters and noise; it is in the file's git history). Red is
// brightness, green how much of the spot is mare, and blue that mare's tint,
// with 128 neutral, below bluish and above brownish. Nothing is drawn until
// the picture has arrived, so a cold visit at night shows the Moon a moment late.
let map = null;                   // the picture's pixels, once loaded: { width, height, data }

fetch(TEXTURE).then(r => r.blob())
  .then(blob => createImageBitmap(blob))           // the PNG is untagged and opaque, so it decodes as is
  .then(bitmap => {
    // an ordinary canvas rather than an OffscreenCanvas, for older Safari
    const { width, height } = bitmap;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();                                // the decoded bitmap is spent; only the pixels are kept
    map = { width, height, data: ctx.getImageData(0, 0, width, height).data };
    redraw();
  }).catch(() => {});                                // no picture, no Moon, as with a broken image

// The Moon's surface at a latitude and longitude (degrees): brightness 0 to 1,
// how much of the spot is mare, and that mare's tint, -1 to 1. Read off the
// picture between its four nearest texels; longitude wraps round, latitude
// stops at the poles.
function surface(lat, lon) {
  const { width, height, data } = map;
  const u = (lon / 360 + 0.5) * width - 0.5, v = (0.5 - lat / 180) * height - 0.5;
  const i0 = Math.floor(u), j0 = Math.floor(v), fu = u - i0, fv = v - j0;
  const ia = ((i0 % width) + width) % width, ib = (ia + 1) % width;
  const ja = Math.max(0, Math.min(height - 1, j0)), jb = Math.max(0, Math.min(height - 1, j0 + 1));
  const out = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const top = data[(ja * width + ia) * 4 + k] * (1 - fu) + data[(ja * width + ib) * 4 + k] * fu;
    const bottom = data[(jb * width + ia) * 4 + k] * (1 - fu) + data[(jb * width + ib) * 4 + k] * fu;
    out[k] = (top * (1 - fv) + bottom * fv) / 255;
  }
  out[2] = out[2] * 2 - 1;
  return out;
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
// GPU canvas cannot be left blank. Before the picture nothing is painted at
// all, not even the shader's halo, which would otherwise ring an empty sky.
const frame = now => { if (map) paint(reducedMotion.matches ? 0 : now / 1000); };
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

useCanvas();                                         // a renderer straight away; the GPU one takes over if it comes
fit();
startShader().then(gpu => { if (gpu) useShader(gpu); }).catch(() => {});

new ResizeObserver(fit).observe(box);
addEventListener('resize', fit);                     // a zoom can change the pixels under the box but not its size
reducedMotion.addEventListener('change', pace);
document.fonts.load('700 16px ' + FONT, RAMP).then(redraw, () => {});   // the first frames may come before the font

watch(show);                                         // day fades the Moon out; night brings it back
