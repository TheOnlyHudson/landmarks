/**
 * Southeast Financial Center (Wells Fargo Center; Wachovia Financial Center
 * 2000s), Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-southeast-financial-center.ts
 *
 * Skidmore, Owings & Merrill, 1984; Florida's tallest building until 2003.
 * A 55-storey slab of pale granite with square punched windows, its north-east
 * edge cut into a sawtooth of seven steps that runs the full height, and its
 * crown stepping down in 8 m terraces toward the north-east and south-east
 * corners, so the top reads as a stepped wedge pointing at the bay. A
 * narrow vertical slot splits the west face. West of the tower a white steel
 * space-frame canopy roofs the plaza at about 55 m, spanning to a 17-level
 * annex (offices over parking) faced in the same pale stone.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 358.5:
 * the OSM outlines' edges run 1.4-1.6° anticlockwise of the compass, and
 * are axis-aligned to within 0.1 m in this frame. Origin = centroid of the
 * tower outline way/398246359.
 *
 * Evidence
 * - OSM way/398246359 (Southeast Financial Center, 55 levels, height 233,
 *   wikidata Q1749785): W face x = -17.0, N face y = 35.3, S face y = -28.2,
 *   E face x = 24.6; the north-east staircase of six steps (x 24.6 → -3.6,
 *   y 8.6 → 35.3, ~4.7 x 4.45 m per step); a notch off the south-east corner.
 *   Part way/1105085923 (233): the same, with the south-east corner cut into
 *   a second staircase from (24.6, -0.4) to (-2.7, -28.2), ~4.55 x 4.6 m per
 *   step. Part way/1105085924 (236): the roof penthouse x -10.3..1.6,
 *   y -9.8..17.5. Annex way/398246357 (17 levels): x -110..-53.9,
 *   y -32..38. Plaza roof way/398246365 (building=roof, levels 16-17):
 *   x -53.9..-17.0, y -30.2..35.3.
 *   Not included: relation/13331724 and its inner way/467881430 are the
 *   three-storey podium and 18-level part of Bayfront Plaza across SE 2nd
 *   Street to the north; the model does not reach them.
 * - USGS 3DEP lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown 2019),
 *   1 m grid read in this frame. Heights above the lowest street (east side,
 *   ~1 m above the grid's ground_min): main roof 230; penthouse 233.5-234.5
 *   (spikes to 239 are plant); crown terraces in 8 m steps 221, 213, 205,
 *   197, 189, 181. The south-east terraces are staircase contours: the part
 *   way/1105085923 outline is the 221 contour, the main roof one step inside
 *   it, and each lower terrace one step further out, down to 181 at the
 *   south-east corner. On the north-east staircase a 3-3.5 m deep strip
 *   along each step is lower than the roof, falling 221, 213, 205, 197, 189,
 *   181 from the east face to the north face. The west third of the roof
 *   returned no points (likely tops flagged as noise, class 18, as seen in
 *   other batches' lidar); the photos from the west show its top level with the
 *   rest, so it is drawn at 230. Annex roof 59 (rim cells 55-56). Canopy
 *   top 55; the lidar sees no canopy over a four-sided area from
 *   (-42, -5)/(-42, 13) to the tower face at y -24 and 31, so the canopy is
 *   drawn as a C around that opening.
 * - Published (Wikipedia "Southeast Financial Center", CTBUH): 233 m
 *   (764 ft), 55 floors, completed 1984, SOM; space-frame plaza.
 * - Mapterhorn terrain: falls ~2 m from the annex's west side to Biscayne
 *   Boulevard; y = 0 is the low east side, so the annex's west wall sinks
 *   about 1.5 m into the ground.
 * - Photos:
 *   · "Southeast Financial Center, June 2016.jpg", Jedi94, CC BY-SA 4.0 (from
 *     Bayfront Park to the east-north-east),
 *     https://commons.wikimedia.org/wiki/File:Southeast_Financial_Center,_June_2016.jpg
 *   · "Southeast Financial Center.jpg", B137, CC0 (from the north-east: the
 *     staircase and crown in sun),
 *     https://commons.wikimedia.org/wiki/File:Southeast_Financial_Center.jpg
 *   · "Wachovia Financial Center, Downtown Miami, viewed from the northeast,
 *     March 2011.jpg", Daniel Christensen, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Wachovia_Financial_Center,_Downtown_Miami,_viewed_from_the_northeast,_March_2011.jpg
 *   · "Wachoviatowerback.jpg", Marc Averette, public domain (from the west:
 *     the annex in front, the slot up the west face),
 *     https://commons.wikimedia.org/wiki/File:Wachoviatowerback.jpg
 *   · "Wachovia Financial Center from the south.jpg", Daniel Christensen,
 *     CC BY-SA 3.0 (annex, canopy and tower from the south-west),
 *     https://commons.wikimedia.org/wiki/File:Wachovia_Financial_Center_from_the_south.jpg
 *   · "Wachoviatowerside.jpg", Marc Averette, public domain (from the east),
 *     https://commons.wikimedia.org/wiki/File:Wachoviatowerside.jpg
 *   · "Southeast Financial Center", Phillip Pessar, CC BY 2.0 (the canopy
 *     from below), https://www.flickr.com/photos/25955895@N03/32362696037
 *
 * Measured: all heights (lidar); plan (OSM, regularised to even steps).
 * Published: total height, floor count.
 * Estimated: the bay (4.6 m) and the three-floor window groups (12 m, glass
 * 10 m, panels 3.7 m wide on the 4.6 m bay; regrouped at review), from the photos' square windows on a ~4.2 m floor; the slot's
 * width (5 m) and depth (6 m, deepened at review so it reads as the dark slit of the west photo), from the west photo and the NAIP lean; the
 * 13 m lobby; the annex window grouping; the canopy depth (47.5-55 m, from
 * the south photo); the white lip along each crown step (drawn bolder than
 * the real parapet so the terraces read at phone size). Invented: none beyond simplification.
 *
 * Night: tower and annex windows are `window`, the lobby `entrance`; the
 * canopy is `glass` and stays dark. No licensed night photo was found, so no
 * crown lighting is drawn.
 *
 * Doubts: the north face west of the staircase and the west third of the
 * roof have no lidar returns; the annex's punched windows are drawn as
 * coarse two-by-two groups rather than the real fine grid; the canopy's
 * hanging lattice edges (seen from the south) are left out, and the canopy
 * is a translucent slab, not a lattice.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 358.5
const ANCHOR = { lng: -80.18772924, lat: 25.77217795 }

type XY = [number, number]

const granite = new Part(), win = new Part(), roof = new Part(), canopy = new Part(), frame = new Part(), lobby = new Part()

// ─── tower plan and crown, as a height field on a staircase lattice ───
const WX = -17.0, EX = 24.6, SY = -28.2, NY = 35.3
const T = [181, 189, 197, 205, 213, 221, 230] // terrace tops, lowest first
const PENT = { x0: -10.3, x1: 1.6, y0: -9.8, y1: 17.5, top: 234.5 }
const SLOT = { y0: 1.05, y1: 6.05, depth: 6 } // centred on the west face; a deep glazed recess
// The staircase x lines (shared by both staircases, east to west) and their y lines.
const SX = [20.0, 15.35, 10.7, 6.1, 1.5, -3.15]
const NE_Y = [8.6, 13.05, 17.5, 21.95, 26.4, 30.85] // north-east steps, from the east face north
const SE_Y = [-0.45, -5.075, -9.7, -14.325, -18.95, -23.575] // south-east steps, from the east face south
const NE_DEPTH = 4.5 // lidar 3-3.5; widened so the stepped crown reads at phone size

const xs = [...new Set([WX, WX + SLOT.depth, EX, ...SX, ...SX.map((x) => x - NE_DEPTH)].map((v) => +v.toFixed(3)))].sort((a, b) => a - b)
const ys = [...new Set([SY, NY, ...NE_Y, ...SE_Y, SLOT.y0, SLOT.y1].map((v) => +v.toFixed(3)))].sort((a, b) => a - b)

/** Height of the tower at a plan point, or 0 outside it. */
function towerHeight(x: number, y: number): number {
  if (x < WX || x > EX || y < SY || y > NY) return 0
  if (x < WX + SLOT.depth && y > SLOT.y0 && y < SLOT.y1) return 0 // the west slot
  // north-east staircase: step i spans NE_Y[i-1]..NE_Y[i]; the outline there is SX[i-1]
  let ne = 99
  for (let i = 1; i <= 6; i++) {
    const ylo = NE_Y[i - 1], yhi = i < 6 ? NE_Y[i] : NY
    if (y > ylo && y < yhi) {
      if (x > SX[i - 1]) return 0
      if (x > SX[i - 1] - NE_DEPTH) ne = 6 - i
    }
  }
  if (x > 20.0 && y < -23.575) return 0 // the notch off the south-east corner
  // south-east contours
  const a = SX.filter((v) => v < x).length, b = SE_Y.filter((v) => v > y).length
  const band = Math.max(0, a + b - 5)
  const se = Math.max(0, 6 - band)
  return T[Math.min(se, ne)]
}

