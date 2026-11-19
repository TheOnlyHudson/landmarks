/**
 * Kaseya Center (Miami Heat arena, 1999, Arquitectonica with 360 Architecture),
 * 601 Biscayne Boulevard, Miami — procedural, CC0-1.0.
 * bun generators/mia-kaseya-center.ts
 *
 * What makes it the Kaseya Center: a lemon-shaped white drum on the bay,
 * wrapped by two curved white aluminium shells set as a pinwheel — the
 * north shell rises to a tall prow at its west end, the south shell to a
 * tall prow at its east end — with a gently domed pale roof between them
 * and its thin white eave; the two pointed ends are glass curtain walls (a
 * grid of big square lights), the west one on Biscayne Boulevard carrying
 * the huge LED board; scattered bold dark horizontal slits on the shells;
 * on the bay side, lower wings: a beige concrete wedge with a skillion roof
 * (north-east), a white box and a glass rotunda (south-east), and a flat
 * white canopy over the bayside glass entry; the plain domed roof.
 *
 * Frame: bearing 0, built north-up (x east, y north). The anchor is the area
 * centroid of OSM way/25312625 (the arena, height 48.8), -80.1879471
 * 25.7813599. Plans are OSM's, in local metres from that centroid.
 *
 * Ground: y = 0 is the street (lidar ground 2.2 m above the 2019 cloud's
 * ground_min, Biscayne Boulevard and the south drive). The arena stands on a
 * raised plaza (about 6-8 m, the grand stairs on the west), which is paving
 * and is not modelled; the walls run down to the street. Elevation 0. The
 * map's terrain is flat here (2-4.5 m, Mapterhorn), no dig.
 *
 * Heights (lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019, flown 2019,
 * measured above the street, 90th percentile of 6 m boxes — the cloud has
 * 300-400 m bird/noise returns, ignored):
 * - roof eave at the pointed ends 37.8; dome crown 43.6 (measured);
 * - north shell: 46.4 for its west 20° (the prow; 45.2 measured at 142°),
 *   falling about linearly to the eave at θ = 70° (measured along its top: 41.3 at 105°, 43.9 at 128°);
 * - south shell: 46.4 from θ = -5° to -55° (its east prow; 45.6 at -59°), falling to the
 *   eave at -125° (measured 43 at -79°, 40 at -100°);
 * - north-east wedge (way/128452685) skillion 14.5 at its west end rising to
 *   about 21 east (measured 14.8, 17.3, 19.3, 20.4 eastward);
 * - bayside canopy (way/741593660) top 20.8 (measured 20-21);
 * - south-east wing (way/128452681) 15.5 (measured 15-16); OSM says 17.
 * Plan of the shells' ends (θ is the bearing angle from the centroid,
 * counter-clockwise from east): the west glass runs from θ 160° to -145°
 * (photo-scaled from Pessar 2024, which was taken from the south-west:
 * glass and south shell appear about equal), the east glass from -5° to 55°
 * (photo-scaled from the 2009 view from the north); estimated ±5°.
 * Slits: placed from the photos (north shell from the north and south-west
 * views); sizes made bolder than real so they read at phone size. The
 * south shell's prow carries the two-storey window seen from the south-east.
 * LED board: θ -178° to -157°, 12.5-29.5 m, photo-scaled (Pessar 2024).
 * Roof: left plain. NAIP (2021-22) shows the old FTX logo painted on it;
 * its present content (since the 2023 rename) is unknown, so no logo.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Kaseya Center Downtown Miami FL, 5 April 2024.jpg", Phillip Pessar,
 *   CC BY 2.0 — the west glass, LED board, both shells' west ends, from the
 *   south-west;
 * - "AmericanAirlines Arena, Miami, Southeast view 20160709 1.jpg", DXR,
 *   CC BY-SA 4.0 — the south shell's east prow, the bayside wings, canopy,
 *   rotunda and beige wedge, from the south-east;
 * - "American Airlines Arena backside.jpg", Marc Averette (no machine-
 *   readable author; Averette per Commons), CC BY 3.0 — the north shell and
 *   its slits, the east glass and beige wedge, from the north across the slip;
 * - "American Airline Arena.JPG", Manuel Tennert, CC BY-SA 3.0 — the west
 *   glass from the west;
 * - "American Airlines Arena-MIAMI - panoramio.jpg", Ivan Curra, CC BY-SA
 *   3.0 — the north shell's west prow and slits from the north-west;
 * - "Heat Arena night.JPG", Daniel Christensen, CC BY 3.0 — night: lit
 *   glass ends and the lit window band at the shell foot;
 * - "American Airlines Arena, Miami, Florida.jpg", Pacman561 (public
 *   domain) — from above, the roof and wings;
 * - Plan: USGS NAIP orthophoto (public domain), OSM (ODbL).
 *
 * Left out: the raised plaza and grand stairs (paving), lettering and
 * banners, the AA sculpture, the canopy's round skylights, mullion detail
 * finer than one grid line per two storeys.
 *
 * Doubts: the shell end angles are photo-scaled; the south shell's slits
 * (only its prow is photographed closely); the glass enclosure under the
 * bayside canopy is drawn as one setback glass box. The prows are at the
 * lidar's 46.4 m, which caps how far they stand above the roof.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const D = Math.PI / 180

const white = new Part(), roof = new Part(), win = new Part(), dark = new Part(), beige = new Part(), screen = new Part()

// ---------------------------------------------------------------- helpers
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar convex polygon, wound to face `hint`. */
function face(p: Part, P: V3[], hint: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    if (flip) p.tri(a, c, b)
    else p.tri(a, b, c)
  }
}
const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** Ear clipping of a simple polygon; returns index triples, CCW. */
function earcut(q0: XY[]): [XY, XY, XY][] {
  const q = area(q0) < 0 ? [...q0].reverse() : [...q0]
  const out: [XY, XY, XY][] = []
  const idx = q.map((_, i) => i)
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = q[idx[(k + idx.length - 1) % idx.length]], b = q[idx[k]], c = q[idx[(k + 1) % idx.length]]
      if (cr(a, b, c) <= 1e-9) continue
      let inside = false
      for (const j of idx) {
        const p = q[j]
        if (p === a || p === b || p === c) continue
        if (cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0) { inside = true; break }
      }
      if (inside) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([q[idx[0]], q[idx[1]], q[idx[2]]])
  return out
}
/** A prism over a simple polygon, its top at z1 or at top(x, y). */
function prism(p: Part, q: XY[], z0: number, z1: number, top?: (x: number, y: number) => number, bottom = false) {
  const ring = area(q) < 0 ? [...q].reverse() : q
  const zt = top ?? (() => z1)
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(...b)], [a[0], a[1], zt(...a)]], out)
  }
  for (const [a, b, c] of earcut(ring)) {
    face(p, [[a[0], a[1], zt(...a)], [b[0], b[1], zt(...b)], [c[0], c[1], zt(...c)]], [0, 0, 1])
    if (bottom) face(p, [[a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0]], [0, 0, -1])
  }
}
const circle = (cx: number, cy: number, r: number, n = 16): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)] as XY)

