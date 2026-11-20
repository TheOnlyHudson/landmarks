/**
 * Christ Episcopal Church, Raleigh (Richard Upjohn, 1848–53; tower 1859–61),
 * with its attached parish buildings: procedural, CC0-1.0.
 * bun generators/ral-christ-church.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.3: OSM's
 * outline (way/47776441, WakeGIS) is square to that axis, so model +x is the
 * liturgical east. Origin: the area centroid of way/47776441
 * (-78.6374288, 35.7808506). That one way covers the church AND the parish
 * house complex east of it (one WakeGIS footprint), so the model draws both:
 * the church in full, the parish buildings as plain masses (see doubts).
 *
 * Ground: Mapterhorn (z13; z14–15 are missing over Raleigh) falls ~2 m
 * west to east, from ~107.4 m at the west front to ~105.3 m at the east end
 * of the parish block, the lowest ground under the footprint (y = 0). HABS
 * sheet 4 shows the same fall along the church. The church's own ground is
 * G = 1.9 m and its heights are measured from it; the parish buildings stand
 * on PG = 0.6. Walls run down to y = 0. Elevation 0.
 *
 * Plan (OSM, in the model frame): nave x -49.0 … -34.8, y -14.3 … -3.2;
 * transepts x -34.8 … -23.4, y -20.2 … 2.8; chancel x -23.4 … -17.8,
 * y -14.2 … -4.3; tower and its arcaded porch x -49.1 … -41.3,
 * y -3.2 … 9.3. OSM is traced at the eaves, so the walls stand ~0.3 m
 * inside it. HABS NC-92-RAL-4 sheet 1 (main floor plan) confirms the cross:
 * nave 35'2" wide and 47' long to the crossing, transepts 69'11" across and
 * 35'2" deep, chancel 17'10" deep, 95'3" overall; the tower ~16' square
 * with angle buttresses, NW of the west front, joined to the nave by a
 * three-bay open arcade 19'10" long; a vestry north of the chancel.
 *
 * Heights (published, HABS measured drawings): sheet 7 of 20 (1965
 * addendum, east elevation) dimensions the nave ridge 42'6" (12.95 m) and
 * the eaves 24'7" (7.49 m) above grade; scaled from the same sheet and
 * sheets 3–6 (1/8" = 1'-0", the plan's 35'2" as the ruler): tower shaft and
 * cornice 16.3 m; tower string courses 6.7 and 11.5 m; belfry lancet 12.0–15.2 m;
 * nave lancets 1.35 m wide, sill 2.5, head 6.3; the triple lancets on the
 * west front and transept ends sill 6.1, heads 9.7 / 11.3 (centre); doors
 * 4.1 m to the arch point; arcade roof 4.0–5.7 m. Chancel eaves as the nave,
 * same 45° pitch (its ridge a little lower, as it is narrower).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/ral-christ-church):
 *  f1 "Christ Church - Raleigh, North Carolina.JPG", Farragutful,
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Christ_Church_-_Raleigh,_North_Carolina.JPG
 *     — the west front from the south-west: grey ashlar, brownstone
 *     dressings, red tile roof, pinkish-brown stone spire.
 *  l1 "Christ Church on Capitol Square, Raleigh, NC (28221600688).jpg",
 *     Warren LeMay, CC0, https://commons.wikimedia.org/wiki/File:Christ_Church_on_Capitol_Square,_Raleigh,_NC_(28221600688).jpg
 *     — the tower from the north-west: angle buttresses, belfry lancet,
 *     arcade.
 *  w1 "Christepiscopalravenscroftchurch.jpg", Willthacheerleader18,
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Christepiscopalravenscroftchurch.jpg
 *     — tower, arcade and west gable from the north-west.
 *  HABS NC,92-RAL,4- sheets 1–7, 9 (Library of Congress, public domain),
 *     https://commons.wikimedia.org/wiki/File:Christ_Episcopal_Church,_120_East_Edenton_Street,_Raleigh,_Wake_County,_NC_HABS_NC,92-RAL,4-_(sheet_1_of_6).tif
 *     and siblings (sheet_2…sheet_9_of_6): plans, all four elevations,
 *     longitudinal sections.
 *  pc "Postcard depicting Christ Episcopal Church from Capitol Square;
 *     Raleigh, NC - PhC 205 4 073.jpg", State Archives of North Carolina,
 *     no known restrictions: the south side, three nave bays.
 * Aerial: USGS NAIP (public domain): the cross plan, red tile roofs, and
 * the parish buildings' tile-edged flat roofs.
 * Look-only: none used.
 * No lidar covers Wake County (3DEP); no Mapillary token here.
 *
 * Parish buildings (estimated): the NAIP shows three blocks with red tile
 * mansard edges round flat tops (grey on the north range, white on the east
 * block and the south wing) and a white flat-roofed link. No licensed photo
 * shows them; walls are drawn in the church's grey stone, two storeys, eaves
 * PG + 7.0, flat tops PG + 9.0; the link PG + 5.0. Their window panels are
 * grouped, plain and invented in rhythm.
 *
 * Left out: the rooster's shape (a small vane plate), the iron fence, steps,
 * the bell louvres' slats, stone coursing, the chimney on the vestry.
 * Spire (rework, Nov 2026; estimated): no published height exists (NRHP
 * nomination WA0009 and SAH Archipedia give none). The first pass followed a
 * HABS sheet-3 scaling (tip 27.3 m, ~11 m of spire on a 4.6 m base), which
 * read short and stubby beside every photo. Now: a slender octagonal broach
 * spire, 3.7 m across the flats at its base (~0.7 of the tower shaft, as in
 * w1 and l1), 15.2 m from the cornice to the ball, so ~0.93 of the tower
 * below it; tip G + 31.5, rooster to ~G + 34. The height comes from a pinhole
 * fit of w1 (HABS string courses 6.7 / 11.5 m and cornice 16.3 m as control
 * points, focal 28–35 mm equivalent), which puts the spire at 14–19 m; HABS
 * sheet 3's drawn proportion (spire 0.71 of the tower, height 4.2 base widths)
 * is the lower bound. The lowest 1.2 m curves in and four broaches rise
 * from the square's corners (NRHP: "continuous transition ... inward-curving
 * surfaces"). Ball and vane slightly oversized to read at phone size.
 * Stone (rework): retuned from f1's sunlit west front (#71644f, a warm
 * brown-grey) and l1, pulled to the palette's lightness: #bcab92 (was the
 * paler cream #d8cdbb); brownstone #a57d68 from the dressings and spire.
 * Doubts: the spire's height (estimated, ±2 m); the parish buildings'
 * heights, walls and windows (no photo); the vestry is folded into the flat
 * link; the tower's angle buttresses are drawn as paired orthogonal
 * buttresses.
 * The church is a small part of the footprint, so at 80 px the parish
 * block dominates; the spire still reads.
 * Night: the lancets are `window` (lit from inside at evening services); no
 * floodlighting evident.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, rect, flatShape, extrudeShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY, beam, cross } from './ral-holy-name-of-jesus-cathedral'

/** A pointed (equilateral) lancet on a face: w wide, sill z0, point z1. */
export function lancetShape(s: number, w: number, z0: number, z1: number, segs = 5): XY[] {
  const r = w, zs = z1 - w * Math.sqrt(3) / 2
  const right = arc(s - w / 2, zs, r, 0, 60, segs) // from the right springing up to the point
  const left = arc(s + w / 2, zs, r, 120, 180, segs) // from the point down to the left springing
  return [[s - w / 2, z0], [s + w / 2, z0], ...right.slice(1, -1), [s, z1], ...left.slice(1)]
}
export function lancet(p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.06) {
  flatShape(p, f, lancetShape(s, w, z0, z1), d)
}
/** A mansard block: walls to ze, a sloped band in to `inset` at zt, flat top. */
function mansard(wall: Part, slope: Part, flat: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zt: number, inset: number, ov = 0.3) {
  box(wall, x0, y0, x1, y1, 0, ze, null)
  const o = rect(x0 - ov, y0 - ov, x1 + ov, y1 + ov), i = rect(x0 + inset, y0 + inset, x1 - inset, y1 - inset)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const a: V3 = [o[k][0], o[k][1], ze - 0.1], b: V3 = [o[l][0], o[l][1], ze - 0.1], c: V3 = [i[l][0], i[l][1], zt], d: V3 = [i[k][0], i[k][1], zt]
    const mx = (o[k][0] + o[l][0]) / 2 - (x0 + x1) / 2, my = (o[k][1] + o[l][1]) / 2 - (y0 + y1) / 2
    quadO(slope, a, b, c, d, [Math.sign(Math.abs(mx) > Math.abs(my) ? mx : 0), Math.sign(Math.abs(my) >= Math.abs(mx) ? my : 0), 1])
  }
  // the eave's underside
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const w = rect(x0, y0, x1, y1)
    quadO(slope, [o[k][0], o[k][1], ze - 0.1], [o[l][0], o[l][1], ze - 0.1], [w[l][0], w[l][1], ze - 0.1], [w[k][0], w[k][1], ze - 0.1], [0, 0, -1])
  }
  box(flat, i[0][0], i[0][1], i[2][0], i[2][1], zt - 0.3, zt + 0.05, flat)
}