type Wall = { a: XY; b: XY; z0: number; z1: number }
const walls: Wall[] = []
{
  const nx = xs.length - 1, ny = ys.length - 1
  const H: number[][] = []
  for (let i = 0; i < nx; i++) {
    H.push([])
    for (let j = 0; j < ny; j++) H[i].push(towerHeight((xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2))
  }
  const h = (i: number, j: number) => (i < 0 || j < 0 || i >= nx || j >= ny ? 0 : H[i][j])
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const z = H[i][j]
    if (!z) continue
    const x0 = xs[i], x1 = xs[i + 1], y0 = ys[j], y1 = ys[j + 1]
    roof.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
    // walls toward lower neighbours, counter-clockwise seen from outside
    const sides: [number, XY, XY][] = [
      [h(i, j - 1), [x0, y0], [x1, y0]], // south
      [h(i + 1, j), [x1, y0], [x1, y1]], // east
      [h(i, j + 1), [x1, y1], [x0, y1]], // north
      [h(i - 1, j), [x0, y1], [x0, y0]], // west
    ]
    for (const [zn, a, b] of sides) if (zn < z) walls.push({ a, b, z0: zn, z1: z })
  }
}

/** Merge wall pieces that continue each other along the same line over the same heights. */
function mergeWalls(ws: Wall[]): Wall[] {
  const out: Wall[] = []
  const key = (w: Wall) => `${w.z0}|${w.z1}`
  const rest = [...ws]
  while (rest.length) {
    let w = rest.pop()!
    let grown = true
    while (grown) {
      grown = false
      for (let k = 0; k < rest.length; k++) {
        const v = rest[k]
        if (key(v) !== key(w)) continue
        const dirW = [w.b[0] - w.a[0], w.b[1] - w.a[1]], dirV = [v.b[0] - v.a[0], v.b[1] - v.a[1]]
        const cross = dirW[0] * dirV[1] - dirW[1] * dirV[0], dot = dirW[0] * dirV[0] + dirW[1] * dirV[1]
        if (Math.abs(cross) > 1e-6 || dot <= 0) continue
        if (Math.hypot(v.a[0] - w.b[0], v.a[1] - w.b[1]) < 1e-6) { w = { ...w, b: v.b }; rest.splice(k, 1); grown = true; break }
        if (Math.hypot(v.b[0] - w.a[0], v.b[1] - w.a[1]) < 1e-6) { w = { ...w, a: v.a }; rest.splice(k, 1); grown = true; break }
      }
    }
    out.push(w)
  }
  return out
}

