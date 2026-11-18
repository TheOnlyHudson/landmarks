/**
 * Kremlin Senate (Сенатский дворец), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-senate.ts
 *
 * Matvey Kazakov's classical Senate of 1776-1787, now the President's
 * working residence: an isosceles triangle of three-storey wings round three
 * courtyards, the Catherine Hall's rotunda and its green dome at the apex
 * over Red Square, the President's standard on the dome.
 *
 * This file also exports the small kit the other Kremlin models of this
 * batch build with (moscow-arsenal.ts, moscow-kremlin-administration.ts,
 * moscow-kremlin-service-buildings.ts): outline walls in colour bands,
 * cornices, hipped roofs over plans with courtyards, window rhythms along an
 * outline's edges, pilasters, arched windows and domes. The Senate itself
 * is built under `import.meta.main`, so importing the kit builds nothing.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, the plan in true
 * orientation. Origin: the area centroid of OSM relation/1359233 (the
 * outline less its three courtyards), 37.618577, 55.7532372.
 *
 * Evidence
 * - OSM (API map call, 2026-11-18): relation/1359233 (building=office,
 *   building:levels 4, roof:colour darkslategrey), the outline and its three
 *   courtyards; building:part relation/3058456 (the wings, height 20),
 *   the roof skillions relation/3272727-3272771 (outer slopes 20->25 m,
 *   courtyard slopes 20->23 m, all roof:colour #2E8B57), relation/1359250
 *   (the rotunda's drum, a 27.1 m circle, 20->25 m, named "Senate Tower"),
 *   way/227433853 (the dome, r 12.0 m, 25->40 m, roof:shape dome),
 *   way/242244308, way/242244893 (the lantern, 39->42 m), way/242244323 (the
 *   flagpole, 42->50 m), relation/3272730 (the west wing's oval dome,
 *   13 x 21 m, 20->32 m, roof:shape dome). relation/1359290 and
 *   relation/6800992 are two round pavilions (8.5 m, domed) in the north
 *   and south courtyards; they are drawn too.
 * - Published (ru.wikipedia, "Сенатский дворец"): 1776-1787, Matvey
 *   Kazakov; three storeys; an isosceles triangle, outer perimeter 450 m,
 *   inner 360 m; three risalits on each outer front marked by Doric
 *   pilasters; rusticated basement and ground floor; the corners cut off and
 *   treated as risalits with a triumphal-arch motif, repeated at the centre
 *   of all three fronts; an entrance arch from Senate Square into the
 *   courtyard with a four-column Ionic portico and pediment; the green
 *   hemispherical dome over the Catherine Hall, 25 m across and 27 m high
 *   inside.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Angel Miklashevsky, "Kremlin Senate 01.jpg", "02", "03", "06",
 *     CC BY-SA 4.0: the south-east front from Ivanovskaya Square (SW).
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate_02.jpg
 *   - Bahnfrend, "Kremlin Senate, 2006 (01).jpg", CC BY-SA 4.0: the north
 *     corner pavilion and the west front's end.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate,_2006_(01).jpg
 *   - Suicasmo, "Kremlin Senate 20190430.jpg", CC BY-SA 4.0: the south-west
 *     corner pavilion and the south-east front.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate_20190430.jpg
 *   - shakko, "Kremlin Senate (2021) by shakko 02.jpg", CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate_(2021)_by_shakko_02.jpg
 *   - Presidential Press and Information Office, "Kremlin Senate-1.jpg",
 *     CC BY 4.0: the rotunda's colonnade from the main courtyard.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate-1.jpg
 *   - Юрий Д.К., "Senatskaya Tower and Kremlin Senate in 2026.jpg",
 *     "Kremlin Senate - dome.jpg", "Moscow - August 2025 - Kremlin Wall,
 *     Senate Palace.jpg", CC BY 4.0: the dome, lantern and flag, the north-
 *     east front over the Kremlin wall from Red Square.
 *     https://commons.wikimedia.org/wiki/File:Kremlin_Senate_-_dome.jpg
 *   - Kremlin Senate seen square-on from the south across the Block 14
 *     garden: "Moscow Kremlin, site of recently demolished Block 14
 *     building (31356625280).jpg", Gennady Grachev, CC BY 2.0: bay
 *     rhythm, roof pitch, the dome's stepped profile.
 *     https://commons.wikimedia.org/wiki/File:Moscow_Kremlin,_site_of_recently_demolished_Block_14_building_(31356625280).jpg
 *   - ITAR-TASS, "Kremlin birds eye view-3.jpg", CC BY 4.0: the roofs, both
 *     domes and the north-east front from above (1990s, Block 14 still
 *     standing; the roofs then painted greener).
 *   - Godot13, "Russia-2007-Moscow-Kremlin Senate at night.jpg", CC BY-SA
 *     4.0: night; the fronts floodlit, the dome dark, the flag lit.
 *
 * Heights. OSM: eaves 20 m; roof slopes to 23-25 m; drum to 25 m; dome
 * top 40 m; flagpole 50 m. Photo-scaled (Bahnfrend's corner, against the
 * 20 m eave): ground storey band 0-7 m, white string course 7-7.8 m,
 * first-floor windows 8.9-12.1 m, second-floor 13.6-16 m, ground-floor
 * windows 2.1-4.7 m, white entablature 17-20 m. The roof is drawn as one
 * hipped surface rising 3 m to a flat top: OSM's skillions rise 3 and 5 m,
 * but every street photo shows a lower pitch than 5 m would give. The oval
 * dome is kept lower than OSM's 32 m (drum to 24.2 m, top 29.9 m): it
 * doesn't show over the roof in the square-on Block 14 photo, and sits low
 * on the roof in the ITAR-TASS aerial. The dome (from the Block 14 and Red Square photos): drum and attic
 * to 27.4 m, a steeper skirt to 28.9 m, then a shallow cap to 37 m, the
 * lantern to 38.6 m, the flagpole to 48.5 m (OSM 50); the photos show a
 * dome about a third as high as it is wide, lower than OSM's 40 m.
 *
 * Estimated or simplified:
 * - Bays: about 3.9 m on the outer fronts (counted on the Block 14
 *   photo), 4.2 m in the courtyards. Pilaster runs (the "colonnade"
 *   risalits): beside each corner pavilion, either side of each front's
 *   central arch, and the stretch beside the rotunda, as the south-east and
 *   north-east fronts show; the west front (Senate Square) has no usable
 *   photo and is drawn to the same scheme.
 * - The courtyard portico on the west wing (four columns and a pediment)
 *   is placed on the courtyard axis from the published description; no
 *   licensed photo shows it.
 * - The rotunda's courtyard colonnade: eight columns over the arc that
 *   stands into the main courtyard, on the ground-floor podium, as the
 *   Presidential Office photo shows; the drum's sixteen arched windows.
 * - Left out: the ground floor's rustication stripes (they shimmer at map
 *   distance), window pediments, the frieze medallions, roof railings,
 *   chimneys and dormer vents, the drain pipes, the courtyard trees.
 * - The dome uses 24 segments around (STYLE says 12-16), since it is the
 *   model's crown and 27 m across.
 *
 * Materials (six): Senate ochre, white trim, the grey roof metal, the
 * darker grey-green of the domes, window, and flag red. The domes get their
 * own colour, darker and greener than the roof as in every photo, so the
 * crown still reads at 80 px; the doors, their canopies and the flagpole
 * are drawn in it too (the real doors are dark brown oak). The
 * standard's blue stripe is drawn in `window` slate, since the budget of six
 * has no room for a blue; at night it glows faintly, where the real flag is
 * floodlit anyway. Night: the fronts and the flag carry `_FLOODLIGHT`, as
 * in Godot13's photo; the roof and dome stay dark.
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bandTris, lathe, offset, type XY } from './sf-de-young'

export type { XY }
const UP: V3 = [0, 0, 1]

// ---------------------------------------------------------------- rings

export const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())
export const cw = (r: XY[]) => (area(r) < 0 ? r : [...r].reverse())
export const shift = (r: XY[], d: XY): XY[] => r.map(([x, y]) => [x + d[0], y + d[1]])

/** Douglas-Peucker on a closed ring, keeping its winding; the ring itself if simplifying would gut it. */
export function simplify(r: XY[], tol: number): XY[] {
  const dp = (pts: XY[]): XY[] => {
    const a = pts[0], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9
    let at = 0, dm = 0
    for (let k = 1; k < pts.length - 1; k++) {
      const d = Math.abs((pts[k][0] - a[0]) * (b[1] - a[1]) - (pts[k][1] - a[1]) * (b[0] - a[0])) / L
      if (d > dm) { dm = d; at = k }
    }
    return dm > tol ? [...dp(pts.slice(0, at + 1)).slice(0, -1), ...dp(pts.slice(at))] : [a, b]
  }
  const far = r.reduce((m, p, k) => (Math.hypot(p[0] - r[0][0], p[1] - r[0][1]) > Math.hypot(r[m][0] - r[0][0], r[m][1] - r[0][1]) ? k : m), 0)
  const out = [...dp(r.slice(0, far + 1)).slice(0, -1), ...dp([...r.slice(far), r[0]]).slice(0, -1)]
  return out.length >= 3 && Math.abs(area(out)) > 0.9 * Math.abs(area(r)) ? out : r
}

