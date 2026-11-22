/**
 * Moda Center, Portland, Oregon (opened 1995 as the Rose Garden; Ellerbe
 * Becket with BOORA; home of the Trail Blazers) — procedural, CC0-1.0, no
 * textures.  bun generators/pdx-moda-center.ts
 *
 * Map frame: x across the arena, y along the crown of its vaulted roof
 * (+y north-north-west), z up, metres. Placed at bearing 348.4°, the line
 * of the roof's crown in the lidar (it runs from x +16 at the south end to
 * x -13.5 at the north, north-up). Anchor: area centroid of the OSM
 * outline way/24635906, -122.666837, 45.531599. z = 0 is the lowest
 * ground at the footprint (the south-east plaza); elevation 0.
 *
 * What makes it read as itself: the white vaulted roof, a barrel whose
 * crown runs the length of the oval, so its ends stand high and its sides
 * come down low; the dark band under the roof's edge; grey metal walls
 * over a beige precast base; the blue glass entrance drum.
 *
 * Evidence
 * - OSM: way/24635906 (building=yes, roof:shape=round, height=21.32,
 *   which the lidar shows is the wrong figure). No parts. Neighbours left
 *   alone: One Center Court way/145468697 (west), Garden Garage
 *   way/34814274 (north), the Coliseum way/34813762.
 * - Measured, lidar: USGS 3DEP OR_OLCMetro_2019 (flown 2019), 1 m grid.
 *   Ground 9.2-9.6 m (south-east) to 11 m (west) and 15 m (north-east)
 *   over the box's lowest return; z = 0 here is 9.3. The roof's crown
 *   48.0 m (38.7 above z = 0), level along its whole length; its sides
 *   37.2 m at |x| 65 (27.9 above z = 0), falling as a parabola (42.4 m at
 *   |x| 48); its ends stay 44-48 m right to the edge. A two-tier mass at
 *   the north-west, 13.4 and 21.9 m above z = 0: the entrance drum.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Pete Forsyth, "Moda Center and Memorial Coliseum from the air.jpg"
 *     (CC BY 3.0; from the east, high: the vault, its ribs and the dark
 *     band under it, the walls)
 *     https://commons.wikimedia.org/wiki/File:Moda_Center_and_Memorial_Coliseum_from_the_air.jpg
 *   Steve Morgan, "Memorial Coliseum and Rose Garden arena in 2013.jpg"
 *     (CC BY-SA 3.0; the west side from the plaza: beige precast base,
 *     grey upper wall, white roof edge)
 *     https://commons.wikimedia.org/wiki/File:Memorial_Coliseum_and_Rose_Garden_arena_in_2013.jpg
 *   Another Believer, "Moda Center (2015) - 1.jpg" (CC BY-SA 3.0; the
 *     blue glass entrance drum, two tiers, and the precast walls)
 *     https://commons.wikimedia.org/wiki/File:Moda_Center_(2015)_-_1.jpg
 * - Estimated: the wall bands (precast to 12.5 m, a ledge, grey metal
 *   above, a 3 m dark band under the roof) from the photos; the roof's
 *   1.5 m overhang; the drum's radius (9 m and 7 m) and place, from the
 *   lidar's two tiers at the north-west.
 * - Doubts: the drum's exact centre; the lower wings round the base (box
 *   offices, the north-west and east stair blocks, 13-20 m in the lidar)
 *   are folded into the main wall. Not drawn: the roof's ribs, lettering
 *   and the rose logo, the Rip City sign.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { quad, cylinder, type XY } from './dc-nationals-park'

// OSM way/24635906 in this frame (bearing 348.4°, about the anchor).
const OUTLINE: XY[] = [[7.5,85.6],[-4.0,79.8],[-9.7,85.8],[-15.9,91.1],[-25.3,86.5],[-30.9,80.6],[-36.9,72.9],[-41.2,65.7],[-43.2,60.9],[-45.6,58.4],[-56.1,53.8],[-57.4,47.4],[-60.6,47.3],[-62.2,39.3],[-63.1,33.0],[-63.9,25.3],[-64.4,17.6],[-64.5,11.9],[-64.5,6.7],[-64.3,1.5],[-64.1,-3.5],[-63.6,-9.3],[-62.8,-15.4],[-61.8,-23.5],[-66.5,-45.1],[-66.1,-48.8],[-64.8,-51.9],[-62.5,-55.2],[-59.6,-57.5],[-56.3,-58.8],[-53.2,-59.0],[-49.8,-58.2],[-46.2,-64.0],[-43.0,-68.1],[-39.0,-72.7],[-33.3,-78.3],[-27.1,-78.5],[-21.5,-82.6],[-16.0,-86.2],[-8.1,-90.3],[12.1,-79.5],[15.0,-78.8],[19.6,-77.9],[27.7,-75.1],[33.5,-72.1],[39.0,-68.1],[43.4,-64.3],[51.0,-60.3],[55.4,-58.4],[56.8,-51.9],[60.0,-51.8],[62.4,-39.4],[63.7,-27.7],[64.1,-16.4],[64.2,-13.9],[64.5,-6.0],[63.5,5.6],[63.3,7.4],[65.3,16.8],[66.8,26.4],[67.1,36.6],[67.1,45.8],[66.4,53.8],[65.7,60.0],[47.5,56.8],[39.9,66.6],[33.2,73.3],[27.4,73.6],[20.4,78.6],[14.0,82.5]]

const precast = new Part(), grey = new Part(), roof = new Part(), band = new Part(), drum = new Part()

// The vault: crown 38.7 m, sides 27.9 m at |x| 66, a parabola across.
const CROWN = 38.7, SIDE = 27.9, XS = 66
const zRoof = (x: number) => CROWN - (CROWN - SIDE) * Math.min(1.25, (x / XS) ** 2)
const FASCIA = 1.4, OVER = 1.5, BAND = 6

const area = OUTLINE.reduce((s, p, i) => { const q = OUTLINE[(i + 1) % OUTLINE.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
// Pulled inside the roof's oval where OSM's outline bulges past it (the
// north-west stair block, 3-4 m), so no wall pokes out under the eaves.
const inOval = (p: XY): XY => {
  const r = Math.hypot(p[0] / 66.5, p[1] / 88.5)
  return r > 1 ? [p[0] / r, p[1] / r] : p
}
const RING = (area < 0 ? [...OUTLINE].reverse() : OUTLINE).map(inOval)

// ---------------------------------------------------------------- walls ---
// Each edge split into pieces of 5 m or less (the ground and the roof both
// follow them), in bands: beige precast, a pale ledge, grey metal, and a
// dark band under the roof's edge.
for (let i = 0; i < RING.length; i++) {
  const a = RING[i], b = RING[(i + 1) % RING.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 0.05) continue
  const o: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  const n = Math.max(1, Math.ceil(L / 5))
  for (let k = 0; k < n; k++) {
    const p0: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
    const p1: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
    const t0 = zRoof(p0[0]) - FASCIA, t1 = zRoof(p1[0]) - FASCIA
    const w = (z0: number, z1: number, z0b: number, z1b: number, p: Part) =>
      quad(p, [[p0[0], p0[1], z0], [p1[0], p1[1], z0b], [p1[0], p1[1], z1b], [p0[0], p0[1], z1]], o)
    w(0, 12.5, 0, 12.5, precast)
    w(12.5, 13.3, 12.5, 13.3, roof)
    w(13.3, t0 - BAND, 13.3, t1 - BAND, grey)
    w(t0 - BAND, t0, t1 - BAND, t1, band)
  }
}

// ----------------------------------------------------------------- roof ---
// A clean oval (the lidar's roof edge: |x| 66 at y 0, |x| 48 at y ±60,
// ends at y ±88), sliced across x; each slice runs between the oval's
// edges at the vault's height for that x.
{
  const A = 66 + OVER, B = 88 + OVER, N = 24
  const xs: number[] = []
  for (let i = 0; i <= N; i++) xs.push(-A * Math.cos((Math.PI * i) / N))
  const half = (x: number) => B * Math.sqrt(Math.max(0, 1 - (x / A) ** 2))
  const P = (i: number, j: number, dz = 0): V3 => {
    const h = half(xs[i])
    return [xs[i], -h + (2 * h * j) / 4, zRoof(xs[i]) + dz]
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < 4; j++) quad(roof, [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], [0, 0, 1])
    // The fascia along both edges, and the dark soffit under it.
    for (const [j, s] of [[0, -1], [4, 1]] as [number, number][]) {
      const e = [P(i, j, -FASCIA), P(i + 1, j, -FASCIA), P(i + 1, j), P(i, j)]
      const mx = (xs[i] + xs[i + 1]) / 2
      quad(roof, e, [mx / (A * A), (s * half(mx)) / (B * B), 0])
    }
    quad(band, [P(i, 0, -FASCIA), P(i + 1, 0, -FASCIA), P(i + 1, 4, -FASCIA), P(i, 4, -FASCIA)], [0, 0, -1])
  }
}

// --------------------------------------------------------------- the drum ---
// The blue glass entrance drum at the north-west: two tiers (lidar 13.4 m
// and 21.9 m), a pale ledge between them and a flat cap on each.
{
  const C: XY = [-29, 77]
  cylinder(drum, C, 9, 0, 12.6, 16, null)
  cylinder(roof, C, 9.3, 12.6, 13.4, 16, roof)
  cylinder(drum, C, 7, 13.4, 21.1, 16, null)
  cylinder(roof, C, 7.3, 21.1, 21.9, 16, roof)
}

// --------------------------------------------------------------- output ---
// Colours from the daylight photos: the roof a cool white; the base a warm
// beige precast; the upper walls mid grey metal; the band under the roof
// dark glass; the drum's glass a clear blue, pulled light.
const parts = [
  { part: precast, material: finish('moda-precast', 0xd9ccb4) },
  { part: grey, material: finish('moda-metal', 0xaeb3b6) },
  { part: roof, material: finish('moda-roof', 0xeceeec) },
  { part: band, material: PALETTE.window },
  { part: drum, material: windowVariant(2, 0x6f93b8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Moda Center', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 348.4, osm: 'way/24635906', height: CROWN,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/pdx-moda-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
