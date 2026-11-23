/**
 * LeFrak Center at Lakeside, Prospect Park, Brooklyn (Tod Williams Billie
 * Tsien Architects, 2013) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lefrak-center.ts
 *
 * Frame: x = east, y = north, z up, metres; bearing 0. Anchor: the area
 * centroid of the building multipolygon OSM relation/9803047 (-73.963993,
 * 40.657365). z 0 = the rink floor, the lowest ground under the footprint.
 *
 * What it is: a long low building pressed into the landscape, its roofs
 * planted and continuous with the slopes behind it (north and east), with
 * the covered rink under a big flat canopy on heavy columns and the open
 * oval rink to the south. Ice and water are the map's; the model draws the
 * buildings, the canopy, and the rinks' white boards.
 *
 * Look (lead-review rework, 2026-11-23): the canopy is a dark-edged slab
 * from every side: a charcoal metal fascia 1.3 m deep plus a 0.25 m lip
 * (photos f47, f55), drawn as a 0.9 m dark rim on top (bolder than the
 * real ~0.5 m so it holds at phone size), over the deep blue soffit
 * (floodlit at night: its downlights). Its top stays planted, following
 * NAIP (a lawn rectangle), in a darker olive than the building roofs so it
 * reads as a separate slab. The buildings get dark granite walls with long
 * glass walls (0.3…3.2 m, panels between stone piers, `window`, lit at
 * night) on the faces to the rinks and the passage (photos jzx1, jzx2, jeh,
 * a28, a38), a pale coping band and a 0.8 m pale roof-edge strip (the
 * paved edges and rails on the green roofs), and lighter grass-green roofs.
 * Granite, fascia and columns share one charcoal material (six-material
 * limit); the coping and the boards share one white.
 *
 * Evidence
 * - OSM (ODbL): relation/9803047 building=yes, height=10 (outline);
 *   building:part ways 702922685 (flat grass roof), 702922686 (skillion
 *   grass roof falling to 314.5°, the fan-shaped north wing),
 *   703212340 (east block, grass roof), 703212342 and 703212343 (skillion
 *   grass roofs on its south-east and north-east ends), 702944837 (the
 *   footbridge over the passage, min_height 9), 704974539 (the canopy,
 *   13–15 m) and 1520469912…19 (its eight columns, 2.5 × 1.9 m). OSM's
 *   heights are about double the lidar's throughout; the lidar wins.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017, after the 2013 opening),
 *   1 m grid, read in this frame. Rink floor 0.6 m over the crop minimum =
 *   z 0. Measured above it: canopy top 8.7, flat over x −52…18, y −25…8;
 *   roofs fitted as planes to the lidar surface (trees cut): north flat
 *   part h = 4.66 − 0.0039x − 0.0089y (±0.3); north fan
 *   h = 6.99 + 0.0774x − 0.0365y (±0.7, clamped 0.6…5.4); east block
 *   h = 4.81 − 0.0101x − 0.0059y; its south-east end
 *   h = 8.79 − 0.0747x + 0.0239y; its north-east end
 *   h = 7.55 − 0.0581x − 0.0512y. Ground outside east ~3.2–4.0, north-west
 *   ~0.3–1.5: the building is buried on the east and north, open to the
 *   rinks on the west and south.
 * - USGS NAIP (public domain): the canopy roof is a planted green rectangle
 *   70 × 34 m; the open rink an oval 51.8 × 44.8 m centred at (−12, −52)
 *   (NAIP shifted ~5 m against OSM, corrected on the canopy).
 * - Mapterhorn terrain shows the planted roofs as hill (z ~5 over them).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   JZX422, "LeFrak Center at Lakeside.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:LeFrak_Center_at_Lakeside.jpg
 *     (under the canopy: blue soffit, columns, dark granite walls over a
 *     glazed base, white boards);
 *   JZX422, "LeFrak Center at Lakeside Prospect Park.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:LeFrak_Center_at_Lakeside_Prospect_Park.jpg
 *     (the passage: canopy edge, granite walls, the footbridge);
 *   Jim.henderson, "Lefrak ice rink 2022 jeh.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Lefrak_ice_rink_2022_jeh.jpg
 *   Epicgenius, "Prospect Park Brooklyn Feb 2019 47.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Feb_2019_47.jpg
 *     (the canopy from outside: thin dark fascia, slim columns);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 37.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_37.jpg
 *     (canopy and the rink-side wall from the south-west);
 *   Epicgenius, "Prospect Park Brooklyn Feb 2019 55.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Feb_2019_55.jpg
 *     (the canopy's long south side across the open rink: deep fascia,
 *     heavy columns, the glass rink-side wall under it);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 28.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_28.jpg
 *     (the canopy from the west: glass and granite under it);
 *   Epicgenius, "Prospect Park Brooklyn Aug 2019 38.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Aug_2019_38.jpg
 *     (the east block's granite south end and café on the open rink).
 *
 * Estimated: fascia 1.3 m + 0.25 m lip (photos); columns 1.6 × 1.2 m
 * (photos show heavy piers; OSM's parts are 2.5 × 1.9 m); glass walls
 * 0.3–3.2 m, bays ~6 m with 0.8 m piers (photos); coping band 0.45 m;
 * which faces are glass (photos; the east and north sides are buried);
 * the covered rink's boards (56 × 26 m, from the column bays and photos)
 * and the oval's, 1.1 m high and 0.3 m thick.
 *
 * Doubts: the fascia is dark charcoal as reviewed; in full sun (f55) it
 * reads silver-grey. The boards' pale grey-blue band is left out (the
 * six-material limit). The roof planes are fits, the real roofs are landform with
 * paths, planters and glass rails (left out); the canopy's soffit graphics
 * (white grooves, lights) are left out; the oval's boards are from NAIP.
 */
