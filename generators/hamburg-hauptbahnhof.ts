/**
 * Hamburg Hauptbahnhof (Reinhardt & Süßenguth, 1902-1906): original
 * procedural geometry, CC0-1.0.
 * bun generators/hamburg-hauptbahnhof.ts
 * Writes models/hamburg-hauptbahnhof.glb.
 *
 * Map frame, bearing 0: x east, y north, z up, metres. Origin = 10.00676 E,
 * 53.55298 N, near the middle of OSM way/137538320. The station is not
 * square to the compass: the train shed curves (its axis turns from about
 * 12 to 20 degrees west of north going north) and the north buildings are
 * turned 20.2 degrees; both are drawn along their OSM lines.
 *
 * Ground. Heights in this file count from street level. The tracks lie
 * about 8 m lower, under the hall, but the map's terrain shows no cut there,
 * so nothing below the street is modelled. Mapterhorn at this site is a
 * surface model, not bare earth: a smooth hump up to 25 m high where the
 * station itself stands. Along the walls it rises 2 to 8.4 m over the lowest
 * point (filled, as Parchment draws it; up to 10.7 m unfilled, as this site
 * draws it), so the street is written out LIFT = 5 m above y = 0 and the
 * walls run down to y = 0. On the low north-west side up to 3 m of plain
 * base shows; on the high east side the ground floor is still partly under.
 * The catalog elevation stays 0: a raised placement would lose the fill.
 *
 * What makes it the Hauptbahnhof, and how each is drawn
 * 1. The great arched train shed, 75 m wide: a flat-shouldered arch in dark
 *    roofing, glazed flanks with grey arched ribs, a long raised lantern.
 * 2. The glass gable at each end, inside a broad grey rim.
 * 3. Seven arched side gables a side, each with a small ridge skylight.
 * 4. Two 45 m clock towers at the ends of the Wandelhalle.
 * 5. The sandstone north front: three great arched windows, two gabled bays
 *    between them and a domed turret at each corner.
 * Also the Wandelhalle's barrel roof and end arches, the south-west
 * pavilion, and the octagonal office block on the south-east ("Keksdose"),
 * which stands inside the station outline.
 *
 * Sources
 * - OSM way/137538320 (outline) and its building:part ways: the shed
 *   way/358089267 (26 m, round), lantern way/358089268 (26-28 m), side bays
 *   (8.5 m, gabled), Wandelhalle way/733771949 (18 m), towers way/643941509
 *   and way/733771939 (45 m), Keksdose way/362534420 (24 m) and
 *   way/362588897 (26.8 m), canopy way/645975555.
 *   (c) OpenStreetMap contributors, ODbL.
 * - Published: towers 45 m, hall up to 37 m high, hall span 73 m
 *   (https://de.wikipedia.org/wiki/Hamburg_Hauptbahnhof).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Hamburg Hauptbahnhof, Südseite-9119.jpg", Raimond Spekking, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Hamburg_Hauptbahnhof,_S%C3%BCdseite-9119.jpg
 *   "Hamburger Hauptbahnhof Nordseite.jpg", Pauli-Pirat, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Hamburger_Hauptbahnhof_Nordseite.jpg
 *   "Hauptbahnhof, Hamburg (LRM 20191130 154653).jpg", Matti Blume,
 *     CC BY-SA 4.0 (south-west corner, flank, side gables)
 *     https://commons.wikimedia.org/wiki/File:Hauptbahnhof,_Hamburg_(LRM_20191130_154653).jpg
 *   "Phb dt 8255 Hauptbahnhof.jpg", "Phb dt 8260 Hbf und Alster.jpg",
 *     Dirtsc, CC BY-SA 3.0 (from high up, south-west)
 *     https://commons.wikimedia.org/wiki/File:Phb_dt_8255_Hauptbahnhof.jpg
 *     https://commons.wikimedia.org/wiki/File:Phb_dt_8260_Hbf_und_Alster.jpg
 *   "2013-06-08 Highflyer HP L4729.JPG", Alchemist-hp, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:2013-06-08_Highflyer_HP_L4729.JPG
 *   "Xway-image.de Luftbild - panoramio.jpg", Ralf Schmidt, CC BY-SA 3.0
 *     (the roof from above)
 *     https://commons.wikimedia.org/wiki/File:Xway-image.de_Luftbild_-_panoramio.jpg
 *   "Luftbild Hamburger Hauptbahnhof mit Gleisbild - Nordseite ...",
 *     Wolfgang Pehlemann, CC BY-SA 3.0 de
 *     https://commons.wikimedia.org/wiki/File:Luftbild_Hamburger_Hauptbahnhof_mit_Gleisbild_-_Nordseite_-_Bj_1906_-_Innenstadt_Hamburg_Germany_-_Foto_Wolfgang_Pehlemann_DSC07955.jpg
 *   "Hamburg Hauptbahnhof P1060528.JPG", Gunnar Ries, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Hamburg_Hauptbahnhof_P1060528.JPG
 * - Look-only: none.
 * - Checked against, no value taken: the city's LoD2 and LoD3 building
 *   models (Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und
 *   Vermessung, dl-de/by-2-0) showed which parts to measure again on the
 *   photos.
 *
 * Measured / published / estimated
 * - From OSM: every plan line, the 75 m between the side bays, the tower and
 *   Keksdose heights.
 * - Measured on two aerial photos (Highflyer L4729 from the south-south-west,
 *   Pehlemann DSC07955 from the north-west) by fitting a camera (position,
 *   direction, focal length) to OSM plan points and the towers' published
 *   45 m, to about 1 m: the tower stages (clock centre 29.5 m, stone shaft to
 *   23.6 m), the Wandelhalle's ridge 21.3 m and end turrets 22 m, the north
 *   turrets 19.7 m, the wings' eaves 10 m, the main roof running on over the
 *   Wandelhalle at full height (gable 27-28 m), and the Keksdose (24.4 and
 *   26.5 m, agreeing with OSM).
 * - Estimated from photos: the arch's profile (apex 29 m above the
 *   street, which with tracks 8 m down matches the published 37 m), the roof
 *   lantern 29.45 m; side gables 7 to 12.8 m; the north front's eaves 15.2 m
 *   and roof 18 m; the Wandelhalle's end arches; all window sizes and spacing.
 * - Doubts: the east flank and east end of the Wandelhalle are seen only
 *   from far off and are mirrored from the west; the south-east wing's
 *   curved roof is simplified. No open exterior night photo was found, so
 *   nothing is floodlit: only windows, hall glazing and clock faces light.
 */
