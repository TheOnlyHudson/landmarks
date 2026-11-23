/**
 * 11 Hoyt, Downtown Brooklyn (Studio Gang, 2020) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-11-hoyt.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: area
 * centroid of the outer ring (way/248156314) of the OSM multipolygon
 * relation/13277947 (-73.984957, 40.689794).
 *
 * Evidence
 * - OSM: relation/13277947 (apartments, 52 levels, height 185), outer
 *   way/248156314 with three inner holes; the tower part way/700546409
 *   (185 m), a trapezoid about 49 m long, 18 m wide at the south end and
 *   29 m at the north; podium parts way/988348365 (6 m), way/988348368
 *   (10 m), way/1198532671 (6 m), way/988348364 (7 m), way/988348367
 *   (6.3 m) and way/988348366 (4.4 m).
 * - Published (Wikipedia, "11 Hoyt"): 57 storeys, about 620 ft (189 m),
 *   completed 2020, Studio Gang; precast concrete facade with scalloped
 *   bay windows in an undulating pattern; a private park on the podium.
 *   Roof here: 186.5 m at the bottom of the roof scallops (OSM gives 185),
 *   189 m at their peaks (published height).
 * - No lidar: USGS NY_NewYorkCity (2017) predates the tower.
 * - Terrain (Mapterhorn): flat within 1.5 m over the block.
 * - Photos (Wikimedia Commons, Kidfly182):
 *   - "11 Hoyt 001.jpg", "11 Hoyt 002.jpg", "11 Hoyt 005.jpg", CC BY-SA 4.0
 *   - "11 Hoyt 015.jpg", "11 Hoyt 019.jpg", "11 Hoyt 030.jpg", "11 Hoyt 036.jpg", CC BY 4.0
 *
 * Read from the photos (the identity): a pale warm-grey precast grid with
 * punched windows; bay windows two windows wide and three storeys tall
 * that flare out towards their foot and end in a curved pale sill, set in
 * columns that step up from one column to the next, so they make diagonal
 * waves across the faces; the roofline is scalloped, a row of shallow
 * concave arcs along every face. The podium is a dark perforated metal
 * screen (the garage) with planting on top.
 *
 * Estimated: bay pitch (3 m, counted in 001), storey height (3.15 m),
 * the bay windows' size, depth (1.6 m) and rhythm (every nine storeys in a
 * column, three storeys up from the previous column), the roof scallop
 * depth (2.5 m) and count per face (one per ~8 m, from 001, 030, 036). Bays are
 * drawn at a regular rhythm; the real ones vary.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, capPoly, area, type XY } from './nyc-570-lexington'

const concrete = new Part(), win = new Part(), screen = new Part(), roof = new Part(), garden = new Part()

// OSM coordinates were read about (-73.98535, 40.68979); shift to the anchor.
const O: XY = [33.2, 0.4]
const sh = (r: XY[]): XY[] => r.map(([x, y]) => [x - O[0], y - O[1]] as XY)

// Tower (way/700546409, simplified to its four corners), counter-clockwise.
const TOWER = sh([[16.9, -24.3], [32.7, -32.4], [60.2, 8.0], [34.0, 21.4]])
// Podium parts.
const PODIUM: [number, XY[]][] = [
  [6, sh([[13.9, -7.2], [13.6, -8.3], [14.5, -15.2], [14.9, -16.2], [15.6, -16.4], [16.2, -15.9], [16.7, -15.1], [18.8, -9.7], [21.7, -11.1], [16.9, -24.3], [32.7, -32.4], [50.9, -5.8], [51.6, -7.9], [53.0, -9.1], [55.3, -9.7], [57.6, -9.7], [60.1, -9.0], [66.8, -1.8], [66.9, 0.2], [70.6, -0.3], [78.0, -4.0], [76.2, -7.6], [54.8, -48.8], [-20.3, -10.4], [-11.8, 6.0]])],
  [10, sh([[66.9, 0.2], [70.6, -0.3], [78.0, -4.0], [83.4, 6.5], [64.2, 16.3], [67.0, 21.8], [66.3, 22.2], [60.3, 25.3], [57.4, 19.7], [38.5, 29.4], [15.2, 41.3], [8.3, 44.8], [2.9, 34.3], [16.9, 27.2], [19.4, 24.8], [24.4, 23.1], [28.5, 20.8], [30.7, 17.9], [31.4, 14.5], [34.0, 21.4], [60.2, 8.0], [56.7, 2.8], [59.4, 3.3], [63.0, 3.2], [66.0, 1.4]])],
  [6, sh([[-11.8, 6.0], [1.0, 30.7], [2.9, 34.3], [16.9, 27.2], [19.4, 24.8], [16.0, 24.3], [14.3, 23.2], [13.8, 22.6], [12.1, 19.5], [8.7, 9.7], [8.5, 6.5], [9.3, 4.0], [10.7, 2.2], [13.5, 0.5], [18.6, -1.4], [22.6, -1.9], [25.4, -0.9], [21.7, -11.1], [18.8, -9.7], [18.8, -7.7], [16.8, -5.9], [15.2, -5.9], [13.9, -7.2]])],
  [7, sh([[38.5, 29.4], [15.2, 41.3], [18.5, 47.7], [41.4, 34.9]])],
  [6.3, sh([[41.4, 34.9], [55.4, 27.7], [60.3, 25.3], [57.4, 19.7], [38.5, 29.4]])],
  [4.4, sh([[67.0, 21.8], [76.7, 16.9], [82.6, 13.9], [86.3, 12.0], [83.4, 6.5], [64.2, 16.3]])],
]

const ROOF = 186.5, PEAK = 189, FLOOR = 3.15, BAY = 3.0
const BAY_W = 2, BAY_H = 3, PERIOD = 9, STEP = 3, DEPTH = 2.2
const FIRST = 7.5 // first window group, just above the 6 m podium roofs
const NFLOORS = Math.floor((ROOF - 1.5 - FIRST) / FLOOR)
const GROUP_H = (ROOF - 1.2 - FIRST) / Math.floor(NFLOORS / 3)

function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}

/** A quad wound to face `out`, whatever order its corners come in. */
function face(p: Part, q: [V3, V3, V3, V3], out: V3) {
  const e1: V3 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2: V3 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const c: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (c[0] * out[0] + c[1] * out[1] + c[2] * out[2] < 0) p.quad(q[3], q[2], q[1], q[0])
  else p.quad(q[0], q[1], q[2], q[3])
}

