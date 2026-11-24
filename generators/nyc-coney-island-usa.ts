/**
 * Coney Island USA (Sideshows by the Seashore and the Coney Island Museum),
 * 1208 Surf Avenue at West 12th Street, Coney Island — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-coney-island-usa.ts
 *
 * The 1917 Childs Restaurant on Surf Avenue (not the 1923 Childs on the
 * Boardwalk, `nyc-childs-coney-island`): a two-storey stucco building with
 * a red tile pent roof on blue brackets, three big round arches on Surf
 * Avenue, the museum upstairs, and the sideshow's painted banners down the
 * West 12th Street side.
 *
 * Map frame: x = east, y = north, z up, metres, built in the building's own
 * frame and placed at bearing 1.5 (its long walls along West 12th Street).
 * Anchor: area centroid of OSM way/405892193 (-73.9798443, 40.5752473). The
 * outline is OSM's, turned into that frame; its rear annex (the narrower
 * south end on the West 12th Street side) is kept.
 *
 * Evidence
 * - OSM: way/405892193 (building=retail, 1208 Surf Avenue, 2 levels, no
 *   height), 17.8 m on Surf Avenue × 33.5 m on West 12th Street, the rear
 *   8.2 m narrower for its last 7 m. OSM node/4080312833 ("Sideshows by
 *   the Seashore") is inside it.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid. Main roof 9.8–10.1 m
 *   over the lowest ground; the tile roof's edge 10.5–11.7 m all round; the
 *   rear annex 10–11 m; the chimney on the annex's west side to 13.3 m.
 * - Terrain (Mapterhorn): flat, 0.7 m of fall across the site; the Surf
 *   Avenue sidewalk is about 0.3 m over the lowest ground (FG).
 * - Photos (Wikimedia Commons):
 *   - "Coney Island USA.JPG", Peter Greenberg, CC BY-SA 3.0 (2013): the
 *     Surf Avenue front square on — three arches, the three upper windows,
 *     the MUSEUM frieze, the tile roof on blue brackets
 *   - "CONEY ISLAND MUSEUM.jpg", FilmPens, CC0 (2007): the West 12th Street
 *     side — banners between the upper windows, the long banner frieze
 *     over the ground floor, the brackets
 *   - "Coney Island USA east sunny jeh.jpg", Jim.henderson, CC0 (2011): the
 *     whole West 12th Street side from the south-east, the rear chimney
 *
 * From the Surf Avenue photo (scaled on the 17.8 m front): ground storey
 * about 5 m; arches about 4.9 m wide springing at 2.35 m, their crowns just
 * under the floor band; upper windows 2.6 × 2.0 m; eave at 9.6 m,
 * overhanging about 0.9 m, the tile slope rising to 10.9 m (lidar 10.5–11.7). Estimated: the bracket
 * count (from the photos, about one per 2.5 m), the banner sizes (1.6–2.4 m
 * wide), the split of the West 12th Street wall into shop bays. The west
 * wall is a party wall against 1214 Surf Avenue and the rear (south) wall
 * is unphotographed; both are drawn plain. The MUSEUM letters and the
 * banners' pictures are left out (STYLE.md: no lettering except famous
 * signs); the banners are bold yellow panels in red borders.
 *
 * Night: the ground-floor shopfronts and upper windows are `window`; the
 * banners (fields and red borders) are floodlit by their lamps
 * (_FLOODLIGHT).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, insetRing, type XY } from './nyc-570-lexington'
import { offsetEdges } from './nyc-dime-savings-bank'

const stucco = new Part(), blue = new Part(), tile = new Part(), win = new Part(), banner = new Part(), roof = new Part()

const FG = 0.3
const WALL = 9.6, EAVE_OUT = 0.9, EAVE_IN = 0.9, RIDGE = 10.9, ROOF = 10.0, FASCIA = 0.35
// The outline, counter-clockwise from the south-west corner of the main block.
const RING: XY[] = [[-8.72, -11.6], [0.21, -11.6], [0.21, -18.43], [8.37, -18.58], [8.09, 14.87], [-9.66, 15.24]]

/** A frame along a wall a→b (counter-clockwise), d outward. */
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at, u, n }
}
type At = (s: number, z: number, d?: number) => V3
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
/** A round-headed panel. */
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}
/** A semicircular band of width t outside radius r, with short jambs. */
function archivolt(p: Part, at: At, c: number, r: number, t: number, spring: number, z0: number, d: number) {
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    const P = (a: number, rr: number) => at(c + rr * Math.cos(a), spring + rr * Math.sin(a), d)
    p.quad(P(a1, r), P(a0, r), P(a0, r + t), P(a1, r + t))
  }
  rect(p, at, c - r - t, c - r, z0, spring, d)
  rect(p, at, c + r, c + r + t, z0, spring, d)
}
/** A solid box on a wall: s0..s1 along it, z0..z1, standing d0..d1 out. */
function wallBox(p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const P = (s: number, z: number, d: number) => at(s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1)) // front
  p.quad(P(s0, z1, d0), P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0)) // top
  p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1)) // bottom
  p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0)) // left end
  p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1)) // right end
}
/** A painted banner: a red border panel with a yellow field on it. */
function bannerPanel(at: At, s0: number, s1: number, z0: number, z1: number) {
  rect(tile, at, s0, s1, z0, z1, 0.06)
  rect(banner, at, s0 + 0.18, s1 - 0.18, z0 + 0.18, z1 - 0.18, 0.09)
}

