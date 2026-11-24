/**
 * Gillette Stadium, Foxborough, Massachusetts (NFL, New England Patriots;
 * MLS, New England Revolution; opened 2002, HOK Sport; north end rebuilt
 * 2022-23) — procedural, CC0-1.0, no textures.
 * bun generators/bos-gillette-stadium.ts
 *
 * Map frame: x across the field (east sideline +x), y along it towards the
 * north end zone, z up, metres. Placed at bearing 341°, the field's long
 * axis (minimum-area rectangle of OSM's bowl ring, inner way/1349058949).
 * The anchor is the area centroid of the stadium outline (building=stadium
 * relation/18511569: outer ways 172619846 and 1349058950, inner
 * 1349058949): -71.2642654, 42.0909489. The bowl is centred on the field,
 * C = (-8, 0) in this frame.
 *
 * z = 0 is the field, which stands at the level of the parking lots on the
 * east and south (lidar: field 1.6 m over the box's lowest ground, the
 * east lots 0-1.6 m). The ground on the west and north-west is a terrace
 * about 14 m higher (lidar and Mapterhorn agree), so the west outer wall
 * runs down into it, as the real one does. `elevation` is 0. The pitch is
 * the map's (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos:
 * 1. the two tall sideline grandstands (lower bowl, club deck, glazed
 *    suite band, steep upper deck) under a flat light canopy whose navy
 *    steel rim carries a row of floodlight banks on short arms all along
 *    the top (Gagnon 02, Air Force 2012, Max P, Mark Goebel);
 * 2. the low, open ends: the south end's 36 m block with its video board,
 *    and the 2023 north end: a glass-fronted hall carrying the
 *    22,000 sq ft video board and two "Gillette STADIUM" signs
 *    (Zirkel "entrance and lighthouse", Ieditsandyes top seat);
 * 3. the 218 ft lighthouse in front of the north end: a pale square shaft
 *    with dark glazed strips at its corners, a gallery and a glass lantern
 *    (Zirkel; Wikipedia);
 * 4. navy seats everywhere, with red blocks in the east lower bowl and the
 *    club decks (NAIP, Art N. top view, Abzeronow 2021);
 * 5. navy steel ramp towers at the north corners (Max P, Gagnon 04).
 *
 * Evidence
 * - OSM: outline relation/18511569 (above); the lighthouse way/1424851636
 *   (building=yes, man_made=tower), drawn by the model and replaced.
 * - Measured, lidar: USGS 3DEP MA_CentralEastern_1_2021 (flown 2021, before
 *   the north end was rebuilt), 1 m grid sampled in this frame, heights
 *   above the field:
 *   - field wall 44 m either side of the centre line, 63 m to the ends
 *     (OSM ring);
 *   - lower bowl to 8-10 m at 66-70 m out on the sidelines (east 4 m
 *     further out than west), 11 m at the north end, 14 m at the south
 *     (108-110 m out);
 *   - sidelines: club deck 15-18 m at 70-80 m out, the upper deck rising
 *     from 30 m at 84 m out to 41-43 m at 96-98 m, the canopy rim 52-56 m
 *     at 100-110 m, the roofs behind it 40-45 m to the outer wall at
 *     118 m (west) and 122 m (east); a 10-11 m service wing on the east to
 *     150 m out; the stands run about 104 m south and 100 m north of the
 *     centre line;
 *   - south end: a 34-36 m block from 122 to 147 m south, x -42..22; the
 *     video board 44 m at its top, 48 m wide, at 119-121 m; corner blocks
 *     36-40 m;
 *   - north corners: ramp towers 33-36 m (x -98..-86 and 79..91, running
 *     from 104 to 166 m north, OSM outline).
 * - Measured, USGS NAIP orthophoto (0.5 m): plan; seat colours.
 * - Published (Wikipedia, "Gillette Stadium", read 2026-11): opened 2002,
 *   HOK Sport; the 2022-23 renovation added the north-end video board,
 *   22,000 sq ft, and the lighthouse, which "reaches 218 feet at the top".
 * - Photos (Wikimedia Commons):
 *   Kenneth C. Zirkel, "Gillette Stadium entrance and lighthouse" (CC BY-SA
 *     4.0, the 2023 north end and lighthouse from the north)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_entrance_and_lighthouse.jpg
 *   Kenneth C. Zirkel, "Gillette Stadium panorama" (CC BY-SA 4.0, from the
 *     lighthouse looking south: north-end roof, both stands, south board)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_panorama.jpg
 *   Ieditsandyes, "Gillette stadium picture from top seat" (CC0, from the
 *     south-west upper deck: the north board, signs and lighthouse)
 *     https://commons.wikimedia.org/wiki/File:Gillette_stadium_picture_from_top_seat.jpg
 *   4300streetcar, "Gillette Stadium at night in the rain November 2025"
 *     (CC BY 4.0, night)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_at_night_in_the_rain_November_2025.jpg
 *   Art N., "Gillette Stadium (Top View)" (CC BY 2.0, aerial from the west,
 *     before 2022)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_(Top_View).jpg
 *   Bernard Gagnon, "Gillette Stadium01" and "Gillette Stadium02" (CC BY-SA
 *     3.0, the old north end; the west stand and its lamp rim)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium02.jpg
 *   U.S. Air Force, "Gillette Stadium November 2012" (public domain, the
 *     bowl from the north-west upper deck)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_November_2012_2013_01_121111-F-PB262-814.jpg
 *   Abzeronow, "View of Gillette Stadium on 03-27-2021" (CC BY-SA 4.0, the
 *     west stand's tiers)
 *     https://commons.wikimedia.org/wiki/File:View_of_Gillette_Stadium_on_03-27-2021.jpg
 *   Max P, "Gillette Stadium Foxborough" (CC BY 2.0, outside, the ramp
 *     towers and the canopy) and Mark Goebel, "Gillette Stadium Outdoor"
 *     (CC BY 2.0, the outer wall and canopy overhang)
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_Foxborough.jpg
 *     https://commons.wikimedia.org/wiki/File:Gillette_Stadium_Outdoor.jpg
 * Estimated: the whole 2023 north end, which the 2021 lidar predates: the
 * hall's roof (38 m), its glass band (18-37 m) and the board (110 x 18.6 m,
 * from the published area and the top-seat photo's proportions, 21-39.6 m
 * up); the signs (20 x 7 m); the lighthouse's stages (shaft 59 m on a
 * ground about 4 m over the field, gallery, lantern and cap to 70.5 m, from
 * the Zirkel photo scaled to the published 218 ft); the canopy's
 * thickness; the light arms' spacing (12 m); the outer wall's window bands.
 * Left out: lettering, the bridge and stairs, the seat-row pattern, the
 * pitch, Patriot Place's buildings around it.
 * Doubts: no licensed photo shows the east outer wall squarely; it is
 * drawn like the west. The north end's heights rest on photos only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, box, prism, triangulate, loftSections, rayHit, type XY, type SectionPt } from './dc-nationals-park'
import { beam, save } from './phl-lincoln-financial-field'

const navy = new Part(), conc = new Part(), win = new Part(), red = new Part(), neon = new Part(), lamp = new Part()

const C: XY = [-8, 0]
const at = (u: number, v: number, z: number): V3 => [C[0] + u, C[1] + v, z]
const AX: [V3, V3, V3] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
/** An axis-aligned block in absolute frame coordinates. */
const blk = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) =>
  box(p, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], AX, [(x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2], bottom)