const LOBBY = 13, GROUP = 12, GLASS0 = 0.9, GLASS1 = 10.9, BAY = 4.6, PANEL_W = 3.7 // three storeys a panel
/** A wall in stone with grouped window panels by bay and pairs of floors. */
function facadeWall(w: Wall, opts: { lobby?: boolean } = {}) {
  const [ax, ay] = w.a, [bx, by] = w.b
  const l = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / l, uy = (by - ay) / l, nx = uy, ny = -ux
  granite.quad([ax, ay, w.z0], [bx, by, w.z0], [bx, by, w.z1], [ax, ay, w.z1])
  const at0 = (s: number, z: number, out: number): V3 => [ax + ux * s + nx * out, ay + uy * s + ny * out, z]
  // A white lip along the top of every crown step, so the terraces read at phone size.
  if (w.z1 > T[0] - 1) frame.quad(at0(0, w.z1 - 1.9, 0.15), at0(l, w.z1 - 1.9, 0.15), at0(l, w.z1, 0.15), at0(0, w.z1, 0.15))
  // The west slot: its back wall is all dark glass, its sides plain stone, so it reads as a deep slit.
  const inSlot = (x: number, y: number) => x <= WX + SLOT.depth + 0.01 && y >= SLOT.y0 - 0.01 && y <= SLOT.y1 + 0.01
  if (inSlot(ax, ay) && inSlot(bx, by)) {
    if (Math.abs(ax - (WX + SLOT.depth)) < 0.01 && Math.abs(bx - (WX + SLOT.depth)) < 0.01)
      win.quad(at0(0, w.z0 + 0.3, 0.06), at0(l, w.z0 + 0.3, 0.06), at0(l, w.z1 - 0.9, 0.06), at0(0, w.z1 - 0.9, 0.06))
    return
  }
  const at = (s: number, z: number, out = 0.06): V3 => [ax + ux * s + nx * out, ay + uy * s + ny * out, z]
  const bays = Math.max(1, Math.round(l / BAY))
  const bw = l / bays, pw = Math.min(PANEL_W, bw - 1.3)
  if (pw < 1.2) return
  for (let k = 0; k < bays; k++) {
    const s0 = k * bw + (bw - pw) / 2, s1 = s0 + pw
    for (let g = LOBBY; g < w.z1; g += GROUP) {
      const z0 = Math.max(g + GLASS0, w.z0 + 0.4), z1 = Math.min(g + GLASS1, w.z1 - 0.9)
      if (z1 - z0 > 2) win.quad(at(s0, z0), at(s1, z0), at(s1, z1), at(s0, z1))
    }
    if (opts.lobby && w.z0 === 0) lobby.quad(at(s0 - 0.3, 0.3), at(s1 + 0.3, 0.3), at(s1 + 0.3, LOBBY - 1.5), at(s0 - 0.3, LOBBY - 1.5))
  }
}
for (const w of mergeWalls(walls)) facadeWall(w, { lobby: true })