import { Part, type V3 } from './mesh'
import { finishModel, capPoly, area, type XY } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'
import { PALETTE, finish } from './palette'

type H = (x: number, y: number) => number

/** A roof over a polygon whose height follows h: triangulated flat, then lifted. */
function draped(p: Part, ring: XY[], h: H) {
  const tmp = new Part()
  capPoly(tmp, ring, 0)
  for (let i = 0; i < tmp.pos.length; i += 9) {
    const v = [0, 1, 2].map((k) => { const gx = tmp.pos[i + 3 * k], gz = tmp.pos[i + 3 * k + 2]; return [gx, -gz, h(gx, -gz)] as V3 })
    p.tri(v[0], v[1], v[2])
  }
}

const ccw = (ring: XY[]) => (area(ring) < 0 ? ring.slice().reverse() : ring.slice())

/**
 * Walls round a ring, wound outward: stone from z 0 up to h − band, then a
 * pale coping band to h + lift, capped by a pale strip `cap` wide on the roof
 * edge (the roofs' paved edges and rails). Where `glass(a, b, n)` says so, a
 * long glass wall 0.3…min(3.2, h − 1) m runs along the edge, in panels
 * between stone piers.
 */
/** Distance from point q to segment a→b. */
function segDist(q: XY, a: XY, b: XY) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy
  const t = L2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy)
}
/** True where edge a→b lies on an edge of one of `others` (a seam between two roof parts). */
const onSeam = (a: XY, b: XY, others: XY[][]) => {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return others.some((o) => o.some((p, i) => segDist(m, p, o[(i + 1) % o.length]) < 0.4))
}

function walls(stone: Part, cope: Part, win: Part, ring: XY[], h: H, glass: (a: XY, b: XY, n: XY) => boolean = () => false, others: XY[][] = [], band = 0.45, lift = 0.12, cap = 0.8) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], N: V3 = [n[0], n[1], 0]
    const ha = h(...a), hb = h(...b)
    if (onSeam(a, b, others)) { quadF(stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], hb], [a[0], a[1], ha], N); continue }
    quadF(stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ha - band], [a[0], a[1], ha - band], N)
    quadF(cope, [a[0], a[1], ha - band], [b[0], b[1], hb - band], [b[0], b[1], hb + lift], [a[0], a[1], ha + lift], N)
    // cap strip, inward, following the roof height
    const ia: XY = [a[0] - n[0] * cap, a[1] - n[1] * cap], ib: XY = [b[0] - n[0] * cap, b[1] - n[1] * cap]
    quadF(cope, [a[0], a[1], ha + lift], [b[0], b[1], hb + lift], [ib[0], ib[1], h(...ib) + lift], [ia[0], ia[1], h(...ia) + lift], [0, 0, 1])
    quadF(cope, [ib[0], ib[1], h(...ib)], [ia[0], ia[1], h(...ia)], [ia[0], ia[1], h(...ia) + lift], [ib[0], ib[1], h(...ib) + lift], [-n[0], -n[1], 0])
    if (!glass(a, b, n)) continue
    const top = Math.min(3.2, Math.min(ha, hb) - 1.0)
    if (top < 1.8 || L < 3) continue
    const bay = 6, pier = 0.8, k = Math.max(1, Math.round(L / bay)), w = L / k, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.06, a[1] + u[1] * s + n[1] * 0.06, z]
    for (let j = 0; j < k; j++) {
      const s0 = j * w + (j === 0 ? pier : pier / 2), s1 = (j + 1) * w - (j === k - 1 ? pier : pier / 2)
      quadF(win, P(s0, 0.3), P(s1, 0.3), P(s1, top), P(s0, top), N)
    }
  }
}

