/**
 * Berliner Fernsehturm (Berlin TV Tower), Alexanderplatz: procedural, CC0-1.0.
 * bun generators/berlin-fernsehturm.ts
 *
 * Also holds a few helpers the other Berlin models import (`lathe`, `face`,
 * `flat`, `fan`, `ribbedDome`), so this generator is merged first. Its own
 * build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * The origin is the tower's axis, the centre of the OSM outline way/556435241
 * (a 30 m circle), 13.409421 52.520820; y = 0 is the floor of the sunken
 * court the shaft's foot stands in, the lowest ground under the footprint.
 * Mapterhorn terrain (tools/terrain.ts grid) shows that court about 2.5 m
 * below the park and the street around it, so the pavilion is built from
 * G = 2.5 m and its walls run down to y = 0, into the ground.
 *
 * Published (German Wikipedia, "Berliner Fernsehturm", and the facts it cites):
 * - 368 m to the antenna tip (since the 1997 new antenna top, from 327 m).
 * - visible base: 32 m across at ground, a 20 m hyperbolically tapering
 *   frustum; then the shaft, 248.78 m to the Turmkorb, tapering from 16 to
 *   9 m; the shaft continues above the sphere to 250 m, where a 16 m
 *   reinforced-concrete plate carries the antenna.
 * - the sphere: 32 m across, its skin of over 1000 stainless-steel pyramids;
 *   observation deck at 203 m, revolving restaurant at 207 m; two rescue
 *   platforms projecting 1.6 m round the shaft at 188 and 191 m.
 * - the antenna carrier: 118 m long, 4 m across at the base, tapering to
 *   under 2 m; obstruction lights on it at 267, 303 and 329 m (its galleries).
 * - the pavilion ("Umbauung", 1969-72, Walter Herzog, Heinz Aust and
 *   Rolf Heider): hexagonal geometry, folded concrete roofs (Faltwerk).
 * The cross of light the sun draws on the sphere comes from the pyramids;
 * here every pyramid is four flat-shaded facets so the sphere glints in a
 * grid, not a smooth ball.
 *
 * OSM: outline way/556435241 (368 m); parts way/397891642 (shaft, to 205),
 * way/96880470 (foot, 10 m), way/326772329 (sphere, 205-235),
 * way/230818931 (Turmkorb, 235-256), way/96880477 and way/304987172-176
 * (antenna sections, white and red); the pavilion relation/4065109 and its
 * parts way/217537046-052, way/231808734, and the folded roof tips
 * way/26037204, -206, -210, -212, -215, -216, -218, way/1553929789,
 * -936311 to -936314.
 * Their plans are used as drawn (rounded to 0.1 m), about the new anchor.
 *
 * Heights, measured off photos (scaled from the sphere's published 32 m):
 * - "Fernsehturm (Berlin).jpg" (Gzen92, telephoto, near orthographic):
 *   sphere top hidden by the Turmkorb's foot ring at about 225-227 m, so the
 *   sphere's centre is put at 211 m (195-227 m); the window band from 203.5
 *   to 210.5 m with a rail between deck and restaurant rows; the Turmkorb
 *   15 m across, 20 m tall, under the 16 m plate; the antenna's red and
 *   white bands, read pixel by pixel down its axis (the band list below is
 *   those pixel rows turned into heights: 9.5 px per metre, 250 m at the
 *   plate, 368 m at the tip), its galleries at 257, 267, 302 and 327 m.
 * - "Berliner Fernsehturm (Detailansicht).jpg" (Thomas Wolf): the window
 *   rows, the rescue rings and the antenna's base drum.
 * - "Fernsehturm Berlin 01.jpg" (H. Zell, from below): the pyramids'
 *   pattern above and below the window band, the rings under the sphere.
 * Pavilion heights from OSM (wings 8 and 10 m; the tips: 8 m roof edge
 * rising to 12 m, and fans falling to the ground), over G.
 *
 * Estimated: the pyramids are drawn larger than real (32 round by 10 rows
 * above the windows, 7 below) so they read at map scale; the window
 * mullions every 11.25 degrees; the Turmkorb drawn as a dark drum with
 * floor rings and 16 posts (the real one is an open frame round the
 * equipment); the fold pitch (4.5 m) and depth (1 m) of the pavilion roofs,
 * from the architectural model photo and the 2002 photo of a fan; the fans'
 * five folds; the inner block way/231808734 is drawn flat at 8 m; the glass
 * walls run full height (the real ground floor is partly recessed behind
 * columns); the walkways way/217537050/051 at 6 m.
 * Left out: the portholes up the shaft, the window-cleaning gantry, the
 * antenna's dishes and ladders, the pavilion's stairs, terraces and railings.
 *
 * Night: the shaft and the underside of the sphere are floodlit white
 * (`_FLOODLIGHT`), the window band is `window` and glows; the antenna's red
 * obstruction lights are left out.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Berliner Fernsehturm June 2023 01.jpg", ArildV, CC BY-SA 4.0 (from the west, whole tower)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm_June_2023_01.jpg
 * - "Berliner Fernsehturm November 2013.jpg", Arild Vågen, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm_November_2013.jpg
 * - "Fernsehturm Berlin 01.jpg", H. Zell, CC BY-SA 3.0 (sphere from below)
 *   https://commons.wikimedia.org/wiki/File:Fernsehturm_Berlin_01.jpg
 * - "Fernsehturm (Berlin).jpg", Gzen92, CC BY-SA 4.0 (sphere, Turmkorb, antenna)
 *   https://commons.wikimedia.org/wiki/File:Fernsehturm_(Berlin).jpg
 * - "Berliner Fernsehturm (Detailansicht).jpg", Thomas Wolf (foto-tw.de), CC BY-SA 3.0 de
 *   https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm_(Detailansicht).jpg
 * - "Architekturmodell des Umbauung des Berliner Fernsehturms.jpg", G. Stapenbeck (VEB IHB Berlin), CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Architekturmodell_des_Umbauung_des_Berliner_Fernsehturms.jpg
 * - "2002-07-Umbauung-Fernsehturm-Faltwerk.jpg", Gunnar Klack, CC BY-SA 4.0 (a fan reaching the ground)
 *   https://commons.wikimedia.org/wiki/File:2002-07-Umbauung-Fernsehturm-Faltwerk.jpg
 * - "Pavillon Fernsehturm Berlin.jpg", Conbrio, CC BY-SA 3.0 (a rising roof tip)
 *   https://commons.wikimedia.org/wiki/File:Pavillon_Fernsehturm_Berlin.jpg
 * - "Am Fernsehturm - panoramio.jpg", Uli Herrmann, CC BY-SA 3.0 (from the pavilion terrace)
 *   https://commons.wikimedia.org/wiki/File:Am_Fernsehturm_-_panoramio.jpg
 * - "Berliner Fernsehturm at night 1.JPG", Pudelek (Marcin Szala), CC BY-SA 3.0 (night)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm_at_night_1.JPG
 * - "Fernsehturm-Berlin-2015.jpg", Tuxyso, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Fernsehturm-Berlin-2015.jpg
 * Look-only: none.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, type XY } from './atl-flatiron-building'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ──────────────────────────────── shared kit ────────────────────────────────

/** A quad whose winding is chosen so it faces along its normals. */
export function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A flat quad facing `n`. */
export const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])
/** A flat triangle facing `n`. */
export function flatTri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (dot(f, n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** Both sides of a thin plate triangle. */
export function plate(p: Part, a: V3, b: V3, c: V3) {
  p.tri(a, b, c)
  p.tri(a, c, b)
}

/**
 * A surface of revolution about the vertical axis through `c`, from a profile
 * of [r, z] points whose left-hand side is the outside (walls go up, roofs
 * go inward). Bands meeting at under `smooth` degrees shade smooth. `pick`
 * chooses each band's part (or null to skip it). `phase` turns the segments.
 */
export function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40, c: XY = [0, 0], phase = 0) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = phase + (s / k) * TAU, a1 = phase + ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) p3(part, q[0], q[2], q[3], nn[0], nn[2], nn[3])
      else if (r1 === 0) p3(part, q[0], q[1], q[2], nn[0], nn[1], nn[2])
      else face(part, q, nn)
    }
  }
}
const p3 = (p: Part, a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3) => p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])

