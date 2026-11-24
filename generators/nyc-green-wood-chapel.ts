/**
 * Green-Wood Historic Chapel, Green-Wood Cemetery, Brooklyn (Warren &
 * Wetmore, 1911; Indiana limestone, modelled on Tom Tower, Christ Church,
 * Oxford) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-green-wood-chapel.ts
 *
 * Frame: x = model east (toward 107.6°), y = model north (toward 17.6°,
 * the rear; the entrance front faces −y, 197.6°), z up, metres. Placed at
 * bearing 17.6. Anchor: the area centroid of OSM way/249623444
 * (-73.995312, 40.656345), which the model replaces. Uses the helpers in
 * nyc-green-wood-gate.ts.
 *
 * Evidence
 * - OSM way/249623444 (ODbL): "Green-Wood Historic Chapel", architect
 *   Warren & Wetmore, limestone, height=13.7 (the gable ridge; the tower is
 *   far taller). Outline 294 m²: the body x ±7.3, y −6.5…9.3, the entrance
 *   arm y −10.6…−6.5 (x ±5.6), and four octagonal corner turrets centred
 *   (±7.0, −4.5) and (±6.8, 8.9), r ≈ 1.55.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, read in this
 *   frame; ground 0.6 over the crop minimum = z 0, flat round the chapel.
 *   Measured: dome 24.6 (finial thin, drawn to 25.4); the tower ~5.8 m
 *   square centred (0, 1.5), its pinnacles and the dome's foot ~20.5–21.8;
 *   the crossing round the tower's foot 12.0; the side walls' parapet 8.6;
 *   the entrance arm's ridge 13.2 (eaves ~10; its apex pinnacle 14.9), the rear arm's 13.0;
 *   turret caps ~13.5.
 * - Published (Green-Wood Cemetery; Wikipedia "Green-Wood Cemetery"):
 *   chapel 1911 by Warren & Wetmore, in the late Gothic style of Tom Tower,
 *   restored 1980s.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Rhododendrites, "Green-Wood Cemetery Chapel (61921).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Green-Wood_Cemetery_Chapel_(61921).jpg
 *     (a side from above: side window, turret caps, roof, tower);
 *   Beyond My Ken, "2015 Green-Wood Chapel rear with Cemetery Gate in
 *     background.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:2015_Green-Wood_Chapel_rear_with_Cemetery_Gate_in_background.jpg
 *     (rear gable and great window, tower windows, pinnacles, dome);
 *   Rhododendrites, "Green-Wood Cemetery Chapel (83063).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Green-Wood_Cemetery_Chapel_(83063).jpg
 *     (the entrance front: doorway, gable window, steps).
 *
 * Estimated from the photos scaled to the lidar: windows (side 2.0–7.4,
 * rear 2.4–10.0, front 4.6–9.6), the doorway (0.6–4.2), the tower's twin
 * louvred lancets (14.2–18.6), the dome's ogee profile, turret bodies to
 * 9.4 with ogee caps to 13.5. Simplified: the panelled buttresses and
 * crocketed pinnacles are plain shafts with pyramids, the cresting and
 * tracery are left out except the great windows' mullions.
 */
