/**
 * David Stott Building (1150 Griswold Street, Detroit, 1929, Donaldson and
 * Meier) — original procedural geometry, CC0-1.0.
 * bun generators/det-david-stott-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/69349730 ("David Stott
 * Building"), 42.3324349,-83.0485357. Its walls run at 328.7° / 58.7°, so
 * the bearing is 328.7: x runs along State Street, y along Griswold.
 * The outline is 27.6 × 21.2 m.
 *
 * `replaces`: way/69349730 only. The Cunningham Drug Co. building
 * (way/1189932817 with parts way/69349731, 16 m, and way/1136392686, 25 m)
 * wraps the tower's south and east sides but is a separate building.
 *
 * Identity, in order: the slender salmon-orange brick shaft with
 * continuous piers; the stepped Art Deco crown, four setbacks with notched
 * corners and pale terracotta pinnacles, ending in a small square top
 * stage; the dark granite base with tall arches.
 *
 * Evidence:
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame (centres ~1.5 m west, ~1 m north of the OSM outline; the
 *    model is kept on the outline). Returns are sparse on the brick, but
 *    the tiers read: the full shaft to ~91 m, then rings to ~101.5 m,
 *    ~115 m and ~122.5 m, and a ~10 m square top stage at 131-133.7 m.
 *    Published roof 133.1 m (OSM), 436 ft; 38 storeys.
 *  - photos: tier proportions and notched corners, the pinnacles (pale
 *    terracotta, several to each tier's face), the granite base (~16 m,
 *    four storeys with tall round arches), window columns (9 on the long
 *    faces, 7 on the short), the pale stripes of terracotta on the crown.
 *  - colour: the brick #c97a52 in Antony-22's 2025 photo, pulled to
 *    `stott-brick`; terracotta to `trim`; granite #5f514d pulled to
 *    `stott-granite`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - David_Stott_Building_2025.jpg, Antony-22, CC BY-SA 4.0 (whole tower
 *    from Griswold, south-east-ish)
 *  - David_Stott_Building,_Detroit.jpg, JJonahJackalope, CC BY-SA 4.0 (two
 *    faces, granite base)
 *  - Stottroof.jpg, JakeSmallz, CC BY-SA 4.0 (crown close-up: pinnacles,
 *    banding, arched top windows)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the lidar returns on the crown are patchy, so each tier's plan
 * is read from the few returns plus the photos; the setbacks are drawn
 * symmetric. The south and east faces below the Cunningham building
 * (16-25 m) are drawn plain.
 *
 * Left out: the brick and terracotta banding of the crown (drawn as a few
 * pale bands), the polychrome spandrels, mullions.
 *
 * Helpers `pier`, `band` come from det-book-tower.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, rect, save, spire, walls, type XY } from './chi-aon-center'
import { notched } from './chi-board-of-trade'
import { band } from './det-book-tower'

const HX = 13.8, HY = 10.6
const BASE = 16

/** Window columns on every edge of ring r at least minLen long. */
function columns(p: Part, r: XY[], groups: [number, number][], pitch: number, w: number, minLen = 4, skip?: (a: XY, b: XY) => boolean) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen || skip?.(a, b)) continue
    const n = Math.max(1, Math.floor((L - 1.6) / pitch)), first = (L - (n - 1) * pitch) / 2
    for (let k = 0; k < n; k++) for (const [z0, z1] of groups) panel(p, a, b, first + k * pitch - w / 2, first + k * pitch + w / 2, z0, z1, 0.05)
  }
}

/** Pinnacles: small square shafts with pyramid caps at every convex corner of ring r, and `mid` more along long edges. */
function pinnacles(p: Part, r: XY[], z: number, h: number, s = 0.7, midEvery = 0) {
  const spots: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[(i - 1 + r.length) % r.length], c = r[i], b = r[(i + 1) % r.length]
    const cr = (c[0] - a[0]) * (b[1] - c[1]) - (c[1] - a[1]) * (b[0] - c[0])
    if (cr > 0) spots.push(c)
    if (midEvery > 0) {
      const L = Math.hypot(b[0] - c[0], b[1] - c[1]), n = Math.floor(L / midEvery)
      for (let k = 1; k < n; k++) spots.push([c[0] + (b[0] - c[0]) * k / n, c[1] + (b[1] - c[1]) * k / n])
    }
  }
  const ctr: XY = [r.reduce((t, q) => t + q[0], 0) / r.length, r.reduce((t, q) => t + q[1], 0) / r.length]
  for (const q of spots) {
    // pull the pinnacle inward so it stands on the wall head, not past it
    const dx = ctr[0] - q[0], dy = ctr[1] - q[1], l = Math.hypot(dx, dy) || 1
    const cx = q[0] + (dx / l) * s * 1.2, cy = q[1] + (dy / l) * s * 1.2
    const sq = rect(cx - s, cy - s, cx + s, cy + s)
    walls(p, sq, z, z + h * 0.6)
    spire(p, sq, z + h * 0.6, [cx, cy, z + h])
  }
}

