/**
 * U.S. Bank Stadium (2016, HKS), Minneapolis: procedural, CC0-1.0.
 * bun generators/msp-us-bank-stadium.ts
 *
 * Map frame: x towards compass 44 (north-east), y towards 314 (north-west,
 * along the roof's ridge towards the prow and downtown), z up, metres;
 * bearing 314. The origin is the centroid of OSM way/743461508. Heights
 * in this file are measured from the street on the south-east and
 * north-east sides (254.4 m NAVD88); the plaza at the west end (the
 * Commons side) stands 5 m higher. The GLB's y = 0 is the map's lowest
 * terrain under the footprint, 248.2 m, where the ground falls into the
 * rail cut at the east corner, so everything is lifted 6.2 m at the end
 * and the walls run down to it.
 *
 * Form: a dark, faceted zinc-clad shard under a gable roof. The ridge runs
 * the stadium's length from the prow at the north-west corner, its highest
 * point, falling to the south-east end. North-east of the ridge the roof is
 * opaque and pale grey; south-west of it most of the slope is the
 * translucent ETFE panel that lights the field, framed by grey strips. The
 * west-north-west end is one huge glass wall, its top rising towards the
 * prow, with the five pivoting doors of the Legacy Gate at its foot. Over
 * its north end the prow leans out 40 m past the glass: a dark zinc
 * triangle facing downtown, with sloped glass under it on the north.
 *
 * Measured (USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, 1 m surface
 * model, ground_min 246.9 m; heights here are above y = 0 = 254.4 m):
 * - the north-east roof slope is one plane, z = 77.8 - 0.297 x + 0.078 y
 *   (1,660 returns, rms 0.1 m), so the north-east eave falls from about
 *   77 m at the north corner to 40 m at the east corner;
 * - the prow's tip 86 m above y = 0, 81 m above the west plaza (OSM
 *   height 83 m);
 * - the ridge falling to about 63.5 m at the south-east wall;
 * - the clean part of the ETFE slope (72 m at x = -29) and the south-west
 *   eave at 45-48 m. The rest of the ETFE returns are noisy (the cushions
 *   scatter the pulses), so the south-west plane is fitted through the
 *   ridge and the eave;
 * - the street 7.5 m above ground_min on the east and south-east, 12.5 m
 *   (+5 m here) on the west plaza.
 * From NAIP (USDA, public domain): the plan of the ETFE panel (it starts at
 *   the glass wall's top and stops about 10 m short of the ridge and the
 *   south-west eave), the pale opaque roof, the prow's tip on the ridge.
 * From OSM way/743461508: the outline (its north-west corner is the prow's
 *   tip, 40 m out past the line of the glass wall).
 * From photos: the colours (dark grey zinc, pale grey roof edge, light
 *   blue-grey reflective glass, white stripes on the zinc); the dark prow
 *   triangle and the sloped glass on its north; the glass wall's door
 *   line about 27 m up; the clerestory band under the north eave (lit at
 *   night); the tall glass slot in the south-east end under the ridge.
 * Estimated: the prow's foot (where the triangle meets the ground, from the
 *   photos), the door line and mullions, the clerestory band's depth, the
 *   stripes' runs, the slot's outline.
 * Left out: the field (the map's), lettering, the light-rail plaza and its
 *   brick arches west of the glass wall (separate structures), the faceting
 *   of the walls below the eaves (drawn as plain vertical faces with the
 *   stripes), the roof's railings.
 * OSM: way/743461508 (building=stadium, height 83) is the only building
 *   or part inside the outline.
 *
 * Photos (all Wikimedia Commons):
 * - Lectrician2, "U.S. Bank Stadium.jpg", CC BY-SA 4.0, drone from the
 *   west-north-west: https://commons.wikimedia.org/wiki/File:U.S._Bank_Stadium.jpg
 * - Darb02, "US Bank Stadium - West Facade.jpg", CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:US_Bank_Stadium_-_West_Facade.jpg
 * - August Schwerdfeger, "U.S. Bank Stadium 2021-09-23.jpg", CC BY 4.0,
 *   from the west: https://commons.wikimedia.org/wiki/File:U.S._Bank_Stadium_2021-09-23.jpg
 * - Michael Barera, "Minneapolis April 2025 18 (U.S. Bank Stadium).jpg",
 *   CC BY-SA 4.0, from the west: https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_18_(U.S._Bank_Stadium).jpg
 * - Thomson200, "U.S. Bank Stadium from the interstate, August 2018.jpg",
 *   CC0, from the south-east: https://commons.wikimedia.org/wiki/File:U.S._Bank_Stadium_from_the_interstate,_August_2018.jpg
 * - Chad Davis, "US Bank Stadium.jpg", CC BY-SA 2.0, the north side at
 *   night: https://commons.wikimedia.org/wiki/File:US_Bank_Stadium.jpg
 * - Chad Davis, "US Bank Stadium, Minneapolis (50463445462).jpg", CC BY
 *   2.0, from the north-west at night: https://commons.wikimedia.org/wiki/File:US_Bank_Stadium,_Minneapolis_(50463445462).jpg
 * - Tony Webster, "U.S. Bank Stadium, Minneapolis (26060829448).jpg",
 *   CC BY-SA 2.0, the zinc and stripe: https://commons.wikimedia.org/wiki/File:U.S._Bank_Stadium,_Minneapolis_(26060829448).jpg
 * - Pipdipchip, "US Bank Stadium (Southeast) - Sep. 5, 2015.jpg", CC BY-SA
 *   4.0: https://commons.wikimedia.org/wiki/File:US_Bank_Stadium_(Southeast)_-_Sep._5,_2015.jpg
 * Rework (lead review): the lidar was re-read keeping class 18 (high noise,
 *   which this dataset puts on tall structures): the prow's tip is the same,
 *   95 m over ground_min, 83 m over the west plaza (OSM and published 83 m,
 *   272 ft); the glass wall's top falls from 72 m over the plaza at the prow
 *   to 48 m at its south corner, as modelled. The massing and roof planes
 *   were checked against the drone (camera fitted to its GPS, 3 px rms),
 *   west and south-east photos in a perspective render and kept: the ridge
 *   runs from the prow (north-west, the high point) down to the south-east
 *   end. The pale-grey triangle in the old orthographic south-east
 *   comparison was the north-east roof plane, which an orthographic view at
 *   6 degrees shows and the 2018 photo, a long lens from about 140 degrees,
 *   sees almost edge-on (the far, high end shrinks with distance). Changed:
 *   lighter, reflective glass with only its frame and the door transom; a
 *   paler ETFE and a darker opaque roof (still lighter than the zinc: NAIP
 *   and the interstate photo both show it pale grey); a darker charcoal
 *   zinc; the glazed clerestory strip under the fascia round the south and
 *   east (interstate photo); the stripe as one straight-ish line about 11 to
 *   15 m up; the south-east slot as tall glass narrowing to the ridge; a
 *   folded facet at the south corner.
 * Doubts: no licensed photo of the south-west side under the ETFE eave;
 *   it is drawn as plain zinc with a stripe. The ETFE plane's pitch rests on
 *   its clean edge and the eave, not on the whole panel. The slot's outline
 *   and the corner facet are estimated from the interstate photo. The north
 *   side rests on a night photo.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const zinc = new Part(), roof = new Part(), etfe = new Part(), glassWall = new Part(), band = new Part(), trim = new Part()

/** A planar polygon facing `n`, fanned (convex only). */
function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
/** Clip a convex polygon to the half-space f(p) >= 0. */
function clip(P: V3[], f: (p: V3) => number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]) }
  }
  return out
}
/** Ear-clip a simple 2D polygon; returns index triples, counter-clockwise. */
function earcut(P: XY[]): number[][] {
  const area = P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const idx = P.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: number[][] = []
  const crs = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (crs(P[a], P[b], P[c]) <= 1e-9) continue
      const inside = idx.some((o) => o !== a && o !== b && o !== c &&
        crs(P[a], P[b], P[o]) >= 0 && crs(P[b], P[c], P[o]) >= 0 && crs(P[c], P[a], P[o]) >= 0)
      if (inside) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A flat-or-sloped surface over a simple ring, heights from z(x, y), facing up. */
function surface(p: Part, ring: XY[], z: (x: number, y: number) => number, lift = 0) {
  for (const [a, b, c] of earcut(ring)) {
    const P = [ring[a], ring[b], ring[c]].map(([x, y]) => [x, y, z(x, y) + lift] as V3)
    poly(p, P, [0, 0, 1])
  }
}
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

const nrm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** Outward unit normal (in plan) of the edge a→b of a counter-clockwise ring. */
const outN = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, (a[0] - b[0]) / l] }