import { Part, type V3, type MaterialSpec, cross, sub } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const stone = new Part(), dark = new Part(), grey = new Part(), win = new Part(), trim = new Part(), clock = new Part()

/** A convex polygon wound to face `out`. */
function poly(p: Part, pts: V3[], out: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    let a = pts[0], b = pts[i], c = pts[i + 1]
    const n = cross(sub(b, a), sub(c, a))
    if (Math.hypot(...n) < 1e-6) continue
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) [b, c] = [c, b]
    p.tri(a, b, c)
  }
}

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** Ear clipping, for the flat roofs of OSM rings that are not convex. */
function earcut(ring: XY[]): XY[][] {
  const pts = [...ccw(ring)], tris: XY[][] = []
  const turn = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  for (let guard = 0; pts.length > 3 && guard < 500; guard++) {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
      if (turn(a, b, c) <= 1e-9) continue
      if (pts.some((q) => q !== a && q !== b && q !== c && turn(a, b, q) >= 0 && turn(b, c, q) >= 0 && turn(c, a, q) >= 0)) continue
      tris.push([a, b, c]); pts.splice(i, 1); break
    }
  }
  tris.push(pts as XY[])
  return tris
}

const at = (q: XY, z: number): V3 => [q[0], q[1], z]

/** Walls of a ring from z0 to z1 and a flat cap on top. */
function prism(wall: Part, top: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    wall.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
  })
  for (const t of earcut(r)) poly(top, t.map((q) => at(q, z1)), [0, 0, 1])
}

/** A vertical wall plane from a to b; `s` runs along it, `d` out toward `out`. */
function wallOf(a: XY, b: XY, out: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  let nx = uy, ny = -ux
  if (nx * out[0] + ny * out[1] < 0) { nx = -nx; ny = -ny }
  const P = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  const N: V3 = [nx, ny, 0]
  const panel = (p: Part, s0: number, s1: number, z0: number, z1: number, d = 0.06) =>
    poly(p, [P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d)], N)
  /** A round-headed panel: jambs to zs, a semicircle (or `rise`) above. */
  const arch = (p: Part, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 10, rise = w / 2) => {
    const pts: V3[] = [P(sc - w / 2, z0, d), P(sc + w / 2, z0, d)]
    for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; pts.push(P(sc + (w / 2) * Math.cos(t), zs + rise * Math.sin(t), d)) }
    poly(p, pts, N)
  }
  /** A row of equal panels spread over s0..s1. */
  const row = (p: Part, s0: number, s1: number, n: number, w: number, z0: number, z1: number, d = 0.06) => {
    for (let i = 0; i < n; i++) { const s = s0 + (s1 - s0) * (i + 0.5) / n; panel(p, s - w / 2, s + w / 2, z0, z1, d) }
  }
  return { L, P, N, panel, arch, row }
}

// ===== The great shed =========================================================
/**
 * The shed's sides, south to north: the inner edges of the side bays, the
 * Wandelhalle's south edge (station HALL_END), and the north gable just behind
 * the north block, where the main roof ends after crossing the Wandelhalle.
 */
const WEST: XY[] = [[-10.5, -107.2], [-15, -85.6], [-18, -72.7], [-21.3, -58.6], [-25.3, -44.2], [-29.4, -29.7], [-34, -15.2], [-38.6, -1.1], [-43.8, 13.8], [-48.6, 26.4], [-58.4, 53.2]]
const EAST: XY[] = [[62.9, -91.9], [58.3, -70.6], [54.5, -54.6], [50.6, -39.3], [46.5, -23.4], [41.8, -7.8], [37.2, 7.4], [32.4, 22], [27.1, 37.2], [21.9, 52], [12.1, 78.8]]
const HALF: [number, number][] = [[1, 0], [1, 9], [1, 12.5], [0.985, 15.5], [0.95, 17.9], [0.9, 20], [0.8, 22.2], [0.65, 23.8], [0.45, 25.6], [0.22, 27.2]]
/**
 * Cross-section, west to east: [u in -1..1, height]. Traced from the south
 * gable: upright feet, round shoulders, and two nearly straight roof slopes
 * that meet in a point.
 */
const PROFILE: [number, number][] = [...HALF.map(([u, z]): [number, number] => [-u, z]), [0, 29], ...[...HALF].reverse()]
const GLAZED_TOP = 20

/** A point of the shed at station i, across at u, height z. */
function shed(i: number, u: number, z: number): V3 {
  const w = WEST[i], e = EAST[i], t = (u + 1) / 2
  return [w[0] + (e[0] - w[0]) * t, w[1] + (e[1] - w[1]) * t, z]
}
const LAST = WEST.length - 1, HALL_END = LAST - 1

for (let i = 0; i < LAST; i++) {
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [u0, z0] = PROFILE[k], [u1, z1] = PROFILE[k + 1]
    const crossing = i >= HALL_END
    if (crossing && Math.max(z0, z1) <= 12.5) continue // inside the Wandelhalle
    const part = Math.max(z0, z1) <= 9 ? stone : Math.max(z0, z1) <= GLAZED_TOP && !crossing ? win : dark
    const inside = shed(i, 0, 5), a = shed(i, u0, z0)
    poly(part, [a, shed(i, u1, z1), shed(i + 1, u1, z1), shed(i + 1, u0, z0)], [a[0] - inside[0], a[1] - inside[1], a[2] - inside[2] + 1])
  }
}

