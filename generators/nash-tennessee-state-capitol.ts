/**
 * Tennessee State Capitol, Nashville (1845–59, William Strickland):
 * procedural, CC0-1.0.
 * bun generators/nash-tennessee-state-capitol.ts [out.glb]
 *
 * Also exports the small classical kit (oriented faces, boxes, columns,
 * gables, cross-shaped rings) that nash-war-memorial-building.ts and
 * nash-tennessee-supreme-court.ts import.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 331.4: the
 * model's +y is the building's long axis, pointing at the north portico
 * (Charlotte Avenue side). The OSM walls run at 151.4°/61.4°. Origin: the
 * area centroid of OSM way/249147622 (-86.7842382, 36.1658304), which is
 * within 0.2 m of the centre of the building block; the model is mirrored
 * about both axes, as the real building is.
 * y = 0 is the map's ground under the footprint (Mapterhorn, 169.1–169.3 m;
 * lidar 9.0 m above its ground_min of 160.25 m). The lower plaza round the
 * podium is about 0.7 m above that; the terrace on the podium 3.3 m.
 *
 * OSM (sorted out):
 * - way/249147622 "Tennessee State Capitol" (Q2570396, height 2.5,
 *   building + building:part): the outline is the podium terrace the
 *   building stands on, a cross 41.8 × 82.8 m (±20.9 × ±41.4, the middle
 *   ±24.7 × ±18 for the side entrances). Lidar puts its top 3.3 m above
 *   y = 0, 2.6 m above the plaza; OSM's 2.5 is right for the plaza side.
 * - way/249147629 (height 20): the building block, 34.7 × 73 m with the
 *   east and west porticoes projecting 3.4 m over 21.3 m of the middle.
 *   Published: 112 × 239 ft (34 × 73 m) — matches.
 * - way/249147633 (height 26): the tower's square pedestal, 10.9 × 11.2 m.
 * - way/249147632 (height 36, Ø 9.4): the round lantern.
 * - way/249147631 (part, height 40, Ø 2.9): the finial.
 * OSM's heights are rough (the tower's are 15–25 m low); lidar replaces them.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, read with
 * tools/lidar_frame.py at bearing 331.4, heights here above y = 0:
 * podium terrace 3.3; the roof plane 22.9 at 1.4 m in from the side
 * walls and 22.7 at the wall line (slope 0.30, so the cornice top is drawn
 * at 22.5 under a roof edge 0.45 m out); ridge 27.6–27.9; pediment apex
 * 27.9; side porticoes' attic 23.8–24.8; tower pedestal
 * cornice 40.2 (11 m square); top of the lantern's cresting ring 52.4
 * (Ø ~9 m); spire top 64.2 (published total 63.0 m from the plaza, which is
 * 0.7 m above y = 0, so 63.7 here: the two agree).
 *
 * Published (Wikipedia, "Tennessee State Capitol", citing the NRHP
 * nomination): 34 × 73 m; 206.6 ft (63.0 m) tall; Ionic octastyle porticoes
 * north and south with pediments, hexastyle porticoes east and west with
 * parapets, all on a Doric basement with 6 ft (1.8 m) square piers; columns
 * 56 in (1.4 m) in diameter; copper roof; a 42 ft (13 m) square pedestal
 * carrying a 37 ft (11 m) round cupola after the Choragic Monument of
 * Lysicrates, eight Corinthian columns; a 37 ft cast-iron finial of four
 * leaf tiers and a spire; floodlit at night.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-tennessee-state-capitol/photos):
 *  c01 aerial from the south: "Tennessee state capitol 2009.jpg",
 *      euthman (Ed Uthman), CC BY-SA 2.0. Roof colour (green copper), the
 *      south portico, tower stages, podium and stairs.
 *  c02 from the south-east: "Tennessee State Capitol 2009.jpg", Kaldari,
 *      public domain. The elevation used for every storey height (scaled to
 *      the lidar cornice): basement 5.4 m, columns 10.7, entablature 3.5,
 *      pediment 5.0; tower proportions.
 *  c04, c06, c07: "Tennessee State Capitol, Charlotte Avenue, Nashville, TN"
 *      (Flickr 54385429850, 54385054231, 54384175757), w_lemay, CC BY-SA 2.0.
 *      c04/c07 the portico depth (one bay, the anta at the side wall's end),
 *      the paired windows (4 bays each side of the side portico), the basement
 *      piers; c06 the east portico frontal: six columns, the attic over it
 *      (~12 m wide), five intercolumns of windows and the basement doors.
 *  a1  "Tennessee State Capitol - aerial view 2009.jpg", Ed Uthman,
 *      CC BY-SA 2.0 (same set as c01).
 *  night: "Tennessee Capitol at night.jpg", Voxinferior, CC BY-SA 4.0;
 *      "Tennessee State Capitol Nighttime.jpg", Ichabod, CC BY-SA 3.0.
 *
 * Estimated (from the photos, scaled to the lidar): storey heights above;
 * the end porticoes' depth (5.7 m: one intercolumn); window sizes; the
 * lantern's column radius (4.1 m) and core; the cresting and finial
 * profiles; the two-step attic over the side porticoes (14.8 m wide to
 * 24.2, then 11.2 m wide to 25.4; lidar reads 23.8–24.8 on it, photo c06
 * shows the step).
 * Left out: the podium stairs and the Motlow tunnel stairs (outside the
 * outline), the Polk tomb, statues, balustrades and railings, the flags and
 * their pole above the spire, capitals' carving (Ionic capitals are drawn
 * as slabs wider across the volutes), rustication grooves.
 * Night: the whole building and the tower are floodlit warm white from the
 * ground (night photos); `floodlight` on the limestone and trim, faces
 * looking up barely lit; windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, capRing, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

// ============================================================ shared kit

/** A triangle, wound so its face points along `out`. */
export function triO(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A planar quad a-b-c-d (in order round it), facing `out`. */
export function quadO(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  triO(p, a, b, c, out)
  triO(p, a, c, d, out)
}
/** A closed axis-aligned box, its top and bottom capped. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, bevel = 0) {
  const r = bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1)
  prism(p, top, r, z0, z1)
  capRing(p, r, z0, false)
}
/** Grow a counter-clockwise ring with right-angled or straight corners by d (negative shrinks it). */
export function grow(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const l0 = Math.hypot(p[0] - a[0], p[1] - a[1]), l1 = Math.hypot(c[0] - p[0], c[1] - p[1])
    const n0: XY = [(p[1] - a[1]) / l0, -(p[0] - a[0]) / l0], n1: XY = [(c[1] - p[1]) / l1, -(c[0] - p[0]) / l1]
    const straight = Math.abs(n0[0] - n1[0]) + Math.abs(n0[1] - n1[1]) < 1e-6
    return straight ? [p[0] + d * n0[0], p[1] + d * n0[1]] : [p[0] + d * (n0[0] + n1[0]), p[1] + d * (n0[1] + n1[1])]
  })
}
/** A ring band between z0 and z1, closed underneath and on top. */
export function slabRing(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p) {
  prism(p, top, ring, z0, z1)
  capRing(p, ring, z0, false)
}
/**
 * A cross-shaped plan: a w × l block (half sizes) with a projection of
 * depth px over ±q on the east and west sides (q = 0: a plain rectangle).
 */
