/**
 * John R. Park Building (1914, Neoclassical), University of Utah, Salt
 * Lake City: the administration building at the head of Presidents Circle
 * — procedural, CC0-1.0, no textures.
 *   bun generators/slc-park-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the long axis runs
 * north-south, 179.8°; the front faces west down Presidents Circle). The
 * anchor is the area centroid of the outline (way/33632418).
 *
 * What makes it itself, from the photos:
 *   1. the giant hexastyle portico on the west front (OSM: x -17.2…-11.7,
 *      y -7.3…8.0): six Ionic columns, paired at the ends and two between
 *      (photo spacing: 0, 1.2, 5.0, 8.9, 12.8, 14.0 m), on the landing of
 *      a broad flight of steps with grey granite cheek blocks, carrying an
 *      entablature and a low pediment (apex 18.3 m, lidar 17.6–18.3);
 *   2. the stepped attic block behind the pediment (lidar: 21.5, 23.5 and
 *      a skylight to 25.4 m);
 *   3. the long white three-storey wings: small basement windows, a row of
 *      second-floor windows, tall third-floor windows, a deep entablature
 *      and a plain attic storey under the top cornice (19 m, lidar 19.0);
 *   4. the end pavilions (y ±26…±35), a little taller (20.4 m, lidar) and
 *      projecting 1.5 m, each with a recessed screen of two columns in
 *      antis across the two main floors (Mangoman88's photo).
 * Window bands from Ben P L's frontal photos scaled to the 19 m cornice:
 *   basement 0.6–2.4, second floor 4.4–7.1, third floor 9.2–13.0; seven
 *   bays each side of the portico, 2.6 m apart.
 *
 * Elevation 0: the site is flat (Mapterhorn 1.8–2.1 m across the
 * footprint; lidar ground 3.0 ± 0.1 round the walls).
 *
 * Evidence
 * - OSM: way/33632418 outline and its building:parts (the columns, the
 *   portico, the attic steps, the rear wing), listed in `replaces`.
 * - Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013), 0.5 m: every
 *   roof height; the steps rise 3 m over x -22…-16.5.
 * - Photos (Wikimedia Commons):
 *   Ben P L, "John R. Park Building (36017240333).jpg" and
 *     "(36017239773).jpg" (CC BY-SA 2.0; the west front, frontal);
 *   Mangoman88, "John R. Park Building - front - 25 August 2012.JPG" (CC0;
 *     the whole west front with both pavilions);
 *   Scott Catron, "Park Building UofU Nov 2010.jpg" (CC BY-SA 2.0; the
 *     portico close up: the Ionic capitals, the bronze doors).
 * Doubts: the east (rear) face and the ends are unphotographed here; they
 *   carry the same window rows as the front, at the same bay spacing.
 * Left out: the Ionic volutes, dentils, the attic's cresting, the statue,
 *   railings, lettering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, cylinder, prism, quad, type XY } from './dc-nationals-park'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), granite = new Part()
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]

// --- Massing (OSM outline, lidar heights) ---
const MAIN: XY[] = [[-11.7, -25.5], [10.7, -25.5], [10.7, 26.3], [-11.7, 26.3]]
prism(MAIN, 0, 18.4, stone, roof)
const WING: XY[] = [[10.6, -7.3], [20.5, -7.3], [20.5, 8.1], [10.6, 8.1]]
prism(WING, 0, 17.6, stone, roof)
const PAV_N: XY[] = [[-13.2, 26.3], [10.9, 26.3], [10.9, 34.8], [-13.2, 34.8]]
const PAV_S: XY[] = [[-13.3, -35.1], [11.5, -35.1], [11.5, -25.5], [-13.3, -25.5]]
// The pavilions' west fronts are built round their loggias below; the
// prism stands from the loggia's back wall (x -12).
for (const p of [PAV_N, PAV_S]) prism(p.map(([x, y]): XY => [Math.max(x, -12), y]), 0, 19.8, stone, roof)

/** A cornice: a slab a little proud of a rectangle. */
function cornice(r: XY[], z0: number, z1: number, out: number, p = trim, top: Part | null = roof) {
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
  const x0 = Math.min(...xs) - out, x1 = Math.max(...xs) + out, y0 = Math.min(...ys) - out, y1 = Math.max(...ys) + out
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, p, top)
}
cornice(MAIN, 14.6, 16.0, 0.45, trim, null) // the main entablature
cornice(MAIN, 18.4, 19.0, 0.5) // top cornice
cornice(WING, 17.6, 18.2, 0.4)
for (const p of [PAV_N, PAV_S]) {
  cornice(p, 14.6, 16.0, 0.45, trim, null)
  cornice(p, 19.8, 20.4, 0.5)
}
cornice(MAIN, 0, 0.7, 0.25, granite, null) // the base course
for (const p of [PAV_N, PAV_S]) cornice(p, 0, 0.7, 0.25, granite, null)
for (const r of [MAIN, PAV_N, PAV_S]) cornice(r, 3.6, 4.0, 0.2, trim, null) // belt course

