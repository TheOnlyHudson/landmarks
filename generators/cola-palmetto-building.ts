/**
 * Palmetto Building, Columbia, SC (1913, Julius Harder; now the Sheraton
 * Columbia Downtown) — original procedural geometry, CC0-1.0.
 * bun generators/cola-palmetto-building.ts
 *
 * Also exports the small wall-panel helpers the other cola-* models of
 * this builder use (rectOn, archOn, discOn, hip, gable).
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 70 (+y toward 70°, along Washington Street; +x
 * toward 160°). Anchor = centroid of OSM way/329094459 ("Palmetto
 * Building", building=hotel, 15 levels), 34.004241, -81.034509.
 *
 * Identity: a slim fifteen-storey tower of cream terra cotta: a two-storey
 * base, a shaft of paired windows between broad piers, a top of tall
 * two-storey round-arched windows over a corbelled string course, an attic
 * storey, and a heavy, deeply projecting dark green cornice.
 *
 * Evidence:
 *  - plan: OSM way/329094459 (x -8.8..7.4, with a 3 m bump on the
 *    Washington side). The 2019 lidar puts the Washington face at x ≈ 9
 *    along its whole length, so the plan is drawn as one rectangle
 *    x -8.8..9.0, y -16.6..17.3.
 *  - heights: USGS 3DEP SC_SavannahPeeDee_5_2019 (2019 flight), 0.5 m
 *    grid. Measured: roof 55.6–56.9 m at the edges (cornice top ~57 m), a
 *    raised roof block 59–60 m set back from the edges, and a penthouse
 *    64–66 m near the west end (x -7..-2, y -10..-7). 15 floors published
 *    (NRHP/HABS SC-905).
 *  - storey bands (base to ~9 m, arcade storeys ~45–52.5 m, attic to
 *    ~55 m), bay counts (seven bays on the long faces: single-window end
 *    bays and five paired bays; five arches on top) from Milligan's photo
 *    of the long face and Boucher's HABS view; on the short faces three
 *    arches and paired bays between single end bays (HABS view).
 *  - colour: cream-grey terra cotta (both photos), the cornice near-black
 *    green (Milligan), pulled light to a muted verdigris.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Palmetto Building; Columbia, South Carolina; February 21, 2016.jpg,
 *    Stephen Matthew Milligan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Palmetto_Building;_Columbia,_South_Carolina;_February_21,_2016.jpg
 *  - Palmetto Building, 1400 Main Street at Washington Street, Columbia
 *    (Richland County, South Carolina).jpg, Jack Boucher (HABS), public domain
 *    https://commons.wikimedia.org/wiki/File:Palmetto_Building,_1400_Main_Street_at_Washington_Street,_Columbia_(Richland_County,_South_Carolina).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north and west faces are only seen at an angle; the base's
 * arched shopfronts, the corbels and the cornice's modillions are left out;
 * the roof block and penthouse are boxes at their lidar heights.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, cornice, prism, save, type XY } from './atl-flatiron-building'

// ───────────────────────────── shared helpers ─────────────────────────────

/** A point s metres along wall a→b at height z, `out` metres outside it (the outside is right of a→b, as on a counter-clockwise ring). */
export function onWall(a: XY, b: XY, s: number, z: number, out = 0.06): V3 {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
  return [a[0] + tx * s + ty * out, a[1] + ty * s - tx * out, z]
}

/** A flat rectangle on a wall, from s0 to s1 along it and z0 to z1. */
export function rectOn(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  p.quad(onWall(a, b, s0, z0, out), onWall(a, b, s1, z0, out), onWall(a, b, s1, z1, out), onWall(a, b, s0, z1, out))
}