/** Boards: a thin wall 1.1 m high round a closed path of points (counter-clockwise). */
function boards(p: Part, path: XY[], t = 0.4, hgt = 1.1) {
  for (let i = 0; i < path.length; i++) {
    const a = path[i], b = path[(i + 1) % path.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L]
    const o = (q: XY, s: number): V3 => [q[0] + n[0] * s * t / 2, q[1] + n[1] * s * t / 2, 0]
    const up = (v: V3): V3 => [v[0], v[1], hgt]
    quadF(p, o(a, 1), o(b, 1), up(o(b, 1)), up(o(a, 1)), [n[0], n[1], 0])
    quadF(p, o(a, -1), o(b, -1), up(o(b, -1)), up(o(a, -1)), [-n[0], -n[1], 0])
    quadF(p, up(o(a, 1)), up(o(b, 1)), up(o(b, -1)), up(o(a, -1)), [0, 0, 1])
  }
}

function roundRect(x0: number, y0: number, x1: number, y1: number, r: number, seg = 4): XY[] {
  const out: XY[] = []
  const c: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]
  for (const [cx, cy, a0] of c) for (let k = 0; k <= seg; k++) { const a = a0 + (Math.PI / 2) * (k / seg); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}


// ===========================================================================

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const near = (v: number, t: number, e = 0.6) => Math.abs(v - t) < e

