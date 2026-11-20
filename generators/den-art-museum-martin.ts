/**
 * Denver Art Museum, Martin Building (1971 North Building, Gio Ponti with
 * James Sudler Associates; renovated 2021 with the Sie Welcome Center by
 * Machado Silvetti and Fentress) — original procedural geometry, CC0-1.0.
 * bun generators/den-art-museum-martin.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.98965, 39.73745 (the
 * middle of the building group: the two towers, the link and the welcome
 * centre); bearing 0.
 *
 * Identity (photos below):
 *  1. The "castle": two joined grey towers of faceted plan, chamfered at
 *     the corners, with no regular window grid.       (m1, m2, isarra, migl)
 *  2. The crenellated top: deep narrow slots cut down into the parapet all
 *     round.                                           (isarra, b1971, main)
 *  3. Small slot windows in loose clusters on the grey glass-tile walls.
 *                                                              (m1, m2)
 *  4. The Sie Welcome Center: an elliptical glass pavilion with a white rim
 *     and roof, and the glass bridge south over 13th Avenue to the Hamilton
 *     Building.                                            (hart1, aerial)
 *
 * Plan and heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid,
 * ground_min 1595.56 m; y = 0 is 0.5 m above it (the sunken east court;
 * the west street is about 1 m higher). Measured (model metres): the south
 * tower 43.3 (its top is near flat at parapet height), the north tower 39.4
 * with a lower roof of 34.4 over its north-west part; the east link 8.9; the
 * south wing 8.0; the welcome centre's roof 16.4 (rim about 15); the bridge
 * roof 12.8 (OSM says 10, lidar 12.6–13.9); the west terrace 3.6. Plans are
 * traced from the lidar (the OSM parts way/590331772 and way/590331775 put
 * 8.5–10 m on what the lidar shows is the full-height south tower, so OSM's
 * heights were not used). The welcome centre's ellipse is fitted to the OSM
 * outline way/35205743 (23 by 18 m semi-axes, long axis NNW–SSE). The bridge
 * is OSM way/590332860.
 * Estimated: the crenel slots (3 m wide, 6 m deep, about every 11 m),
 * read from the photos; the inner roofs drawn 6 m under the parapet so the
 * slots show sky as they do in the photos; window positions; the bridge's
 * underside (6 m, OSM min_height); the welcome centre's glass height (12.5).
 *
 * Photos (evidence, Wikimedia Commons):
 *  m1     "Denver Art Museum - Martin Building 01.jpg", DutchTreat,
 *         CC BY-SA 4.0 (from the south-west, by the Byers-Evans House)
 *  m2     "Denver Art Museum - Martin Building 02.jpg", DutchTreat,
 *         CC BY-SA 4.0 (from the south-west)
 *  main   "Denver Art Museum Main Building.jpg", KM Newnham, CC BY-SA 2.5
 *  b1971  "Denver Art Museum built 1971.JPG", Shoshie8, CC BY-SA 3.0
 *  isarra "Denver Art Museum, North Building.jpg", Isarra, CC BY-SA 3.0
 *         (from Civic Center Park, north-east)
 *  migl   "Denver Art Museum IMG 20180416 152825.jpg", Alexander Migl,
 *         CC BY-SA 4.0 (from Civic Center Park)
 *  hart1  "Denver Art Museum (54940437051).jpg", Daniel Hartwig, CC BY 4.0
 *         (the welcome centre's glass at right)
 *  aerial USGS NAIP orthophoto (public domain)
 * The direction of m1/m2 is read from the 13th Ave street sign; isarra's and
 * migl's from the park in front, both uncertain within 45°. No look-only
 * sources. No commercial imagery.
 *
 * Night: the slot windows and the welcome centre's glass glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, offset, onWall, prism, rectShape, save, wall, at, type XY } from './atl-tech-tower'

const tile = new Part(), roof = new Part(), win = new Part(), rim = new Part()

/** A closed box on the inside of edge a→b of a ccw ring, from s0 to s1 along it, `th` deep. */
function merlon(a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, th: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-t[1], t[0]]
  const P = (s: number, d: number): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
  const r: XY[] = [P(s0, 0), P(s1, 0), P(s1, th), P(s0, th)]
  prism(tile, r, z0, z1, tile, 0.15)
}

/** A tower: core to H - 4 with a roof, a crenellated parapet to H. */
function tower(ringIn: XY[], H: number, slots = 11) {
  const ring = ccw(ringIn), z0 = H - 6
  prism(tile, ring, 0, z0, null, 0)
  capPoly(roof, offset(ring, -0.9), z0, true)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const gaps = L > 9 ? Math.floor(L / slots) : 0, g = 3.0
    let s = 0
    for (let k = 1; k <= gaps; k++) {
      const c = (k * L) / (gaps + 1)
      merlon(a, b, s, c - g / 2, z0, H, 1.0)
      s = c + g / 2
    }
    merlon(a, b, s, L, z0, H, 1.0)
  }
}