/** A round-headed (semicircular) panel on a wall; its head springs at z1 - half the width. */
export function archOn(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06, seg = 10) {
  const r = (s1 - s0) / 2, sm = (s0 + s1) / 2, zs = z1 - r
  if (zs > z0) rectOn(p, a, b, s0, s1, z0, zs, out)
  const c = onWall(a, b, sm, zs, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(c, onWall(a, b, sm + r * Math.cos(t0), zs + r * Math.sin(t0), out), onWall(a, b, sm + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A round window (oculus) on a wall. */
export function discOn(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 12) {
  const c = onWall(a, b, s, z, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, onWall(a, b, s + r * Math.cos(t0), z + r * Math.sin(t0), out), onWall(a, b, s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

/** A hipped roof over an axis-aligned rectangle, from eaves at z0 to a ridge at z0 + h. */
export function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const w = x1 - x0, l = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (l >= w) {
    const r0: V3 = [cx, y0 + w / 2, z0 + h], r1: V3 = [cx, y1 - w / 2, z0 + h]
    p.tri(A, B, r0); p.tri(C, D, r1); p.quad(B, C, r1, r0); p.quad(D, A, r0, r1)
  } else {
    const r0: V3 = [x0 + l / 2, cy, z0 + h], r1: V3 = [x1 - l / 2, cy, z0 + h]
    p.tri(B, C, r1); p.tri(D, A, r0); p.quad(A, B, r1, r0); p.quad(C, D, r0, r1)
  }
}

/**
 * A triangular pediment standing on a wall a→b between s0 and s1, base at
 * z0, apex at z0 + h, `depth` metres thick back into the building and
 * `out` metres proud of the wall.
 */
export function gable(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, h: number, depth: number, out = 0.3) {
  const sm = (s0 + s1) / 2
  const f = [onWall(a, b, s0, z0, out), onWall(a, b, s1, z0, out), onWall(a, b, sm, z0 + h, out)]
  const k = [onWall(a, b, s0, z0, -depth), onWall(a, b, s1, z0, -depth), onWall(a, b, sm, z0 + h, -depth)]
  p.tri(f[0], f[1], f[2])
  p.tri(k[1], k[0], k[2])
  p.quad(f[1], k[1], k[2], f[2])
  p.quad(k[0], f[0], f[2], k[2])
}

// ───────────────────────────── the Palmetto ──────────────────────────────

if (import.meta.main) {
  const tc = new Part(), trim = new Part(), win = new Part(), arch = new Part(), roof = new Part(), cor = new Part()

  // Walls: the lidar's cornice outline (x -8.3..9.0, y -17.2..13.5) less
  // the cornice's 1 m projection.
  const X0 = -7.3, X1 = 8.0, Y0 = -16.2, Y1 = 12.5
  const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  const BASE = 9, SHAFT = 44.6, ARCH = 52.4, ATTIC = 54.6, TOP = 57.4

  // The low annex behind the tower's north-east end (inside the OSM outline).
  box(tc, X0, 7.4, Y1 - 0.5, 17.0, 0, 10.5, roof, 0.3)
  cornice(trim, [[X0 - 0.01, 12.4], [7.4, 12.4], [7.4, 17.0], [X0 - 0.01, 17.0]], 9.9, 0.5, 0.3, null)

  prism(tc, ring, 0, ATTIC, roof, 0.3)
  // String courses: over the base, the corbelled course under the arcade
  // (bold, it is what frames the top), and over the arcade.
  cornice(trim, ring, BASE - 0.4, 1.0, 0.4)
  cornice(trim, ring, SHAFT - 0.6, 1.2, 0.6)
  cornice(trim, ring, ARCH, 0.6, 0.3)
  // The crowning cornice: deep, heavy and dark.
  cornice(cor, ring, ATTIC - 0.6, TOP - ATTIC + 0.8, 1.5, roof)

  // Bays per face: narrow end bays with a single window, paired bays
  // between them (five on the long faces, two on the ends).
  type Bay = { s0: number; s1: number; pair: boolean }
  function bays(L: number, n: number, end: number): Bay[] {
    const mid = (L - 2 * end) / n, out: Bay[] = [{ s0: 0, s1: end, pair: false }]
    for (let i = 0; i < n; i++) out.push({ s0: end + i * mid, s1: end + (i + 1) * mid, pair: true })
    out.push({ s0: L - end, s1: L, pair: false })
    return out
  }
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bs = L > 20 ? bays(L, 5, 3.2) : bays(L, 3, 2.4)
    const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L, nx = ty, ny = -tx
    // Piers: raised strips between the bays up the shaft and the arcade, so
    // the tower reads vertical, as in the photos.
    for (let k = 1; k < bs.length; k++) {
      const s = bs[k].s0, h = 0.5
      const c: XY = [a[0] + tx * s, a[1] + ty * s]
      const px = [c[0] - tx * h, c[0] + tx * h, c[0] + tx * h + nx * 0.3, c[0] - tx * h + nx * 0.3]
      const py = [c[1] - ty * h, c[1] + ty * h, c[1] + ty * h + ny * 0.3, c[1] - ty * h + ny * 0.3]
      box(tc, Math.min(...px), Math.max(...px), Math.min(...py), Math.max(...py), BASE + 0.6, ARCH, null, 0)
    }
    for (const { s0, s1, pair } of bs) {
      const end0 = s0 === 0, end1 = s1 >= L - 0.01
      const w0 = s0 + (end0 ? 1.2 : 0.55), w1 = s1 - (end1 ? 1.2 : 0.55)
      // Base: tall arched openings in the paired bays.
      if (pair) archOn(win, a, b, w0 + 0.3, w1 - 0.3, 1.0, BASE - 1.2)
      else rectOn(win, a, b, w0 + 0.2, w1 - 0.2, 1.0, BASE - 2.6)
      // Shaft: one panel per bay, two storeys tall.
      // Shaft: the paired windows as two narrow panels per bay, each two
      // storeys tall, so the shaft reads tall and vertical as in the photos.
      for (let z = BASE + 1.4; z < SHAFT - 2; z += 7.2) {
        const z1 = Math.min(z + 5.6, SHAFT - 1.4)
        if (pair) {
          const m = (w0 + w1) / 2
          rectOn(win, a, b, w0 + 0.3, m - 0.3, z, z1)
          rectOn(win, a, b, m + 0.3, w1 - 0.3, z, z1)
        } else rectOn(win, a, b, w0 + 0.35, w1 - 0.35, z, z1)
      }
      // The arcade: tall dark round-headed windows filling the paired bays.
      if (pair) archOn(arch, a, b, w0 + 0.05, w1 - 0.05, SHAFT + 0.8, ARCH - 0.1)
      else rectOn(win, a, b, w0 + 0.25, w1 - 0.25, SHAFT + 1.6, ARCH - 1.4)
      // Attic windows.
      rectOn(win, a, b, w0 + 0.5, w1 - 0.5, ARCH + 0.9, ATTIC - 0.8)
    }
  }

  // Roof: the raised block set back from the edges and the penthouse.
  box(roof, -6.0, 7.0, -12.0, 6.0, TOP - 0.3, 59.5, roof, 0.3)
  box(tc, -7.0, -2.0, -12.0, -6.4, 59.5, 65.5, roof, 0.3)

  await save('cola-palmetto-building', 'Palmetto Building', [
    { part: tc, material: finish('palmetto-terracotta', 0xe8dfcf) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: arch, material: windowVariant(2, 0x464e58) },
    { part: roof, material: PALETTE.roof },
    { part: cor, material: finish('palmetto-cornice', 0x4d5852) },
  ], { height: 65.5, anchor: [34.004241, -81.034509], bearing: 70 })
}
