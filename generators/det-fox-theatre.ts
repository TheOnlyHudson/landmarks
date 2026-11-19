/**
 * Fox Theatre (2211 Woodward Avenue, Detroit, 1928, C. Howard Crane): the
 * ten-storey Fox Office Building on Woodward with its blade sign, marquee
 * and roof tower, and the auditorium block behind. Procedural, CC0-1.0.
 * bun generators/det-fox-theatre.ts
 *
 * Map frame: x, y, z up, metres, turned to the building's walls: +y runs
 * along bearing 331.5 (north-north-west, up Woodward towards Montcalm), +x
 * along 61.5 (towards Woodward). The anchor is the centroid of the OSM
 * outline way/69134132 (42.3383292, -83.0526856). The outline covers the
 * whole complex; the office tower is its Woodward end.
 *
 * Identity, in order: the pale terracotta office slab on Woodward, 12 bays
 * wide, each bay a pair of tall windows with dark spandrels, pointed heads
 * on the top floor and an ornate cornice with a row of finials; the V-shaped
 * vertical FOX blade sign rising from an orange onion dome and two winged
 * griffins on the marquee; the marquee with its own horizontal FOX; the
 * lattice tower on the roof straight above the sign, with FOX in its shaft
 * and a star on top; the teal-green storefront frames along the base.
 *
 * Evidence:
 *  - plan: OSM way/69134132 (Fox Office Building, 10 levels, NRHP 85000280).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid read in
 *    this frame (street about 1.3 m above the box's ground_min; the lidar sits
 *    about 2 m south of OSM and is shifted to it here). Measured, above the
 *    street: office tower x 14..50 (36 m deep, the full 61 m Woodward
 *    front), roof 37.8; penthouse x 16..32, y -22..-12 at 45; the lattice
 *    tower directly behind the Woodward parapet at y ~6, its shaft about 4 m
 *    across at 66 and its star at 70.1; the auditorium x -44..14, y -18..30,
 *    27-29 at its edges rising to 33.7 over the middle; the fly tower at
 *    the west end, x -50..-32, y -20..2, 33; low wings 4.6 (south) and
 *    6.3 (west).
 *  - published: ten-storey office building, 1928, C. Howard Crane
 *    (Wikipedia, "Fox Theatre (Detroit)"; NRHP 85000280).
 *  - photos: 12 bays on Woodward and 7 on Montcalm, two windows a bay; the
 *    sign on the pier between the 7th and 8th bays from the south; storey
 *    heights, the frieze over the second floor, the cornice, the marquee's
 *    size (about four bays wide, over the second floor), the dome, the
 *    griffins, the sign's V plan and the tower's form.
 *  - colours from the daylight photos, pulled to the palette: pale cream
 *    terracotta (`fox-stone`), teal-green storefront metal and sign panels
 *    (`fox-teal`), gold letters, griffins and trim (`neon-fox-gold`), the
 *    red marquee and orange dome (`neon-fox-red`).
 *  Estimated (from the photos, scaled to the lidar roof): storey heights,
 *  window sizes, the marquee (18 × 4 m, 4.6-9.8 m up), the dome (radius 2),
 *  the blade (two 3.5 m faces, 14-33 m up), the griffins, the tower's legs.
 *
 * Famous sign (STYLE.md, "Famous signs"): the FOX lettering on the blade,
 * the marquee and the tower is modelled, traced from the photos below: a
 * bold Art Deco serif F, a tall oval O and an X with heavy and light
 * diagonals.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fox_Theatre,_Detroit.jpg, JJonahJackalope, CC BY-SA 4.0 (Woodward
 *    front, square on: bay count, sign and tower position)
 *  - Detroit_December_2015_13_(Fox_Theatre).jpg, Michael Barera, CC BY-SA 4.0
 *    (the sign, dome, griffins and marquee close up)
 *  - Fox_Theatre,_Detroit_-_20201215.jpg, Andre Carrotflower, CC BY-SA 4.0
 *    (from the south-east: the south face, the tower)
 *  - Detroit_August_2025_32_(Fox_Theatre).jpg, Michael Barera, CC BY-SA 4.0
 *    (from the north-east: the Montcalm face, the auditorium wall behind)
 *  - Foxdetroitmarqueenightshot2.jpg, Mikerussell, CC BY-SA 3.0 (night: lit
 *    sign, marquee and windows)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the auditorium's and fly tower's walls are seen only in glimpses
 * (buff, plain) and are drawn plain in the office's stone; the west face of
 * the office tower over the auditorium is unphotographed; the light court
 * the lidar shows in the tower's roof is left out (invisible from the
 * street). The tower's lattice is drawn as four legs, a few braces and an
 * open shaft of corner posts.
 *
 * Night: windows glow; the sign letters, the marquee, the dome and the
 * tower's letters are neon in their own colours; the office's terracotta
 * faces are floodlit (`_FLOODLIGHT`), as in the night photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, rect, save, spire, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'
import { Pen, strokes } from './lettering'

const ROOF = 37.8
const FRONT_S: XY = [48.8, -29.5], FRONT_N: XY = [50.6, 31.3] // the Woodward wall (OSM)
const SOUTH_W: XY = [14, -30.5], NORTH_W: XY = [14, 30.4]
const SIGN_Y = 5.6 // the pier between the 7th and 8th bays from the south

const faceOf = (a: XY, b: XY): Face => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { o: [a[0], a[1], 0], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
}
const lenOf = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** An equilateral pointed-arch window: jambs from z0 to zs, then the pointed head. */
function pointed(sc: number, w: number, z0: number, zs: number, segs = 3): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}

