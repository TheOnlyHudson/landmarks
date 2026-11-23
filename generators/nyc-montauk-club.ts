/**
 * The Montauk Club, 25 Eighth Avenue, Park Slope, Brooklyn (Francis H.
 * Kimball, 1889–91; Venetian Gothic after the Ca' d'Oro; brick and
 * terracotta over a brownstone base) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-montauk-club.ts
 *
 * Frame: x = model east (toward 116.6°, along Lincoln Place), y = model
 * north (toward 26.6°, along Eighth Avenue), z up, metres. Placed at
 * bearing 26.6. Anchor: the area centroid of OSM way/248166914
 * (-73.971705, 40.674805), which the model replaces. The Eighth Avenue
 * front faces −x, Lincoln Place −y; the bowed east end carries the roof
 * terrace.
 *
 * Evidence
 * - OSM way/248166914 (ODbL): "Montauk Club", height=25.7; outline 484 m²:
 *   the main block x −13.9…13.6, y −7.9…10.0 with a light court and a
 *   stair block on the north, the balcony bay on Lincoln Place (x −7.5…5.5,
 *   to y −9.4), the bowed east end to x 15.8.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, sparse
 *   returns, read in this frame. Ground 1.4 (west, Eighth Avenue) to ~2.9
 *   (east) over the crop minimum; z 0 = the west ground. Measured above it:
 *   the copper cornice 17.9–18.1 round the edge; the tile roof 21–24; the
 *   copper pavilions to ~23.5; chimneys ~25.4; the bowed east end and its
 *   terrace 10.5; the balcony bay 6.1. The lidar footprint sits ~2 m off the
 *   OSM outline to the west and north; the model follows OSM.
 * - Published (NYC LPC, Park Slope Historic District 1973; NRHP 1977;
 *   Wikipedia "Montauk Club"): Kimball, 1889–91, Venetian Gothic modelled on
 *   the Ca' d'Oro; terracotta friezes of Montaukett life; copper cornice.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Jim.henderson, "Montauk Club cloudy jeh.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:Montauk_Club_cloudy_jeh.JPG
 *     (the Lincoln Place side from the south-west corner);
 *   Beyond My Ken, "Montauk Club from 8th Avenue.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Montauk_Club_from_8th_Avenue.jpg
 *     (the Eighth Avenue front: stoop, balcony, the front pavilion);
 *   ajay_suresh, "Montauk Club (55268726080).jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Montauk_Club_(55268726080).jpg
 *     (the corner: chimneys, copper pavilions, tile roofs).
 *
 * Estimated from the photos scaled to the lidar cornice: storey lines
 * (brownstone base to 5.0, friezes at 9.1 and 15.7, attic windows), the
 * arcaded window groups (two or three ogee-headed lights a bay), the
 * pavilions' size. The corbelled balcony across the Eighth Avenue front is
 * from the photos (OSM doesn't map it). Doubts: the north side faces a side yard and no photo
 * shows it (drawn with plain paired windows, no pavilion); the roof's hip
 * form under the pavilions is from the lidar's 21–24 m returns.
 */
import { Part, type V3 } from './mesh'
import { finishModel, capPoly, prism, type XY } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'
import { hipRoof, edgeFrame, outset } from './nyc-litchfield-villa'
import { pointedPanel } from './nyc-green-wood-gate'
import { PALETTE, finish } from './palette'

