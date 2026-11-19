/**
 * Olympiastadion Berlin, Westend (Werner March, 1934-36; rebuilt and roofed
 * by von Gerkan, Marg und Partner, 2000-04): procedural, CC0-1.0, no
 * textures. bun generators/berlin-olympiastadion.ts
 *
 * Writes models/berlin-olympiastadion.glb (low) and
 * models/berlin-olympiastadion.detail.glb (detail: finer rings, bevelled
 * pillars, the windows behind the colonnade, the roof's radial girders and
 * round columns, the Marathon stair's steps).
 *
 * Map frame: x along the stadium's long axis (+x is compass 81.8, towards
 * the Olympic Gate; -x towards the Marathon Gate and the Maifeld), y across
 * it, z up, metres, BEARING 351.8 (model +y is compass 351.8). Anchor: the
 * centre of the oval of OSM way/24296022, lng 13.239530, lat 52.514657.
 * z = 0 is the field. The field lies 14.6 m below the ground outside (the
 * arena recessed 12 m in 1936 and the field lowered a further 2.65 m in
 * 2000-04, en.wikipedia), and the colonnade, the plateau and the pylons
 * stand at z = 14.6. `elevation` is 0, not -14.6: the map's Mapterhorn
 * terrain already holds the bowl (its grid over the site reads the field
 * 14.1-15.8 m under the rim, the same depth as the published figures), so
 * the map's lowest ground under the footprint is the field itself.
 * `bun tools/terrain.ts check` passes at 0 and buries every seat at -14.6.
 * The pitch, the track and the ground are the map's and are not drawn.
 *
 * What makes it the Olympiastadion, and how each is drawn
 * - The oval colonnade of square limestone pillars standing round the
 *   whole outside, each a real 3D pillar, under a plain entablature and
 *   attic; the recessed wall behind them.
 * - The Marathon Gate: the ring broken at the west, the two massive stone
 *   pylons flanking the gap, the plateau with the fire bowl, the stair down
 *   to the field, and the view through to the Maifeld.
 * - The bowl sunk into the ground: the lower tier falling from the ground
 *   to the field, the upper tier rising over the colonnade's height; dark
 *   anthracite seats.
 * - The 2004 roof ring: a thin dark-edged membrane ring on twenty slender
 *   steel columns standing on the upper tier, hovering over the colonnade,
 *   its inner band glazed; open over the Marathon Gate.
 *
 * Evidence
 * - OSM (ODbL): the stadium building way/24296022 (building=stadium,
 *   height=21, roof:colour=white): its outer ring is the pillar line
 *   (303.4 x 228.0 m in this frame), its inner ring the roof's inner edge
 *   (187 x 112 m), broken at the west between y = -13.3 and +13.3, with the
 *   pylons' notches at x = -169.3; the grounds way/38862723 (leisure=
 *   stadium, "Olympiastadion Berlin", wikidata Q151374).
 * - Published (de.wikipedia "Olympiastadion Berlin"; en.wikipedia
 *   "Olympiastadion (Berlin)"): 303.48 m long, 228.31 m wide pillar to
 *   pillar; only the upper ring rises above the ground, carried on many
 *   reinforced-concrete pillars clad in Franconian Muschelkalk; the lower
 *   half recessed 12 m, the field lowered 2.65 m more in 2000-04; the roof
 *   37,000 m2 on 20 columns, transparent panels, open over the Marathon
 *   Gate; the stadium 17 m high above the ground.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Olympiastadion Berlin 2015.jpg", Thomas Wolf, CC BY-SA 3.0 de (the east
 *     front square on: pillar rhythm 7.1 m, pillars 14.2 m, entablature,
 *     attic to 17 m, the roof's edge to 21.5 m)
 *     https://commons.wikimedia.org/wiki/File:Olympiastadion_Berlin_2015.jpg
 *   "Berlin-OlympiastadionSeiteMarathontor1-Asio.jpg", Asio otus, CC BY-SA
 *     3.0 de (the Marathon Gate: pylons, the gap, the roof ends)
 *     https://commons.wikimedia.org/wiki/File:Berlin-OlympiastadionSeiteMarathontor1-Asio.jpg
 *   "Olympiastadion Berlin Innenansicht.jpg", Jan Künzel, CC BY-SA 4.0 (from
 *     the Marathon plateau: the fire bowl, tiers, roof underside and glazing)
 *     https://commons.wikimedia.org/wiki/File:Olympiastadion_Berlin_Innenansicht.jpg
 *   "Berliner Olympiastadion day.jpg", Tobi 87, CC BY 3.0 (the bowl: both
 *     tiers, the roof ring, the columns)
 *     https://commons.wikimedia.org/wiki/File:Berliner_Olympiastadion_day.jpg
 *   "Berlin Olympic Stadium Roof.jpg", Melvinvk, CC BY-SA 4.0 (the roof's
 *     glazed inner band and the Marathon gap)
 *     https://commons.wikimedia.org/wiki/File:Berlin_Olympic_Stadium_Roof.jpg
 *   "Berlin, Olympiastadion -- 2019 -- 6339.jpg" and "-- 6343.jpg", Dietmar
 *     Rabich, CC BY-SA 4.0; "Berliner Olympiastadion, Gesamtansicht
 *     2013.jpg", Rebecca Leisten, CC BY-SA 4.0; "Berliner Olympiastadion
 *     night.jpg", Tobi 87, CC BY 3.0 (night: the floodlit colonnade, the lit
 *     roof ring).
 * - On review: the walk behind the pillars (6 m deep) and its ceiling are
 *   drawn in the dark seat grey so the pillars stand out as the photos show
 *   them; the roof's top is mid grey with a 1.2 m dark edge.
 * - Estimated: the tiers' sections (lower tier from the field's podium at
 *   2.5 m up to the ground; upper tier from 1.4 m over the ground to
 *   14.4 m), the pylons' size (from the Asio otus photo: 28 x 15 m, 22.5 m
 *   high), the roof's thickness and the glazed band's width (15 m), the
 *   columns' positions (on the upper tier, 12 m in from the pillars).
 * - Look-only references: none.
 * - Doubts: the field depth (14.6 m) adds the published 2.65 m to the
 *   rounded 12 m of 1936; the Olympic Gate's two towers (Bayernturm and
 *   Preußenturm) are separate OSM buildings 70 m east and are not part of
 *   this model; the scoreboards, flagpoles and the VIP tribune are left out.
 *
 * Night: the colonnade is floodlit (`_FLOODLIGHT`); the windows behind it
 * glow; the glazed roof band stays dark.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { mat } from './berlin-konzerthaus'
import { beam, box, cone, fquad, ftri, polyTris } from './berlin-oberbaum-bridge'

export const ID = 'berlin-olympiastadion'
export const BEARING = 351.8

type XY = [number, number]
const TAU = Math.PI * 2

// The pillar line: a superellipse (OSM outer ring).
const A = 151.7, B = 114.0, NEXP = 2.1
// Heights above the field (see header).
const G = 14.6 // the ground outside
const Z_PIL = G + 14.2, Z_ENT = G + 15.5, Z_ATT = G + 17.0
const Z_ROOF0 = G + 20.2, Z_ROOF1 = G + 21.4
// The Marathon Gate: the gap's half-width and the pylons.
const GAP = 13.3, PYL_X0 = -155.5, PYL_X1 = -127.5, PYL_W = 15.0, Z_PYL = G + 22.5

/** A point on the ring offset d inwards from the pillar line, at parameter t. */
function ringPt(d: number, t: number): XY {
  const c = Math.cos(t), s = Math.sin(t), e = 2 / NEXP
  return [(A - d) * Math.sign(c) * Math.abs(c) ** e, (B - d) * Math.sign(s) * Math.abs(s) ** e]
}
/** The parameter where ring d meets the gap's edge y = ±GAP on the west side. */
function gapT(d: number) {
  const s = (GAP / (B - d)) ** (NEXP / 2)
  return Math.asin(Math.min(1, s))
}
/** Samples along ring d from the gap's south edge round the east to its north edge. */
function ringSamples(d: number, n: number): XY[] {
  const g = gapT(d)
  // From t = -(π - g) (south side of the gap) through 0 (east) to π - g.
  const t0 = -(Math.PI - g), t1 = Math.PI - g
  return Array.from({ length: n + 1 }, (_, k) => ringPt(d, t0 + ((t1 - t0) * k) / n))
}

