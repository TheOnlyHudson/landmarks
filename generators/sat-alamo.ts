/**
 * The Alamo: the church of Mission San Antonio de Valero, Alamo Plaza, San
 * Antonio, Texas (begun 1744, this church 1756 onward, never finished; the
 * humped parapet added by the U.S. Army c. 1847-1850). A cross-shaped
 * limestone church with flat-topped rubble walls about 7 m high; on the west
 * front the famous curved parapet, its round hump over concave flanks and
 * stepped shoulders; the carved two-tier retablo round the arched door, four
 * columns on pedestals with shell-headed niches between them, an entablature,
 * and over it two more niches either side of the choir window; small square
 * windows in the plain front block. The transept ends and the chancel's east
 * end rise in segmental arches over the low barrel roofs behind them.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-alamo.ts
 *
 * Frame: bearing 9.5 (the facade line, from OSM). +x runs down the nave
 * towards the altar (east-south-east); the facade faces -x (west). +y is the
 * model's north. x right, y up the page, z up, metres. Origin at the anchor
 * -98.486104, 29.425701, on the nave's axis at mid-length.
 *
 * Ground: the plaza is nearly flat (Mapterhorn, 0.1-0.8 m across the
 * footprint, lowest at the north-west corner); y = 0 is that lowest ground,
 * and the walls run down to it. Elevation 0.
 *
 * Evidence
 * - OSM way/92060042 (building=church, "Alamo Church", building:levels=2), in
 *   this frame: the front block x -16..-10.5, y -9.4..9.4; the nave behind it
 *   y -5.1..5.1; the transept x 1.8..11.3 (south arm), 2.8..11.3 (north arm),
 *   y -8.5..8.7; the chancel x 11.3..16.1, y -4.5..5.9; the sacristy and the
 *   monks' burial ground on the north, x -10.7..2.8, out to y 12.2-13.3 on a
 *   slanting wall. Its building:parts way/1489925161-1489925166 are the
 *   facade parapet in steps across y -5.1..4.9: 7.6, 7.9, 8.5 (skillion),
 *   8.9 and the hump 9.8 m (roof:shape round). The model is symmetric about
 *   y = 0 where OSM is within 0.7 m of it (the chancel, -4.5..5.9 in OSM, is
 *   drawn -5.1..5.1, the HABS plan centres it on the nave).
 * - HABS TX-318 (HABS TEX,15-SANT,15-), measured drawings 1961, sheets 2-8
 *   (Library of Congress, public domain), via Wikimedia Commons:
 *   sheet 2 plan: facade 62'-11 3/8" (19.2 m), length 98'-1" inside / 105'-8"
 *   overall, transept 56'-4 1/2" (17.2 m), nave 25'-3" inside, door 6'-7 3/8";
 *   sheet 3 west elevation: wall top 22'-7 1/2" to 22'-9 3/4" over a floor 4"
 *   above the plaza (7.0 m); the parapet profile read off the drawing at
 *   10.4 px/ft: shoulders 7.7 m over the middle 10 m, a step to 8.0 at
 *   +-3.8 m, concave flanks rising to 9.1 at +-1.1 m, the hump a half round
 *   of r 1.0-1.1 to 10.1 m; the retablo, the niches and the four windows;
 *   sheet 3 east elevation and sheet 4 north and south elevations: the
 *   chancel and transept ends with segmental tops to about 28'-6" (8.7 m),
 *   the windows on each side (cut c. 1847-48) at the heights used below.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, 0.5 m grid
 *   (~/landmarks-scratch/sat-alamo/lidar.json): walls 6.8-7.1 m over the
 *   plaza everywhere; the roof behind them rises to 8.6-8.9 m on the nave's
 *   axis and on the transept's (x 7-8), falling to 7.0-7.3 at the walls, so
 *   a low vault-shaped roof, drawn here as segmental barrels.
 * - USGS NAIP: the pale grey roof over the whole church.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "Alamo pano.jpg" (Daniel Schwen, CC BY-SA 4.0): the front face-on; the
 *     parapet profile checked against HABS on it at 36.8 px/m (hump to 10.3,
 *     flanks from 8.2 at +-2.8 to 9.3 at +-1.1, shoulders 7.9), the column,
 *     niche and window positions below;
 *   "The Alamo, San Antonio, Texas (50296783352).jpg" (Nicolas Henderson,
 *     CC BY 2.0): the front from the south-west, the front block's depth;
 *   "The alamo from the side.jpg" (Ttc39, CC BY-SA 4.0) and
 *   "San Antonio, Texas (2018) - 018.jpg" (Another Believer, CC BY-SA 4.0):
 *     the north side of the front block and the retablo in depth;
 *   "San Antonio, Texas (2018) - 024.jpg" and "- 030.jpg" (Another Believer,
 *     CC BY-SA 4.0): a transept end's round-topped gable from the garden;
 *   HABS TEX,15-SANT,15-11 (Arthur W. Stewart, 1936, public domain): the
 *     south side and east end;
 *   "The Alamo (facade).jpg" (Abbie Myers, CC BY-SA 4.0) and "Facade of the
 *     Alamo.jpg" (Rob McBryde, CC BY 3.0): the retablo's columns and niches;
 *   "Alamo Mission Chapel at night.jpg" (JLHtexas, CC BY-SA 4.0) and "The
 *     Alamo at Night.jpg" (Emiranda77, CC BY-SA 4.0): the floodlit front,
 *     its windows dark.
 *
 * Bolder than measured, for phone size: the hump is r 1.15 (to 10.35 m, the
 * photo's height, not HABS's 10.1) and the flanks rise from 8.2 so the
 * profile reads at 80 px; the retablo columns are 0.56 m across against about
 * 0.45 and stand 0.5 m proud.
 *
 * Night: the front is floodlit from the plaza (the night photos), the other
 * walls dimly; the windows are dark (a dark recess, not `window`).
 *
 * Not modelled: the Long Barrack (way/100052478), a separate building 15 m
 * north-west; it keeps its own OSM extrusion. The low garden walls, the
 * carved detail inside the retablo (shells, spiral flutes, the keystone), the
 * window bars, and HABS's small lantern on the roof, which no photo or the
 * lidar shows.
 *
 * Doubts: the roof's exact shape between the lidar samples; the north rooms'
 * slanting wall is from OSM only; the window list on the sides and east end
 * is from the 1961 HABS drawings, no recent photo shows the east end.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, report, writeGlb, type XY } from './sf-de-young'
import { panel, arched, cyl, box } from './sf-opera-house'

const stone = new Part(), carve = new Part(), roof = new Part(), dark = new Part(), wood = new Part()

/** A quad wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A closed counter-clockwise ring with its long edges split to 5 m, for the terrain. */
function split(r: XY[], max = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max)
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  })
  return out
}