// ---------------------------------------------------------------------------
// Rings about C.

/** A superellipse, half widths A (across) and Bn/Bs (to the ends), centred `du` across from C. */
function ring(A: number, Bn: number, Bs: number, n: number, du = 0): XY[] {
  const out: XY[] = []
  for (let k = 0; k < 72; k++) {
    const t = (k / 72) * 2 * Math.PI, s = Math.sin(t), c = Math.cos(t)
    const B = c >= 0 ? Bn : Bs
    out.push([du + A * Math.sign(s) * Math.abs(s) ** (2 / n), B * Math.sign(c) * Math.abs(c) ** (2 / n)])
  }
  return out
}
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const r0 = ring(44, 63.5, 63.5, 3.5)
const r1 = ring(70, 98, 110, 3, 2)
// The outline, OSM outer way/172619846 and way/1349058950 in this frame,
// less the lighthouse loop and the north corner ramp towers.
const OUT: XY[] = [
  [29, 133], [-21, 134], [-50, 133], [-75, 123], [-98, 108], [-119, 96], [-127, 57], [-130, -29], [-130, -53],
  [-123, -92], [-103, -100], [-81, -121], [-54, -124], [-43, -130], [-43, -148], [24, -151], [25, -130], [48, -125],
  [73, -117], [92, -97], [110, -79], [115, -59], [114, 53], [109, 89], [95, 90], [79, 110], [57, 126],
].map(([x, y]) => [x - C[0], y - C[1]] as XY)
const R = (poly: XY[]) => (a: number) => rayHit(poly, [0, 0], dirOf(a))
const R0 = R(r0), R1 = R(r1), RO = R(OUT)

