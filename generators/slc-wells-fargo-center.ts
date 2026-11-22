/**
 * Wells Fargo Center (1998, formerly American Stores Center), Salt Lake
 * City: procedural, CC0-1.0.
 * bun generators/slc-wells-fargo-center.ts
 *
 * Also exports the small plan-and-facade kit the other slc- towers of this
 * group import (slc-111-main, slc-walker-center, slc-kearns-building,
 * slc-eccles-theater): merge this generator first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the outline's
 * Main Street face runs true north-south). Origin: the area centroid of OSM
 * way/238255654 (-111.890566, 40.763428). y = 0 is the lowest ground under
 * the outline; the site falls about 2 m from north to south.
 *
 * Form: a wedge. The tower's plan is a half-diamond: a 93 m flat face on
 * Main Street (west), with a shallow V slot down its middle, and two 45°
 * granite faces meeting in a sawtooth glass tip on the east; the tips at
 * the north and south ends are 3 m wide. Two granite piers fill the outer
 * teeth of the east tip up to 64.5 m. The top storey is open at the tips,
 * under a flat cantilevered canopy roof of pale teal metal, 2.8 m proud of
 * every face and following the sawtooth, with the WELLS FARGO sign on its
 * fascia (west, north-east and south-east). A helipad drum and antenna mast
 * stand on the canopy. Stepped dark-granite podium terraces fill the
 * corners between the 45° faces and the outline, 30, 21, 12.3 and 6.5 m.
 *
 * OSM: way/238255654 outline (24 levels, height 128.7, Q954129);
 * way/33192595 tower part (125, 26 levels); way/1433954708 and
 * way/1434284728 the 60 m east piers; way/537032597, way/1434284730,
 * way/1434284731, way/1434284732, way/1433954707, way/1434284733 podium
 * parts (1–4 levels); way/1441743870 the helipad drum (128.7).
 * Lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013), measured
 * above the street: canopy top 118 m (edge rail 118.3), drum 122 m,
 * east piers 64.5 m, podium terraces 30 / 21 / 12.3 / 6.5 m stepping down
 * eastward on both the north and south sides.
 * Published: 128.7 m (422 ft), 24 storeys (Wikipedia, Emporis); taken as the
 * top of the antenna mast, which is drawn to it.
 * Estimated from photos: canopy 2.8 m overhang and 4.8 m deep fascia with a
 * sloped soffit (p1, p2, p4); window bays about 6 m with square punched
 * windows on the granite faces grouped two storeys to a panel (p1, p2); the
 * west face's broader glass panels and blue slot (p3); the open loggias at
 * the tips under the canopy (p1, p4); the sign's length (p1, p4).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:2006_Wells_Fargo_Center,_Salt_Lake_City.jpg
 *     Streamline1989, public domain (the north-east face from the north-west)
 *  p2 https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center,_SLC,_UT,_east_side_2024-09-01.jpg
 *     Xnatedawgx, CC BY-SA 4.0 (the east tip and its glass sawtooth)
 *  p3 https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_(2).jpg
 *     Tamanoeconomico, CC BY-SA 4.0 (the south tip and west face from Main & 300 S)
 *  p4 https://commons.wikimedia.org/wiki/File:Helipads_In_Use_at_Wells_Fargo_Center.jpg
 *     Stefan Brems, CC BY-SA 4.0 (the canopy, drum and helipads)
 * NAIP (USGS, public domain) for the plan.
 * Doubts: the north end's low curved plaza part is drawn as one 6.5 m block;
 * the podium's window rhythm is estimated from p3 only.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, windowVariant } from './palette'

// ------------------------------------------------------------------ kit ---
export type XY = [number, number]
export const signedArea = (r: XY[]) => {
  let a = 0
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length]
    a += x0 * y1 - x1 * y0
  }
  return a / 2
}
/** The ring counter-clockwise from above. */
export const ccw = (r: XY[]): XY[] => (signedArea(r) < 0 ? [...r].reverse() : r)
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

