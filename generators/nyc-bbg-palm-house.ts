/**
 * Palm House, Brooklyn Botanic Garden — procedural, CC0-1.0, no textures.
 * bun generators/nyc-bbg-palm-house.ts
 *
 * Also the small glasshouse kit for the Brooklyn Botanic Garden models
 * (nyc-bbg-steinhardt-conservatory imports `oq`, `strip`, `stadium`,
 * `glassRange` and `GARDEN` helpers from here). The model is only written when
 * this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * −8.5°, the axis of the conservatory range (OSM: every edge of way/250230005
 * and of the Palm House part runs at −8.5°). Anchor: area centroid of the OSM
 * part way/1508006103 (Palm House).
 *
 * Identifying features (from the photos): a long glass "stadium" (two
 * semicircular ends on a straight middle) of white-framed glass on a low base;
 * a curved lower glass vault from a white entablature up to a glazed
 * clerestory drum; a second, smaller barrel vault with rounded ends on top;
 * the white arched entrance frontispiece on the garden (west) end; the long,
 * low curvilinear glass wings running north and south.
 *
 * Evidence
 * - OSM: part way/1508006103 (Palm House, 31.4 × 14.3 m stadium plus a
 *   3 m deep porch on its west end) inside the conservatory outline
 *   way/250230005 (which runs from the Laboratory Building south to the
 *   Steinhardt range), and way/487485073 (Yellow Magnolia Café, the south
 *   wing). OSM height on the outline 12.8 m (NYC building footprints).
 * - USGS NAIP orthophoto (public domain), 0.12 m: the stadium plan
 *   (≈31 × 14 m), the north wing as one narrow glass ridge range about 8 m
 *   wide on the west half of the OSM outline (the east half is trees), the
 *   south (café) wing as a ≈9 m glass range on the café outline.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid in the model frame:
 *   garden (west) ground 35.6 m NAVD88, the service side to the east 2.5–3 m
 *   lower; frame returns of the upper vault at most 46.4 m, i.e. 10.8 m over
 *   the garden; the lower vault at ±4 m from the axis 6.6 m and at ±6–8 m
 *   3.4 m over the garden; wing ridges 3–4.5 m over the garden. Glass
 *   returns are sparse, so these are the frame, read as maxima.
 * - Map terrain (Mapterhorn): 4.1 m over the table's low on the garden side,
 *   1.4–2 m at the east end of the stadium; the map's check puts the
 *   lowest ground under the footprint at 32.3 m. So the model's base (y = 0)
 *   is 3.1 m below the garden floor (GARDEN): the stone base shows on the east,
 *   as the real service level does, and sinks into the garden on the west.
 * - Published: McKim, Mead & White, completed 1917, glass and iron; used as
 *   an events hall (Brooklyn Botanic Garden; Wikipedia "Brooklyn Botanic
 *   Garden"; NYC LPC). Plan of the 1912 design: Popular Science Monthly v.80
 *   (public domain, Commons "PSM V80 D345 Conservatories of the brooklyn
 *   botanic gardens.png"): the stadium across the range, a wing each side.
 * - Photos (Wikimedia Commons), credits in
 *   ~/landmarks-scratch/bkn/work/nyc-bbg-palm-house/photos/credits.txt:
 *   from the west across the fountain (King of Hearts, CC BY-SA 4.0,
 *   "Brooklyn Botanic Garden New York October 2016 009.jpg"; jimbay,
 *   CC BY-SA 3.0, "Palm House, Brooklyn Botanic Garden - panoramio.jpg";
 *   Elisa.rolle, CC BY-SA 3.0, "Prospect Park Botanic Gardens 094/096/099/
 *   112.JPG"), from the north-west over the lily pools with the north wing
 *   (King of Hearts, CC BY-SA 3.0, "Brooklyn Botanic Garden New York May
 *   2015 006.jpg"), the fountain and front (Rhododendrites, CC BY-SA 4.0,
 *   "Brooklyn Botanic Garden fountain (60587).jpg").
 *
 * Measured: plan (OSM, NAIP), the top (lidar, 10.8 m over the garden), the
 * garden/east ground step (lidar, terrain). Estimated from the photos, scaled
 * by the doors (≈2.7 m) and the 14.3 m end: glazed wall 3.0 m on a 0.5 m
 * base, entablature 0.65 m, lower vault rise 3.0 m to a drum of 3.2 m
 * radius, drum 1.0 m between lips, upper vault 2.1 m (top 10.7 m over the
 * garden, as the lidar), finial; the frontispiece arch (5.3 m wide,
 * crown 6.8 m); the wings' eave and ridge heights (2.4/4.6 m north, 3.0/5.4 m
 * south) and their glass ends; rib spacing drawn bold (~2.4 m), not the real
 * glazing bars.
 *
 * Doubts: no licensed photo of the east end or the east side of the wings
 * (service yard): the east end is drawn like the west without the porch, as
 * OSM's outline shows. The OSM outline's east halves of both wings are
 * drawn as nothing (NAIP: trees); the outline still goes in `replaces`
 * because the model and the Steinhardt model together draw everything that
 * stands on it. The small link to the Laboratory Building (OSM jog at the
 * north end) is a plain low box.
 *
 * Night: the Palm House is an events hall, lit inside after dark, so its
 * vertical glazing (walls, drum, frontispiece) is `window-2` in the glass
 * colour and glows; the glass vaults stay `glass` and dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { type XY, prism, finishModel } from './nyc-570-lexington'

/** The garden (west) floor level of the 1917 range above the model's base. */
export const GARDEN = 3.1

