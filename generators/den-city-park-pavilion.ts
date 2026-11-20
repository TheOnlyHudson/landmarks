/**
 * City Park Pavilion (Ferril Lake boathouse), Denver (1929, Spanish Revival; Fisher & Fisher)
 * — procedural, CC0-1.0, no textures.
 * bun generators/den-city-park-pavilion.ts
 *
 * What makes it this building: a long low cream-stucco pavilion under red-orange tile roofs,
 * a taller central block with its gable ends facing the lake and the lawn, two square towers
 * with low hipped tile caps and arched openings near the top flanking that block on the lake
 * side, a glazed arcade of round-arched openings along the lake side of both wings (lit at
 * night), tall windows along the lawn side, and gabled end pavilions. The lake is the map's.
 *
 * Frame: x east (the lake side), y north (bearing 0), z up, metres; origin at the centroid
 * of OSM way/72601498. z = 0 is 1605.96 m NAVD88, the map's lowest ground under the
 * footprint (at the lake edge); the lidar ground round the walls is 1607.4 m, so every
 * height below is drawn 1.44 m up (`LIFT`) and the walls run down to z = 0.
 *
 * Sources:
 * - OSM (API map call, 2026-11-19): outline way/72601498 (building=public, height 16,
 *   "City Park Pavilion"); the tower bumps on its east side. No parts.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, above the ground (1607.4):
 *   wings' ridge 8.0 at x −2, eaves 5.0 at x −8 and 4; the lakeside arcade roof 4.1–4.7;
 *   the central block's ridge (running east–west) 11.0, eaves 8.8; the towers' tops 14.8
 *   (cell maxima 14.5–14.8, so the caps' peaks); the end pavilions' ridges 6.4–7.4.
 *   OSM's 16 m is the towers rounded up.
 * - Photos (EVIDENCE):
 *   - DrexRockman, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Ferril_Lake_Boat_House.jpg
 *     (the lake side at night: towers, central gable, lit arcades, end gable)
 *   - halseike, CC BY 2.0: https://www.flickr.com/photos/99624358@N00/15130457254 (aerial
 *     from the west: lawn side, roofs, colours)
 *   - Sarbjit Bahga, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:City_Park_overlooking_Ferril_Lake_and_Downtown_Denver.jpg
 *     (far view across the lake)
 *
 * Measured / published / estimated:
 * - measured: plan (OSM), all heights (lidar).
 * - estimated from photos: bay counts and opening sizes, tower openings, colours.
 *
 * Doubts: no close daylight photo of the lake side; its openings are read from the night
 * photo. The open porch at the left of that photo is not in the OSM outline and isn't drawn.
 * The end pavilions' roofs are drawn as east–west gables; the lidar suggests they may be
 * hipped at their outer ends.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { finish, PALETTE } from './palette'

type P2 = [number, number]
const LIFT = 1.44

const WX0 = -8.0, WX1 = 4.0, AX1 = 7.7         // wing walls, arcade front
const RX = (WX0 + WX1) / 2                      // wing ridge line
const EAVE = 5.0, RIDGE = 8.0
const CY = 4.7, CX0 = -8.3, CX1 = 8.2, CE = 8.8, CR = 11.0    // central block
const TY0 = 4.7, TY1 = 8.7, TX0 = 4.2, TX1 = 8.6, TE = 13.6, TP = 14.8 // towers
const EY = 22.5, EYO = 30.7, EE = 5.2, ER = 7.4  // end pavilions

/** Box walls (no top). */
function walls(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
}
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
/** A gable roof over x0..x1 × y0..y1, ridge along y (axis 'y') or x, overhang o. */
function gable(roof: Part, wall: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, axis: 'x' | 'y', o = 0.5) {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2
    face(roof, [x0 - o, y0 - o, ze - 0.2], [x0 - o, y1 + o, ze - 0.2], [xm, y1 + o, zr], [xm, y0 - o, zr], [-(zr - ze), 0, xm - x0])
    face(roof, [xm, y0 - o, zr], [xm, y1 + o, zr], [x1 + o, y1 + o, ze - 0.2], [x1 + o, y0 - o, ze - 0.2], [zr - ze, 0, x1 - xm])
    tri(wall, [x0, y0, ze], [x1, y0, ze], [xm, y0, zr], [0, -1, 0])
    tri(wall, [x0, y1, ze], [x1, y1, ze], [xm, y1, zr], [0, 1, 0])
  } else {
    const ym = (y0 + y1) / 2
    face(roof, [x0 - o, y0 - o, ze - 0.2], [x1 + o, y0 - o, ze - 0.2], [x1 + o, ym, zr], [x0 - o, ym, zr], [0, -(zr - ze), ym - y0])
    face(roof, [x0 - o, ym, zr], [x1 + o, ym, zr], [x1 + o, y1 + o, ze - 0.2], [x0 - o, y1 + o, ze - 0.2], [0, zr - ze, y1 - ym])
    tri(wall, [x0, y0, ze], [x0, y1, ze], [x0, ym, zr], [-1, 0, 0])
    tri(wall, [x1, y0, ze], [x1, y1, ze], [x1, ym, zr], [1, 0, 0])
  }
}
/** A flat opening on a wall facing n (axis-aligned), centred at (c along the wall), sill z0, width w, height h, round head if arched. */
function opening(p: Part, n: '+x' | '-x' | '+y' | '-y', plane: number, c: number, z0: number, w: number, h: number, arched: boolean, off = 0.06) {
  const pts: P2[] = [[c - w / 2, z0], [c + w / 2, z0]]
  if (arched) {
    const r = w / 2, zs = z0 + h - r
    for (let k = 0; k <= 8; k++) { const a = (Math.PI * k) / 8; pts.push([c + r * Math.cos(a), zs + r * Math.sin(a)]) }
  } else pts.push([c + w / 2, z0 + h], [c - w / 2, z0 + h])
  const P = pts.map(([u, z]): V3 => n === '+x' ? [plane + off, u, z] : n === '-x' ? [plane - off, u, z] : n === '+y' ? [u, plane + off, z] : [u, plane - off, z])
  const N: V3 = n === '+x' ? [1, 0, 0] : n === '-x' ? [-1, 0, 0] : n === '+y' ? [0, 1, 0] : [0, -1, 0]
  for (let i = 1; i < P.length - 1; i++) tri(p, P[0], P[i], P[i + 1], N)
}