// ------------------------------------------------------------- the plan ---
// The prow, from OSM and the lidar.
const T: XY = [11, 172.5]              // the prow's tip (roof level only)
const C: XY = [38.1, 140.1]            // north edge meets the glass line
const A: XY = [-13.5, 122.4]           // top of the glass wall at the prow
const GW: XY = [-105.8, 89.7]          // the glass wall's south corner
const B: XY = lerp2(A, C, 0.36)        // the prow's foot on the glass line
const E: XY = [14, -134.8]             // the ridge's south-east end

// ------------------------------------------------------------ the roof ---
const zT = 86.5, zE = 63.5
// The north-east plane, as measured (rms 0.1 m), set through the ridge's
// ends; the south-west plane through the ridge and the south-west eave.
const neRaw = (x: number, y: number) => 77.76 - 0.2968 * x + 0.0783 * y
function plane(p: V3, q: V3, r: V3) {
  const n = cross(sub(q, p), sub(r, p))
  return (x: number, y: number) => p[2] - (n[0] * (x - p[0]) + n[1] * (y - p[1])) / n[2]
}
const P_T: V3 = [T[0], T[1], zT], P_E: V3 = [E[0], E[1], zE]
const neZ = plane(P_T, P_E, [103.4, 26.2, neRaw(103.4, 26.2)])
const swZ = plane(P_T, P_E, [-114.5, 18.5, 46])
const roofZ = (x: number, y: number) => Math.min(neZ(x, y), swZ(x, y))

