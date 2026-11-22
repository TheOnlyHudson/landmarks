/**
 * EverBank Center (Southern Bell Telephone Building 1983, then AT&T Tower,
 * then TIAA Bank Center 2018-2023), Jacksonville — original procedural
 * geometry, CC0-1.0.
 * bun generators/jax-everbank-center.ts
 *
 * Name: the building takes its name from its anchor tenant. It opened as the
 * Southern Bell Telephone Building, became the AT&T Tower, then TIAA Bank
 * Center when TIAA Bank took the naming rights; when TIAA Bank renamed itself
 * EverBank in 2023 the building became EverBank Center (Wikipedia
 * "EverBank Center"; Wikidata Q5416804 label). OSM still says
 * "TIAA Bank Center".
 *
 * A 30-storey office slab whose plan is a parallelogram: two opposite
 * corners are cut into staircases of six or seven small steps (each one a
 * corner office; "each floor has 16 corner offices"), so the tower reads as
 * a sawtooth from the north-west and south-east and as a broad flat slab
 * from the north-east and south-west. Silver-white spandrels alternate with
 * reflective glass in long horizontal ribbons. A mechanical penthouse sits
 * on the roof, and a lower triangular podium (the entrance atrium and
 * auditorium) pushes out to the west.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 59.75:
 * the outline's walls run at 59.5-60° and 149.5-150° of the compass, so +y
 * (the slab's long axis) points ENE. Origin = centroid of way/170066670.
 *
 * Evidence
 * - OSM way/170066670 (TIAA Bank Center, height 129.4, 30 levels): in this
 *   frame the tower is x -13..29.5, y -43.7..50.4, its north-west and
 *   south-east corners cut in steps of about 4.9 x 4.9 m; the triangular
 *   podium reaches west to (-46, -10.7) between y -34.6 and 12.7. The
 *   generator uses the outline's own vertices.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read in this frame, heights above the ground at the foot (~0.4 above the
 *   grid minimum): roof 127.6, parapet rim 128.9; penthouse 137.2 over
 *   x 0.5..15.5, y -13..23.5; podium 18.5, with a lower 12.5 m strip
 *   x -22..-13 against the tower.
 * - Published (Wikipedia "EverBank Center"): 136 m (447 ft) including the
 *   penthouse; 30 floors; two-storey entrance atrium; 280-seat auditorium.
 * - Photos (Commons):
 *   · "Everbank Center, Jacksonville.JPG", Michael Rivera, CC BY-SA 3.0
 *     (from the south-west: the flat face with the stepped corner at left),
 *     https://commons.wikimedia.org/wiki/File:Everbank_Center,_Jacksonville.JPG
 *   · "EverBank Center 1.JPG", Mathew105601, CC BY-SA 3.0 (looking up at the
 *     stepped south-east corner and the long face),
 *     https://commons.wikimedia.org/wiki/File:EverBank_Center_1.JPG
 *   · "EverBank Center, Downtown Jacksonville, Florida- 2013-06-22 18-18.jpg",
 *     Mathew105601, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:EverBank_Center,_Downtown_Jacksonville,_Florida-_2013-06-22_18-18.jpg
 *
 * Measured: plan (OSM), all heights (lidar). Published: 136 m, 30 floors.
 * Estimated from the photos: floor-to-floor ~4.1 m; the shaft is drawn as a
 * light silver-blue glass wall (window-2 #a9bfd1, as it reads in daylight)
 * with a 1.2 m pale silver trim line every two floors (8.2 m) instead of the
 * real per-floor spandrels, a 9 m lobby, and the 6 m solid silver band at the
 * top; the podium's facade (no photo shows it) is drawn as two plain ribbons.
 *
 * Night: the glass wall `window-2`, podium ribbons `window`; the lobby `entrance`. The EverBank sign at the
 * top of the long faces is not drawn.
 *
 * Doubts: the podium's look and the 12.5 m strip are from lidar only; the
 * real ribbons are one per floor (grouped here per the style rules); the
 * penthouse is from lidar and barely shows in street photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 59.75
const ANCHOR = { lng: -81.66237108, lat: 30.32765351 }

type XY = [number, number]
const body = new Part(), win = new Part(), roof = new Part(), lobby = new Part(), curtain = new Part()

// Tower outline, counter-clockwise from above (OSM way/170066670 reversed, podium left out).
const TOWER: XY[] = ([
  [-12.78, -43.73], [-12.86, -34.52], [-13.4, 12.83], [-13.45, 20.99], [-8.48, 21.05], [-8.51, 25.89], [-3.61, 25.94],
  [-3.63, 31.09], [-0.01, 31.14], [-0.05, 35.94], [4.67, 36.01], [4.64, 40.83], [9.59, 40.89], [9.55, 45.83],
  [13.25, 45.87], [13.23, 50.16], [29.02, 50.37], [29.51, -15.12], [25.01, -15.18], [25.05, -18.87], [20.1, -18.94],
  [20.14, -23.92], [15.36, -23.98], [15.4, -28.91], [10.26, -28.99], [10.3, -33.83], [6.75, -33.88], [6.79, -38.49],
  [1.86, -38.56], [1.9, -43.5],
] as XY[]).reverse()
const PODIUM: XY[] = ([[-12.86, -34.52], [-22.26, -34.66], [-46.01, -10.74], [-22.53, 12.73], [-13.4, 12.83]] as XY[]).reverse()
const ROOF = 127.6, RIM = 128.9, PENT = { x0: 0.5, x1: 15.5, y0: -13, y1: 23.5, top: 137.2 }
const LOBBY = 9, BAND = 8.2, GLASS = 4.4, TOPBAND = 6

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

/** Walls of a polygon prism; `skip(a, b)` leaves out an edge (where another mass abuts). */
function prism(part: Part, poly: XY[], z0: number, z1: number, skip?: (a: XY, b: XY) => boolean) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (skip?.(a, b)) continue
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** Ribbon panels on each wall of a polygon between z0 and z1. */
function ribbons(poly: XY[], bands: [number, number, Part][], skip?: (a: XY, b: XY) => boolean, margin = 0.5) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (skip?.(a, b)) continue
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l, nx = uy * 0.06, ny = -ux * 0.06
    const m = Math.min(margin, l / 6)
    const at = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
    for (const [z0, z1, p] of bands) p.quad(at(m, z0), at(l - m, z0), at(l - m, z1), at(m, z1))
  }
}

