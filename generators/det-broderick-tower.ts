/**
 * David Broderick Tower (10 Witherell Street, Detroit, 1928, Louis and Paul
 * Kamper; built as the Eaton Tower) — original procedural geometry, CC0-1.0.
 * bun generators/det-broderick-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM multipolygon relation/11517651
 * ("David Broderick Tower"; outer ways 69349720 and 838342841 joined),
 * 42.3359477,-83.0497032. Bearing 330: the south and west walls are square
 * to each other in this frame (y = -7.2 and x = -13.1); the east and north
 * walls are skewed, as in Kamper's plans, because the lot follows the
 * Grand Circus Park radial streets.
 *
 * `replaces`: relation/11517651 only. The Madison Building and the
 * Metropolitan and United Foundation buildings nearby are separate.
 *
 * Identity, in order: a slim 34-storey quadrilateral tower of buff brick
 * with pale stone corner piers; the pale stone upper storeys (from ~77 m)
 * with string courses; the top stage with cut corners and three tall
 * round-headed openings to a face (the rooftop pavilion), under a dark
 * coping; a stone base. The whale mural on the east wall is paint and is
 * left out, as a plain wall.
 *
 * Evidence:
 *  - plan: the OSM relation's ring (478 m²) in this frame; Kamper's ground
 *    and typical floor plans (public domain) show the same skewed
 *    quadrilateral, elevators along the north wall.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid
 *    (centred 2.2 m east, 6.9 m north of the anchor; read with that
 *    offset). Main roof 112.1-112.3 m with its coping at 113 m; a
 *    penthouse to 115 m over the south-east half; a step to ~103.7 m along
 *    the north wall. Published/OSM height 112 m, 34 storeys.
 *  - photos (scaled in JJonahJackalope's view): pale stone from ~0.69 of
 *    the height (77 m), string courses at ~80 m and ~93 m, the top stage
 *    from ~102 m; window pitch (paired windows grouped here three storeys
 *    to a panel); a pale stone base about two storeys high.
 *  - colour: the brick #b9a682 and the stone #ddd5c6 from the photos,
 *    pulled to `broderick-brick` and `stone`; the coping dark
 *    (`broderick-coping`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Broderick_Tower,_Detroit.jpg, JJonahJackalope, CC BY-SA 4.0 (west
 *    face along Woodward, whole height)
 *  - David_Broderick_Tower_as_seen_from_Thomas_Edison_Memorial_Fountain,_
 *    Grand_Circus_Park,_Detroit_-_20201215.jpg, Andre Carrotflower,
 *    CC BY-SA 4.0 (from the north, the crown's cut corners and arches)
 *  - Eaton_Tower_Broderick_Tower_floor_plans.png, Louis and Paul Kamper,
 *    public domain
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the skewed north and east faces are drawn from the plan and
 * lidar; their crown is assumed to match the photographed faces. The
 * 103.7 m step along the north wall is drawn as part of the top stage's
 * cut corner.
 *
 * Left out: the whale mural (paint), carved ornament, mullions, the
 * rooftop antennas.
 *
 * Helper `archPanel`, `band` come from det-book-tower.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, panel, save, walls, type XY } from './chi-aon-center'
import { archPanel, band } from './det-book-tower'

const RING: XY[] = [[-13.1, -7.2], [12.5, -7.3], [5.45, 16.3], [-13.25, 11.3]]
const BASE = 9.5, STONE = 77, TOP = 102, ROOF = 112.2

/** Window columns on every edge of ring r at least minLen long, pitch along it. */
function columns(p: Part, r: XY[], groups: [number, number][], pitch: number, w: number, minLen = 4) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const n = Math.max(1, Math.floor((L - 3.2) / pitch)), first = (L - (n - 1) * pitch) / 2
    for (let k = 0; k < n; k++) for (const [z0, z1] of groups) panel(p, a, b, first + k * pitch - w / 2, first + k * pitch + w / 2, z0, z1, 0.05)
  }
}

/** Pale stone corner piers: a strip `w` wide each side of every corner, flush-proud. */
function cornerPiers(p: Part, r: XY[], z0: number, z1: number, w = 1.4) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(p, a, b, 0, w, z0, z1, 0.04)
    panel(p, a, b, L - w, L, z0, z1, 0.04)
  }
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), coping = new Part(), door = new Part()

  // ---- stone base, brick shaft, stone upper storeys
  walls(stone, RING, 0, BASE)
  band(stone, roof, RING, BASE, BASE + 0.8, 0.3)
  walls(brick, RING, BASE + 0.8, STONE)
  cornerPiers(stone, RING, BASE + 0.8, STONE)
  walls(stone, RING, STONE, TOP - 1.0)
  band(stone, roof, RING, STONE, STONE + 0.6, 0.25)
  band(stone, roof, RING, 80.2, 80.8, 0.3)
  band(stone, roof, RING, 92.6, 93.4, 0.45)
  band(stone, roof, RING, TOP - 1.0, TOP, 0.55)

  // ---- the top stage: cut corners, arched openings, dark coping
  const top = chamfer(inset(RING, 0.3), 3.2)
  walls(stone, top, TOP, ROOF - 0.9)
  walls(coping, top, ROOF - 0.9, ROOF + 0.4, inset(top, -0.35))
  walls(coping, inset(top, -0.35), ROOF + 0.4, ROOF + 0.8, inset(top, 0.1))
  cap(roof, inset(top, 0.1), ROOF + 0.8)
  // the penthouse over the south-east half
  block(stone, coping, [[0, -6.5], [9.5, -6.5], [7.5, 0.5], [0, 0.5]], ROOF + 0.8, 115.0, 0.3)

  // arches: three to each long face of the top stage, one to a cut corner
  for (let i = 0; i < top.length; i++) {
    const a = top[i], b = top[(i + 1) % top.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) {
      archPanel(win, a, b, L / 2 - 1.0, L / 2 + 1.0, TOP + 1.2, ROOF - 3.2, 0.05, 8)
      continue
    }
    const n = 3, pitch = Math.min(4.6, (L - 2) / n)
    for (let k = 0; k < n; k++) {
      const c = L / 2 + (k - 1) * pitch
      archPanel(win, a, b, c - 1.4, c + 1.4, TOP + 1.2, ROOF - 3.4, 0.05, 8)
    }
  }

  // ---- windows: three storeys (3.3 m) to a panel
  const shaft: [number, number][] = []
  for (let z = BASE + 2.2; z + 8.0 < STONE - 0.6; z += 9.9) shaft.push([z, z + 8.0])
  columns(win, RING, shaft, 2.7, 1.25, 6)
  columns(win, RING, [[STONE + 1.0, 79.8], [81.6, 92.0], [94.2, TOP - 1.6]], 2.7, 1.55, 6)
  // the base: shop windows, the entrance on Witherell (south face)
  columns(win, RING, [[1.0, 4.4], [5.8, 8.6]], 3.6, 2.4, 6)
  panel(door, RING[0], RING[1], 11.0, 14.6, 0, 4.0, 0.08)

  // Night: the crown floodlit.
  const flood = (p: V3, n: V3) => (p[2] < STONE ? 0 : n[2] > 0.7 ? 0.2 : 0.5 + 0.5 * Math.min(1, (p[2] - STONE) / 35))
  return [
    { part: brick, material: finish('broderick-brick', 0xcbb894) },
    { part: stone, material: { ...PALETTE.stone, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: coping, material: finish('broderick-coping', 0x8a7a66) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-broderick-tower', 'David Broderick Tower', [42.3359477, -83.0497032], 330, build(), 5000)