export function crossRing(w: number, l: number, px = 0, q = 0): XY[] {
  if (px <= 0 || q <= 0) return rect(-w, -l, w, l)
  const P = w + px
  return [[w, -l], [w, -q], [P, -q], [P, q], [w, q], [w, l], [-w, l], [-w, q], [-P, q], [-P, -q], [-w, -q], [-w, -l]]
}
/** A flat rectangular panel on a face: centred at s, w wide, z0..z1. */
export function panel(p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.06) {
  flatShape(p, f, [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]], d)
}
/**
 * A round column: a tapering 12-sided shaft on a square plinth, under a
 * capital slab (ax × ay wide; an Ionic capital is wider across its volutes).
 */
export function column(shaft: Part, cap: Part, x: number, y: number, r: number, z0: number, z1: number, o: { ax?: number; ay?: number; capH?: number; base?: number; segs?: number; flare?: boolean } = {}) {
  const capH = o.capH ?? r * 0.75, base = o.base ?? r * 0.35
  const segs = o.segs ?? 12
  if (base > 0) box(cap, x - r * 1.2, y - r * 1.2, x + r * 1.2, y + r * 1.2, z0, z0 + base)
  lathe(shaft, x, y, [[r, z0 + base], [r * 0.86, z1 - capH]], segs)
  if (o.flare) lathe(cap, x, y, [[r * 0.86, z1 - capH], [r * 1.25, z1 - capH * 0.25]], segs)
  const ax = o.ax ?? r * 2.4, ay = o.ay ?? r * 2.4
  box(cap, x - ax / 2, y - ay / 2, x + ax / 2, y + ay / 2, o.flare ? z1 - capH * 0.25 : z1 - capH, z1)
}
/**
 * A gable roof with pediments: roof slopes from eaves at x = ±w (height ze)
 * to a ridge at x = 0 (height zr), over y = y0..y1. At each end listed in
 * `ends` (-1 south, +1 north) a pediment: a raking cornice band (`rake`
 * deep, `lip` metres proud of the tympanum) and the tympanum, recessed.
 * A hipped end is drawn where an end is not listed.
 */
