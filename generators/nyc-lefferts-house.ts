/**
 * Lefferts Historic House, Prospect Park, Brooklyn (c. 1783; moved into the
 * park 1918) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lefferts-house.ts
 *
 * Frame: x along the house (toward 152.7°), y across it (toward 62.7°), z
 * up, metres. Placed at bearing 62.7°. Anchor: the area centroid of OSM
 * way/241846626 (-73.963802, 40.664373), which the model replaces.
 *
 * Evidence
 * - OSM way/241846626 (ODbL, building=house, height=9.4): the main block
 *   x −3.6…10.7, y −6.85…7.37 (its depth includes the porches under the
 *   flared eaves on both long sides) and the lower wing x −12.2…−3.6,
 *   y −5.9…4.8 at its north-west end.
 * - Published (Wikipedia "Lefferts Historic House"; NRHP 1977): Dutch
 *   Colonial farmhouse rebuilt c. 1783, white shingled walls, gambrel roof
 *   with deeply flared ("spring") eaves carried on porch columns, dormers;
 *   moved from Flatbush Avenue in 1918.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Dmadeo, "Lefferts-homestead-prospect-park.JPG", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Lefferts-homestead-prospect-park.JPG
 *     (long side square on: flared eave on slender posts, three arched
 *     dormers, shuttered windows, chimneys, the wing's glazed porch);
 *   Epicgenius, "Prospect Park Brooklyn Feb 2019 110.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Feb_2019_110.jpg
 *     (from the south: the bell-shaped gambrel gable end and the lower
 *     wing).
 *
 * Estimated from the photos (door ~2.1 m) and OSM's 9.4 m ridge: house body
 * 10 m deep with 2.1 m porches each side; walls under the eave to 4.3 m;
 * the eave flares down to 3.25 m at the porch posts; gambrel break at 7.25 m;
 * three dormers a side; chimneys to 10.6 m. The wing: walls 3.0 m, ridge
 * 6.3 m.
 *
 * Doubts: only the south-west long side and one gable end are photographed;
 * the other long side is drawn the same. "Lefferts-Laidlaw House.JPG" on
 * Commons is a different house and was not used.
 */
import { Part, type V3 } from './mesh'
import { finishModel, type XY } from './nyc-570-lexington'
import { box, quadF, triN } from './nyc-prospect-park-boathouse'
import { rectWin, archWin, edgeFrame, hipRoof, cyl } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

/** A roof ridged along x, cross-section given as (distance from the ridge, z) from eave to ridge, both sides. */
function profileRoof(top: Part, under: Part, x0: number, x1: number, yc: number, prof: [number, number][], t = 0.18) {
  for (const sg of [-1, 1]) {
    for (let k = 0; k < prof.length - 1; k++) {
      const [v0, z0] = prof[k], [v1, z1] = prof[k + 1]
      const n: V3 = [0, sg * (z1 - z0), v0 - v1]
      quadF(top, [x0, yc + sg * v0, z0], [x1, yc + sg * v0, z0], [x1, yc + sg * v1, z1], [x0, yc + sg * v1, z1], n)
      quadF(under, [x0, yc + sg * v0, z0 - t], [x1, yc + sg * v0, z0 - t], [x1, yc + sg * v1, z1 - t], [x0, yc + sg * v1, z1 - t], [-n[0], -n[1], -n[2]])
      // rake boards at both ends
      for (const [x, dx] of [[x0, -1], [x1, 1]] as [number, number][]) quadF(under, [x, yc + sg * v0, z0 - t], [x, yc + sg * v1, z1 - t], [x, yc + sg * v1, z1], [x, yc + sg * v0, z0], [dx, 0, 0])
    }
    // fascia along the eave
    const [ve, ze] = prof[0]
    quadF(under, [x0, yc + sg * ve, ze - t], [x1, yc + sg * ve, ze - t], [x1, yc + sg * ve, ze], [x0, yc + sg * ve, ze], [0, sg, 0])
  }
}

/** A gable-end wall at x (facing dx) under a profile, from z 0, out to half-depth hv. */
function gableWall(p: Part, x: number, dx: number, yc: number, hv: number, prof: [number, number][], t = 0.18) {
  const pts: [number, number][] = [[hv, 0]]
  const zAt = (v: number) => {
    for (let k = 0; k < prof.length - 1; k++) {
      const [v0, z0] = prof[k], [v1, z1] = prof[k + 1]
      if (v <= v0 && v >= v1) return z0 + ((z1 - z0) * (v0 - v)) / (v0 - v1)
    }
    return prof[prof.length - 1][1]
  }
  pts.push([hv, zAt(hv) - t])
  for (const [v, z] of prof) if (v < hv) pts.push([v, z - t])
  const all = [...pts, ...pts.slice(0, -1).reverse().map(([v, z]) => [-v, z] as [number, number])]
  const P = ([v, z]: [number, number]): V3 => [x, yc + v, z]
  const c: V3 = [x, yc, 0]
  for (let i = 0; i < all.length - 1; i++) triN(p, c, P(all[i]), P(all[i + 1]), [dx, 0, 0])
}

