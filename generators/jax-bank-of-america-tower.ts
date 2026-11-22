/**
 * Bank of America Tower (Barnett Center until 1998), Jacksonville — original
 * procedural geometry, CC0-1.0.
 * bun generators/jax-bank-of-america-tower.ts
 *
 * Completed 1990; 188 m, 42 floors; Jacksonville's tallest building. A square
 * shaft with its four corners cut back at 45°, faced in grey granite. Each
 * main face carries a projecting bay of gridded glass in a granite frame,
 * banded every few floors; the cut corners, and the short strips of face
 * either side of each bay, are wrapped in horizontal ribbons of blue glass
 * and granite. The bays stop at 148 m, and above them the top four floors
 * of every face sit back behind a deep framed opening. A stepped octagonal
 * pyramid of four blue-grey glazed tiers caps the shaft, starting at its edge,
 * with a red beacon on its tip. A
 * grey granite podium of three to six storeys, with lattice-glazed windows
 * and blue glass bands, wraps the west, north and south sides.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 13.8:
 * the OSM outline's edges run 13.8° clockwise of the compass and are
 * axis-aligned to within 0.3 m in this frame. Origin = centroid of the
 * outline way/326777449 (lng -81.65998929, lat 30.32708399), so the tower
 * itself stands east of the origin, centred on (21.95, 1.2).
 *
 * Evidence
 * - OSM way/326777449 (outline, building=office, "Bank of America Tower")
 *   and its building:part ways 591258323-591258337, read in this frame:
 *   · 591258324 (164 m, 41 levels): the shaft, x -0.9..44.8, y -22..24.4,
 *     a square with 45° corner cuts of ~7.6 m legs;
 *   · 591258325-328 (148 m): 1.1-1.9 m deep, 22.2-22.5 m wide strips centred
 *     on each face: the projecting bays;
 *   · 591258323 (188 m, roof:shape=pyramidal, roof:height 24): the pyramid,
 *     an octagon of half-width ~17.4 m with ~6 m corner cuts, on the shaft;
 *   · 591258329, 591258336 (24 m): the north-east and south-east corner
 *     cuts filled to 24 m; 591258332 (24 m): the six-storey podium west of
 *     the shaft; 591258333 (20 m) and 591258334 (16 m): its south-west wing;
 *     591258330, 591258331, 591258335, 591258337 (12 m): three-storey strips
 *     along the north and south sides and at the east corners.
 *   The north, east and south bays reach the ground between podium strips;
 *   the west one starts on the podium roof.
 * - Published (Wikipedia "Bank of America Tower (Jacksonville)", Emporis/
 *   CTBUH figures quoted there): 188 m (617 ft), 42 floors, completed 1990,
 *   built as the Barnett Center. Matches the OSM tags; no lidar was read.
 * - Mapterhorn terrain: rises ~3 m from the south-west corner to the north
 *   side; y = 0 is the low south side, elevation 0.
 * - Photos (Wikimedia Commons):
 *   · "Bank of America Tower Jacksonville1.jpg", Rob Bixby, CC BY 2.0 (from
 *     below, a main face and a banded corner in low sun),
 *     https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_Jacksonville1.jpg
 *   · "BOATowerJacksonville-Feb2010-b.JPG", LoneStarMike, CC BY-SA 3.0 (from
 *     below: gridded bays, banded corners, the top opening),
 *     https://commons.wikimedia.org/wiki/File:BOATowerJacksonville-Feb2010-b.JPG
 *   · "BOATJAX.jpg", Mathew105601, CC BY-SA 4.0 (the whole tower from the
 *     west-north-west street: pyramid, top openings, bays and corner bands),
 *     https://commons.wikimedia.org/wiki/File:BOATJAX.jpg
 *   · "BOATowerJacksonville-Feb2010-c.JPG", LoneStarMike, CC BY-SA 3.0 (the
 *     podium at street level: grey granite, lattice glazing, blue bands),
 *     https://commons.wikimedia.org/wiki/File:BOATowerJacksonville-Feb2010-c.JPG
 *   · "Jacksonville, Florida skyline.jpg", Matthew T Rader, CC BY-SA 4.0
 *     (night, from the south bank: pyramid dark with faintly lit hips, the
 *     top opening and office floors lit),
 *     https://commons.wikimedia.org/wiki/File:Jacksonville,_Florida_skyline.jpg
 *
 * Measured: none (no lidar). From OSM: plan, the bay widths and depths, and
 * all heights (shaft 164, bays 148, pyramid 164-188, podium 24/20/16/12).
 * Published: total height, floor count. Estimated from the photos: the
 * opening above the bays (148.4-162 m, 1.5 m deep behind 1.3 m granite jambs);
 * the three-floor grouping of the bay grid (four lights across, 12 m groups);
 * the corner ribbons drawn two floors to a band (the real ones are one floor
 * each; grouped so they don't shimmer at phone size); the podium window
 * bands. Invented: none beyond simplification.
 *
 * Colours: granite is mid grey with a little warmth in the photos (the
 * assignment's "pinkish-tan" is the evening light in the Bixby photo), pulled
 * light; the corner ribbons a strong blue, the bay grid a paler blue-grey;
 * the crown tiers a blue-grey close to the tower glass (revised at lead review
 * from a smooth pale-green pyramid; BOATJAX.jpg shows four stepped tiers).
 *
 * Night: bay grids and corner ribbons are `window*` (lit offices); the
 * crown is `glass` and stays dark, with its tier lips floodlit as in the
 * night photo.
 *
 * Doubts: the east and south faces are seen only at a slant; the bay grid's
 * real light count (about six across) is drawn as four; the podium's
 * lattice windows are plain panels; the red beacon is left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 13.8
const ANCHOR = { lng: -81.65998929, lat: 30.32708399 }

type XY = [number, number]

const granite = new Part(), roof = new Part(), ribbon = new Part(), grid = new Part(), pyr = new Part(), trim = new Part()

// ─── solids, kept so facade panels can skip faces buried against a neighbour ───
type Solid = { poly: XY[]; z1: number }
const solids: Solid[] = []
function pointIn(poly: XY[], x: number, y: number) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const buried = (x: number, y: number, z: number) => solids.some((s) => z < s.z1 && pointIn(s.poly, x, y))

/** Ear-clipping triangulation of a simple polygon, counter-clockwise from above. */
function capPoly(part: Part, poly: XY[], z: number) {
  const idx = poly.map((_, i) => i)
  const area = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => area(a, b, p) > 1e-9 && area(b, c, p) > 1e-9 && area(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (area(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) part.tri([...poly[idx[0]], z] as V3, [...poly[idx[1]], z] as V3, [...poly[idx[2]], z] as V3)
}

/** A face along a→b (counter-clockwise ring, so outward is to the right). */
function face(a: XY, b: XY) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l
  const at = (s: number, z: number, out = 0.06): V3 => [a[0] + ux * s + uy * out, a[1] + uy * s - ux * out, z]
  const panel = (p: Part, s0: number, s1: number, z0: number, z1: number, out = 0.06) => {
    const m = at((s0 + s1) / 2, (z0 + z1) / 2, 1.0)
    if (buried(m[0], m[1], m[2])) return
    p.quad(at(s0, z0, out), at(s1, z0, out), at(s1, z1, out), at(s0, z1, out))
  }
  return { l, at, panel }
}

/** A prism over a simple ring with a plain top (podium blocks). */
function block(poly: XY[], z0: number, z1: number) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    granite.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  capPoly(roof, poly, z1)
  solids.push({ poly, z1 })
}