// Penthouse on the roof.
function box(wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0.4) {
  const ring = (e: number, z: number): V3[] => [[x0 + e, y0 + e, z], [x1 - e, y0 + e, z], [x1 - e, y1 - e, z], [x0 + e, y1 - e, z]]
  wall.loft([ring(0, z0), ring(0, z1 - bev), ring(bev, z1)])
  top.cap(ring(bev, z1), true)
}
box(granite, roof, PENT.x0, PENT.x1, PENT.y0, PENT.y1, T[6] - 0.2, PENT.top)

// ─── annex (way/398246357): 17 levels, offices over parking ───
const AN = { x0: -110.0, x1: -53.9, y0: -32.0, y1: 37.9, top: 59 }
{
  box(granite, roof, AN.x0, AN.x1, AN.y0, AN.y1, 0, AN.top, 0.5)
  // Punched windows, grouped two storeys to a panel; a glazed ground floor.
  const faces: [XY, XY][] = [
    [[AN.x0, AN.y0], [AN.x1, AN.y0]], [[AN.x1, AN.y0], [AN.x1, AN.y1]],
    [[AN.x1, AN.y1], [AN.x0, AN.y1]], [[AN.x0, AN.y1], [AN.x0, AN.y0]],
  ]
  for (const [a, b] of faces) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l, nx = uy, ny = -ux
    const at = (s: number, z: number): V3 => [a[0] + ux * s + nx * 0.06, a[1] + uy * s + ny * 0.06, z]
    const bays = Math.round(l / 7.2), bw = l / bays
    for (let k = 0; k < bays; k++) {
      const s0 = k * bw + bw / 2 - 1.6, s1 = s0 + 3.2
      for (let z = 8; z + 5.4 < AN.top - 5; z += 7) win.quad(at(s0, z), at(s1, z), at(s1, z + 5.4), at(s0, z + 5.4)) // two storeys a panel
      // the top row of small windows under the parapet
      win.quad(at(s0 + 0.5, AN.top - 4.2), at(s1 - 0.5, AN.top - 4.2), at(s1 - 0.5, AN.top - 2.6), at(s0 + 0.5, AN.top - 2.6))
    }
    lobby.quad(at(1.5, 0.3), at(l - 1.5, 0.3), at(l - 1.5, 4.8), at(1.5, 4.8))
  }
}