// ---------------------------------------------------------------- the drum's plan
// OSM way/25312625, CCW, local metres from its centroid.
const OUT: XY[] = [[46.7, 52.4], [38.9, 57.0], [30.0, 60.6], [21.8, 63.1], [13.7, 64.7], [3.2, 65.8], [-3.9, 65.6], [-10.5, 65.1], [-17.1, 64.1], [-24.2, 62.4], [-30.4, 60.2], [-37.4, 57.3], [-44.3, 53.5], [-51.0, 49.1], [-56.4, 44.7], [-62.3, 38.9], [-68.1, 30.5], [-72.9, 20.2], [-77.1, 10.4], [-81.9, -2.6], [-77.5, -14.0], [-70.1, -26.4], [-64.0, -35.5], [-58.4, -42.9], [-51.6, -49.3], [-41.8, -55.7], [-33.1, -59.8], [-24.9, -62.7], [-15.1, -65.0], [-7.2, -66.0], [0.3, -66.3], [9.0, -65.8], [17.5, -64.4], [25.5, -62.2], [34.2, -58.8], [44.6, -52.8], [52.3, -46.4], [60.3, -38.6], [64.8, -33.4], [66.3, -31.6], [67.5, -29.9], [72.9, -21.9], [76.9, -13.6], [77.3, -12.8], [80.3, -4.6], [82.4, 2.6], [79.3, 10.6], [75.8, 17.3], [74.7, 19.0], [71.7, 24.2], [67.5, 30.9], [66.7, 32.0], [61.8, 39.1], [54.7, 46.5]]
/** The outline's radius along bearing angle θ (degrees, CCW from east). */
function R(th: number) {
  const dx = Math.cos(th * D), dy = Math.sin(th * D)
  let best = 0
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const det = dx * -ey - dy * -ex
    if (Math.abs(det) < 1e-12) continue
    const t = (a[0] * -ey - a[1] * -ex) / det
    const u = (dx * a[1] - dy * a[0]) / det
    if (u >= -1e-9 && u <= 1 + 1e-9 && t > best) best = t
  }
  return best
}
const P = (th: number, inset = 0, z = 0): V3 => { const r = R(th) - inset; return [r * Math.cos(th * D), r * Math.sin(th * D), z] }
const norm = (th: number) => ((th + 540) % 360) - 180

