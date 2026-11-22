/**
 * The Portland Building (Michael Graves, 1982), with Portlandia (Raymond
 * Kaskey, 1985), Portland, Oregon — original procedural geometry, CC0-1.0.
 * bun generators/pdx-portland-building.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.6786909, 45.5156671) on the lowest ground
 * under the footprint (the 4th Avenue side). Built in the street grid's
 * frame: x runs along Main and Madison streets (west = SW 5th Avenue, east =
 * SW 4th Avenue), y along the avenues; placement bearing 20.7°.
 *
 * This is the building as it stands after the 2017-2020 reclad (DLR Group):
 * the same composition, with the cream now a light panel, the base a lighter
 * teal, the ribbons a pale blue and the keystone banded with ribbon windows.
 *
 * Form: a cream cube on a two-step teal base. On the 5th and 4th Avenue
 * faces, a dark glass field between and around two terracotta pilasters,
 * their flared capitals, and over them a terracotta keystone that widens up
 * to the cornice, banded with ribbon windows, with a pair of salmon piers
 * rising through the roofline at its middle. On the Main and Madison faces, a
 * terracotta field of fluted piers and glass bays under a pale-blue ribbon
 * with four medallions. A pale-blue frieze under the cornice, a set-back
 * roof rim and a penthouse. Portlandia kneels over the 5th Avenue entrance,
 * reaching down with her right hand and holding her trident in her left.
 *
 * Sources
 * - OSM: outline way/141453092 (building, height 70, 15 levels); no parts.
 * - Lidar (measured, USGS 3DEP OR_OLCMetro_2019, above the lowest ground,
 *   the 4th Avenue sidewalk): lower base tier 8.9 m, upper base tier 13.2 m;
 *   tower 48 x 50 m, cornice 59.0 m; roof rim (set back ~2 m) 62 m; penthouse
 *   67 and 68.8 m, plant 65 m; capitals' tops 42.0 m, about 6 m wide at
 *   y = ±7, projecting ~1.5 m; the salmon piers 63 m at y = ±4 with the
 *   keystone's notch between them at 55 m; Portlandia's protective box
 *   (she was boxed during the reclad) 25-27 m, y -6..+5, 4-5 m deep. The 5th
 *   Avenue sidewalk is ~2.5 m above the 4th Avenue one. The flight was during
 *   the reclad: a tower crane (88-96 m) and a hoist or scaffold on the 4th
 *   Avenue face (~25 m) are ignored.
 * - Published: 15 storeys, about 62 m (Wikipedia, "Portland Building");
 *   Portlandia 34 ft 9 in (10.6 m) kneeling, hammered copper (Wikipedia,
 *   "Portlandia").
 * - Photos (Wikimedia Commons, all CC BY-SA 4.0 or 3.0, Steve Morgan):
 *   "Portland Building after its 2017-2020 renovation - from SW in June 2021"
 *   https://commons.wikimedia.org/wiki/File:Portland_Building_after_its_2017-2020_renovation_-_from_SW_in_June_2021.jpg
 *   (CC BY-SA 4.0; colours, base, Madison face, ribbon, capitals);
 *   "Upper exterior of the Portland Building in 2021, post-renovation"
 *   https://commons.wikimedia.org/wiki/File:Upper_exterior_of_the_Portland_Building_in_2021,_post-renovation.jpg
 *   (CC BY-SA 4.0; keystone, ribbon windows, salmon piers, frieze);
 *   "Portland Building 1982"
 *   https://commons.wikimedia.org/wiki/File:Portland_Building_1982.jpg
 *   (CC BY-SA 3.0; the composition as built: keystone width, four
 *   medallions, field widths).
 * Estimated: field and keystone widths and the medallion spacing (from the
 *   photos, scaled to the lidar tower); floor height (46 m over 12 storeys);
 *   the base arcade's bay rhythm (SW photo); Portlandia's pose, from the
 *   published figure and her lidar box, as a bold simple figure.
 * Simplified: the small square punched windows (one per bay per storey) are
 *   drawn two storeys by two bays to a square panel, so the cream face keeps
 *   its grid of dark squares without a per-floor dot grid; the ribbon's
 *   zigzag is drawn straight; the medallions are two stacked discs.
 * Doubts: no licensed photo of the 4th Avenue (east) or Main Street (north)
 *   faces was found; they mirror the west and south, as Graves designed them.
 *   No licensed close photo of Portlandia was fetched (Commons rate-limited);
 *   her pose is from the published description.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capRing, ccw, chamfer, finishGlb } from './sea-rainier-square-tower'

const HX = 24.05, HY = 25.0 // tower half-extents
const Z = { l1: 8.9, l2: 13.2, cornice: 59.0, rim: 62.0, cap: 42.0, capLo: 37.6, keyTop: 57.5 }
const FLOOR = (Z.cornice - Z.l2) / 12
/** Sidewalk height at x: the 5th Avenue side is ~2.5 m above the 4th. */
const ground = (x: number) => Math.max(0, 1.45 - 0.043 * x)

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const avg = (ps: V3[]): V3 => [0, 1, 2].map((k) => ps.reduce((s, p) => s + p[k], 0) / ps.length) as V3