// ─── space-frame canopy over the plaza (way/398246365) ───
{
  const C: XY[] = [[-53.9, -30.2], [-17.05, -30.2], [-17.05, -24], [-42, -5], [-42, 13], [-17.05, 31], [-17.05, 35.3], [-53.9, 34.8]]
  const z0 = 47.5, z1 = 55 // a deep frame (south photo)
  // translucent top and soffit; a solid white rim carries the outline
  capPoly(canopy, C, z1, true)
  capPoly(canopy, C, z0, false)
  for (let i = 0; i < C.length; i++) {
    const a = C[i], b = C[(i + 1) % C.length]
    if (Math.abs(a[0] + 17.05) < 0.01 && Math.abs(b[0] + 17.05) < 0.01) continue // against the tower
    if (Math.abs(a[0] + 53.9) < 0.01 && Math.abs(b[0] + 53.9) < 0.01) continue // against the annex
    frame.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  // A few bold chords of the space frame on top, so it reads as a frame and not a sheet.
  const bar = (p: XY, q: XY, w = 0.7) => {
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / l * w / 2, ny = (q[0] - p[0]) / l * w / 2
    frame.quad([p[0] - nx, p[1] - ny, z1 + 0.05], [q[0] - nx, q[1] - ny, z1 + 0.05], [q[0] + nx, q[1] + ny, z1 + 0.05], [p[0] + nx, p[1] + ny, z1 + 0.05])
  }
  for (const y of [-24, -17, -10, 20, 27]) {
    const xEnd = y < 0 ? -17.05 - ((y + 24) / 19) * 24.95 : -17.05 - ((31 - y) / 18) * 24.95
    bar([-53.4, y], [Math.min(xEnd, -17.6), y])
  }
  for (const x of [-48, -42.5]) bar([x, -29.7], [x, 34.4])
}

/** Ear-clipping triangulation of a simple polygon, counter-clockwise from above. */
function capPoly(part: Part, poly: XY[], z: number, up = true) {
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
      tri(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tri(poly[idx[0]], poly[idx[1]], poly[idx[2]])
  function tri(a: XY, b: XY, c: XY) {
    if (up) part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else part.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}

const parts = [
  { part: granite, material: finish('sefc-granite', 0xd8d3ca) },
  { part: win, material: { ...PALETTE.window, color: 0x758ea5 } },
  { part: roof, material: PALETTE.roof },
  { part: canopy, material: { ...PALETTE.glass, color: 0xdde6ec, opacity: 0.35, doubleSided: true } },
  { part: frame, material: PALETTE.trim },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x7b8c99 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Southeast Financial Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: PENT.top,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/398246359', 'way/1105085923', 'way/1105085924', 'way/398246357', 'way/398246365'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/mia-southeast-financial-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
