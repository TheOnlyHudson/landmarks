/**
 * Bell Tower, Capitol Square, Richmond, Virginia (1824–25, the guardhouse
 * and alarm-bell tower of the Virginia Public Guard; now the Virginia
 * visitor centre) — original procedural geometry, CC0-1.0.
 * bun generators/ric-capitol-bell-tower.ts
 *
 * Also exports small shared helpers (slabOnWall, ellipsoid, limb) used by
 * ric-washington-monument.ts and ric-executive-mansion.ts; this model's own
 * build runs only under import.meta.main.
 *
 * Map frame: x, y, z up, metres, turned to bearing 37.6 (the walls of OSM
 * way/658620590 run at 37.6° / 127.6°): +y points 37.6° (north-east), +x
 * points 127.6° (south-east). Anchor = the outline's centroid,
 * -77.4352951, 37.5389514.
 *
 * Identity (from the photos below):
 *  1. A plain square red-brick tower in two stages over a low basement: a
 *     stone water table, a stone band where the upper stage steps in, and a
 *     white boxed cornice.
 *  2. On every face of the upper stage a tall round-headed blind arch
 *     between two broad brick pilasters, with a round oculus at the
 *     springing and a 6-over-6 window under it.
 *  3. On the roof, inside a white fretwork rail, an open white octagonal
 *     cupola of round arches with the bell hanging in it, under a pale
 *     green ribbed dome and a weathervane rod.
 *  4. The front door (green, with a transom) up a short flight of stone
 *     steps, on the side toward the square.
 *
 * Plan: OSM way/658620590, an 8.5 m square (published nowhere else); the
 * basement fills it (half 4.25), the lower stage is set in to half 4.05,
 * the upper stage's pilasters to half 3.65 and its arched recesses to 3.45
 * (ratios of stage widths from the Smash the Iron Cage and DougFrancis
 * photos, which look at the front square on).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame: ground 1.0 at the south-west wall to 1.8
 * at the north-east (so y = 0 is the south-west foot, the north-east foot
 * 0.8 higher); the roof deck 13.0 above y = 0 and the rail 14.1. Estimated from the photos, scaled to the 8.5 m
 * front: the water table (1.5 above the front ground), the stone band (5.5),
 * the pilaster caps and arch springing (9.9), the cornice (12.1–12.9), the
 * door, window and oculus, the cupola's stages (posts to 16.2, cornice to
 * 17.1, dome to 18.35) and the vane rod (to 19.7). The lidar's returns over
 * the cupola run 17.8–19.7, sparse; the dome is drawn a little lower, as
 * the photos' proportions show it.
 *
 * Front: the door is drawn on the south-east face (+x). The photos show the
 * Supreme Court of Virginia (north-west of the tower) straight behind it,
 * and the afternoon sun from the left; no photo names the side. Doubt.
 *
 * Photos (EVIDENCE):
 *  - Bell Tower, Richmond-1.jpg, Smash the Iron Cage, CC BY-SA 4.0 (front)
 *    https://commons.wikimedia.org/wiki/File:Bell_Tower,_Richmond-1.jpg
 *  - Bell Tower on Capitol Square, Richmond VA, DougFrancis, CC BY 2.0
 *    (front, two views) https://www.flickr.com/photos/39398106@N07/4113081607
 *    and https://www.flickr.com/photos/39398106@N07/4113849966
 *  - Capitol Square Bell Tower, Richmond, Virginia.jpg (1906 postcard,
 *    Jamestown Official Photo Corp.), VCU Libraries, public domain (the
 *    front and a side face: the side's blind arch and windows)
 *    https://commons.wikimedia.org/wiki/File:Capitol_Square_Bell_Tower,_Richmond,_Virginia.jpg
 * Facts: Virginia DHR 127-0121 ("a blind arch on each elevation and a
 * fanciful cupola"); the 2010 DAR plaque (completed 1825, guardhouse).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the back (north-west) and the side faces' lower windows are seen
 * in no modern photo; they repeat the postcard's side face. The cupola's
 * fretwork rail is drawn as a solid low white parapet.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, save } from './atl-flatiron-building'

// ───────────────────────────── shared helpers ─────────────────────────────

/**
 * A convex shape on a wall (as atl-tech-tower's onWall: the wall runs a→b
 * with its outside on the right, pts are [s, z]) given thickness: its face
 * stands `d1` off the wall and its sides run back to `d0`.
 */