/** Unit vector along the shed at station i (northward). */
function along(i: number): XY {
  const a = shed(Math.max(0, i - 1), 0, 0), b = shed(Math.min(LAST, i + 1), 0, 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
}

// Grey arched ribs over the glazed flanks at every bay line, and a sill and a mid line.
for (let i = 1; i < HALL_END; i++) {
  const [ax, ay] = along(i)
  for (const side of [-1, 1]) {
    const ribs: [number, number][] = [[1, 9], [1, 12.5], [0.985, 15.5], [0.95, 17.9], [0.885, 20.35]]
    for (let k = 0; k < ribs.length - 1; k++) {
      const P = (j: number, d: number): V3 => {
        const p = shed(i, side * (ribs[j][0] + 0.012), ribs[j][1] + 0.12)
        return [p[0] + ax * d, p[1] + ay * d, p[2]]
      }
      const c = shed(i, 0, 8), a = P(k, 0)
      poly(grey, [P(k, -0.55), P(k, 0.55), P(k + 1, 0.55), P(k + 1, -0.55)], [a[0] - c[0], a[1] - c[1], a[2] - c[2]])
    }
  }
}
for (const side of [-1, 1]) for (const [u, z, h] of [[0.988, 14.2, 0.45], [0.896, 19.8, 0.7]]) {
  for (let i = 0; i < HALL_END; i++) {
    const c = shed(i, 0, z), a = shed(i, side * (u + 0.014), z), b = shed(i + 1, side * (u + 0.014), z)
    poly(grey, [a, b, [b[0], b[1], z + h], [a[0], a[1], z + h]], [a[0] - c[0], a[1] - c[1], 0.4])
  }
}

// The lantern along the crown, glazed on its sides.
{
  const U = 0.27, S0 = 1, S1 = HALL_END
  for (let i = S0; i < S1; i++) {
    for (const side of [-1, 1]) {
      const a = shed(i, side * U, 26.6), b = shed(i + 1, side * U, 26.6), c = shed(i, 0, 26.6)
      poly(win, [a, b, [b[0], b[1], 27.7], [a[0], a[1], 27.7]], [a[0] - c[0], a[1] - c[1], 0])
      const top = (j: number, v: number) => shed(j, side * v * U, 29.45 - 1.75 * v)
      for (const [v0, v1, p] of [[1, 0.8, dark], [0.8, 0.25, grey], [0.25, 0, dark]] as [number, number, Part][])
        poly(p, [top(i, v0), top(i + 1, v0), top(i + 1, v1), top(i, v1)], [0, 0, 1])
    }
  }
  for (const [i, dir] of [[S0, -1], [S1, 1]]) {
    const [ax, ay] = along(i)
    poly(dark, [shed(i, -U, 26.6), shed(i, U, 26.6), shed(i, U, 27.7), shed(i, 0, 29.45), shed(i, -U, 27.7)], [ax * dir, ay * dir, 0])
  }
}

/** A glazed gable end at station i facing `dir` (-1 south, +1 north). */
function gable(i: number, dir: 1 | -1, base: number) {
  const [ax, ay] = along(i), out: V3 = [ax * dir, ay * dir, 0]
  const move = (p: V3, d: number): V3 => [p[0] + out[0] * d, p[1] + out[1] * d, p[2]]
  const arc = PROFILE.filter(([, z]) => z >= 9).map(([u, z]): [number, number] => [u, Math.max(base, z)])
  const outer: [number, number][] = [[-1, base], ...arc, [1, base]]
  const inner = outer.map(([u, z]): [number, number] => [u * 0.925, Math.max(base, z - 2.3)])
  for (let k = 0; k < outer.length - 1; k++) {
    const O0 = shed(i, ...outer[k]), O1 = shed(i, ...outer[k + 1]), I0 = shed(i, ...inner[k]), I1 = shed(i, ...inner[k + 1])
    // The rim's face, its outer edge and its reveal.
    poly(grey, [move(O0, 0.9), move(O1, 0.9), move(I1, 0.9), move(I0, 0.9)], out)
    const c = shed(i, 0, base)
    poly(grey, [move(O0, -0.2), move(O1, -0.2), move(O1, 0.9), move(O0, 0.9)], [O0[0] - c[0], O0[1] - c[1], O0[2] - c[2] + 1])
    poly(grey, [move(I0, 0.15), move(I1, 0.15), move(I1, 0.9), move(I0, 0.9)], [c[0] - I0[0], c[1] - I0[1], c[2] - I0[2]])
    // Glazing inside the rim.
    poly(win, [move(shed(i, inner[k][0], base), 0.15), move(shed(i, inner[k + 1][0], base), 0.15), move(I1, 0.15), move(I0, 0.15)], out)
  }
  /** Height of the rim's inner edge at u. */
  const top = (u: number) => {
    for (let k = 0; k < inner.length - 1; k++) {
      const [u0, z0] = inner[k], [u1, z1] = inner[k + 1]
      if (u >= u0 && u <= u1 && u1 > u0) return z0 + (z1 - z0) * (u - u0) / (u1 - u0)
    }
    return base
  }
  for (let m = -7; m <= 7; m++) {
    const u = m * 0.115, w = 0.0055
    poly(grey, [move(shed(i, u - w, base), 0.25), move(shed(i, u + w, base), 0.25), move(shed(i, u + w, top(u + w)), 0.25), move(shed(i, u - w, top(u - w)), 0.25)], out)
  }
  for (const z of [base + 0.1, base + 7.5]) {
    const u = z > base + 1 ? 0.87 : 0.9
    poly(grey, [move(shed(i, -u, z), 0.28), move(shed(i, u, z), 0.28), move(shed(i, u, z + 0.5), 0.28), move(shed(i, -u, z + 0.5), 0.28)], out)
  }
}
gable(0, -1, 6.6)
gable(LAST, 1, 12)
{
  // The street storey under the south gable: a row of small windows.
  const f = wallOf(WEST[0], EAST[0], [0, -1])
  poly(stone, [f.P(0, 0, 0.15), f.P(f.L, 0, 0.15), f.P(f.L, 6.6, 0.15), f.P(0, 6.6, 0.15)], f.N)
  poly(dark, [f.P(0, 5.5, 0.9), f.P(f.L, 5.5, 0.9), f.P(f.L, 6.7, 0.15), f.P(0, 6.7, 0.15)], [f.N[0], f.N[1], 1])
  f.row(win, 2, f.L - 2, 16, 2.6, 3.4, 5.0, 0.22)
  f.row(win, 2, f.L - 2, 9, 4.2, 0.3, 2.6, 0.22)
}

// ===== The side bays ==========================================================
const WOUT: XY[] = [[-30.6, -111.4], [-35.1, -89.8], [-37.7, -77.1], [-41.2, -63.3], [-44.9, -49.3], [-48.8, -35.2], [-53.2, -21.5], [-58, -7.3], [-62.9, 7.3]]
const EOUT: XY[] = [[81.5, -87.8], [76.8, -66.7], [73, -50.2], [69.1, -34.2], [64.9, -18.3], [60.4, -2.7], [55.7, 13], [50.8, 28], [52.5, 46.1]]

for (const [inner, outer, sx] of [[WEST, WOUT, -1], [EAST, EOUT, 1]] as [XY[], XY[], number][]) {
  // The southern bay of each side: a lean-to curving down from the shed.
  {
    const a = inner[0], b = inner[1], c = outer[1], d = outer[0]
    const steps: [number, number][] = [[0, 13.8], [0.3, 13.2], [0.6, 11.8], [0.85, 10.2], [1, 9]]
    const mix = (p: XY, q: XY, t: number, z: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, z]
    for (let k = 0; k < steps.length - 1; k++) {
      const [t0, z0] = steps[k], [t1, z1] = steps[k + 1]
      poly(dark, [mix(a, d, t0, z0), mix(a, d, t1, z1), mix(b, c, t1, z1), mix(b, c, t0, z0)], [0, 0, 1])
      for (const [p, q, o] of [[a, d, [0, -1]], [b, c, [0, 1]]] as [XY, XY, XY][])
        poly(stone, [mix(p, q, t0, 0), mix(p, q, t1, 0), mix(p, q, t1, z1), mix(p, q, t0, z0)], [o[0], o[1], 0])
    }
    const south = wallOf(a, d, [0, -1])
    south.row(win, 1, south.L - 1, 6, 1.5, 6.2, 8.2)
    south.row(win, 1, south.L - 1, 6, 1.5, 2.6, 4.8)
    const end = wallOf(d, c, [sx, 0])
    poly(stone, [end.P(0, 0), end.P(end.L, 0), end.P(end.L, 9), end.P(0, 9)], end.N)
    end.row(win, 1, end.L - 1, 6, 1.6, 6.2, 8.0)
  }
  // The seven gabled bays.
  for (let i = 1; i < 8; i++) {
    const a = outer[i], b = outer[i + 1]
    const ia = inner[i], ib = inner[i + 1]
    const N = 6, SPRING = 7, RISE = 5.8
    const zt = (t: number) => SPRING + RISE * Math.pow(Math.sin(Math.PI * t), 0.75)
    const lerp2 = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
    const end = wallOf(a, b, [sx, 0])
    const pts: V3[] = [end.P(0, 0), end.P(end.L, 0)]
    for (let k = N; k >= 0; k--) pts.push(end.P(end.L * k / N, zt(k / N)))
    poly(stone, pts, end.N)
    for (let k = 0; k < N; k++) {
      const t0 = k / N, t1 = (k + 1) / N
      const o0 = lerp2(a, b, t0), o1 = lerp2(a, b, t1), n0 = lerp2(ia, ib, t0), n1 = lerp2(ia, ib, t1)
      poly(dark, [at(o0, zt(t0)), at(o1, zt(t1)), at(n1, zt(t1)), at(n0, zt(t0))], [0, 0, 1])
      // The pale rim round the arch, and the glazing inside it.
      const s0 = end.L * t0, s1 = end.L * t1, g = (t: number) => Math.max(SPRING - 0.6, zt(t) - 0.9)
      const gs = (t: number) => 0.7 + (end.L - 1.4) * t
      poly(grey, [end.P(s0, zt(t0), 0.2), end.P(s1, zt(t1), 0.2), end.P(gs(t1), g(t1), 0.2), end.P(gs(t0), g(t0), 0.2)], end.N)
      poly(win, [end.P(gs(t0), SPRING - 1, 0.1), end.P(gs(t1), SPRING - 1, 0.1), end.P(gs(t1), g(t1), 0.1), end.P(gs(t0), g(t0), 0.1)], end.N)
    }
    for (const s of [0.28, 0.5, 0.72]) end.panel(grey, end.L * s - 0.14, end.L * s + 0.14, SPRING - 1, zt(s) - 0.9, 0.18)
    end.row(win, 0.8, end.L - 0.8, 3, 2.6, 1.2, 4.2)
    // The ridge skylight.
    const r0 = lerp2(a, ia, 0.12), r1 = lerp2(a, ia, 0.85), q0 = lerp2(b, ib, 0.12), q1 = lerp2(b, ib, 0.85)
    const L0 = lerp2(r0, q0, 0.34), L1 = lerp2(r1, q1, 0.34), R0 = lerp2(r0, q0, 0.66), R1 = lerp2(r1, q1, 0.66)
    const M0 = lerp2(r0, q0, 0.5), M1 = lerp2(r1, q1, 0.5), zb = zt(0.34), zr = SPRING + RISE + 1.2
    const across: XY = [q0[0] - r0[0], q0[1] - r0[1]]
    poly(grey, [at(L0, zb), at(L1, zb), at(M1, zr), at(M0, zr)], [-across[0] * 0.1, -across[1] * 0.1, 1])
    poly(grey, [at(R0, zb), at(R1, zb), at(M1, zr), at(M0, zr)], [across[0] * 0.1, across[1] * 0.1, 1])
    const o: XY = [r0[0] - r1[0], r0[1] - r1[1]]
    poly(grey, [at(L0, zb), at(M0, zr), at(R0, zb)], [o[0], o[1], 0])
    poly(grey, [at(L1, zb), at(M1, zr), at(R1, zb)], [-o[0], -o[1], 0])
  }
}

// ===== Low flat wings =========================================================
/** The station's outline (way/137538320, simplified): windows go only on walls that face out of it. */
const OUTLINE: XY[] = [[-38, -112.9], [90, -86.1], [81.8, -48.2], [73, -50.2], [60.4, -2.7], [68.3, 1.8], [52.5, 46.1], [47, 61.1], [51.2, 62.9], [44, 80.9], [39.8, 92.8], [44, 95], [37.9, 112.1], [25.7, 111.1], [-8.5, 98.7], [-56.9, 82], [-96.6, 66.2], [-84.4, 20.8], [-69.6, 5.1], [-58.1, -30.6], [-48.5, -65]]
function inStation([x, y]: XY) {
  let inside = false
  OUTLINE.forEach(([x1, y1], i) => {
    const [x2, y2] = OUTLINE[(i + 1) % OUTLINE.length]
    if ((y1 > y) !== (y2 > y) && x < x1 + (x2 - x1) * (y - y1) / (y2 - y1)) inside = !inside
  })
  return inside
}
/** A flat-roofed stone block on an OSM ring with a window row on its longer walls. */
function wing(ring: XY[], h: number, rows: [number, number][]) {
  const r = ccw(ring)
  prism(stone, dark, r, 0, h)
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 7) return
    const f = wallOf(a, b, [(b[1] - a[1]), -(b[0] - a[0])])
    const out = f.P(L / 2, 0, 4)
    if (inStation([out[0], out[1]])) return
    for (const [z0, z1] of rows) f.row(win, 0.6, L - 0.6, Math.max(1, Math.round(L / 5.4)), 2.1, z0, z1)
  })
}
// West strip along the side bays.
wing([[-42.4, -91.5], [-35.1, -89.8], [-41.2, -63.3], [-48.8, -35.2], [-58, -7.3], [-62.9, 7.3], [-69.6, 5.1], [-62.6, -16.1], [-56.2, -37.2], [-48.5, -65]], 5.4, [[1.2, 3.8]])
// Between the side bays and the Wandelhalle, and the east annexes.
wing([[-75.2, 16.1], [-48.6, 26.4], [-43.8, 13.8], [-62.9, 7.3], [-72.5, 4.8]], 9, [[1.2, 3.8], [5.4, 7.6]])
wing([[47, 61.1], [21.9, 52], [27.1, 37.2], [52.5, 46.1]], 11.5, [[1.2, 4.4], [6.2, 9.8]])
wing([[58.5, 30.5], [50.8, 28], [60.4, -2.7], [68.3, 1.8], [62.5, 19.1]], 8, [[1.2, 3.8], [5.0, 7.0]])
wing([[90, -86.1], [81.5, -87.8], [76.8, -66.7], [73, -50.2], [81.8, -48.2], [86.1, -67.6]], 8, [[1.2, 3.8], [5.0, 7.0]])