export function gable(roof: Part, trim: Part, wall: Part, w: number, y0: number, y1: number, ze: number, zr: number, ends: number[], rake = 0.8, lip = 0.6) {
  const L = (x: number) => ze + (zr - ze) * (1 - Math.abs(x) / w)
  const hip = (s: number) => (ends.includes(s) ? 0 : w)
  const yA = y0 + hip(-1), yB = y1 - hip(1)
  // slopes (east and west)
  for (const sx of [-1, 1]) {
    const out: V3 = [sx * (zr - ze), 0, w]
    quadO(roof, [sx * w, y0 + (hip(-1) ? 0 : 0), ze], [sx * w, y1, ze], [0, yB, zr], [0, yA, zr], out)
  }
  for (const s of [-1, 1]) {
    const yE = s > 0 ? y1 : y0
    if (!ends.includes(s)) {
      // hipped end
      triO(roof, [-w, yE, ze], [w, yE, ze], [0, s > 0 ? yB : yA, zr], [0, s * w, zr - ze])
      continue
    }
    const out: V3 = [0, s, 0]
    const yT = yE - s * lip // tympanum plane
    // raking cornice: front faces, soffits under them
    for (const sx of [-1, 1]) {
      const a: V3 = [sx * w, yE, ze], b: V3 = [0, yE, zr]
      const a2: V3 = [sx * w, yE, ze - rake], b2: V3 = [0, yE, zr - rake]
      quadO(trim, a, b, b2, a2, out)
      quadO(trim, a2, b2, [0, yT, zr - rake], [sx * w, yT, ze - rake], [sx * (zr - ze), 0, -w])
    }
    // tympanum, set back, between the cornice top and the raking soffits
    const xi = w * (1 - rake / (zr - ze))
    triO(wall, [-xi, yT, ze], [xi, yT, ze], [0, yT, zr - rake], out)
  }
  return L
}

// ============================================================ the model

const LIME = 'tn-limestone'
// Elevation (lidar-measured where noted; the rest scaled from photo c02).
const PODIUM = 3.3 // lidar
const BASE = 8.7 // top of the basement storey and the porticoes' floor
const COLTOP = 19.4
const FRIEZE = 21.3
const EAVES = 22.5 // lidar: the pediment's raking line, 22.7 at the wall face
const RIDGE = 27.9 // lidar (ridge 27.6–27.9, pediment apex 27.9)
const ATTIC = 24.6 // lidar 23.8–24.8
// Plan (OSM way/249147629, published 34 × 73 m).
const W = 17.35, L = 36.5, PX = 3.4, Q = 10.65
const BACK = L - 5.7 // the end porticoes' back wall
// Tower (OSM pedestal 11 m square; heights lidar).
const PED = 5.5, PEDTOP = 38.9, PEDCORN = 40.2, LAN0 = 41.0, LANCOL = 48.4, LANENT = 51.4, CREST = 52.4, SPIRE = 63.6