// ---------------------------------------------------------------------------
// The body: one cross-shaped block of rubble limestone, flat-topped at 7 m,
// from the OSM outline (squared up and centred on the nave's axis).
const H = 7.0
const PLAN: XY[] = [
  [-16, -9.5], [-10.5, -9.5], [-10.5, -5.1], [1.8, -5.1], [1.8, -8.6], [11.3, -8.6], [11.3, -5.1], [16.1, -5.1],
  [16.1, 5.1], [11.3, 5.1], [11.3, 8.6], [2.8, 8.6], [2.8, 12.2], [-10.7, 13.3], [-10.7, 9.5], [-16, 9.5],
]
prism(stone, split(PLAN), 0, H, roof)
// A thin coping round the top, so the flat walls end in a soft edge.
{
  const r = PLAN, n = r.length
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n]
    const d: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1])
    const o: XY = [d[1] / l, -d[0] / l] // outward for a ccw ring
    qf(stone, [a[0], a[1], H - 0.35], [b[0], b[1], H - 0.35], [b[0] + o[0] * 0.12, b[1] + o[1] * 0.12, H - 0.2], [a[0] + o[0] * 0.12, a[1] + o[1] * 0.12, H - 0.2], [o[0], o[1], -0.6])
    qf(stone, [a[0] + o[0] * 0.12, a[1] + o[1] * 0.12, H - 0.2], [b[0] + o[0] * 0.12, b[1] + o[1] * 0.12, H - 0.2], [b[0], b[1], H], [a[0], a[1], H], [o[0], o[1], 0.6])
  }
}

