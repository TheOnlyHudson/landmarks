/**
 * Phipps Conservatory (Lord & Burnham, 1893; welcome centre 2005, Tropical
 * Forest conservatory 2006, production greenhouses), Schenley Park,
 * Oakland, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-phipps-conservatory.ts
 *
 * Imports `poly`/`wallsSplit` from pit-allegheny-county-courthouse.ts;
 * merge that first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * multipolygon relation/2785563 (the whole glasshouse complex),
 * -79.9481899 40.4388412. The Victorian spine runs at 318.4°, so the
 * catalog bearing is 318.4: model +y is north-west along the spine, +x
 * north-east (toward Schenley Drive and the welcome centre), -x the
 * modern greenhouses down the slope to the south-west.
 *
 * The OSM relation/2785563 covers the whole complex, the 1893 glasshouses
 * (relation/18260908, sharing its ways) and the modern greenhouses on its
 * west side, so the model draws all of it: the map would otherwise show
 * the modern half as a box through the old one. The modern parts are kept
 * plain.
 *
 * Identity, in order: the Victorian curvilinear glasshouses in white
 * frames on low stone walls: the great Palm Court with its tall
 * bell-curved hipped glass roof; the long spine and the two cross ranges
 * with half-domed apse ends; the domed pavilions at the crossings; the
 * west cross of lower houses; the round glass dome of the welcome centre
 * with its stone link; then the big modern Tropical Forest conservatory
 * with its curved west wall and sloping glass roof, and the flat
 * production greenhouses. Seeing the planting through the glass is the
 * identity, so the historic houses and the Tropical Forest are
 * translucent `glass` (STYLE.md "Translucent glass") with green planting
 * inside; the production greenhouses are opaque pale glass.
 *
 * Evidence:
 *  - plan: OSM relation/18260908 and relation/2785563 (outer ways
 *    1331719876, 1331719877, 1331719878, 207207959, 207205053), turned
 *    into this frame; every house's line, width and apse from them.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, each house measured above its own ground: the site falls
 *    ~12.6 m from the historic houses (284.6 m NAVD88) to the production
 *    greenhouses' west wall (272.0), the Tropical Forest between (278.1).
 *    Each part is built on a flat base at y = 0 and the map drapes it
 *    over the terrain. Above their own ground: Palm Court eaves ~7, ridge 19.5; spine and
 *    cross ranges eaves ~4.5, ridges 6.5-7; crossing pavilions 10.5-12;
 *    west hall 10; welcome dome 10 on its own ground; stone link 5.5.
 *    Tropical Forest roof 20.5 at its curved west wall falling to 13.5 on
 *    the east, its south wing 8.5; production greenhouses roof 12, a
 *    raised bay to 15.
 *  - published: Lord & Burnham, 1893 (OSM `architect` tag; Wikipedia,
 *    "Phipps Conservatory and Botanical Gardens"); welcome centre 2005.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Phipps Conservatory exterior 2014-12-29 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Phipps_Conservatory_exterior_2014-12-29_01.jpg
 *      Cbaile19, CC0 — the Palm Court, the stone link and the welcome dome.
 *    "Phipps Conservatory exterior 2014-12-29 03.jpg"
 *      https://commons.wikimedia.org/wiki/File:Phipps_Conservatory_exterior_2014-12-29_03.jpg
 *      Cbaile19, CC0 — the Palm Court and wings from the lawn: curved eaves,
 *      half-domed apse ends, the dome.
 *    "Phipps6.jpg"
 *      https://commons.wikimedia.org/wiki/File:Phipps6.jpg
 *      Lee Paxton, CC BY-SA 4.0 — a wing and a crossing pavilion with its
 *      cupola, white frames.
 *    "CSC 0156 (4341973752).jpg"
 *      https://commons.wikimedia.org/wiki/File:CSC_0156_(4341973752).jpg
 *      Christopher "Rice", CC BY-SA 2.0 — the welcome dome and the Palm
 *      Court's lantern in snow.
 *    "Phipps & Pitt (9510876061).jpg"
 *      https://commons.wikimedia.org/wiki/File:Phipps_%26_Pitt_(9510876061).jpg
 *      jimmy thomas, CC BY-SA 2.0 — the Tropical Forest conservatory from
 *      afar.
 *    "Phipps - 162.JPG"
 *      https://commons.wikimedia.org/wiki/File:Phipps_-_162.JPG
 *      Piotrus, CC BY-SA 3.0 — inside a house: the curved roof's ribs.
 *    USGS NAIP orthophoto (public domain): every roof's plan and glazing.
 *  - colour: glass a clear tint (STYLE.md), white-painted frames, the grey-
 *    buff stone of the dwarf walls and link, green planting.
 * Estimated: the curve of each roof (a quarter ellipse from the eave to
 * the ridge, as the photos show), the rib spacing (drawn at ~5 m, far
 * sparser than the real glazing bars), the pavilions' cupolas, the stone
 * walls' height (0.9 m above the ground), the planting (drawn as one green
 * mass per house).
 * Doubts: the modern greenhouses are seen only from the air and from
 * afar; their walls and roof steps are simplified. The western strip of
 * the production block (lidar ~5 m lower) is drawn at one roof height.
 *
 * Night: the glass stays dark (`glass`); nothing is lit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { poly, wallsSplit } from './pit-allegheny-county-courthouse'

// Every house is built on its own ground at y = 0: the map drapes a
// flat-based model over the terrain (web/landmark-ground.ts), lifting each
// low vertex by the rise of the ground under it, so the slope between the
// houses comes from the terrain and is not drawn into the model.
const B = 0
const LO = 0
const SILL = 0.9 // the stone dwarf walls' height above their ground

type Parts = { glass: Part; frame: Part; stone: Part; plant: Part }

/** A curvilinear house section: vertical glass to the eave, a quarter-ellipse roof to the ridge. */
function profile(W: number, e: number, h: number, r = 0.35, n = 3): [number, number][] {
  const out: [number, number][] = [[W, B + SILL], [W, B + e]]
  for (let k = 1; k <= n; k++) { const t = (k / n) * Math.PI / 2; out.push([r + (W - r) * Math.cos(t), B + e + (h - e) * Math.sin(t)]) }
  return out
}

