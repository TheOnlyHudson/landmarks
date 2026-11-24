/**
 * The Old Stone House (Vechte–Cortelyou House), Washington Park, Park Slope,
 * Brooklyn (1699; rebuilt 1933–34 from the original stones) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-old-stone-house.ts
 *
 * Frame: x = model east (toward 121.7°), y = model north (toward 31.7°,
 * along the ridge), z up, metres. Placed at bearing 31.7. Anchor: the area
 * centroid of OSM way/248236287 (-73.98462, 40.672993), which the model
 * replaces with its parts.
 *
 * Evidence
 * - OSM (ODbL): way/248236287 "Old Stone House", height=8.9; parts
 *   673732029 (the stone house, x −3.23…3.87, y −3.5…8.2, gabled, 8.9),
 *   673732027 (the lower wing, x −3.24…1.48, y −9.6…−3.5, gabled, 7),
 *   673732031 and 673732030 (the house's end chimneys, 10), 673732028 (the
 *   wing's chimney, 9).
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, read in this
 *   frame; ground 0.9 over the crop minimum = z 0, flat. Measured: house
 *   eaves 5.6, ridge 8.7 (at x 0.3, mid-depth); end chimneys 10.8; wing
 *   eaves 4.8, ridge 6.1; wing chimney 8.6.
 * - Published (NYC Parks; Wikipedia "Old Stone House (Brooklyn)"; HABS
 *   NY-24-BROK-8): Dutch farmhouse of 1699, ruined, rebuilt by the city in
 *   1933–34 with the original stones; stepped (crow-stepped) gable ends.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Jim alfano, "Old Stone House Brooklyn NY.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Old_Stone_House_Brooklyn_NY.jpg
 *     (the west side square on: house and wing, openings, chimneys,
 *     the stepped gable's edge; scale 45.7 px/m from the OSM length);
 *   Dmadeo, "Old-stone-house-brooklyn.JPG", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Old-stone-house-brooklyn.JPG
 *     (the east side: three upper windows, two below and the door).
 *
 * Estimated from the photos: openings (ground windows 1.4–3.1, the doors
 * 0–2.6, upper windows 3.9–5.2), shutters, the gables' steps (five a side,
 * standing 0.35 m proud of the roof). Doubts: the gable ends themselves are
 * only seen obliquely; the steps' count follows the HABS-era photos'
 * description and the west photo's edge.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'
import { hipRoof } from './nyc-litchfield-villa'
import { faceX, faceY } from './nyc-green-wood-gate'
import { PALETTE, finish } from './palette'

function build() {
  const stone = new Part(), stucco = new Part(), roof = new Part(), brick = new Part(), win = new Part(), wood = new Part()

  // ---- The stone house.
  const X0 = -3.23, X1 = 3.87, Y0 = -3.5, Y1 = 8.2, EAVE = 5.6, RIDGE = 8.7
  box(stone, X0, Y0, X1, Y1, 0, EAVE)
  hipRoof(roof, stone, roof, X0, Y0 + 0.4, X1, Y1 - 0.4, EAVE, RIDGE - EAVE, 0.25, ['gable', 'gable'], 'y')
  // crow-stepped gables at both ends, standing proud of the roof
  const xm = (X0 + X1) / 2, hw = (X1 - X0) / 2 + 0.05, steps = 5, top = RIDGE + 0.35
  for (const [ya, yb] of [[Y0, Y0 + 0.45], [Y1 - 0.45, Y1]]) {
    box(stone, X0, ya, X1, yb, EAVE - 0.01, EAVE + 0.35)
    for (let k = 0; k < steps; k++) {
      const z0 = EAVE + 0.35 + ((top - EAVE - 0.35) * k) / steps, z1 = EAVE + 0.35 + ((top - EAVE - 0.35) * (k + 1)) / steps
      const w = hw * (1 - (k + 0.6) / (steps + 0.4))
      box(stone, xm - w, ya, xm + w, yb, z0, z1)
    }
  }

  // ---- The wing, stuccoed, lower, its own gable roof.
  const WX0 = -3.24, WX1 = 1.48, WY0 = -9.6, WE = 4.8, WR = 6.1
  box(stucco, WX0, WY0, WX1, Y0, 0, WE)
  hipRoof(roof, stucco, roof, WX0, WY0, WX1, Y0 - 0.02, WE, WR - WE, 0.25, ['gable', 'gable'], 'y')

  // ---- Chimneys (lidar 10.8 and 8.6), brick.
  for (const [x0, y0, x1, y1, z] of [[-0.16, -3.49, 0.79, -2.45, 10.8], [-0.14, 7.15, 0.8, 8.2, 10.8], [-1.3, -9.32, -0.43, -8.49, 8.6]] as [number, number, number, number, number][]) {
    box(brick, x0, y0, x1, y1, 4.5, z)
    box(brick, x0 - 0.08, y0 - 0.08, x1 + 0.08, y1 + 0.08, z - 0.3, z - 0.15)
  }

  // ---- Openings: windows with shutters, the doors.
  const window = (f: ReturnType<typeof faceX>, s: number, z0: number, z1: number, w = 0.45, shutters = true) => {
    quadF(win, f.at(s - w, z0, 0.04), f.at(s + w, z0, 0.04), f.at(s + w, z1, 0.04), f.at(s - w, z1, 0.04), f.n)
    if (shutters) for (const d of [-1, 1]) {
      const a = s + d * (w + 0.05), b = s + d * (w + 0.5)
      quadF(wood, f.at(Math.min(a, b), z0, 0.05), f.at(Math.max(a, b), z0, 0.05), f.at(Math.max(a, b), z1, 0.05), f.at(Math.min(a, b), z1, 0.05), f.n)
    }
  }
  const door = (f: ReturnType<typeof faceX>, s: number, z1 = 2.4, w = 0.55) =>
    quadF(wood, f.at(s - w, 0, 0.05), f.at(s + w, 0, 0.05), f.at(s + w, z1, 0.05), f.at(s - w, z1, 0.05), f.n)
  {
    const W = faceX(X0, -1) // west side (s = y)
    window(W, 6.4, 1.4, 3.1); door(W, 2.9, 2.6); window(W, -0.9, 1.4, 3.1)
    window(W, 5.1, 3.9, 5.2); window(W, 0.4, 3.9, 5.2)
    const E = faceX(X1, 1)
    door(E, -1.4, 2.5); window(E, 2.3, 1.4, 3.1); window(E, 5.6, 1.4, 3.1)
    for (const y of [-1.0, 2.3, 5.6]) window(E, y, 3.9, 5.2)
    const N = faceY(Y1, 1)
    window(N, xm - 1.6, 1.4, 3.1, 0.4, false); window(N, xm + 1.6, 1.4, 3.1, 0.4, false)
    // the wing: a door and a window on the west, small windows under the eaves
    const WW = faceX(WX0, -1)
    door(WW, -4.6, 2.3); window(WW, -8.4, 1.4, 2.9, 0.4, false); window(WW, -8.0, 3.6, 4.4, 0.3, false)
    window(faceX(WX1, 1), -6.5, 1.4, 2.9, 0.4, false)
    window(faceY(WY0, -1), (WX0 + WX1) / 2, 1.4, 2.9, 0.4, false)
  }

  finishModel('Old Stone House', 'nyc-old-stone-house', [
    { part: stone, material: finish('fieldstone', 0xa39482) },
    { part: stucco, material: finish('stucco', 0xddd3c2) },
    { part: roof, material: finish('red-metal-roof', 0xb0634e) },
    { part: brick, material: finish('chimney-brick', 0xae7a63) },
    { part: win, material: PALETTE.window },
    { part: wood, material: finish('barn-red', 0x9a4a3e) },
  ], { bearing: 31.7, osm: 'way/248236287', height: 10.8 }, 5000)
}

if (import.meta.main) build()