/**
 * A folded plate fanning out from an apex to a base edge a-b: the base is cut
 * into `n` pieces and every other point lifted by `depth` (along `up`), so
 * the folds radiate from the apex, as the Fernsehturm pavilion's roof tips
 * and fans do. Drawn on both sides.
 */
export function fan(p: Part, apex: V3, a: V3, b: V3, n: number, depth: number, up: V3 = [0, 0, 1]) {
  const pts: V3[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const q: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
    pts.push(i % 2 ? add(q, mul(up, depth)) : q)
  }
  for (let i = 0; i < n; i++) plate(p, apex, pts[i], pts[i + 1])
}

/**
 * A ribbed dome: a lathe of `profile` with `ribs` raised ribs on it, each a
 * strip `w` wide standing `h` proud of the surface, from profile point
 * `from` to `to`. Ribs go in `ribPart`.
 */
export function ribbedDome(shell: Part, ribPart: Part, profile: [number, number][], k: number, ribs: number, w: number, h: number, c: XY = [0, 0], from = 0, to = profile.length - 1, phase = 0) {
  lathe(profile, () => shell, k, 50, c, phase)
  for (let i = 0; i < ribs; i++) {
    const a = phase + (i / ribs) * TAU
    const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    for (let j = from; j < to; j++) {
      const [r0, z0] = profile[j], [r1, z1] = profile[j + 1]
      // Outward normal of the profile segment, in the rib's plane.
      const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
      const nr = ez / l, nz = -er / l
      const hw0 = Math.min(w / 2, Math.max(0.05, r0 * 0.7 * Math.PI / ribs)), hw1 = Math.min(w / 2, Math.max(0.05, r1 * 0.7 * Math.PI / ribs))
      const at = (r: number, z: number, s: number, o: number): V3 => [c[0] + d[0] * (r + nr * o) + e[0] * s, c[1] + d[1] * (r + nr * o) + e[1] * s, z + nz * o]
      const n: V3 = unit([d[0] * nr, d[1] * nr, nz])
      // Top face and two sides.
      flat(ribPart, [at(r0, z0, -hw0, h), at(r0, z0, hw0, h), at(r1, z1, hw1, h), at(r1, z1, -hw1, h)], n)
      flat(ribPart, [at(r0, z0, hw0, 0), at(r1, z1, hw1, 0), at(r1, z1, hw1, h), at(r0, z0, hw0, h)], e)
      flat(ribPart, [at(r0, z0, -hw0, 0), at(r0, z0, -hw0, h), at(r1, z1, -hw1, h), at(r1, z1, -hw1, 0)], mul(e, -1))
    }
  }
}