// Angle samples: every 3°, plus the tips and every break.
const KEYS = [-178.2, 1.8, -145, -125, -50, -5, 55, 70, 145, 160]
const ANG = [...new Set([...Array.from({ length: 120 }, (_, k) => -180 + 3 * k), ...KEYS].map((a) => +a.toFixed(3)))].sort((a, b) => a - b)

const EAVE = 37.8, CROWN = 43.6, PROW = 46.4, SHELL_T = 1.2, GLASS_IN = 2.6, FASCIA0 = 35.4
type Seg = 'N' | 'S' | 'GW' | 'GE'
function kind(th: number): Seg {
  if (th >= 55 && th <= 160) return 'N'
  if (th >= -145 && th <= -5) return 'S'
  if (th > -5 && th < 55) return 'GE'
  return 'GW'
}
function shellTop(th: number) {
  if (kind(th) === 'N') {
    if (th >= 140) return PROW
    if (th <= 70) return EAVE + 0.9
    return EAVE + 0.9 + ((th - 70) / 70) * (PROW - EAVE - 0.9)
  }
  if (th >= -55) return PROW
  if (th <= -125) return EAVE + 0.9
  return EAVE + 0.9 + ((th + 125) / 70) * (PROW - EAVE - 0.9)
}

// ---------------------------------------------------------------- shells and glass ends
for (let i = 0; i < ANG.length; i++) {
  const a = ANG[i], b = i + 1 < ANG.length ? ANG[i + 1] : ANG[0] + 360
  const m = norm((a + b) / 2), k = kind(m)
  const bn = norm(b)
  const out: V3 = [Math.cos(m * D), Math.sin(m * D), 0]
  if (k === 'N' || k === 'S') {
    // the shell: a 1.2 m wall on the outline, outer, inner and top faces
    const ta = shellTop(k === 'N' ? Math.max(55, Math.min(160, a)) : Math.max(-145, Math.min(-5, a)))
    const tb = shellTop(k === 'N' ? Math.max(55, Math.min(160, bn)) : Math.max(-145, Math.min(-5, bn)))
    face(white, [P(a, 0, 0), P(bn, 0, 0), P(bn, 0, tb), P(a, 0, ta)], out)
    face(white, [P(a, SHELL_T, 0), P(bn, SHELL_T, 0), P(bn, SHELL_T, tb), P(a, SHELL_T, ta)], [-out[0], -out[1], 0])
    face(white, [P(a, 0, ta), P(bn, 0, tb), P(bn, SHELL_T, tb), P(a, SHELL_T, ta)], [0, 0, 1])
  } else {
    // a glass end: the curtain wall set back under a white fascia
    face(win, [P(a, GLASS_IN, 0), P(bn, GLASS_IN, 0), P(bn, GLASS_IN, FASCIA0), P(a, GLASS_IN, FASCIA0)], out)
    face(white, [P(a, 0, FASCIA0), P(bn, 0, FASCIA0), P(bn, 0, EAVE + 0.4), P(a, 0, EAVE + 0.4)], out)
    face(white, [P(a, 0, FASCIA0), P(bn, 0, FASCIA0), P(bn, GLASS_IN, FASCIA0), P(a, GLASS_IN, FASCIA0)], [0, 0, -1])
    face(white, [P(a, 0, EAVE + 0.4), P(bn, 0, EAVE + 0.4), P(bn, 1.0, EAVE + 0.4), P(a, 1.0, EAVE + 0.4)], [0, 0, 1])
    // dark transoms every two storeys (7.5 m), a dark mullion every 9°
    for (const z of [7.5, 15, 22.5, 30]) {
      face(dark, [P(a, GLASS_IN - 0.06, z - 0.35), P(bn, GLASS_IN - 0.06, z - 0.35), P(bn, GLASS_IN - 0.06, z + 0.35), P(a, GLASS_IN - 0.06, z + 0.35)], out)
    }
  }
}
// shell ends: close the wall's cut ends
for (const [th, k] of [[55, 'N'], [160, 'N'], [-145, 'S'], [-5, 'S']] as [number, Seg][]) {
  const t = shellTop(th)
  const tan: V3 = [-Math.sin(th * D), Math.cos(th * D), 0]
  const sgn = (k === 'N' ? th === 55 : th === -145) ? -1 : 1
  face(white, [P(th, 0, 0), P(th, SHELL_T, 0), P(th, SHELL_T, t), P(th, 0, t)], [tan[0] * sgn, tan[1] * sgn, 0])
}
// glass mullions every 9° on the ends
for (const [a0, a1] of [[160, 201], [-5, 55]] as [number, number][]) {
  for (let t = a0 + 4.5; t < a1 - 2; t += 9) {
    const th = norm(t), out: V3 = [Math.cos(th * D), Math.sin(th * D), 0]
    const w = 0.35 / (R(th) * D) // half a 0.7 m bar, in degrees
    face(dark, [P(th - w, GLASS_IN - 0.07, 0), P(th + w, GLASS_IN - 0.07, 0), P(th + w, GLASS_IN - 0.07, FASCIA0), P(th - w, GLASS_IN - 0.07, FASCIA0)], out)
  }
}