// ===== The south-west pavilion ================================================
{
  const base: XY[] = [[-38, -112.9], [-30.6, -111.4], [-35.1, -89.8], [-42.4, -91.5]]
  wing(base, 12, [[1.2, 4.6], [6.6, 10.2]])
  const c: XY = [-36.5, -101.4]
  const ins = base.map(([x, y]): XY => [c[0] + (x - c[0]) * 0.45, c[1] + (y - c[1]) * 0.7])
  base.forEach((a, i) => {
    const j = (i + 1) % 4
    poly(dark, [at(a, 12.05), at(base[j], 12.05), at(ins[j], 16.8), at(ins[i], 16.8)], [a[0] + base[j][0] - 2 * c[0], a[1] + base[j][1] - 2 * c[1], 8])
  })
  poly(dark, ins.map((q) => at(q, 16.8)), [0, 0, 1])
  // Its stone gable over the west front.
  const f = wallOf(base[3], base[0], [-1, 0.2])
  const sc = f.L * 0.55, front: V3[] = [f.P(sc - 4, 12, 0.3), f.P(sc + 4, 12, 0.3), f.P(sc + 4, 13.6, 0.3), f.P(sc, 17.4, 0.3), f.P(sc - 4, 13.6, 0.3)]
  poly(stone, front, f.N)
  for (const [i, j] of [[2, 3], [3, 4]]) poly(dark, [front[i], front[j], [front[j][0] - f.N[0] * 4, front[j][1] - f.N[1] * 4, front[j][2]], [front[i][0] - f.N[0] * 4, front[i][1] - f.N[1] * 4, front[i][2]]], [0, 0, 1])
  f.panel(win, sc - 1.4, sc + 1.4, 12.6, 14.4, 0.36)
  turret(-35.9, -106.5, 2.6, 16.8, 18.6, 20.8, 23)
}