// ============================================================ dimensions
const G = 1.9 // the church's ground above the lowest point under the footprint
const PG = 0.6 // the parish buildings' ground
const EA = G + 7.5, RN = G + 13.0 // eaves and ridge (HABS)
const YC = -8.75 // nave axis
const NW = 5.25 // nave half width at the walls
const XW = -48.7, XT0 = -34.6, XT1 = -23.6, XE = -18.1 // west front, transept walls, east end
const TS = -19.9, TN = 2.5 // transept ends
const TXC = (XT0 + XT1) / 2, THW = (XT1 - XT0) / 2
const CW = 4.7 // chancel half width
const SPIRE_TIP = G + 31.5 // the spire's tip (base of the ball): estimated, see the header
const SPIRE_HALF = 1.85 // half the spire's width across the flats at its base

function build() {
  const stone = new Part(), brown = new Part(), tile = new Part(), win = new Part(), door = new Part(), flat = new Part()

  // ============================================================ the church body
  // the walls' gable tops sit 0.15 m inside the roof slab, so no face is shared with it
  const gableSec = (y0: number, y1: number, ze: number, zr: number): XY[] => [[y0, 0], [y1, 0], [y1, ze - 0.15], [(y0 + y1) / 2, zr - 0.15], [y0, ze - 0.15]]
  // nave, running to the crossing
  prismX(stone, XW, TXC, gableSec(YC - NW, YC + NW, EA, RN))
  roofX(tile, XW - 0.35, TXC, YC, NW, EA, RN, 0.45, 0.3)
  // transepts
  prismY(stone, TS, TN, gableSec(XT0, XT1, EA, RN).map(([a, b]) => [a, b] as XY))
  roofY(tile, TS - 0.35, TN + 0.35, TXC, THW, EA, RN, 0.45, 0.3)
  // chancel: same eaves and pitch
  const RC = EA + (RN - EA) * (CW / NW)
  prismX(stone, TXC, XE, gableSec(YC - CW, YC + CW, EA, RC))
  roofX(tile, TXC, XE + 0.35, YC, CW, EA, RC, 0.45, 0.3)

  // gable copings (brownstone) and crosses
  type GF = { f: Face; hw: number; ze: number; zr: number; crossOn: boolean }
  const gables: GF[] = [
    { f: { o: [XW, YC, 0], n: [-1, 0] }, hw: NW, ze: EA, zr: RN, crossOn: true },
    { f: { o: [TXC, TS, 0], n: [0, -1] }, hw: THW, ze: EA, zr: RN, crossOn: true },
    { f: { o: [TXC, TN, 0], n: [0, 1] }, hw: THW, ze: EA, zr: RN, crossOn: true },
    { f: { o: [XE, YC, 0], n: [1, 0] }, hw: CW, ze: EA, zr: RC, crossOn: false },
  ]
  for (const g of gables) {
    const t: XY = [-g.f.n[1], g.f.n[0]]
    const P = (s: number, z: number, d: number): V3 => [g.f.o[0] + t[0] * s + g.f.n[0] * d, g.f.o[1] + t[1] * s + g.f.n[1] * d, z]
    for (const sg of [-1, 1]) beam(brown, P(sg * (g.hw + 0.35), g.ze - 0.1, -0.25), P(0, g.zr + 0.15, -0.25), 0.33, 0, 0.45)
    // kneelers at the gable feet
    for (const sg of [-1, 1]) {
      const a = P(sg * (g.hw + 0.4) - 0.0, 0, 0), c = P(sg * (g.hw - 0.6), 0, -0.6)
      box(brown, Math.min(a[0], c[0]), Math.min(a[1], c[1]), Math.max(a[0], c[0]), Math.max(a[1], c[1]), g.ze - 0.6, g.ze + 0.1)
    }
    if (g.crossOn) {
      const ap = P(0, 0, -0.25)
      cross(brown, ap[0], ap[1], g.zr + 0.4, 1.6, 0.95, 0.24, Math.abs(g.f.n[1]) > 0.5)
    }
  }

  // ============================================================ buttresses
  // a two-stage buttress at (x, y) projecting along (nx, ny), `w` wide
  const buttress = (x: number, y: number, nx: number, ny: number, top: number, w = 0.75) => {
    const st = [[0.95, G + 3.2], [0.65, top]]
    let z0 = 0
    for (const [pr, z1] of st) {
      const tx = -ny, ty = nx
      const xs = [x + tx * w / 2, x - tx * w / 2, x + nx * pr + tx * w / 2, x + nx * pr - tx * w / 2]
      const ys = [y + ty * w / 2, y - ty * w / 2, y + ny * pr + ty * w / 2, y + ny * pr - ty * w / 2]
      box(brown, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), z0, z1)
      z0 = z1
    }
  }
  // nave sides: two intermediate buttresses (HABS sheet 4: 5.6 and 10.2 m from the west face)
  for (const dx of [5.6, 10.2]) {
    buttress(XW + dx, YC - NW, 0, -1, G + 6.6)
    if (dx > 6) buttress(XW + dx, YC + NW, 0, 1, G + 6.6)
  }
  // angle buttresses at the corners of the west front, the transept ends and the chancel
  const corner = (x: number, y: number, sx: number, sy: number) => {
    buttress(x - sx * 0.45, y, 0, sy, G + 5.6, 0.8)
    buttress(x, y - sy * 0.45, sx, 0, G + 5.6, 0.8)
  }
  corner(XW, YC - NW, -1, -1)
  corner(XT0, TS, -1, -1); corner(XT1, TS, 1, -1); corner(XT0, TN, -1, 1); corner(XT1, TN, 1, 1)
  corner(XE, YC - CW, 1, -1); corner(XE, YC + CW, 1, 1)

  // ============================================================ windows and doors
  const dressed = (f: Face, s: number, w: number, z0: number, z1: number) => {
    lancet(brown, f, s, w + 0.6, z0 - 0.25, z1 + 0.35, 0.04)
    lancet(win, f, s, w, z0, z1, 0.08)
  }
  const triple = (f: Face) => {
    dressed(f, 0, 1.0, G + 6.1, G + 11.3)
    for (const s of [-1.55, 1.55]) dressed(f, s, 0.9, G + 6.1, G + 9.7)
  }
  const portal = (f: Face, s = 0) => {
    lancet(brown, f, s, 2.75, G - 0.1, G + 4.6, 0.05)
    lancet(door, f, s, 1.85, G, G + 4.1, 0.1)
  }
  // west front: door and triple lancet
  { const f = gables[0].f; triple(f); portal(f) }
  // transept ends: triple lancet and a door
  for (const g of [gables[1], gables[2]]) { triple(g.f); portal(g.f) }
  // chancel east: the triple lancet sits lower (HABS sheet 7)
  {
    const f = gables[3].f
    dressed(f, 0, 1.0, G + 3.8, G + 10.6)
    for (const s of [-1.5, 1.5]) dressed(f, s, 1.0, G + 3.8, G + 9.6)
  }
  // nave sides: three lancets south, two north (the arcade takes the first)
  for (const dx of [3.2, 7.9, 12.3]) {
    dressed({ o: [XW + dx, YC - NW, 0], n: [0, -1] }, 0, 1.35, G + 2.5, G + 6.3)
    if (dx > 4) dressed({ o: [XW + dx, YC + NW, 0], n: [0, 1] }, 0, 1.35, G + 2.5, G + 6.3)
  }
  // transept arms: one lancet in each west and east face
  for (const [yc, ok] of [[(TS + YC - NW) / 2, true], [(TN + YC + NW) / 2, true]] as [number, boolean][]) {
    if (!ok) continue
    dressed({ o: [XT0, yc, 0], n: [-1, 0] }, 0, 1.3, G + 2.5, G + 6.4)
    dressed({ o: [XT1, yc, 0], n: [1, 0] }, 0, 1.3, G + 2.5, G + 6.4)
  }
  // chancel south side
  dressed({ o: [(XT1 + XE) / 2, YC - CW, 0], n: [0, -1] }, 0, 1.3, G + 2.6, G + 6.4)

  // ============================================================ the tower and spire
  {
    const cx = -45.95, cy = 6.25, h = 2.35 // shaft 4.7 m square
    const TOP = G + 16.3
    box(stone, cx - h, cy - h, cx + h, cy + h, 0, TOP, null)
    // string courses and the cornice
    for (const z of [G + 6.7, G + 11.5]) box(brown, cx - h - 0.12, cy - h - 0.12, cx + h + 0.12, cy + h + 0.12, z - 0.3, z)
    box(brown, cx - h - 0.45, cy - h - 0.45, cx + h + 0.45, cy + h + 0.45, TOP - 0.5, TOP)
    // angle buttresses, stepping back at the string courses
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const X = cx + sx * h, Y = cy + sy * h
      const steps: [number, number, number][] = [[0.75, 0, G + 6.7], [0.55, G + 6.7, G + 11.5], [0.35, G + 11.5, G + 14.6]]
      for (const [pr, z0, z1] of steps) {
        // one along x (on the north/south face), one along y (on the east/west face)
        const w = 0.8
        box(brown, Math.min(X, X - sx * w), Math.min(Y, Y + sy * pr), Math.max(X, X - sx * w), Math.max(Y, Y + sy * pr), z0, z1)
        box(brown, Math.min(X, X + sx * pr), Math.min(Y, Y - sy * w), Math.max(X, X + sx * pr), Math.max(Y, Y - sy * w), z0, z1)
      }
    }
    const faces: Face[] = [{ o: [cx, cy - h, 0], n: [0, -1] }, { o: [cx - h, cy, 0], n: [-1, 0] }, { o: [cx, cy + h, 0], n: [0, 1] }, { o: [cx + h, cy, 0], n: [1, 0] }]
    for (const f of faces) {
      // belfry: a louvred lancet in a brownstone surround
      lancet(brown, f, 0, 1.75, G + 11.85, G + 15.55, 0.04)
      lancet(door, f, 0, 1.15, G + 12.0, G + 15.2, 0.08)
      // the middle stage's single lancet; twin lancets in the lowest
      if (f.n[1] !== -1) dressed(f, 0, 0.75, G + 7.6, G + 9.8)
      for (const s of [-0.65, 0.65]) if (f.n[1] !== -1) dressed(f, s, 0.6, G + 1.4, G + 3.6)
    }
    // the octagonal stone broach spire, faces square to the tower: 3.7 m across
    // the flats at the base, 15.2 m tall (about 0.93 of the tower below it),
    // its lowest 1.2 m curving in (Upjohn's concave broach, NRHP)
    const SB = TOP, ST = SPIRE_TIP
    const r0 = SPIRE_HALF / Math.cos(Math.PI / 8)
    lathe(brown, cx, cy, [[r0, SB], [r0 - 0.32, SB + 1.2], [0.0, ST]], 8, 22.5, 382.5)
    lathe(brown, cx, cy, [[2.6, SB - 0.01], [r0, SB]], 8, 22.5, 382.5)
    // the broaches: a sloping triangle from each square corner up the diagonal face
    {
      const zb = SB + 2.6
      const rz = (r0 - 0.32) * (1 - (zb - SB - 1.2) / (ST - SB - 1.2)) // radius at the broach tip
      const ap = rz * Math.cos(Math.PI / 8) * 0.97, q = SPIRE_HALF * Math.tan(Math.PI / 8)
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const c: V3 = [cx + sx * SPIRE_HALF, cy + sy * SPIRE_HALF, SB]
        const a: V3 = [cx + sx * SPIRE_HALF, cy + sy * q, SB], b: V3 = [cx + sx * q, cy + sy * SPIRE_HALF, SB]
        const t: V3 = [cx + sx * ap / Math.SQRT2, cy + sy * ap / Math.SQRT2, zb]
        triO(brown, c, a, t, [sx, 0, 0.3]); triO(brown, c, b, t, [0, sy, 0.3])
      }
    }
    // finial ball, rod and the rooster vane, a little oversized to read
    lathe(brown, cx, cy, [[0.0, ST - 0.4], [0.4, ST], [0.4, ST + 0.45], [0, ST + 0.75]], 8)
    box(brown, cx - 0.08, cy - 0.08, cx + 0.08, cy + 0.08, ST + 0.75, ST + 1.9)
    box(brown, cx - 0.7, cy - 0.06, cx + 0.55, cy + 0.06, ST + 1.5, ST + 2.5)
  }

  // ============================================================ the arcade between tower and nave
  {
    const x0 = -48.7, x1 = -44.6, y0 = YC + NW, y1 = 6.25 - 2.35
    // lean-to tile roof falling west, on stone piers with three pointed arches each side
    const zl = G + 4.0, zh = G + 5.7
    prismY(stone, y0, y1, [[x0, zl - 1.4], [x1, zl - 1.4], [x1, zh - 0.2], [x0, zl]])
    prismY(tile, y0, y1, [[x0 - 0.4, zl - 0.15], [x1, zh], [x1, zh - 0.3], [x0 - 0.4, zl - 0.45]])
    const n = 3, bay = (y1 - y0) / n
    for (let k = 0; k <= n; k++) {
      const y = y0 + k * bay
      for (const x of [x0 + 0.35, x1 - 0.35]) box(stone, x - 0.35, y - 0.3, x + 0.35, y + 0.3, 0, zl - 1.4)
    }
    // the arches on the west face, drawn as brownstone rings round dark openings
    const f: Face = { o: [x0, (y0 + y1) / 2, 0], n: [-1, 0] }
    for (let k = 0; k < n; k++) {
      const s = -((y0 + k * bay + bay / 2) - (y0 + y1) / 2)
      lancet(brown, f, s, bay - 0.2, G + 2.2, zl - 0.25, 0.04)
    }
    // open the bays: dark panels standing for the shaded porch
    for (let k = 0; k < n; k++) {
      const s = -((y0 + k * bay + bay / 2) - (y0 + y1) / 2)
      flatShape(door, f, [[s - bay / 2 + 0.3, G - 0.1], [s + bay / 2 - 0.3, G - 0.1], ...lancetShape(s, bay - 0.6, G + 2.2, zl - 0.55).slice(2)], 0.07)
    }
    // the east side: a wall with the same three arches, into the churchyard
    const fe: Face = { o: [x1, (y0 + y1) / 2, 0], n: [1, 0] }
    for (let k = 0; k < n; k++) {
      const s = (y0 + k * bay + bay / 2) - (y0 + y1) / 2
      flatShape(door, fe, [[s - bay / 2 + 0.3, G - 0.1], [s + bay / 2 - 0.3, G - 0.1], ...lancetShape(s, bay - 0.6, G + 2.2, zl - 0.55).slice(2)], 0.07)
    }
    // fill the arcade's lower walls below the roof
    prismY(stone, y0, y1, [[x0, 0], [x1, 0], [x1, zl - 1.4], [x0, zl - 1.4]])
  }

  // ============================================================ the parish buildings (estimated)
  {
    const Z = (h: number) => PG + h
    // the link: a flat-roofed block between the chancel and the north range, and on to the east block
    box(stone, -23.4, -4.3, 17.6, 9.0, 0, Z(5.0), flat)
    box(stone, 15.8, -5.0, 37.0, 2.6, 0, Z(5.0), flat)
    // north range, east block and the south wing: tile mansards round flat tops
    mansard(stone, tile, flat, -24.0, 9.0, 21.0, 21.4, Z(7.0), Z(9.0), 3.2)
    mansard(stone, tile, flat, 21.0, 2.6, 43.0, 22.1, Z(7.0), Z(9.0), 3.0)
    mansard(stone, tile, flat, 0.5, -36.7, 15.5, -5.0, Z(7.0), Z(9.0), 3.0)
    // grouped window panels, two storeys per panel band
    const bands = (f: Face, len: number, step: number) => {
      const n = Math.floor((len - 2) / step)
      for (let k = 0; k < n; k++) {
        const s = -((n - 1) * step) / 2 + k * step
        flatShape(win, f, [[s - 0.75, Z(1.2)], [s + 0.75, Z(1.2)], [s + 0.75, Z(2.9)], [s - 0.75, Z(2.9)]], 0.06)
        flatShape(win, f, [[s - 0.75, Z(4.2)], [s + 0.75, Z(4.2)], [s + 0.75, Z(5.9)], [s - 0.75, Z(5.9)]], 0.06)
      }
    }
    bands({ o: [-1.5, 21.4, 0], n: [0, 1] }, 45, 3.6)
    bands({ o: [32.0, 22.1, 0], n: [0, 1] }, 22, 3.6)
    bands({ o: [43.0, 12.3, 0], n: [1, 0] }, 19.5, 3.6)
    bands({ o: [15.5, -20.8, 0], n: [1, 0] }, 31.7, 3.6)
    bands({ o: [0.5, -20.8, 0], n: [-1, 0] }, 31.7, 3.6)
    bands({ o: [8.0, -36.7, 0], n: [0, -1] }, 15, 3.6)
    bands({ o: [32.0, 2.6, 0], n: [0, -1] }, 22, 3.6)
  }

  return finishGlb('Christ Episcopal Church', [
    { part: stone, material: finish('ccr-granite', 0xbcab92) },
    { part: brown, material: finish('ccr-brownstone', 0xa57d68) },
    { part: tile, material: finish('ccr-tile', 0xb2644d) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('ccr-oak', 0x5d4638) },
    { part: flat, material: PALETTE.roof },
  ], { bearing: 2.3, height: SPIRE_TIP + 2.5, replaces: ['way/47776441'] }, 6500)
}

if (import.meta.main) await writeModel('ral-christ-church', build())