/** A convex ring lofted with a bevel at the top and capped. */
function bevelPrism(ringAt: (inset: number, z: number) => V3[], z0: number, z1: number, bev: number, top: Part) {
  granite.loft([ringAt(0, z0), ringAt(0, z1 - bev), ringAt(bev, z1)])
  top.cap(ringAt(bev, z1), true)
}
const boxRing = (x0: number, x1: number, y0: number, y1: number) => (e: number, z: number): V3[] => [
  [x0 + e, y0 + e, z], [x1 - e, y0 + e, z], [x1 - e, y1 - e, z], [x0 + e, y1 - e, z],
]
const R2 = Math.SQRT2
/** Chamfered square about (cx, cy): half-width h, corner-cut legs c; counter-clockwise from the south face. */
const octRing = (cx: number, cy: number, h: number, c: number) => (e: number, z: number): V3[] => {
  const H = h - e, C = c - e * (2 - R2)
  return [
    [cx - H + C, cy - H, z], [cx + H - C, cy - H, z], [cx + H, cy - H + C, z], [cx + H, cy + H - C, z],
    [cx + H - C, cy + H, z], [cx - H + C, cy + H, z], [cx - H, cy + H - C, z], [cx - H, cy - H + C, z],
  ]
}

// ─── podium (OSM parts, regularised) ───
const PODIUM: [XY[], number][] = [
  [[[-42.5, 0.6], [-21.4, 0.6], [-21.4, -21.6], [8, -21.6], [8, 24.4], [-42.5, 24.4]], 24], // 591258332
  [[[-35, -24], [-21.4, -24], [-21.4, 0.6], [-35, 0.6]], 20], // 591258333
  [[[-45.7, -33.3], [-35, -33.3], [-35, 0.8], [-45.7, 0.8]], 16], // 591258334 (west limb)
  [[[-35, -33.3], [-24.1, -33.3], [-24.1, -29.9], [-21.4, -29.9], [-21.4, -24], [-35, -24]], 16], // 591258334 (south limb)
  [[[-21.4, -25.9], [10.2, -25.9], [10.2, -21.6], [-21.4, -21.6]], 12], // 591258335
  [[[-42.5, 24.4], [8, 24.4], [8, 25.0], [10.7, 25.0], [10.7, 28.8], [-42.5, 28.8]], 12], // 591258331
  [[[33.0, 12.2], [49.1, 12.2], [49.1, 28.4], [33.0, 28.4]], 12], // 591258330
  [[[32.6, -26.4], [48.8, -26.4], [48.8, -10.4], [32.6, -10.4]], 12], // 591258337
  [[[37.4, 17.4], [44.9, 17.4], [44.9, 24.2], [37.4, 24.2]], 24], // 591258329, the north-east corner cut
  [[[35.9, -21.8], [44.9, -21.8], [44.9, -13.9], [35.9, -13.9]], 24], // 591258336, the south-east corner cut
]