/** A flush panel on the shell's outer face, θ from a to b, z0 to z1. */
function onShell(p: Part, a: number, b: number, z0: number, z1: number, off = 0.06) {
  const n = Math.max(2, Math.ceil(Math.abs(b - a) / 3))
  for (let k = 0; k < n; k++) {
    const t0 = a + ((b - a) * k) / n, t1 = a + ((b - a) * (k + 1)) / n, m = (t0 + t1) / 2
    face(p, [P(t0, -off, z0), P(t1, -off, z0), P(t1, -off, z1), P(t0, -off, z1)], [Math.cos(m * D), Math.sin(m * D), 0])
  }
}
// North shell slits (Averette from the north, Curra from the north-west,
// Pessar from the south-west), bold for phone size.
onShell(dark, 140, 158, 36.0, 37.6)
onShell(dark, 114, 131, 25.2, 26.8)
onShell(dark, 135, 144, 21.2, 22.8)
onShell(dark, 148, 156, 17.2, 18.8)
onShell(dark, 150, 157, 8.2, 9.6)
onShell(win, 128, 139, 13.0, 16.0) // the small window
onShell(win, 106, 152, 3.2, 10.6) // the lit window band at the shell's foot
// South shell (DXR from the south-east): a two-storey window on the prow,
// a band at its foot, slits further west.
onShell(win, -40, -30, 21.0, 27.0)
onShell(win, -36, -24, 3.2, 8.0)
onShell(dark, -118, -104, 25.2, 26.8)
onShell(dark, -98, -90, 18.2, 19.8)
onShell(dark, -140, -128, 9.2, 10.8)

// The LED board on the west glass (lit at night).
{
  const a = -178.0, b = -157.0, n = 7
  for (let k = 0; k < n; k++) {
    const t0 = a + ((b - a) * k) / n, t1 = a + ((b - a) * (k + 1)) / n, m = (t0 + t1) / 2
    face(screen, [P(t0, GLASS_IN - 0.12, 12.5), P(t1, GLASS_IN - 0.12, 12.5), P(t1, GLASS_IN - 0.12, 29.5), P(t0, GLASS_IN - 0.12, 29.5)], [Math.cos(m * D), Math.sin(m * D), 0])
  }
}