/**
 * A surface swept round the ring between two profile points (d, z): each
 * a ring of samples; faces toward `side` (+1: up or outward, the
 * normal's sign checked against `hint`).
 */
function sweep(p: Part, n: number, a: [number, number], b: [number, number], hint: (P: V3) => V3) {
  const ra = ringSamples(a[0], n), rb = ringSamples(b[0], n)
  for (let k = 0; k < n; k++) {
    const P0: V3 = [...ra[k], a[1]], P1: V3 = [...ra[k + 1], a[1]], Q1: V3 = [...rb[k + 1], b[1]], Q0: V3 = [...rb[k], b[1]]
    const c: V3 = [(P0[0] + Q1[0]) / 2, (P0[1] + Q1[1]) / 2, (P0[2] + Q1[2]) / 2]
    const h = hint(c)
    fquad(p, P0, P1, Q1, Q0, h)
  }
}
const up = (): V3 => [0, 0, 1]
const down = (): V3 => [0, 0, -1]
/** Outward (away from the centre) horizontally. */
const outward = (c: V3): V3 => { const l = Math.hypot(c[0] / A ** 2, c[1] / B ** 2) || 1; return [c[0] / A ** 2 / l, c[1] / B ** 2 / l, 0] }
const inward = (c: V3): V3 => { const o = outward(c); return [-o[0], -o[1], 0] }
const blend = (f: (c: V3) => V3, g: (c: V3) => V3, k: number) => (c: V3): V3 => { const a = f(c), b = g(c); return [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]] }