// ──────────────────────────────── the tower ────────────────────────────────

if (import.meta.main) {
  await build(true)
  await build(false)
}

/** The low model (map budget) or, with low = false, the detail model. */
async function build(low: boolean) {
  const { save } = await import('./atl-flatiron-building')
  const { writeGlb } = await import('./mesh')

  const concrete = new Part() // shaft, foot, plate: grey-beige exposed concrete
  const steel = new Part()    // the sphere's stainless pyramids, galleries' undersides
  const win = new Part()      // the sphere's window band, the pavilion's glazing
  const red = new Part()      // the antenna's red bands
  const white = new Part()    // antenna's white bands, galleries, the pavilion's white concrete roofs
  const dark = new Part()     // the Turmkorb's frame and equipment, flat pavilion roofs

  // ── Shaft: the foot's hyperbolic frustum, then a straight taper 16 → 9 m ──
  const K = low ? 20 : 40
  const shaftR = (z: number) => (z <= 20 ? 8 + 8 * ((20 - z) / 20) ** 2 : 8 - (3.5 * (z - 20)) / 230)
  const footZ = low ? [0, 3, 7, 12, 20] : [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  const shaft: [number, number][] = [...footZ.map((z) => [shaftR(z), z] as [number, number]), [shaftR(100), 100], [shaftR(188), 188]]
  lathe(shaft, () => concrete, K, 30)
  // The two rescue platforms at 188 and 191 m, 1.6 m out.
  for (const z of [188, 191]) {
    const r = shaftR(z)
    lathe([[r, z - 0.35], [r + 1.6, z - 0.35], [r + 1.6, z + 0.35], [r, z + 0.35]], (b) => (b === 1 ? white : concrete), K, 10)
  }
  lathe([[shaftR(188), 188], [shaftR(198), 198]], () => concrete, K, 30)

  // ── The sphere: centre 211 m, radius 16 ──
  const ZC = 211, R = 16, NA = low ? 20 : 40
  const sp = (lat: number, lon: number, r = R): V3 => [r * Math.cos(lat) * Math.cos(lon), r * Math.cos(lat) * Math.sin(lon), ZC + r * Math.sin(lat)]
  const deg = Math.PI / 180
  /** A row of pyramids between two latitudes: each panel is four flat facets meeting at a raised centre. */
  function pyramids(lat0: number, lat1: number, rows: number, h: number, off = 0) {
    for (let r = 0; r < rows; r++) {
      const la = lat0 + ((lat1 - lat0) * r) / rows, lb = lat0 + ((lat1 - lat0) * (r + 1)) / rows
      for (let s = 0; s < NA; s++) {
        const o0 = ((s + off) / NA) * TAU, o1 = ((s + 1 + off) / NA) * TAU
        const q = [sp(la, o0), sp(la, o1), sp(lb, o1), sp(lb, o0)]
        const cm = sp((la + lb) / 2, (o0 + o1) / 2, R + h)
        for (let i = 0; i < 4; i++) {
          const a = q[i], b = q[(i + 1) % 4]
          flatTri(steel, a, b, cm, unit([cm[0], cm[1], cm[2] - ZC]))
        }
      }
    }
  }
  const latWinTop = Math.asin(-0.5 / R), latWinBot = Math.asin(-7.5 / R), latRail = Math.asin(-4 / R)
  const latTop = Math.acos(7.1 / R), latBot = -Math.acos(5.5 / R)
  pyramids(0, latTop, low ? 8 : 13, low ? 0.95 : 0.7)
  pyramids(latWinBot, latBot, low ? 5 : 8, low ? 0.95 : 0.7, 0.5)
  // Steel rims above, between and below the window rows, a little proud.
  const rim = (la: number, lb: number, out: number) => {
    for (let s = 0; s < NA; s++) {
      const o0 = (s / NA) * TAU, o1 = ((s + 1) / NA) * TAU
      const N = (la: number, lo: number): V3 => unit([Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)])
      face(steel, [sp(la, o0, R + out), sp(la, o1, R + out), sp(lb, o1, R + out), sp(lb, o0, R + out)], [N(la, o0), N(la, o1), N(lb, o1), N(lb, o0)])
    }
  }
  rim(latWinTop, 0, 0.2)
  rim(latRail - 0.6 * deg, latRail + 0.6 * deg, 0.25)
  rim(latWinBot - 0.9 * deg, latWinBot, 0.2)
  // The window rows: steel posts with the glass between, two panes per segment.
  for (const [la, lb] of [[latWinBot, latRail - 0.6 * deg], [latRail + 0.6 * deg, latWinTop]]) {
    const NW = low ? NA : NA * 2
    for (let s = 0; s < NW; s++) {
      const o0 = (s / NW) * TAU, o1 = ((s + 1) / NW) * TAU, g = (o1 - o0) * 0.12
      const N = (lo: number): V3 => [Math.cos(lo), Math.sin(lo), 0]
      flat(steel, [sp(la, o0, R - 0.25), sp(la, o0 + g, R - 0.25), sp(lb, o0 + g, R - 0.25), sp(lb, o0, R - 0.25)], N(o0))
      flat(steel, [sp(la, o1 - g, R - 0.25), sp(la, o1, R - 0.25), sp(lb, o1, R - 0.25), sp(lb, o1 - g, R - 0.25)], N(o1))
      face(win, [sp(la, o0 + g, R - 0.4), sp(la, o1 - g, R - 0.4), sp(lb, o1 - g, R - 0.4), sp(lb, o0 + g, R - 0.4)], [N(o0 + g), N(o1 - g), N(o1 - g), N(o0 + g)])
      // The posts' sides, so the panes read as set in.
      flat(steel, [sp(la, o0 + g, R - 0.4), sp(lb, o0 + g, R - 0.4), sp(lb, o0 + g, R - 0.25), sp(la, o0 + g, R - 0.25)], [-Math.sin(o0 + g), Math.cos(o0 + g), 0])
    }
  }
  // Collars where the sphere meets the shaft below and the Turmkorb above.
  const zBot = ZC + R * Math.sin(latBot), zTop = ZC + R * Math.sin(latTop)
  lathe([[shaftR(198), 196.5], [5.9, 196.5], [5.9, zBot + 0.4], [0, zBot + 0.4]], (b) => (b === 2 ? null : white), K, 20)

  // ── The Turmkorb: a dark drum in a frame of floor rings and posts, under the plate ──
  const TK0 = zTop - 0.3, TK1 = 247.6
  lathe([[7.6, TK0], [7.6, TK0 + 1.4], [6.4, TK0 + 1.4]], () => white, K, 20)
  lathe([[6.4, TK0 + 1.4], [6.4, TK1]], () => dark, K, 20)
  const rings = low ? [TK0 + 5.5, TK0 + 9.8, TK0 + 14.1] : [TK0 + 4.7, TK0 + 8.0, TK0 + 11.3, TK0 + 14.6, TK0 + 17.9]
  for (const z of rings) lathe(low ? [[7.4, z - 0.35], [7.4, z + 0.35], [6.4, z + 0.35]] : [[6.4, z - 0.35], [7.4, z - 0.35], [7.4, z + 0.35], [6.4, z + 0.35]], (b) => (b === (low ? 0 : 1) ? white : steel), K, 10)
  const NP = low ? 12 : 16
  for (let i = 0; i < NP; i++) {
    const a = ((i + 0.5) / NP) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const P = (u: number, v: number, z: number): V3 => [d[0] * u + e[0] * v, d[1] * u + e[1] * v, z]
    const z0 = TK0 + 1.4, z1 = TK1, w = 0.22
    flat(steel, [P(7.3, -w, z0), P(7.3, w, z0), P(7.3, w, z1), P(7.3, -w, z1)], d)
    flat(steel, [P(6.4, w, z0), P(6.4, w, z1), P(7.3, w, z1), P(7.3, w, z0)], e)
    flat(steel, [P(6.4, -w, z0), P(7.3, -w, z0), P(7.3, -w, z1), P(6.4, -w, z1)], mul(e, -1))
  }
  // The 16 m plate, with a bevelled rim.
  lathe([[6.4, TK1], [7.7, TK1], [8.0, TK1 + 0.4], [8.0, 249.4], [7.7, 250], [2.9, 250]], (b) => (b === 0 ? steel : concrete), K, 30)

  // ── The antenna carrier: 250 → 368 m, red and white ──
  // Band edges read down the antenna's axis in "Fernsehturm (Berlin).jpg":
  // [photo row, colour below it]; h = 250 + (1190 - row) * 118 / 1120.
  const BANDS: [number, 'R' | 'W'][] = [[70, 'R'], [126, 'W'], [176, 'R'], [224, 'W'], [273, 'R'], [320, 'W'], [370, 'R'], [418, 'W'], [477, 'R'], [537, 'W'], [593, 'R'], [652, 'W'], [709, 'R'], [756, 'W'], [812, 'R'], [867, 'W'], [930, 'R'], [984, 'W'], [1034, 'R'], [1105, 'W'], [1163, 'R'], [1190, 'R']]
  const hOf = (row: number) => 250 + ((1190 - row) * 118) / 1120
  // Radius: the base drum 2.7 m, the carrier 2.0 → 1.6 m to the 1997 top at
  // 327 m, which is 1.0 → 0.8 m.
  const antR = (z: number) => (z < 256.8 ? 2.7 - (z - 250) * 0.06 : z < 326.6 ? 2.0 - ((z - 256.8) * 0.4) / 69.8 : 1.0 - ((z - 326.6) * 0.2) / 41.4)
  const AK = low ? 10 : 20
  for (let i = BANDS.length - 1; i > 0; i--) {
    const z0 = hOf(BANDS[i][0]), z1 = hOf(BANDS[i - 1][0]), col = BANDS[i - 1][1]
    const zs = [z0, ...[256.8, 326.6].filter((z) => z > z0 && z < z1), z1]
    const prof: [number, number][] = []
    for (const z of zs) {
      if (z === 256.8 || z === 326.6) prof.push([antR(z - 0.01), z], [antR(z + 0.01), z])
      else prof.push([antR(z), z])
    }
    lathe(prof, () => (col === 'R' ? red : white), AK, 30)
  }
  lathe([[antR(368), 368], [0, 368]], () => red, AK)
  // Galleries: rings of grating round the carrier.
  for (const [z, r] of [[256.8, 3.6], [266.9, 3.0], [302.0, 2.7], [326.6, 2.3]] as [number, number][]) {
    lathe([[antR(z), z - 0.3], [r, z - 0.3], [r, z + 0.5], [antR(z), z + 0.5]], (b) => (b === 0 ? steel : white), AK, 10)
  }

  if (process.env.DEBUG) console.log("trim before pavilion", white.triangles)
  // ── The pavilion ("Umbauung"), from OSM about the anchor, on ground G ──
  const G = 2.5
  /** Fold height along a wing: a triangle wave of `pitch` across `dir`. */
  type Wing = { ring: XY[]; h: number; dir?: XY; pitch?: number; depth?: number; roof?: Part }
  function wing({ ring, h, dir, pitch = low ? 6 : 4.5, depth = 1.6, roof = white }: Wing) {
    ring = ccw(ring)
    const zTop = G + h
    const sOf = (p: XY) => (dir ? p[0] * dir[0] + p[1] * dir[1] : 0)
    const zOf = (p: XY) => {
      if (!dir) return zTop
      const t = sOf(p) / pitch, f = t - Math.floor(t)
      return zTop + depth * (1 - Math.abs(2 * f - 1))
    }
    // Break points along the fold direction: every half pitch.
    const cuts = (s0: number, s1: number) => {
      if (!dir) return []
      const out: number[] = [], st = pitch / 2
      for (let k = Math.ceil(Math.min(s0, s1) / st); k * st < Math.max(s0, s1); k++) out.push(k * st)
      return out
    }
    // Walls: glass from the ground to 1.3 m under the eave, a white fascia
    // above following the folds.
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const sa = sOf(a), sb = sOf(b)
      const ts = [0, ...cuts(sa, sb).map((s) => (s - sa) / (sb - sa)).filter((t) => t > 1e-4 && t < 1 - 1e-4).sort((x, y) => x - y), 1]
      const P = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const zf = zTop - 1.3
      win.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zf], [a[0], a[1], zf])
      for (let k = 0; k < ts.length - 1; k++) {
        const p = P(ts[k]), q = P(ts[k + 1])
        white.quad([p[0], p[1], zf], [q[0], q[1], zf], [q[0], q[1], zOf(q)], [p[0], p[1], zOf(p)])
      }
    }
    // Roof: triangulate the plan, then cut each triangle along the folds.
    const tmp = new Part()
    capPoly(tmp, ring, 0, true)
    for (let i = 0; i < tmp.pos.length; i += 9) {
      // Parts are stored in glTF order (x, z, -y); back to plan.
      let tri: XY[] = [0, 3, 6].map((o) => [tmp.pos[i + o], -tmp.pos[i + o + 2]] as XY)
      const ss = tri.map(sOf)
      const cs = cuts(Math.min(...ss), Math.max(...ss))
      const bounds = [-Infinity, ...cs, Infinity]
      for (let k = 0; k < bounds.length - 1; k++) {
        let poly = tri
        poly = clip(poly, (p) => sOf(p) - bounds[k])
        poly = clip(poly, (p) => bounds[k + 1] - sOf(p))
        if (poly.length < 3) continue
        for (let j = 1; j < poly.length - 1; j++) {
          const A: V3 = [poly[0][0], poly[0][1], zOf(poly[0])], B: V3 = [poly[j][0], poly[j][1], zOf(poly[j])], C: V3 = [poly[j + 1][0], poly[j + 1][1], zOf(poly[j + 1])]
          flatTri(roof, A, B, C, [0, 0, 1])
        }
      }
    }
  }
  /** Keep the part of a convex polygon where f >= 0. */
  function clip(poly: XY[], f: (p: XY) => number): XY[] {
    const out: XY[] = []
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
      if (fa >= 0) out.push(a)
      if ((fa >= 0) !== (fb >= 0)) {
        const t = fa / (fa - fb)
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      }
    }
    return out
  }
  const axis = (a: XY, b: XY): XY => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  // West wing (way/217537047's west arm), folds across its length.
  wing({ ring: [[-66.0, -16.3], [-70.6, 15.9], [-73.2, 35.0], [-60.2, 45.2], [-44.3, 39.0], [-42.8, 22.9], [-41.8, 15.3], [-43.0, -23.4], [-44.8, -24.8]], h: 8, dir: axis([-66.0, -16.3], [-73.2, 35.0]) })
  // South wing (its south arm).
  wing({ ring: [[-32.4, -57.5], [-35.1, -37.0], [-33.0, -35.4], [-27.4, -30.9], [3.9, -43.7], [7.7, -45.2], [10.4, -46.3], [27.5, -53.1], [29.6, -68.9], [14.8, -80.8], [6.6, -77.3], [-1.6, -73.8], [-2.3, -69.4], [-14.1, -64.8]], h: 8, dir: axis([-32.4, -57.5], [27.5, -53.1]) })
  // The block between them (way/231808734), flat.
  wing({ ring: [[3.9, -43.7], [-27.4, -30.9], [-33.0, -35.4], [-41.8, -32.3], [-43.0, -23.4], [-41.8, 15.3], [-35.3, 12.3], [-29.1, 9.3], [-25.3, -19.5], [2.2, -30.1], [3.1, -36.4]], h: 8, roof: concrete })
  // North-east wing: the 10 m hall (way/217537046) and its two 8 m arms.
  wing({ ring: [[18.4, 44.1], [21.2, 27.6], [22.1, 21.9], [22.5, 18.7], [25.9, 17.3], [31.8, 14.7], [47.1, 7.7], [43.7, 30.9], [43.9, 34.0], [40.8, 34.7]], h: 10, dir: axis([18.4, 44.1], [40.8, 34.7]) })
  wing({ ring: [[-1.2, 38.3], [13.4, 49.7], [21.5, 46.4], [37.5, 38.7], [40.8, 34.7], [27.5, 24.6], [21.2, 27.6], [4.6, 35.4]], h: 8, dir: axis([-1.2, 38.3], [37.5, 38.7]) })
  wing({ ring: [[30.5, 20.8], [31.8, 14.7], [35.9, -4.9], [37.0, -10.3], [51.7, 0.9], [50.1, 10.0], [47.0, 27.7], [43.7, 30.9]], h: 8, dir: axis([37.0, -10.3], [47.0, 27.7]) })
  // Walkways round the court (way/217537050, way/217537051), flat.
  wing({ ring: [[35.9, -4.9], [37.0, -10.3], [3.1, -36.4], [2.2, -30.1]], h: 6, roof: concrete })
  wing({ ring: [[-35.3, 12.3], [-1.2, 38.3], [4.6, 35.4], [-7.2, 26.2], [-29.1, 9.3]], h: 6, roof: concrete })
  // The glass bridge from the north-east hall to the tower's foot, 7-10 m (way/217537052).
  {
    const ring = ccw([[8.8, 12.2], [5.4, 9.0], [9.0, 5.6], [13.0, 7.8], [25.9, 17.3], [22.5, 18.7], [22.1, 21.9], [14.1, 15.8]])
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      win.quad([a[0], a[1], G + 7], [b[0], b[1], G + 7], [b[0], b[1], G + 9.4], [a[0], a[1], G + 9.4])
      white.quad([a[0], a[1], G + 9.4], [b[0], b[1], G + 9.4], [b[0], b[1], G + 10], [a[0], a[1], G + 10])
    }
    capPoly(white, ring, G + 10, true)
    capPoly(white, ring, G + 7, false)
  }
  if (process.env.DEBUG) console.log("trim before fans", white.triangles)
  // The roof tips: folded fans off the wings' ends. Fans falling to the
  // ground (OSM skillions from 0 or 2 m up to the eave) and four rising
  // sails (8 → 12 m) with a lower fan under each (0 → 4 m).
  const T = (p: XY, z: number): V3 => [p[0], p[1], G + z]
  fan(white, T([66.9, 22.4], 2), T([43.7, 30.9], 10), T([47.1, 7.7], 10), 5, 1.0)
  fan(white, T([37.3, 58.2], 2), T([18.4, 44.1], 10), T([40.8, 34.7], 10), 5, 1.0)
  fan(white, T([-64.4, -39.7], 0), T([-44.8, -24.8], 8), T([-67.7, -15.6], 8), 5, 1.0)
  fan(white, T([-54.3, -52.0], 0), T([-35.1, -37.0], 8), T([-32.0, -60.6], 8), 5, 1.0)
  for (const [apex, a, b] of [[[-46.4, 56.3], [-60.2, 45.2], [-44.3, 39.0]], [[41.6, -58.8], [27.5, -53.1], [29.6, -68.9]], [[-88.6, 23.3], [-70.6, 15.9], [-73.2, 35.0]], [[0.7, -91.1], [14.8, -80.8], [-1.6, -73.8]]] as [XY, XY, XY][]) {
    fan(white, T(apex, 12), T(a, 8), T(b, 8), 5, 1.0)
    fan(white, T(apex, 0), T(a, 4), T(b, 4), 5, 0.8)
  }

  // ── Output ──
  // Colours from the daylight photos, pulled to the palette's lightness:
  // the shaft's warm beige-sand concrete (as in the west photo's light),
  // the sphere's bright stainless steel (light silver, lower roughness so
  // the facets glint), the antenna's signal red-orange.
  const shaftLit = (p: V3, n: V3) => (p[2] > 252 ? 0 : n[2] > 0.8 ? 0.3 : p[2] < 20 ? 0.6 : 0.9)
  const sphereLit = (p: V3, n: V3) => (p[2] > 229 ? 0 : p[2] < ZC - 7 ? 1 : n[2] > 0.6 ? 0.2 : 0.45)
  const parts = [
    { part: concrete, material: { ...finish('tv-concrete', 0xd6c9ad), floodlight: shaftLit } },
    { part: steel, material: { ...finish('tv-sphere-steel', 0xd3d7db, 0.3), floodlight: sphereLit } },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('tv-antenna-red', 0xd2603f) },
    { part: white, material: PALETTE.trim },
    { part: dark, material: finish('tv-turmkorb', 0x7b8188) },
  ]
  const extras = { bearing: 0, elevation: 0, height: 368 }
  if (process.env.DEBUG) console.log(parts.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  if (low) return save('berlin-fernsehturm', 'Berliner Fernsehturm', parts, extras, 6500)
  const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Berliner Fernsehturm', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
  if (tris > 40000 || glb.length > 1_500_000) throw new Error(`detail over budget: ${tris} triangles, ${glb.length} bytes`)
  const out = new URL('../models/berlin-fernsehturm.detail.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(parts.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