// The outline (OSM, counter-clockwise from the glass wall's south corner
// round to the north edge), each vertex paired with the roof's edge above
// it (`q`), the height of the sloping zinc skirt's foot at the outline
// (`h1`) and the vertical step between the skirt's top and the roof's edge
// (`st`, the clerestory on the north side). All from the lidar profiles
// across each edge.
type V = { o: XY; q: XY; h1: number; st: number }
const Eq = lerp2(T, E, (172.5 + 130.8) / (172.5 + 134.8))
const R: V[] = [
  { o: GW, q: GW, h1: swZ(...GW), st: 0 },
  { o: [-119.8, 19.6], q: [-114.5, 18.5], h1: 26, st: 0 },
  { o: [-102.1, -45.1], q: [-97.2, -44.5], h1: 27, st: 0 },
  { o: [-87.7, -111.3], q: [-83, -109.5], h1: 28, st: 0 },
  { o: [-81.5, -124.3], q: [-78.5, -119.8], h1: 28, st: 0 },
  { o: [-34.3, -136.7], q: [-33.6, -132.7], h1: 24, st: 0 },
  { o: [10.5, -135.4], q: [10.2, -131.4], h1: 30, st: 0 },
  { o: E, q: Eq, h1: 32, st: 0 },
  { o: [41, -130.2], q: [40.3, -126.3], h1: 30, st: 0 },
  { o: [74.3, -123.6], q: [71, -119], h1: 34, st: 0 },
  { o: [111.1, -57.3], q: [104, -57], h1: 33, st: 0 },
  { o: [103.4, 26.2], q: [98.6, 26], h1: 30, st: 0 },
  { o: [103, 94.7], q: [98, 68], h1: 16, st: 9 },
  { o: [90.7, 103.3], q: [84, 84], h1: 18, st: 12 },
  { o: C, q: C, h1: 40, st: 28 },
]
const iE = 7