/** Point in polygon (even-odd). */
export function inside(p: XY, ring: XY[]) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

/** True when a ring doesn't cross itself (an inset of a concave plan can). */
export function isSimple(r: XY[]) {
  const u = clipping.union([[[...r, r[0]]]] as any) as unknown as XY[][][]
  return u.length === 1 && u[0].length === 1 && Math.abs(Math.abs(area(u[0][0].slice(0, -1))) - Math.abs(area(r))) < 0.01 * Math.abs(area(r))
}

// ---------------------------------------------------------------- surfaces

/** Walls along a ring from z0 to z1: a CCW ring faces out, a CW ring (a courtyard) faces into the courtyard. */
export function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** A flat face over a polygon with holes at height z, facing up (or down). */
export function cap(p: Part, outer: XY[], holes: XY[][], z: number, up = true) {
  const n: V3 = up ? UP : [0, 0, -1]
  for (const [a, b, c] of bandTris([outer, ...holes])) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    p.tri(A, B, C, undefined, undefined, undefined, [n, n, n])
  }
}

/** A loft between two rings with matching corners. */
export function loft(p: Part, a: XY[], za: number, b: XY[], zb: number) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length
    p.quad([a[i][0], a[i][1], za], [a[j][0], a[j][1], za], [b[j][0], b[j][1], zb], [b[i][0], b[i][1], zb])
  }
}

/** A solid prism over a simple ring, walls on `p`, lid on `top`. */
export function prism(p: Part, ring0: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  const ring = ccw(ring0)
  walls(p, ring, z0, z1)
  if (top) cap(top, ring, [], z1)
  if (bottom) cap(p, ring, [], z0, false)
}

/**
 * A cornice round a ring at the eave z: a bevelled lip sloping out `out`
 * metres over `h`. Seen from above it covers its own top, so it needs no
 * lid; it catches the light the way the real cornice's shadow line reads.
 */
export function cornice(p: Part, ring: XY[], z: number, out: number, h: number) {
  // An outer (CCW) ring's lip grows outward; a courtyard (CW) ring's grows into the courtyard. Corners stay index for index.
  const R = ring, lip = area(ring) > 0 ? offset(ring, out) : cw(offset(ccw(ring), -out))
  for (let i = 0; i < R.length; i++) {
    const j = (i + 1) % R.length
    p.quad([R[i][0], R[i][1], z - h], [R[j][0], R[j][1], z - h], [lip[j][0], lip[j][1], z], [lip[i][0], lip[i][1], z])
  }
}