export function build() {
  const stucco = new Part(), tile = new Part(), win = new Part(), trim = new Part()

  // ---- Wings (both sides of the central block)
  for (const [y0, y1] of [[-EY, -CY], [CY, EY]] as [number, number][]) {
    walls(stucco, WX0, WX1, y0, y1, 0, EAVE)
    face(tile, [WX0 - 0.5, y0, EAVE - 0.2], [WX0 - 0.5, y1, EAVE - 0.2], [RX, y1, RIDGE], [RX, y0, RIDGE], [-(RIDGE - EAVE), 0, RX - WX0])
    face(tile, [RX, y0, RIDGE], [RX, y1, RIDGE], [WX1, y1, RIDGE - (RIDGE - EAVE) * ((WX1 - RX) / (WX1 - RX))], [WX1, y0, EAVE], [RIDGE - EAVE, 0, WX1 - RX])
    // the lakeside arcade under a lean-to
    walls(stucco, WX1, AX1, y0, y1, 0, 4.2)
    face(tile, [WX1, y0, EAVE], [WX1, y1, EAVE], [AX1 + 0.5, y1, 4.0], [AX1 + 0.5, y0, 4.0], [EAVE - 4.0, 0, AX1 + 0.5 - WX1])
    // arcade openings (glazed, lit at night)
    const n = Math.round((y1 - y0) / 3.3)
    for (let i = 0; i < n; i++) opening(win, '+x', AX1, y0 + ((i + 0.5) * (y1 - y0)) / n, 0.6, 2.4, 3.2, true)
    // lawn-side tall windows
    const m = Math.round((y1 - y0) / 2.6)
    for (let i = 0; i < m; i++) opening(win, "-x", WX0, y0 + ((i + 0.5) * (y1 - y0)) / m, 0.8, 1.8, 2.9, false)
    // cornice line
    face(trim, [WX0 - 0.12, y0, EAVE - 0.45], [WX0 - 0.12, y1, EAVE - 0.45], [WX0 - 0.12, y1, EAVE - 0.2], [WX0 - 0.12, y0, EAVE - 0.2], [-1, 0, 0])
  }

  // ---- The central block, gables east and west
  walls(stucco, CX0, CX1, -CY, CY, 0, CE)
  gable(tile, stucco, CX0, CX1, -CY, CY, CE, CR, 'x')
  for (const [side, plane] of [['+x', CX1], ['-x', CX0]] as ['+x' | '-x', number][]) {
    for (const c of [-2.4, 0, 2.4]) {
      opening(win, side, plane, c, 0.3, 1.8, 3.4, true)
      opening(win, side, plane, c, 5.2, 1.1, 1.6, false)
    }
    // a belt course between the floors
    const s = side === '+x' ? 1 : -1
    face(trim, [plane + 0.1 * s, -CY, 4.2], [plane + 0.1 * s, CY, 4.2], [plane + 0.1 * s, CY, 4.6], [plane + 0.1 * s, -CY, 4.6], [s, 0, 0])
  }

  // ---- The towers, with low hipped caps
  for (const [y0, y1] of [[-TY1, -TY0], [TY0, TY1]] as [number, number][]) {
    walls(stucco, TX0, TX1, y0, y1, 0, TE)
    const cx = (TX0 + TX1) / 2, cy = (y0 + y1) / 2, o = 0.45
    const c: V3[] = [[TX0 - o, y0 - o, TE - 0.1], [TX1 + o, y0 - o, TE - 0.1], [TX1 + o, y1 + o, TE - 0.1], [TX0 - o, y1 + o, TE - 0.1]]
    const P: V3 = [cx, cy, TP]
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      tri(tile, a, b, P, [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 1.5])
    }
    face(trim, c[0], c[1], c[2], c[3], [0, 0, -1])
    // openings near the top (lit at night) and small windows lower down
    opening(win, '+x', TX1, cy, TE - 2.9, 1.5, 2.2, true)
    opening(win, '+y', y1, cx, TE - 2.9, 1.3, 2.2, true)
    opening(win, '-y', y0, cx, TE - 2.9, 1.3, 2.2, true)
    opening(win, '+x', TX1, cy, 6.2, 0.5, 0.9, false)
    face(trim, [TX0 - 0.1, y0 - 0.1, TE - 3.4], [TX1 + 0.1, y0 - 0.1, TE - 3.4], [TX1 + 0.1, y0 - 0.1, TE - 3.1], [TX0 - 0.1, y0 - 0.1, TE - 3.1], [0, -1, 0])
    face(trim, [TX1 + 0.1, y0 - 0.1, TE - 3.4], [TX1 + 0.1, y1 + 0.1, TE - 3.4], [TX1 + 0.1, y1 + 0.1, TE - 3.1], [TX1 + 0.1, y0 - 0.1, TE - 3.1], [1, 0, 0])
    face(trim, [TX1 + 0.1, y1 + 0.1, TE - 3.4], [TX0 - 0.1, y1 + 0.1, TE - 3.4], [TX0 - 0.1, y1 + 0.1, TE - 3.1], [TX1 + 0.1, y1 + 0.1, TE - 3.1], [0, 1, 0])
  }

  // ---- End pavilions, gables east and west
  for (const [y0, y1] of [[-EYO, -EY], [EY, EYO]] as [number, number][]) {
    walls(stucco, CX0, 7.9, y0, y1, 0, EE)
    gable(tile, stucco, CX0, 7.9, y0, y1, EE, ER, 'x')
    for (const [side, plane] of [['+x', 7.9], ['-x', CX0]] as ['+x' | '-x', number][])
      for (const d of [-2.2, 2.2]) opening(win, side, plane, (y0 + y1) / 2 + d, 1.0, 1.4, 2.6, true)
    const yo = y0 < 0 ? y0 : y1, nn = y0 < 0 ? '-y' : '+y'
    for (const c of [-4.5, -1.5, 1.5, 4.5]) opening(win, nn as '-y' | '+y', yo, c, 0.9, 1.4, 2.6, false)
  }

  // Lift everything above the base to the real ground (lidar 1607.4) over the map's lowest
  // point under the footprint (1605.96, at the lake edge; tools/terrain.ts check); walls keep
  // their feet at z = 0. In glTF the vertical is the second coordinate.
  for (const p of [stucco, tile, win, trim])
    for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.01) p.pos[i] += LIFT
  return { stucco, tile, win, trim }
}

if (import.meta.main) {
  const m = build()
  const parts = [
    { part: m.stucco, material: finish('cream-stucco', 0xe8d3a2) },
    { part: m.tile, material: finish('red-tile', 0xcc7558) },
    { part: m.win, material: { ...PALETTE.window, color: 0x5f8086 } },
    { part: m.trim, material: PALETTE.trim },
  ]
  const glb = writeGlb('City Park Pavilion', parts)
  await Bun.write(new URL('../models/den-city-park-pavilion.glb', import.meta.url), glb)
  console.log(`den-city-park-pavilion.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