/** An eight-sided turret: stone to z1, a window stage to z2, a dome to z3 and a finial. */
function turret(x: number, y: number, r: number, z1: number, z2: number, z3: number, tip: number) {
  const ring = (rr: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [x + rr * Math.cos((i + 0.5) * Math.PI / 4), y + rr * Math.sin((i + 0.5) * Math.PI / 4), z])
  stone.loft([ring(r, 0), ring(r, z1)])
  dark.loft([ring(r, z1), ring(r * 1.18, z1 + 0.25), ring(r * 0.88, z1 + 0.7)])
  stone.loft([ring(r * 0.88, z1 + 0.7), ring(r * 0.88, z2)])
  for (let i = 0; i < 8; i += 2) {
    const a = ring(r * 0.88, 0)[i], b = ring(r * 0.88, 0)[(i + 1) % 8]
    const f = wallOf([a[0], a[1]], [b[0], b[1]], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y])
    f.panel(win, f.L * 0.22, f.L * 0.78, z1 + 1, z2 - 0.25)
  }
  dark.loft([ring(r * 0.88, z2), ring(r * 1.05, z2 + 0.2), ring(r * 0.82, z2 + (z3 - z2) * 0.65), ring(r * 0.25, z3)])
  dark.loft([ring(r * 0.25, z3), ring(0.08, tip)])
}

