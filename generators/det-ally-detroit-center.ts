/**
 * Ally Detroit Center (500 Woodward Avenue, Detroit, 1993, Philip Johnson
 * and John Burgee; formerly One Detroit Center / Comerica Tower) —
 * original procedural geometry, CC0-1.0.
 * bun generators/det-ally-detroit-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/30260210,
 * 42.3300648,-83.0449350. Its walls run at 329.6° / 59.6°, so the catalog
 * bearing is 329.6 and the square tower is square to this frame.
 *
 * Identity, in order: the crown — a steep gable on each of the four faces,
 * their roofs crossing over the middle, each gable edged with stepped
 * Flemish-Gothic pinnacles and topped by a spire, with pinnacled towers at
 * the cut corners; the pink-grey granite square shaft with cut corners, its
 * punched windows in three-storey bands; the tall openings of the base. At
 * night the crown's pinnacles and gables are lit warm gold
 * (`_FLOODLIGHT` on the granite above the shaft).
 *
 * Evidence:
 *  - plan: OSM outline, 49.2 × 49.5 m with the corners cut ~2.6 m.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid,
 *    40 m half-size crop centred on the anchor, read in this frame (street
 *    ~0.7 m above ground_min): shaft top / roof eaves 145 m in the corner
 *    zones (|x|, |y| ≥ 20); the roof is two crossing gabled prisms — the
 *    surface follows 182 - 1.83 × min(|x|, |y|) (61° slopes) — ridges
 *    ~181.5 m; the gable apex spires ~188 m. Published: 43 storeys, 189 m
 *    including the spires (Wikipedia; OSM 184.9, roof:height 8.7, which is
 *    too small against the lidar and the photos).
 *  - photos: four gables of the same width (~40 m, between the corner
 *    towers), five pinnacles a side plus the apex spire, the corner towers'
 *    pinnacles reaching about a third of the way up the gables, the
 *    tall slit windows in the gables, the three-storey banding and window
 *    pitch of the shaft (~12 bays a face), the base's tall openings.
 *  - colour: a warm pinkish grey granite (#c8baa9 in sun, Chris Woodrich's
 *    crown close-up; #b5a797 in WMrapids' photo), clearly darker and pinker
 *    than One Woodward's marble beside it; pulled to the palette as
 *    `ally-granite` #cdbdb6. The roof planes grey metal (`roof`).
 *  - windows: square-ish punched windows in a regular grid, drawn one panel
 *    per bay over two storeys with granite spandrels between.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Ally_Detroit_Center_(2025).jpg, WMrapids, CC0 (whole tower from above
 *    Hart Plaza)
 *  - Pinnacle_of_the_Ally_Detroit_Center,_Detroit,_Michigan,_2025-08-01.jpg,
 *    Chris Woodrich (Crisco 1492), CC BY-SA 4.0 (the crown)
 *  - One_Detroit_Center_(Detroit,_MI,_USA).jpg, Roland Arhelger, CC BY-SA
 *    4.0 (two faces from Hart Plaza)
 *  - Detroit_Financial_District_by_night_from_Windsor,_Ontario,
 *    _2025-06-28.jpg, Crisco 1492, CC BY-SA 4.0 (night: lit gable edges)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the glazed bands under the crossing roofs' eaves are folded into
 * the roof planes; the corner towers are drawn as one chamfered pier with a
 * spire each. The rooftop "ally" sign (on the south gable) is left out; its
 * lettering is not this landmark's identity. The garage (way/69000335) is
 * a separate building and is not modelled.
 *
 * Left out: mullions, crockets, the arcade's detail, the sign.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, panel, rect, rows, save, spire, walls, type XY } from './chi-aon-center'

function build() {
  const granite = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const H = 24.6, CUT = 2.6
  const EAVE = 145.4, RIDGE = 182, A = 20 // gables span x ∈ [-A, A]
  const S = (RIDGE - EAVE) / A // roof slope
  const h = (t: number) => RIDGE - S * Math.abs(t)

  // ---- shaft
  const plan = chamfer(rect(-H, -H, H, H), CUT)
  // split under the eave so the crown's floodlight doesn't bleed down the shaft
  walls(granite, plan, 0, EAVE - 2.5)
  walls(granite, plan, EAVE - 2.5, EAVE)

  // ---- the crossing gable roof, built for one half-sector and turned
  const rot = (p: V3, k: number): V3 => {
    let [x, y] = p
    for (let i = 0; i < k; i++) [x, y] = [-y, x]
    return [x, y, p[2]]
  }
  for (let k = 0; k < 4; k++) {
    // the sector facing +y (north) when k = 0: two planar halves either side of x = 0
    for (const sx of [1, -1]) {
      const P = (x: number, y: number): V3 => rot([sx * x, y, h(x)], k)
      const q = [P(0, 0), P(A, A), P(A, H), P(0, H)]
      if (sx > 0) roof.quad(q[0], q[1], q[2], q[3])
      else roof.quad(q[0], q[3], q[2], q[1])
    }
    // the gable wall on the face
    const g = [rot([-A, H, EAVE], k), rot([A, H, EAVE], k), rot([0, H, RIDGE], k)]
    granite.tri(g[1], g[0], g[2])
    // the strips of face beside the gable, up to the eave, are the shaft's; the corner zone is flat
    const c: XY[] = [[A, A], [H, A], [H, H - CUT], [H - CUT, H], [A, H]]
    const cz = c.map(([x, y]) => rot([x, y, EAVE], k))
    for (let i = 1; i < cz.length - 1; i++) roof.tri(cz[0], cz[i], cz[i + 1])
  }

  // ---- pinnacles: square shaft and spire, bolder than life so they read at phone size
  const pin = (x: number, y: number, z: number, hgt: number, r: number) => {
    block(granite, granite, rect(x - r, y - r, x + r, y + r), z - 1.5, z + hgt * 0.45, 0.15)
    spire(granite, rect(x - r, y - r, x + r, y + r), z + hgt * 0.45, [x, y, z + hgt])
  }
  for (let k = 0; k < 4; k++) {
    for (const t of [3.5, 7.5, 11.5, 15.5]) for (const sx of [1, -1]) {
      const p = rot([sx * t, H - 0.8, 0], k)
      pin(p[0], p[1], h(t), 7, 0.95)
    }
    const apex = rot([0, H - 0.9, 0], k)
    pin(apex[0], apex[1], RIDGE, 7.5, 1.1)
    // the corner tower at the cut corner
    const cc = rot([H - 3.2, H - 3.2, 0], k)
    const tower = chamfer(rect(cc[0] - 2.0, cc[1] - 2.0, cc[0] + 2.0, cc[1] + 2.0), 1.2)
    walls(granite, tower, EAVE - 1, 153)
    walls(granite, tower, 153, 153.5, inset(tower, 0.3))
    cap(granite, inset(tower, 0.3), 153.5)
    spire(granite, inset(tower, 0.3), 153.5, [cc[0], cc[1], 162])
  }

  // ---- windows
  // shaft: ~12 bays a face, two-storey bands (~3.9 m a floor) under the strong granite courses, from the base to the eave
  const bands = rows(13, EAVE - 2.5, 17, 3.0)
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue // the cut corners
    const k = 12, pitch = (L - 2) / k, w = pitch * 0.72
    for (let q = 0; q < k; q++) {
      const s = 1 + (q + 0.5) * pitch
      const t = Math.abs(s - L / 2) // distance from the face's middle
      for (const [z0, z1] of bands) panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)
      // gable slits, inside the gable triangle
      if (t < A - 2.5) panel(win, a, b, s - w * 0.25, s + w * 0.25, EAVE + 0.5, h(t + w) - 3.5, 0.05)
      // the base: tall openings over two storeys and a mezzanine
      panel(q % 2 ? win : door, a, b, s - w * 0.5, s + w * 0.5, 0, 10.5, 0.05)
    }
  }

  // Night: the crown floodlit gold, pinnacles brightest.
  const flood = (p: V3, n: V3) => (p[2] < EAVE - 2 ? 0 : n[2] > 0.8 ? 0.3 : 0.9)
  return [
    { part: granite, material: { ...finish('ally-granite', 0xcdbdb6), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-ally-detroit-center', 'Ally Detroit Center', [42.3300648, -83.044935], 329.6, build(), 5000)
