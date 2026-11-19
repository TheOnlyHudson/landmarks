/**
 * Westin Book Cadillac Hotel (1114 Washington Boulevard, Detroit, 1924,
 * Louis Kamper; restored 2008) — original procedural geometry, CC0-1.0.
 * bun generators/det-book-cadillac.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/1066234397 ("The Westin
 * Book Cadillac Detroit"), 42.3321106,-83.0502158. Its walls run at 359.25°
 * / 89.25°, so the bearing is 359.25: x runs along Michigan Avenue (south
 * face), y along Washington Boulevard (west face).
 *
 * `replaces`: the outline way/1066234397 (the whole block, tagged 3 levels,
 * height 10 — wrong for the tower, right for the low north wing) and the
 * tower part way/59121911 (29 levels, 106.4 m), which the model covers.
 *
 * Identity, in order: the tall tan-brick U-plan tower filling the south and
 * west of the block, its light court opening north over the ballroom roof;
 * the corner pavilions rising above the cornice with copper pyramid roofs
 * (floodlit at night); the pale stone base with its arcade of tall
 * round-headed windows on Washington Boulevard and Michigan Avenue; the
 * string courses in the upper storeys.
 *
 * Evidence:
 *  - plan: OSM outline 68.4 × 70.2 m and the tower part's U ring, read in
 *    this frame; Kamper's typical floor plan (7th-26th floors, public
 *    domain) shows the same U: west wing, south bar, east wing, with the
 *    elevator block in the north-west and the court open to the north.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, ground
 *    flat (0.3-1.1 m). Low north wing 12.7-14.2 m; the court's floor (the
 *    ballroom roof) 20-25 m; the tower's outer cornice 93.7 m with a lip at
 *    ~74 m below it; the attic behind the cornice 97-100 m; the corner
 *    pavilions ~10 m square to 101-104 m with peaks 106.8-107.7 m (their
 *    pyramid roofs); the north-west elevator block 105.5 m. Published:
 *    31 storeys, ~105 m (349 ft); OSM part height 106.4 m.
 *  - photos: base height (~4-5 storeys of pale stone, ~20 m), the arcade,
 *    the window pitch (paired windows, grouped here three storeys to a
 *    panel), string courses, the pavilions' pointed copper tops.
 *  - colour: tan brick #d8c6a8 in daylight photos, pulled to
 *    `cadillac-brick`; base `stone`; copper from the photos.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_December_2018_02_(Westin_Book_Cadillac_Hotel).jpg, Michael
 *    Barera, CC BY-SA 4.0 (south-west corner at night: base arcade, floodlit
 *    pavilions, sign)
 *  - BookCadillacfromWashingtonBlvd_april2008.jpg, Mike Russell, CC BY-SA 3.0
 *    (west and north faces, pavilions)
 *  - Book_Cadillac_Hotel_typical_floor_plan.png, Louis Kamper, public domain
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east (Shelby Street) face and the court's faces are drawn
 * from the plan and lidar only. The illuminated "WESTIN" letters over the
 * base are a modern brand sign, drawn as two plain neon bands rather than
 * lettering. The pavilions' tops are simplified to pyramids.
 *
 * Left out: carved ornament, balconies, mullions, rooftop plant.
 *
 * Helpers `wallBays`, `archPanel`, `band` come from det-book-tower.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, rect, save, spire, walls, type XY } from './chi-aon-center'
import { archPanel, band } from './det-book-tower'

const HX = 34.2, Y0 = -35.1, Y1 = 35.1
const BASE = 20, LIP = 74, CORNICE = 93.7, ATTIC = 98.5

/** The tower's U ring, counter-clockwise, from the OSM part way/59121911. */
const TOWER: XY[] = [[0.1, -7.2], [0.1, 10.5], [-HX, 10.5], [-HX, Y0], [HX, Y0], [HX, -6.2], [22.2, -6.2], [22.2, -22], [2.5, -22], [2.5, -15.9], [-8.5, -15.9], [-8.5, -20.7], [-15.3, -20.7], [-15.3, -7.2]]