// ---------------------------------------------------------------------------
// The lower bowl all round, and the concourse podium behind it out to the
// outline: field wall, seats, concourse, the podium's inner wall, its roof,
// the outer wall.
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 6) angles.push(a)
  const sec = (a: number): SectionPt[] => {
    const c = Math.cos((a * Math.PI) / 180)
    const z1 = 9 + (c >= 0 ? 2 : 5) * c * c
    // red blocks in the east lower bowl at midfield (NAIP)
    const seat = a >= 72 && a <= 108 ? red : navy
    const rr1 = R1(a), ro = Math.max(RO(a), rr1 + 6)
    return [
      { r: R0(a), z: 0, part: conc },
      { r: R0(a), z: 1.4, part: seat },
      { r: rr1, z: z1, part: conc },
      { r: rr1 + 3, z: z1, part: conc },
      { r: rr1 + 3, z: 20, part: conc },
      { r: ro, z: 20, part: conc },
      { r: ro, z: 0, part: null },
    ]
  }
  loftSections(C, angles, angles.map(sec), null)
}

// ---------------------------------------------------------------------------
// The sideline stands, west (s = -1) and east (s = 1), lofted along the
// field: each section point is [u, z, v south end, v north end]; the east
// stand stands 4 m further out (lidar). The fronts curve in slightly
// towards the ends, as the oval does.
type SP = [number, number, number, number]
const SIDE: SP[] = [
  [68, 9, -88, 86], // lower bowl's top
  [68, 13, -88, 86], // club front
  [78, 17, -92, 90], // club seats
  [80, 17.5, -92, 90],
  [80, 29, -94, 92], // suite band
  [83, 30.5, -96, 94],
  [103, 48, -102, 98], // upper deck, up to the rim
  [104, 49.5, -102, 98],
  [113, 47, -104, 100], // its back, rolling down over the concourse
  [120, 45, -104, 100], // the overhang
  [120, 42.5, -104, 100],
  [113, 40, -104, 100], // the overhang's underside
  [113, 0, -104, 100], // outer wall
]
const SIDE_PARTS = [conc, null, conc, win, conc, navy, conc, conc, conc, navy, conc, conc]
const curve = (v: number) => 14 * (v / 100) ** 4
const NT = 12
for (const s of [-1, 1]) {
  const du = s > 0 ? 4 : 0
  const P = (p: SP, t: number): V3 => {
    const v = p[2] + (p[3] - p[2]) * t
    return at(s * (p[0] + du - curve(v)), v, p[1])
  }
  const partOf = (i: number, t: number) => {
    const v = -2 + 180 * (t - 0.5)
    if (i === 1) return Math.abs(v) < 46 ? red : navy
    return SIDE_PARTS[i]
  }
  for (let k = 0; k < NT; k++) {
    const t0 = k / NT, t1 = (k + 1) / NT
    for (let i = 0; i < SIDE.length - 1; i++) {
      const p = partOf(i, (t0 + t1) / 2)
      if (!p) continue
      const a = SIDE[i], b = SIDE[i + 1]
      quad(p, [P(a, t0), P(a, t1), P(b, t1), P(b, t0)], [-(b[1] - a[1]) * s, 0, b[0] - a[0]])
    }
  }
  // End caps, sloped where the stand is longer at the back.
  for (const t of [0, 1]) {
    const pts = SIDE.map((p) => P(p, t))
    const flat: XY[] = SIDE.map((p) => [p[0], p[1]])
    for (const [a, b, c] of triangulate(flat)) quad(conc, [pts[a], pts[b], pts[c], pts[c]], [0, t ? 1 : -1, 0])
  }
  const cu = (u: number, v: number) => s * (u + du - curve(v))
  // Window bands on the outer wall under the overhang, between precast
  // piers every 12 m, and the salmon-red panels below them (Goebel).
  for (let v = -96; v < 96; v += 12) {
    const u = 113 + du - curve(v + 6) + 0.06
    quad(win, [at(s * u, v + 1, 27), at(s * u, v + 11, 27), at(s * u, v + 11, 37), at(s * u, v + 1, 37)], [s, 0, 0])
    quad(red, [at(s * u, v + 1, 15), at(s * u, v + 11, 15), at(s * u, v + 11, 24), at(s * u, v + 1, 24)], [s, 0, 0])
    // the navy ribs under the overhang
    beam(navy, at(cu(113, v), v, 39.5), at(cu(120, v), v, 42.2), 0.6, 0.8)
  }

  // The rim along the top of the upper deck: a deep navy fascia and a top
  // chord, with arms every 12 m reaching forward over the seats, a
  // floodlight bank on each tip (lidar 54-56 m; Gagnon 02, Air Force 2012).
  const cv: number[] = []
  for (let k = 0; k <= 10; k++) cv.push(-100 + (196 * k) / 10)
  for (let k = 0; k < cv.length - 1; k++) {
    const v0 = cv[k], v1 = cv[k + 1]
    beam(navy, at(cu(104.2, v0), v0, 51), at(cu(104.2, v1), v1, 51), 1.2, 3)
    beam(navy, at(cu(104.2, v0), v0, 54.4), at(cu(104.2, v1), v1, 54.4), 0.8, 0.8)
  }
  for (let v = -96; v <= 96; v += 12) {
    beam(navy, at(cu(104.2, v), v, 54.4), at(cu(97, v), v, 53.6), 0.6, 0.6)
    beam(navy, at(cu(104.2, v), v, 54.4), at(cu(104.2, v), v, 52), 0.6, 0.6)
    box(lamp, at(cu(96.6, v), v, 54.2), AX, [0.9, 2.4, 1.1])
  }
}

