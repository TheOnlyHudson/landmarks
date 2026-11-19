/**
 * Brickell City Centre (2016, Arquitectonica; climate ribbon with Hugh
 * Dutton Associates), 701 S Miami Avenue, Miami — original procedural
 * geometry, CC0-1.0.
 * bun generators/mia-brickell-city-centre.ts [out.glb]
 *
 * Uses the ring kit exported from mia-panorama-tower.ts.
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the blocks run with
 * the city grid). Anchor = area centroid of the OSM outline way/813418718,
 * 25.767201, -80.1933363.
 *
 * Extent: everything inside the OSM outline, phase one of the development:
 * the three podium blocks (west, east, north) and the bridges joining them
 * over S Miami Avenue and SE 8th Street; the EAST hotel (40 floors) on the
 * east block; the Reach and Rise condominium towers (west and north
 * blocks), whose crowns step down to the north; the two 20-storey office
 * buildings (Two and Three Brickell City Centre); and the climate ribbon,
 * the long folded glass-and-steel canopy that snakes over the open-air
 * shopping streets and bridges at about the podium tops. The Metromover
 * station (way/637612898) east of the outline and the later phases are
 * not part of it.
 *
 * Sources:
 *  - OSM: outline way/813418718 (wikidata Q4965973); parts way/813418712
 *    (EAST, 40 levels), way/813418713 (39), way/813418717 (39),
 *    way/813418714 and way/813418716 (20), way/813418715 (retail, levels
 *    1-3, which is also the bridges), way/1472210259/60/61 (podiums, 10, 9,
 *    11 levels); way/1179066271 (Lululemon, a shop room mapped as a
 *    building inside the west podium). Plans as drawn: lidar matches them
 *    to a metre or two.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019, after completion), 1 m grid. Measured: west tower 158-161 m on
 *    its south 55 m and 146-153 m on its north 20 m; north tower 160 m on
 *    its south half, stepping down to 146 m at its north end (its roof is
 *    mostly a lidar void; heights read from its parapet walls); EAST
 *    157-166 m; offices 67-73 m; podiums 36-40 m with lower 25-35 m
 *    retail zones in the west and east blocks (drawn at 26 and 24 m, the
 *    ribbon above them making up the rest); 25-35 m returns over S Miami Avenue
 *    between y -47 and -20 and over SE 8th Street (the bridges and the
 *    ribbon).
 *  - Estimated: the crown step positions (from lidar profiles and the
 *    photos), the ribbon's path, width and fold heights (from the aerial
 *    photo and the lidar's low bands), balcony band spacing (two floors),
 *    podium cladding and shopfront bands.
 *
 * Photos (Wikimedia Commons):
 *  - Brickell_City_Centre_Roof.jpg, Rostyslav Sipa, CC BY-SA 4.0 — aerial:
 *    the ribbon's folded glass panels and white edges, green podium roofs;
 *  - Brickell_City_Centre,_Miami,_FL.jpg, Mgrigorescu, CC BY-SA 4.0, and
 *    Climate_Ribbon_Brickell_City_Centre,_Miami_FL_2023.jpg and
 *    Brickell_City_Center_July_2016_7th_Street.jpg, Phillip Pessar, CC BY
 *    2.0 — the ribbon over the street and the bridge truss, silver podium
 *    cladding;
 *  - East_Brickell_City_Centre.jpg, Rise_Brickell_City_Centre.jpg,
 *    Reach_Brickell_City_Centre.jpg, Phillip Pessar, CC BY 2.0 — the towers
 *    and their stepped crowns.
 * No commercial imagery or 3D tiles were used. No look-only sources.
 *
 * Doubts: the ribbon is drawn as one continuous folded band along the
 * route the lidar and the aerial suggest; its real plan is more branched.
 * Which condominium is Reach and which Rise is not needed for the model
 * and is not asserted. The bridges are drawn as solid decks from 7 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, bevel, walls, capRing, hbands, vlines, panels, face, build } from './mia-panorama-tower'

const clad = new Part(), glass = new Part(), white = new Part(), ribbon = new Part(), green = new Part(), roof = new Part()

// ---------- OSM plans (metres from the anchor, world axes) ----------
const W_PODIUM: XY[] = [[-161.0, 3.0], [-158.4, -77.4], [-117.9, -76.1], [-74.2, -74.7], [-32.2, -73.3], [-11.7, -72.6], [-12.7, -43.8], [-13.4, -20.7], [-14.4, 7.7], [-71.0, 5.9], [-120.4, 4.3]]
const E_PODIUM: XY[] = [[90.6, -68.1], [114.6, -67.4], [113.8, -39.8], [112.2, 11.6], [56.5, 9.9], [10.8, 8.5], [11.6, -19.3], [12.4, -42.9], [13.2, -70.5]]
const N_PODIUM: XY[] = [[5.6, 115.4], [108.1, 118.7], [110.9, 34.3], [55.6, 32.5], [8.4, 30.8]]
const BRIDGE_S: XY[] = [[-13.4, -43.8], [12.4, -42.9], [11.6, -19.3], [-13.4, -20.7]]   // over S Miami Avenue
const BRIDGE_N: XY[] = [[28.7, 8.0], [56.5, 9.9], [55.6, 32.5], [28.7, 31.4]]           // over SE 8th Street
const W_TOWER: XY[] = [[-149.3, 1.5], [-147.1, -74.3], [-118.0, -73.5], [-120.4, 2.3]]
const N_TOWER: XY[] = [[67.7, 117.4], [70.5, 40.0], [100.3, 41.0], [97.5, 118.4]]
const EAST: XY[] = [[24.1, -70.2], [90.6, -68.1], [90.0, -49.8], [23.9, -52.0]]
const W_OFFICE: XY[] = [[-70.1, -22.4], [-13.4, -20.7], [-14.4, 7.7], [-71.0, 5.9]]
const E_OFFICE: XY[] = [[46.0, -19.0], [113.1, -17.0], [112.2, 11.6], [45.3, 9.5]]

/** Cut a ring to the band y0..y1 (both sides kept convex enough for these quads). */
function clipY(r: XY[], y0: number, y1: number): XY[] {
  const cut = (pts: XY[], c: number, keepAbove: boolean) => {
    const inside = (p: XY) => (keepAbove ? p[1] >= c : p[1] <= c)
    const out: XY[] = []
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length]
      if (inside(p)) out.push(p)
      if (inside(p) !== inside(q)) { const t = (c - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * t, c]) }
    })
    return out
  }
  return cut(cut(r, y0, true), y1, false)
}