/** Panels in bays of `pitch` along every edge of ring r longer than minLen. */
function ringBays(p: Part, r: XY[], groups: [number, number][], o: { pitch?: number; w?: number; minLen?: number; skip?: (a: XY, b: XY) => boolean } = {}) {
  const pitch = o.pitch ?? 3.3, w = o.w ?? 1.6, minLen = o.minLen ?? 5
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen || o.skip?.(a, b)) continue
    const n = Math.max(1, Math.floor((L - 2) / pitch)), first = (L - (n - 1) * pitch) / 2
    for (let k = 0; k < n; k++) for (const [z0, z1] of groups) panel(p, a, b, first + k * pitch - w / 2, first + k * pitch + w / 2, z0, z1, 0.05)
  }
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), copper = new Part(), sign = new Part()

  // ---- the low north wing and the court's ballroom block
  block(stone, roof, rect(-HX, 10.5, HX, Y1), 0, 12.8, 0.4)
  block(stone, roof, rect(0.1, -6.2, HX, 10.6), 0, 12.8, 0.4)
  block(stone, roof, rect(-15.3, -22, 22.2, -3), 0, 22.5, 0.4)

  // ---- the tower
  walls(stone, TOWER, 0, BASE - 1.0)
  band(stone, roof, TOWER, BASE - 1.0, BASE, 0.4)
  walls(brick, TOWER, BASE, LIP)
  band(stone, roof, TOWER, LIP - 0.8, LIP, 0.35)
  const upper = inset(TOWER, 0.4)
  walls(brick, upper, LIP, CORNICE - 1.2)
  band(stone, roof, upper, CORNICE - 1.2, CORNICE, 0.7)
  band(stone, roof, upper, 82.5, 83.2, 0.3)
  // the attic behind the cornice
  const attic = inset(TOWER, 2.4)
  walls(brick, attic, CORNICE - 0.5, ATTIC - 0.4)
  walls(brick, attic, ATTIC - 0.4, ATTIC, inset(attic, 0.4))
  cap(roof, inset(attic, 0.4), ATTIC)
  // the north-west elevator block
  block(brick, roof, rect(-18, -3, 0.1, 10.5), CORNICE, 105.5, 0.5)
  // elevator bulkhead over the court notch
  block(brick, roof, rect(-8.5, -21.5, 2.5, -15.9), CORNICE, 104.6, 0.4)

  // ---- corner pavilions with copper pyramids
  const pav: [number, number, number, number][] = [[-HX, Y0, -22.5, -23.4], [-HX, -1.0, -22.5, 10.5], [22.5, Y0, HX, -23.4], [22.2, -17.5, HX, -6.2]]
  for (const [x0, y0, x1, y1] of pav) {
    const r = rect(x0, y0, x1, y1)
    walls(brick, r, CORNICE, 102.6)
    band(stone, roof, r, 102.6, 103.4, 0.3)
    const t = inset(r, 0.6)
    spire(copper, t, 103.4, [(x0 + x1) / 2, (y0 + y1) / 2, 108.5])
    ringBays(win, r, [[CORNICE + 1.2, 101.4]], { pitch: 3.0, w: 1.4, minLen: 6 })
  }

  // ---- windows
  ringBays(win, TOWER, [[23.2, 31.2], [33.4, 41.4], [43.6, 51.6], [53.8, 61.8], [64, 72]], { w: 1.25, pitch: 3.4 })
  ringBays(win, upper, [[75.6, 81.4], [84.4, 91.4]], { w: 1.4, pitch: 3.4 })
  // the north wing and ballroom block: plain windows
  ringBays(win, rect(-HX, 10.5, HX, Y1), [[4.2, 11.4]], { pitch: 4.4, w: 2.4, skip: (a, b) => a[1] < 11 && b[1] < 11 })
  panel(win, [HX, -6.2], [HX, 10.6], 1.5, 15.3, 4.2, 11.4, 0.05)

  // ---- the base on Washington Boulevard (west) and Michigan Avenue (south)
  const fronts: [XY, XY][] = [[[-HX, 10.5], [-HX, Y0]], [[-HX, Y0], [HX, Y0]]]
  for (const [a, b] of fronts) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 5.2), pitch = L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * pitch
      archPanel(win, a, b, c - 1.6, c + 1.6, 4.6, 12.4, 0.05, 8)
      panel(win, a, b, c - 1.0, c + 1.0, 14.2, 18.2, 0.05)
    }
    // ground floor: shop windows and doors
    panel(win, a, b, 2, L - 2, 0.6, 3.8, 0.05)
  }
  // the Westin sign over the base at the south-west corner: two lit bands
  const west: [XY, XY] = [[-HX, 10.5], [-HX, Y0]], south: [XY, XY] = [[-HX, Y0], [HX, Y0]]
  panel(sign, west[0], west[1], 34, 42, 20.6, 22.4, 0.12)
  panel(sign, south[0], south[1], 4, 12, 20.6, 22.4, 0.12)

  // Night: the pavilions and the top of the tower are floodlit; the base too.
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] > CORNICE - 2 ? 0.9 : p[2] < BASE + 0.5 ? 0.6 : p[2] > 82 ? 0.35 : 0)
  return [
    { part: brick, material: { ...finish('cadillac-brick', 0xe2d1b6), floodlight: flood } },
    { part: stone, material: { ...PALETTE.stone, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: { ...PALETTE.copper, floodlight: () => 0.6 } },
    { part: sign, material: finish('neon-westin', 0xf3efe6) },
  ]
}

if (import.meta.main) await save('det-book-cadillac', 'Westin Book Cadillac Hotel', [42.3321106, -83.0502158], 359.25, build(), 5000)