function build() {
  // dark: granite walls, the canopy's metal fascia and its columns (both
  // charcoal in the photos); pale: coping, roof-edge paths, rink boards.
  const dark = new Part(), green = new Part(), olive = new Part(), soffit = new Part(), win = new Part(), pale = new Part()

  // ---- The canopy (lidar top 8.7) on eight heavy columns (OSM positions).
  // Fascia 1.3 m deep plus a 0.25 m lip round the planted top (photos).
  const CX0 = -52.0, CX1 = 17.9, CY0 = -25.0, CY1 = 7.9, CT = 8.7, CB = 7.4, LIPZ = CT + 0.25
  const ring: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], n: V3 = [b[1] - a[1], a[0] - b[0], 0]
    quadF(dark, [a[0], a[1], CB], [b[0], b[1], CB], [b[0], b[1], LIPZ], [a[0], a[1], LIPZ], n)
  }
  const lip = 0.9 // the dark rim, a little bolder than the real ~0.5 m so it holds at phone size
  const inner: XY[] = [[CX0 + lip, CY0 + lip], [CX1 - lip, CY0 + lip], [CX1 - lip, CY1 - lip], [CX0 + lip, CY1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], ia = inner[i], ib = inner[(i + 1) % 4]
    quadF(dark, [a[0], a[1], LIPZ], [b[0], b[1], LIPZ], [ib[0], ib[1], LIPZ], [ia[0], ia[1], LIPZ], [0, 0, 1])
    const n: V3 = [-(b[1] - a[1]), -(a[0] - b[0]), 0]
    quadF(dark, [ia[0], ia[1], CT], [ib[0], ib[1], CT], [ib[0], ib[1], LIPZ], [ia[0], ia[1], LIPZ], n)
  }
  capPoly(olive, inner, CT)
  capPoly(soffit, ring, CB, false)
  for (const [x, y] of [[-50.05, 6.55], [-50.55, -23.75], [12.75, -23.75], [12.75, 6.65], [12.8, -8.55], [-33.75, -23.85], [-14.45, -23.75], [3.15, -23.95]] as XY[])
    box(dark, x - 0.8, y - 0.6, x + 0.8, y + 0.6, 0, CB)

  // ---- The north wing: a flat planted part and the fan falling to the north-west.
  const A: XY[] = [[-38.4, 9.3], [-38.4, 7.9], [12.8, 7.9], [12.8, 26.6], [3.1, 26.6], [3.2, 33.6], [3.1, 35.8], [2.5, 39.4], [1.1, 43.4], [-0.8, 47.1]]
  const B: XY[] = [[-38.4, 9.3], [-0.8, 47.1], [-6.5, 53.9], [-13.6, 58.4], [-20.4, 60.3], [-27.2, 60.6], [-36.5, 58.1], [-45.2, 53.4], [-52.3, 48.2], [-57.8, 43.3], [-62.5, 39.1], [-66.9, 34.2], [-69.8, 29.0], [-70.4, 23.5], [-68.9, 18.2], [-64.3, 13.8], [-59.1, 11.4], [-51.8, 10.1], [-44.4, 9.3]]
  const hA: H = (x, y) => 4.66 - 0.0039 * x - 0.0089 * y
  const hB: H = (x, y) => clamp(6.99 + 0.0774 * x - 0.0365 * y, 0.6, Math.min(5.4, hA(x, y)))
  // glass: the rink face under the canopy (south) and the passage (east)
  walls(dark, pale, win, A, hA, (a, b, n) => (n[1] < -0.9 && near(a[1], 7.9)) || (n[0] > 0.9 && near(a[0], 12.8)), [B])
  draped(green, A, hA)
  // glass: the fan's south face towards the rinks
  walls(dark, pale, win, B, hB, (a, b, n) => n[1] < -0.5 && (a[1] + b[1]) / 2 < 12, [A])
  draped(green, B, hB)

  // ---- The east block and its two sloping ends.
  const E: XY[] = [[31.5, 17.9], [16.5, 17.9], [16.5, 12.2], [16.6, -32.5], [18.5, -32.5], [18.6, -67.8], [37.4, -67.7], [37.3, -19.4], [52.5, -19.4], [52.4, 17.9]]
  const SE: XY[] = [[37.3, -19.4], [37.4, -67.7], [37.4, -82.6], [52.7, -82.5], [52.5, -19.4]]
  const NE: XY[] = [[52.4, 35.8], [52.4, 17.9], [31.5, 17.9], [31.4, 35.8]]
  const hE: H = (x, y) => 4.81 - 0.0101 * x - 0.0059 * y
  const hSE: H = (x, y) => clamp(8.79 - 0.0747 * x + 0.0239 * y, 1.0, hE(x, y))
  const hNE: H = (x, y) => clamp(7.55 - 0.0581 * x - 0.0512 * y, 1.0, hE(x, y))
  // glass: the faces on both rinks (west) and on the passage (north end)
  walls(dark, pale, win, E, hE, (a, b, n) => (n[0] < -0.9 && a[0] < 19) || (n[1] > 0.9 && near(a[1], 17.9) && Math.max(a[0], b[0]) <= 31.6), [SE, NE])
  draped(green, E, hE)
  // glass: the café front on the open rink (west, south of the east block)
  walls(dark, pale, win, SE, hSE, (a, b, n) => n[0] < -0.9 && Math.min(a[1], b[1]) < -68, [E])
  draped(green, SE, hSE)
  walls(dark, pale, win, NE, hNE, undefined, [E])
  draped(green, NE, hNE)
  // the footbridge over the passage at roof level
  box(dark, 12.8, 12.2, 16.5, 14.3, 3.9, 4.55, true)
  box(pale, 12.8, 12.2, 16.5, 14.3, 4.55, 4.7)

  // ---- Rink boards: the covered rink and the open oval (NAIP). White, bold.
  boards(pale, roundRect(-48.5, -21.5, 9.5, 4.5, 7.5, 4), 0.3, 1.1)
  const oval: XY[] = []
  for (let k = 0; k < 40; k++) { const a = (2 * Math.PI * k) / 40; oval.push([-12 + 25.9 * Math.cos(a), -52 + 22.4 * Math.sin(a)]) }
  boards(pale, oval, 0.3, 1.1)

  finishModel('LeFrak Center at Lakeside', 'nyc-lefrak-center', [
    { part: dark, material: finish('lakeside-granite', 0x4f4f52) },
    { part: green, material: finish('green-roof', 0x9fb476) },
    { part: olive, material: finish('canopy-roof', 0x6b7149) },
    { part: soffit, material: { ...finish('canopy-blue', 0x2f3f86), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.9 : 0) } },
    { part: win, material: PALETTE.window },
    { part: pale, material: finish('trim-white', 0xf4f1ea) },
  ], { bearing: 0, osm: 'relation/9803047', height: 8.95 }, 5000)
}

if (import.meta.main) build()
