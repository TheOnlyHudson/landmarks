/**
 * Petronas Twin Towers (Menara Berkembar Petronas, 1993–1999, Cesar Pelli),
 * Kuala Lumpur City Centre: procedural, CC0-1.0.
 * bun generators/kl-petronas-towers.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/kl-petronas-towers.glb, the low model: the towers, bustles,
 *   setback tiers, pinnacles and skybridge, with a stainless band every
 *   fifth floor;
 * - models/kl-petronas-towers.detail.glb, drawn from zoom 16: the same
 *   with a band at every floor, finer lobes, and the small pinnacles and
 *   lips on the pinnacle rings too.
 *
 * STYLE exception: the stainless-steel floor bands are drawn as horizontal
 * lines, one per floor in the detail model. STYLE.md rejects per-floor
 * pinstripes, but on Petronas the bright sunshade band at every floor,
 * following the lobed plan, is the facade's identity (every photo; asked
 * for in review). They are proud rings of bright steel over a darker wall,
 * not painted stripes; the low model spaces them five floors apart so they
 * stay within the budget and don't shimmer.
 *
 * Map frame: x east, y north, z up, metres. Origin: the midpoint of the two
 * tower centres, 3.1579192 N, 101.7117914 E; bearing 0 (the geometry is
 * drawn in its real orientation). Tower 1 (Petronas) is the south-west tower,
 * Tower 2 (Petronas Carigali) the north-east one, 106.9 m apart centre to
 * centre on a line at bearing 49.5°.
 *
 * Identity, in order: two identical slender silver towers side by side; the
 * eight-pointed star plan (Rub el Hizb: two squares turned 45°, with a round
 * lobe filling each inner corner), which makes the shaft read as a fluted
 * column of points and lobes; the tapering stack of setbacks to a spiky
 * crown, a ball and a needle pinnacle; the two-storey skybridge at levels
 * 41–42 on its inverted-V legs; the round 44-storey bustle on the north-west
 * face of each tower; the stainless-steel and glass ribbon facade.
 *
 * Sources:
 *  - OSM (ODbL): the outline way/279944536 (both towers, their bustles, and
 *    a strip on the ground under the skybridge) and its building:parts,
 *    which map every tier as a star of points and lobes with its height:
 *    Tower 1 way/137396348 (240 m), /383 (295), /351 (325), /381 (355),
 *    /367 (370), /374 (380), /379 (390), /371 (400), /372 (410), /373 (452,
 *    the spire); bustle way/137396360 (185) and its neck /362 (175);
 *    skybridge way/137396365 (170–180). Tower 2 the same, way/137331252,
 *    /265, /253, /264, /258, /263, /259, /260, /262, /261, bustle /255
 *    (185) and neck /256 (175).
 *    Measured from those parts (tools: osm.py buildings): tower centres
 *    (-40.67, -34.70) and (40.67, 34.70) here; the tips at bearings 10.9 +
 *    45k (Tower 1) and 42.1 + 45k (Tower 2), so the pair is mirrored across
 *    the line between them, as the bustles are; tip radii 29.05 / 26.93 /
 *    24.11 / 19.18 / 12.84 m for the five star tiers, the upper drums
 *    8.0 / 5.9 / 3.7 / 2.6 m. The base tier's lobes: inner corners at 0.839
 *    of the tip radius, 11.5° either side of each tip, the lobe's crown at
 *    0.916 (a circle of 0.185 R). Bustles: circles of r 11.4 m, 43 m from
 *    the tower centre at bearings -35° and -49°.
 *    Suria KLCC (way/23034336, 30 m) wraps round the towers' feet and the
 *    ground between them; its outline excludes the towers, so it is a
 *    separate neighbour and stays. The model draws no podium.
 *  - Wikipedia "Petronas Towers" (read 2026-11): 451.9 m to the tip, roof
 *    378.6 m, 88 floors; the plan, two interlocking squares with circular
 *    infill, from the Rub el Hizb; stainless-steel and glass facade; the
 *    skybridge at levels 41 and 42, 170 m up, 58.4 m long, a two-hinged arch
 *    whose legs bear on level 29; 44-storey bustles.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * Petronas_Panorama_II.jpg, Someformofhuman, CC BY-SA 4.0: from the
 *      north-west forecourt at dusk: bustles, bridge, crowns, night lighting.
 *    * 2016_Kuala_Lumpur,_Petronas_Towers_(26).jpg, Marcin Konsek, CC BY-SA
 *      4.0: from the south-east, level: setbacks (~255 and ~320 m), crown,
 *      ball (~415 m), needle, bridge and legs.
 *    * Petronas_Twin_Towers_2010_April.jpg, Morio, CC BY-SA 3.0: from the
 *      north-west: bustles, legs to level 29, the shaft's lobes and banding.
 *    * Skybridge_between_Petronas_Towers,_Kuala_Lumpur_(4447656063).jpg,
 *      Andy Mitchell, CC BY-SA 2.0: the bridge (glass storeys on a steel
 *      underside, the glass hub at mid-span, paired legs).
 *    * Kuala_Lumpur_Malaysia_Petronas-Twin-Towers-01.jpg, CEphoto, Uwe
 *      Aranas, CC BY-SA 3.0: distant, from the south-west: the silhouette.
 *    * Kuala_Lumpur,_Malaysia,_Petronas_Towers_at_night.jpg, Vyacheslav
 *      Argenberg, CC BY 4.0: night lighting.
 *    * Menara_Berkembar_Petronas,_..._(Unsplash).jpg, Vlad Shapochnikov,
 *      CC0: night, from the north-west.
 *  - No lidar (outside the US). No Google, Apple, Bing or Mapbox imagery,
 *    Street View or 3D tiles were used. No look-only references.
 *
 * Measured on CEphoto's photo (crown crop, 4.6 px/m from the needle tip at
 * 452 m and the ball's centre 37.5 m below it, both from Konsek (26)),
 * projected widths across the near points:
 *    z (m)    <303   303-342  342-363  363-382  382-390 ring  400   409
 *    width    50     41       33.6     28       20.6          13    6.5
 *  i.e. tip radii ~26.9 / 23.5 / 19.2 / 16 / 11 / 7 / 3.5 m (width/0.92
 *  for the star seen near point-on). OSM agrees to 355 m; above it the
 *  photo's tiers are wider than OSM's 12.8 / 8 / 5.9 m parts, so the
 *  photo is followed there.
 *
 * Numbers in the model:
 *  - OSM: the plan (tips 29.05 m, inner corners 0.839 R, lobe crowns
 *    0.916 R), the centres and turn of each tower, the bustles (r 11.4 m,
 *    185 m; necks 175 m), and the tiers to 355 m.
 *  - Published: tip 452 m, roof 375-379 m, 88 floors; setbacks at levels
 *    60, 73, 82 and 85, which OSM's 240 / 295 / 325 / 355 m tiers match at
 *    ~4.2 m a floor; bridge at 170 m, 58.4 m long (59 m here), legs to
 *    level 29.
 *  - From the photos: crown tiers 355-368 m (R 16) and 368-382 m (R 12.8);
 *    the pinnacle as four stacked rings (382-411 m, R 10.5 / 8 / 6 / 3.8;
 *    three in the low model), the lowest bright steel all over; each tier
 *    topped by a bright lip and a small pinnacle on each of its eight
 *    points; the ringed ball (r 3 m at 414.5 m) and the needle (1.1 to
 *    0.35 m radius, bolder than real).
 *  - Estimated: the floor bands (a 10 m lobby, then 4.2 m floors; bands
 *    0.9 m tall in the detail model, 1.6 m in the low one, 0.3 m proud);
 *    the bridge's section (7 m wide, 168.5-180 m) and hub; the leg feet at
 *    121 m, 3.4 m either side of the bridge's axis; the bustle's lip.
 *
 * Night: the towers are lit silver-white all over, shaft and crown alike
 * (Panorama II, Argenberg). The map's `floodlight` wash is warm (it read
 * beige on the shafts), so the wall, the lobes and the stainless bands are
 * `neon-*` in their own cool silvers and glow white, the bands brightest,
 * the lobes a shade darker than the flat faces so the fluting still reads.
 * The skybridge's glazing is `window` and glows. Terraces are barely lit.
 *
 * Doubts:
 *  - The real crown has more, smaller steps between the setbacks than the
 *    six tiers and four pinnacle rings drawn.
 *  - The vertical mullion lines on the tips are left out; the low model's
 *    bands are five floors apart (budget), the detail model's one a floor.
 *  - OSM's tower stars are turned ~7° off the bridge's axis; kept as mapped.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const D = Math.PI / 180
/** A compass bearing (clockwise from north) as a unit vector in the map frame. */
const dir = (b: number): XY => [Math.sin(b * D), Math.cos(b * D)]