/**
 * A hipped roof over a plan with courtyards: slopes rise `rise` metres from
 * the eave z, `inset` in from the outer walls and `insetHole` out from each
 * courtyard, to a flat top. Insets shrink where a full one would cross itself.
 */
export function hipRoof(p: Part, outer0: XY[], holes0: XY[][], z: number, rise: number, inset: number, insetHole = inset) {
  const outer = ccw(outer0), holes = holes0.map(cw)
  let io: XY[] = outer, ih: XY[][] = holes
  for (const k of [1, 0.75, 0.5, 0.3]) {
    const o = offset(outer, -inset * k)
    const hs = holes.map((h) => cw(offset(ccw(h), insetHole * k)))
    if (!isSimple(o) || !hs.every((h) => isSimple(h))) continue
    // grown courtyards must stay inside the shrunk outline and apart from each other
    const inner = clipping.difference([[[...o, o[0]]]] as any, ...hs.map((h) => [[[...h, h[0]]]]) as any) as unknown as XY[][][]
    const want = Math.abs(area(o)) - hs.reduce((s, h) => s + Math.abs(area(h)), 0)
    const got = inner.reduce((s, poly) => s + Math.abs(area(poly[0].slice(0, -1))) - poly.slice(1).reduce((t, h) => t + Math.abs(area(h.slice(0, -1))), 0), 0)
    if (inner.length !== 1 || Math.abs(got - want) > 0.01 * want) continue
    io = o; ih = hs
    break
  }
  loft(p, outer, z, io, z + rise)
  holes.forEach((h, k) => loft(p, h, z, ih[k], z + rise))
  cap(p, io, ih, z + rise)
}

// ---------------------------------------------------------------- facade pieces

/** A frame on a wall edge: origin `a`, unit tangent `t`, outward normal `n` (all horizontal). */
export type Edge = { a: XY; t: XY; n: XY; L: number }
export const edgeOf = (a: XY, b: XY): Edge => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { a, t, n: [t[1], -t[0]], L }
}
/** The ring's edges, each with its outward normal (CCW outer rings and CW courtyards both face outward). */
export const edges = (ring: XY[]) => ring.map((a, i) => edgeOf(a, ring[(i + 1) % ring.length]))
const at = (e: Edge, u: number, d: number, z: number): V3 => [e.a[0] + e.t[0] * u + e.n[0] * d, e.a[1] + e.t[1] * u + e.n[1] * d, z]

/** A flat rectangle on the wall, `d` out from it, from u0 to u1 along the edge and z0 to z1. */
export function panel(p: Part, e: Edge, u0: number, u1: number, z0: number, z1: number, d = 0.05) {
  const n: V3 = [e.n[0], e.n[1], 0]
  p.tri(at(e, u0, d, z0), at(e, u1, d, z0), at(e, u1, d, z1), undefined, undefined, undefined, [n, n, n])
  p.tri(at(e, u0, d, z0), at(e, u1, d, z1), at(e, u0, d, z1), undefined, undefined, undefined, [n, n, n])
}

/** A round-headed panel: jambs from z0 to the springing zs, a true semicircle of the panel's half-width above. */
export function archPanel(p: Part, e: Edge, uc: number, w: number, z0: number, zs: number, d = 0.05, seg = 10) {
  const n: V3 = [e.n[0], e.n[1], 0], r = w / 2
  if (zs > z0) panel(p, e, uc - r, uc + r, z0, zs, d)
  const C = at(e, uc, d, zs)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    p.tri(C, at(e, uc + r * Math.cos(a0), d, zs + r * Math.sin(a0)), at(e, uc + r * Math.cos(a1), d, zs + r * Math.sin(a1)), undefined, undefined, undefined, [n, n, n])
  }
}

/** A semicircular band (an archivolt) on the wall: radii r0 to r1 about the springing point. */
export function archBand(p: Part, e: Edge, uc: number, r0: number, r1: number, zs: number, d = 0.08, seg = 10) {
  const n: V3 = [e.n[0], e.n[1], 0]
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const P = (r: number, a: number) => at(e, uc + r * Math.cos(a), d, zs + r * Math.sin(a))
    p.tri(P(r0, a0), P(r1, a0), P(r1, a1), undefined, undefined, undefined, [n, n, n])
    p.tri(P(r0, a0), P(r1, a1), P(r0, a1), undefined, undefined, undefined, [n, n, n])
  }
}

/** A pilaster standing `depth` proud of the wall: front, two sides and a top. */
export function pilaster(p: Part, e: Edge, uc: number, w: number, depth: number, z0: number, z1: number, top = true) {
  const u0 = uc - w / 2, u1 = uc + w / 2
  p.quad(at(e, u0, depth, z0), at(e, u1, depth, z0), at(e, u1, depth, z1), at(e, u0, depth, z1))
  p.quad(at(e, u1, depth, z0), at(e, u1, 0, z0), at(e, u1, 0, z1), at(e, u1, depth, z1))
  p.quad(at(e, u0, 0, z0), at(e, u0, depth, z0), at(e, u0, depth, z1), at(e, u0, 0, z1))
  if (top) p.quad(at(e, u0, depth, z1), at(e, u1, depth, z1), at(e, u1, 0, z1), at(e, u0, 0, z1))
}

/** A box on the wall (a canopy, a sill, a step), `d0` to `d1` out from it. */
export function wallBox(p: Part, e: Edge, u0: number, u1: number, d0: number, d1: number, z0: number, z1: number) {
  const c = (u: number, d: number, z: number) => at(e, u, d, z)
  p.quad(c(u0, d1, z0), c(u1, d1, z0), c(u1, d1, z1), c(u0, d1, z1))
  p.quad(c(u1, d1, z0), c(u1, d0, z0), c(u1, d0, z1), c(u1, d1, z1))
  p.quad(c(u0, d0, z0), c(u0, d1, z0), c(u0, d1, z1), c(u0, d0, z1))
  p.quad(c(u0, d1, z1), c(u1, d1, z1), c(u1, d0, z1), c(u0, d0, z1))
  p.quad(c(u0, d0, z0), c(u1, d0, z0), c(u1, d1, z0), c(u0, d1, z0))
}