// ─── tower ───
const TC: XY = [21.95, 1.2], H = 23.0, C = 7.6
const SHAFT_TOP = 164, BAY_TOP = 148, BAY_HALF = 11.1, BAY_DEPTH = 1.5
const shaft = octRing(TC[0], TC[1], H, C)
solids.push({ poly: shaft(0, 0).map((p) => [p[0], p[1]] as XY), z1: SHAFT_TOP })
for (const [poly, z] of PODIUM) block(poly, 0, z)

bevelPrism(shaft, 0, SHAFT_TOP, 0.6, roof)

const ring0 = shaft(0, 0).map((p) => [p[0], p[1]] as XY)
const FLAT = 2 * H - 2 * C // main-face width between the corner cuts
const S0 = FLAT / 2 - BAY_HALF, S1 = FLAT / 2 + BAY_HALF // the bay's span along its face
const RIB0 = 24, RIB_P = 8, RIB_G = 5.4 // corner ribbons: two floors to a band, 5.4 m of glass

for (let i = 0; i < 8; i++) {
  const a = ring0[i], b = ring0[(i + 1) % 8], f = face(a, b)
  const main = i % 2 === 0
  // Corner ribbons: the whole cut corner, and on a main face the strips either side of the bay.
  const SLOT = 1.4 // a full-height dark glass reveal beside each bay
  const spans: [number, number][] = main ? [[0, S0 - SLOT], [S1 + SLOT, f.l]] : [[0, f.l]]
  for (const [s0, s1] of spans)
    for (let z = RIB0 + 1.6; z + RIB_G < SHAFT_TOP - 1; z += RIB_P) f.panel(ribbon, s0 + (s0 === 0 ? 0.15 : 0), s1 - (s1 === f.l ? 0.15 : 0), z, z + RIB_G)
  if (!main) continue
  f.panel(ribbon, S0 - SLOT, S0, RIB0 + 0.5, SHAFT_TOP - 1.2)
  f.panel(ribbon, S1, S1 + SLOT, RIB0 + 0.5, SHAFT_TOP - 1.2)

  // The projecting bay, from the ground (or the podium) to 148 m.
  const n: XY = [(b[1] - a[1]) / f.l, -(b[0] - a[0]) / f.l]
  const p0 = f.at(S0, 0, 0), p1 = f.at(S1, 0, BAY_DEPTH)
  const x0 = Math.min(p0[0], p1[0]), x1 = Math.max(p0[0], p1[0]), y0 = Math.min(p0[1], p1[1]), y1 = Math.max(p0[1], p1[1])
  const mid = f.at(f.l / 2, 0, 3)
  const base = buried(mid[0], mid[1], 1) ? 24 : 0
  bevelPrism(boxRing(x0, x1, y0, y1), base, BAY_TOP, 0.5, granite)
  // The bay's outer face: four lights across, three floors to a group, in a granite frame.
  const bayA: XY = [p0[0] + n[0] * BAY_DEPTH, p0[1] + n[1] * BAY_DEPTH]
  const bayB: XY = [f.at(S1, 0, BAY_DEPTH)[0], f.at(S1, 0, BAY_DEPTH)[1]]
  const bf = face(bayA, bayB)
  const FR = 1.0, PIER = 0.45, COLS = 5, cw = (bf.l - 2 * FR - (COLS - 1) * PIER) / COLS
  for (let g = 24; g + 12 <= BAY_TOP; g += 12)
    for (let k = 0; k < COLS; k++) {
      const s0 = FR + k * (cw + PIER)
      bf.panel(grid, s0, s0 + cw, g + 1.0, g + 11.2)
    }
  if (base === 0) {
    // Glazed lobby at the foot of the bay.
    for (let k = 0; k < COLS; k++) {
      const s0 = FR + k * (cw + PIER)
      bf.panel(grid, s0, s0 + cw, 0.4, 9.5)
    }
    bf.panel(grid, FR, bf.l - FR, 13.5, 22.5)
  }
  // Above the bay: the top floors behind a deep opening, framed by granite jambs and a lintel.
  const J = 1.3, OPEN_TOP = 162
  for (const [s0, s1] of [[S0, S0 + J], [S1 - J, S1]] as [number, number][]) {
    const q0 = f.at(s0, 0, 0), q1 = f.at(s1, 0, BAY_DEPTH)
    bevelPrism(boxRing(Math.min(q0[0], q1[0]), Math.max(q0[0], q1[0]), Math.min(q0[1], q1[1]), Math.max(q0[1], q1[1])), BAY_TOP - 1, SHAFT_TOP, 0.4, granite)
  }
  {
    const q0 = f.at(S0, 0, 0), q1 = f.at(S1, 0, BAY_DEPTH)
    bevelPrism(boxRing(Math.min(q0[0], q1[0]), Math.max(q0[0], q1[0]), Math.min(q0[1], q1[1]), Math.max(q0[1], q1[1])), OPEN_TOP, SHAFT_TOP, 0.4, granite)
  }
  f.panel(ribbon, S0 + J, S1 - J, BAY_TOP + 0.3, OPEN_TOP - 0.2)
}