/** Slot windows: clusters of narrow panels on edge a→b. */
function slots(a: XY, b: XY, rows: number[], seed: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) return
  let r = seed
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280)
  const n = Math.max(1, Math.round(L / 9))
  for (let k = 0; k < n; k++) {
    const c = ((k + 0.5) * L) / n + (rnd() - 0.5) * 2
    for (const z of rows) {
      if (rnd() < 0.35) continue
      const m = 1 + Math.floor(rnd() * 3)
      for (let j = 0; j < m; j++) {
        const s = c + (j - (m - 1) / 2) * 1.6
        if (s < 1.5 || s > L - 1.5) continue
        onWall(win, a, b, rectShape(s - 0.45, s + 0.45, z, z + 3.6), 0.06)
      }
    }
  }
}

// ── The castle (plans traced from the lidar) ──
const south: XY[] = [[-31, -5], [-17, -23], [-3, -23], [4, -16], [4, 0], [0, 6], [-3, 18], [-6, 26], [-15, 27], [-24, 24], [-31, 18]]
tower(south, 43.3)
// the lower east step of the south tower (lidar 40)
prism(tile, ccw([[4, -16], [12, -9], [12, -3], [8, 2], [4, 0]]), 0, 39.9, roof, 0.3)
// the north tower: east block, west wall and north turret at 39.4, its NW roof at 34.4
const northE: XY[] = [[-15, 25], [5, 25], [5, 40], [-3, 47], [-15, 48]]
tower(northE, 39.4)
tower([[-38, 34], [-30, 27], [-28, 30], [-28, 47], [-38, 47]], 39.4, 7)
tower([[-23, 53], [-15, 48], [-11, 56], [-17, 59.5], [-22, 57]], 39.4, 99)
prism(tile, ccw([[-30, 27], [-26, 25], [-15, 25], [-15, 48], [-23, 53], [-28, 47], [-28, 30]]), 0, 34.4, roof, 0.4)

// slot windows on the outer faces
const outer: [XY[], number][] = [[ccw(south), 1], [ccw(northE), 2]]
for (const [ring, seed] of outer) {
  for (let i = 0; i < ring.length; i++) slots(ring[i], ring[(i + 1) % ring.length], [6, 14, 22, 30], seed * 31 + i * 7)
}
const west = ccw([[-38, 34], [-30, 27], [-28, 30], [-28, 47], [-38, 47]])
for (let i = 0; i < west.length; i++) slots(west[i], west[(i + 1) % west.length], [8, 18, 28], 50 + i)

// ── Low wings ──
prism(tile, ccw([[2, 16], [9, 12.4], [16, 5], [16, -8], [4, -8]]), 0, 8.9, roof, 0.3)
prism(tile, ccw([[-1.3, -22.25], [8, -22], [8, -39.8], [6, -39.8], [6, -32.3], [-1.3, -32.4]]), 0, 8.0, roof, 0.3)
prism(tile, ccw([[8, -8], [18, -10], [18, -40], [11.7, -47.2], [8, -40]]), 0, 12.8, roof, 0.3)
prism(tile, ccw([[-37.39, -22.25], [-17, -22.25], [-30, -5], [-31.65, -4.52], [-37.39, -11.08]]), 0, 3.6, roof, 0.3)
// ground glazing on the link's east face
onWall(win, [16, -8], [16, 5], rectShape(1, 12, 0.6, 6.5), 0.06)

// ── The Sie Welcome Center: glass ellipse, white rim, roof ──
{
  const C: XY = [36, -23], u: XY = [0.5, -0.866], v: XY = [0.866, 0.5], A = 23, B = 18, N = 24
  const ell = (k: number, d = 0): XY[] => Array.from({ length: N }, (_, i) => {
    const t = (i / N) * Math.PI * 2, x = (A + d) * Math.cos(t), y = (B + d) * Math.sin(t)
    return [C[0] + u[0] * x + v[0] * y, C[1] + u[1] * x + v[1] * y] as XY
  })
  const glassRing = ccw(ell(0))
  wall(win, glassRing, 0, 12.5)
  const rimRing = ccw(ell(0, 1.2))
  rim.loft([at(glassRing, 12.5), at(rimRing, 12.9)])
  wall(rim, rimRing, 12.9, 15.0)
  rim.loft([at(rimRing, 15.0), at(ccw(ell(0, -1.5)), 16.4)])
  capPoly(roof, ccw(ell(0, -1.5)), 16.4, true)
}

// ── The glass bridge to the Hamilton Building (OSM way/590332860) ──
{
  const br: XY[] = ccw([[11.8, -39.8], [15.2, -51.7], [15.9, -54.8], [18.4, -66.1], [20.0, -72.4], [23.6, -66.0], [21.2, -54.8], [20.5, -51.8], [17.3, -39.8]])
  prism(tile, br, 6.0, 12.8, roof, 0.2, true)
  for (let i = 0; i < br.length; i++) {
    const a = br[i], b = br[(i + 1) % br.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 4) onWall(win, a, b, rectShape(0.4, L - 0.4, 7.0, 11.6), 0.06)
  }
}

void (null as unknown as V3)
await save('den-art-museum-martin', 'Denver Art Museum, Martin Building', [
  { part: tile, material: finish('martin-tile', 0xc2beb7) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: rim, material: PALETTE.trim },
], { height: 43.3, anchor: [39.73745, -104.98965], bearing: 0 })