export function slabOnWall(p: Part, a: XY, b: XY, pts: [number, number][], d0: number, d1: number) {
  onWall(p, a, b, pts, d1)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const P = ([s, z]: [number, number], d: number): V3 => [a[0] + t[0] * s + nn[0] * d, a[1] + t[1] * s + nn[1] * d, z]
  const ar = pts.reduce((acc, p0, i) => { const p1 = pts[(i + 1) % pts.length]; return acc + p0[0] * p1[1] - p1[0] * p0[1] }, 0)
  const q = ar < 0 ? [...pts].reverse() : pts
  for (let i = 0; i < q.length; i++) {
    const u = q[i], v = q[(i + 1) % q.length]
    const ds = v[0] - u[0], dz = v[1] - u[1], l = Math.hypot(ds, dz)
    if (l < 1e-6) continue
    const o = [dz / l, -ds / l] // outward in (s, z)
    const n: V3 = [t[0] * o[0], t[1] * o[0], o[1]]
    p.tri(P(u, d0), P(v, d0), P(v, d1), undefined, undefined, undefined, [n, n, n])
    p.tri(P(u, d0), P(v, d1), P(u, d1), undefined, undefined, undefined, [n, n, n])
  }
}

/** An ellipsoid at c with radii r, its long axis turned by `yaw` (radians, about z, from +y) and `pitch` (up from horizontal). */
export function ellipsoid(p: Part, c: V3, r: V3, yaw = 0, pitch = 0, nu = 10, nv = 6) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  // local frame: X side, Y forward (pitched up), Z up
  const ax: V3 = [cy, -sy, 0], ay: V3 = [sy * cp, cy * cp, sp], az: V3 = [-sy * sp, -cy * sp, cp]
  const W = (x: number, y: number, z: number): V3 => [c[0] + ax[0] * x + ay[0] * y + az[0] * z, c[1] + ax[1] * x + ay[1] * y + az[1] * z, c[2] + ax[2] * x + ay[2] * y + az[2] * z]
  const Nl = (x: number, y: number, z: number): V3 => {
    const v: V3 = [x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2])]
    const w: V3 = [ax[0] * v[0] + ay[0] * v[1] + az[0] * v[2], ax[1] * v[0] + ay[1] * v[1] + az[1] * v[2], ax[2] * v[0] + ay[2] * v[1] + az[2] * v[2]]
    const l = Math.hypot(...w) || 1
    return [w[0] / l, w[1] / l, w[2] / l]
  }
  const pt = (i: number, j: number): [V3, V3] => {
    const th = (j / nv) * Math.PI, ph = (i / nu) * Math.PI * 2
    const x = r[0] * Math.sin(th) * Math.cos(ph), y = r[1] * Math.sin(th) * Math.sin(ph), z = r[2] * Math.cos(th)
    return [W(x, y, z), Nl(x, y, z)]
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const [a, na] = pt(i, j), [b, nb] = pt(i + 1, j), [cc, nc] = pt(i + 1, j + 1), [d, nd] = pt(i, j + 1)
    if (j > 0) p.tri(a, d, b, undefined, undefined, undefined, [na, nd, nb])
    if (j < nv - 1) p.tri(b, d, cc, undefined, undefined, undefined, [nb, nd, nc])
  }
}

/** A tapered round (n-sided) limb from a (radius r0) to b (radius r1), capped at both ends. */
export function limb(p: Part, a: V3, b: V3, r0: number, r1: number, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const w: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const h: V3 = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u: V3 = [w[1] * h[2] - w[2] * h[1], w[2] * h[0] - w[0] * h[2], w[0] * h[1] - w[1] * h[0]]
  const lu = Math.hypot(...u); u = [u[0] / lu, u[1] / lu, u[2] / lu]
  const v: V3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]]
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, cs = Math.cos(t), sn = Math.sin(t)
    const nr: V3 = [u[0] * cs + v[0] * sn, u[1] * cs + v[1] * sn, u[2] * cs + v[2] * sn]
    return [[c[0] + nr[0] * r, c[1] + nr[1] * r, c[2] + nr[2] * r] as V3, nr] as [V3, V3]
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(A[i][0], A[j][0], B[j][0], undefined, undefined, undefined, [A[i][1], A[j][1], B[j][1]])
    p.tri(A[i][0], B[j][0], B[i][0], undefined, undefined, undefined, [A[i][1], B[j][1], B[i][1]])
  }
  const nb: V3 = [-w[0], -w[1], -w[2]]
  for (let i = 1; i < n - 1; i++) {
    p.tri(A[0][0], A[i][0], A[i + 1][0], undefined, undefined, undefined, [nb, nb, nb])
    p.tri(B[0][0], B[i][0], B[i + 1][0], undefined, undefined, undefined, [w, w, w])
  }
}