function build() {
  const brick = new Part(), trim = new Part(), granite = new Part(), win = new Part(), roof = new Part(), door = new Part()

  const shaft = rect(-HX, -HY, HX, HY)
  // tiers: ring, top
  const tiers: [XY[], number][] = [
    [notched(-HX, -HY, HX, HY, 1.4), 91],
    [notched(-HX + 0.7, -HY + 0.5, HX - 0.7, HY - 0.5, 3.0), 101.5],
    [notched(-11.8, -9.6, 11.8, 9.6, 2.6), 115],
    [notched(-9.6, -8.2, 9.6, 8.2, 2.2), 122.5],
    [notched(-5.3, -5.3, 5.3, 5.3, 1.0), 133.1],
  ]

  // ---- granite base and the shaft
  walls(granite, shaft, 0, BASE)
  band(trim, roof, shaft, BASE - 0.6, BASE + 0.4, 0.25)
  walls(brick, tiers[0][0], BASE + 0.4, 91 - 1.0)
  // the notch at the corners below BASE is filled by the granite box; above it the corners are notched piers
  cap(roof, rect(-HX, -HY, HX, HY), BASE + 0.4)
  for (let i = 0; i < tiers.length; i++) {
    const [r, top] = tiers[i]
    const bottom = i === 0 ? BASE + 0.4 : tiers[i - 1][1]
    if (i > 0) walls(brick, r, bottom, top - 1.0)
    // pale terracotta head band and coping
    walls(trim, r, top - 1.0, top - 0.3)
    walls(trim, r, top - 0.3, top, inset(r, 0.3))
    cap(roof, inset(r, 0.3), top)
    // a pale band a storey down on the crown tiers
    if (i > 0) for (let zb = bottom + 6.6; zb < top - 2.5; zb += 7.2) walls(trim, inset(r, -0.06), zb, zb + 0.6)
    pinnacles(trim, inset(r, 0.0), top, i === tiers.length - 1 ? 3.6 : 2.8, 0.55, i === tiers.length - 1 ? 3.4 : 5.5)
  }

  // ---- windows: three storeys (3.5 m) to a panel on the shaft
  const shaftGroups: [number, number][] = []
  for (let z = BASE + 1.6; z + 8.6 < 89.6; z += 10.5) shaftGroups.push([z, z + 8.6])
  columns(win, tiers[0][0], shaftGroups, 2.75, 1.05, 6)
  for (let i = 1; i < tiers.length; i++) {
    const [r, top] = tiers[i], bottom = tiers[i - 1][1]
    const g: [number, number][] = []
    for (let z = bottom + 0.6; z + 2.5 < top - 1.4; z += 7.2) g.push([z, Math.min(z + 5.6, top - 1.6)])
    if (g.length) columns(win, r, g, 2.75, 1.25, 5)
  }
  // ---- the base: tall arches on Griswold (west face) and State (north face)
  const fronts: [XY, XY][] = [[[-HX, HY], [-HX, -HY]], [[HX, HY], [-HX, HY]]]
  for (const [a, b] of fronts) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 4.4), pitch = L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * pitch
      panel(win, a, b, c - 1.2, c + 1.2, 1.0, 10.5, 0.05)
      // round head
      const seg = 8, r = 1.2, zs = 10.5
      const L2 = L, u: XY = [(b[0] - a[0]) / L2, (b[1] - a[1]) / L2], nn: XY = [u[1], -u[0]]
      const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * 0.05, a[1] + u[1] * s + nn[1] * 0.05, z]
      for (let q = 0; q < seg; q++) {
        const t0 = (q / seg) * Math.PI, t1 = ((q + 1) / seg) * Math.PI
        win.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
      }
      panel(win, a, b, c - 0.8, c + 0.8, 12.6, 15.0, 0.05)
    }
  }
  // the main entrance, on Griswold
  panel(door, [-HX, HY], [-HX, -HY], 8.6, 12.6, 0, 4.2, 0.08)

  // Night: the crown floodlit.
  const flood = (p: V3, n: V3) => (p[2] < 88 ? 0 : n[2] > 0.7 ? 0.2 : 0.6 + 0.4 * Math.min(1, (p[2] - 88) / 40))
  return [
    { part: brick, material: { ...finish('stott-brick', 0xd99572), floodlight: flood } },
    { part: trim, material: { ...finish('stott-terracotta', 0xf2dfc6), floodlight: flood } },
    { part: granite, material: finish('stott-granite', 0x86766f) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-david-stott-building', 'David Stott Building', [42.3324349, -83.0485357], 328.7, build(), 5000)