const TOWERS = [
  { c: [-40.67, -34.70] as XY, tip: 10.9, bustle: [-65.25, 0.58] as XY },
  { c: [40.67, 34.70] as XY, tip: 42.1, bustle: [8.4, 63.13] as XY },
]
const BUSTLE_R = 11.4, BUSTLE_H = 185, NECK_H = 175, NECK_W = 9.5
/**
 * The setback tiers [top, tip radius], from the ground up. To 355 m from
 * OSM's parts (levels 60, 73, 82 and 85: 240, 295, 325 and 355 m); the two
 * crown tiers above them from CEphoto's photo (OSM's 12.8 and 8 m look too
 * small beside it); then the pinnacle, four small stepped rings to the ball.
 */
const TIERS: [number, number][] = [[240, 29.05], [295, 26.93], [325, 24.11], [355, 19.18], [368, 16], [382, 12.8]]
const PINNACLE: [number, number][] = [[390, 10.5], [397, 8], [404, 6], [411, 3.8]]
/** The low model's pinnacle, in three rings. */
const PINNACLE_LOW: [number, number][] = [[390, 10.5], [401, 7], [411, 3.8]]
const BALL_Z = 414.5, BALL_R = 3.0, TIP = 452
const BRIDGE = { z0: 168.5, z1: 180, glass0: 172.3, glass1: 179, w: 7, footZ: 121, footOff: 3.4 }
/** Floors: a 10 m lobby, then ~4.2 m a floor (88 floors to the 375 m roof). */
const FLOOR0 = 10, FLOOR = 4.2