// The east service wing, 10-11 m, out to the outline (x 114..142).
prism([[114, -56], [115, -59], [140, -40], [142, 33], [135, 53], [114, 53]], 0, 11, conc, conc)
quad(win, [[142.06, -30, 3.5], [142.06, 28, 3.5], [142.06, 28, 8], [142.06, -30, 8]], [1, 0, 0])

// ---------------------------------------------------------------------------
// The south end: the 36 m block with the video board on its face, and the
// corner blocks where the stands wrap round (lidar).
prism([[-42, -147], [22, -147], [22, -122], [-42, -122]], 0, 36, conc, conc)
blk(navy, -36, 16, -122.6, -119.6, 28, 45)
quad(neon, [[-34, -119.54, 30], [14, -119.54, 30], [14, -119.54, 44], [-34, -119.54, 44]], [0, 1, 0])
for (const [z0, z1] of [[6, 14], [19, 30]]) {
  quad(win, [[-40, -147.06, z0], [20, -147.06, z0], [20, -147.06, z1], [-40, -147.06, z1]], [0, -1, 0])
}
// the navy steel frames of the south front: posts between the bands
for (let x = -40; x <= 20.1; x += 10) blk(navy, x - 0.6, x + 0.6, -147.8, -147, 0, 35)
blk(conc, -64, -42, -124, -104, 0, 40)
blk(conc, 22, 46, -122, -102, 0, 36)
quad(win, [[-64.06, -122, 24], [-64.06, -106, 24], [-64.06, -106, 34], [-64.06, -122, 34]], [-1, 0, 0])
quad(win, [[46.06, -120, 22], [46.06, -104, 22], [46.06, -104, 32], [46.06, -120, 32]], [1, 0, 0])