// north-east of the ridge: opaque
surface(roof, [T, ...R.slice(iE).map((v) => v.q)], neZ)
// south-west of the ridge: the grey frame round the ETFE panel
surface(roof, [T, A, ...R.slice(0, iE + 1).map((v) => v.q)], swZ)
const ETFE: XY[] = [[-11, 118], [-100, 86], [-110, 19], [-93, -44], [-79.5, -106], [-74, -116], [-33, -125], [4, -125]]
surface(etfe, ETFE, swZ, 0.25)

// ----------------------------------------------------------- the walls ---
const skirtTop = (v: V) => roofZ(...v.q) - v.st
for (let i = 0; i < R.length - 1; i++) {
  const a = R[i], b = R[i + 1]
  const n = outN(a.o, b.o)
  // the vertical wall under the outline
  poly(zinc, [[a.o[0], a.o[1], 0], [b.o[0], b.o[1], 0], [b.o[0], b.o[1], b.h1], [a.o[0], a.o[1], a.h1]], [n[0], n[1], 0])
  // the sloping skirt up to the eave (glass in the slot under the ridge's
  // south-east end)
  const slot = i === iE - 1 || i === iE
  const P: V3[] = [[a.o[0], a.o[1], a.h1], [b.o[0], b.o[1], b.h1], [b.q[0], b.q[1], skirtTop(b)], [a.q[0], a.q[1], skirtTop(a)]]
  poly(zinc, [P[0], P[1], P[2]], [n[0], n[1], 0.6])
  poly(zinc, [P[0], P[2], P[3]], [n[0], n[1], 0.6])
  if (slot) {
    // The tall glass slot under the ridge's south-east end (interstate and
    // Pipdipchip photos): about 22 m wide at the concourse, narrowing to
    // 6 m where it meets the ridge. Laid over the wall and the skirt.
    const hw = (z: number) => 11 - ((z - 10) * 8) / 53
    const inSlot = (P: V3[]) => clip(clip(clip(P, (p) => p[2] - 9), (p) => hw(p[2]) - (p[0] - E[0])), (p) => hw(p[2]) + (p[0] - E[0]))
    const wall: V3[] = [[a.o[0], a.o[1], 0], [b.o[0], b.o[1], 0], [b.o[0], b.o[1], b.h1], [a.o[0], a.o[1], a.h1]]
    for (const F of [wall, P]) {
      const fn = nrm(cross(sub(F[1], F[0]), sub(F[2], F[0])))
      const s = fn[0] * n[0] + fn[1] * n[1] >= 0 ? 0.12 : -0.12
      const G = inSlot(F).map((p) => [p[0] + fn[0] * s, p[1] + fn[1] * s, p[2] + fn[2] * s] as V3)
      if (G.length >= 3) poly(glassWall, G, [n[0], n[1], F === P ? 0.6 : 0])
    }
  }
  // the vertical step at the roof's edge, with the clerestory band in it
  if (a.st > 0 || b.st > 0) {
    const m = outN(a.q, b.q)
    const ra = roofZ(...a.q), rb = roofZ(...b.q)
    poly(zinc, [[a.q[0], a.q[1], ra - a.st], [b.q[0], b.q[1], rb - b.st], [b.q[0], b.q[1], rb], [a.q[0], a.q[1], ra]], [m[0], m[1], 0])
    const o = (p: XY): XY => [p[0] + m[0] * 0.08, p[1] + m[1] * 0.08]
    const qa = o(a.q), qb = o(b.q)
    poly(roof, [[qa[0], qa[1], ra - Math.min(2.4, a.st)], [qb[0], qb[1], rb - Math.min(2.4, b.st)], [qb[0], qb[1], rb], [qa[0], qa[1], ra]], [m[0], m[1], 0])
    if (a.st > 6 && b.st > 6)
      poly(band, [[qa[0], qa[1], ra - 7.5], [qb[0], qb[1], rb - 7.5], [qb[0], qb[1], rb - 3.4], [qa[0], qa[1], ra - 3.4]], [m[0], m[1], 0])
  }
}