/**
 * `floors`: a stainless floor band every this many floors (every floor in
 * the detail model, fewer in the low one to stay in budget). The body is
 * the glass-and-steel wall seen between the bands.
 */
type LOD = { arc: number; floors: number; band: number; drum: number; ball: number; detail: boolean }
const LOW: LOD = { arc: 1, floors: 5, band: 1.6, drum: 16, ball: 8, detail: false }
const DETAIL: LOD = { arc: 3, floors: 1, band: 0.9, drum: 24, ball: 16, detail: true }

/**
 * One tier's plan: an eight-pointed star of tip radius R about c, tips at
 * bearing tip + 45k; each inner corner filled by a circular lobe. Returns
 * ring points ccw from above and, for each, whether it is on a lobe (smooth).
 */
function star(c: XY, tip: number, R: number, arc: number): { p: XY[]; smooth: boolean[] } {
  const corner = 0.839 * R, cornerA = 11.5
  // The lobe: a circle round a centre 0.731 R out on the bisector, radius
  // 0.185 R, through both corners (half-angle 60° about its own centre).
  const d = 0.731 * R, rho = 0.185 * R
  const pts: XY[] = [], sm: boolean[] = []
  const at = (b: number, r: number): XY => { const u = dir(b); return [c[0] + u[0] * r, c[1] + u[1] * r] }
  for (let k = 0; k < 8; k++) {
    const b = tip + 45 * k
    pts.push(at(b, R)); sm.push(false)
    pts.push(at(b + cornerA, corner)); sm.push(false)
    const mid = b + 22.5, u = dir(mid), v = dir(mid + 90)
    // phi from -60 (near this tip, after the corner) to +60; exclusive of the corners
    for (let i = 1; i <= arc; i++) {
      const phi = (-60 + (120 * i) / (arc + 1)) * D
      // -v side is toward the earlier tip (smaller bearing)
      pts.push([c[0] + u[0] * (d + rho * Math.cos(phi)) + v[0] * rho * Math.sin(phi), c[1] + u[1] * (d + rho * Math.cos(phi)) + v[1] * rho * Math.sin(phi)])
      sm.push(true)
    }
    pts.push(at(b + 45 - cornerA, corner)); sm.push(false)
  }
  // Generated clockwise (increasing bearing); the kit wants ccw.
  return { p: pts.reverse(), smooth: sm.reverse() }
}