// ---------------------------------------------------------------------------
// The walls, to the eave.
// ---------------------------------------------------------------------------
prism({ wall: stucco, win: null, roof: null, ring: RING, z0: 0, z1: WALL, facade: null, bevel: 0.3 })

// ---------------------------------------------------------------------------
// The tile pent roof all round: a blue fascia, a soffit, the red tile slope
// up to its ridge, a short drop to the flat roof behind it. The west wall is
// a party wall against 1214 Surf Avenue, so the eave doesn't overhang there.
// ---------------------------------------------------------------------------
{
  const out = offsetEdges(RING, [EAVE_OUT, EAVE_OUT, EAVE_OUT, EAVE_OUT, EAVE_OUT, 0]), inn = insetRing(RING, EAVE_IN)
  const r3 = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  const z0 = WALL - FASCIA
  tile.loft([r3(out, WALL), r3(inn, RIDGE)])
  blue.loft([r3(out, z0), r3(out, WALL)])
  blue.loft([r3(RING, z0), r3(out, z0)])
  roof.loft([r3(inn, RIDGE), r3(inn, ROOF)])
  capPoly(roof, inn, ROOF)
}

// Brackets under the eave, every ~2.5 m on every street side.
function brackets(at: At, s0: number, s1: number) {
  const n = Math.max(1, Math.round((s1 - s0) / 2.5))
  for (let k = 0; k <= n; k++) {
    const s = s0 + ((s1 - s0) * k) / n
    wallBox(blue, at, s - 0.16, s + 0.16, WALL - FASCIA - 0.5, WALL - FASCIA, 0, EAVE_OUT * 0.8)
  }
}

// ---------------------------------------------------------------------------
// The Surf Avenue front: three big arches with blue archivolts on blue
// piers, a blue floor band, three upper windows in blue frames, and the
// cream frieze under the eave.
// ---------------------------------------------------------------------------
{
  const F = along(RING[4], RING[5])
  const R = 2.45, SPRING = 2.35, pitch = F.L / 3
  for (let k = 0; k < 3; k++) {
    const c = pitch * (k + 0.5)
    arched(win, F.at, c, 2 * R, FG, SPRING, 0.06)
    archivolt(blue, F.at, c, R, 0.32, SPRING, FG, 0.09)
    // Upper window in a blue frame.
    rect(blue, F.at, c - 1.5, c + 1.5, 5.9, 8.3, 0.06)
    rect(win, F.at, c - 1.3, c + 1.3, 6.1, 8.1, 0.09)
  }
  rect(blue, F.at, 0.15, F.L - 0.15, 5.0, 5.3, 0.08)
  // Blue corner pilasters, full height.
  for (const s of [0.15, F.L - 0.75]) rect(blue, F.at, s, s + 0.6, FG, WALL - FASCIA, 0.08)
  brackets(F.at, 0.6, F.L - 0.6)
}