// ---------------------------------------------------------------------------
// The north end (2023): a hall across the end, glass on its curved north
// front over a dark open concourse, the video board on its inner face and
// two signs on its roof (Zirkel; top-seat photo).
{
  const NB: XY[] = [[-70, 100], [54, 100], [57, 126], [29, 133], [-21, 134], [-50, 133], [-75, 123]]
  prism(NB, 0, 38, conc, conc)
  const front = NB.slice(1).concat([NB[0]]) // the east flank, the curved north faces and the west flank
  for (let i = 0; i < front.length - 1; i++) {
    const a = front[i], b = front[i + 1]
    // NB runs counter-clockwise, so the outside is to the right of a -> b
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: V3 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
    const P = (p: XY, z: number): V3 => [p[0] + n[0] * 0.06, p[1] + n[1] * 0.06, z]
    quad(win, [P(a, 18), P(b, 18), P(b, 36.8), P(a, 36.8)], n)
    quad(navy, [P(a, 0), P(b, 0), P(b, 17.4), P(a, 17.4)], n)
  }
  // the board: 110 x 18.6 m in a navy frame standing above the roof
  blk(navy, -64, 48, 99.4, 104, 20, 40.6)
  quad(neon, [[-63, 99.34, 21], [47, 99.34, 21], [47, 99.34, 39.6], [-63, 99.34, 39.6]], [0, -1, 0])
  // the two signs either side of the lighthouse, lit both sides
  for (const x of [-38, 26]) {
    blk(navy, x - 10.5, x + 10.5, 124.5, 127.5, 38, 46)
    for (const [y, d] of [[127.56, 1], [124.44, -1]] as [number, number][]) {
      quad(neon, [[x - 9.5, y, 39], [x + 9.5, y, 39], [x + 9.5, y, 45], [x - 9.5, y, 45]], [0, d, 0])
    }
  }
}

// The navy steel ramp towers at the north corners (OSM outline; lidar
// 33-36 m), with pale landings across their long faces.
// The west one stands on the 14 m terrace, so its landings start above it.
for (const [x0, x1, y1, h, z0] of [[-98, -86, 166, 35, 18], [79, 91, 161, 34, 9]]) {
  blk(navy, x0, x1, 104, y1, 0, h)
  for (let z = z0; z < h; z += 8.5) blk(conc, x0 - 0.3, x1 + 0.3, 104, y1, z, z + 1.2)
}

// ---------------------------------------------------------------------------
// The lighthouse (OSM way/1424851636, centre (-3, 136)): 218 ft from its
// plaza, about 4 m over the field. A pale square shaft with glazed navy
// strips at its corners, a wider gallery, the glass lantern, a navy cap.
{
  const X = -3, Y = 136
  const sq = (h: number): XY[] => [[X - h, Y - h], [X + h, Y - h], [X + h, Y + h], [X - h, Y + h]]
  prism(sq(6), 0, 59, conc, null)
  // corner strips, grouped in tall panels
  for (const [dx, dy, nx, ny] of [[1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, 1], [0, -1, -1, 0]]) {
    for (const side of [-1, 1]) {
      // along the face (dx, dy), at either end
      const c0 = side * 4.3, c1 = side * 5.6
      for (let z = 9; z < 54; z += 5) {
        const P = (t: number, zz: number): V3 => [X + dx * t + nx * 6.06, Y + dy * t + ny * 6.06, zz]
        quad(win, [P(c0, z), P(c1, z), P(c1, z + 4.4), P(c0, z + 4.4)], [nx, ny, 0])
      }
    }
  }
  prism(sq(7.6), 59, 61, navy, conc) // the gallery
  quad(navy, [[X - 7.6, Y - 7.6, 59], [X - 7.6, Y + 7.6, 59], [X + 7.6, Y + 7.6, 59], [X + 7.6, Y - 7.6, 59]], [0, 0, -1])
  prism(sq(5.4), 61, 66.5, win, null) // the lantern
  prism(sq(6.2), 66.5, 68.3, navy, navy) // its cap
  prism(sq(4), 68.3, 70.5, navy, navy)
}

const parts = [
  { part: navy, material: finish('gillette-navy', 0x4a5670) },
  {
    part: conc,
    material: {
      ...finish('gillette-precast', 0xe4e0d8),
      // the lighthouse shaft is floodlit at night (4300streetcar, 2025)
      floodlight: (p: V3, n: V3) => (Math.abs(p[0] + 3) < 6.5 && Math.abs(p[1] - 136) < 6.5 && p[2] > 4 && p[2] < 59.5 && Math.abs(n[2]) < 0.5 ? 0.85 : 0),
    },
  },
  { part: win, material: { ...PALETTE.window, color: 0x8aa3b7 } }, // the light, reflective glass of the photos
  { part: red, material: finish('gillette-red', 0xb8615c) },
  { part: neon, material: finish('neon-gillette-board', 0x5f7fb8) },
  { part: lamp, material: finish('lamp-floods', 0xd9dcd6) },
]

if (import.meta.main) {
  await save('bos-gillette-stadium', 'Gillette Stadium', parts, { bearing: 341, osm: 'relation/18511569', height: 70.5 }, 6500)
}