/** A smooth column of radius r from z0 to z1 (no caps: entablature and podium hide them). */
export function column(p: Part, c: XY, r: number, z0: number, z1: number, n = 10) {
  lathe(p, [[r, z0], [r, z1]], n, c, 0)
}

/** Bay centres along an edge: as many bays of about `pitch` as fit, with `margin` kept clear at each end. */
export function bays(L: number, pitch: number, margin = 0.6) {
  const n = Math.max(0, Math.round((L - 2 * margin) / pitch))
  const w = (L - 2 * margin) / Math.max(1, n)
  return Array.from({ length: n }, (_, k) => margin + w * (k + 0.5))
}

// ---------------------------------------------------------------- OSM masses

/** A building or building:part from OSM, in model metres: its rings, heights and roof tags. */
export type OsmPart = { id: string; rings: XY[][]; holes: XY[][]; h: number; min: number; roof: string; rh: number; dir: number | null; or?: string | null; mat?: string | null; col?: string | null }
export type OsmBuilding = { id: string; outer: XY[][]; inner: XY[][]; parts: OsmPart[] }

/**
 * One OSM part as a mass: walls from its min_height to its eave on `wall`
 * (a white band under the eave on `trim` where the wall is tall enough),
 * then its roof on `roof`: flat, a skillion falling toward roof:direction,
 * or hipped (gabled and hipped both; a short ridge reads as either at map
 * distance). Parts that are only a roof (min_height at the wall top) are
 * drawn as their sloped slab.
 */
export function osmMass(P: { wall: Part; roof: Part; trim?: Part | null }, p: OsmPart, band = 0.5) {
  for (let k = 0; k < p.rings.length; k++) {
    const ring = ccw(p.rings[k]), holes = k === 0 ? p.holes.map(cw) : []
    const rh = p.roof === 'flat' ? 0 : Math.min(p.rh || 0, p.h - p.min)
    const eave = p.h - rh
    const roofOnly = p.min > 0.5 && eave - p.min < 0.3
    if (p.roof === 'skillion' && rh > 0) {
      // A plane through the ring: high on the side away from roof:direction, low toward it.
      const d = ((p.dir ?? 0) * Math.PI) / 180, dv: XY = [Math.sin(d), Math.cos(d)]
      const proj = ring.map((q) => q[0] * dv[0] + q[1] * dv[1]), lo = Math.min(...proj), hi = Math.max(...proj)
      const zOf = (q: XY) => p.h - (rh * (q[0] * dv[0] + q[1] * dv[1] - lo)) / Math.max(1e-6, hi - lo)
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length]
        const za = zOf(a), zb = zOf(b)
        const w = roofOnly ? P.roof : P.wall
        w.quad([a[0], a[1], p.min], [b[0], b[1], p.min], [b[0], b[1], zb], [a[0], a[1], za])
      }
      const n0 = (() => { // the plane's normal
        const s = rh / Math.max(1e-6, hi - lo)
        const v: V3 = [dv[0] * s, dv[1] * s, 1], l = Math.hypot(...v)
        return [v[0] / l, v[1] / l, v[2] / l] as V3
      })()
      for (const [a, b, c] of bandTris([ring, ...holes])) P.roof.tri([a[0], a[1], zOf(a)], [b[0], b[1], zOf(b)], [c[0], c[1], zOf(c)], undefined, undefined, undefined, [n0, n0, n0])
      continue
    }
    walls(P.wall, ring, p.min, eave - (P.trim && eave - p.min > 6 ? band : 0))
    holes.forEach((h) => walls(P.wall, h, p.min, eave - (P.trim && eave - p.min > 6 ? band : 0)))
    if (P.trim && eave - p.min > 6) { walls(P.trim, ring, eave - band, eave); holes.forEach((h) => walls(P.trim!, h, eave - band, eave)) }
    if (rh > 0 && p.roof !== 'flat') {
      const sp = Math.sqrt(Math.abs(area(ring)) / 2.5) // about half the short side of a 1:2.5 plan
      hipRoof(P.roof, simplify(ring, 0.6), holes, eave, rh, Math.max(1, Math.min(sp * 0.45, 7)))
    } else cap(P.roof, ring, holes, eave)
  }
}

/**
 * Windows along a building's outline: for each edge, the wall height of the
 * tallest base part just inside it decides how many rows of windows it gets.
 * Rows start at `sill0` and repeat every `storey` metres; one `w` x `wh`
 * panel per bay of `pitch`.
 */
export function osmWindows(win: Part, b: OsmBuilding, o: { pitch?: number; storey?: number; sill0?: number; w?: number; wh?: number; minEdge?: number; archTop?: boolean; pilasters?: Part; pilasterEdge?: number; headroom?: number } = {}) {
  const pitch = o.pitch ?? 3.6, storey = o.storey ?? 3.8, sill0 = o.sill0 ?? 1.3, w = o.w ?? 1.4, wh = o.wh ?? 2.0
  const base = b.parts.filter((p) => p.min < 0.5)
  const rings = [...b.outer.map(ccw), ...b.inner.map(cw)]
  for (const ring of rings) for (const e of edges(ring)) {
    if (e.L < (o.minEdge ?? 3)) continue
    const m: XY = [e.a[0] + e.t[0] * e.L / 2 - e.n[0] * 0.8, e.a[1] + e.t[1] * e.L / 2 - e.n[1] * 0.8]
    const under = base.filter((p) => p.rings.some((r) => inside(m, r)))
    if (!under.length) continue
    const wallH = Math.max(...under.map((p) => p.h - (p.roof === 'flat' ? 0 : p.rh)))
    const rows: number[] = []
    for (let z = sill0; z + wh < wallH - (o.headroom ?? 1.0); z += storey) rows.push(z)
    if (!rows.length) continue
    const us = bays(e.L, pitch, 0.8)
    for (const u of us) rows.forEach((z, k) => {
      if (o.archTop && k === rows.length - 1 && k > 0) archPanel(win, e, u, w, z, z + wh - w / 2, 0.05, 6)
      else panel(win, e, u - w / 2, u + w / 2, z, z + wh, 0.05)
    })
    // white pilasters between the bays of the long fronts, from the ground storey's top to the eave band
    if (o.pilasters && e.L >= (o.pilasterEdge ?? 12) && us.length > 1 && rows.length > 1) {
      const step = us[1] - us[0]
      for (let k = 0; k <= us.length; k++) pilaster(o.pilasters, e, Math.min(e.L - 0.4, Math.max(0.4, us[0] - step / 2 + k * step)), 0.7, 0.3, rows[1] - 0.8, wallH - 0.5, false)
    }
  }
}