// ===== The Wandelhalle and the north buildings ================================
/** The north buildings' own frame: u east-northeast, n north-northwest, turned 20.2 degrees. */
const TH = 20.2 * Math.PI / 180, C = Math.cos(TH), S = Math.sin(TH)
const g = (u: number, n: number): XY => [u * C - n * S, u * S + n * C]
const dirU = (k: number): XY => [k * C, k * S]
const dirN = (k: number): XY => [-k * S, k * C]
const rect = (u0: number, u1: number, n0: number, n1: number): XY[] => [g(u0, n0), g(u1, n0), g(u1, n1), g(u0, n1)]

{
  const U = 68, N0 = 42, N1 = 72, EAVE = 12, RIDGE = 21.3, M = 12
  const nz = (k: number): [number, number] => [N0 + (N1 - N0) * k / M, EAVE + (RIDGE - EAVE) * Math.pow(Math.sin(Math.PI * k / M), 0.8)]
  for (let k = 0; k < M; k++) {
    const [n0, z0] = nz(k), [n1, z1] = nz(k + 1)
    poly(dark, [at(g(-U, n0), z0), at(g(U, n0), z0), at(g(U, n1), z1), at(g(-U, n1), z1)], [0, 0, 1])
  }
  for (const [n, k] of [[N0, -1], [N1, 1]]) {
    const f = wallOf(g(-U, n), g(U, n), dirN(k))
    poly(stone, [f.P(0, 0), f.P(f.L, 0), f.P(f.L, EAVE), f.P(0, EAVE)], f.N)
  }
  for (const k of [-1, 1]) {
    // An end: stone gable under the barrel, its pale rim and the great arched window.
    const f = wallOf(g(k * U, N0), g(k * U, N1), dirU(k))
    const pts: V3[] = [f.P(0, 0), f.P(f.L, 0)]
    for (let j = M; j >= 0; j--) pts.push(f.P(f.L * j / M, nz(j)[1]))
    poly(stone, pts, f.N)
    for (let j = 0; j < M; j++) {
      const s0 = f.L * j / M, s1 = f.L * (j + 1) / M
      poly(grey, [f.P(s0, nz(j)[1] - 0.8, 0.3), f.P(s1, nz(j + 1)[1] - 0.8, 0.3), f.P(s1, nz(j + 1)[1] + 0.25, 0.3), f.P(s0, nz(j)[1] + 0.25, 0.3)], f.N)
    }
    const sc = f.L / 2
    f.arch(trim, sc, 19.2, 6.2, 9.2, 0.08, 14, 10.8)
    f.arch(win, sc, 17.6, 6.6, 9.2, 0.14, 14, 10.0)
    for (const m of [-2, -1, 0, 1, 2]) f.panel(grey, sc + m * 3 - 0.15, sc + m * 3 + 0.15, 6.6, 9.2 + 10 * Math.sqrt(1 - (m * 3 / 8.8) ** 2) - 0.1, 0.2)
    f.panel(grey, sc - 8.8, sc + 8.8, 12, 12.35, 0.2)
    // The side portal below it.
    const porch = rect(...(k < 0 ? [-U - 3.2, -U] : [U, U + 3.2]) as [number, number], 48.5, 65.5)
    prism(stone, dark, porch, 0, 5.4)
    const p = wallOf(g(k * (U + 3.2), 48.5), g(k * (U + 3.2), 65.5), dirU(k))
    for (const s of [3.4, 8.5, 13.6]) p.arch(win, s, 3.4, 0.1, 2.9, 0.08, 8)
    for (const s of [2, f.L - 2]) f.arch(win, s, 2.2, 1.2, 4.2, 0.08, 6)
  }
}

for (const u of [-68, 68]) turret(...g(u, 43.2), 1.9, 15.8, 18, 20.3, 22)