export function pointIn(r: XY[], [px, py]: XY) {
  let inside = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
export function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const crossZ = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (crossZ(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const p = r[j]
        if (crossZ(a, b, p) >= 0 && crossZ(b, c, p) >= 0 && crossZ(c, a, p) >= 0) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat cap over any simple ring. */
export function cap(p: Part, ring: XY[], z: number, up = true) {
  const r = ccw(ring)
  for (const [a, b, c] of earcut(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

/** The walls of a ring, cut into strips no wider than `maxLen` and, near the ground, a 3 m lift, for the terrain check. */
export function walls(p: Part, ring: XY[], z0: number, z1: number, maxLen = 5) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const [ax, ay] = r[i], [bx, by] = r[(i + 1) % r.length]
    const L = Math.hypot(bx - ax, by - ay), k = Math.max(1, Math.ceil(L / maxLen))
    const zs = z0 < 1 && z1 > z0 + 4 ? [z0, z0 + 3, z1] : [z0, z1]
    for (let j = 0; j < k; j++) {
      const t0 = j / k, t1 = (j + 1) / k
      const a: XY = [ax + (bx - ax) * t0, ay + (by - ay) * t0], b: XY = [ax + (bx - ax) * t1, ay + (by - ay) * t1]
      for (let s = 0; s < zs.length - 1; s++)
        p.quad([a[0], a[1], zs[s]], [b[0], b[1], zs[s]], [b[0], b[1], zs[s + 1]], [a[0], a[1], zs[s + 1]])
    }
  }
}

export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false, maxLen = 5) {
  walls(p, ring, z0, z1, maxLen)
  if (top) cap(p, ring, z1, true)
  if (bottom) cap(p, ring, z0, false)
}

/** Offset a ring outward by d (mitred, the mitre capped at 3×). */
export function offset(ring: XY[], d: number): XY[] {
  const r = ccw(ring), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const n0 = edgeNormal(a, p), n1 = edgeNormal(p, b)
    const m: XY = [n0[0] + n1[0], n0[1] + n1[1]], ml = Math.hypot(m[0], m[1]) || 1
    const u: XY = [m[0] / ml, m[1] / ml], k = Math.min(3, 1 / Math.max(0.2, u[0] * n0[0] + u[1] * n0[1]))
    return [p[0] + u[0] * d * k, p[1] + u[1] * d * k] as XY
  })
}

/** Cut every corner of a ring back by d along both edges: the plan's vertical bevels. */
export function chamfer(ring: XY[], d: number): XY[] {
  const r = ccw(ring), n = r.length, out: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = r[(i + n - 1) % n], p = r[i], b = r[(i + 1) % n]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const da = Math.min(d, la / 3), db = Math.min(d, lb / 3)
    out.push([p[0] + ((a[0] - p[0]) * da) / la, p[1] + ((a[1] - p[1]) * da) / la])
    out.push([p[0] + ((b[0] - p[0]) * db) / lb, p[1] + ((b[1] - p[1]) * db) / lb])
  }
  return out
}

/** Outward normal of edge a→b on a counter-clockwise ring. */
export const edgeNormal = (a: XY, b: XY): XY => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
  return [dy / l, -dx / l]
}

/** A flat panel on the wall a→b (outward side), from s0 to s1 metres along it, z0 to z1, `out` proud of it. */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}

/** A box standing proud of the wall a→b: from s0 to s1 along it, z0..z1, depth d out (a sign, a band, a pier). */
export function boxOn(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, back = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = edgeNormal(a, b)
  const Q = (s: number, o: number): XY => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o]
  prism(p, [Q(s0, -back), Q(s1, -back), Q(s1, d), Q(s0, d)], z0, z1, true, true, 99)
}

export type Blocker = { ring: XY[]; h: number }
/** Storey groups: n bands between z0 and z1, each with a `gap` of wall above and below. */
export function rows(z0: number, z1: number, n: number, gap: number): [number, number][] {
  const h = (z1 - z0) / n
  return Array.from({ length: n }, (_, i) => [z0 + i * h + gap / 2, z0 + (i + 1) * h - gap / 2] as [number, number])
}

/**
 * Window bays along the wall a→b: `round(L / pitch)` bays, each panel `frac`
 * of the bay wide, one per row. A panel is dropped, or starts higher, where
 * a lower block stands in front of it (blockers).
 */
export function bays(p: Part, a: XY, b: XY, pitch: number, frac: number, rws: [number, number][], blockers: Blocker[] = [], out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const nb = Math.max(1, Math.round(L / pitch)), step = L / nb, n = edgeNormal(a, b)
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let i = 0; i < nb; i++) {
    const s0 = step * (i + 0.5 - frac / 2), s1 = step * (i + 0.5 + frac / 2)
    let floor = -1
    for (const s of [s0 + 0.05, s1 - 0.05, (s0 + s1) / 2]) {
      const q: XY = [a[0] + t[0] * s + n[0] * 0.6, a[1] + t[1] * s + n[1] * 0.6]
      for (const bl of blockers) if (pointIn(bl.ring, q)) floor = Math.max(floor, bl.h)
    }
    for (const [z0, z1] of rws) {
      const lo = Math.max(z0, floor + 0.8)
      if (z1 - lo < 1.2) continue
      panel(p, a, b, s0, s1, lo, z1, out)
    }
  }
}