function circle(c: XY, r: number, n: number): XY[] {
  return Array.from({ length: n }, (_, k) => { const u = dir(-(360 * k) / n); return [c[0] + u[0] * r, c[1] + u[1] * r] as XY })
}

const outward = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }

/** Vertical walls round a ccw ring from z0 to z1, optionally split into bands. */
function walls(ring: XY[], smooth: boolean[] | 'all', z0: number, z1: number, pick: (zMid: number, lobe: boolean) => Part, cuts: number[] = []) {
  const n = ring.length
  const en = ring.map((p, i) => outward(p, ring[(i + 1) % n]))
  const vn = (i: number, edge: number): V3 => {
    const s = smooth === 'all' || smooth[i]
    if (!s) return [en[edge][0], en[edge][1], 0]
    const a = en[(i - 1 + n) % n], b = en[i]
    const m: XY = [a[0] + b[0], a[1] + b[1]], l = Math.hypot(...m)
    return [m[0] / l, m[1] / l, 0]
  }
  const zs = [z0, ...cuts.filter((z) => z > z0 + 0.05 && z < z1 - 0.05), z1]
  for (let k = 0; k < zs.length - 1; k++) {
    const za = zs[k], zb = zs[k + 1]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = ring[i], b = ring[j]
      const part = pick((za + zb) / 2, smooth === 'all' || smooth[i] || smooth[j])
      const na = vn(i, i), nb = vn(j, i)
      part.tri([a[0], a[1], za], [b[0], b[1], za], [b[0], b[1], zb], undefined, undefined, undefined, [na, nb, nb])
      part.tri([a[0], a[1], za], [b[0], b[1], zb], [a[0], a[1], zb], undefined, undefined, undefined, [na, nb, na])
    }
  }
}

/** A flat fan over a ring that is star-shaped about c, facing up. */
function fan(part: Part, c: XY, ring: XY[], z: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    part.tri([c[0], c[1], z], [a[0], a[1], z], [b[0], b[1], z])
  }
}

/** The terrace between two rings with matching vertices (outer ccw, inner a scaled copy). */
function terrace(part: Part, outer: XY[], inner: XY[], z: number) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    part.quad([outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z], [inner[i][0], inner[i][1], z])
  }
}