function build() {
  const lime = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shade = new Part()
  // the back walls of the porticoes and the basement loggias, in the shade
  // that makes the columns read in every photo
  const back = (f: Face, s0: number, s1: number, z0: number, z1: number) => flatShape(shade, f, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], 0.03)

  // ---------------------------------------------------------- podium terrace (the OSM outline)
  const podium = crossRing(20.9, 41.4, 3.8, 18)
  prism(lime, lime, podium, 0, PODIUM - 0.35)
  prism(trim, trim, grow(podium, 0.12), PODIUM - 0.35, PODIUM)

  // ---------------------------------------------------------- basement storey (Doric, rusticated)
  // the closed body behind the porticoes
  prism(lime, null, chamfer(rect(-W - 0.15, -BACK - 0.15, W + 0.15, BACK + 0.15), 0.3), PODIUM, BASE)
  // square piers under every column (published 1.8 m), and under the antae
  const endCols = Array.from({ length: 8 }, (_, k) => -W + 0.9 + (k * (2 * W - 1.8)) / 7)
  const sideCols = Array.from({ length: 6 }, (_, k) => -Q + 1.05 + (k * (2 * Q - 2.1)) / 5)
  const colY = L - 1.0, colX = W + PX - 1.0
  for (const s of [-1, 1]) {
    for (const x of endCols) box(lime, x - 0.9, s * colY - 0.9, x + 0.9, s * colY + 0.9, PODIUM, BASE - 0.7, null, 0.15)
    for (const sx of [-1, 1]) box(lime, sx * W - 0.9, s * (BACK + 0.9) - 0.9, sx * W + 0.9, s * (BACK + 0.9) + 0.9, PODIUM, BASE - 0.7, null, 0.15)
    for (const y of sideCols) box(lime, s * colX - 0.9, y - 0.9, s * colX + 0.9, y + 0.9, PODIUM, BASE - 0.7, null, 0.15)
  }
  // the porticoes' floor slab and the belt course round the whole block
  const block = crossRing(W, L, PX, Q)
  slabRing(trim, grow(block, 0.25), BASE - 0.7, BASE)

  // ---------------------------------------------------------- the main storeys
  prism(lime, null, rect(-W, -BACK, W, BACK), BASE, COLTOP)
  // antae at the ends of the side walls (end porticoes) and beside the side porticoes
  for (const s of [-1, 1]) for (const sx of [-1, 1]) {
    box(trim, sx > 0 ? W - 1.3 : -W - 0.2, s > 0 ? BACK : -BACK - 0.5, sx > 0 ? W + 0.2 : -W + 1.3, s > 0 ? BACK + 0.5 : -BACK, BASE, COLTOP, null)
    box(trim, sx > 0 ? W : -W - 0.35, s > 0 ? Q - 1.3 : -Q, sx > 0 ? W + 0.35 : -W, s > 0 ? Q : -Q + 1.3, BASE, COLTOP, null)
  }
  // columns: Ionic, 1.4 m (published), slabs wider across the volutes
  for (const s of [-1, 1]) {
    for (const x of endCols) column(trim, trim, x, s * colY, 0.7, BASE, COLTOP, { ax: 2.1, ay: 1.5, capH: 0.6, base: 0.3 })
    for (const y of sideCols) column(trim, trim, s * colX, y, 0.7, BASE, COLTOP, { ax: 1.5, ay: 2.1, capH: 0.6, base: 0.3 })
  }

  // ---------------------------------------------------------- entablature, cornice, attic, roof
  slabRing(lime, block, COLTOP, FRIEZE, null)
  const corn = chamfer(grow(block, 0.45), 0.25)
  prism(trim, trim, corn, FRIEZE + 0.35, EAVES)
  capRing(trim, corn, FRIEZE + 0.35, false)
  slabRing(trim, grow(block, 0.15), FRIEZE, FRIEZE + 0.35, null)
  // the parapet (attic) over each side portico
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? W - 1.0 : -W - PX + 0.6, x1 = s > 0 ? W + PX - 0.6 : -W + 1.0
    // two steps, as in photo c06: a broad lower block and a narrower top
    prism(lime, null, rect(x0, -7.4, x1, 7.4), EAVES, 23.9)
    prism(trim, trim, chamfer(rect(x0 - 0.15, -7.55, x1 + 0.15, 7.55), 0.15), 23.9, 24.2)
    const xi0 = s > 0 ? x0 : x0 + 0.8, xi1 = s > 0 ? x1 - 0.8 : x1
    prism(lime, null, rect(xi0, -5.6, xi1, 5.6), 24.2, ATTIC + 0.5)
    prism(trim, trim, chamfer(rect(xi0 - 0.12, -5.72, xi1 + 0.12, 5.72), 0.12), ATTIC + 0.5, ATTIC + 0.8)
  }
  // the copper roof: one gable from end to end, pediments north and south
  gable(roof, trim, lime, W + 0.45, -L - 0.45, L + 0.45, EAVES, RIDGE, [-1, 1], 0.75, 0.55)
  for (const s of [-1, 1]) {
    back({ o: [0, s * BACK, 0], n: [0, s] }, -W, W, BASE, COLTOP)
    back({ o: [0, s * (BACK + 0.15), 0], n: [0, s] }, -W - 0.15, W + 0.15, PODIUM, BASE - 0.7)
    back({ o: [s * W, 0, 0], n: [s, 0] }, -Q, Q, BASE, COLTOP)
    back({ o: [s * (W + 0.15), 0, 0], n: [s, 0] }, -Q, Q, PODIUM, BASE - 0.7)
  }
  // ---------------------------------------------------------- windows
  const z = { lo0: 10.0, lo1: 14.2, up0: 15.3, up1: 18.1, b0: 4.6, b1: 7.3 }
  for (const sx of [-1, 1]) {
    const f: Face = { o: [sx * W, 0, 0], n: [sx, 0] }
    const fb: Face = { o: [sx * (W + 0.15), 0, 0], n: [sx, 0] }
    const sgn = sx // s runs along +y on the east face, -y on the west
    // four bays of paired windows each side of the side portico
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const y = s * (Q + 2.52 + k * 5.04)
      for (const dy of [-0.85, 0.85]) {
        const sc = (y + dy) * sgn
        panel(win, f, sc, 1.15, z.lo0, z.lo1)
        panel(win, f, sc, 1.15, z.up0, z.up1)
        panel(win, fb, sc, 1.0, z.b0, z.b1)
      }
    }
    // behind the side portico: a window in each intercolumn, doors below
    for (let k = 0; k < 5; k++) {
      const y = (sideCols[k] + sideCols[k + 1]) / 2, sc = y * sgn
      panel(win, f, sc, 1.5, z.lo0, k === 2 ? z.lo1 + 0.4 : z.lo1)
      panel(win, f, sc, 1.5, z.up0, z.up1)
      panel(win, fb, sc, 1.9, PODIUM + 0.3, BASE - 1.1)
    }
  }
  for (const s of [-1, 1]) {
    const f: Face = { o: [0, s * BACK, 0], n: [0, s] }
    const fb: Face = { o: [0, s * (BACK + 0.15), 0], n: [0, s] }
    for (let k = 0; k < 7; k++) {
      const x = (endCols[k] + endCols[k + 1]) / 2, sc = -x * s // s runs along -x on the north face
      panel(win, f, sc, k === 3 ? 1.9 : 1.3, k === 3 ? 9.2 : z.lo0, k === 3 ? z.lo1 + 0.5 : z.lo1)
      panel(win, f, sc, 1.3, z.up0, z.up1)
      panel(win, fb, sc, 2.4, PODIUM + 0.3, BASE - 1.1)
    }
  }

  // ---------------------------------------------------------- the tower: square pedestal
  prism(lime, null, chamfer(rect(-PED, -PED, PED, PED), 0.3), RIDGE - 2.0, PEDTOP - 0.6)
  prism(trim, null, chamfer(rect(-PED - 0.15, -PED - 0.15, PED + 0.15, PED + 0.15), 0.3), PEDTOP - 0.6, PEDTOP)
  const pc = chamfer(rect(-PED - 0.55, -PED - 0.55, PED + 0.55, PED + 0.55), 0.35)
  prism(trim, trim, pc, PEDTOP, PEDCORN)
  capRing(trim, pc, PEDTOP, false)
  // a paired window on each face of the pedestal (photos c01, c02)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const f: Face = { o: [nx * PED, ny * PED, 0], n: [nx, ny] }
    for (const s of [-0.55, 0.55]) panel(win, f, s, 0.85, 31.6, 35.9)
  }
  // ---------------------------------------------------------- the round lantern (Lysicrates)
  lathe(trim, 0, 0, [[4.95, PEDCORN], [4.95, PEDCORN + 0.45], [4.6, LAN0], [3.3, LAN0]], 16)
  lathe(lime, 0, 0, [[3.3, LAN0], [3.3, LANCOL + 0.6]], 16, 22.5, 382.5)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI
    column(trim, trim, 4.1 * Math.cos(a), 4.1 * Math.sin(a), 0.36, LAN0, LANCOL + 0.6, { capH: 0.75, base: 0, flare: true, segs: 8, ax: 0.9, ay: 0.9 })
  }
  // tall windows on the core between the columns, a small one above each
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * 2 * Math.PI
    const f: Face = { o: [3.3 * Math.cos(a), 3.3 * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] }
    panel(win, f, 0, 0.95, 42.6, 46.9, 0.08)
    panel(win, f, 0, 0.8, 47.5, 48.3, 0.08)
  }
  // entablature and cornice
  lathe(trim, 0, 0, [[3.3, LANCOL + 0.6], [4.55, LANCOL + 0.6], [4.55, 50.5], [4.95, 50.9], [4.95, LANENT], [4.3, LANENT]], 16)
  // the cresting: a ring of upright acanthus leaves round the cupola's rim
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), t: XY = [-s, c]
    const r0 = 4.7, r1 = 4.85, hw = 0.45
    const A: V3 = [c * r0 + t[0] * -hw, s * r0 + t[1] * -hw, LANENT], B: V3 = [c * r0 + t[0] * hw, s * r0 + t[1] * hw, LANENT], C: V3 = [c * r1, s * r1, CREST]
    triO(trim, A, B, C, [c, s, 0.2])
    triO(trim, A, B, C, [-c, -s, -0.2])
  }
  // the cupola roof, then the finial's four leaf tiers and the spire
  lathe(trim, 0, 0, [[4.3, LANENT], [3.7, 51.9], [2.6, 52.4], [1.5, 52.9], [0.8, 53.3]], 16)
  lathe(trim, 0, 0, [
    [0.8, 53.3], [1.2, 53.8], [1.25, 54.2], [0.55, 54.5], [0.95, 54.9], [0.95, 55.2], [0.45, 55.5],
    [0.75, 55.9], [0.75, 56.2], [0.32, 56.5], [0.5, 56.9], [0.5, 57.1], [0.2, 57.5],
  ], 12)
  lathe(trim, 0, 0, [[0.2, 57.5], [0.17, 59.5], [0.07, SPIRE - 0.1], [0, SPIRE]], 8)
  // four scrolls between the cupola roof and the lowest leaf tier
  for (let k = 0; k < 4; k++) {
    const a = ((k + 0.5) / 4) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), t: V3 = [-s, c, 0]
    const P = (r: number, zz: number): V3 => [c * r, s * r, zz]
    const quad = [P(0.9, 53.3), P(2.7, 52.3), P(2.3, 52.9), P(1.1, 54.0)]
    quadO(trim, quad[0], quad[1], quad[2], quad[3], t)
    quadO(trim, quad[0], quad[1], quad[2], quad[3], [-t[0], -t[1], 0])
  }

  // ---------------------------------------------------------- materials and night
  // Floodlit from the ground: walls and columns lit, the tower too; faces
  // looking up catch little.
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.2 : p[2] < EAVES + 1 ? 1 : 0.85)
  const limestone = { ...finish(LIME, 0xe6e0d2), floodlight: lit }
  const trimLit = { ...finish('tn-limestone-trim', 0xf3eee3), floodlight: lit }
  return finishGlb('Tennessee State Capitol', [
    { part: lime, material: limestone },
    { part: trim, material: trimLit },
    { part: roof, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: shade, material: { ...finish('tn-portico-shade', 0xc2baa9), floodlight: lit } },
  ], { bearing: 331.4, height: SPIRE, replaces: ['way/249147622', 'way/249147629', 'way/249147631', 'way/249147632', 'way/249147633'] }, 6500)
}

if (import.meta.main) await writeModel('nash-tennessee-state-capitol', build())