// The attic block behind the pediment, stepped (lidar).
prism([[-10, -8], [8, -8], [8, 7], [-10, 7]], 18.4, 21.5, stone, roof)
cornice([[-10, -8], [8, -8], [8, 7], [-10, 7]], 21.5, 22.0, 0.35)
prism([[-6, -5], [5, -5], [5, 4.5], [-6, 4.5]], 22, 23.5, stone, roof)
prism([[-2, -1.5], [3.5, -1.5], [3.5, 1.5], [-2, 1.5]], 23.5, 25.4, trim, roof) // the skylight

// --- Windows ---
type Face = { o: V3; t: V3; n: V3; from: number; to: number } // origin, along, outward normal
const ROWS: [number, number][] = [[0.9, 2.4], [4.4, 7.1], [9.2, 13.0]]
function windows(f: Face, centres: number[], w: number, rows = ROWS) {
  for (const c of centres) for (const [z0, z1] of rows) {
    const p = (s: number, z: number): V3 => [f.o[0] + f.t[0] * s + f.n[0] * 0.05, f.o[1] + f.t[1] * s + f.n[1] * 0.05, z]
    quad(win, [p(c - w / 2, z0), p(c + w / 2, z0), p(c + w / 2, z1), p(c - w / 2, z1)], f.n)
  }
}
const run = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * (i + 0.5)) / n)
// West front: seven bays each side of the portico.
const west = { o: [-11.7, 0, 0] as V3, t: Y, n: [-1, 0, 0] as V3, from: 0, to: 0 }
windows(west, [...run(-25.5, -7.3, 7), ...run(8.0, 26.3, 7)], 1.45)
// Behind the portico: the door and two windows each side on the main floors.
windows(west, [-4.6, -1.8, 3.4, 6.2], 1.3, [[9.2, 13.0]])
windows(west, [-4.6, 6.2], 1.3, [[4.4, 7.1]])
// East face and the wing (unphotographed: same rhythm).
const east = { o: [10.7, 0, 0] as V3, t: Y, n: [1, 0, 0] as V3, from: 0, to: 0 }
windows(east, [...run(-25.5, -7.3, 7), ...run(8.1, 26.3, 7)], 1.45)
windows({ o: [20.5, 0, 0], t: Y, n: [1, 0, 0], from: 0, to: 0 }, run(-7.3, 8.1, 5), 1.45)
for (const s of [1, -1]) windows({ o: [0, s > 0 ? 8.1 : -7.3, 0], t: X, n: [0, s, 0], from: 0, to: 0 }, run(10.7, 20.5, 3), 1.45)
// Pavilions: their ends (north and south faces) and their west fronts.
for (const [y, s] of [[34.8, 1], [-35.1, -1]] as const) {
  windows({ o: [0, y, 0], t: X, n: [0, s, 0], from: 0, to: 0 }, run(-13.2, 11.2, 7), 1.45)
}
for (const [y0, y1] of [[26.3, 34.8], [-35.1, -25.5]]) {
  // A recessed loggia across the two main floors, two columns in antis.
  const yc = (y0 + y1) / 2, half = 2.6
  const xr = -12.0, xf = (y0 > 0 ? -13.2 : -13.3), xm = (xf + xr) / 2, hd = (xr - xf) / 2
  // Piers either side, the sill band below and the attic band above.
  box(stone, [xm, (y0 + yc - half) / 2, 9.9], [X, Y, Z], [hd, (yc - half - y0) / 2, 9.9])
  box(stone, [xm, (yc + half + y1) / 2, 9.9], [X, Y, Z], [hd, (y1 - yc - half) / 2, 9.9])
  box(stone, [xm, yc, 2.0], [X, Y, Z], [hd, half, 2.0])
  box(stone, [xm, yc, 17.2], [X, Y, Z], [hd, half, 2.6], true)
  for (const [z0, z1] of [[4.6, 7.1], [9.2, 13.0]]) quad(win, [[xr - 0.05, yc - 1.6, z0], [xr - 0.05, yc + 1.6, z0], [xr - 0.05, yc + 1.6, z1], [xr - 0.05, yc - 1.6, z1]], [-1, 0, 0])
  for (const dy of [-0.9, 0.9]) column(-12.7, yc + dy * 1.0, 4.0, 14.6, 0.36)
  windows({ o: [xf, 0, 0], t: Y, n: [-1, 0, 0], from: 0, to: 0 }, [yc], 3.2, [[0.9, 2.4]])
}