/** A band on the vertical wall under the outline edge a→b, `off` out from it. */
function onWall(p: Part, a: XY, b: XY, t0: number, t1: number, lo: (t: number) => number, hi: (t: number) => number, off = 0.1) {
  const n = outN(a, b)
  const p0 = lerp2(a, b, t0), p1 = lerp2(a, b, t1)
  const q = (pt: XY, z: number): V3 => [pt[0] + n[0] * off, pt[1] + n[1] * off, z]
  poly(p, [q(p0, lo(t0)), q(p1, lo(t1)), q(p1, hi(t1)), q(p0, hi(t0))], [n[0], n[1], 0])
}
// White stripes across the zinc, long sloping bands (their runs estimated
// from the photos).
// One continuous band, zig-zagging from corner to corner round the
// south-west, south-east and east sides (its heights estimated from the
// photos), so it doesn't break into dashes at phone size.
const SH = [14, 13, 12, 11, 10.5, 11.5, 13, 13, 13, 14.5, 13, 12]
for (let i = 0; i < SH.length - 1; i++) {
  const L = (t: number) => SH[i] + (SH[i + 1] - SH[i]) * t
  onWall(trim, R[i].o, R[i + 1].o, 0, 1, L, (t) => L(t) + 2)
}
// The lit concourse glazing at the foot of the north side.
onWall(band, R[12].o, R[13].o, 0.05, 0.95, () => 1.5, () => 9)
onWall(band, R[13].o, R[14].o, 0.03, 0.97, () => 1.5, (t) => 9 + t * 20)
onWall(band, R[11].o, R[12].o, 0.5, 0.97, () => 1.5, (t) => 1.5 + (t - 0.5) * 15)
// The clerestory: a glazed strip under the dark fascia at the top of the
// skirt, all round the south-west, south-east and east sides (the
// interstate photo), and on round the north-east side.
for (let i = 0; i < R.length - 1; i++) {
  const a = R[i], b = R[i + 1], n = outN(a.o, b.o)
  if (i === iE - 1 || i === iE || a.st > 0 || b.st > 0) continue
  const at = (v: V, k: number): V3 => {
    const z0 = v.h1, z1 = skirtTop(v)
    return [v.o[0] + (v.q[0] - v.o[0]) * k + n[0] * 0.08, v.o[1] + (v.q[1] - v.o[1]) * k + n[1] * 0.08, z0 + (z1 - z0) * k + 0.08]
  }
  poly(band, [at(a, 0.6), at(b, 0.6), at(b, 0.78), at(a, 0.78)], [n[0], n[1], 0.6])
}
// The big folded facets at the south corner (the interstate photo's dark
// triangles at the lower left): two triangles from the corner's eave to
// the ground, creased 1.5 m out from the wall so they shade apart.
{
  const i = 4, a = R[i - 1], c = R[i], b = R[i + 1]
  const top: V3 = [c.o[0], c.o[1], c.h1]
  const crease = (p: XY, q: XY, k: number, out: number): V3 => {
    const m = lerp2(p, q, k), n = outN(p, q)
    return [m[0] + n[0] * out, m[1] + n[1] * out, 0]
  }
  const l0: V3 = [lerp2(c.o, a.o, 0.45)[0], lerp2(c.o, a.o, 0.45)[1], 0]
  const r0: V3 = [lerp2(c.o, b.o, 0.6)[0], lerp2(c.o, b.o, 0.6)[1], 0]
  const foot = crease(a.o, c.o, 0.92, 1.5), foot2 = crease(c.o, b.o, 0.08, 1.5)
  const mid: V3 = [(foot[0] + foot2[0]) / 2, (foot[1] + foot2[1]) / 2, 0]
  const nA = outN(a.o, c.o), nB = outN(c.o, b.o)
  poly(zinc, [l0, mid, top], [nA[0], nA[1], 0.15])
  poly(zinc, [mid, r0, top], [nB[0], nB[1], 0.15])
}