/** The four faces of a square of half-size h about the origin, each [a, b] with its outside on the right; +x first. */
export const squareFaces = (h: number): [XY, XY][] => [
  [[h, -h], [h, h]], [[h, h], [-h, h]], [[-h, h], [-h, -h]], [[-h, -h], [h, -h]],
]

// ──────────────────────────────── the tower ────────────────────────────────

if (import.meta.main) {
  const brick = new Part(), trim = new Part(), win = new Part(), dark = new Part(), dome = new Part()
  const FG = 0.4 // front (south-east) ground above y = 0
  const B0 = 4.25, B1 = 4.05, CORE = 3.45, PIL = 3.65
  const WT = FG + 1.5, BAND = FG + 5.5, IMP = FG + 9.5, COR = 12.1, DECK = 12.9

  // basement, water table, lower stage, band
  box(brick, -B0, B0, -B0, B0, 0, WT, null, 0)
  box(trim, -B0 - 0.06, B0 + 0.06, -B0 - 0.06, B0 + 0.06, WT, WT + 0.2, null, 0.06)
  box(brick, -B1, B1, -B1, B1, WT + 0.2, BAND, null, 0)
  box(trim, -B1 - 0.08, B1 + 0.08, -B1 - 0.08, B1 + 0.08, BAND, BAND + 0.25, trim, 0.08)
  // upper stage: the core with an arched recess on each face between pilasters
  box(brick, -CORE, CORE, -CORE, CORE, BAND + 0.25, COR, null, 0)
  const W = 2 * CORE, R = 1.45, SC = CORE // arch radius, centre along the face
  for (const [a, b] of squareFaces(CORE)) {
    const d = PIL - CORE
    slabOnWall(brick, a, b, rectShape(-d, SC - R, BAND + 0.25, COR), 0, d)
    slabOnWall(brick, a, b, rectShape(SC + R, W, BAND + 0.25, COR), 0, d)
    // pilaster caps at the springing
    slabOnWall(trim, a, b, rectShape(-d - 0.05, SC - R + 0.05, IMP, IMP + 0.18), d - 0.01, d + 0.07)
    slabOnWall(trim, a, b, rectShape(SC + R - 0.05, W + 0.05, IMP, IMP + 0.18), d - 0.01, d + 0.07)
    // spandrels over the arch: strips from the arch up to the cornice
    const n = 10
    for (let i = 0; i < n; i++) {
      const t0 = Math.PI - (i / n) * Math.PI, t1 = Math.PI - ((i + 1) / n) * Math.PI
      const p0: [number, number] = [SC + R * Math.cos(t0), IMP + 0.18 + R * Math.sin(t0)]
      const p1: [number, number] = [SC + R * Math.cos(t1), IMP + 0.18 + R * Math.sin(t1)]
      slabOnWall(brick, a, b, [p0, p1, [p1[0], COR], [p0[0], COR]], 0, d)
    }
    // the oculus at the springing and the window under it
    const ring = Array.from({ length: 12 }, (_, i) => [SC + 0.55 * Math.cos((i / 12) * Math.PI * 2), IMP + 0.05 + 0.55 * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(trim, a, b, ring, 0.04)
    onWall(win, a, b, ring.map(([s, z]) => [SC + (s - SC) * 0.75, IMP + 0.05 + (z - IMP - 0.05) * 0.75] as [number, number]), 0.07)
    onWall(trim, a, b, rectShape(SC - 0.62, SC + 0.62, FG + 6.0, FG + 8.15), 0.04)
    onWall(win, a, b, rectShape(SC - 0.5, SC + 0.5, FG + 6.12, FG + 8.0), 0.07)
  }
  // cornice and roof deck
  box(trim, -3.85, 3.85, -3.85, 3.85, COR, COR + 0.35, null, 0)
  box(trim, -4.15, 4.15, -4.15, 4.15, COR + 0.35, DECK, trim, 0.15, true)
  // the fretwork rail, drawn as a low white parapet
  for (const [x0, x1, y0, y1] of [[-3.0, 3.0, 2.86, 3.0], [-3.0, 3.0, -3.0, -2.86], [2.86, 3.0, -2.86, 2.86], [-3.0, -2.86, -2.86, 2.86]]) box(trim, x0, x1, y0, y1, DECK, DECK + 0.65, trim, 0)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(trim, sx * 2.93 - 0.12, sx * 2.93 + 0.12, sy * 2.93 - 0.12, sy * 2.93 + 0.12, DECK, DECK + 0.8, trim, 0.04)

  // lower stage: the front door with its transom and steps; windows on the other faces
  const faces = squareFaces(B1)
  {
    const [a, b] = faces[0]
    onWall(trim, a, b, rectShape(B1 - 0.85, B1 + 0.85, WT + 0.1, FG + 4.75), 0.04)
    onWall(dark, a, b, rectShape(B1 - 0.72, B1 + 0.72, WT + 0.1, FG + 4.0), 0.08)
    onWall(win, a, b, rectShape(B1 - 0.72, B1 + 0.72, FG + 4.1, FG + 4.62), 0.08)
    for (let k = 0; k < 6; k++) {
      const z = FG + (k + 1) * ((WT + 0.1 - FG) / 6), dx = 2.0 - k * 0.32
      box(trim, B0, B0 + dx, -0.95, 0.95, 0, z, trim, 0)
    }
  }
  for (const [a, b] of faces.slice(1)) {
    onWall(trim, a, b, rectShape(B1 - 0.6, B1 + 0.6, FG + 2.4, FG + 4.5), 0.04)
    onWall(win, a, b, rectShape(B1 - 0.48, B1 + 0.48, FG + 2.52, FG + 4.38), 0.07)
  }

  // ── the cupola ──
  const RC = 2.05, Z0 = DECK, P1 = 16.2, C1 = 17.1, n = 8, ph = Math.PI / 8
  const oct = (r: number): XY[] => Array.from({ length: n }, (_, i) => [r * Math.cos(ph + (i / n) * Math.PI * 2), r * Math.sin(ph + (i / n) * Math.PI * 2)] as XY)
  revolve(trim, [0, 0], [[RC + 0.15, Z0], [RC + 0.15, Z0 + 0.4], [RC - 0.05, Z0 + 0.4]], n, ph, true, false)
  revolve(trim, [0, 0], [[RC - 0.05, Z0 + 0.4], [0.01, Z0 + 0.4]], n, ph, true, false)
  const O = oct(RC)
  for (let i = 0; i < n; i++) {
    // corner posts
    const [x, y] = O[i], ang = Math.atan2(y, x)
    const c: V3 = [x - Math.cos(ang) * 0.18, y - Math.sin(ang) * 0.18, 0]
    box(trim, c[0] - 0.17, c[0] + 0.17, c[1] - 0.17, c[1] + 0.17, Z0 + 0.4, P1, null, 0)
    // round arch spandrels on each face, front and back
    const a = O[i], b = O[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), rr = (L - 0.5) / 2, sc = L / 2, zs = P1 - rr - 0.15
    for (let k = 0; k < 6; k++) {
      const t0 = Math.PI - (k / 6) * Math.PI, t1 = Math.PI - ((k + 1) / 6) * Math.PI
      const p0: [number, number] = [sc + rr * Math.cos(t0), zs + rr * Math.sin(t0)], p1: [number, number] = [sc + rr * Math.cos(t1), zs + rr * Math.sin(t1)]
      const pts: [number, number][] = [p0, p1, [p1[0], P1], [p0[0], P1]]
      slabOnWall(trim, a, b, pts, -0.3, 0)
      onWall(trim, b, a, pts.map(([s, z]) => [L - s, z] as [number, number]), 0.3) // the inner face
    }
  }
  // entablature, dome, finial
  revolve(trim, [0, 0], [[RC - 0.3, P1], [RC + 0.05, P1], [RC + 0.05, P1 + 0.5], [RC + 0.45, P1 + 0.75], [RC + 0.45, C1], [RC - 0.05, C1]], n, ph, true, true)
  revolve(dome, [0, 0], [[RC + 0.1, C1], [RC - 0.25, C1 + 0.45], [RC - 0.85, C1 + 0.9], [RC - 1.5, C1 + 1.15], [0, C1 + 1.25]], n, ph, false, true)
  box(dark, -0.06, 0.06, -0.06, 0.06, C1 + 1.2, 19.7, dark, 0)
  revolve(dark, [0, 0], [[0, C1 + 1.45], [0.16, C1 + 1.6], [0, C1 + 1.75]], 6)
  // the bell
  revolve(dark, [0, 0], [[0.5, 14.9], [0.46, 15.0], [0.34, 15.4], [0.28, 15.7], [0.16, 15.85], [0, 15.9]], 12)
  box(dark, -0.06, 0.06, -0.06, 0.06, 15.85, P1, null, 0)

  const lit = () => 0.55
  await save('ric-capitol-bell-tower', 'Bell Tower, Capitol Square', [
    { part: brick, material: { ...finish('bell-tower-brick', 0xa8604c), floodlight: lit } },
    { part: trim, material: { ...finish('bell-tower-trim', 0xf2ece0), floodlight: () => 0.8 } },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('bell-tower-door', 0x4a5650) },
    { part: dome, material: finish('bell-tower-dome', 0x9cbfae) },
  ], { height: 19.7, anchor: [37.5389514, -77.4352951], bearing: 37.6 })
}