/**
 * A straight glasshouse range from a to b (plan), half-width W, with each
 * end an apse (half-dome), a flat glazed gable, or open (joined to
 * another house).
 */
function house(P: Parts, a: XY, b: XY, W: number, e: number, h: number, ends: ['apse' | 'flat' | 'none', 'apse' | 'flat' | 'none'], ribEvery = 6.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nl: XY = [-u[1], u[0]]
  const prof = profile(W, e, h)
  const at = (c: XY, s: number, rho: number, z: number): V3 => [c[0] + nl[0] * rho * s, c[1] + nl[1] * rho * s, z]
  // glass sides and roof
  for (const s of [1, -1]) {
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const mid = (r0 + r1) / 2
      poly(P.glass, [at(a, s, r0, z0), at(b, s, r0, z0), at(b, s, r1, z1), at(a, s, r1, z1)], [nl[0] * s * (z1 - z0 + 0.01), nl[1] * s * (z1 - z0 + 0.01), (r0 - r1) + 0.001 * mid])
    }
    // stone dwarf wall, white eave band
    const sw = (p: XY, q: XY, z0: number, z1: number) => poly(P.stone, [[p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1]], [nl[0] * s, nl[1] * s, 0])
    const pa: XY = [a[0] + nl[0] * W * s, a[1] + nl[1] * W * s], pb: XY = [b[0] + nl[0] * W * s, b[1] + nl[1] * W * s]
    const n = Math.max(1, Math.ceil(L / 5))
    for (let i = 0; i < n; i++) {
      const p: XY = [pa[0] + (pb[0] - pa[0]) * i / n, pa[1] + (pb[1] - pa[1]) * i / n], q: XY = [pa[0] + (pb[0] - pa[0]) * (i + 1) / n, pa[1] + (pb[1] - pa[1]) * (i + 1) / n]
      sw(p, q, 0, B + SILL)
    }
    const ep = (z: number, o: number): V3[] => [at(a, s, W + o, z), at(b, s, W + o, z)]
    const [e0, e1] = ep(B + e - 0.25, 0.06), [e2, e3] = ep(B + e + 0.05, 0.06)
    poly(P.frame, [e0, e1, e3, e2], [nl[0] * s, nl[1] * s, 0])
  }
  // ridge cap
  {
    const r = prof[prof.length - 1][0] + 0.15, z = prof[prof.length - 1][1] + 0.12
    poly(P.frame, [at(a, 1, r, z), at(a, -1, r, z), at(b, -1, r, z), at(b, 1, r, z)], [0, 0, 1])
  }
  // ribs across the roof, outside the glass
  const nr = Math.max(1, Math.round(L / ribEvery))
  for (let i = 0; i <= nr; i++) {
    const c: XY = [a[0] + u[0] * L * i / nr, a[1] + u[1] * L * i / nr]
    for (const s of [1, -1]) for (let k = 1; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1], o = 0.06
      const A = at([c[0] - u[0] * 0.13, c[1] - u[1] * 0.13], s, r0 + o, z0 + o), Bq = at([c[0] + u[0] * 0.13, c[1] + u[1] * 0.13], s, r0 + o, z0 + o)
      const C = at([c[0] + u[0] * 0.13, c[1] + u[1] * 0.13], s, r1 + o * 0.3, z1 + o), D = at([c[0] - u[0] * 0.13, c[1] - u[1] * 0.13], s, r1 + o * 0.3, z1 + o)
      poly(P.frame, [A, Bq, C, D], [nl[0] * s * (z1 - z0), nl[1] * s * (z1 - z0), r0 - r1])
    }
  }
  // planting inside, a green mass
  {
    const w = W * 0.5, hh = B + Math.min(e * 0.7, 3.2)
    const q = [at(a, 1, w, hh), at(b, 1, w, hh), at(b, -1, w, hh), at(a, -1, w, hh)]
    const base = q.map((p) => [p[0], p[1], B] as V3)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; P.plant.quad(base[k], base[j], q[j], q[k]) }
    const ring: XY[] = q.map((p) => [p[0], p[1]])
    const ccw = (ring[1][0] - ring[0][0]) * (ring[2][1] - ring[0][1]) - (ring[1][1] - ring[0][1]) * (ring[2][0] - ring[0][0]) > 0 ? ring : [...ring].reverse()
    cap(P.plant, ccw, hh)
  }
  // ends
  const endAt = (c: XY, dir: number, kind: string) => {
    if (kind === 'flat') {
      const pts: V3[] = [...prof.map(([r, z]) => at(c, 1, r, z)), ...[...prof].reverse().map(([r, z]) => at(c, -1, r, z))]
      poly(P.glass, pts, [u[0] * dir, u[1] * dir, 0])
      poly(P.stone, [at(c, 1, W, 0), at(c, -1, W, 0), at(c, -1, W, B + SILL), at(c, 1, W, B + SILL)], [u[0] * dir, u[1] * dir, 0])
    } else if (kind === 'apse') {
      const seg = 8
      const ang = (i: number) => (i / seg) * Math.PI // from +nl round through the end to -nl
      const dirv = (t: number): XY => [nl[0] * Math.cos(t) + u[0] * dir * Math.sin(t), nl[1] * Math.cos(t) + u[1] * dir * Math.sin(t)]
      for (let i = 0; i < seg; i++) {
        const d0 = dirv(ang(i)), d1 = dirv(ang(i + 1)), dm = dirv((ang(i) + ang(i + 1)) / 2)
        for (let k = 0; k < prof.length - 1; k++) {
          const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
          const p = (d: XY, r: number, z: number): V3 => [c[0] + d[0] * r, c[1] + d[1] * r, z]
          poly(P.glass, [p(d0, r0, z0), p(d1, r0, z0), p(d1, r1, z1), p(d0, r1, z1)], [dm[0] * (z1 - z0 + 0.01), dm[1] * (z1 - z0 + 0.01), r0 - r1])
          if (k > 0 && i % 2 === 0) {
            const o = 0.06
            poly(P.frame, [p(d0, r0 + o, z0 + o), p(dirv(ang(i) + 0.05), r0 + o, z0 + o), p(dirv(ang(i) + 0.05), r1 + o * 0.3, z1 + o), p(d0, r1 + o * 0.3, z1 + o)], [dm[0], dm[1], r0 - r1])
          }
        }
        const p = (d: XY, z: number): V3 => [c[0] + d[0] * W, c[1] + d[1] * W, z]
        poly(P.stone, [p(d0, 0), p(d1, 0), p(d1, B + SILL), p(d0, B + SILL)], [dm[0], dm[1], 0])
        const po = (d: XY, z: number): V3 => [c[0] + d[0] * (W + 0.06), c[1] + d[1] * (W + 0.06), z]
        poly(P.frame, [po(d0, B + e - 0.25), po(d1, B + e - 0.25), po(d1, B + e + 0.05), po(d0, B + e + 0.05)], [dm[0], dm[1], 0])
      }
    }
  }
  endAt(a, -1, ends[0])
  endAt(b, 1, ends[1])
}