function build() {
  const brick = new Part(), brown = new Part(), tc = new Part(), copper = new Part(), tile = new Part(), win = new Part()

  const BASE = 5.0, CORN = 17.4, TOP = 18.1
  // Main block (OSM, the bow cut off at x 13.55), counter-clockwise.
  const M: XY[] = [[-13.88, -7.92], [13.55, -7.92], [13.55, 7.38], [4.97, 7.38], [4.98, 11.78], [1.23, 11.77], [1.22, 5.93], [-2.12, 5.93], [-2.12, 7.06], [-6.79, 7.06], [-6.78, 9.98], [-13.85, 9.98]]
  prism({ wall: brown, win: null, roof: null, ring: M, z0: 0, z1: BASE, facade: null, bevel: 0.1 })
  prism({ wall: brick, win: null, roof: null, ring: M, z0: BASE, z1: CORN, facade: null, bevel: 0.1 })
  // terracotta friezes and the copper cornice
  for (const [z0, z1, o, p] of [[BASE - 0.3, BASE + 0.15, 0.12, brown], [9.0, 9.4, 0.08, tc], [15.5, 15.9, 0.08, tc]] as [number, number, number, Part][])
    prism({ wall: p, win: null, roof: null, ring: outset(M, o), z0, z1, facade: null, bevel: 0.05 })
  prism({ wall: copper, win: null, roof: copper, ring: [[-14.25, -8.3], [13.9, -8.3], [13.9, 7.75], [5.35, 7.75], [5.35, 12.15], [0.85, 12.15], [0.85, 6.3], [-2.5, 6.3], [-2.5, 7.45], [-6.4, 7.45], [-6.4, 10.35], [-14.25, 10.35]], z0: CORN, z1: TOP, facade: null, bevel: 0.2 })

  // Windows: per bay, an arcaded group per storey (ogee heads drawn pointed).
  const storeys: [number, number, number, number][] = [ // sill, spring, lights, half-width
    [1.6, 3.6, 2, 0.42],
    [5.9, 7.9, 3, 0.36],
    [10.0, 12.3, 2, 0.4],
    [13.2, 14.9, 2, 0.36],
    [16.1, 16.9, 2, 0.3],
  ]
  for (let i = 0; i < M.length; i++) {
    const a = M[i], b = M[(i + 1) % M.length], w = edgeFrame(a, b)
    if (w.L < 3) continue
    const n = Math.max(1, Math.round(w.L / 3.7)), pitch = w.L / n
    for (let k = 0; k < n; k++) {
      const s = pitch * (k + 0.5)
      for (const [z0, z1, lights, hw] of storeys) {
        const span = lights * hw * 2 + (lights - 1) * 0.18
        for (let l = 0; l < lights; l++) pointedPanel(win, w, s - span / 2 + hw + l * (2 * hw + 0.18), z0, z1, hw, 0.05, 3)
        if (z0 > 5 && z0 < 11) pointedPanel(tc, w, s, z1 + 0.05, z1 + 0.1, span / 2 + 0.15, 0.03, 3)
      }
    }
  }

  // The balcony bay on Lincoln Place (lidar 6.1) and the stoop on Eighth Avenue.
  box(brown, -7.51, -9.42, 5.51, -7.92, 0, 5.3)
  box(tc, -7.6, -9.55, 5.6, -7.92, 5.3, 5.5)
  box(brown, -7.6, -9.55, 5.6, -9.25, 5.5, 6.2)
  // the corbelled balcony across the Eighth Avenue front (photos; not in OSM)
  box(brown, -15.0, -3.2, -13.88, 4.4, 4.7, 5.2)
  box(brown, -15.1, -3.3, -14.8, 4.5, 5.2, 6.1)
  for (const y of [-2.8, 0.6, 4.0]) box(brown, -14.6, y - 0.2, -13.88, y + 0.2, 3.9, 4.7)
  box(brown, -15.6, 5.0, -13.88, 8.4, 0, 1.0)
  box(brown, -14.7, 5.0, -13.88, 8.4, 1.0, 1.7)
  pointedPanel(win, edgeFrame([-13.85, 9.98], [-13.88, -7.92]), 3.3, 1.7, 3.9, 0.7, 0.06, 3)

  // The bowed east end with its roof terrace (lidar 10.5).
  {
    const cx = 7.81, r = 7.95, a0 = Math.asin(-5.77 / r), a1 = Math.asin(5.22 / r), seg = 8
    const arc: XY[] = []
    for (let k = 0; k <= seg; k++) { const a = a0 + (a1 - a0) * (k / seg); arc.push([cx + r * Math.cos(a), r * Math.sin(a)]) }
    const ring: XY[] = [[13.4, 5.22], [13.4, -5.77], ...arc.map(([x, y]) => [x, y] as XY)]
    prism({ wall: brown, win: null, roof: null, ring, z0: 0, z1: BASE, facade: null, bevel: 0.05 })
    prism({ wall: brick, win: null, roof: null, ring, z0: BASE, z1: 9.8, facade: null, bevel: 0.05 })
    capPoly(tile, ring, 9.8)
    for (let k = 0; k < seg; k++) {
      const p = arc[k], q = arc[k + 1], n: V3 = [q[1] - p[1], p[0] - q[0], 0]
      quadF(tc, [p[0], p[1], 9.8], [q[0], q[1], 9.8], [q[0], q[1], 10.6], [p[0], p[1], 10.6], n)
      quadF(tc, [p[0], p[1], 10.6], [q[0], q[1], 10.6], [q[0] - n[0] * 0.03, q[1] - n[1] * 0.03, 10.6], [p[0] - n[0] * 0.03, p[1] - n[1] * 0.03, 10.6], [0, 0, 1])
      const w = edgeFrame(p, q)
      for (const [z0, z1] of [[1.6, 3.6], [5.9, 7.9]]) pointedPanel(win, w, w.L / 2, z0, z1, 0.4, 0.05, 3)
    }
  }

  // The tile roof: a hip over the main block, copper pavilions, chimneys.
  hipRoof(tile, null, null, -13.6, -7.6, 13.3, 9.7, TOP, 3.8, 0.0, ['hip', 'hip'], 'x')
  hipRoof(tile, null, null, 1.5, 7.0, 4.7, 11.5, TOP, 1.8, 0.0, ['hip', 'hip'], 'y')
  const pav = (x0: number, y0: number, x1: number, y1: number) => {
    box(copper, x0, y0, x1, y1, TOP, 21.4)
    hipRoof(tile, null, copper, x0, y0, x1, y1, 21.4, 2.0, 0.3, ['hip', 'hip'])
    const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
    for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) {
      const w = edgeFrame(a, b), k = Math.max(1, Math.round(w.L / 1.2))
      for (let j = 0; j < k; j++) { const s = (w.L / k) * (j + 0.5); quadF(win, w.at(s - 0.3, 19.2, 0.05), w.at(s + 0.3, 19.2, 0.05), w.at(s + 0.3, 20.8, 0.05), w.at(s - 0.3, 20.8, 0.05), w.n) }
    }
    void xm; void ym
  }
  pav(-13.3, -1.6, -10.3, 3.6) // over the Eighth Avenue front
  pav(-3.6, -7.5, 1.4, -4.5) // Lincoln Place, middle
  pav(7.0, -7.5, 11.4, -4.5) // Lincoln Place, east
  for (const [x, y] of [[-10.6, -6.6], [10.0, 6.4]] as XY[]) {
    box(brick, x - 0.8, y - 0.6, x + 0.8, y + 0.6, 18.0, 25.0)
    box(tc, x - 0.95, y - 0.75, x + 0.95, y + 0.75, 25.0, 25.6)
  }
  // the bronze eagle on the front pavilion
  box(copper, -12.0, 0.8, -11.6, 1.2, 23.3, 24.3)

  finishModel('Montauk Club', 'nyc-montauk-club', [
    { part: brick, material: finish('montauk-brick', 0xc98b72) },
    { part: brown, material: finish('brownstone', 0xa07264) },
    { part: tc, material: finish('montauk-terracotta', 0xd9b68f) },
    { part: copper, material: PALETTE.copper },
    { part: tile, material: finish('red-tile', 0xa66d5e) },
    { part: win, material: PALETTE.window },
  ], { bearing: 26.6, osm: 'way/248166914', height: 25.6 }, 6500)
}

if (import.meta.main) build()