// ---------------------------------------------------------------------------
// Roofs: low segmental barrels over the nave and chancel (along x) and the
// transept (along y), rising 1.7 m over the wall tops (lidar 8.6-8.9).
const RISE = 1.7
/** Height of a segmental barrel of half-width w at offset u from its axis. */
function barrel(u: number, w: number, rise = RISE) {
  const R = (w * w + rise * rise) / (2 * rise)
  return H + Math.sqrt(Math.max(0, R * R - u * u)) - (R - rise)
}
const SEG = 10
function barrelX(x0: number, x1: number, w: number) {
  for (let i = 0; i < SEG; i++) {
    const u0 = -w + (2 * w * i) / SEG, u1 = -w + (2 * w * (i + 1)) / SEG
    qf(roof, [x0, u0, barrel(u0, w)], [x1, u0, barrel(u0, w)], [x1, u1, barrel(u1, w)], [x0, u1, barrel(u1, w)], [0, -(u0 + u1) / 2 / w, 1])
  }
}
function barrelY(y0: number, y1: number, xc: number, w: number) {
  for (let i = 0; i < SEG; i++) {
    const u0 = -w + (2 * w * i) / SEG, u1 = -w + (2 * w * (i + 1)) / SEG
    qf(roof, [xc + u0, y0, barrel(u0, w)], [xc + u0, y1, barrel(u0, w)], [xc + u1, y1, barrel(u1, w)], [xc + u1, y0, barrel(u1, w)], [-(u0 + u1) / 2 / w, 0, 1])
  }
}
barrelX(-15.0, 15.6, 5.1)
const TX = 6.8, TW = 4.5 // the transept's axis and half-width
barrelY(-8.1, 8.1, TX, TW)

/**
 * An end wall's round top: a slab on the wall from H up to a segmental arch
 * 0.3 m over the roof behind it, with short level shoulders at the corners.
 * `along` is the wall's direction, `out` its outward normal; c its centre.
 */
function archTop(c: XY, along: XY, out: XY, w: number, t = 0.55) {
  const N = 12, pts: [number, number][] = [[-w, H], [-w, H + 0.3]]
  for (let i = 0; i <= N; i++) {
    const u = -w + 0.35 + ((2 * w - 0.7) * i) / N
    pts.push([u, barrel(u, w - 0.35, RISE) + 0.3])
  }
  pts.push([w, H + 0.3], [w, H])
  const P = (u: number, z: number, d: number): V3 => [c[0] + along[0] * u - out[0] * d, c[1] + along[1] * u - out[1] * d, z]
  const o3: V3 = [out[0], out[1], 0], i3: V3 = [-out[0], -out[1], 0]
  for (let k = 1; k < pts.length - 2; k++) {
    const [u0, z0] = pts[k], [u1, z1] = pts[k + 1]
    if (Math.abs(u1 - u0) > 1e-6) {
      qf(stone, P(u0, H, 0), P(u1, H, 0), P(u1, z1, 0), P(u0, z0, 0), o3)
      qf(stone, P(u0, H, t), P(u1, H, t), P(u1, z1, t), P(u0, z0, t), i3)
    }
    const up: V3 = [0, 0, 1]
    qf(stone, P(u0, z0, 0), P(u1, z1, 0), P(u1, z1, t), P(u0, z0, t), Math.abs(u1 - u0) > 1e-6 ? up : [along[0] * Math.sign(u0), along[1] * Math.sign(u0), 0])
  }
  // the short risers at each end
  for (const s of [-1, 1]) qf(stone, P(s * w, H, 0), P(s * w, H + 0.3, 0), P(s * w, H + 0.3, t), P(s * w, H, t), [along[0] * s, along[1] * s, 0])
}
archTop([6.55, -8.6], [1, 0], [0, -1], 4.75) // transept, south end
archTop([7.05, 8.6], [1, 0], [0, 1], 4.25) // transept, north end (the arm is 1 m narrower)
archTop([16.1, 0], [0, 1], [1, 0], 5.1) // chancel, east end