/** A surface of revolution about (c, z) from a [r, z] profile, bottom to top. */
function lathe(part: Part, c: XY, profile: [number, number][], n: number) {
  for (let k = 0; k < profile.length - 1; k++) {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    const nr = ez / l, nz = -er / l
    for (let s = 0; s < n; s++) {
      const a0 = (s / n) * 2 * Math.PI, a1 = ((s + 1) / n) * 2 * Math.PI
      const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const N = (a: number): V3 => [nr * Math.cos(a), nr * Math.sin(a), nz]
      if (r0 > 1e-6) part.tri(P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      if (r1 > 1e-6) part.tri(P(r0, a0, z0), P(r1, a1, z1), P(r1, a0, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
}

/** A sphere-ish ball, smooth-shaded. */
function ball(part: Part, c: XY, z: number, r: number, n: number) {
  const rows = Math.max(4, Math.round(n / 2))
  for (let i = 0; i < rows; i++) {
    const t0 = -Math.PI / 2 + (Math.PI * i) / rows, t1 = -Math.PI / 2 + (Math.PI * (i + 1)) / rows
    for (let s = 0; s < n; s++) {
      const a0 = (s / n) * 2 * Math.PI, a1 = ((s + 1) / n) * 2 * Math.PI
      const U = (t: number, a: number): V3 => [Math.cos(t) * Math.cos(a), Math.cos(t) * Math.sin(a), Math.sin(t)]
      const P = (u: V3): V3 => [c[0] + u[0] * r, c[1] + u[1] * r, z + u[2] * r]
      const q = [U(t0, a0), U(t0, a1), U(t1, a1), U(t1, a0)]
      if (i > 0) part.tri(P(q[0]), P(q[1]), P(q[2]), undefined, undefined, undefined, [q[0], q[1], q[2]])
      if (i < rows - 1) part.tri(P(q[0]), P(q[2]), P(q[3]), undefined, undefined, undefined, [q[0], q[2], q[3]])
    }
  }
}

/** A straight round member from a to b (open-ended, smooth). */
function tube(part: Part, a: V3, b: V3, r: number, n = 6) {
  const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], tl = Math.hypot(...t)
  const T: V3 = [t[0] / tl, t[1] / tl, t[2] / tl]
  let u: V3 = Math.abs(T[2]) < 0.9 ? [T[1], -T[0], 0] : [1, 0, 0]
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v: V3 = [T[1] * u[2] - T[2] * u[1], T[2] * u[0] - T[0] * u[2], T[0] * u[1] - T[1] * u[0]]
  const off = (k: number): V3 => { const g = (k / n) * 2 * Math.PI; return [u[0] * Math.cos(g) + v[0] * Math.sin(g), u[1] * Math.cos(g) + v[1] * Math.sin(g), u[2] * Math.cos(g) + v[2] * Math.sin(g)] }
  for (let k = 0; k < n; k++) {
    const o0 = off(k), o1 = off(k + 1)
    const A0: V3 = [a[0] + o0[0] * r, a[1] + o0[1] * r, a[2] + o0[2] * r], A1: V3 = [a[0] + o1[0] * r, a[1] + o1[1] * r, a[2] + o1[2] * r]
    const B0: V3 = [b[0] + o0[0] * r, b[1] + o0[1] * r, b[2] + o0[2] * r], B1: V3 = [b[0] + o1[0] * r, b[1] + o1[1] * r, b[2] + o1[2] * r]
    part.tri(A0, A1, B1, undefined, undefined, undefined, [o0, o1, o1])
    part.tri(A0, B1, B0, undefined, undefined, undefined, [o0, o1, o0])
  }
}

/** An axis-aligned-in-plan box along direction u (unit), centred at c, from z0 to z1. */
function box(part: Part | ((face: 'side' | 'top' | 'bottom') => Part), c: XY, u: XY, len: number, wid: number, z0: number, z1: number) {
  const pick = typeof part === 'function' ? part : () => part
  const v: XY = [-u[1], u[0]]
  const pt = (s: number, t: number): XY => [c[0] + u[0] * s + v[0] * t, c[1] + u[1] * s + v[1] * t]
  const ring = [pt(-len / 2, -wid / 2), pt(len / 2, -wid / 2), pt(len / 2, wid / 2), pt(-len / 2, wid / 2)] // ccw
  walls(ring, [false, false, false, false], z0, z1, () => pick('side'))
  fan(pick('top'), c, ring, z1)
  const bot = pick('bottom')
  for (let i = 1; i < 3; i++) bot.tri([ring[0][0], ring[0][1], z0], [ring[i + 1][0], ring[i + 1][1], z0], [ring[i][0], ring[i][1], z0])
}

function build(lod: LOD) {
  const body = new Part()   // the wall between the bands: flat faces and tips
  const lobe = new Part()   // the same wall on the round lobes and bustles, a shade darker
  const steel = new Part()  // the bright stainless floor bands, lips, pinnacle and bridge steel
  const roof = new Part()   // setback terraces
  const win = new Part()    // the skybridge's glazing
  const wall = (_z: number, isLobe: boolean) => (isLobe ? lobe : body)

  /** A stainless band proud of a ring (outward faces only), z0 to z1. */
  const band = (ring: XY[], z0: number, z1: number) => walls(ring, 'all', z0, z1, () => steel)
  /** The floor levels with a band, between z0 and z1. */
  const floorsIn = (z0: number, z1: number) => {
    const out: number[] = []
    for (let k = 0; ; k += lod.floors) {
      const z = FLOOR0 + k * FLOOR
      if (z >= z1 - 2) break
      if (z > z0 + 1) out.push(z)
    }
    return out
  }
  const arcFor = (R: number) => (R < 14 ? 1 : lod.arc)

  for (const t of TOWERS) {
    let prev: XY[] | null = null
    let z0 = 0
    for (const [top, R] of [...TIERS, ...(lod.detail ? PINNACLE : PINNACLE_LOW)]) {
      const pin = top > 382
      const { p, smooth } = star(t.c, t.tip, R, arcFor(R))
      // The pinnacle's lowest ring is bright steel all over (the white ring
      // under the ball in every photo); the others are wall with bands.
      walls(p, smooth, z0, top, pin && top === 390 ? () => steel : wall)
      if (prev && prev.length === p.length) terrace(roof, prev, p, z0)
      else if (prev) fan(roof, t.c, prev, z0)
      // Floor bands, and a bolder lip at the tier's top.
      const grow = (d: number) => star(t.c, t.tip, R + d, arcFor(R)).p
      if (!pin) for (const z of floorsIn(z0, top - 2)) band(grow(0.3), z, z + lod.band)
      const lip = grow(pin ? 0.3 : 0.6)
      if (lod.detail || !pin) band(lip, top - (pin ? 1 : 2), top)
      if (lod.detail) terrace(steel, lip, p, top)
      // The small pinnacle at each of the tier's eight points.
      const h = Math.max(2.5, 0.16 * R)
      if (lod.detail || !pin) for (let k = 0; k < 8; k++) {
        const b = t.tip + 45 * k, u = dir(b), tipP: XY = [t.c[0] + u[0] * (R - 0.4), t.c[1] + u[1] * (R - 0.4)]
        const l = dir(b - 30), r = dir(b + 30), w = Math.min(2.2, 0.12 * R)
        const L: V3 = [tipP[0] - l[0] * w, tipP[1] - l[1] * w, top], Rr: V3 = [tipP[0] - r[0] * w, tipP[1] - r[1] * w, top]
        const T: V3 = [tipP[0] + u[0] * 0.3, tipP[1] + u[1] * 0.3, top], apex: V3 = [tipP[0] - u[0] * w * 0.6, tipP[1] - u[1] * w * 0.6, top + h]
        const m: V3 = [(T[0] + L[0] + Rr[0] + apex[0]) / 4, (T[1] + L[1] + Rr[1] + apex[1]) / 4, (T[2] + L[2] + Rr[2] + apex[2]) / 4]
        tri3(steel, T, Rr, apex, m); tri3(steel, L, T, apex, m); tri3(steel, Rr, L, apex, m)
      }
      prev = p
      z0 = top
    }
    fan(roof, t.c, prev!, z0)
    // The ringed sphere and the needle.
    lathe(steel, t.c, [[2.0, 411], [1.3, 412.2]], lod.drum)
    ball(steel, t.c, BALL_Z, BALL_R, lod.ball)
    lathe(steel, t.c, [[BALL_R + 0.5, BALL_Z - 0.4], [BALL_R + 0.5, BALL_Z + 0.4]], lod.drum) // its equator ring
    lathe(steel, t.c, [[1.1, BALL_Z + BALL_R - 0.4], [0.75, 432], [0.35, TIP - 1.2], [0, TIP]], Math.max(8, lod.drum / 2))

    // The bustle (OSM way/137396360 and /137331255): a round 44-storey
    // annex with the same floor bands and a lip, joined to the tower by a
    // neck (OSM /137396362, /137331256) that stops 10 m lower.
    const n = lod.detail ? lod.drum + 8 : lod.drum
    const bring = circle(t.bustle, BUSTLE_R, n)
    walls(bring, 'all', 0, BUSTLE_H - 2, () => lobe)
    for (const z of floorsIn(0, BUSTLE_H - 2)) band(circle(t.bustle, BUSTLE_R + 0.3, n), z, z + lod.band)
    const blip = circle(t.bustle, BUSTLE_R + 0.6, n)
    band(blip, BUSTLE_H - 2.5, BUSTLE_H)
    fan(roof, t.bustle, blip, BUSTLE_H)
    const toTower: XY = [t.c[0] - t.bustle[0], t.c[1] - t.bustle[1]]
    const dl = Math.hypot(...toTower), u: XY = [toTower[0] / dl, toTower[1] / dl]
    const len = dl - 20, mid: XY = [t.bustle[0] + u[0] * len / 2, t.bustle[1] + u[1] * len / 2]
    box((f) => (f === 'top' ? roof : body), mid, u, len, 2 * NECK_W, 0, NECK_H)
  }

  // The skybridge between the towers' faces, on the line between centres.
  const [A, B] = TOWERS.map((t) => t.c)
  const ax: XY = [B[0] - A[0], B[1] - A[1]], al = Math.hypot(...ax), u: XY = [ax[0] / al, ax[1] / al]
  const v: XY = [-u[1], u[0]]
  const span = al - 2 * 22 // ends 22 m from each centre, inside the lobes
  const mid: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  const { z0, z1, glass0, glass1, w } = BRIDGE
  box(steel, mid, u, span, w, z0, glass0)
  box((f) => (f === 'side' ? win : steel), mid, u, span, w - 0.3, glass0, glass1)
  box(steel, mid, u, span, w, glass1, z1)
  // The glass hub at mid-span, rising a little above the bridge.
  box((f) => (f === 'side' ? win : steel), mid, u, 3.6, w + 1, z0 - 1, z1 + 2)
  // The legs: a pair to each tower, from a knuckle under the hub to level 29.
  const knuckle: V3 = [mid[0], mid[1], z0 - 2.5]
  box(steel, mid, u, 3, 3, z0 - 3.5, z0)
  for (const [c, s] of [[A, -1], [B, 1]] as [XY, number][]) {
    for (const side of [-1, 1]) {
      const fx = c[0] + u[0] * s * -26 + v[0] * side * BRIDGE.footOff
      const fy = c[1] + u[1] * s * -26 + v[1] * side * BRIDGE.footOff
      tube(steel, [knuckle[0] + v[0] * side * 0.6, knuckle[1] + v[1] * side * 0.6, knuckle[2]], [fx, fy, BRIDGE.footZ], 0.85, lod.detail ? 8 : 6)
    }
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: body, material: finish('neon-petronas-wall', 0x93a1ad, 0.4) },
    { part: lobe, material: finish('neon-petronas-lobe', 0x8695a2, 0.4) },
    { part: steel, material: finish('neon-petronas-steel', 0xe6eaee, 0.4) },
    { part: roof, material: { ...PALETTE.roof, floodlight: () => 0.25 } },
    { part: win, material: { ...PALETTE.window, color: 0x8aa3a6 } },
  ]
  return parts
}

/** A triangle wound to face away from the solid's centre m. */
function tri3(p: Part, a: V3, b: V3, c: V3, m: V3) {
  const n = cross3([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]])
  const out = (a[0] - m[0]) * n[0] + (a[1] - m[1]) * n[1] + (a[2] - m[2]) * n[2]
  if (out >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles} (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(", ")})`)
  const glb = writeGlb('Petronas Twin Towers', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: TIP,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')}), ${glb.length} bytes`)
}

await write('kl-petronas-towers.glb', build(LOW), 6500, 250_000)
await write('kl-petronas-towers.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