/** A column: plinth, 12-sided shaft, a capital block (Ionic, abstracted). */
function column(x: number, y: number, z0: number, z1: number, r: number) {
  box(trim, [x, y, z0 + 0.25], [X, Y, Z], [r + 0.2, r + 0.2, 0.25], false)
  cylinder(trim, [x, y], r, z0 + 0.5, z1 - 0.6, 12, null)
  box(trim, [x, y, z1 - 0.3], [X, Y, Z], [r + 0.3, r + 0.22, 0.3], false)
}

// --- The portico ---
{
  const yc = 0.35
  const ys = [-7, -5.8, -1.95, 1.95, 5.8, 7].map((d) => yc + d)
  const xc = -16.2
  // Its floor: the landing, 3 m up.
  prism([[-17.2, -7.3], [-11.7, -7.3], [-11.7, 8.0], [-17.2, 8.0]], 0, 3.0, granite, stone)
  for (const y of ys) column(xc, y, 3.0, 14.6, 0.62)
  // Antae against the wall behind the end pairs.
  for (const y of [-6.4 + yc, 6.4 + yc]) box(stone, [-12.0, y, 8.8], [X, Y, Z], [0.35, 0.9, 5.8], false)
  // Entablature and pediment (apex 18.3 m).
  prism([[-17.4, -7.5], [-11.7, -7.5], [-11.7, 8.2], [-17.4, 8.2]], 14.6, 16.0, trim, roof)
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  const ya = -7.5, yb = 8.2, ym = (ya + yb) / 2, zb = 16.0, zt = 18.3
  quad(stone, [P(-17.4, ya, zb), P(-17.4, yb, zb), P(-17.4, ym, zt), P(-17.4, ym, zt)], [-1, 0, 0]) // tympanum
  quad(roof, [P(-17.6, ya - 0.2, zb), P(-17.6, ym, zt + 0.2), P(-11.7, ym, zt + 0.2), P(-11.7, ya - 0.2, zb)], [0, -1, 1])
  quad(roof, [P(-17.6, ym, zt + 0.2), P(-17.6, yb + 0.2, zb), P(-11.7, yb + 0.2, zb), P(-11.7, ym, zt + 0.2)], [0, 1, 1])
  // The raking cornices, bold trim bands on the tympanum's edge.
  for (const [a, b] of [[P(-17.5, ya - 0.2, zb), P(-17.5, ym, zt + 0.2)], [P(-17.5, ym, zt + 0.2), P(-17.5, yb + 0.2, zb)]] as [V3, V3][]) {
    quad(trim, [a, b, [b[0], b[1], b[2] - 0.5], [a[0], a[1], a[2] - 0.5]], [-1, 0, 0])
  }
  // The bronze doors and the steps.
  quad(door, [[-11.75, -0.6, 3.0], [-11.75, 1.3, 3.0], [-11.75, 1.3, 7.4], [-11.75, -0.6, 7.4]], [-1, 0, 0])
  quad(trim, [[-11.76, -1.0, 7.4], [-11.76, 1.7, 7.4], [-11.76, 1.7, 8.0], [-11.76, -1.0, 8.0]], [-1, 0, 0])
  for (let i = 0; i < 6; i++) {
    const x0 = -22.6 + i * 0.9
    prism([[x0, -6.6], [-17.2, -6.6], [-17.2, 7.3], [x0, 7.3]], 0, 0.5 * (i + 1), granite, granite)
  }
  // Granite cheek blocks either side of the flight.
  for (const [y0, y1] of [[-8.6, -6.6], [7.3, 9.3]]) prism([[-22.8, y0], [-17.2, y0], [-17.2, y1], [-22.8, y1]], 0, 3.8, granite, granite)
}

// ---------------------------------------------------------------------------
const parts = [
  { part: stone, material: finish('park-stone', 0xe9e6de) },
  { part: trim, material: finish('park-trim', 0xf6f3ec) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0xa88a5e } }, // bronze doors
  { part: granite, material: finish('park-granite', 0xb9b8b3) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('John R. Park Building', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/33632418', height: 25.4,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/slc-park-building.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