// ---------- podiums: silver louvre cladding, shopfronts, green roofs ----------
function podium(r: XY[], h: number, z0 = 0) {
  const b = bevel(ccw(r), 0.6)
  walls(b, [[z0, h, clad]])
  capRing(green, b, h)
  if (z0 > 0) capRing(clad, b, z0, false)
  if (z0 === 0) panels(glass, b, 0.6, 6.5, { bay: 12, pier: 1.4, rowH: 5.9, spandrel: 0.6, minEdge: 8 })
  panels(glass, b, Math.max(z0, 9) + 1, h - 2, { bay: 16, pier: 2.5, rowH: 9, spandrel: 4.5, minEdge: 12 })
}
// west block: parking podium to 40 m in its west part, retail to 28 m east of it
podium(clipXr(W_PODIUM, -1e9, -104), 40)
podium(clipXr(W_PODIUM, -104, 1e9), 26)
// east block: the court under the ribbon is the low retail (25-35 m returns include the ribbon)
podium(clipXr(E_PODIUM, 45, 1e9), 36)
podium(clipY(clipXr(E_PODIUM, -1e9, 45), -1e9, -48), 36)
podium(clipY(clipXr(E_PODIUM, -1e9, 45), -48, 1e9), 24)
podium(N_PODIUM, 39)
podium(BRIDGE_S, 22, 7)
podium(BRIDGE_N, 24, 7)

function clipXr(r: XY[], x0: number, x1: number): XY[] {
  const sw = (pts: XY[]) => pts.map(([x, y]) => [y, x] as XY)
  return sw(clipY(sw(r), x0, x1))
}

// ---------- towers ----------
/** A glass tower with white balcony bands every two floors and stepped roofs [y0, y1, height]. */
function tower(r: XY[], base: number, steps: [number, number, number][], band = 6.4) {
  for (const [y0, y1, h] of steps) {
    const b = bevel(ccw(clipY(r, y0, y1)), 0.8)
    walls(b, [[base, h - 2.5, glass], [h - 2.5, h, white]])
    capRing(roof, b, h)
    const z: number[] = []
    for (let k = base + band; k < h - 4; k += band) z.push(k)
    hbands(white, b, z, 1.1, 0.06, 4)
  }
}
tower(W_TOWER, 40, [[-80, -38, 160], [-38, -20, 156], [-20, 5, 150]])
tower(N_TOWER, 39, [[38, 78, 160], [78, 98, 154], [98, 120, 147]])
tower(EAST, 36, [[-80, 0, 163]], 6.2)

