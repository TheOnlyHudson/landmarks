/**
 * Rocket Arena, Cleveland (NBA Cavaliers; opened 1994 as Gund Arena,
 * Ellerbe Becket; Quicken Loans Arena 2005-2019, Rocket Mortgage FieldHouse
 * 2019-2025; the glass "transformation" 2019-2021) — procedural, CC0-1.0, no
 * textures.  bun generators/cle-rocket-arena.ts
 *
 * Map frame: x across the arena (+x south-east, towards Progressive Field),
 * y along it (+y north-east, towards Huron Road and the Gateway East
 * garage), z up, metres. Placed at bearing 56°, the long sides of the
 * outline (way/25312465: its north-west side is straight at 56°/236°).
 * Anchor: area centroid of the outline, -81.688347, 41.496662. z = 0 is the
 * lowest street at the footprint (East Huron/Ontario, south-west corner);
 * `elevation` 0.
 *
 * What makes it read as itself, from the photos: the low white oval dome
 * of the bowl, half covered by a broad curved white shell whose raised
 * north-west edge carries the wine-coloured "Rocket Mortgage" panel; the tall dark glass wall of the
 * 2019-21 renovation along the north-west (Huron Road) side and round the
 * north corner; the buff precast walls with big glazed openings on the
 * other sides, following the curved east end of the bowl.
 *
 * Evidence
 * - OSM: way/25312465 (building=yes, leisure=stadium, roof:shape=dome,
 *   roof:colour=white, Q387157). No parts. Neighbours not touched: Gateway
 *   East garage way/94452248 (26 m to the north-east), Progressive Field
 *   relation/3421281 (15 m beyond the east corner).
 * - Measured, lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019, at
 *   the start of the renovation), 5 m samples in this frame: streets 14.2 m
 *   (south) to 17 m (north) over the box's lowest return; the walls' tops
 *   and the roof's eaves 26.8-27.1 m above the lowest street; the roof's
 *   crown 39 m, broad and flat (37.6 m over most of the east half), falling
 *   to 31 m 10 m in from the eaves; the panel 1.4 m proud of the roof.
 * - Measured, USGS NAIP orthophoto (0.28 m): plan, the white roof, the
 *   wine-coloured lettered panel and its extent, the glass strip along the
 *   north-west side.
 * - Published (Wikipedia, "Rocket Arena"): opened 1994; capacity about
 *   19,400; the 2019-21 renovation added the glass facade on the north
 *   side.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Cards84664, "Rocket Mortgage FieldHouse 2022.png" (CC BY-SA 4.0; from
 *     the north-west, high: roof, panel, glass wall, Progressive Field)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_2022.png
 *   Cards84664, "Rocket Mortgage FieldHouse (2).jpg" (CC BY-SA 4.0; from
 *     the north, high: the glass wall and corner, the roof's eave)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_(2).jpg
 *   Cards84664, "Rocket Mortgage FieldHouse.jpg" (CC BY-SA 4.0; from the
 *     north-west, high, after the renovation)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse.jpg
 *   Cards84664, "Rocket Mortgage FieldHouse (August, 2019).jpg" (CC BY-SA
 *     4.0; the south-west side, buff walls, before the glass)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_(August,_2019).jpg
 *   Erik Drost, "Rocket Mortgage FieldHouse (51871113113)" and
 *     "(51913051807)" (CC BY 2.0; the glass wall from Huron Road, night)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_(51871113113).jpg
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_(51913051807).jpg
 *   Erik Drost, "Rocket Mortgage FieldHouse (51914315923)" (CC BY 2.0; the
 *     east corner from the street, buff walls, the roof's prow)
 *     https://commons.wikimedia.org/wiki/File:Rocket_Mortgage_FieldHouse_(51914315923).jpg
 *   Erik Drost, "Quicken Loans Arena.jpg" (CC BY 2.0; the Ontario Street
 *     front, before the renovation)
 *     https://commons.wikimedia.org/wiki/File:Quicken_Loans_Arena.jpg
 * - Estimated: the roof's shapes between the lidar samples (the dome as
 *   an ellipsoid cap, 27 m to 34 m; the shell as a gently curved sheet,
 *   38.9 m along its raised edge band, 37.6 m beyond, 2.4 m lower at its
 *   ends); the glass wall's mullion and floor lines; the window bands
 *   on the buff walls.
 * - Doubts: the 2019 lidar was flown as the renovation began. The glass
 *   wall's height (27 m, level with the eaves) is from the photos, which
 *   show it reaching the roof; the outline is OSM's current one. Not drawn:
 *   lettering (the panel is plain), banners, the bridge to the garage.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, type XY } from './dc-nationals-park'

// OSM way/25312465 in this frame (bearing 56°, about the anchor).
const OUTLINE: XY[] = [[-69.8, 65.0], [-69.9, 71.6], [-35.4, 72.0], [-34.8, 66.9], [-14.4, 67.6], [13.8, 67.5], [19.8, 69.4], [33.8, 71.0], [41.0, 70.2], [47.9, 68.5], [52.7, 66.4], [63.9, 66.9], [65.3, 60.6], [71.6, 54.0], [77.8, 46.6], [83.6, 36.0], [88.1, 24.0], [89.6, 10.4], [102.1, -15.0], [48.8, -41.3], [45.6, -44.8], [42.4, -47.2], [38.5, -49.3], [33.0, -51.6], [29.5, -52.7], [25.1, -53.1], [-29.1, -79.5], [-27.6, -82.5], [-32.4, -84.5], [-42.8, -90.1], [-69.4, -102.7], [-69.6, -70.7], [-69.6, -41.3], [-69.6, -18.9], [-69.6, 3.0]]

const white = new Part(), buff = new Part(), glass = new Part(), roof = new Part(), wine = new Part(), shell = new Part()
const trim = white
const EAVE = 26.8

const area = OUTLINE.reduce((s, p, i) => { const q = OUTLINE[(i + 1) % OUTLINE.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
const RING = area < 0 ? [...OUTLINE].reverse() : OUTLINE // counter-clockwise

// ---------------------------------------------------------------------------
// The walls: dark glass on the north-west and north-east (the 2019-21
// renovation), buff precast elsewhere.
const isGlass = (a: XY, b: XY) => (a[0] + b[0]) / 2 < -60 || ((a[1] + b[1]) / 2 > 60 && (a[0] + b[0]) / 2 < 60)
for (let i = 0; i < RING.length; i++) {
  const a = RING[i], b = RING[(i + 1) % RING.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: V3 = [e[1], -e[0], 0]
  const g = isGlass(a, b)
  // Split long walls into ≤ 5 m pieces near the ground for the terrain.
  const n = Math.max(1, Math.ceil(L / 5))
  for (let k = 0; k < n; k++) {
    const p0: XY = [a[0] + e[0] * (L * k) / n, a[1] + e[1] * (L * k) / n], p1: XY = [a[0] + e[0] * (L * (k + 1)) / n, a[1] + e[1] * (L * (k + 1)) / n]
    quad(g ? glass : buff, [[p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], EAVE - 1.2], [p0[0], p0[1], EAVE - 1.2]], o)
  }
  quad(trim, [[a[0], a[1], EAVE - 1.2], [b[0], b[1], EAVE - 1.2], [b[0], b[1], EAVE], [a[0], a[1], EAVE]], o)
  const q = (u: number, z: number, off = 0.06): V3 => [a[0] + e[0] * u + o[0] * off, a[1] + e[1] * u + o[1] * off, z]
  if (g) {
    // Pale mullions and floor lines on the glass wall.
    const m = Math.max(1, Math.round(L / 9))
    for (let k = 1; k < m; k++) {
      const u = (L * k) / m
      quad(trim, [q(u - 0.3, 0), q(u + 0.3, 0), q(u + 0.3, EAVE - 1.2), q(u - 0.3, EAVE - 1.2)], o)
    }
    for (const z of [8.5, 17]) quad(trim, [q(0, z - 0.3), q(L, z - 0.3), q(L, z + 0.3), q(0, z + 0.3)], o)
  } else if (L > 6) {
    // Broad glazed openings in the buff walls, two bands.
    const m = Math.max(1, Math.round(L / 9))
    for (let k = 0; k < m; k++) {
      const u0 = (L * k) / m + 1.2, u1 = (L * (k + 1)) / m - 1.2
      for (const [z0, z1] of [[2.5, 9.5], [12, 22.5]]) quad(glass, [q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1)], o)
    }
  }
}

// ---------------------------------------------------------------------------
// The roof, three parts (lidar and NAIP): a flat roof at the eaves over the
// box; the bowl's low white oval dome; and the curved white shell over the
// south-east two thirds, its raised north-west edge carrying the wine panel.
prism(RING, EAVE - 0.5, EAVE, trim, roof)

// The oval dome: 27 m at its rim, 34 m at its crown.
const DC: XY = [6, 0], DA = 74, DB = 50
const zDome = (p: XY) => {
  const r2 = ((p[0] - DC[0]) / DA) ** 2 + ((p[1] - DC[1]) / DB) ** 2
  return r2 >= 1 ? EAVE : EAVE + 7.2 * Math.sqrt(1 - r2)
}
{
  const N = 28, R = [1, 0.8, 0.55, 0.3, 0]
  const P = (i: number, k: number): V3 => {
    const t = (2 * Math.PI * i) / N, p: XY = [DC[0] + DA * R[k] * Math.cos(t), DC[1] + DB * R[k] * Math.sin(t)]
    return [p[0], p[1], k === 0 ? EAVE : zDome(p)]
  }
  for (let i = 0; i < N; i++) for (let k = 0; k < R.length - 1; k++) {
    const a0 = P(i, k), a1 = P(i + 1, k), b0 = P(i, k + 1), b1 = P(i + 1, k + 1)
    quad(white, [a0, a1, b1, b0], [0, 0, 1])
  }
}

// The shell: from its raised north-west edge (x -25, 39 m) over the dome to
// the south-east, falling gently along x and towards both ends.
const X0 = -25, X1 = 67, Y1 = 66
const yS = (x: number) => (x < 40 ? -50 + ((x - X0) * 6) / 65 : -44 + ((x - 40) * 22) / 27) // its south edge, following the outline
const zShell = (x: number, y: number) => (x < 12 ? 38.9 : 38.9 - 1.3 - (x - 12) * 0.015) - 2.4 * ((y - 8) / 58) ** 2
{
  const NU = 10, NV = 8
  const P = (i: number, j: number): V3 => {
    const x = X0 + ((X1 - X0) * i) / NU, y0 = yS(x), y = y0 + ((Y1 - y0) * j) / NV
    return [x, y, zShell(x, y)]
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) quad(shell, [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], [0, 0, 1])
  // Skirts down to the dome or the flat roof.
  const skirt = (a: V3, b: V3, out: V3) => {
    const za = Math.max(zDome([a[0], a[1]]), EAVE), zb = Math.max(zDome([b[0], b[1]]), EAVE)
    quad(shell, [[a[0], a[1], za], [b[0], b[1], zb], b, a], out)
  }
  for (let i = 0; i < NU; i++) {
    skirt(P(i, 0), P(i + 1, 0), [P(i + 1, 0)[1] - P(i, 0)[1], -(P(i + 1, 0)[0] - P(i, 0)[0]), 0])
    skirt(P(i, NV), P(i + 1, NV), [0, 1, 0])
  }
  for (let j = 0; j < NV; j++) {
    skirt(P(0, j), P(0, j + 1), [-1, 0, 0])
    skirt(P(NU, j), P(NU, j + 1), [1, 0, 0])
  }
  // The step where the raised edge band ends (lidar 1.3 m at x 12).
  for (let j = 0; j < NV; j++) {
    const y0 = yS(12) + ((Y1 - yS(12)) * j) / NV, y1 = yS(12) + ((Y1 - yS(12)) * (j + 1)) / NV
    quad(shell, [[12, y0, zShell(13, y0)], [12, y1, zShell(13, y1)], [12, y1, zShell(11, y1)], [12, y0, zShell(11, y0)]], [1, 0, 0])
  }
}

// The wine-coloured lettered panel on the raised edge band (NAIP).
{
  const NU = 3, NV = 8, x0 = -21, x1 = 4, y0 = -38, y1 = 56
  const pt = (i: number, j: number, dz = 0.35): V3 => {
    const x = x0 + ((x1 - x0) * i) / NU, y = y0 + ((y1 - y0) * j) / NV
    return [x, y, zShell(x, y) + dz]
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) quad(wine, [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)], [0, 0, 1])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: white, material: PALETTE.trim },
  { part: buff, material: finish('ra-buff', 0xdcc9ab) },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: wine, material: finish('ra-wine', 0x8a4f5c) },
  { part: shell, material: finish('ra-silver', 0xd4d9dc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Rocket Arena', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 56, osm: 'way/25312465', height: 39,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cle-rocket-arena.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