function build() {
  const wall = new Part(), roof = new Part(), win = new Part(), brick = new Part(), green = new Part()
  const X0 = -3.6, X1 = 10.71, YC = 0.26, HV = 5.0, PORCH = 0.45
  const prof: [number, number][] = [[7.15, 3.25], [6.3, 3.6], [5.3, 4.3], [4.4, 5.6], [3.4, 7.25], [1.7, 8.5], [0, 9.4]]

  // House body (clapboard), porches and the flared gambrel roof.
  box(wall, X0, YC - HV, X1, YC + HV, 0, 4.3)
  for (const [x, dx] of [[X0, -1], [X1, 1]] as [number, number][]) gableWall(wall, x, dx, YC, HV, prof)
  profileRoof(roof, wall, X0 - 0.3, X1 + 0.3, YC, prof)
  for (const sg of [-1, 1]) {
    const y0 = YC + sg * HV, y1 = YC + sg * 7.0
    box(wall, X0 - 0.1, Math.min(y0, y1), X1 + 0.1, Math.max(y0, y1), 0, PORCH)
    for (let k = 0; k <= 6; k++) cyl(wall, X0 + 0.25 + ((X1 - X0 - 0.5) * k) / 6, YC + sg * 6.85, 0.1, PORCH, 3.25, 6, false)
    // long wall: shuttered windows and a door in the middle
    const w = sg < 0 ? edgeFrame([X0, y0], [X1, y0]) : edgeFrame([X1, y0], [X0, y0])
    for (const s of [1.6, 3.9, 10.4, 12.7]) {
      rectWin(win, w, s, 1.15, 2.75, 0.48)
      for (const k of [-1, 1]) rectWin(green, w, s + k * 0.78, 1.1, 2.8, 0.26)
    }
    rectWin(green, w, 7.15, PORCH, 2.65, 0.55)
    rectWin(win, w, 7.15, 2.7, 3.1, 0.55)
    // dormers on the steep slope, round-headed sashes
    for (const xd of [-0.45, 3.55, 7.55]) {
      const vf = 4.75, vb = 2.4
      const ya = YC + sg * vf, yb = YC + sg * vb
      box(wall, xd - 0.75, Math.min(ya, yb), xd + 0.75, Math.max(ya, yb), 4.9, 7.2)
      hipRoof(roof, wall, null, xd - 0.75, Math.min(ya, yb), xd + 0.75, Math.max(ya, yb), 7.2, 0.7, 0.12, sg < 0 ? ['gable', 'hip'] : ['hip', 'gable'], 'y')
      const f = sg < 0 ? edgeFrame([xd - 0.75, ya], [xd + 0.75, ya]) : edgeFrame([xd + 0.75, ya], [xd - 0.75, ya])
      archWin(win, f, 0.75, 5.45, 6.95, 0.42)
    }
  }
  // gable-end windows
  for (const [a, b] of [[[X1, YC - HV], [X1, YC + HV]], [[X0, YC + HV], [X0, YC - HV]]] as [XY, XY][]) {
    const w = edgeFrame(a, b)
    for (const s of [2.6, 7.4]) {
      rectWin(win, w, s, 1.15, 2.75, 0.48)
      for (const k of [-1, 1]) rectWin(green, w, s + k * 0.78, 1.1, 2.8, 0.26)
      rectWin(win, w, s, 5.2, 6.5, 0.42)
    }
    rectWin(win, w, HV, 7.6, 8.3, 0.3)
  }
  // Chimneys at both ends of the ridge.
  for (const x of [X0 + 0.7, X1 - 0.7]) box(brick, x - 0.45, YC - 0.35, x + 0.45, YC + 0.35, 8.6, 10.6)

  // The lower wing to the north-west, with its own flared roof and chimney.
  const W0 = -12.18, WC = -0.56, WH = 3.8
  const wprof: [number, number][] = [[5.33, 2.55], [4.6, 2.95], [3.6, 3.9], [0, 6.3]]
  box(wall, W0, WC - WH, X0, WC + WH, 0, 3.4)
  gableWall(wall, W0, -1, WC, WH, wprof)
  profileRoof(roof, wall, W0 - 0.3, X0, WC, wprof)
  for (const [a, b] of [[[W0, WC - WH], [X0, WC - WH]], [[X0, WC + WH], [W0, WC + WH]]] as [XY, XY][]) {
    const w = edgeFrame(a, b)
    for (const s of [1.6, 4.3, 7.0]) { rectWin(win, w, s, 0.9, 2.4, 0.45); for (const k of [-1, 1]) rectWin(green, w, s + k * 0.72, 0.85, 2.45, 0.24) }
  }
  {
    const w = edgeFrame([W0, WC + WH], [W0, WC - WH])
    rectWin(win, w, 2.2, 0.9, 2.4, 0.45); rectWin(green, w, 5.0, 0.2, 2.4, 0.5)
    rectWin(win, w, WH, 3.8, 4.8, 0.35)
  }
  box(brick, W0 + 0.6, WC - 0.35, W0 + 1.4, WC + 0.35, 5.0, 7.4)

  finishModel('Lefferts Historic House', 'nyc-lefferts-house', [
    { part: wall, material: finish('white-shingle', 0xf1ede4) },
    { part: roof, material: finish('wood-shingle', 0x8e877a) },
    { part: win, material: PALETTE.window },
    { part: brick, material: finish('chimney-brick', 0xa8644f) },
    { part: green, material: finish('shutter-green', 0x8fa58f) },
  ], { bearing: 62.7, osm: 'way/241846626', height: 10.6 })
}

if (import.meta.main) build()