import { Part, type V3 } from './mesh'
import { finishModel, capPoly, circle, prism, type XY } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'
import { hipRoof, dome } from './nyc-litchfield-villa'
import { pinnacle, pointedPanel, faceX, faceY, bar } from './nyc-green-wood-gate'
import { PALETTE, finish } from './palette'

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), door = new Part(), trim = new Part()

  // ---- Body and parapets.
  const BX = 7.3, BY0 = -6.5, BY1 = 9.3, WALL = 8.0, PAR = 8.6
  box(stone, -BX, BY0, BX, BY1, 0, WALL)
  prism({ wall: trim, win: null, roof: roof, ring: [[-BX - 0.2, BY0 - 0.2], [BX + 0.2, BY0 - 0.2], [BX + 0.2, BY1 + 0.2], [-BX - 0.2, BY1 + 0.2]], z0: WALL, z1: PAR, facade: null, bevel: 0.15 })
  // the crossing round the tower's foot (lidar 12.0) with its balustrade band
  box(stone, -5.6, -2.0, 5.6, 5.0, PAR, 11.4)
  prism({ wall: trim, win: null, roof: roof, ring: [[-5.8, -2.2], [5.8, -2.2], [5.8, 5.2], [-5.8, 5.2]], z0: 11.4, z1: 12.0, facade: null, bevel: 0.12 })
  // the roof inside the side parapets, and the clerestory's three lancets a side
  capPoly(roof, [[-BX, BY0], [BX, BY0], [BX, BY1], [-BX, BY1]], PAR - 0.05)
  for (const sx of [1, -1] as const) for (const y of [0.4, 1.5, 2.6]) pointedPanel(win, faceX(sx * 5.6, sx), y, 9.1, 10.3, 0.32, 0.05)
  // side windows: the great pointed window in each side, small lancets by the turrets
  for (const sx of [1, -1] as const) {
    const f = faceX(sx * BX, sx)
    pointedPanel(trim, f, 1.4, 1.7, 5.8, 1.55, 0.04)
    pointedPanel(win, f, 1.4, 2.0, 5.8, 1.3, 0.07)
    for (const ds of [-0.45, 0.45]) bar(trim, f.at(1.4 + ds, 2.0, 0.09), f.at(1.4 + ds, 7.3, 0.09), 0.16, 0.06, f.n)
  }

  // ---- Entrance arm (gable to −y) and rear arm (gable to +y).
  const FY = -10.6
  box(stone, -5.6, FY, 5.6, BY0 + 0.1, 0, 10.0)
  hipRoof(roof, stone, null, -5.0, FY + 0.05, 5.0, -2.0, 10.0, 3.2, 0.3, ['gable', 'hip'], 'y')
  hipRoof(roof, stone, null, -5.4, 5.0, 5.4, BY1 + 0.3, 9.6, 3.6, 0.3, ['hip', 'gable'], 'y')
  box(stone, -5.4, 5.0, 5.4, BY1, WALL, 9.6)
  {
    const f = faceY(FY, -1)
    // the doorway with its steps, the gable window over it
    box(trim, -2.4, FY - 1.6, 2.4, FY, 0, 0.3)
    box(trim, -2.0, FY - 0.8, 2.0, FY, 0.3, 0.6)
    pointedPanel(trim, f, 0, 0.6, 3.0, 1.3, 0.05)
    pointedPanel(door, f, 0, 0.6, 3.0, 1.0, 0.08)
    pointedPanel(trim, f, 0, 4.4, 8.0, 1.75, 0.05)
    pointedPanel(win, f, 0, 4.7, 8.0, 1.5, 0.08)
    for (const ds of [-0.5, 0.5]) bar(trim, f.at(ds, 4.7, 0.1), f.at(ds, 9.6, 0.1), 0.16, 0.06, f.n)
    // gable coping and the buttress pinnacles at its corners
    for (const sx of [1, -1]) {
      bar(trim, [sx * 5.4, FY - 0.15, 9.9], [0, FY - 0.15, 13.3], 0.45, 0.4, [0, -1, 0], true)
      pinnacle(stone, sx * 5.2, FY + 0.35, 0.45, 10.0, 11.0, 12.6, roof)
    }
    pinnacle(stone, 0, FY - 0.15, 0.25, 13.0, 13.6, 14.9)
  }
  {
    // the rear gable wall rises from the ground, in front of the body's parapet band
    const RY = BY1 + 0.3
    box(stone, -5.4, BY1 - 0.4, 5.4, RY, 0, 9.6)
    const f = faceY(RY, 1)
    pointedPanel(trim, f, 0, 2.1, 7.0, 2.25, 0.05)
    pointedPanel(win, f, 0, 2.4, 7.0, 1.95, 0.08)
    for (const ds of [-1.0, 0, 1.0]) bar(trim, f.at(ds, 2.4, 0.1), f.at(ds, 9.8, 0.1), 0.16, 0.06, f.n)
    for (const sx of [1, -1]) bar(trim, [sx * 5.6, RY + 0.05, 9.5], [0, RY + 0.05, 13.3], 0.45, 0.4, [0, 1, 0], true)
    pinnacle(stone, 0, RY, 0.25, 12.8, 13.3, 14.0)
  }

  // ---- Four octagonal corner turrets with ogee caps of stone scales.
  for (const [cx, cy] of [[7.0, -4.5], [-7.0, -4.5], [6.8, 8.9], [-6.8, 8.9]] as XY[]) {
    const r = 1.55, oct = circle(cx, cy, r, 8, Math.PI / 8)
    prism({ wall: stone, win: null, roof: null, ring: oct, z0: 0, z1: 9.4, facade: null, bevel: 0.05 })
    prism({ wall: trim, win: null, roof: null, ring: circle(cx, cy, r + 0.18, 8, Math.PI / 8), z0: 9.4, z1: 10.0, facade: null, bevel: 0.05 })
    capPoly(trim, circle(cx, cy, r + 0.18, 8, Math.PI / 8), 10.0)
    dome(roof, cx, cy, [[r + 0.1, 10.0], [r + 0.15, 10.5], [r - 0.25, 11.5], [0.85, 12.4], [0.3, 13.2], [0, 13.5]], 8, Math.PI / 8)
    box(trim, cx - 0.1, cy - 0.1, cx + 0.1, cy + 0.1, 13.3, 14.1)
    for (let k = 0; k < 8; k += 2) {
      const a = Math.PI / 8 + (k + 0.5) * (Math.PI / 4)
      const w = { n: [Math.cos(a), Math.sin(a), 0] as V3, at: (s: number, z: number, d = 0): V3 => [cx + (r * Math.cos(Math.PI / 8) + d) * Math.cos(a) - s * Math.sin(a), cy + (r * Math.cos(Math.PI / 8) + d) * Math.sin(a) + s * Math.cos(a), z] }
      pointedPanel(win, w, 0, 3.0, 5.4, 0.28, 0.04)
    }
  }

  // ---- The tower (Tom Tower): chamfered square, twin louvred lancets a
  // face, clustered corner pinnacles, an ogee dome and its lantern finial.
  const TC: XY = [0, 1.5], TH = 2.9, CH = 0.8
  const T: XY[] = [[-TH + CH, -TH], [TH - CH, -TH], [TH, -TH + CH], [TH, TH - CH], [TH - CH, TH], [-TH + CH, TH], [-TH, TH - CH], [-TH, -TH + CH]].map(([x, y]) => [x + TC[0], y + TC[1]] as XY)
  prism({ wall: stone, win: null, roof: null, ring: T, z0: 12.0, z1: 19.4, facade: null, bevel: 0.05 })
  prism({ wall: trim, win: null, roof: roof, ring: T.map(([x, y]) => [TC[0] + (x - TC[0]) * 1.08, TC[1] + (y - TC[1]) * 1.08] as XY), z0: 19.4, z1: 19.9, facade: null, bevel: 0.1 })
  for (const [f, c] of [[faceY(TC[1] - TH, -1), TC[0]], [faceY(TC[1] + TH, 1), TC[0]], [faceX(TC[0] - TH, -1), TC[1]], [faceX(TC[0] + TH, 1), TC[1]]] as [ReturnType<typeof faceY>, number][]) {
    for (const ds of [-0.85, 0.85]) {
      pointedPanel(trim, f, c + ds, 13.9, 17.9, 0.65, 0.04)
      pointedPanel(win, f, c + ds, 14.2, 17.9, 0.5, 0.07)
    }
    // the small rose under the lancets and the pinnacle over the face's middle
    pointedPanel(trim, f, c, 12.6, 13.4, 0.4, 0.05)
    const m = f.at(c, 0, 0.25)
    pinnacle(stone, m[0], m[1], 0.22, 19.9, 20.6, 21.6)
  }
  for (const k of [0, 2, 4, 6]) {
    const a = T[k], b = T[(k + 7) % 8], cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    const dx = cx - TC[0], dy = cy - TC[1], L = Math.hypot(dx, dy)
    const px = TC[0] + (dx / L) * (L + 0.25), py = TC[1] + (dy / L) * (L + 0.25)
    prism({ wall: stone, win: null, roof: null, ring: circle(px, py, 0.6, 8, Math.PI / 8), z0: 12.0, z1: 21.4, facade: null, bevel: 0.03 })
    for (const [ox, oy] of [[0, 0], [0.45, 0], [-0.45, 0], [0, 0.45], [0, -0.45]]) {
      const h = ox === 0 && oy === 0 ? 23.4 : 22.4
      pinnacle(stone, px + ox, py + oy, 0.17, 21.4, 21.7, h)
    }
  }
  dome(roof, TC[0], TC[1], [[2.65, 19.9], [2.65, 20.4], [2.35, 21.6], [1.65, 22.8], [0.75, 23.8], [0.28, 24.4], [0, 24.5]], 16)
  dome(trim, TC[0], TC[1], [[0.3, 24.1], [0.45, 24.5], [0.3, 24.8], [0.4, 25.0], [0.15, 25.3], [0, 25.6]], 8)

  finishModel('Green-Wood Historic Chapel', 'nyc-green-wood-chapel', [
    { part: stone, material: finish('indiana-limestone', 0xe4dccf) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: finish('limestone-roof', 0xc4bdb2) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('door-oak', 0x8a6a52) },
  ], { bearing: 17.6, osm: 'way/249623444', height: 25.6 }, 6500)
}

if (import.meta.main) build()