/** A flat convex polygon, wound to face away from `inside`. */
function poly(part: Part, pts: V3[], inside: V3) {
  let n = unit(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])))
  if (dot3(n, sub3(avg(pts), inside)) < 0) n = [-n[0], -n[1], -n[2]]
  for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A closed solid from two matching rings (bottom, top), each convex. */
function solid(part: Part, bot: V3[], top: V3[], caps = [true, true]) {
  const c = avg([...bot, ...top]), n = bot.length
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; poly(part, [bot[i], bot[j], top[j], top[i]], c) }
  if (caps[0]) poly(part, bot, c)
  if (caps[1]) poly(part, top, c)
}
/** A square-section beam from a to b. */
function beam(part: Part, a: V3, b: V3, w: number, h = w) {
  const d = unit(sub3(b, a))
  let s = cross3(d, [0, 0, 1])
  if (Math.hypot(...s) < 1e-3) s = [1, 0, 0]
  s = unit(s)
  const u = cross3(s, d)
  const ring = (p: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [0, 1, 2].map((k) => p[k] + s[k] * i * w / 2 + u[k] * j * h / 2) as V3)
  solid(part, ring(a), ring(b))
}
/** Rings of an upright body: [cx, cy, z, rx, ry], `n` sides. */
function body(part: Part, rings: [number, number, number, number, number][], n = 8) {
  const R = rings.map(([cx, cy, z, rx, ry]) => Array.from({ length: n }, (_, i) => {
    const a = ((i + 0.5) / n) * 2 * Math.PI
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), z] as V3
  }))
  const c = avg(R.flat())
  for (let k = 0; k < R.length - 1; k++)
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; poly(part, [R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]], c) }
  poly(part, R[0], c)
  poly(part, R[R.length - 1], c)
}