/** Close a gap end: the section polygon (d, z) drawn in the plane at the gap's edge. */
function endCap(p: Part, n: number, prof: [number, number][], south: boolean) {
  const pts: V3[] = prof.map(([d, z]) => {
    const r = ringSamples(d, n), q = south ? r[0] : r[n]
    return [q[0], q[1], z]
  })
  const nrm: V3 = [0, south ? 1 : -1, 0] // facing into the gap
  // The section in (x, z); the gap's edge plane is nearly y = const.
  const key = (q: XY) => `${q[0].toFixed(5)},${q[1].toFixed(5)}`
  const byKey = new Map(pts.map((q) => [key([q[0], q[2]]), q] as [string, V3]))
  for (const [a, b, c] of polyTris(pts.map((q) => [q[0], q[2]] as XY))) ftri(p, byKey.get(key(a))!, byKey.get(key(b))!, byKey.get(key(c))!, nrm)
}

type Mats = { stone: Part; seats: Part; roof: Part; under: Part; glass: Part; win: Part }

function bowl(m: Mats, detail: boolean) {
  const n = detail ? 240 : 80
  // The section from the field out (d inward from the pillar line, z).
  const P: Record<string, [number, number]> = {
    pod0: [60, 0], pod1: [60, 2.5], low1: [36, G - 0.6], conc0: [33.5, G], conc1: [31, G],
    up0: [31, G + 1.4], up1: [9, G + 14.4], back: [9, Z_ATT], att: [-0.8, Z_ATT],
  }
  // Podium wall at the field's edge, faces the field.
  sweep(m.stone, n, P.pod0, P.pod1, inward)
  // Lower tier (seats), the concourse, the upper tier's front wall, upper tier.
  sweep(m.seats, n, P.pod1, P.low1, blend(up, inward, 0.4))
  sweep(m.stone, n, P.low1, P.conc0, blend(up, inward, 0.4))
  sweep(m.stone, n, P.conc0, P.conc1, up)
  sweep(m.stone, n, P.conc1, P.up0, inward)
  sweep(m.seats, n, P.up0, P.up1, blend(up, inward, 0.5))
  // The back wall over the top row, the attic's top out to the edge.
  sweep(m.stone, n, P.up1, P.back, inward)
  sweep(m.stone, n, P.back, P.att, up)
  // Outside: the attic and entablature faces, the soffit, the recessed wall.
  sweep(m.stone, n, [-0.8, Z_ATT], [-0.8, Z_ENT], outward)
  sweep(m.stone, n, [-0.8, Z_ENT], [-1.3, Z_ENT], up)
  sweep(m.stone, n, [-1.3, Z_ENT], [-1.3, Z_PIL], outward)
  // The deep walk behind the pillars, in shadow: its ceiling and back wall.
  sweep(m.seats, n, [-1.3, Z_PIL], [6.0, Z_PIL], down)
  sweep(m.seats, n, [6.0, Z_PIL], [6.0, G], outward)
  // Gap ends: the section closed in a wall facing the gap.
  const prof: [number, number][] = [[60, G], P.pod1, P.low1, P.conc0, P.conc1, P.up0, P.up1, P.back, P.att, [-0.8, Z_ENT], [-1.3, Z_ENT], [-1.3, Z_PIL], [6.0, Z_PIL], [6.0, G]]
  // The section reaches below the plateau only inside the bowl.
  const prof2: [number, number][] = [P.pod0, P.pod1, P.low1, P.conc0, [33.5, 0]]
  for (const south of [true, false]) {
    endCap(m.stone, n, prof, south)
    endCap(m.stone, n, prof2, south)
  }
}