/** Every edge of a ring as [a, b] pairs, counter-clockwise. */
export const edges = (ring: XY[]): [XY, XY][] => {
  const r = ccw(ring)
  return r.map((p, i) => [p, r[(i + 1) % r.length]] as [XY, XY])
}

export function cylinder(p: Part, c: XY, rad: number, z0: number, z1: number, seg = 16, top = true) {
  const ring: XY[] = Array.from({ length: seg }, (_, i) => [c[0] + rad * Math.cos((2 * Math.PI * i) / seg), c[1] + rad * Math.sin((2 * Math.PI * i) / seg)])
  prism(p, ring, z0, z1, top, false, 99)
}

export function save(id: string, name: string, parts: { part: Part; material: MaterialSpec }[], height: number, limit = 5000) {
  const kept = parts.filter((q) => q.part.triangles > 0)
  const triangles = kept.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > limit) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, kept, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height,
  })
  return Bun.write(new URL(`../models/${id}.glb`, import.meta.url), glb).then(() =>
    console.log(`${id}.glb: ${triangles} triangles, ${glb.length} bytes`))
}

// --------------------------------------------------------------- model ---
function build() {
  const granite = new Part(), podium = new Part(), win = new Part(), glass = new Part(), canopy = new Part(), sign = new Part()

  // The tower above the piers: Main Street face with its V slot, the two
  // 45° faces, the sawtooth east tip (OSM way/33192595, collinear points dropped).
  const WEST_SLOT: XY[] = [[-25.2, -2.7], [-22.5, 0.2], [-25.3, 3.0]]
  const TOWER: XY[] = ccw([
    [-25.1, 46.9], [-22.0, 46.9], [13.0, 12.0], [8.8, 7.6], [13.0, 3.3], [9.9, 0.1], [12.9, -2.9], [8.6, -7.2],
    [12.9, -11.4], [-22.1, -46.3], [-25.2, -46.2], ...WEST_SLOT,
  ])
  const PIERS: XY[][] = [[[13.0, 3.3], [13.0, 12.0], [8.8, 7.6]], [[12.9, -11.4], [12.9, -2.9], [8.6, -7.2]]]
  const NOTCH: XY[] = [[13.0, 3.3], [12.9, -2.9], [9.9, 0.1]]

  // Stepped podium terraces (OSM parts; heights from lidar).
  const PODIUM: Blocker[] = [
    { ring: [[-22.0, 46.9], [-12.7, 37.6], [-12.7, 46.9]], h: 30 },
    { ring: [[-12.7, 37.6], [-4.1, 29.0], [-4.1, 46.8], [-12.7, 46.8]], h: 21 },
    { ring: [[-4.1, 29.0], [13.0, 12.0], [13.0, 29.8], [4.4, 29.8], [4.4, 38.3], [-4.1, 38.3]], h: 12.3 },
    {
      ring: [[-12.7, 46.9], [-4.0, 46.8], [-4.1, 38.3], [4.4, 38.3], [4.4, 29.8], [13.0, 29.8], [13.0, 12.0], [15.9, 15.2],
        [17.7, 18.7], [18.9, 23.3], [19.2, 29.5], [18.1, 33.4], [17.5, 35.2], [14.8, 38.9], [13.0, 41.5], [13.0, 46.7],
        [7.4, 46.7], [3.7, 49.8], [-1.7, 52.0], [-5.8, 52.6], [-12.2, 52.1], [-16.7, 49.6], [-19.3, 46.9]], h: 6.5,
    },
    { ring: [[-22.1, -46.3], [-13.0, -46.2], [-13.0, -37.2]], h: 30 },
    { ring: [[-13.0, -37.2], [-13.0, -46.2], [-4.3, -46.3], [-4.2, -28.5]], h: 21 },
    { ring: [[-4.2, -28.5], [-4.3, -38.1], [4.2, -38.1], [4.3, -29.5], [12.8, -29.5], [12.9, -11.4]], h: 12.3 },
    { ring: [[-4.3, -46.3], [12.6, -46.3], [12.8, -29.5], [4.3, -29.5], [4.2, -38.1], [-4.3, -38.1]], h: 6.5 },
    { ring: NOTCH, h: 7 },
  ]
  const Z_TOP = 113.5 // top of the walls; the soffit and canopy above
  const Z_SOFFIT = 115.6, Z_CANOPY = 118.0

  // Tower walls and piers.
  prism(granite, chamfer(TOWER, 0.35), 0, Z_TOP, false)
  for (const r of PIERS) prism(granite, r, 0, 64.5)
  for (const b of PODIUM) prism(podium, b.ring, 0, b.h)
  // Close the west slot's head under the canopy.
  cap(glass, WEST_SLOT, Z_TOP, false)

  // Windows. Two storeys to a panel, about 6 m bays.
  const blockers: Blocker[] = [...PODIUM, ...PIERS.map((ring) => ({ ring, h: 64.5 }))]
  const body = rows(9.5, Z_TOP - 1.2, 16, 1.8), curtain = rows(9.5, Z_TOP - 1.2, 16, 0.8)
  for (const [a, b] of edges(TOWER)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = edgeNormal(a, b)
    const west = nx[0] < -0.9
    if (L < 3.5) {
      // The 3 m tips: a slot of glass up the middle, the loggia open at the top.
      panel(glass, a, b, 0.6, L - 0.6, 9.5, Z_TOP - 6, 0.05)
      panel(glass, a, b, 0.2, L - 0.2, Z_TOP - 5.4, Z_TOP - 0.2, 0.05)
    } else if (west && L > 20) {
      // Main Street: broad glass panels between slim granite piers; the shopfront under them.
      bays(glass, a, b, 6.1, 0.9, curtain, blockers)
      bays(glass, a, b, 6.1, 0.84, [[1.2, 8.2]], blockers)
    } else if (L < 8) {
      // The V slot and the sawtooth: glass from top to bottom (hidden behind the piers).
      bays(glass, a, b, 9, 0.86, rows(9.5, Z_TOP - 1.2, 1, 0), blockers)
    } else {
      // The 45° granite faces: square punched windows.
      bays(win, a, b, 6.1, 0.62, body, blockers)
    }
  }
  // The podium's punched windows, a panel a storey pair.
  for (const bl of PODIUM) {
    if (bl.h < 7) {
      for (const [a, b] of edges(bl.ring)) bays(glass, a, b, 5, 0.8, [[0.8, bl.h - 1.4]], [...blockers.filter((x) => x !== bl), { ring: TOWER, h: 999 }])
      continue
    }
    const n = Math.max(1, Math.round((bl.h - 4) / 4.5))
    for (const [a, b] of edges(bl.ring))
      bays(win, a, b, 4.6, 0.6, [[0.8, 4.2], ...rows(5.4, bl.h - 1.4, n, 1.4)], [...blockers.filter((x) => x !== bl), { ring: TOWER, h: 999 }])
  }

  // Canopy: a sloped soffit from the walls out to the fascia, then the fascia band.
  const TOP: XY[] = ccw([
    [-25.1, 46.9], [-22.0, 46.9], [13.0, 12.0], [8.8, 7.6], [13.0, 3.3], [9.9, 0.1], [12.9, -2.9], [8.6, -7.2],
    [12.9, -11.4], [-22.1, -46.3], [-25.2, -46.2],
  ])
  const TOPC = chamfer(TOP, 0.35), RIM = offset(TOPC, 2.8)
  canopy.loft([TOPC.map(([x, y]) => [x, y, Z_TOP] as V3), RIM.map(([x, y]) => [x, y, Z_SOFFIT] as V3)])
  prism(canopy, RIM, Z_SOFFIT, Z_CANOPY, true, false, 99)
  // The helipad drum and the antenna mast to the published 128.7 m.
  cylinder(canopy, [0.1, 0.2], 4.4, Z_CANOPY, 122, 14)
  prism(podium, rect(1.6, -1.4, 2.2, -0.8), 122, 128.7, true, false, 99)

  // WELLS FARGO on the fascia: a plain lit sign band (not the landmark itself).
  for (const [a, b] of edges(RIM)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = edgeNormal(a, b)
    if (L < 30) continue
    const w = nx[0] < -0.9 ? 30 : 26
    boxOn(sign, a, b, L / 2 - w / 2, L / 2 + w / 2, Z_SOFFIT + 0.25, Z_CANOPY - 0.25, 0.3)
  }

  // Granite: pale warm grey (p1, p2). Podium: the darker grey granite (p3).
  // Glass: the reflective blue of the curtain wall and slots, pulled light.
  // Canopy: pale teal-grey metal (p1, p4), floodlit at night.
  return [
    { part: granite, material: finish('wf-granite', 0xd8d4cc) },
    { part: podium, material: finish('wf-dark-granite', 0x8a898c) },
    { part: win, material: windowVariant(2, 0x7f9ab3) },
    { part: glass, material: { name: 'window', color: 0x5f7c96, roughness: 0.3 } },
    { part: canopy, material: { ...finish('wf-canopy', 0x97b1ac), floodlight: (q: V3, n: V3) => (q[2] > Z_TOP - 0.5 && n[2] < 0.7 ? 0.8 : 0) } },
    { part: sign, material: finish('neon-wf-yellow', 0xe0b43c) },
  ]
}

if (import.meta.main) await save('slc-wells-fargo-center', 'Wells Fargo Center', build(), 128.7)