// Podium facades: lattice-glazed lower windows and a blue band under the parapet.
for (const [poly, z1] of PODIUM) {
  for (let i = 0; i < poly.length; i++) {
    const f = face(poly[i], poly[(i + 1) % poly.length])
    if (f.l < 3) continue
    const bays = Math.max(1, Math.round(f.l / 7.5)), bw = f.l / bays
    for (let k = 0; k < bays; k++) {
      const s0 = k * bw + 0.9, s1 = (k + 1) * bw - 0.9
      f.panel(grid, s0, s1, 1.2, 9.6)
      if (z1 >= 16) f.panel(ribbon, s0, s1, 12, z1 - (z1 > 20 ? 9 : 2.2))
      if (z1 > 20) f.panel(ribbon, s0, s1, z1 - 6.6, z1 - 2.2)
    }
  }
}

// ─── the stepped pyramid, 164-188 m ───
// Four glazed tiers stepping in (BOATJAX.jpg): each a sloped band of blue-grey
// glass, then a short upright lip, then a narrow ledge; the top tier runs to
// the 188 m tip. The first tier starts at the shaft's own edge, so the crown
// reads as the shaft continuing. The lips are floodlit at night.
{
  const oct = (h: number, z: number) => octRing(TC[0], TC[1], h, h * (C / H))(0, z)
  // [half-width at foot, z at foot, half-width at head, z at head]
  const TIERS: [number, number, number, number][] = [
    [22.4, SHAFT_TOP, 17.4, 169.6],
    [16.6, 170.8, 12.4, 175.6],
    [11.6, 176.8, 7.6, 181.4],
    [6.8, 182.6, 0, 188],
  ]
  const LIP = 1.2
  for (const [h0, z0, h1, z1] of TIERS) {
    if (h1 === 0) {
      const r = oct(h0, z0), apex: V3 = [TC[0], TC[1], z1]
      for (let i = 0; i < 8; i++) pyr.tri(r[i], r[(i + 1) % 8], apex)
      continue
    }
    pyr.loft([oct(h0, z0), oct(h1, z1)])
    trim.loft([oct(h1, z1), oct(h1, z1 + LIP)])
  }
  // the ledges between tiers
  for (let k = 0; k < TIERS.length - 1; k++) {
    const [, , h1, z1] = TIERS[k], [h0] = TIERS[k + 1]
    const o = oct(h1, z1 + LIP), n = oct(h0, z1 + LIP)
    for (let i = 0; i < 8; i++) pyr.quad(n[i], o[i], o[(i + 1) % 8], n[(i + 1) % 8])
  }
  // a short finial mast for the beacon
  const m = 0.35
  trim.loft([
    [[TC[0] - m, TC[1] - m, 186], [TC[0] + m, TC[1] - m, 186], [TC[0] + m, TC[1] + m, 186], [TC[0] - m, TC[1] + m, 186]],
    [[TC[0] - m, TC[1] - m, 190], [TC[0] + m, TC[1] - m, 190], [TC[0] + m, TC[1] + m, 190], [TC[0] - m, TC[1] + m, 190]],
  ])
}

const parts = [
  { part: granite, material: finish('boa-jax-granite', 0xbdbab6) },
  { part: roof, material: PALETTE.roof },
  { part: ribbon, material: { ...PALETTE.window, color: 0x5f7fa6 } },
  { part: grid, material: windowVariant(2, 0x7591b3) },
  { part: pyr, material: { ...PALETTE.glass, color: 0x7890a8 } },
  { part: trim, material: { ...PALETTE.trim, color: 0xaebac6, floodlight: () => 0.8 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 190,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/326777449', ...Array.from({ length: 15 }, (_, i) => `way/${591258323 + i}`)],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-bank-of-america-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
