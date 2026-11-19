/**
 * Omni Nashville Hotel (250 5th Avenue South), Nashville (2013, Gresham
 * Smith with Tvsdesign) — original procedural geometry, CC0-1.0.
 * bun generators/nash-omni-hotel.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Map frame: x, y in plan, z up, metres; origin at the anchor on the lowest
 * ground under the footprint. Anchor = area centroid of OSM way/464660187
 * (36.1573975, -86.7756216). Bearing 62°: +y faces 62° (Demonbreun's
 * direction), +x faces 152° (toward Korean Veterans Blvd); -y faces 242°,
 * 5th Avenue. The Country Music Hall of Fame (its own model,
 * nash-country-music-hall-of-fame) adjoins on the -x side, past x = -49;
 * this model stays inside the Omni outline.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the L-shaped tower along 5th Ave and the southern edge, raised over the
 *   podium on a recessed storey of columns;
 * - warm grey precast walls with punched windows (drawn as two-storey
 *   panels per bay) and a glass curtain-wall band on the top floors of the
 *   taller wing;
 * - dark grey plant penthouses at the corner and the north end;
 * - the podium (ballrooms, lobby) with tall glass bays between stone piers.
 *
 * Evidence
 * - OSM: outline way/464660187 (building, "Omni Nashville Hotel"); parts
 *   way/465454852 (building:part, 21 levels: the L tower) and
 *   way/986022998 (building:part, green roof on the podium). Read in this
 *   frame; the tower part runs x -12..46, y -52..50.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 1 m grid, read in
 *   this frame. Base = lowest ground under the footprint (0.5 m above the
 *   box's ground_min; the site is nearly flat, < 2 m). Measured above it:
 *   south wing roof 83.2 m; east wing 79.5 m (y < 8) and 83.2 m (y > 8);
 *   penthouses 87 m; podium 24.5 m, its west block (by the Hall of Fame)
 *   20.7 m. The tower walls in the lidar sit ~2-3 m inside OSM's on the
 *   east; OSM is used for the plan.
 * - Photos, all EVIDENCE:
 *   Omni Hotel Nashville Tower.jpg, Brichar60, CC BY-SA 4.0 (Wikimedia
 *     Commons; the tower from the south-west: L, precast and punched
 *     windows, glass top floors, the column storey, the penthouse);
 *   Omni, Nashville (Southeast corner).JPG, Michael Rivera, CC BY-SA 4.0
 *     (Commons; the podium's stone piers and tall glass bays);
 *   Music City Center (Omni, Country Music Hall of Fame...), rexhammock,
 *     CC BY-SA 2.0 (Flickr 8459468010; the tower under construction from
 *     the Music City Center, used for the precast/glass split).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: warm grey precast,
 *   pale green-grey glass, dark grey penthouse screens.
 * - Night: the guest-room windows and the curtain-wall floors glow.
 *
 * Estimated: the column storey (24.5-29 m, recessed 2 m); the glass band's
 *   depth (four storeys); the bay width (4.2 m).
 * Doubts: the east (+x) and north faces have no close photo; the podium
 *   glazing is drawn the same on every face.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, ccw, rect, bevel, prism, walls, cap, panels, rows, save, type Layer } from './nash-pinnacle'

const PODIUM = 24.5, LIFT = 29.0

// the OSM outline in this frame, rounded to 0.1 m
const SITE: XY[] = [
  [-49.0, 48.7], [-49.6, -22.9], [-49.7, -31.9], [-52.8, -31.9], [-52.9, -51.6], [-11.8, -52.5], [-0.8, -52.2],
  [-0.8, -55.8], [36.0, -55.6], [35.4, -51.6], [46.0, -52.1], [46.4, -42.5], [50.9, -42.1], [51.1, 41.3],
  [45.6, 41.3], [45.5, 49.8], [34.9, 49.6], [34.9, 54.9], [-49.0, 54.7],
]

/** A ring moved out (d > 0) or in (d < 0) by d, mitred (counter-clockwise ring). */
function offset(r: XY[], d: number): XY[] {
  const w = ccw(r), n = w.length
  return w.map((q, i) => {
    const p = w[(i - 1 + n) % n], s = w[(i + 1) % n]
    const n1 = nrm(p, q), n2 = nrm(q, s), m: XY = [n1[0] + n2[0], n1[1] + n2[1]], k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [q[0] + (m[0] / k) * d, q[1] + (m[1] / k) * d] as XY
  })
}
const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }

/** Clip a ring to x >= x0. */
function clipLeft(r: XY[], x0: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (a[0] >= x0) out.push(a)
    if ((a[0] >= x0) !== (b[0] >= x0)) { const t = (x0 - a[0]) / (b[0] - a[0]); out.push([x0, a[1] + t * (b[1] - a[1])]) }
  }
  return out
}

function build(): Layer[] {
  const stone = new Part()   // warm grey precast and podium stone
  const win = new Part()     // punched windows and podium glazing (glow at night)
  const cw = new Part()      // the curtain-wall top floors (glow at night)
  const roof = new Part()
  const plant = new Part()   // dark penthouse screens

  const edgePanels = (r: XY[], rs: [number, number][], bay: number, pier: number, min = 5) => {
    const w = ccw(r)
    for (let i = 0; i < w.length; i++) {
      const a = w[i], b = w[(i + 1) % w.length]
      if (a[0] < -48 && b[0] < -48) continue  // the shared wall with the Hall of Fame
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= min) panels(win, a, b, rs, bay, pier)
    }
  }

  // --- the podium: 20.7 m, raised to 24.5 m except the block by the Hall of Fame ---
  const site = ccw(bevel(SITE, 0.4))
  prism(stone, site, 0, 20.7, roof)
  for (const r of [clipLeft(site, -12), rect(-49, 25, -12, 54.7), rect(-52.8, -52.4, -12, -33)]) prism(stone, r, 20.7, PODIUM, roof)
  edgePanels(site, [[1.2, 5.8], [7.2, 19.4]], 7.5, 1.6)

  // --- the tower: an L, lifted on a recessed storey of columns ---
  const L: XY[] = [[-12, -52.3], [35.4, -52.3], [35.4, -42.5], [46.2, -42.5], [46.2, 49.7], [23, 49.7], [23, -30], [-12, -30]]
  const core = offset(L, -2.2)
  walls(win, core, PODIUM, LIFT)
  {
    const w = ccw(L)
    for (let i = 0; i < w.length; i++) {
      const a = w[i], b = w[(i + 1) % w.length], len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.max(1, Math.round(len / 8.5)), nn = nrm(a, b), u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
      for (let k = 0; k <= n; k++) {
        if (k === n) continue  // the next edge's first column stands on this corner
        const t = Math.min(Math.max((k * len) / n, 0.9), len - 0.9)
        const c: XY = [a[0] + u[0] * t - nn[0] * 0.9, a[1] + u[1] * t - nn[1] * 0.9]
        prism(stone, bevel(rect(c[0] - 0.55, c[1] - 0.55, c[0] + 0.55, c[1] + 0.55), 0.15), PODIUM, LIFT, null)
      }
    }
  }

  // the wings: [ring, roof height, glass band on top?]
  const wings: [XY[], number, boolean][] = [
    [rect(-12, -52.3, 35.4, -30), 83.2, true],                                                 // along 5th Ave
    [[[35.4, -42.5], [46.2, -42.5], [46.2, 8], [23, 8], [23, -30], [35.4, -30]], 79.5, false], // east wing, south
    [rect(23, 8, 46.2, 49.7), 83.2, true],                                                     // east wing, north
  ]
  for (const [ring, top, glassTop] of wings) {
    const r = ccw(bevel(ring, 0.4))
    const zg = glassTop ? top - 13.2 : top - 1.2
    walls(stone, r, LIFT, zg)
    if (glassTop) walls(cw, r, zg, top)
    else walls(stone, r, zg, top)
    // the roof, and the soffit over the column storey
    cap(roof, r, top)
    cap(stone, r, LIFT, false)
    edgePanels(r, rows(LIFT, zg, LIFT, 6.4, 1.3, 0.8, 0.6), 4.2, 1.5, 4)
  }
  // --- the plant penthouses ---
  prism(plant, bevel(rect(13, -41, 33, -34), 0.3), 83.2, 87.0, roof)
  prism(plant, bevel(rect(23, 38, 35, 47), 0.3), 83.2, 87.0, roof)

  return [
    { part: stone, material: finish('omni-precast', 0xd8cfc1) },
    { part: win, material: { ...PALETTE.window, color: 0x6f8698 } },
    { part: cw, material: { ...PALETTE.window, name: 'window-2', color: 0xa2bcc0 } },
    { part: roof, material: PALETTE.roof },
    { part: plant, material: finish('omni-plant', 0x6e7377) },
  ]
}

if (import.meta.main) {
  await save('nash-omni-hotel', 'Omni Nashville Hotel', build(), {
    bearing: 62, height: 87.0, replaces: ['way/464660187', 'way/465454852', 'way/986022998'],
  })
}