// ---------------------------------------------------------------------------
// The West 12th Street side: shopfronts on the ground floor, the long
// sideshow banner frieze over them, and upstairs windows alternating with
// tall banners.
// ---------------------------------------------------------------------------
{
  const E = along(RING[3], RING[4]) // runs south → north
  const L = E.L
  // Ground floor: seven shop bays between stucco piers, a red awning band.
  const g0 = 1.2, g1 = L - 1.0, nb = 7, gp = (g1 - g0) / nb
  for (let k = 0; k < nb; k++) rect(win, E.at, g0 + gp * k + 0.35, g0 + gp * (k + 1) - 0.35, FG, 3.4, 0.06)
  wallBox(tile, E.at, g0, g1, 3.3, 3.6, 0, 0.6)
  // The banner frieze: a row of painted banners, 3.8–6.0 m.
  const f0 = 7.5, f1 = L - 1.2, nf = 11, fp = (f1 - f0) / nf
  for (let k = 0; k < nf; k++) bannerPanel(E.at, f0 + fp * k + 0.06, f0 + fp * (k + 1) - 0.06, 3.8, 6.0)
  // A ticket-booth banner block near the rear.
  bannerPanel(E.at, 1.6, 6.8, 3.8, 6.0)
  // Blue floor band over the frieze.
  rect(blue, E.at, 0.15, L - 0.15, 6.1, 6.35, 0.08)
  // Upstairs: window, banner, window, … from the front back.
  const u0 = 1.0, u1 = L - 0.8, nu = 11, up = (u1 - u0) / nu
  for (let k = 0; k < nu; k++) {
    const c = u1 - up * (k + 0.5)
    if (k % 2 === 0) {
      rect(blue, E.at, c - 0.95, c + 0.95, 6.65, 8.55, 0.06)
      rect(win, E.at, c - 0.78, c + 0.78, 6.8, 8.4, 0.09)
    } else bannerPanel(E.at, c - 1.25, c + 1.25, 6.5, 8.65)
  }
  brackets(E.at, 0.6, L - 0.6)
}


// ---------------------------------------------------------------------------
// The chimney on the rear annex.
// ---------------------------------------------------------------------------
prism({ wall: stucco, win: null, roof: stucco, ring: [[0.5, -18.2], [2.9, -18.2], [2.9, -16.0], [0.5, -16.0]], z0: ROOF - 0.2, z1: 13.3, facade: null, bevel: 0.15 })

finishModel('Coney Island USA', 'nyc-coney-island-usa', [
  { part: stucco, material: finish('ciusa-stucco', 0xebe3d3) },
  { part: blue, material: finish('ciusa-blue', 0x5f9bd0) },
  {
    part: tile,
    material: {
      ...finish('ciusa-tile-red', 0xb65a48),
      // The banners' red borders and the awning on West 12th Street share
      // the banners' lamps; the tile roof stays dark.
      floodlight: (p: V3, n: V3) => (n[0] > 0.9 && p[2] < WALL - FASCIA ? 0.85 : 0),
    },
  },
  { part: win, material: PALETTE.window },
  {
    part: banner,
    material: {
      ...finish('ciusa-banner', 0xe8c247),
      // The banners are lit by the lamps over them.
      floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0 : 0.85),
    },
  },
  { part: roof, material: PALETTE.roof },
], { bearing: 1.5, osm: 'way/405892193', height: 13.3 })