// --- the four tower faces: a point at (u along the face, z, o out from it)
type Face = 'W' | 'E' | 'S' | 'N'
const FACES: Record<Face, { base: V3; F: V3; U: V3 }> = {
  W: { base: [-HX, 0, 0], F: [-1, 0, 0], U: [0, 1, 0] },
  E: { base: [HX, 0, 0], F: [1, 0, 0], U: [0, 1, 0] },
  S: { base: [0, -HY, 0], F: [0, -1, 0], U: [1, 0, 0] },
  N: { base: [0, HY, 0], F: [0, 1, 0], U: [1, 0, 0] },
}
const at = (f: Face, u: number, z: number, o: number): V3 => {
  const { base, F, U } = FACES[f]
  return [base[0] + F[0] * o + U[0] * u, base[1] + F[1] * o + U[1] * u, z]
}
/** A flat panel on a face, `o` out from it. */
function panel(part: Part, f: Face, u0: number, u1: number, z0: number, z1: number, o = 0.05) {
  const n = FACES[f].F, a = at(f, u0, z0, o), b = at(f, u1, z0, o), c = at(f, u1, z1, o), d = at(f, u0, z1, o)
  part.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  part.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
/** A convex (u, z) outline extruded out of a face from o0 to o1 (no back). */
function relief(part: Part, f: Face, outline: [number, number][], o0: number, o1: number) {
  solid(part, outline.map(([u, z]) => at(f, u, z, o0)), outline.map(([u, z]) => at(f, u, z, o1)), [false, true])
}
const disc = (cu: number, cz: number, r: number, n = 12): [number, number][] =>
  Array.from({ length: n }, (_, i) => [cu + r * Math.cos((i / n) * 2 * Math.PI), cz + r * Math.sin((i / n) * 2 * Math.PI)])
const rectUZ = (u0: number, u1: number, z0: number, z1: number): [number, number][] => [[u0, z0], [u1, z0], [u1, z1], [u0, z1]]

function build() {
  const cream = new Part(), teal = new Part(), terra = new Part(), win = new Part(), blue = new Part(), copper = new Part()
  const rect = (hx: number, hy: number, cx = 0, cy = 0): XY[] => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]
  const prism = (wall: Part, roof: Part | null, ring: XY[], z0: number, z1: number, c = 0.45) => {
    const r = chamfer(ccw(ring), c)
    wall.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
    if (roof) capRing(roof, r, z1)
  }

  // ---------------------------------------------------------------- base
  // the lower tier is the OSM outline; the upper tier and tower from lidar
  const L1 = { hx: 29.1, hy: 30.2 }, L2 = { hx: 27.2, hy: 28.5 }
  prism(teal, teal, rect(L1.hx, L1.hy), 0, Z.l1)
  prism(teal, teal, rect(L2.hx, L2.hy), Z.l1, Z.l2)
  // street arcade: dark openings under terracotta lintels, round all four sides
  const sides: { len: number; pt: (u: number, z: number, o: number) => V3; n: V3; gx: (u: number) => number }[] = [
    { len: L1.hy, pt: (u, z, o) => [-L1.hx - o, u, z], n: [-1, 0, 0], gx: () => ground(-L1.hx) },
    { len: L1.hy, pt: (u, z, o) => [L1.hx + o, u, z], n: [1, 0, 0], gx: () => ground(L1.hx) },
    { len: L1.hx, pt: (u, z, o) => [u, -L1.hy - o, z], n: [0, -1, 0], gx: (u) => ground(u) },
    { len: L1.hx, pt: (u, z, o) => [u, L1.hy + o, z], n: [0, 1, 0], gx: (u) => ground(u) },
  ]
  const quadAt = (part: Part, s: (typeof sides)[0], u0: number, u1: number, z0: number, z1: number, o = 0.05) => {
    const a = s.pt(u0, z0, o), b = s.pt(u1, z0, o), c = s.pt(u1, z1, o), d = s.pt(u0, z1, o)
    part.tri(a, b, c, undefined, undefined, undefined, [s.n, s.n, s.n])
    part.tri(a, c, d, undefined, undefined, undefined, [s.n, s.n, s.n])
  }
  for (const s of sides) {
    const usable = 2 * s.len - 3.0, pitch = 5.4, w = 4.0
    const nb = Math.floor((usable + (pitch - w)) / pitch), start = -((nb - 1) * pitch) / 2
    for (let k = 0; k < nb; k++) {
      const c = start + k * pitch, g = s.gx(c)
      quadAt(win, s, c - w / 2, c + w / 2, Math.max(0, g - 0.3), g + 3.6)
      quadAt(terra, s, c - w / 2, c + w / 2, g + 3.6, g + 5.2)
    }
  }
  // the upper tier's square windows, in threes near each corner (SW photo)
  const tierSides: { len: number; pt: (u: number, z: number, o: number) => V3; n: V3; skipMid?: boolean }[] = [
    { len: L2.hy, pt: (u, z, o) => [-L2.hx - o, u, z], n: [-1, 0, 0], skipMid: true },
    { len: L2.hy, pt: (u, z, o) => [L2.hx + o, u, z], n: [1, 0, 0] },
    { len: L2.hx, pt: (u, z, o) => [u, -L2.hy - o, z], n: [0, -1, 0] },
    { len: L2.hx, pt: (u, z, o) => [u, L2.hy + o, z], n: [0, 1, 0] },
  ]
  for (const s of tierSides)
    for (const c of [-(s.len - 6.5), 0, s.len - 6.5]) {
      if (c === 0 && s.skipMid) continue
      for (const d of [-2.4, 0, 2.4]) quadAt(win, s as any, c + d - 0.75, c + d + 0.75, 10.3, 11.8)
    }

  // ---------------------------------------------------------------- tower
  prism(cream, null, rect(HX, HY), Z.l2, Z.cornice, 0.5)
  // set-back roof rim, penthouse and plant
  prism(cream, cream, rect(HX - 2, HY - 2), Z.cornice - 0.5, Z.rim)
  prism(cream, cream, [[-18, -11], [-6.5, -11], [-6.5, 11], [-18, 11]], Z.rim, 67.0)
  prism(cream, cream, [[-6.5, -14.5], [5.5, -14.5], [5.5, 14.5], [-6.5, 14.5]], Z.rim, 68.8)
  prism(cream, cream, [[6.5, -10], [15.5, -10], [15.5, 10], [6.5, 10]], Z.rim, 65.3)
  // the cornice ledge round the roof rim
  capRing(cream, chamfer(ccw(rect(HX, HY)), 0.5), Z.cornice)

  // pale-blue frieze of squares under the cornice, drawn as one band
  for (const f of ['W', 'E', 'S', 'N'] as Face[]) {
    const h = f === 'W' || f === 'E' ? HY : HX
    panel(blue, f, -h + 0.6, h - 0.6, 57.9, 58.6, 0.06)
  }

  // ---- 5th and 4th Avenue faces: glass field, pilasters, capitals, keystone
  const keyHalf = (z: number) => 10.2 + ((z - Z.cap) / (Z.keyTop - Z.cap)) * (20.5 - 10.2)
  for (const f of ['W', 'E'] as Face[]) {
    panel(win, f, -12, 12, Z.l2 + 0.3, Z.cap, 0.04)
    for (const c of [-7, 7]) {
      relief(terra, f, rectUZ(c - 2.4, c + 2.4, Z.l2, Z.capLo), 0, 0.45)
      // two flutes on each pilaster, three storeys to a panel
      for (let z = Z.l2; z < Z.capLo - 2; z += 3 * FLOOR) {
        const z0 = z + 0.8, z1 = Math.min(z + 3 * FLOOR - 0.5, Z.capLo - 0.6)
        for (const d of [-1.3, 1.3]) panel(win, f, c + d - 0.5, c + d + 0.5, z0, z1, 0.5)
      }
      // the flared capital: narrow and shallow at the foot, wide and deep at the top
      solid(terra,
        [at(f, c - 2.4, Z.capLo, 0), at(f, c + 2.4, Z.capLo, 0), at(f, c + 2.4, Z.capLo, 0.6), at(f, c - 2.4, Z.capLo, 0.6)],
        [at(f, c - 3.2, Z.cap, 0), at(f, c + 3.2, Z.cap, 0), at(f, c + 3.2, Z.cap, 1.7), at(f, c - 3.2, Z.cap, 1.7)])
    }
    // the keystone, widening up to the frieze, with four ribbon windows
    relief(terra, f, [[-10.2, Z.cap], [10.2, Z.cap], [20.5, Z.keyTop], [-20.5, Z.keyTop]], 0, 0.25)
    for (let k = 0; k < 4; k++) {
      const z0 = Z.cap + 1.2 + k * FLOOR, z1 = z0 + 1.5, hw = keyHalf(z0) - 1.2
      if (k === 3) { // the middle is taken by the salmon piers
        panel(win, f, -hw, -5.6, z0, z1, 0.3)
        panel(win, f, 5.6, hw, z0, z1, 0.3)
      } else panel(win, f, -hw, hw, z0, z1, 0.3)
    }
    // the pair of salmon piers at the keystone's top, rising through the roofline
    // (two stout piers, stepped back at the top, as in the 2021 photo)
    for (const s of [-1, 1]) {
      const u0 = s > 0 ? 2.6 : -5.2, u1 = s > 0 ? 5.2 : -2.6
      relief(terra, f, rectUZ(u0, u1, 52.5, 61.2), 0, 1.0)
      relief(terra, f, rectUZ(u0 + 0.5, u1 - 0.5, 61.2, 62.8), -1.0, 0.5)
    }
  }

  // ---- Main and Madison faces: terracotta field and the pale-blue ribbon
  const FIELD = 15, FIELD_TOP = 48.6
  const fluted = [-12.75, -4.25, 4.25, 12.75]
  for (const f of ['S', 'N'] as Face[]) {
    panel(terra, f, -FIELD, FIELD, Z.l2, FIELD_TOP, 0.04)
    for (let z = Z.l2; z < 40; z += 3 * FLOOR) {
      const z0 = z + 0.6, z1 = Math.min(z + 3 * FLOOR - 0.4, 39.4)
      if (z1 - z0 < 1.5) continue
      for (const c of fluted) for (const d of [-1.45, 0, 1.45]) panel(win, f, c + d - 0.36, c + d + 0.36, z0, z1, 0.09)
      for (const c of [-8.5, 0, 8.5]) panel(win, f, c - 1.6, c + 1.6, z0, z1, 0.09)
    }
    // a window row in the field over the ribbon, between the medallions
    for (const c of [-8.5, 0, 8.5]) panel(win, f, c - 2.2, c + 2.2, 45.0, 47.6, 0.09)
    // ribbon, medallions and the bows under them
    relief(blue, f, rectUZ(-FIELD + 0.3, FIELD - 0.3, 40.5, 41.9), 0.04, 0.6)
    for (const c of fluted) {
      relief(blue, f, disc(c, 44.2, 2.35), 0.04, 0.55)
      relief(blue, f, disc(c, 44.2, 1.0, 8), 0.55, 0.85)
      relief(blue, f, [[c - 1.4, 40.5], [c + 1.4, 40.5], [c, 38.4]], 0.04, 0.6)
    }
  }

  // ---- cream punched windows, two storeys by two bays to a square panel
  for (const f of ['W', 'E', 'S', 'N'] as Face[]) {
    for (let k = 0; k < 6; k++) {
      const zc = Z.l2 + FLOOR * (2 * k + 1), h = 1.25
      for (const u of [-20.7, -13.8, -6.9, 0, 6.9, 13.8, 20.7]) {
        const au = Math.abs(u) - h
        if (f === 'W' || f === 'E') {
          if (au < 12.6 && zc - h < Z.cap + 0.5) continue
          if (zc + h > Z.cap - 0.5 && au < keyHalf(Math.min(zc + h, Z.keyTop)) + 0.6) continue
        } else if (au < FIELD + 0.6 && zc - h < FIELD_TOP) continue
        panel(win, f, u - h, u + h, zc - h, zc + h)
      }
    }
  }

  // ---------------------------------------------------------------- Portlandia
  // a teal ledge over the 5th Avenue entrance, and the kneeling figure facing
  // the street (-x): her left (south, -y) hand holds the trident, her right
  // reaches down and forward
  solid(teal, [[-29.8, -4.6, Z.l2 - 0.8], [-L2.hx, -4.6, Z.l2 - 0.8], [-L2.hx, 4.6, Z.l2 - 0.8], [-29.8, 4.6, Z.l2 - 0.8]].map((p) => p as V3),
    [[-29.8, -4.6, 14.4], [-HX, -4.6, 14.4], [-HX, 4.6, 14.4], [-29.8, 4.6, 14.4]].map((p) => p as V3))
  const z0 = 14.4
  body(copper, [
    [-26.9, 0, z0, 2.1, 2.5], [-26.7, 0, z0 + 2.2, 1.8, 2.1], [-26.4, 0, z0 + 4.2, 1.15, 1.35],
    [-26.6, 0, z0 + 6.2, 1.3, 1.6], [-26.8, 0, z0 + 7.3, 1.0, 1.85], [-26.9, 0, z0 + 7.8, 0.45, 0.45],
  ])
  body(copper, [
    [-27.0, 0, z0 + 7.75, 0.5, 0.5], [-27.1, 0, z0 + 8.2, 0.8, 0.75], [-27.15, 0, z0 + 8.9, 0.85, 0.8],
    [-27.05, 0, z0 + 9.6, 0.6, 0.6], [-26.9, 0, z0 + 10.0, 0.25, 0.25],
  ])
  // right knee raised forward, foot on the ledge
  beam(copper, [-26.6, 1.2, z0 + 2.0], [-29.0, 1.2, z0 + 2.4], 1.5, 1.6)
  beam(copper, [-29.0, 1.2, z0 + 2.9], [-29.0, 1.2, z0], 1.2)
  // left arm and the trident
  beam(copper, [-26.8, -1.6, z0 + 7.1], [-27.0, -2.7, z0 + 5.6], 0.75)
  beam(copper, [-27.0, -2.7, z0 + 5.6], [-27.6, -3.8, z0 + 6.5], 0.7)
  beam(copper, [-27.7, -4.1, z0], [-27.7, -4.1, z0 + 12.9], 0.32)
  beam(copper, [-27.7, -5.1, z0 + 11.1], [-27.7, -3.1, z0 + 11.1], 0.3)
  for (const y of [-5.0, -3.2]) beam(copper, [-27.7, y, z0 + 11.0], [-27.7, y, z0 + 12.5], 0.26)
  // right arm reaching down and out over the street
  beam(copper, [-26.8, 1.7, z0 + 7.1], [-28.0, 2.6, z0 + 5.6], 0.75)
  beam(copper, [-28.0, 2.6, z0 + 5.6], [-29.4, 3.2, z0 + 4.6], 0.7)
  beam(copper, [-29.4, 3.2, z0 + 4.7], [-30.1, 3.4, z0 + 4.3], 0.6, 0.85)

  const lit = (p: V3, n: V3) => 0.95 - 0.35 * Math.max(0, n[2])
  return finishGlb('pdx-portland-building', 'The Portland Building', [
    { part: cream, material: finish('pb-cream', 0xe9dcc3) },
    { part: teal, material: finish('pb-teal', 0x5e9ea6) },
    { part: terra, material: finish('pb-terracotta', 0xa95f50) },
    { part: win, material: PALETTE.window },
    { part: blue, material: finish('pb-blue', 0xa7c7dc) },
    { part: copper, material: { ...finish('pb-portlandia', 0x9c8160), floodlight: lit } as ReturnType<typeof finish> },
  ], { bearing: 20.7, height: 68.8, replaces: ['way/141453092'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/pdx-portland-building.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