// The central north block: three great arches, two gabled bays, corner turrets.
{
  const U0 = -23, U1 = 24, N0 = 72, N1 = 96.5
  prism(stone, dark, rect(U0, U1, N0, N1), 0, 15.2)
  // Mansard roof.
  const lo = rect(U0, U1, N0, N1), hi = rect(U0 + 2, U1 - 2, N0 + 3.5, N1 - 3.5)
  const outs = [dirN(-1), dirU(1), dirN(1), dirU(-1)]
  lo.forEach((a, i) => {
    const j = (i + 1) % 4
    poly(dark, [at(a, 15.25), at(lo[j], 15.25), at(hi[j], 18), at(hi[i], 18)], [outs[i][0], outs[i][1], 1])
  })
  poly(dark, hi.map((q) => at(q, 18)), [0, 0, 1])
  for (const u of [-14, 0.5, 15]) {
    const on = (du: number, t: number): V3 => at(g(u + du, N1 - 3.5 * t + 0.1), 15.25 + 2.75 * t + 0.05)
    poly(grey, [on(-3, 0.3), on(3, 0.3), on(3, 0.72), on(-3, 0.72)], [...dirN(1), 1])
  }
  const f = wallOf(g(U0, N1), g(U1, N1), dirN(1)), W = f.L
  for (const t of [1 / 6, 1 / 2, 5 / 6]) {
    const s = W * t
    f.arch(trim, s, 12.2, 3.9, 5.6, 0.05, 12)
    f.arch(win, s, 10.8, 4.2, 5.6, 0.12, 12)
    for (const m of [-2.7, 0, 2.7]) f.panel(grey, s + m - 0.12, s + m + 0.12, 4.2, 5.6 + Math.sqrt(5.4 ** 2 - m ** 2) - 0.05, 0.18)
    f.panel(grey, s - 5.4, s + 5.4, 6.4, 6.65, 0.18)
    // The dark canopy and the doors below.
    poly(dark, [f.P(s - 5.6, 3.9, 0.15), f.P(s + 5.6, 3.9, 0.15), f.P(s + 5.6, 3.2, 1.1), f.P(s - 5.6, 3.2, 1.1)], [f.N[0], f.N[1], 1])
    f.row(win, s - 5.2, s + 5.2, 4, 1.9, 0.1, 2.8)
    f.row(win, s - 5.6, s + 5.6, 4, 1.4, 12.8, 14.6)
  }
  // The ledge over the arches.
  poly(dark, [f.P(0, 12.4, 0.1), f.P(W, 12.4, 0.1), f.P(W, 12, 0.55), f.P(0, 12, 0.55)], [f.N[0], f.N[1], 1])
  for (const t of [1 / 3, 2 / 3]) {
    const s = W * t, w = 2.6
    const front: V3[] = [f.P(s - w, 12, 0.4), f.P(s + w, 12, 0.4), f.P(s + w, 16.8, 0.4), f.P(s, 19.2, 0.4), f.P(s - w, 16.8, 0.4)]
    poly(stone, front, f.N)
    const back = front.map((q): V3 => [q[0] - f.N[0] * 3.4, q[1] - f.N[1] * 3.4, q[2]])
    for (const [i, j] of [[1, 2], [2, 3], [3, 4], [4, 0]]) {
      const mid: V3 = [(front[i][0] + front[j][0]) / 2, (front[i][1] + front[j][1]) / 2, (front[i][2] + front[j][2]) / 2]
      const c = f.P(s, 14.5, 0.4)
      poly(i === 2 || i === 3 ? dark : stone, [front[i], front[j], back[j], back[i]], [mid[0] - c[0], mid[1] - c[1], mid[2] - c[2]])
    }
    f.panel(win, s - 1.7, s + 1.7, 12.7, 14.7, 0.46)
    f.panel(win, s - 0.8, s + 0.8, 15.7, 17, 0.46)
    f.panel(trim, s - w, s + w, 15, 15.4, 0.48)
  }
  for (const u of [U0, U1]) turret(...g(u, N1), 2.7, 14, 16, 18.3, 19.7)
}

// The lower wings either side, with their curved roofs and smaller arches.
for (const [u0, u1] of [[-62, -23], [24, 62]]) {
  const N0 = 72, N1 = 95.5, EAVE = 10
  prism(stone, dark, rect(u0, u1, N0, N1), 0, EAVE)
  const prof: [number, number][] = [[N0, 10.05], [N0 + 4, 11.9], [(N0 + N1) / 2, 12.5], [N1 - 4, 11.9], [N1, 10.05]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [n0, z0] = prof[k], [n1, z1] = prof[k + 1]
    poly(dark, [at(g(u0, n0), z0), at(g(u1, n0), z0), at(g(u1, n1), z1), at(g(u0, n1), z1)], [0, 0, 1])
  }
  for (const [u, k] of [[u0, -1], [u1, 1]]) poly(stone, prof.map(([n, z]) => at(g(u, n), z)), [...dirU(k), 0])
  const f = wallOf(g(u0, N1), g(u1, N1), dirN(1))
  for (const t of [0.18, 0.5, 0.82]) {
    const s = f.L * t
    f.arch(trim, s, 7.6, 3.3, 4.0, 0.05, 8)
    f.arch(win, s, 6.6, 3.5, 4.0, 0.12, 8)
    f.panel(grey, s - 0.12, s + 0.12, 3.5, 7.2, 0.18)
    poly(dark, [f.P(s - 3.5, 3.3, 0.15), f.P(s + 3.5, 3.3, 0.15), f.P(s + 3.5, 2.7, 0.9), f.P(s - 3.5, 2.7, 0.9)], [f.N[0], f.N[1], 1])
    f.row(win, s - 3, s + 3, 3, 1.5, 0.1, 2.4)
  }
  f.row(win, 1, f.L - 1, 11, 1.5, 8.1, 9.6)
}
wing(rect(-68, -62, 73, 95.5), 9, [[1.2, 3.8], [5.2, 7.6]])
wing(rect(62, 67.5, 80, 95.5), 8, [[1.2, 3.8], [5.0, 7.0]])