// ---------------------------------------------------------------------------
// The west front's parapet: the round hump on concave flanks, stepped
// shoulders, over the middle 10 m of the facade (HABS sheet 3, the pano).
const FX = -16, FT = 1.2
const CREST: [number, number][] = (() => {
  const half: [number, number][] = [[5.0, H], [5.0, 7.85], [3.8, 7.85], [3.8, 8.2], [2.95, 8.2]]
  for (let i = 1; i <= 5; i++) { const t = i / 5, u = 2.95 - 1.65 * t; half.push([u, 8.2 + 1.05 * t * t]) }
  const r = 1.3
  for (let i = 1; i <= 8; i++) { const a = (Math.PI / 2) * (i / 8); half.push([r * Math.cos(a), 9.25 + r * Math.sin(a)]) }
  const left = half.map(([u, z]) => [-u, z] as [number, number])
  return [...left, ...half.slice(0, -1).reverse()]
})()
for (let k = 0; k < CREST.length - 1; k++) {
  const [u0, z0] = CREST[k], [u1, z1] = CREST[k + 1]
  if (Math.abs(u1 - u0) > 1e-6) {
    qf(stone, [FX, u0, H], [FX, u1, H], [FX, u1, z1], [FX, u0, z0], [-1, 0, 0])
    qf(stone, [FX + FT, u0, H], [FX + FT, u1, H], [FX + FT, u1, z1], [FX + FT, u0, z0], [1, 0, 0])
  }
  const n = cross([0, u1 - u0, z1 - z0], [1, 0, 0])
  qf(stone, [FX, u0, z0], [FX, u1, z1], [FX + FT, u1, z1], [FX + FT, u0, z0], [0, n[1], n[2]])
}

// ---------------------------------------------------------------------------
// The retablo round the door (the pano, HABS sheet 3): u is y on the facade.
const W: XY = [-1, 0]
const F = (y: number): XY => [FX, y]
// base course along the whole front
box(stone, FX - 0.15, FX, -9.5, 9.5, 0, 0.5)
// the door: dark oak leaves under a round head, in a carved stone surround
{
  const s = carve
  box(s, FX - 0.25, FX, -1.45, -1.0, 0, 2.3)
  box(s, FX - 0.25, FX, 1.0, 1.45, 0, 2.3)
  // archivolt: a ring of blocks round the head
  const n = 8, r0 = 1.0, r1 = 1.45, zs = 2.3
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    const p = (r: number, a: number, x: number): V3 => [x, -r * Math.cos(a), zs + r * Math.sin(a)]
    qf(s, p(r0, a0, FX - 0.25), p(r1, a0, FX - 0.25), p(r1, a1, FX - 0.25), p(r0, a1, FX - 0.25), [-1, 0, 0])
    qf(s, p(r1, a0, FX - 0.25), p(r1, a0, FX), p(r1, a1, FX), p(r1, a1, FX - 0.25), [0, -Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)])
    qf(s, p(r0, a0, FX), p(r0, a0, FX - 0.25), p(r0, a1, FX - 0.25), p(r0, a1, FX), [0, Math.cos((a0 + a1) / 2), -Math.sin((a0 + a1) / 2)])
  }
  arched(wood, F(-1.0), F(1.0), W, 0, 3.3, 0.04)
}
// four columns on square pedestals, with blocky capitals, standing proud
const COLS = [-3.6, -2.0, 2.0, 3.6]
for (const y of COLS) {
  box(carve, FX - 0.85, FX, y - 0.42, y + 0.42, 0, 1.35)
  cyl(carve, FX - 0.45, y, 0.28, 1.35, 3.75, 10, false)
  box(carve, FX - 0.85, FX, y - 0.42, y + 0.42, 3.75, 4.15)
}
// the entablature across the lower tier, and its cornice
box(carve, FX - 0.75, FX, -4.2, 4.2, 4.15, 4.6)
box(carve, FX - 0.95, FX, -4.4, 4.4, 4.6, 4.85, true)
// niches between the paired columns, lower and upper, with shell heads
for (const s of [-1, 1]) {
  const y = s * 2.8
  arched(dark, F(y - 0.4), F(y + 0.4), W, 1.55, 3.6, 0.04)
  // upper niche in a raised frame of pilasters
  box(carve, FX - 0.22, FX, y - 0.68, y + 0.68, 4.85, 7.0)
  arched(dark, [FX - 0.22, y - 0.42], [FX - 0.22, y + 0.42], W, 5.05, 6.75, 0.04)
}
// the choir window over the door in its own raised panel
box(carve, FX - 0.18, FX, -1.15, 1.15, 4.85, 7.0)
panel(dark, [FX - 0.18, -0.55], [FX - 0.18, 0.55], W, 5.2, 6.65, 0.04)

