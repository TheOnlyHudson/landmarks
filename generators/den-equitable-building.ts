/**
 * Equitable Building, Denver (1892, Andrews, Jaques & Rantoul) — original
 * procedural geometry, CC0-1.0.
 * bun generators/den-equitable-building.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 45: +y is
 * the 17th Street front (north-east), -x the Stout Street side
 * (north-west), +x the alley (south-east), -y the party wall against the
 * two-storey neighbour (OSM way/103455403). Origin on the ground at the
 * anchor, the area centroid of OSM way/82874458 (-104.99195, 39.7463239).
 *
 * Identity, in order:
 *  1. a nine-storey Italian Renaissance block in pale buff-grey stone over
 *     a two-storey base of red granite, round arches all along the base.
 *                                                   (hust, sab17, nby)
 *  2. the double-E plan: three wings reach out to Stout Street (and three
 *     to the alley), with deep light courts between them from the third
 *     floor up; the base runs straight across under the courts.
 *                                                (sab17, sabb, nby, lidar)
 *  3. the facade's stacking: square windows on floors 3–4, round-headed
 *     windows on 5–6 over a string course, a two-storey arcade on 7–8, a
 *     small-windowed attic and a deep bracketed cornice.        (hust)
 *
 * Plan: OSM way/82874458, used as drawn for the upper floors. The base
 * is its bounding rectangle (40.7 × 63.2 m): the lidar has low roofs in
 * every court (11 m on the Stout side, 7–9 m on the alley side), and the
 * photos show the granite base running across them.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py at bearing 45. ground_min 1591.68 m; the
 * street is 0.5–1.0 above it (Mapterhorn agrees, flat); y = 0 here is
 * ground_min + 0.6. Measured above y = 0: the main roof 39.7 (the cornice
 * top); the middle wing's roof 35.0; a plant block over its middle (the
 * spine) 42–44; a stair house on the south wing 43.5 (left out); court
 * floors 10.5 (Stout side) and 6.5–8.6 (alley). Published: nine storeys
 * (OSM building:levels=9; Wikipedia "Equitable Building (Denver)").
 *
 * Estimated from hust (a frontal elevation), scaled to 39.7 m: base 0–9,
 * floors 3–8 about 4 m each, string course 25, attic 35.4–37, cornice
 * 37.4–39.7 projecting 0.9; bays 4.2 m. Left out: the central balcony and
 * the frontispiece's columns, the rustication, brackets, the medallions.
 *
 * Photos (Wikimedia Commons, evidence):
 *  hust   "Equitable building.jpg", Hustvedt, CC BY-SA 3.0 (17th Street
 *         front, frontal)
 *  sab17  "Equitable Building from 17th (5186086061).jpg", Paul Sableman,
 *         CC BY 2.0 (the corner of 17th and Stout, from the north)
 *  sabb   "Beautiful Building in Downtown Denver (5186593222).jpg", Paul
 *         Sableman, CC BY 2.0 (Stout Street side: the wings and courts)
 *  nby    "Denver CO - Equitable Building (NBY 431753).jpg", Detroit
 *         Publishing Co. 1905 postcard, public domain (from the north)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the alley (south-east) side and the court walls are not in any
 * photo; drawn with the same windows, plainer base. Bay counts follow a
 * 4.2 m rhythm rather than a count of each face.
 *
 * Night: the windows glow (window); the stone is not floodlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { band } from './atl-tech-tower'
import { capPoly, split } from './atl-flatiron-building'

const stone = new Part(), granite = new Part(), win = new Part(), roof = new Part()

// OSM way/82874458 in this frame.
const ring = ccw([[-19.88, -31.68], [-19.8, -14.38], [-9.0, -14.35], [-8.97, -7.37], [-15.79, -7.39], [-19.19, -3.11], [-19.17, 2.23], [-16.14, 6.35], [-7.82, 6.37], [-7.78, 14.4], [-19.0, 14.37], [-18.92, 31.38], [20.83, 31.48], [20.75, 15.21], [8.29, 15.19], [8.25, 6.02], [19.45, 6.05], [19.4, -5.84], [7.36, -5.87], [7.32, -15.8], [19.29, -15.77], [19.14, -31.67]])
// The high part: the ring with the middle wings cut back to the spine.
const high = ring.filter(([x, y]) => !(Math.abs(y) < 7.5 && Math.abs(x) > 10))
const X0 = -19.88, X1 = 20.83, Y0 = -31.68, Y1 = 31.48
const BASE = 9, MID = 35.0, TOP = 39.7

// ── Massing ──
const rect = ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]])
prism(granite, split(rect, 4.8), 0, BASE, roof, 0.2)
band(granite, rect, BASE - 0.6, 0.6, 0.2, granite)
prism(stone, ring, BASE, MID, roof, 0)
cornice(stone, ring, MID - 1.0, 1.0, 0.5, null)
prism(stone, high, MID, TOP - 2.3, null, 0)
cornice(stone, high, TOP - 2.3, 2.3, 0.9, null)
capPoly(roof, high, TOP - 0.05, true)
// the Stout-side courts' low roofs
box(granite, X0, -9, 6.4, 14.4, BASE, 10.5, roof, 0.2)
box(granite, X0, -9, -14.4, -7.4, BASE, 10.5, roof, 0.2)
// plant over the middle of the spine
box(roof, -8, 8, -6, 6, TOP, 42.4, roof, 0.3)
box(roof, -5, 5, -3, 3, 42.4, 44.0, roof, 0.3)

// ── Facades of the upper floors, every face 4 m or longer ──
const BAY = 4.2
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 4) continue
  const midY = (a[1] + b[1]) / 2, midX = (a[0] + b[0]) / 2
  const isMid = Math.abs(midY) < 7.5 && Math.abs(midX) > 10
  const n = Math.max(1, Math.round((L - 1.2) / BAY)), w = (L - 1.2) / n
  for (let k = 0; k < n; k++) {
    const m = 0.6 + (k + 0.5) * w, h = Math.min(0.75, w / 2 - 0.7)
    onWall(win, a, b, rectShape(m - h, m + h, 10.3, 15.9), 0.06)
    onWall(win, a, b, archShape(m, 2 * h, 18.0, 22.6, 8), 0.06)
    onWall(win, a, b, archShape(m, 2 * h + 0.4, 26.2, 30.8, 8), 0.06)
    if (!isMid) onWall(win, a, b, rectShape(m - 0.6, m + 0.6, 35.4, 36.8), 0.06)
  }
  // string course over floor 6
  onWall(stone, a, b, rectShape(0.1, L - 0.1, 24.7, 25.2), 0.12)
}

// ── The granite base: arches on the two streets, plain on the alley ──
const sides: [XY, XY, boolean][] = [[[X1, Y1], [X0, Y1], true], [[X0, Y1], [X0, Y0], true], [[X1, Y0], [X1, Y1], false]]
for (const [a, b, street] of sides) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round((L - 1.2) / BAY), w = (L - 1.2) / n
  for (let k = 0; k < n; k++) {
    const m = 0.6 + (k + 0.5) * w
    if (street) {
      onWall(win, a, b, archShape(m, 2.9, 0.3, 4.2, 10), 0.06)
      for (const d of [-0.75, 0.75]) onWall(win, a, b, archShape(m + d, 1.0, 5.6, 7.4, 6), 0.06)
    } else onWall(win, a, b, rectShape(m - 0.8, m + 0.8, 4.6, 7.6), 0.06)
  }
}

await save('den-equitable-building', 'Equitable Building', [
  { part: stone, material: finish('equitable-stone', 0xd8cbb9) },
  { part: granite, material: finish('equitable-granite', 0xbb8c7e) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: 44.0, anchor: [39.7463239, -104.99195], bearing: 45 })