/** The same for a quad whose last two corners coincide: one triangle. */
function tri3(p: Part, q: [V3, V3, V3, V3], out: V3) {
  const e1: V3 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2: V3 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const c: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (c[0] * out[0] + c[1] * out[1] + c[2] * out[2] < 0) p.tri(q[0], q[2], q[1]); else p.tri(q[0], q[1], q[2])
}

// ---------------------------------------------------------------------------
// Podium: the dark perforated garage screen, planted on top.
// ---------------------------------------------------------------------------
// Plain walls and a flat planted top: the parts' sharp re-entrant corners
// would spike a bevelled coping.
for (const [h, raw] of PODIUM) {
  const ring = area(raw) < 0 ? [...raw].reverse() : raw
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    screen.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h], [a[0], a[1], h])
  })
  capPoly(garden, ring, h)
}

// ---------------------------------------------------------------------------
// Tower faces: scalloped roofline, punched-window grid (three-storey
// panels), and the flaring bay windows in stepped columns.
// ---------------------------------------------------------------------------
const profile = [0, 0.6, 1] // t from the bay's head (0) to its foot (1)
const depth = (t: number) => DEPTH * Math.pow(t, 1.5)

TOWER.forEach((a, i) => {
  const b = TOWER[(i + 1) % TOWER.length]
  const { L, at } = along(a, b)
  const out: V3 = [at(0, 0, 1)[0] - a[0], at(0, 0, 1)[1] - a[1], 0], inward: V3 = [-out[0], -out[1], 0]

  // Roofline: concave arcs between peaks at the scallop joints.
  const arcs = Math.max(2, Math.round(L / 8)), SUB = 4, n = arcs * SUB
  const top = (s: number) => { const u = ((s / L) * arcs) % 1; return ROOF + (PEAK - ROOF) * Math.pow(2 * u - 1, 2) }
  for (let k = 0; k < n; k++) {
    const s0 = (k / n) * L, s1 = ((k + 1) / n) * L
    const t0 = k % SUB === 0 ? PEAK : top(s0), t1 = (k + 1) % SUB === 0 ? PEAK : top(s1)
    face(concrete, [at(s0, 0), at(s1, 0), at(s1, t1), at(s0, t0)], out)
    face(concrete, [at(s0, ROOF), at(s1, ROOF), at(s1, t1, -0.01), at(s0, t0, -0.01)], inward)
  }

  // Window columns, three-storey groups; a bay window replaces two columns
  // of one group where the stepped rhythm puts one.
  const cols = Math.round(L / BAY), pitch = L / cols, pairs = Math.floor(cols / BAY_W)
  const off = Math.floor((cols - pairs * BAY_W) / 2) // centre the paired columns
  const groups = Math.floor(NFLOORS / BAY_H)
  const isBay = (j: number, g: number) => g < groups - 1 && g > 0 && ((g - j * STEP / BAY_H + 30 + i) % (PERIOD / BAY_H)) === 0
  for (let g = 0; g < groups; g++) {
    const z0 = FIRST + g * GROUP_H, z1 = z0 + GROUP_H
    for (let k = 0; k < cols; k++) {
      const j = Math.floor((k - off) / BAY_W)
      if (k >= off && j < pairs && isBay(j, g)) continue
      const c = (k + 0.5) * pitch, w = pitch * 0.6
      face(win, [at(c - w / 2, z0 + 0.75, 0.05), at(c + w / 2, z0 + 0.75, 0.05), at(c + w / 2, z1 - 0.75, 0.05), at(c - w / 2, z1 - 0.75, 0.05)], out)
    }
    for (let j = 0; j < pairs; j++) {
      if (!isBay(j, g)) continue
      const s0 = (off + j * BAY_W) * pitch + 0.25, s1 = (off + (j + 1) * BAY_W) * pitch - 0.25
      const zs = profile.map((t) => z1 - t * (z1 - z0)), ds = profile.map(depth)
      for (let m = 0; m < profile.length - 1; m++) {
        const zu = zs[m], zl = zs[m + 1], du = ds[m], dl = ds[m + 1]
        // Glazed above, the pale flaring scoop of the sill below. In plan the
        // front bows out: deepest mid-bay, shallower at the cheeks.
        const sm = (s0 + s1) / 2, E = 0.65
        const p = m === 0 ? win : concrete
        face(p, [at(s0, zl, dl * E), at(sm, zl, dl), at(sm, zu, du), at(s0, zu, du * E)], out)
        face(p, [at(sm, zl, dl), at(s1, zl, dl * E), at(s1, zu, du * E), at(sm, zu, du)], out)
        // Concrete cheeks either side.
        const side = (s: number, dir: number) => (du > 0.01 ? face : tri3)(concrete, [at(s, zl, 0), at(s, zl, dl * E), at(s, zu, du * E), at(s, zu, 0)],
          [(at(1, 0)[0] - a[0]) * dir, (at(1, 0)[1] - a[1]) * dir, 0])
        side(s0, -1); side(s1, 1)
      }
      // The pale sill's underside: the scallop that reads from the street.
      const sm = (s0 + s1) / 2
      const D: V3 = [0, 0, -1]
      tri3(concrete, [at(s0, z0, 0), at(sm, z0, DEPTH), at(s0, z0, DEPTH * 0.65), at(s0, z0, 0)], D)
      tri3(concrete, [at(s1, z0, 0), at(s1, z0, DEPTH * 0.65), at(sm, z0, DEPTH), at(s1, z0, 0)], D)
      tri3(concrete, [at(s0, z0, 0), at(s1, z0, 0), at(sm, z0, DEPTH), at(sm, z0, DEPTH)], D)
    }
  }
})
capPoly(roof, TOWER, ROOF)

finishModel('11 Hoyt', 'nyc-11-hoyt', [
  { part: concrete, material: finish('hoyt-concrete', 0xdcd6cb) },
  { part: win, material: PALETTE.window },
  { part: screen, material: finish('hoyt-screen', 0x585c62) },
  { part: garden, material: finish('hoyt-garden', 0x93a184) },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, osm: 'relation/13277947', height: PEAK }, 6500)