/** The colonnade: square pillars at an even pitch round the pillar line. */
function colonnade(m: Mats, detail: boolean) {
  // Arc-length table of the pillar line.
  const N = 4000, pts: XY[] = [], cum: number[] = [0]
  const g = gapT(0)
  for (let k = 0; k <= N; k++) {
    const t = -(Math.PI - g) + ((2 * (Math.PI - g)) * k) / N
    pts.push(ringPt(0, t))
    if (k) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  }
  const total = cum[N], pitch = 7.1
  const count = Math.round(total / pitch)
  const w = 2.3, dep = 3.0
  let j = 0
  let prev: XY | null = null
  for (let i = 0; i <= count; i++) {
    const s = (total * i) / count
    while (j < N - 1 && cum[j + 1] < s) j++
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    const c: XY = [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f]
    if (c[0] < PYL_X1 + 1 && Math.abs(c[1]) < GAP + PYL_W + 1) { prev = null; continue } // behind the pylons
    const o = outward([c[0], c[1], 0]), tng: XY = [-o[1], o[0]]
    // The recessed wall's openings in the bay behind: a doorway, a window over it.
    if (prev) {
      const mid: XY = [(prev[0] + c[0]) / 2, (prev[1] + c[1]) / 2]
      const om = outward([mid[0], mid[1], 0]), tm: XY = [-om[1], om[0]]
      const at = (u: number, z: number): V3 => [mid[0] - om[0] * 5.98 + tm[0] * u, mid[1] - om[1] * 5.98 + tm[1] * u, z]
      const hw = pitch * 0.27
      for (const [z0, z1] of [[G + 0.4, G + 5.6], [G + 7.2, G + 10.6]]) fquad(m.win, at(-hw, z0), at(hw, z0), at(hw, z1), at(-hw, z1), [om[0], om[1], 0])
    }
    prev = c
    // Corners, chamfered in detail.
    const ch = detail ? 0.25 : 0
    const P = (u: number, v: number): XY => [c[0] + tng[0] * u + o[0] * v, c[1] + tng[1] * u + o[1] * v]
    const ring: XY[] = ch
      ? [P(-w / 2 + ch, -dep / 2), P(w / 2 - ch, -dep / 2), P(w / 2, -dep / 2 + ch), P(w / 2, dep / 2 - ch), P(w / 2 - ch, dep / 2), P(-w / 2 + ch, dep / 2), P(-w / 2, dep / 2 - ch), P(-w / 2, -dep / 2 + ch)]
      : [P(-w / 2, -dep / 2), P(w / 2, -dep / 2), P(w / 2, dep / 2), P(-w / 2, dep / 2)]
    const ccw = ring.reduce((s2, a, k) => { const b = ring[(k + 1) % ring.length]; return s2 + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? ring : [...ring].reverse()
    m.stone.loft([ccw.map(([x, y]) => [x, y, G] as V3), ccw.map(([x, y]) => [x, y, Z_PIL] as V3)])
    if (detail) {
      // A plinth course and a capital band.
      const big = (k: number) => ccw.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as XY)
      const b1 = big(1.12)
      m.stone.loft([b1.map(([x, y]) => [x, y, G] as V3), b1.map(([x, y]) => [x, y, G + 0.6] as V3)])
      m.stone.cap(b1.map(([x, y]) => [x, y, G + 0.6] as V3), true)
    }
  }
}

/** The Marathon Gate: the pylons, the plateau with its fire bowl, the stair down. */
function marathonGate(m: Mats, detail: boolean) {
  for (const sy of [-1, 1]) {
    const y0 = sy * GAP, y1 = sy * (GAP + PYL_W)
    box(m.stone, PYL_X0, Math.min(y0, y1), PYL_X1, Math.max(y0, y1), G, Z_PYL)
    if (detail) box(m.stone, PYL_X0 - 0.3, Math.min(y0, y1) - 0.3, PYL_X1 + 0.3, Math.max(y0, y1) + 0.3, G, G + 0.8)
  }
  // The plateau (a terrace over the Marathon tunnel), its edge wall to the bowl.
  const xIn = -(A - 33.5)
  box(m.stone, -(A - 0.5), -GAP, xIn, GAP, G - 1.0, G)
  // The stair to the field: a sloped run with side walls.
  const xBot = -(A - 60) + 1
  fquad(m.stone, [xIn, -6, G - 1.0], [xIn, 6, G - 1.0], [xBot, 6, 2.5], [xBot, -6, 2.5], [0.5, 0, 0.85])
  if (detail) {
    const steps = 24
    for (let i = 0; i < steps; i++) {
      const xa = xIn + ((xBot - xIn) * i) / steps, xb = xIn + ((xBot - xIn) * (i + 1)) / steps
      const za = G - 1.0 + ((2.5 - G + 1.0) * i) / steps, zb = G - 1.0 + ((2.5 - G + 1.0) * (i + 1)) / steps
      box(m.stone, xb, -6, xa, 6, zb, za + 0.02)
    }
  }
  // The fire bowl on its tripod.
  const fx = xIn - 5, k = detail ? 24 : 10
  for (let i = 0; i < 3; i++) {
    const a = (i * TAU) / 3
    beam(m.roof, [fx + 1.7 * Math.cos(a), 1.7 * Math.sin(a), G], [fx + 1.7 * Math.cos(a), 1.7 * Math.sin(a), G + 4.2], 0.45)
  }
  cone(m.roof, fx, 0, 1.6, 3.4, G + 4.2, G + 5.4, k)
}

/** The roof ring on its twenty columns. */
function roofRing(m: Mats, detail: boolean) {
  const n = detail ? 240 : 80
  const dOut = -1.2, dIn = 58.0, dGl = 43.0
  const zU = (d: number) => Z_ROOF0 + ((d - dOut) / (dIn - dOut)) * 1.2 // underside, rising inward
  const zT = (d: number) => Z_ROOF1 + ((d - dOut) / (dIn - dOut)) * 0.6
  // Outer fascia (dark edge), top, underside, inner edge.
  sweep(m.roof, n, [dOut, zT(dOut)], [dOut, zU(dOut)], outward)
  sweep(m.roof, n, [dOut, zT(dOut)], [dGl, zT(dGl)], up)
  sweep(m.glass, n, [dGl, zT(dGl)], [dIn, zT(dIn) - 0.4], up)
  sweep(m.under, n, [dOut, zU(dOut)], [dGl, zU(dGl)], down)
  sweep(m.glass, n, [dGl, zU(dGl)], [dIn, zT(dIn) - 0.6], down)
  sweep(m.roof, n, [dIn, zT(dIn) - 0.4], [dIn, zT(dIn) - 0.6], inward)
  // The ends over the gap.
  for (const south of [true, false]) {
    endCap(m.roof, n, [[dOut, zU(dOut)], [dGl, zU(dGl)], [dIn, zT(dIn) - 0.6], [dIn, zT(dIn) - 0.4], [dGl, zT(dGl)], [dOut, zT(dOut)]], south)
  }
  // Twenty columns on the upper tier, 12 m in from the pillars.
  const dc = 12, zSeat = G + 1.4 + ((31 - dc) / 22) * 13
  const N = 2000, pts: XY[] = [], cum: number[] = [0]
  const g = gapT(dc)
  for (let k = 0; k <= N; k++) {
    pts.push(ringPt(dc, -(Math.PI - g) + ((2 * (Math.PI - g)) * k) / N))
    if (k) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  }
  for (let i = 0; i < 20; i++) {
    const s = cum[N] * ((i + 0.5) / 20)
    const j = cum.findIndex((v) => v >= s)
    const c = pts[Math.max(0, j)]
    if (detail) {
      cone(m.under, c[0], c[1], 0.45, 0.45, zSeat, zU(dc), 10)
      // Radial girders on the underside, out to the edge and in to the glass.
      const o = outward([c[0], c[1], 0])
      const outer: V3 = [c[0] + o[0] * (dc - dOut), c[1] + o[1] * (dc - dOut), zU(dOut) - 0.05]
      const inner: V3 = [c[0] - o[0] * (dGl - dc), c[1] - o[1] * (dGl - dc), zU(dGl) - 0.05]
      beam(m.under, outer, inner, 0.6, [0, 0, 1], true, 1.2)
    } else box(m.under, c[0] - 0.4, c[1] - 0.4, c[0] + 0.4, c[1] + 0.4, zSeat, zU(dc), false, false)
  }
  if (detail) {
    // Ring girders under the roof between the columns' girders.
    for (const d of [5, 20, 33]) {
      const r = ringSamples(d, 120)
      for (let k = 0; k < 120; k++) {
        const a: V3 = [r[k][0], r[k][1], zU(d) - 0.3], b: V3 = [r[k + 1][0], r[k + 1][1], zU(d) - 0.3]
        beam(m.under, a, b, 0.35, [0, 0, 1], false, 0.6)
      }
    }
  }
}

function build(detail: boolean): Mats {
  const m: Mats = { stone: new Part(), seats: new Part(), roof: new Part(), under: new Part(), glass: new Part(), win: new Part() }
  bowl(m, detail)
  colonnade(m, detail)
  marathonGate(m, detail)
  roofRing(m, detail)
  return m
}

function write(detail: boolean) {
  const m = build(detail)
  // Floodlit outside: the colonnade and the pylons, up to the attic.
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] > G - 0.5 ? 0.85 : 0.3)
  writeModel('Olympiastadion Berlin', ID, [
    { part: m.stone, material: { ...mat('muschelkalk', 0xddd4c3), floodlight: flood } },
    { part: m.seats, material: mat('seats', 0x5f6368) },
    { part: m.roof, material: mat('roof', 0x767b80) },
    { part: m.under, material: mat('membrane', 0xd9dcdc) },
    { part: m.glass, material: mat('glass', 0x8fa6b4, 0.24) },
    { part: m.win, material: mat('window', 0x64798a, 0.35) },
  ], { bearing: BEARING, osm: 'way/24296022', height: Z_PYL }, detail ? 40000 : 6500, detail ? `${ID}.detail` : ID)
}

if (import.meta.main) {
  write(false)
  write(true)
}