export const unit3 = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A quad wound so it faces along `o`. */
export function oq(p: Part, A: V3, B: V3, C: V3, D: V3, o: V3) {
  const n = [(B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1]), (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]), (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])]
  if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) p.quad(A, B, C, D); else p.quad(A, D, C, B)
}
/** A triangle wound so it faces along `o`. */
export function ot(p: Part, A: V3, B: V3, C: V3, o: V3) {
  const n = [(B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1]), (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]), (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])]
  if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) p.tri(A, B, C); else p.tri(A, C, B)
}

/**
 * A flat strip of width w following the polyline pts, lifted `lift` off the
 * surface along `out(a, b)` (the surface's outward normal there); `side` is
 * the across direction.
 */
export function strip(p: Part, pts: V3[], side: V3, w: number, out: (a: V3, b: V3) => V3, lift = 0.07) {
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1], n = out(a, b)
    const a0 = add(add(a, side, -w / 2), n, lift), a1 = add(add(a, side, w / 2), n, lift)
    const b0 = add(add(b, side, -w / 2), n, lift), b1 = add(add(b, side, w / 2), n, lift)
    oq(p, a0, a1, b1, b0, n)
  }
}

/**
 * A stadium (two semicircles on a straight middle) around (cx, cy), long axis
 * along x, straight half-length a, radius r: counter-clockwise points, `ns`
 * segments per semicircle, `nl` per straight side. Every offset stadium with
 * the same a, ns, nl lines up point for point, so rings loft cleanly.
 */
export function stadium(cx: number, cy: number, a: number, r: number, ns = 10, nl = 7): XY[] {
  const pts: XY[] = []
  for (let i = 0; i < nl; i++) pts.push([cx - a + (2 * a * i) / nl, cy - r]) // south side, west → east
  for (let i = 0; i < ns; i++) { const t = -Math.PI / 2 + (Math.PI * i) / ns; pts.push([cx + a + r * Math.cos(t), cy + r * Math.sin(t)]) }
  for (let i = 0; i < nl; i++) pts.push([cx + a - (2 * a * i) / nl, cy + r]) // north side, east → west
  for (let i = 0; i < ns; i++) { const t = Math.PI / 2 + (Math.PI * i) / ns; pts.push([cx - a + r * Math.cos(t), cy + r * Math.sin(t)]) }
  return pts
}
/** The outward horizontal direction of a stadium at its point index i (for normals and ribs). */
export function stadiumOut(cx: number, a: number, cy: number, p: XY): V3 {
  const ex = p[0] < cx - a ? cx - a : p[0] > cx + a ? cx + a : p[0]
  return unit3([p[0] - ex, p[1] - cy, 0])
}

export type Profile = [number, number][] // [inset from the wall line, height above the range's base]

/**
 * A straight curvilinear glass range from a to b (its centre line), half-width
 * hw, standing on z0: glass walls and a curved-eave glass roof up to a ridge,
 * a stone base from `base0` up to z0, white ribs every ~ribEvery m, a white
 * eave band and ridge cap, flat glass gable ends (skipped where `ends` says).
 */