// four small square windows in the plain front, upper and lower
for (const s of [-1, 1]) {
  const y = s * 6.8
  panel(dark, F(y - 0.4), F(y + 0.4), W, 5.2, 6.5, 0.04)
  panel(dark, F(y - 0.38), F(y + 0.38), W, 2.6, 3.5, 0.04)
}

// ---------------------------------------------------------------------------
// The sides and east end: small deep windows where HABS shows them.
const S: XY = [0, -1], Nn: XY = [0, 1], E: XY = [1, 0]
const win = (A: XY, B: XY, n: XY, z0: number, z1: number) => panel(dark, A, B, n, z0, z1, 0.04)
// south: the nave (upper and lower), the transept arm, the chancel
for (const x of [-4.7]) { win([x - 0.5, -5.1], [x + 0.5, -5.1], S, 4.4, 6.0); win([x - 0.5, -5.1], [x + 0.5, -5.1], S, 1.4, 2.9) }
win([-0.6, -5.1], [0.2, -5.1], S, 5.6, 6.2)
win([TX - 0.5, -8.6], [TX + 0.5, -8.6], S, 4.4, 6.0)
win([TX - 0.5, -8.6], [TX + 0.5, -8.6], S, 1.4, 2.9)
win([13.3, -5.1], [14.0, -5.1], S, 5.5, 6.2)
// north: the transept arm (a window over a door), the sacristy rooms, the front block
win([TX + 0.5 - 0.5, 8.6], [TX + 0.5 + 0.5, 8.6], Nn, 4.4, 6.0)
panel(wood, [TX + 0.5 - 0.7, 8.6], [TX + 0.5 + 0.7, 8.6], Nn, 0, 2.4, 0.04)
for (const x of [-6.5, -1.5]) {
  const t = (x + 10.7) / 13.5, y = 13.3 - 1.1 * t, d: XY = [Math.cos(-0.0812), Math.sin(-0.0812)], n: XY = [-d[1], d[0]]
  panel(dark, [x - 0.45 * d[0], y - 0.45 * d[1]], [x + 0.45 * d[0], y + 0.45 * d[1]], n, 4.0, 5.3, 0.04)
}
win([-13.6, 9.5], [-12.8, 9.5], Nn, 4.6, 5.8)
// east: the chancel (two, one over the other), the transept arms' east walls
win([16.1, -0.55], [16.1, 0.55], E, 4.4, 6.0)
win([16.1, -0.55], [16.1, 0.55], E, 1.5, 3.0)

// ---------------------------------------------------------------------------
// Night: the plaza floodlights the west front (and the front block's corners
// a little); the other walls barely.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.08 : n[0] < -0.5 && p[0] < -14.5 ? 0.9 : p[0] < -10 ? 0.35 : 0.12)
const parts = [
  { part: stone, material: { ...finish('alamo-limestone', 0xe8dcc4), floodlight: lit } },
  { part: carve, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('alamo-recess', 0x5a5149) },
  { part: wood, material: finish('alamo-door', 0x6a4a36) },
]
const glb = writeGlb('The Alamo', parts, {
  license: 'CC0-1.0', bearing: 9.5, elevation: 0, anchor: [29.425701, -98.486104],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/92060042', 'way/1489925161', 'way/1489925162', 'way/1489925163', 'way/1489925164', 'way/1489925165', 'way/1489925166'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('The Alamo', parts, glb, 5000)
const out = new URL('../models/sat-alamo.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