// Tower.
const onPodium = (a: XY, b: XY) => Math.abs(a[0] + 13.13) < 0.5 && Math.abs(b[0] + 13.13) < 0.5 && Math.min(a[1], b[1]) > -35 && Math.max(a[1], b[1]) < 13
// The shaft is a light reflective glass wall; pale silver trim lines every
// two floors and a solid silver band at the top (where the sign hangs).
prism(curtain, TOWER, 0, RIM)
capPoly(roof, TOWER, RIM - 0.01)
const trims: [number, number, Part][] = [[LOBBY - 0.6, LOBBY + 0.6, body]]
for (let z = LOBBY + BAND; z < RIM - TOPBAND - 2; z += BAND) trims.push([z - 0.6, z + 0.6, body])
trims.push([RIM - TOPBAND, RIM + 0.02, body])
ribbons(TOWER, trims, undefined, 0)
ribbons(TOWER, [[0.4, LOBBY - 1.2, lobby]], onPodium)

// Penthouse.
{
  const { x0, x1, y0, y1, top } = PENT, bev = 0.4
  const r = (e: number, z: number): V3[] => [[x0 + e, y0 + e, z], [x1 - e, y0 + e, z], [x1 - e, y1 - e, z], [x0 + e, y1 - e, z]]
  body.loft([r(0, RIM - 0.5), r(0, top - bev), r(bev, top)])
  roof.cap(r(bev, top), true)
}

// Podium to the west: the 18.5 m triangle and the 12.5 m strip against the tower.
const STRIP: XY[] = [[-22.4, -34.6], [-12.86, -34.52], [-13.4, 12.83], [-22.53, 12.73]]
const TRI: XY[] = [[-22.26, -34.66], [-22.53, 12.73], [-46.01, -10.74]] // counter-clockwise
prism(body, STRIP, 0, 12.5, (a, b) => Math.abs(a[0] + 13.1) < 0.6 && Math.abs(b[0] + 13.1) < 0.6)
capPoly(roof, STRIP, 12.5)
prism(body, TRI, 0, 18.5)
capPoly(roof, TRI, 18.5)
ribbons(TRI, [[0.4, 5.6, lobby], [8.2, 11.4, win], [13.2, 16.4, win]], (a, b) => Math.abs(a[0] + 22.4) < 0.3 && Math.abs(b[0] + 22.4) < 0.3)
ribbons(STRIP, [[0.4, 5.6, lobby], [7.4, 10.8, win]], (a, b) => (a[0] > -14 && b[0] > -14))

const parts = [
  { part: body, material: finish('everbank-silver', 0xe7e8e6) },
  { part: win, material: { ...PALETTE.window, color: 0x8ea3b5 } },
  { part: curtain, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x7d909f } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('EverBank Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: PENT.top,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/170066670'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-everbank-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