// ---------------------------------------------- the glass wall and prow ---
const nG = outN(A, GW)
const nGlass: V3 = [nG[0], nG[1], 0]                // west-north-west
// GW -> A: the full-height glass, from the ground to the roof
poly(glassWall, [[A[0], A[1], 0], [GW[0], GW[1], 0], [GW[0], GW[1], swZ(...GW)], [A[0], A[1], swZ(...A)]], nGlass)
// A -> B: the glass under the prow triangle's slanting edge
poly(glassWall, [[B[0], B[1], 0], [A[0], A[1], 0], [A[0], A[1], swZ(...A)]], nGlass)
// B -> C: the vertical glass under the sloped glass
const zC = neZ(...C)
poly(glassWall, [[C[0], C[1], 0], [B[0], B[1], 0], [C[0], C[1], zC]], nGlass)
// The prow: the dark triangle facing downtown, and the sloped glass on its
// north side.
const P_A: V3 = [A[0], A[1], swZ(...A)], P_B: V3 = [B[0], B[1], 0], P_C: V3 = [C[0], C[1], zC]
poly(zinc, [P_T, P_A, P_B], [-1, 0.5, -0.2])
poly(glassWall, [P_T, P_B, P_C], [0.3, 1, -0.4])
// the dark blade along the prow's north edge, over the sloped glass
{
  const fn = nrm(cross(sub(P_B, P_T), sub(P_C, P_T)))
  const s = fn[1] > 0 ? 1 : -1
  const off = (p: V3): V3 => [p[0] + s * fn[0] * 0.1, p[1] + s * fn[1] * 0.1, p[2] + s * fn[2] * 0.1]
  const along = (p: V3, q: V3, k: number): V3 => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k]
  poly(zinc, [off(P_T), off(along(P_T, P_B, 0.2)), off(along(P_C, P_B, 0.14)), off(P_C)], [s * fn[0], s * fn[1], s * fn[2]])
}
// The Legacy Gate's doors: a pale line about 27 m above the plaza across
// the southern three quarters of the glass wall, the door posts under it,
// mullions above, and the frame along the top.
{
  const u = (t: number) => lerp2(GW, A, t)
  const ox = nG[0] * 0.12, oy = nG[1] * 0.12
  const bar = (t0: number, t1: number, z0: (p: XY) => number, z1: (p: XY) => number) => {
    const p = u(t0), q = u(t1)
    poly(trim, [[p[0] + ox, p[1] + oy, z0(p)], [q[0] + ox, q[1] + oy, z0(q)], [q[0] + ox, q[1] + oy, z1(q)], [p[0] + ox, p[1] + oy, z1(p)]], nGlass)
  }
  // Few lines, as the photos read from a distance: the frame along the top
  // and the two ends, and the transom over the five doors.
  const doorTop = 32
  const at = (z: number) => () => z
  bar(0.1, 0.84, at(doorTop - 1.4), at(doorTop))
  bar(0, 0.012, at(5), (p) => swZ(...p))
  bar(0.988, 1, at(5), (p) => swZ(...p))
  bar(0, 1, (p) => swZ(...p) - 1.6, (p) => swZ(...p))
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: zinc, material: finish('usbs-zinc', 0x4f545b) },
  { part: roof, material: finish('usbs-roof', 0x99a1a8) },
  { part: etfe, material: { ...PALETTE.glass, color: 0xd5e2ea } },
  { part: glassWall, material: windowVariant(2, 0xaec6d8) },
  { part: band, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
]
// Heights above were measured from the street (254.4 m). The map stands the
// model on the lowest terrain under its footprint, 248.2 m, where the
// ground drops into the rail cut at the east corner (tools/terrain.ts
// check), so lift everything 6.2 m and let the walls run down to it.
const LIFT = 6.2
for (const { part } of parts) for (let k = 1; k < part.pos.length; k += 3) if (part.pos[k] > 1e-6) part.pos[k] += LIFT
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('U.S. Bank Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 314, elevation: 0, height: zT + LIFT,
})
if (import.meta.main) {
  await Bun.write(new URL('../models/msp-us-bank-stadium.glb', import.meta.url), glb)
  console.log(`msp-us-bank-stadium.glb: ${triangles} triangles, ${glb.length} bytes`)
}