export function glassRange(o: {
  glass: Part; trim: Part; stone: Part; a: XY; b: XY; hw: number; z0: number; base0?: number
  prof: Profile; ribEvery?: number; ends?: [boolean, boolean]; rib?: number
}) {
  const { glass, trim, stone, a, b, hw, z0, prof } = o
  const ribEvery = o.ribEvery ?? 3.4, RIB = o.rib ?? 0.45, ends = o.ends ?? [true, true]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux // right-hand normal
  const m = prof.length
  const sec = (s: number): V3[] => {
    const cx = a[0] + ux * s, cy = a[1] + uy * s, pts: V3[] = []
    for (const [d, z] of prof) pts.push([cx + nx * (hw - d), cy + ny * (hw - d), z0 + z])
    for (const [d, z] of [...prof].reverse().slice(1)) pts.push([cx - nx * (hw - d), cy - ny * (hw - d), z0 + z])
    return pts
  }
  const s0 = sec(0), s1 = sec(L)
  for (let k = 0; k < s0.length - 1; k++) {
    const mid: V3 = [(s0[k][0] + s0[k + 1][0]) / 2 - a[0], (s0[k][1] + s0[k + 1][1]) / 2 - a[1], 0]
    const side = Math.sign(mid[0] * nx + mid[1] * ny) || 1
    const up = Math.abs(s0[k + 1][2] - s0[k][2]) < 1e-6 ? 1 : 0.5
    oq(glass, s0[k], s0[k + 1], s1[k + 1], s1[k], unit3([nx * side, ny * side, up]))
  }
  // gable ends: fan from the base centre
  for (const [which, on] of [[0, ends[0]], [1, ends[1]]] as [number, boolean][]) {
    if (!on) continue
    const S = which === 0 ? s0 : s1, c = which === 0 ? a : b
    const o3: V3 = which === 0 ? [-ux, -uy, 0] : [ux, uy, 0]
    const ctr: V3 = [c[0], c[1], z0]
    for (let k = 0; k < S.length - 1; k++) ot(glass, ctr, S[k], S[k + 1], o3)
    // white frame round the gable
    for (let k = 0; k < S.length - 1; k++) {
      const p = S[k], q = S[k + 1], t = unit3([q[0] - p[0], q[1] - p[1], q[2] - p[2]])
      const inward: V3 = unit3([-(t[1] * o3[2] - t[2] * o3[1]), -(t[2] * o3[0] - t[0] * o3[2]), -(t[0] * o3[1] - t[1] * o3[0])])
      const w = RIB * 0.8
      oq(trim, add(p, o3, 0.06), add(q, o3, 0.06), add(add(q, o3, 0.06), inward, w), add(add(p, o3, 0.06), inward, w), o3)
    }
  }
  // transverse ribs over the whole section
  const n = Math.max(1, Math.round(L / ribEvery))
  for (let r = 0; r <= n; r++) {
    const s = Math.min(Math.max((L * r) / n, RIB / 2), L - RIB / 2)
    const pts = sec(s), mx = a[0] + ux * s, my = a[1] + uy * s
    const half = m
    for (const seg of [pts.slice(0, half), pts.slice(half - 1)]) strip(trim, seg, [ux, uy, 0], RIB, (p, q) => {
      const t: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
      const across = unit3([(p[0] + q[0]) / 2 - mx, (p[1] + q[1]) / 2 - my, 0])
      const h = t[0] * across[0] + t[1] * across[1]
      const c1 = unit3([across[0] * t[2], across[1] * t[2], -h])
      return c1[0] * across[0] + c1[1] * across[1] + c1[2] * 0.3 >= 0 ? c1 : [-c1[0], -c1[1], -c1[2]]
    })
  }
  // eave bands and the ridge cap
  const eave = prof[1][1]
  for (const sgn of [1, -1]) {
    const o3: V3 = [nx * sgn, ny * sgn, 0]
    const p0: V3 = [a[0] + nx * hw * sgn, a[1] + ny * hw * sgn, z0 + eave - 0.45], p1: V3 = [b[0] + nx * hw * sgn, b[1] + ny * hw * sgn, z0 + eave - 0.45]
    oq(trim, add(p0, o3, 0.08), add(p1, o3, 0.08), add(add(p1, o3, 0.08), [0, 0, 0.5]), add(add(p0, o3, 0.08), [0, 0, 0.5]), o3)
  }
  const top = prof[m - 1]
  const rz = z0 + top[1] + 0.12, rw = Math.max(0.3, hw - top[0]) + 0.2
  oq(trim, [a[0] + nx * rw, a[1] + ny * rw, rz], [b[0] + nx * rw, b[1] + ny * rw, rz], [b[0] - nx * rw, b[1] - ny * rw, rz], [a[0] - nx * rw, a[1] - ny * rw, rz], [0, 0, 1])
  // stone base
  const base0 = o.base0 ?? 0
  if (z0 - base0 > 0.05) {
    const ring: XY[] = [[a[0] + nx * hw, a[1] + ny * hw], [b[0] + nx * hw, b[1] + ny * hw], [b[0] - nx * hw, b[1] - ny * hw], [a[0] - nx * hw, a[1] - ny * hw]]
    prism({ wall: stone, win: null, roof: null, ring, z0: base0, z1: z0, facade: null, bevel: 0.15 })
  }
}