/** The office facade on one wall: storefronts, the second floor, the frieze, the shaft, the arched top, the cornice. */
function officeFace(o: { stone: Part; win: Part; teal: Part }, a: XY, b: XY, n: number, opts: { from?: number; skip?: (s: number) => boolean; base?: boolean } = {}) {
  const f = faceOf(a, b), L = lenOf(a, b), w = L / n, PIER = 1.1, MID = 0.5
  const ww = (w - PIER - MID) / 2
  const from = opts.from ?? 0
  for (let k = 0; k < n; k++) {
    const s0 = k * w + PIER / 2, s1 = (k + 1) * w - PIER / 2, sc = (s0 + s1) / 2
    // shaft: two window columns, storeys in three groups, pointed heads on the top floor
    for (const c of [sc - (MID + ww) / 2, sc + (MID + ww) / 2]) {
      for (const [z0, z1] of [[12.6, 19.6], [20.4, 27.4]] as [number, number][]) if (z0 >= from) flatShape(o.win, f, R(c - ww / 2, z0, c + ww / 2, z1), 0.05)
      flatShape(o.win, f, pointed(c, ww, Math.max(28.2, from), 33.0), 0.05)
    }
    if (opts.base === false) continue
    if (opts.skip?.(sc)) continue
    // the second floor: one broad window a bay
    flatShape(o.win, f, R(s0 + 0.15, 6.3, s1 - 0.15, 9.4), 0.05)
    // storefront: a teal frame with its glass
    extrudeShape(o.teal, f, R(s0 - 0.25, 0, s1 + 0.25, 5.3), 0, 0.12)
    flatShape(o.win, f, R(s0 + 0.25, 0.4, s1 - 0.25, 4.7), 0.15)
  }
  if (opts.base !== false) extrudeShape(o.stone, f, R(0, 9.9, L, 11.7), 0, 0.22) // the frieze over the second floor
  extrudeShape(o.stone, f, R(0, 34.5, L, 36.3), 0, 0.3) // the cornice band
}