// offices: glass with pale vertical fins and floor-group lines
for (const [r, base, h] of [[W_OFFICE, 28, 70], [E_OFFICE, 36, 69]] as [XY[], number, number][]) {
  const b = bevel(ccw(r), 0.6)
  walls(b, [[base, h - 2, glass], [h - 2, h, white]])
  capRing(roof, b, h)
  vlines(white, b, base, h - 2, 6, 0.7, 0.06, 10)
  const z: number[] = []
  for (let k = base + 8; k < h - 3; k += 8) z.push(k)
  hbands(white, b, z, 0.8, 0.07, 4)
}

// ---------- the climate ribbon ----------
// path nodes: [x, y, z, half-width]; the band folds up and down along its length
const PATH: [number, number, number, number][] = [
  [-110, -33, 37, 13], [-86, -32, 41, 15], [-62, -34, 36, 15], [-38, -31, 41, 14], [-14, -32, 34, 13],
  [8, -31, 37, 13], [24, -22, 33, 13], [34, -6, 37, 12], [40, 12, 33, 12], [42, 30, 39, 12],
  [41, 52, 44, 13], [40, 76, 48, 13], [40, 100, 43, 12],
]
{
  const sec = PATH.map(([x, y, z, w], i) => {
    const a = PATH[Math.max(0, i - 1)], b = PATH[Math.min(PATH.length - 1, i + 1)]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
    const nx = -ty / l, ny = tx / l
    const fold = i % 2 ? 3.2 : -2.6 // centre line above or below the edges
    return { L: [x + nx * w, y + ny * w, z] as V3, C: [x, y, z + fold] as V3, R: [x - nx * w, y - ny * w, z - 0.8] as V3 }
  })
  const tri = (a: V3, b: V3, c: V3) => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...n); n = [n[0] / l, n[1] / l, n[2] / l]
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    face(ribbon, [a, b, c], n)                                  // the glass, seen from above
    face(ribbon, [a, c, b], [-n[0], -n[1], -n[2]])              // and from the street below
  }
  for (let i = 0; i < sec.length - 1; i++) {
    const s = sec[i], t = sec[i + 1]
    tri(s.L, s.C, t.C); tri(s.L, t.C, t.L)
    tri(s.C, s.R, t.R); tri(s.C, t.R, t.C)
  }
  // white steel edges along both sides: a 2.3 m fascia
  for (const side of ['L', 'R'] as const)
    for (let i = 0; i < sec.length - 1; i++) {
      const a = sec[i][side], b = sec[i + 1][side]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
      let n: V3 = [dy / l, -dx / l, 0]
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const cen = [(sec[i].C[0] + sec[i + 1].C[0]) / 2, (sec[i].C[1] + sec[i + 1].C[1]) / 2]
      if ((mid[0] - cen[0]) * n[0] + (mid[1] - cen[1]) * n[1] < 0) n = [-n[0], -n[1], 0]
      const q: V3[] = [[a[0], a[1], a[2] - 2.0], [b[0], b[1], b[2] - 2.0], [b[0], b[1], b[2] + 0.3], [a[0], a[1], a[2] + 0.3]]
      face(white, q, n)
      face(white, [...q].reverse(), [-n[0], -n[1], 0])
    }
}

await build('Brickell City Centre', 'mia-brickell-city-centre', [
  { part: clad, material: finish('bcc-cladding', 0xcfd0cc) },
  { part: glass, material: windowVariant(2, 0x7896ad) },
  { part: white, material: PALETTE.trim },
  { part: ribbon, material: PALETTE.glass },
  { part: green, material: finish('bcc-green-roof', 0x9db084) },
  { part: roof, material: PALETTE.roof },
], {
  bearing: 0, elevation: 0, height: 163,
  replaces: ['way/813418718', 'way/813418712', 'way/813418713', 'way/813418714', 'way/813418715', 'way/813418716', 'way/813418717', 'way/1472210259', 'way/1472210260', 'way/1472210261', 'way/1179066271'],
}, process.argv[2], 6500)