/** Rings lofted with smooth normals from `nrm(k, i)` (rings counter-clockwise from above). */
export function loftN(p: Part, rings: V3[][], nrm: (k: number, i: number) => V3) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
    const nA = nrm(k, i), nB = nrm(k, j), nC = nrm(k + 1, j), nD = nrm(k + 1, i)
    p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
    p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
  }
}

/** A flat annulus between two lined-up rings at one height, facing up or down. */
export function annulus(p: Part, outer: V3[], inner: V3[], up: boolean) {
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    oq(p, outer[i], outer[j], inner[j], inner[i], [0, 0, up ? 1 : -1])
  }
}

function build() {
  const stone = new Part(), trim = new Part(), glass = new Part(), win = new Part()
  const G = GARDEN
  const CX = 0.5, CY = 0, A = 8.5, R = 7.1 // stadium: straight half-length A, radius R (OSM 31.4 × 14.3 m)
  const flat = (r: number) => stadium(CX, CY, A, r)
  const ring = (r: number, z: number): V3[] => flat(r).map(([x, y]) => [x, y, z] as V3)
  const outAt = (i: number) => stadiumOut(CX, A, CY, flat(1)[i])
  const N = flat(1).length
  const tangentAt = (i: number): V3 => { const o = outAt(i); return [-o[1], o[0], 0] }

  // A vertical cylinder-like band on the stadium, radius r, z0..z1, smooth.
  const wall = (p: Part, r: number, z0: number, z1: number) => loftN(p, [ring(r, z0), ring(r, z1)], (_k, i) => outAt(i))
  /** A proud ring band (cornice, transom) d out from r, with top and bottom lips back to r − back. */
  const cornice = (r: number, d: number, z0: number, z1: number, back = 0.1) => {
    wall(trim, r + d, z0, z1)
    annulus(trim, ring(r + d, z1), ring(r - back, z1), true)
    annulus(trim, ring(r + d, z0), ring(r, z0), false)
  }
  /** A vault from radius r0 at z0 to r1 at z0 + rise, quarter-ellipse profile, `steps` rings. */
  const vault = (p: Part, r0: number, r1: number, z0: number, rise: number, steps: number) => {
    const prof: [number, number][] = Array.from({ length: steps + 1 }, (_, s) => { const t = (s / steps) * Math.PI / 2; return [r1 + (r0 - r1) * Math.cos(t), z0 + rise * Math.sin(t)] })
    const rings = prof.map(([r, z]) => ring(r, z))
    loftN(p, rings, (k, i) => {
      const a = prof[Math.max(0, k - 1)], b = prof[Math.min(steps, k + 1)]
      const dr = b[0] - a[0], dz = b[1] - a[1], o = outAt(i)
      return unit3([o[0] * dz, o[1] * dz, -dr])
    })
    return { prof, rings }
  }
  /** Bold white meridian ribs over a vault, at every `every`-th ring point. */
  const ribs = (rings: V3[][], every: number, w: number) => {
    for (let i = 0; i < N; i += every) {
      const pts = rings.map((r) => r[i]), o = outAt(i)
      strip(trim, pts, tangentAt(i), w, (p, q) => {
        const dz = q[2] - p[2], dh = (q[0] - p[0]) * o[0] + (q[1] - p[1]) * o[1]
        return unit3([o[0] * dz, o[1] * dz, -dh])
      })
    }
  }
  /** Vertical white piers on a stadium wall of radius r, z0..z1. */
  const piers = (r: number, z0: number, z1: number, every: number, w: number) => {
    const f = flat(r)
    for (let i = 0; i < N; i += every) {
      const p = f[i], o = outAt(i)
      strip(trim, [[p[0], p[1], z0], [p[0], p[1], z1]], tangentAt(i), w, () => o)
    }
  }

  // --- The Palm House ---
  // stone base (exposed on the lower east side), glazed wall with white piers
  // and a transom, the entablature.
  wall(stone, R + 0.15, 0, G + 0.5)
  annulus(stone, ring(R + 0.15, G + 0.5), ring(R - 0.2, G + 0.5), true)
  wall(win, R, G + 0.5, G + 3.5)
  piers(R, G + 0.5, G + 3.5, 1, 0.42)
  cornice(R, 0.07, G + 2.5, G + 2.75, 0)
  cornice(R, 0.3, G + 3.45, G + 4.1, 0.2)
  // lower vault, drum, upper vault
  const lower = vault(glass, R - 0.1, 3.2, G + 4.1, 3.0, 6)
  ribs(lower.rings, 1, 0.34)
  cornice(3.2, 0.25, G + 7.1, G + 7.35, 0.4)
  wall(win, 3.2, G + 7.35, G + 8.35)
  piers(3.2, G + 7.35, G + 8.35, 1, 0.3)
  cornice(3.2, 0.22, G + 8.35, G + 8.6, 0.15)
  const upper = vault(glass, 3.05, 0.45, G + 8.6, 2.1, 5)
  ribs(upper.rings, 2, 0.3)
  const ridge = ring(0.45, G + 10.7)
  annulus(trim, ridge, ring(0.01, G + 10.7), true)
  // finial over the middle of the ridge
  {
    const f = (r: number, z: number): V3[] => Array.from({ length: 6 }, (_, i) => [CX + r * Math.cos((i * Math.PI) / 3), CY + r * Math.sin((i * Math.PI) / 3), z] as V3)
    trim.loft([f(0.35, G + 10.7), f(0.3, G + 11.0), f(0.05, G + 11.5)])
  }

  // --- The frontispiece on the garden (west) end: a white entrance bay with
  // glazed doors, and over it a big round-headed glazed arch under a short
  // glass barrel that runs back into the lower vault. ---
  {
    const x0 = -18.0, x1 = -14.2, hw = 2.4
    prism({ wall: trim, win: null, roof: trim, ring: [[x0, -hw], [x1, -hw], [x1, hw], [x0, hw]], z0: 0, z1: G + 4.1, facade: null, bevel: 0.2 })
    // doors and side lights on the front (x = x0, facing −x) and glazing on the sides
    const front = (y0: number, y1: number, z0: number, z1: number) => oq(win, [x0 - 0.06, y0, z0], [x0 - 0.06, y1, z0], [x0 - 0.06, y1, z1], [x0 - 0.06, y0, z1], [-1, 0, 0])
    front(-1.1, 1.1, G, G + 2.9) // the doors
    front(-2.0, -1.45, G + 0.6, G + 3.4)
    front(1.45, 2.0, G + 0.6, G + 3.4)
    front(-1.1, 1.1, G + 3.15, G + 3.6) // transom
    for (const s of [-1, 1]) oq(win, [x0 + 0.4, s * (hw + 0.06), G + 0.6], [x1 - 0.3, s * (hw + 0.06), G + 0.6], [x1 - 0.3, s * (hw + 0.06), G + 3.5], [x0 + 0.4, s * (hw + 0.06), G + 3.5], [0, s, 0])
    // steps down to the walk are the map's ground; a stone sill only
    // arch over the entablature
    const xa = -15.6, xb = -11.6, rr = 2.5, z0 = G + 4.1, SEG = 10
    const arc = (r: number): [number, number][] => Array.from({ length: SEG + 1 }, (_, s) => { const t = (s / SEG) * Math.PI; return [r * Math.cos(t), z0 + r * Math.sin(t)] })
    // white arch frame (a flat ring face), glazed fan inside, radial bars
    const outer = arc(rr + 0.35), inner = arc(rr)
    for (let s = 0; s < SEG; s++) oq(trim, [xa, outer[s][0], outer[s][1]], [xa, outer[s + 1][0], outer[s + 1][1]], [xa, inner[s + 1][0], inner[s + 1][1]], [xa, inner[s][0], inner[s][1]], [-1, 0, 0])
    oq(trim, [xa, -rr - 0.35, z0 - 0.01], [xa, rr + 0.35, z0 - 0.01], [xa, rr + 0.35, z0 + 0.3], [xa, -rr - 0.35, z0 + 0.3], [-1, 0, 0])
    for (let s = 0; s < SEG; s++) ot(win, [xa - 0.02, 0, z0], [xa - 0.02, inner[s][0], inner[s][1]], [xa - 0.02, inner[s + 1][0], inner[s + 1][1]], [-1, 0, 0])
    for (const t of [Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]) {
      const c = Math.cos(t), sn = Math.sin(t), w = 0.12
      oq(trim, [xa - 0.06, -sn * w + c * 0.6, z0 + c * w + sn * 0.6], [xa - 0.06, sn * w + c * 0.6, z0 - c * w + sn * 0.6], [xa - 0.06, sn * w + c * rr, z0 - c * w + sn * rr], [xa - 0.06, -sn * w + c * rr, z0 + c * w + sn * rr], [-1, 0, 0])
    }
    {
      const a6 = arc(0.6)
      for (let s = 0; s < SEG; s++) oq(trim, [xa - 0.06, a6[s][0], a6[s][1]], [xa - 0.06, a6[s + 1][0], a6[s + 1][1]], [xa - 0.06, a6[s + 1][0] * 0.6, z0 + (a6[s + 1][1] - z0) * 0.6], [xa - 0.06, a6[s][0] * 0.6, z0 + (a6[s][1] - z0) * 0.6], [-1, 0, 0])
    }
    // barrel roof back into the vault, with a white rim
    const bo = arc(rr + 0.35)
    for (let s = 0; s < SEG; s++) {
      const p0 = bo[s], p1 = bo[s + 1], mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - z0]
      oq(glass, [xa, p0[0], p0[1]], [xb, p0[0], p0[1]], [xb, p1[0], p1[1]], [xa, p1[0], p1[1]], unit3([0, mid[0], mid[1]]))
    }
    for (const s of [2, 5, 8]) strip(trim, [[xa, bo[s][0], bo[s][1]], [xb, bo[s][0], bo[s][1]]], unit3([0, -Math.sin((s / SEG) * Math.PI), Math.cos((s / SEG) * Math.PI)]), 0.3, () => unit3([0, Math.cos((s / SEG) * Math.PI), Math.sin((s / SEG) * Math.PI)]))
  }

  // --- The wings: low curvilinear glass ranges north and south (NAIP) ---
  glassRange({ glass, trim, stone, a: [-5.0, 6.4], b: [-5.0, 39.3], hw: 4.0, z0: G + 0.35, prof: [[0, 0], [0, 2.0], [0.3, 2.55], [0.9, 2.95], [4.0, 4.3]], ends: [false, true] })
  glassRange({ glass, trim, stone, a: [-4.45, -6.4], b: [-4.45, -39.7], hw: 4.65, z0: G + 0.35, prof: [[0, 0], [0, 2.6], [0.35, 3.2], [1.0, 3.6], [4.65, 5.0]], ends: [false, true] })
  // the low link to the Laboratory Building (OSM jog at the north end)
  prism({ wall: stone, win: null, roof: trim, ring: [[-1.0, 39.3], [5.6, 39.3], [5.6, 44.9], [-1.0, 44.9]], z0: 0, z1: G + 3.2, facade: null, bevel: 0.25 })

  finishModel('Palm House, Brooklyn Botanic Garden', 'nyc-bbg-palm-house', [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: glass, material: { name: 'glass', color: 0x9cc5c4, roughness: 0.24 } },
    { part: win, material: windowVariant(2, 0xa8cccb) },
  ], { bearing: -8.5, osm: 'way/1508006103', height: 14.6 })
}

if (import.meta.main) build()
