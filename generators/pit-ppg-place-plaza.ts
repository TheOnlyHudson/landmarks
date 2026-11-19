/**
 * PPG Place, Pittsburgh: the low glass Gothic buildings round the plaza —
 * Two, Three, Four, Five and Six PPG Place and the Wintergarden (Philip
 * Johnson and John Burgee, 1984) — original procedural geometry, CC0-1.0.
 * The tower is its own model (pit-ppg-place); the plaza paving, fountain and
 * obelisk are the map's or left out.
 * bun generators/pit-ppg-place-plaza.ts
 *
 * Uses the glass-Gothic helpers exported by generators/pit-ppg-place.ts.
 *
 * Map frame turned to the complex: +x along bearing 116.5 (the plaza's long
 * axis, toward Market Street), +y along 26.5 (toward Market Square), z up,
 * metres. BEARING 26.5, the same grid as the tower. Origin = area-weighted
 * centroid of the six OSM outlines, 40.439939, -80.003460.
 *
 * Identity: six-storey mirror-glass blocks whose walls are lined with
 * full-height glass pleats, each rising past the eave as a small glass
 * spire, bigger pinnacles at every corner, and a steep pale-grey metal
 * mansard behind the spires; the 14-storey Six PPG Place in the same dress;
 * the Wintergarden's row of steep pointed glass gables against the tower.
 *
 * Evidence
 * - OSM: Two PPG Place way/202731620 (L-shaped, 6 levels), Three
 *   way/202772968 (6), Four way/202809238 (6), Five way/203212250 (6), Six
 *   way/202871660 (14), Wintergarden way/202809235. Outlines turned into this
 *   frame and used as drawn.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid
 *   (SCRATCH/work/pit-ppg-place-plaza/lidar.json, roof.png). y = 0 is the
 *   lowest ground under the complex (west of the Wintergarden), 2 m above the
 *   box's ground_min; the plaza is ~2.5 m higher. Measured above y = 0:
 *   Two (south bar), Three, Four, Five: wall tops 28.5 m, mansard tops 33.5 m
 *   (lidar 30-31 at the walls rising to 35-36 within ~4 m); Two's northern
 *   wing toward Market Square lower, ~19 m walls, ~24 m roof; Six: walls 62 m,
 *   top 65 m; the Wintergarden: five parallel gables with ridges running
 *   along x, ridges 18 m, valleys 11 m, ~7.6 m apart.
 * - Photos: Flickr "PPG Courtyard" 403945480 (John Marino, CC BY 2.0, via
 *   Commons) — Four and Five from the tower: pleats, spires every ~6 m,
 *   corner pinnacles, the grey mansard; Flickr 18955613 (michaelrighi,
 *   CC BY 2.0) — the Wintergarden's gables and their pinnacles; Flickr
 *   53852870436 (Adam Jones, CC BY 2.0) — panorama of the plaza;
 *   "Market Square & PPG Place P6210271.JPG" (Chris Light, CC BY-SA 4.0) —
 *   Two PPG from Market Square; "PPG Place from the Diamond, 2022-01-27,
 *   01.jpg" (Cbaile19, CC0) — Five PPG's corner pinnacle;
 *   "PPG Place in Pittsburgh in 2016.jpg" (Dllu, CC BY-SA 4.0) — Six PPG.
 *   USGS NAIP for the plan. No commercial imagery.
 *
 * Estimated: pleat spacing (about 5.5 m, set per wall), size (3 m wide,
 * 1.5 m deep, a little bold) and spire heights (shaft 4 m over the eave, tip
 * 9.5 m); corner pinnacles (4 m across, tip 12 m over the eave); the same
 * light silver glass as the tower; the mansard's 4 m inset;
 * the Wintergarden pinnacles (to 15 m, tips 18.5 m); a trim line over the
 * ground-floor arcade at 8 m and, on Six, every four floors.
 * Left out: the skywalks, ground-floor arcades and lanterns, the obelisk,
 * fountain and paving. The unnamed office way/203212247 beside Five PPG is
 * not part of the complex and not drawn.
 *
 * Night: the walls are `window` (lit offices), the spires `window-2` (lit),
 * the Wintergarden's glass roofs `glass` (dark).
 *
 * Doubts: Two PPG's northern wing is seen only partly behind the Market
 * Square buildings; its roof form is read from lidar alone. The far
 * (Third Avenue / Boulevard) sides of Five and Six are drawn like the plaza
 * sides.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'
import { PPG, octagon, pinnacle, pleatSpire, pyramid } from './pit-ppg-place'

const ID = 'pit-ppg-place-plaza'
const ANCHOR: [number, number] = [40.439939, -80.00346]
const BEARING = 26.5

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

function build() {
  const glass = new Part(), spire = new Part(), trim = new Part(), roof = new Part(), glazing = new Part()

  type Block = { ring: XY[]; eave: number; top: number; skip?: number[]; trims?: number[]; pitch?: number }

  /**
   * A glass block: walls to the eave, pleats with spires along every outside
   * wall, pinnacles on the convex corners, a mansard to the top.
   */
  function block(b: Block) {
    const r = b.ring, n = r.length
    if (area(r) <= 0) throw new Error('ring must be counter-clockwise')
    walls(glass, r, 0, b.eave)
    // mansard
    const ins = inset(r, b.pitch ?? 4)
    walls(roof, r, b.eave, b.top, ins)
    cap(roof, ins, b.top)
    for (let i = 0; i < n; i++) {
      const a = r[i], c = r[(i + 1) % n], prev = r[(i - 1 + n) % n]
      const L = Math.hypot(c[0] - a[0], c[1] - a[1])
      const skip = b.skip?.includes(i) // rings are given counter-clockwise; edge i runs r[i] → r[i+1]
      // convex corner at a: pinnacle
      const cr = (a[0] - prev[0]) * (c[1] - a[1]) - (a[1] - prev[1]) * (c[0] - a[0])
      if (cr > 0 && !b.skip?.includes(i) && !b.skip?.includes((i - 1 + n) % n)) {
        const L2 = Math.hypot(c[0] - a[0], c[1] - a[1]), Lp = Math.hypot(a[0] - prev[0], a[1] - prev[1])
        const d1: XY = [(c[0] - a[0]) / L2, (c[1] - a[1]) / L2], d0: XY = [(prev[0] - a[0]) / Lp, (prev[1] - a[1]) / Lp]
        const o = 1.8, cx = a[0] + (d1[0] + d0[0]) * o, cy = a[1] + (d1[1] + d0[1]) * o
        pinnacle(glass, spire, cx, cy, 2.0, b.eave - 1, b.eave + 4.5, b.eave + 12)
      }
      if (skip) continue
      for (const z of [8, ...(b.trims ?? [])]) {
        const u: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
        const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + nn[0] * 0.04, a[1] + u[1] * s + nn[1] * 0.04, zz]
        trim.quad(P(0.2, z - 0.18), P(L - 0.2, z - 0.18), P(L - 0.2, z + 0.18), P(0.2, z + 0.18))
      }
      const k = Math.max(1, Math.round(L / 5.5))
      for (let j = 1; j < k; j++) {
        const s = (j * L) / k
        // the pleat's two outer faces, ground to eave
        const u: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
        const Q = (t: number, o: number): XY => [a[0] + u[0] * t + nn[0] * o, a[1] + u[1] * t + nn[1] * o]
        const p0 = Q(s - 1.5, 0), p1 = Q(s, 1.5), p2 = Q(s + 1.5, 0)
        glass.quad([...p0, 0] as V3, [...p1, 0] as V3, [...p1, b.eave] as V3, [...p0, b.eave] as V3)
        glass.quad([...p1, 0] as V3, [...p2, 0] as V3, [...p2, b.eave] as V3, [...p1, b.eave] as V3)
        pleatSpire(glass, spire, a, c, s, 1.5, 1.5, b.eave, 4, 9.5, 1.4)
      }
    }
  }

  // --- Two PPG Place: south bar on the plaza, lower wing toward Market Square. ---
  block({ ring: rect(-48.2, 32.5, 23.5, 58.5), eave: 28.5, top: 33.5, skip: [2] })
  block({ ring: [[-48.2, 58.5], [23.5, 58.5], [23.5, 68.5], [-12.7, 68.5], [-12.6, 92], [-48, 92]], eave: 19, top: 24, skip: [0] })
  // --- Three, Four, Five. ---
  block({ ring: rect(36.7, 32.6, 58.3, 57.3), eave: 28.5, top: 33.5 })
  block({ ring: rect(57.0, -29.5, 77.4, 16.1), eave: 28.5, top: 33.5 })
  block({ ring: [[37.9, -80.7], [65.4, -80.6], [65.4, -68.1], [71.8, -68.1], [71.8, -44.1], [37.9, -44.2]], eave: 28.5, top: 33.5 })
  // --- Six PPG Place, 14 storeys. ---
  block({ ring: rect(-34.2, -81.2, 24.4, -44.7), eave: 62, top: 65, pitch: 3, trims: [24, 40, 56] })

  // --- Wintergarden: glass walls and five steep glass gables, ridges along x. ---
  {
    const x0 = -82.5, x1 = -49.5, y0 = -25.9, y1 = 12.0, EAVE = 11, RIDGE = 18, N = 5
    const w = (y1 - y0) / N
    walls(glass, rect(x0, y0, x1, y1), 0, EAVE)
    for (let i = 0; i < N; i++) {
      const ya = y0 + i * w, yb = ya + w, ym = (ya + yb) / 2
      // roof slopes (glass) and the west gable end (wall glass); the east end meets the tower
      glazing.quad([x0, ya, EAVE], [x1, ya, EAVE], [x1, ym, RIDGE], [x0, ym, RIDGE])
      glazing.quad([x1, yb, EAVE], [x0, yb, EAVE], [x0, ym, RIDGE], [x1, ym, RIDGE])
      glass.tri([x0, ya, EAVE], [x0, ym, RIDGE], [x0, yb, EAVE])
      glass.tri([x1, yb, EAVE], [x1, ym, RIDGE], [x1, ya, EAVE])
      // a pale frame up each gable's rake, the arch that reads
      for (const [p, q] of [[[x0, ya], [x0, ym]], [[x0, ym], [x0, yb]]] as [XY, XY][]) {
        const za = p[1] === ym ? RIDGE : EAVE, zb = q[1] === ym ? RIDGE : EAVE
        const o = -0.05
        trim.quad([x0 + o, p[1], za - 0.35], [x0 + o, q[1], zb - 0.35], [x0 + o, q[1], zb + 0.05], [x0 + o, p[1], za + 0.05])
      }
    }
    // pinnacles on the valleys and corners of the west end, and the south and north corners at the tower
    for (let i = 0; i <= N; i++) pinnacle(glass, spire, x0 + 0.8, y0 + i * w + (i === 0 ? 0.8 : i === N ? -0.8 : 0), 0.85, EAVE - 1, 15, 18.5)
    // pleat spires along the long sides
    for (const [a, c] of [[[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]]] as [XY, XY][]) {
      for (const s of [8.25, 16.5, 24.75]) pleatSpire(glass, spire, a, c, s, 0.7, 0.8, EAVE - 0.5, 1.5, 5)
    }
    // trim line at the eave
    for (const [a, c] of [[[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) {
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]), u: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
      const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * 0.04, a[1] + u[1] * s + nn[1] * 0.04, z]
      trim.quad(P(0, EAVE - 0.4), P(L, EAVE - 0.4), P(L, EAVE), P(0, EAVE))
    }
  }

  return [
    { part: glass, material: PPG.glass },
    { part: spire, material: PPG.spire },
    { part: trim, material: PPG.mullion },
    { part: roof, material: { ...PPG.roof, color: 0xb2b9c0 } },
    { part: glazing, material: { ...PALETTE.glass, color: 0x9fb2c2 } },
  ]
}

void octagon, pyramid
if (import.meta.main) await save(ID, 'PPG Place', ANCHOR, BEARING, build(), 6500)