// ---------------------------------------------------------------- output

export type Out = Array<{ part: Part; material: MaterialSpec }>
export async function save(file: string, name: string, parts: Out, extras: Record<string, unknown>, maxTris = 6500) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`, Object.fromEntries(used.map(({ part, material }) => [material.name, part.triangles])))
  if (triangles > maxTris || glb.length > 250 * 1024) throw new Error(`${file}: over budget`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

/** The Kremlin's classical ochre, white trim and grey-green roof metal, shared by the Senate, the Arsenal and their neighbours. */
export const KREMLIN = {
  ochre: 0xe8be6e,
  white: 0xf6f1e8,
  roof: 0x97a39d,
  dome: 0x6e8d7f,
}

// ================================================================ the Senate

if (import.meta.main) {
  // OSM relation/1359233, metres about the anchor; outer CCW, courtyards as mapped.
  const OUTER: XY[] = [[-26.07, -85.83], [-23.98, -86.86], [-21.45, -85.58], [-21.11, -85.93], [-15.01, -80.77], [-10.43, -76.89], [-10.75, -76.52], [13.8, -54.87], [14.62, -55.77], [20.09, -51.07], [19.3, -50.2], [23.1, -46.97], [23.93, -47.83], [29.28, -43.29], [28.52, -42.39], [49.84, -24.32], [50.64, -25.22], [61.59, -15.96], [60.84, -15.01], [64.18, -12.18], [64.08, -9.49], [66.81, -8.51], [68.77, -6.53], [69.75, -4.02], [70.02, -1.21], [69.65, 1.49], [68.35, 3.77], [66.24, 5.42], [63.53, 6.51], [63.41, 9.71], [60.79, 12.15], [61.49, 12.93], [51.29, 22.33], [50.54, 21.51], [30.12, 40.35], [30.89, 41.25], [25.04, 46.68], [24.36, 45.67], [21.2, 48.59], [21.99, 49.5], [17.03, 54.11], [16.06, 53.33], [-7.16, 74.77], [-6.32, 75.77], [-13.74, 82.65], [-17.5, 86.15], [-18.43, 85.16], [-21.03, 87.56], [-22.87, 86.73], [-24.83, 87.34], [-37.46, 81.68], [-38.01, 79.85], [-39.86, 79.01], [-39.92, 76.26], [-41.12, 75.97], [-41.43, 61.09], [-40.27, 61.01], [-41.47, 8.24], [-42.53, 8.22], [-42.64, 3.07], [-42.68, 0.88], [-42.76, -2.5], [-42.81, -4.98], [-41.77, -5.01], [-43.02, -59.45], [-43.94, -59.47], [-44.24, -74.15], [-43.35, -74.2], [-43.43, -77.4], [-40.2, -78.97], [-40.73, -80.07], [-27.67, -88.05]]
  const COURTS: XY[][] = ([
    [[-20.86, 68.55], [-26.51, 65.98], [-27.17, 40.61], [-22.77, 42.63], [-17.19, 39.74], [-17.32, 34.5], [-10.5, 37.76], [0.39, 42.96], [2.16, 47.07]],
    [[29.36, -11.52], [21.69, -18.03], [11.71, -26.5], [17.56, -33.4], [14.25, -36.2], [-5.65, -24.95], [-25.57, -13.7], [-25.38, -2.5], [-25.31, 0.48], [-25.24, 3.27], [-25.1, 14.63], [-4.23, 24.66], [16.42, 34.59], [18.65, 32.32], [13.28, 26.18], [22.84, 17.68], [30.32, 11.02], [28.19, 9.42], [26.42, 7.44], [25.07, 5.15], [24.18, 2.63], [23.81, 0.0], [23.96, -2.66], [24.63, -5.24], [25.78, -7.63], [27.38, -9.75]],
    [[-23.31, -67.34], [-0.23, -47.79], [-2.55, -41.73], [-12.1, -36.33], [-22.18, -30.61], [-29.5, -33.29], [-30.23, -63.96]],
  ] as XY[][]).map(cw)
  // The rotunda (relation/1359250's circle), the west wing's oval dome (relation/3272730), the courtyard pavilions.
  const ROT: XY = [37.38, -0.57], ROT_R = 13.57
  const OVAL: XY = [-34.65, 1.09], OVAL_A = 6.4, OVAL_B = 10.3
  const PAVILIONS: XY[] = [[-13.15, 50.15], [-18.53, -51.57]]

  // `door` is the darker green of the domes; the doors, canopies and flagpole share it (see the header).
  const ochre = new Part(), white = new Part(), roof = new Part(), win = new Part(), door = new Part(), red = new Part()

  // Storeys (photo-scaled against the 20 m eave; see the header).
  const H = 20, BAND0 = 7.0, BAND1 = 7.8, ENT = 17.2
  const G0 = 2.1, G1 = 4.7, F0 = 8.9, F1 = 12.1, S0 = 13.6, S1 = 16.0

  // ---- walls: ochre storeys, the white string course, the white entablature, the cornice
  for (const ring of [OUTER, ...COURTS]) {
    walls(ochre, ring, 0, BAND0)
    walls(white, ring, BAND0, BAND1)
    walls(ochre, ring, BAND1, ENT)
    walls(white, ring, ENT, H - 0.6)
    cornice(white, ring, H, 0.55, 0.6)
  }
  hipRoof(roof, simplify(OUTER, 1.4), COURTS.map((c) => simplify(c, 1.0)), H + 0.02, 3, 7, 6)

  // ---- the outer fronts, edge by edge (indices into OUTER; see the header for the scheme)
  type Kind = 'plain' | 'col' | 'arch' | 'pav' | 'apse' | 'gate'
  const SPEC: Record<number, { k: Kind; colStart?: number; colEnd?: number }> = {
    3: { k: 'plain' }, 4: { k: 'plain' },
    6: { k: 'plain', colStart: 12 }, 8: { k: 'col' }, 10: { k: 'arch' }, 12: { k: 'col' }, 14: { k: 'plain' }, 16: { k: 'col' }, 18: { k: 'plain' },
    ...Object.fromEntries([19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((i) => [i, { k: 'apse' as Kind }])),
    29: { k: 'plain' }, 31: { k: 'col' }, 33: { k: 'plain' }, 35: { k: 'col' }, 37: { k: 'arch' }, 39: { k: 'col' }, 41: { k: 'plain', colEnd: 12 }, 43: { k: 'plain' }, 44: { k: 'plain' },
    49: { k: 'pav' },
    54: { k: 'plain' }, 56: { k: 'plain', colStart: 12 }, 60: { k: 'gate' }, 63: { k: 'plain', colEnd: 12 }, 65: { k: 'plain' },
    67: { k: 'plain' }, 68: { k: 'plain' },
    70: { k: 'pav' },
  }
  const PITCH = 3.9, PW = 1.1, PD = 0.35

  /** One plain bay: ground window, a white two-storey surround with the two upper windows on it. */
  const plainBay = (e: Edge, u: number, frame = true, fw = 2.2) => {
    panel(win, e, u - 0.72, u + 0.72, G0, G1, 0.05)
    if (frame) panel(white, e, u - fw / 2, u + fw / 2, F0 - 0.45, S1 + 0.4, 0.03)
    panel(win, e, u - 0.75, u + 0.75, F0, F1, 0.07)
    panel(win, e, u - 0.72, u + 0.72, S0, S1, 0.07)
  }
  /** The triumphal-arch motif: a round-headed opening through both upper storeys between two columns, a white archivolt. */
  const archMotif = (e: Edge, u: number, w = 3.6, groundWindow = true) => {
    const zs = S1 - w / 2 + 0.6
    archBand(white, e, u, w / 2, w / 2 + 0.35, zs, 0.06)
    panel(white, e, u - w / 2 - 0.35, u + w / 2 + 0.35, F0 - 0.5, zs, 0.04)
    archPanel(win, e, u, w - 0.5, F0, zs, 0.08)
    panel(white, e, u - (w - 0.5) / 2, u + (w - 0.5) / 2, F1 + 0.1, F1 + 0.6, 0.1) // the transom
    pilaster(white, e, u - w / 2 - 0.75, 0.7, 0.5, BAND1, H - 0.6, false)
    pilaster(white, e, u + w / 2 + 0.75, 0.7, 0.5, BAND1, H - 0.6, false)
    if (groundWindow) panel(win, e, u - 0.75, u + 0.75, G0, G1, 0.05)
  }
  /** A door at ground level with a white surround and a fanlight; `canopy` adds the dark metal canopy over it. */
  const doorway = (e: Edge, u: number, w = 1.9, canopy = true) => {
    panel(white, e, u - w / 2 - 0.35, u + w / 2 + 0.35, 0, 4.6, 0.04)
    panel(door, e, u - w / 2, u + w / 2, 0, 3.3, 0.07)
    archPanel(win, e, u, w, 3.4, 3.4, 0.07, 6)
    if (canopy) wallBox(door, e, u - w / 2 - 0.6, u + w / 2 + 0.6, 0.05, 2.2, 3.9, 4.15)
  }

  const outerEdges = edges(OUTER)
  for (const [key, spec] of Object.entries(SPEC)) {
    const i = +key, e = outerEdges[i]
    if (spec.k === 'plain') {
      const us = bays(e.L, PITCH)
      const cs = spec.colStart ?? 0, ce = spec.colEnd ?? 0
      us.forEach((u) => {
        const inCol = (cs && u < cs) || (ce && u > e.L - ce)
        plainBay(e, u, !inCol)
      })
      // pilasters between the bays of a pilaster run
      const pil = (u0: number, u1: number) => {
        const run = us.filter((u) => u >= u0 && u <= u1)
        if (!run.length) return
        const step = us.length > 1 ? us[1] - us[0] : PITCH
        for (let k = 0; k <= run.length; k++) pilaster(white, e, run[0] - step / 2 + k * step, PW, PD, BAND1, H - 0.6, false)
      }
      if (cs) pil(0, cs)
      if (ce) pil(e.L - ce, e.L)
    } else if (spec.k === 'col') {
      const us = bays(e.L, PITCH, 0.3)
      us.forEach((u) => plainBay(e, u, false))
      const step = us.length ? e.L / us.length : e.L
      for (let k = 0; k <= us.length; k++) pilaster(white, e, Math.min(e.L - PW / 2, Math.max(PW / 2, k * step)), PW, PD, BAND1, H - 0.6, false)
    } else if (spec.k === 'arch') {
      archMotif(e, e.L / 2, Math.min(3.2, e.L - 1.6))
    } else if (spec.k === 'gate') {
      // The west front's centre (edges 58-61, one straight 13 m risalit): a pilastered bay each side,
      // the arch motif over the carriage arch into the main courtyard.
      const g = edgeOf(OUTER[58], OUTER[62]), uc = g.L / 2
      archMotif(g, uc, 3.2, false)
      panel(white, g, uc - 2.4, uc + 2.4, 0, 6.2, 0.04)
      archPanel(door, g, uc, 3.6, 0, 4.0, 0.07, 10)
      for (const s of [-1, 1]) {
        plainBay(g, uc + s * 4.3, false)
        pilaster(white, g, uc + s * 6.2, PW, PD, BAND1, H - 0.6, false)
      }
    } else if (spec.k === 'pav') {
      // A cut corner: two bays, the arch motif with a canopied door under it, two bays.
      const side = (e.L - 5.6) / 2
      for (const u of [side * 0.27, side * 0.75]) { plainBay(e, u, true, 1.8); plainBay(e, e.L - u, true, 1.8) }
      archMotif(e, e.L / 2, 3.4, false)
      doorway(e, e.L / 2)
    } else if (spec.k === 'apse') {
      // The Red Square apse: a window column on each facet, a pilaster at each corner.
      plainBay(e, e.L / 2, false)
      pilaster(white, e, 0, 0.8, 0.45, BAND1, H - 0.6, false)
    }
  }

  // ---- the courtyards: plain bays, no surrounds; nothing on the rotunda's arc
  for (const ring of COURTS) for (const e of edges(ring)) {
    if (e.L < 3.6) continue
    const mid: XY = [e.a[0] + e.t[0] * e.L / 2, e.a[1] + e.t[1] * e.L / 2]
    if (Math.hypot(mid[0] - ROT[0], mid[1] - ROT[1]) < ROT_R + 1.5) continue
    for (const u of bays(e.L, 4.2, 1.0)) {
      panel(win, e, u - 0.7, u + 0.7, G0, G1, 0.05)
      panel(win, e, u - 0.72, u + 0.72, F0, S1, 0.05)
      panel(white, e, u - 0.72, u + 0.72, F1 + 0.1, S0 - 0.1, 0.07)
    }
  }

  // ---- the rotunda: podium, colonnade and entablature over the courtyard arc; the drum; the dome
  {
    const c = ROT, R = ROT_R
    const pt = (r: number, a: number): XY => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
    const deg = Math.PI / 180, a0 = 180 * deg
    // the courtyard arc, 112 degrees about due west of the centre
    const arc = (r: number, n = 8, half = 56 * deg) => Array.from({ length: n + 1 }, (_, k) => pt(r, a0 - half + (2 * half * k) / n))
    const ringBand = (p: Part, r0: number, r1: number, z0: number, z1: number, top: Part | null) => {
      // a thick arc from r0 (the wall) to r1, walls on its outer face and its ends, a lid
      const o = arc(r1), i = arc(r0)
      for (let k = 0; k < o.length - 1; k++) {
        p.quad([o[k][0], o[k][1], z0], [o[k + 1][0], o[k + 1][1], z0], [o[k + 1][0], o[k + 1][1], z1], [o[k][0], o[k][1], z1])
        if (top) top.quad([o[k][0], o[k][1], z1], [o[k + 1][0], o[k + 1][1], z1], [i[k + 1][0], i[k + 1][1], z1], [i[k][0], i[k][1], z1])
      }
    }
    // podium: the rusticated ground storey stands 1.6 m forward of the hall's wall
    ringBand(ochre, R - 0.2, R + 1.6, 0, BAND0, null)
    ringBand(white, R - 0.2, R + 1.75, BAND0, BAND1, white)
    // the hall's wall behind the colonnade, with its two storeys of windows between the columns
    const span = arc(R + 0.02)
    for (let k = 0; k < span.length - 1; k++) {
      const e = edgeOf(span[k], span[k + 1])
      panel(win, e, e.L / 2 - 0.75, e.L / 2 + 0.75, F0, F1, 0.05)
      panel(win, e, e.L / 2 - 0.72, e.L / 2 + 0.72, S0, S1, 0.05)
    }
    // three doors under the colonnade, on the podium's face
    const pod = arc(R + 1.62)
    for (const k of [3, 4]) {
      const e = edgeOf(pod[k], pod[k + 1])
      doorway(e, e.L / 2, 1.7, false)
    }
    // eight columns
    for (let k = 0; k < 8; k++) column(white, pt(R + 1.0, a0 - 49 * deg + k * 14 * deg), 0.5, BAND1, ENT, 8)
    ringBand(white, R - 0.2, R + 1.75, ENT, H, white)

    // the drum over the roof: ochre with sixteen arched windows, the white cornice, the attic
    const N = 24
    const drum = Array.from({ length: N }, (_, k) => pt(R, (2 * Math.PI * k) / N))
    walls(ochre, drum, H, 25.6)
    const de = edges(drum)
    de.forEach((e, k) => {
      if (k % 3 === 1) return
      archPanel(win, e, e.L / 2, 1.5, 21.6, 24.0, 0.05, 6)
    })
    const corn = Array.from({ length: N }, (_, k) => pt(R + 0.45, (2 * Math.PI * k) / N))
    loft(white, drum, 25.6, corn, 25.9)
    walls(white, corn, 25.9, 26.4)
    const attic = Array.from({ length: N }, (_, k) => pt(R - 0.35, (2 * Math.PI * k) / N))
    loft(white, corn, 26.4, attic, 26.5)
    walls(ochre, attic, 26.5, 27.4)
    // the dome: a steeper skirt, a step, a shallow cap
    const prof: [number, number][] = [[R - 0.4, 27.4], [R - 1.3, 28.9], [R - 1.6, 29.0]]
    const capR = R - 1.6, capTop = 37.0
    const k0 = (capR * capR) / (2 * (capTop - 29.0)) + (capTop - 29.0) / 2 // sphere radius through the cap's rim and apex
    for (let k = 1; k <= 4; k++) {
      const r = capR * Math.cos((k / 4) * Math.acos(2.55 / capR))
      prof.push([r, capTop - k0 + Math.sqrt(k0 * k0 - r * r)])
    }
    lathe(door, prof, N, c, 0)
    // the lantern and its railing ring, the flagpole and the standard
    const lr = prof[prof.length - 1][0], lz = prof[prof.length - 1][1]
    lathe(white, [[lr + 0.05, lz - 0.05], [lr + 0.05, lz + 1.4], [lr + 0.35, lz + 1.55], [0, lz + 1.6]], 12, c, 0)
    const top = lz + 1.6
    lathe(door, [[0.16, top], [0.1, 48.2], [0, 48.5]], 6, c, 0)
    // the standard flies east-north-east from the pole, three stripes
    const fl = (p: Part, z0: number, z1: number) => {
      const s: XY = [Math.cos(20 * deg), Math.sin(20 * deg)]
      const A: V3 = [c[0] + s[0] * 0.15, c[1] + s[1] * 0.15, z0], B: V3 = [c[0] + s[0] * 4.0, c[1] + s[1] * 4.0, z0]
      const C: V3 = [B[0], B[1], z1], D: V3 = [A[0], A[1], z1]
      p.quad(A, B, C, D); p.quad(A, D, C, B)
    }
    fl(red, 45.3, 46.17); fl(win, 46.17, 47.03); fl(white, 47.03, 47.9)
  }

  // ---- the west wing's oval dome over the Oval Hall (OSM 20 -> 32 m)
  {
    const N = 14
    const ring = (r: number): XY[] => Array.from({ length: N }, (_, k) => [OVAL[0] + OVAL_A * r * Math.cos((2 * Math.PI * k) / N), OVAL[1] + OVAL_B * r * Math.sin((2 * Math.PI * k) / N)])
    walls(ochre, ring(1), H, 23.6)
    loft(white, ring(1), 23.6, ring(1.05), 23.9)
    walls(white, ring(1.05), 23.9, 24.2)
    const prof = [1.0, 0.92, 0.7, 0.38, 0].map((r, k) => [r, 24.2 + 5.0 * Math.sin((Math.PI / 2) * (k / 4))] as [number, number])
    // an elliptical dome: lathe a unit profile and scale it to the oval
    const tmp = new Part()
    lathe(tmp, prof, N, [0, 0], 0)
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const V = (j: number): V3 => [OVAL[0] + tmp.pos[i + j] * OVAL_A, OVAL[1] - tmp.pos[i + j + 2] * OVAL_B, tmp.pos[i + j + 1]]
      const Nm = (j: number): V3 => { const v: V3 = [tmp.nrm[i + j] / OVAL_A, -tmp.nrm[i + j + 2] / OVAL_B, tmp.nrm[i + j + 1]], l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
      door.tri(V(0), V(3), V(6), undefined, undefined, undefined, [Nm(0), Nm(3), Nm(6)])
    }
    lathe(white, [[0.9, 29.0], [0.9, 29.8], [0, 29.9]], 8, OVAL, 0)
  }

  // ---- the courtyard portico on the west wing: four columns, a pediment, over the carriage arch
  {
    const e = edgeOf([-25.38, -4.0], [-25.24, 6.0]) // the courtyard face, looking east
    const uc = e.L / 2
    panel(white, e, uc - 2.4, uc + 2.4, 0, 6.2, 0.04)
    archPanel(door, e, uc, 3.6, 0, 4.0, 0.07, 10)
    wallBox(white, e, uc - 5.2, uc + 5.2, 0, 2.6, BAND0, BAND1 + 0.2) // the portico's floor over the arch
    for (const du of [-4.2, -1.4, 1.4, 4.2]) {
      const p = [e.a[0] + e.t[0] * (uc + du) + e.n[0] * 1.9, e.a[1] + e.t[1] * (uc + du) + e.n[1] * 1.9] as XY
      column(white, p, 0.45, BAND1 + 0.2, ENT, 10)
    }
    wallBox(white, e, uc - 5.2, uc + 5.2, 0, 2.6, ENT, H)
    // the pediment: a gabled block over the portico
    const P = (u: number, d: number, z: number): V3 => [e.a[0] + e.t[0] * u + e.n[0] * d, e.a[1] + e.t[1] * u + e.n[1] * d, z]
    const ph = 3.0
    white.tri(P(uc - 5.2, 2.6, H), P(uc + 5.2, 2.6, H), P(uc, 2.6, H + ph))
    roof.quad(P(uc + 5.2, 2.6, H), P(uc + 5.2, -1, H), P(uc, -1, H + ph), P(uc, 2.6, H + ph))
    roof.quad(P(uc - 5.2, -1, H), P(uc - 5.2, 2.6, H), P(uc, 2.6, H + ph), P(uc, -1, H + ph))
  }

  // ---- the two round pavilions in the north and south courtyards (OSM 8.5 m, domed)
  for (const c of PAVILIONS) {
    const r = 2.4
    lathe(ochre, [[r, 0], [r, 3.6]], 10, c, 0)
    lathe(white, [[r, 3.6], [r + 0.25, 4.0]], 10, c, 0)
    lathe(roof, [[r + 0.25, 4.0], [r * 0.75, 6.6], [0, 8.5]], 10, c, 0)
  }

  // ---- write
  const facade = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)
  await save('moscow-senate.glb', 'Kremlin Senate', [
    { part: ochre, material: { ...finish('senate-ochre', KREMLIN.ochre), floodlight: facade } },
    { part: white, material: { ...PALETTE.trim, color: KREMLIN.white, floodlight: facade } },
    { part: roof, material: finish('kremlin-roof', KREMLIN.roof) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('kremlin-dome', KREMLIN.dome) },
    { part: red, material: { ...finish('flag-red', 0xc8382f), floodlight: () => 1 } },
  ], { bearing: 0, elevation: 0, height: 48.5 })
}