// ===== The clock towers =======================================================
function tower(x: number, y: number) {
  const ring = (h: number, z: number, c = 0.35): V3[] => {
    const pts: [number, number][] = [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
    return pts.map(([u, n]) => [x + u * C - n * S, y + u * S + n * C, z])
  }
  const square = (h: number, z: number) => ring(h, z).filter((_, i) => i % 2 === 0).map((_, i): V3 => {
    const [u, n] = [[-h, -h], [h, -h], [h, h], [-h, h]][i]
    return [x + u * C - n * S, y + u * S + n * C, z]
  })
  const stack = (p: Part, levels: [number, number][], round = false) => {
    const r = ([h, z]: [number, number]) => (round ? ring(h, z, h * 0.58) : square(h, z))
    p.loft(levels.map(r)); p.cap(r(levels.at(-1)!), true)
  }
  stone.loft([ring(3.5, 0), ring(3.4, 23.6)])
  stack(dark, [[3.4, 23.6], [4.1, 24.1], [4.1, 24.7]])
  stack(dark, [[3.4, 24.7], [3.3, 26.9], [3.75, 27.2], [3.15, 27.6]])
  stack(dark, [[3.1, 27.6], [3.05, 31.4]])
  stack(dark, [[3.05, 31.4], [3.8, 31.8], [3.55, 32.5], [2.4, 34.0], [2.0, 34.8]])
  stack(dark, [[1.75, 34.8], [1.7, 36.9], [2.0, 37.3], [1.2, 38.2]], true)
  stack(dark, [[0.95, 38.2], [0.9, 40.3], [1.25, 40.6], [1.0, 41.1], [0.3, 42.4]], true)
  stack(dark, [[0.14, 42.4], [0.42, 43.9], [0.07, 45]])
  for (let k = 0; k < 4; k++) {
    const a = TH + k * Math.PI / 2, nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
    const P = (s: number, z: number, d: number): V3 => [x + nx * d + tx * s, y + ny * d + ty * s, z]
    const N: V3 = [nx, ny, 0]
    const disc = (p: Part, r: number, d: number) => poly(p, Array.from({ length: 10 }, (_, i) => P(r * Math.cos(i * Math.PI / 5), 29.5 + r * Math.sin(i * Math.PI / 5), d)), N)
    disc(clock, 1.35, 3.14)
    // Hands.
    poly(dark, [P(-0.1, 29.5, 3.18), P(0.1, 29.5, 3.18), P(0.08, 30.6, 3.18), P(-0.08, 30.6, 3.18)], N)
    poly(dark, [P(0, 29.4, 3.19), P(0.75, 29.4, 3.19), P(0.75, 29.6, 3.19), P(0, 29.6, 3.19)], N)
    // Openings: the balcony stage, the lantern and a tall arched light in the shaft.
    for (const s of [-1.6, 0, 1.6]) poly(win, [P(s - 0.45, 25.1, 3.42), P(s + 0.45, 25.1, 3.42), P(s + 0.45, 26.5, 3.39), P(s - 0.45, 26.5, 3.39)], N)
    poly(win, [P(-0.35, 38.6, 0.97), P(0.35, 38.6, 0.97), P(0.35, 40, 0.95), P(-0.35, 40, 0.95)], N)
    const pts: V3[] = [P(-0.75, 14.5, 3.5), P(0.75, 14.5, 3.5)]
    for (let i = 0; i <= 6; i++) pts.push(P(0.75 * Math.cos(i * Math.PI / 6), 18.3 + 0.75 * Math.sin(i * Math.PI / 6), 3.5))
    poly(win, pts, N)
    poly(win, [P(-0.9, 20.4, 3.48), P(0.9, 20.4, 3.48), P(0.9, 22, 3.47), P(-0.9, 22, 3.47)], N)
  }
}
tower(-86.4, 46.6)
tower(38, 89.1)

// ===== The Keksdose and its canopy ============================================
{
  const ring: XY[] = [[82.2, -54.4], [85.3, -49.8], [97.8, -47], [102.4, -50], [105.1, -62.1], [102.1, -66.9], [89.6, -69.6], [84.8, -66.6]]
  const c: XY = [93.7, -58.3]
  prism(stone, dark, ring.map(([x, y]): XY => [c[0] + (x - c[0]) * 0.7, c[1] + (y - c[1]) * 0.7]), 0, 4)
  prism(trim, grey, ring, 4, 24)
  const r = ccw(ring)
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], f = wallOf(a, b, [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]])
    poly(trim, [f.P(0, 4), f.P(0, 4, -3), f.P(f.L, 4, -3), f.P(f.L, 4)], [0, 0, -1])
    const n = Math.max(1, Math.round(f.L / 4))
    for (const z of [5.4, 10.1, 14.8, 19.5]) f.row(win, 0.35, f.L - 0.35, n, (f.L - 0.7) / n - 0.5, z, z + 2.9)
  })
  prism(trim, grey, [[86.9, -55.9], [88.3, -53.6], [96.5, -51.7], [98.8, -53.1], [100.7, -61.2], [99.3, -63.4], [94, -64.6], [88.1, -60.9]], 24, 26.8)
  const canopy: XY[] = [[82.6, -48.5], [81.3, -43.1], [101, -42.9], [115.4, -48], [118.8, -64], [113.7, -65.1], [102.9, -81.9], [89.7, -84.9], [86.1, -67.6], [102.1, -66.9], [105.1, -62.1], [102.4, -50], [97.8, -47], [85.3, -49.8]]
  prism(grey, grey, canopy, 3.7, 4.3)
  for (const t of earcut(canopy)) poly(grey, t.map((q) => at(q, 3.7)), [0, 0, -1])
  for (const q of [[113, -50], [115, -62], [103, -79]] as XY[])
    prism(grey, grey, [[q[0] - 0.3, q[1] - 0.3], [q[0] + 0.3, q[1] - 0.3], [q[0] + 0.3, q[1] + 0.3], [q[0] - 0.3, q[1] + 0.3]], 0, 3.7)
}

/**
 * How far the street is lifted over y = 0. Along the walls the map's terrain
 * stands 2 to 8.4 m above the model's lowest point (median 4.6 m; 5.1 m on
 * the site's unfilled terrain), so every vertex above the ground goes up by
 * this much and the walls stretch down to y = 0.
 */
const LIFT = 5
for (const part of [stone, dark, grey, win, trim, clock])
  for (let k = 1; k < part.pos.length; k += 3) if (part.pos[k] > 1e-6) part.pos[k] += LIFT

const m = (s: { name: string; color: number; roughness?: number }): MaterialSpec => ({ ...s })

writeModel('Hamburg Hauptbahnhof', 'hamburg-hauptbahnhof', [
  { part: stone, material: m(finish('hbf-sandstone', 0xbda585)) },
  { part: dark, material: m(finish('hbf-roof', 0x56504e)) },
  { part: grey, material: m(PALETTE.roof) },
  { part: win, material: m(PALETTE.window) },
  { part: trim, material: m(PALETTE.trim) },
  { part: clock, material: m(finish('neon-clock', 0xf4f1e4)) },
], { bearing: 0, osm: 'way/137538320', height: 45 + LIFT }, 6500)