/** Rounded-rectangle ring centred (cx, cy), half-extents hx, hy, corner radius rr. */
function rrect(cx: number, cy: number, hx: number, hy: number, rr: number, z: number, n = 3): V3[] {
  const out: V3[] = []
  const cs: [number, number, number][] = [[hx - rr, -(hy - rr), -Math.PI / 2], [hx - rr, hy - rr, 0], [-(hx - rr), hy - rr, Math.PI / 2], [-(hx - rr), -(hy - rr), Math.PI]]
  for (const [ox, oy, a0] of cs) for (let i = 0; i <= n; i++) { const t = a0 + (i / n) * Math.PI / 2; out.push([cx + ox + rr * Math.cos(t), cy + oy + rr * Math.sin(t), z]) }
  return out
}

/** A bell-curved hipped glasshouse over a rectangle: vertical glass to e, then a quarter-ellipse roof to a ridge. */
function hippedHouse(P: Parts, cx: number, cy: number, hx: number, hy: number, e: number, h: number, ridgeHalf = 0.4, n = 5) {
  const rings: V3[][] = [rrect(cx, cy, hx, hy, 0.8, B + SILL), rrect(cx, cy, hx, hy, 0.8, B + e)]
  const D = Math.min(hx, hy) - ridgeHalf
  for (let k = 1; k <= n; k++) {
    const t = (k / n) * Math.PI / 2, d = D * (1 - Math.cos(t))
    rings.push(rrect(cx, cy, hx - d, hy - d, Math.max(0.3, 0.8 - d * 0.1), B + e + (h - e) * Math.sin(t)))
  }
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    for (let i = 0; i < r0.length; i++) {
      const j = (i + 1) % r0.length
      const m: V3 = [(r0[i][0] + r0[j][0]) / 2 - cx, (r0[i][1] + r0[j][1]) / 2 - cy, 0.2]
      poly(P.glass, [r0[i], r0[j], r1[j], r1[i]], m)
    }
  }
  const top = rings[rings.length - 1]
  poly(P.frame, top.map(([x, y, z]) => [x, y, z + 0.05] as V3), [0, 0, 1])
  // stone dwarf wall, eave band, ribs at the corners and every ~5 m
  const base = rrect(cx, cy, hx, hy, 0.8, 0)
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length
    const m: V3 = [(base[i][0] + base[j][0]) / 2 - cx, (base[i][1] + base[j][1]) / 2 - cy, 0]
    poly(P.stone, [base[i], base[j], [base[j][0], base[j][1], B + SILL], [base[i][0], base[i][1], B + SILL]], m)
    const r = rings[1], o = 1.004
    poly(P.frame, [[cx + (r[i][0] - cx) * o, cy + (r[i][1] - cy) * o, B + e - 0.3], [cx + (r[j][0] - cx) * o, cy + (r[j][1] - cy) * o, B + e - 0.3], [cx + (r[j][0] - cx) * o, cy + (r[j][1] - cy) * o, B + e + 0.05], [cx + (r[i][0] - cx) * o, cy + (r[i][1] - cy) * o, B + e + 0.05]], m)
  }
  // ribs: on every ring vertex at the corners' middle and along the long sides
  for (let i = 0; i < rings[1].length; i += 4) {
    for (let k = 1; k < rings.length - 1; k++) {
      const p0 = rings[k][i], p1 = rings[k + 1][i], q0 = rings[k][(i + 1) % rings[k].length]
      const tx = q0[0] - p0[0], ty = q0[1] - p0[1], tl = Math.hypot(tx, ty) || 1, w = 0.13
      const m: V3 = [p0[0] - cx, p0[1] - cy, 0.3]
      const off = (p: V3, s: number): V3 => [p[0] + tx / tl * w * s + (p[0] - cx) * 0.004, p[1] + ty / tl * w * s + (p[1] - cy) * 0.004, p[2] + 0.05]
      poly(P.frame, [off(p0, -1), off(p0, 1), off(p1, 1), off(p1, -1)], m)
    }
  }
  // planting
  // low planting, with a taller clump of palms in the middle of a big house
  const pr = rrect(cx, cy, hx * 0.6, hy * 0.7, 1.5, 0).map(([x, y]) => [x, y] as XY)
  walls(P.plant, pr, B, B + 3.2)
  cap(P.plant, pr, B + 3.2)
  if (h > 15) {
    const pc = rrect(cx, cy, hx * 0.25, hy * 0.3, 1.2, 0).map(([x, y]) => [x, y] as XY)
    walls(P.plant, pc, B + 3.2, B + 10)
    cap(P.plant, pc, B + 10)
  }
}