/** The three letters as separate pens. */
function letterPens(): Pen[] {
  const F = new Pen()
  F.moveTo([0.12, 0]).lineTo([0.12, 1]).lineTo([0.74, 1]).lineTo([0.74, 0.84])
  F.moveTo([0.12, 0.54]).lineTo([0.56, 0.54])
  F.moveTo([0, 0]).lineTo([0.34, 0])
  const O = new Pen()
  O.circle([0.4, 0.5], 0.33, 0.46, 14)
  const X = new Pen()
  X.moveTo([0.06, 1]).lineTo([0.78, 0])
  X.moveTo([0.74, 1]).lineTo([0.1, 0])
  return [F, O, X]
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), teal = new Part(), gold = new Part(), red = new Part()
  const o = { stone, win, teal }

  // ---------------------------------------------------------------- office tower
  const tower: XY[] = [SOUTH_W, FRONT_S, FRONT_N, NORTH_W]
  walls(stone, tower, 0, ROOF - 0.5)
  walls(stone, tower, ROOF - 0.5, ROOF, inset(tower, 0.4))
  cap(roof, inset(tower, 0.4), ROOF)
  officeFace(o, FRONT_S, FRONT_N, 12, { skip: (s) => Math.abs(s - (SIGN_Y - FRONT_S[1])) < 9.5 })
  officeFace(o, SOUTH_W, FRONT_S, 7)
  officeFace(o, FRONT_N, NORTH_W, 7)
  officeFace(o, NORTH_W, SOUTH_W, 12, { from: 28.2, base: false })
  // finials on the parapet, one on every pier and corner
  for (const [a, b, n] of [[FRONT_S, FRONT_N, 12], [SOUTH_W, FRONT_S, 7], [FRONT_N, NORTH_W, 7]] as [XY, XY, number][]) {
    const L = lenOf(a, b), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    for (let k = 0; k <= n; k++) {
      const s = Math.min(L - 0.35, Math.max(0.35, (k * L) / n))
      const c: XY = [a[0] + u[0] * s - nn[0] * 0.35, a[1] + u[1] * s - nn[1] * 0.35]
      const r = rect(c[0] - 0.3, c[1] - 0.3, c[0] + 0.3, c[1] + 0.3)
      spire(stone, r, ROOF, [c[0], c[1], ROOF + 1.5])
    }
  }
  // the penthouse
  {
    const p = rect(16, -22, 32, -12)
    walls(stone, p, ROOF, 45 - 0.4); walls(stone, p, 45 - 0.4, 45, inset(p, 0.3)); cap(roof, inset(p, 0.3), 45)
  }

  // ---------------------------------------------------------------- auditorium, fly tower, wings
  {
    const aud = rect(-44, -18, 14, 30)
    walls(stone, aud, 0, 27.6)
    walls(stone, aud, 27.6, 28, inset(aud, 0.4))
    const top = rect(-26, -10, 2, 20)
    walls(roof, inset(aud, 0.4), 28, 33.7, top)
    cap(roof, top, 33.7)
    const fly = rect(-49.9, -20, -32, 2)
    walls(stone, fly, 0, 32.6); walls(stone, fly, 32.6, 33, inset(fly, 0.4)); cap(roof, inset(fly, 0.4), 33)
    const south = rect(-49.9, -31.0, 14, -18)
    walls(stone, south, 0, 4.6); cap(roof, south, 4.6)
    const west = rect(-49.9, 2, -44, 29)
    walls(stone, west, 0, 6.3); cap(roof, west, 6.3)
  }

  // ---------------------------------------------------------------- marquee, dome, griffins, blade sign
  const f = faceOf(FRONT_S, FRONT_N)
  const sY = SIGN_Y - FRONT_S[1] // the sign's position along the Woodward face
  const P = (s: number, z: number, d: number): V3 => [f.o[0] - f.n[1] * s + f.n[0] * d, f.o[1] + f.n[0] * s + f.n[1] * d, z]
  const MD = 4.0, MW = 9.0, MZ0 = 4.6, MZ1 = 9.8
  {
    // the marquee box
    const box = [P(sY - MW, 0, 0), P(sY + MW, 0, 0), P(sY + MW, 0, MD), P(sY - MW, 0, MD)].map((p) => [p[0], p[1]] as XY)
    const ring = box.reverse()
    walls(red, ring, MZ0, MZ1)
    cap(red, ring, MZ0, false)
    cap(gold, ring, MZ1)
    // a gold rim along its top and bottom
    walls(gold, inset(ring, -0.15), MZ1 - 0.5, MZ1 + 0.25)
    walls(gold, inset(ring, -0.15), MZ0, MZ0 + 0.35)
    const mf: Face = { o: P(sY, 0, MD), n: f.n } // its front, s centred on the sign
    // two screens beside the lettering
    for (const s of [-5.9, 5.9]) flatShape(win, mf, R(s - 2.4, MZ0 + 1.1, s + 2.4, MZ1 - 1.2), 0.04)
    // FOX across the front
    const pens = letterPens(), capM = 3.0, gap = 0.25
    const widths = [0.78, 0.8, 0.84].map((x) => x * capM)
    let u = -(widths.reduce((a, b) => a + b) + 2 * gap) / 2
    pens.forEach((pen, i) => {
      const u0 = u
      strokes(gold, pen.paths, { width: 0.2, depth: 0.15, place: (uu, vv, ww) => [...(() => { const p = P(sY + u0 + uu * capM, MZ0 + 1.0 + vv * capM, MD + ww); return p })()] as V3 })
      u += widths[i] + gap
    })
    // the entrance doors under it
    for (let k = -3; k <= 3; k++) flatShape(win, f, R(sY + k * 2.1 - 0.85, 0, sY + k * 2.1 + 0.85, 3.6), 0.06)
    extrudeShape(teal, f, R(sY - MW + 0.3, 0, sY + MW - 0.3, 4.6), 0, 0.03)
  }
  // the onion dome on the marquee, with its gold crown
  const DX = 2.0, DZ = MZ1 + 0.2
  {
    const c = P(sY, 0, DX)
    lathe(red, c[0], c[1], [[1.1, DZ], [2.1, DZ + 0.8], [2.45, DZ + 1.8], [2.2, DZ + 2.9], [1.4, DZ + 3.8], [0.6, DZ + 4.3], [0.35, DZ + 4.6]], 14)
    lathe(gold, c[0], c[1], [[0.6, DZ + 4.5], [0.85, DZ + 4.9], [0.55, DZ + 5.7], [0.25, DZ + 6.5], [0.01, DZ + 6.8]], 10)
    lathe(gold, c[0], c[1], [[2.45, DZ + 1.5], [2.55, DZ + 1.8], [2.45, DZ + 2.1]], 14)
  }
  // the griffins: a seated gold lion each side, with raised wings
  for (const side of [-1, 1]) {
    const s = sY + side * 5.4
    const body = (s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) => {
      const r = [P(s0, 0, d0), P(s1, 0, d0), P(s1, 0, d1), P(s0, 0, d1)].map((p) => [p[0], p[1]] as XY)
      const rr = side > 0 ? r : r
      const ccw = (rr[1][0] - rr[0][0]) * (rr[2][1] - rr[0][1]) - (rr[1][1] - rr[0][1]) * (rr[2][0] - rr[0][0]) > 0 ? rr : [...rr].reverse()
      walls(gold, ccw, z0, z1); cap(gold, ccw, z1); cap(gold, ccw, z0, false)
    }
    const G = 1.35, Z = MZ1
    body(s - 1.5 * G, s + 1.5 * G, 0.8, 2.9, Z, Z + 1.6 * G) // haunches and body
    body(s - side * 1.3 * G - 0.7, s - side * 1.3 * G + 0.7, 1.1, 3.2, Z + 1.6 * G, Z + 3.2 * G) // chest and raised forequarters, towards the dome
    body(s - side * 1.5 * G - 0.55, s - side * 1.5 * G + 0.55, 1.6, 3.4, Z + 3.0 * G, Z + 3.9 * G) // head
    // the wing: a flat raised blade, swept up and out
    const wf: Face = { o: P(s, 0, 1.7), n: f.n }
    extrudeShape(gold, wf, [[-1.2 * G, Z + 1.8 * G], [1.2 * G, Z + 1.6 * G], [side * 2.6 * G, Z + 4.9 * G], [side * 0.5 * G, Z + 4.2 * G]], 0, 0.3)
  }
  // the blade: two faces in a V, apex out from the facade, letters stacked on each
  const BZ0 = 14.6, BZ1 = 33.2, APEX = 3.4, HALF = 2.0
  {
    const A0 = P(sY - HALF, 0, 0.05), A1 = P(sY, 0, APEX), A2 = P(sY + HALF, 0, 0.05)
    const pts = [A0, A1, A2].map((p) => [p[0], p[1]] as XY) // counter-clockwise seen from above? check winding below
    const tri = ((pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0])) > 0 ? pts : [...pts].reverse()
    walls(teal, tri, BZ0, BZ1)
    cap(gold, tri, BZ1)
    cap(teal, tri, BZ0, false)
    // gold edging up the apex and the outer edges
    for (const p of [A1, A0, A2]) {
      const r = rect(p[0] - 0.18, p[1] - 0.18, p[0] + 0.18, p[1] + 0.18)
      walls(gold, r, BZ0, BZ1 + 0.1)
    }
    // the spine: a gold-and-red pole up the apex to a finial
    const ap = P(sY, 0, APEX + 0.25)
    lathe(gold, ap[0], ap[1], [[0.2, BZ0], [0.2, BZ1 + 0.6], [0.42, BZ1 + 0.9], [0.42, BZ1 + 1.5], [0.18, BZ1 + 2.4], [0.01, BZ1 + 2.8]], 8)
    // letters on both faces, reading downwards: F, O, X
    const pens = letterPens(), capH = 4.9, gaps = [BZ1 - 0.7 - capH, BZ1 - 0.7 - 2 * capH - 1.0, BZ1 - 0.7 - 3 * capH - 2.0]
    for (const [E0, E1] of [[A0, A1], [A1, A2]] as [V3, V3][]) {
      // the face runs E0→E1; its outward normal is the right-hand side seen from above, away from the triangle
      const L = Math.hypot(E1[0] - E0[0], E1[1] - E0[1]), u: XY = [(E1[0] - E0[0]) / L, (E1[1] - E0[1]) / L]
      const cen: XY = [(A0[0] + A1[0] + A2[0]) / 3, (A0[1] + A1[1] + A2[1]) / 3]
      let nrm: XY = [u[1], -u[0]]
      const mid: XY = [(E0[0] + E1[0]) / 2, (E0[1] + E1[1]) / 2]
      if ((mid[0] - cen[0]) * nrm[0] + (mid[1] - cen[1]) * nrm[1] < 0) nrm = [-nrm[0], -nrm[1]]
      // reading direction: letters face out, so u runs to the viewer's right
      const right: XY = [-nrm[1], nrm[0]]
      const sgn = right[0] * u[0] + right[1] * u[1] > 0 ? 1 : -1
      const start: XY = sgn > 0 ? [E0[0], E0[1]] : [E1[0], E1[1]]
      pens.forEach((pen, i) => {
        const lw = [0.78, 0.8, 0.84][i] * capH * 0.42
        const off = (L - lw) / 2
        strokes(gold, pen.paths, {
          width: 0.17, depth: 0.12,
          place: (uu, vv, ww) => [start[0] + right[0] * (off + uu * capH * 0.42) + nrm[0] * (0.02 + ww), start[1] + right[1] * (off + uu * capH * 0.42) + nrm[1] * (0.02 + ww), gaps[i] + vv * capH],
        })
      })
    }
    // the slim side poles with finials, either side of the blade
    for (const side of [-1, 1]) {
      const c = P(sY + side * 2.6, 0, 1.0)
      lathe(red, c[0], c[1], [[0.2, MZ1], [0.2, 26.5], [0.38, 26.8], [0.38, 27.4], [0.01, 28.4]], 6)
    }
  }

  // ---------------------------------------------------------------- the roof tower
  {
    const c = P(sY, 0, -4.2) // just behind the Woodward parapet
    const cx = c[0], cy = c[1], B = 3.2, T = 1.15, Z0 = ROOF, Z1 = 50.5, Z2 = 67.0
    const corners = (h: number): XY[] => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
    const leg = (p0: V3, p1: V3, r: number) => {
      const sec = (p: V3): V3[] => [[p[0] - r, p[1] - r, p[2]], [p[0] + r, p[1] - r, p[2]], [p[0] + r, p[1] + r, p[2]], [p[0] - r, p[1] + r, p[2]]]
      roof.sweep([sec(p0), sec(p1)])
    }
    const b0 = corners(B), b1 = corners(T)
    for (let i = 0; i < 4; i++) {
      leg([b0[i][0], b0[i][1], Z0], [b1[i][0], b1[i][1], Z1], 0.22)
      leg([b1[i][0], b1[i][1], Z1], [b1[i][0], b1[i][1], Z2], 0.16)
    }
    // braces: rings at a few heights, and X bracing in the legs
    for (const z of [42.5, 46.5, Z1, 56, 61.5, Z2]) {
      const h = z <= Z1 ? B + (T - B) * (z - Z0) / (Z1 - Z0) : T
      const r = corners(h)
      for (let i = 0; i < 4; i++) {
        const a = r[i], b = r[(i + 1) % 4], d = 0.1
        const sec = (p: XY): V3[] => [[p[0], p[1] - d, z - d], [p[0], p[1] + d, z - d], [p[0], p[1] + d, z + d], [p[0], p[1] - d, z + d]]
        const sx = (p: XY): V3[] => [[p[0] - d, p[1], z - d], [p[0] + d, p[1], z - d], [p[0] + d, p[1], z + d], [p[0] - d, p[1], z + d]]
        roof.sweep(Math.abs(a[0] - b[0]) > Math.abs(a[1] - b[1]) ? [sec(a), sec(b)] : [sx(a), sx(b)])
      }
    }
    // the cap and the star
    const top = corners(T + 0.2)
    walls(roof, top, Z2, Z2 + 0.6); cap(roof, top, Z2 + 0.6)
    lathe(roof, cx, cy, [[0.15, Z2 + 0.6], [0.15, 68.6]], 6)
    {
      const st: V3 = [cx, cy, 69.4], R5 = 0.75, r5 = 0.3
      const f2: Face = { o: [cx, cy, 0], n: f.n }
      const star: XY[] = []
      for (let k = 0; k < 10; k++) {
        const a = Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r5 : R5
        star.push([rr * Math.cos(a), st[2] + rr * Math.sin(a)])
      }
      // star in the facade's plane (s, z), as a thin extruded plate
      const shp = star.map(([s, z]) => [s, z] as XY)
      extrudeShape(gold, { o: [cx - f.n[0] * 0.1, cy - f.n[1] * 0.1, 0], n: f.n }, shp, 0, 0.2)
      extrudeShape(gold, { o: [cx + f.n[0] * 0.1, cy + f.n[1] * 0.1, 0], n: [-f.n[0], -f.n[1]] }, shp.map(([s, z]) => [-s, z] as XY), 0, 0.2)
      void f2
    }
    // FOX down the shaft, facing Woodward and facing west
    const pens = letterPens(), capH = 3.9
    const zs = [62.2, 57.4, 52.6]
    for (const dir of [1, -1]) {
      const nrm: XY = [f.n[0] * dir, f.n[1] * dir], right: XY = [-nrm[1], nrm[0]]
      const base: XY = [cx + nrm[0] * (T + 0.05), cy + nrm[1] * (T + 0.05)]
      pens.forEach((pen, i) => {
        const sc = capH * 0.45, lw = [0.78, 0.8, 0.84][i] * sc
        strokes(gold, pen.paths, {
          width: 0.2, depth: 0.12, back: true,
          place: (uu, vv, ww) => [base[0] + right[0] * (uu * sc - lw / 2) + nrm[0] * ww, base[1] + right[1] * (uu * sc - lw / 2) + nrm[1] * ww, zs[i] + vv * capH],
        })
      })
    }
  }

  // the office's terracotta is floodlit at night, its faces evenly washed; the auditorium stays dark
  const stoneLit = { ...finish('fox-stone', 0xe9e2d4), floodlight: (p: V3, n: V3) => (p[0] > 13.5 && Math.abs(n[2]) < 0.5 && p[2] < ROOF + 2 ? 0.75 : 0) }
  return [
    { part: stone, material: stoneLit },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: teal, material: finish('fox-teal', 0x6f9e93) },
    { part: gold, material: finish('neon-fox-gold', 0xe3b84e) },
    { part: red, material: finish('neon-fox-red', 0xc9583f) },
  ]
}

if (import.meta.main) await save('det-fox-theatre', 'Fox Theatre', [42.3383292, -83.0526856], 331.5, build(), 6500)