// ---------------------------------------------------------------- the domed roof
const S = [1, 0.84, 0.68, 0.52, 0.36, 0.2]
const zr = (s: number) => EAVE + (CROWN - EAVE) * (1 - s * s)
const RP = (th: number, s: number): V3 => { const r = (R(th) - 1.0) * s; return [r * Math.cos(th * D), r * Math.sin(th * D), zr(s)] }
for (let i = 0; i < ANG.length; i++) {
  const a = ANG[i], b = norm(i + 1 < ANG.length ? ANG[i + 1] : ANG[0] + 360)
  for (let k = 0; k < S.length - 1; k++) face(roof, [RP(a, S[k]), RP(b, S[k]), RP(b, S[k + 1]), RP(a, S[k + 1])], [0, 0, 1])
  face(roof, [RP(a, S[S.length - 1]), RP(b, S[S.length - 1]), [0, 0, CROWN]], [0, 0, 1])
}
// ---------------------------------------------------------------- the bayside wings
// North-east wedge, OSM way/128452685: beige concrete, skillion roof rising
// east; a glass grid in a thick frame on its north face.
const NE: XY[] = [[54.7, 46.5], [61.8, 39.1], [66.7, 32.0], [67.5, 30.9], [81.8, 34.6], [85.2, 23.3], [119.1, 31.6], [130.0, 34.3], [141.8, 37.2], [133.4, 65.2], [113.1, 58.0], [85.5, 48.1]]
const skill = (x: number) => 14.5 + Math.max(0, x - 55) * 0.08
prism(beige, NE, 0, 0, (x) => skill(x))
{
  // the north face, from (85.5,48.1) to (133.4,65.2): a framed window wall
  const a: XY = [85.5, 48.1], b: XY = [133.4, 65.2]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const at = (s: number, z: number): V3 => [a[0] + u[0] * s - n[0] * 0.07, a[1] + u[1] * s - n[1] * 0.07, z]
  // n points into the polygon for a CCW ring walked backwards here; face it out
  const outN: V3 = [-n[0], -n[1], 0]
  for (const [s0, s1] of [[5, 21], [24, 40]]) face(win, [at(s0, 3), at(s1, 3), at(s1, 13), at(s0, 13)], outN)
}
// South-east wing, OSM way/128452681: a white box with a round end.
const SE: XY[] = [[142.3, -34.5], [142.5, -32.9], [142.4, -31.2], [141.9, -29.4], [141.1, -27.6], [140.2, -26.3], [139.1, -25.2], [138.0, -24.3], [136.7, -23.5], [135.0, -22.9], [133.1, -22.5], [131.8, -22.5], [130.7, -22.6], [129.2, -22.9], [127.5, -23.6], [126.4, -24.2], [125.6, -24.8], [124.5, -25.8], [124.0, -26.4], [115.0, -23.3], [108.9, -39.7], [99.3, -31.8], [76.9, -13.6], [72.9, -21.9], [67.5, -29.9], [83.6, -38.6], [96.9, -45.8], [105.5, -50.5], [106.1, -53.1], [106.9, -55.3], [108.2, -57.0], [110.3, -58.8], [112.7, -60.2], [115.4, -61.0], [118.0, -61.3], [120.7, -61.2], [122.8, -60.5], [125.6, -59.1], [146.3, -47.7], [146.7, -45.0]]
prism(white, SE, 0, 15.5)
// windows on its south face, between the round ends (two storeys each)
{
  const a: XY = [83.6, -38.6], b: XY = [96.9, -45.8]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const o: V3 = [u[1], -u[0], 0]
  for (const z0 of [2.5]) face(win, [[a[0] + o[0] * 0.07, a[1] + o[1] * 0.07, z0], [b[0] + o[0] * 0.07, b[1] + o[1] * 0.07, z0], [b[0] + o[0] * 0.07, b[1] + o[1] * 0.07, z0 + 5], [a[0] + o[0] * 0.07, a[1] + o[1] * 0.07, z0 + 5]], o)
}
// the glass rotunda at its east end, with a white roof ring
prism(win, circle(133, -33, 10.2), 0, 20.2)
prism(white, circle(133, -33, 11.0), 20.2, 21.6, undefined, true)

// The bayside canopy, OSM way/741593660: a flat white slab on dark columns,
// over a setback glass entry.
const CAN: XY[] = [[99.3, -31.8], [100.9, -31.9], [101.8, -31.5], [118.5, -20.9], [119.8, -19.6], [120.3, -18.4], [120.4, -16.8], [112.9, -0.4], [112.7, 0.4], [113.1, 1.4], [121.2, 19.0], [121.3, 20.5], [120.9, 21.7], [120.4, 22.6], [119.6, 23.5], [111.1, 28.5], [109.9, 28.7], [74.7, 19.0], [75.8, 17.3], [79.3, 10.6], [82.4, 2.6], [80.3, -4.6], [77.3, -12.8], [76.9, -13.6]]
prism(white, CAN, 19.2, 20.8, undefined, true)
prism(win, [[76, -14], [98, -26], [104, -12], [104, 12], [100, 22], [76, 17]], 0, 19.2)
for (const [x, y] of [[112, -18], [108, 2], [114, 20], [100, 25]] as XY[])
  prism(dark, circle(x, y, 0.7, 8), 0, 19.2)

// ---------------------------------------------------------------- materials and output
// From the daylight photos: the shells and fascia a cool white; the roof a
// pale grey metal (the shells floodlit white at night, Christensen); slate glass; charcoal slits and mullions;
// the wedge's sand concrete; the LED board, a lit screen at night.
const out = [
  { part: white, material: { ...finish('kc-white', 0xeceeec), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.5 && q[2] > 2 ? 0.75 : 0) } },
  { part: roof, material: finish('kc-roof', 0xcdd3d6) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('kc-dark', 0x4d5258) },
  { part: beige, material: finish('kc-sand', 0xd9c9ab) },
  { part: screen, material: finish('neon-kc-screen', 0xb6524a) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kaseya Center', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at street level under the way/25312625 centroid; bearing 0',
  bearing: 0, osm: 'way/25312625',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/mia-kaseya-center.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