/** A small lantern cupola: glass drum and a white cap. */
function cupola(P: Parts, cx: number, cy: number, r: number, z0: number, z1: number) {
  const n = 8, ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [cx + rr * Math.cos(i * Math.PI * 2 / n), cy + rr * Math.sin(i * Math.PI * 2 / n), z] as V3)
  const a = ring(r, z0), b = ring(r, z1), t: V3 = [cx, cy, z1 + r * 1.2]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, m: V3 = [Math.cos((i + 0.5) * Math.PI * 2 / n), Math.sin((i + 0.5) * Math.PI * 2 / n), 0]
    poly(P.glass, [a[i], a[j], b[j], b[i]], m)
    poly(P.frame, [b[i], b[j], t], [m[0], m[1], 0.6])
  }
}

function build() {
  const P: Parts = { glass: new Part(), frame: new Part(), stone: new Part(), plant: new Part() }
  const opaque = new Part()

  // ---- the 1893 glasshouses
  hippedHouse(P, 38.2, -17.5, 9.2, 20, 7, 19.5) // Palm Court
  cupola(P, 38.2, -17.5, 1.1, B + 19.4, B + 20.6)
  house(P, [37.4, 2.0], [37.4, 37.5], 5.4, 4.5, 6.8, ['none', 'none']) // north spine
  house(P, [8.8, 42.5], [66.2, 42.5], 5, 4.5, 6.5, ['apse', 'apse']) // north cross range
  hippedHouse(P, 37.4, 42.5, 6.2, 6.2, 5.2, 10.5) // north crossing pavilion
  cupola(P, 37.4, 42.5, 1.0, B + 10.4, B + 11.6)
  house(P, [39.4, -37.0], [39.4, -70.5], 4.4, 4.5, 6.8, ['none', 'none']) // south spine
  house(P, [13.0, -76.5], [67.7, -76.5], 6, 4.5, 7, ['apse', 'apse']) // south cross range
  hippedHouse(P, 39.4, -76.5, 7, 7, 5.5, 12) // south crossing pavilion
  cupola(P, 39.4, -76.5, 1.1, B + 11.9, B + 13.1)
  house(P, [-3.75, -17.5], [29.2, -17.5], 7.5, 5, 10, ['flat', 'none']) // west hall
  house(P, [15, 11.25], [15, -46.25], 6.25, 4.5, 6.5, ['apse', 'apse']) // west cross range
  house(P, [12.75, -62], [35.2, -62], 4, 4, 6, ['apse', 'none']) // small south-west house

  // ---- welcome centre: a stone link from the Palm Court, the glass dome
  {
    const r = rect(47.2, -21, 56.5, -13.5)
    wallsSplit(P.stone, r, 0, B + 5.5)
    cap(P.stone, r, B + 5.5)
    const cx = 62.5, cy = -17.5, R = 7, z0 = B + 1.8, n = 16
    const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [cx + rr * Math.cos(i * Math.PI * 2 / n), cy + rr * Math.sin(i * Math.PI * 2 / n), z] as V3)
    const stoneRing = ring(R, 0).map(([x, y]) => [x, y] as XY)
    wallsSplit(P.stone, stoneRing, 0, z0)
    const steps = 5
    let prev = ring(R, z0)
    for (let k = 1; k <= steps; k++) {
      const t = (k / steps) * Math.PI / 2, rr = Math.max(0.9, R * Math.cos(t)), z = z0 + 8.2 * Math.sin(t)
      const cur = ring(rr, z)
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, m: V3 = [Math.cos((i + 0.5) * Math.PI * 2 / n), Math.sin((i + 0.5) * Math.PI * 2 / n), Math.sin(t)]
        poly(P.glass, [prev[i], prev[j], cur[j], cur[i]], m)
        if (i % 2 === 0) {
          const o = 1.01
          const A: V3 = [cx + (prev[i][0] - cx) * o, cy + (prev[i][1] - cy) * o, prev[i][2] + 0.04], Bq: V3 = [cx + (cur[i][0] - cx) * o, cy + (cur[i][1] - cy) * o, cur[i][2] + 0.04]
          const tx = -(prev[i][1] - cy), ty = prev[i][0] - cx, tl = Math.hypot(tx, ty) || 1, w = 0.14
          poly(P.frame, [[A[0] - tx / tl * w, A[1] - ty / tl * w, A[2]], [A[0] + tx / tl * w, A[1] + ty / tl * w, A[2]], [Bq[0] + tx / tl * w, Bq[1] + ty / tl * w, Bq[2]], [Bq[0] - tx / tl * w, Bq[1] - ty / tl * w, Bq[2]]], [m[0], m[1], 0.5])
        }
      }
      prev = cur
    }
    cupola(P, cx, cy, 0.9, z0 + 8.1, z0 + 9.0)
    // the lobby beneath is lit stone and planting: a green mass shows through
    walls(P.plant, ring(R * 0.6, 0).map(([x, y]) => [x, y] as XY), B, B + 3)
  }

  // ---- the Tropical Forest conservatory: curved west wall, sloping glass roof
  {
    const tf: XY[] = [[-5, -69], [-3.8, -44], [-3.8, -5], [-31, -5], [-34, -12], [-35.5, -22], [-33, -34], [-25, -39], [-21, -48], [-22, -58], [-25, -69]]
    const roofZ = ([x, y]: XY) => LO + (y > -44 ? 20.5 - (x + 34) * (7 / 30) : 8.5)
    // walls: glass over a stone base, each edge up to the roof over it
    for (let i = 0; i < tf.length; i++) {
      const a = tf[i], b = tf[(i + 1) % tf.length]
      const za = roofZ(a), zb = roofZ(b)
      const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      poly(P.stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], LO + 3.2], [a[0], a[1], LO + 3.2]], n)
      poly(P.glass, [[a[0], a[1], LO + 3.2], [b[0], b[1], LO + 3.2], [b[0], b[1], zb], [a[0], a[1], za]], n)
      poly(P.frame, [[a[0], a[1], za - 0.3], [b[0], b[1], zb - 0.3], [b[0], b[1], zb + 0.05], [a[0], a[1], za + 0.05]], n)
    }
    // the high roof (north part) and the low south wing roof
    const hi: XY[] = [[-3.8, -44], [-3.8, -5], [-31, -5], [-34, -12], [-35.5, -22], [-33, -34], [-25, -39], [-22.5, -44]]
    for (let i = 1; i < hi.length - 1; i++) poly(P.glass, [[hi[0][0], hi[0][1], roofZ(hi[0])], [hi[i][0], hi[i][1], roofZ(hi[i])], [hi[i + 1][0], hi[i + 1][1], roofZ(hi[i + 1])]], [0.2, 0, 1])
    const lo: XY[] = [[-5, -69], [-4.2, -44], [-22.5, -44], [-21, -48], [-22, -58], [-25, -69]]
    cap(P.glass, lo, LO + 8.5)
    // the step between them
    poly(P.glass, [[-22.5, -44, LO + 8.5], [-4.2, -44, LO + 8.5], [-4.2, -44, roofZ([-4.2, -43.9])], [-22.5, -44, roofZ([-22.5, -43.9])]], [0, -1, 0])
    // frames across the high roof every ~6 m
    for (let x = -30; x <= -6; x += 6) poly(P.frame, [[x - 0.15, -43.5, roofZ([x, -40]) + 0.05], [x + 0.15, -43.5, roofZ([x, -40]) + 0.05], [x + 0.15, -5.3, roofZ([x, -40]) + 0.05], [x - 0.15, -5.3, roofZ([x, -40]) + 0.05]], [0, 0, 1])
    // the forest inside
    const f: XY[] = [[-7, -40], [-7, -8], [-29, -8], [-32, -22], [-27, -36]]
    walls(P.plant, f, LO, LO + 8); cap(P.plant, f, LO + 8)
    const f2: XY[] = [[-8, -66], [-8, -46], [-20, -46], [-21, -62]]
    walls(P.plant, f2, LO, LO + 6); cap(P.plant, f2, LO + 6)
  }

  // ---- production greenhouses: flat pale glass roofs on the slope
  {
    const pg: XY[] = [[-55, -5], [-3.8, -5], [-1, 57], [-7.5, 57], [-7.5, 71], [-46, 71], [-46, 60], [-60, 60], [-60, 54], [-66, 54], [-66, 39], [-60, 39], [-60, 20]]
    wallsSplit(P.stone, pg, 0, LO + 7)
    wallsSplit(opaque, pg, LO + 7, LO + 12)
    cap(opaque, pg, LO + 12)
    // the raised bay
    const rb = rect(-52, 50, -8, 58)
    walls(opaque, rb, LO + 12, LO + 15); cap(opaque, rb, LO + 15)
    // white roof frames every 8 m
    for (let y = 3; y <= 66; y += 8) {
      const x0 = y > 57 ? -45.5 : y > 39 ? -59.5 : -58, x1 = y > 57 ? -8 : -2.5
      const z = LO + (y >= 50 && y <= 58 ? 15.05 : 12.05)
      poly(P.frame, [[x0, y - 0.18, z], [x1, y - 0.18, z], [x1, y + 0.18, z], [x0, y + 0.18, z]], [0, 0, 1])
    }
  }

  return [
    { part: P.glass, material: { ...finish('glass', 0x7fc4de, 0.24), opacity: 0.3, doubleSided: true } },
    { part: P.frame, material: finish('frame-white', 0xf4f1ea) },
    { part: P.stone, material: finish('phipps-stone', 0xd8cdbb) },
    { part: P.plant, material: finish('planting', 0x7f9f6c) },
    { part: opaque, material: finish('glass-2', 0xa4c4d9, 0.24) },
  ]
}

if (import.meta.main) await save('pit-phipps-conservatory', 'Phipps Conservatory', [40.4388412, -79.9481899], 318.4, build() as any, 6500)
