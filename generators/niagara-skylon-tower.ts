/**
 * Skylon Tower, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-skylon-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. The origin is the tower's axis, found from the USGS 3DEP
 * NY_3County_2019 lidar (flown 2019, which reaches this point on the
 * Ontario bank) as the centroid of the pod's returns. OSM's tower outline
 * (way/241004747) sits 3.6 m west and 0.7 m north of it, an imagery offset;
 * the base building's OSM outlines match the lidar roofs and are used as
 * mapped. Heights below are lidar heights less 183.0 m (NAVD88), the
 * lowest ground under the base building, at its south-west corner. The map
 * stands the model 1.9 m lower than that (its lowest Mapterhorn point over
 * the plan's extent is 181.1 m), so the output lifts everything but the
 * base walls' feet by 1.9 m (LIFT) to land each part at its lidar height.
 *
 * Opened 1965 (Bregman + Hamann). A tapering concrete shaft with three
 * recessed elevator runways, each carrying a yellow glass-fronted "Yellow
 * Bug" cab up the outside; a pod of three levels (Revolving Dining Room,
 * Summit Suite, indoor and outdoor observation decks) on a ribbed underside;
 * a copper drum and a lit mast on top; a two-storey base building (shops,
 * arcade, theatre) round the foot.
 *
 * Published: 160 m (520 ft) to the top of the mast (Wikipedia, skylon.com);
 * 236 m above the falls. The lidar gives the same 160 m from the lowest
 * ground under the base: the street at the tower's foot is 10.5 m above it.
 *
 * Measured (lidar, metres above y = 0):
 * - pod: outer rim r 17.0 (the returns' edge, every bearing within 0.4 m),
 *   rim and open-deck floor at 133.5 from r 15 out; the inner deck's roof
 *   rises from 136.7 at r 15 to 140.0 at r 6.5, a shallow cone;
 * - copper drum r 5.5, top 145.0; a railing on it to 146.5;
 * - mast returns to 161.2 (the tip, matching the published 160 m);
 * - base roofs: way/241004782 206.0 m (23.0), its raised core
 *   way/241004780 207.5 m (24.5), the low east and south-west wings
 *   (way/241004773, way/241004768) 198.2 m (15.2); the street on the north
 *   and east sides 193.5 m (10.5), falling to 183 m in the south-west.
 *
 * From photos (scaled to the pod's 34 m):
 * - the pod wall leans out, r 15.3 at its foot to 17.0 at the rim, 10.8 m
 *   tall (OSM's 124-135 m part agrees), with two window bands between
 *   three white bands; the underside 6.5 m deep: a ribbed annulus from
 *   r 14.6 to 9.5, then a smooth concave collar down to the shaft;
 * - the shaft 18 m across at the base roof, 10.4 m under the collar
 *   (Taxiarchos228's distant view, the least foreshortened);
 * - the elevator runways 3.6 m wide; bearings 98, 218 and 338 degrees from
 *   OSM's three skillion elevator parts;
 * - the inner observation deck's glazing leaning in above the rim, the
 *   mast about 16 m, lamps along the rim, round the drum and up the mast
 *   (night photo).
 * - base facade: ground-floor glazing, a cream canopy band, a dark upper
 *   band, a taupe fascia with a slight overhang (Antony-22, 2023).
 *
 * Estimated: the collar's curve, rib count (36, the real ones are finer),
 * runway depth (0.9 m), the cabs' size (3.2 x 5 m) and their parking
 * heights (they move: one at the base, one mid-shaft, one near the top),
 * the base facade bands on sides no photo shows, drawn the same all round.
 * Left out: railings, the runways' rails, rooftop plant, signs.
 *
 * Night: the shaft and the pod's underside and white bands are floodlit
 * (`floodlight`); pod and base glazing is `window`; the rim, drum and mast
 * lamps are `lamp` beads.
 *
 * OSM: way/241004747 (tower outline) and its parts (shaft, elevators,
 * pod 124-135, glass 135-137, roof 137-143, copper drum 140-146, mast
 * 146-160, three small 1 m parts); the base building way/241004751 and its
 * parts way/241004782, 241004780, 241004768, 241004773.
 *
 * Photos (Wikimedia Commons):
 * - "Skylon Tower 2023a.jpg", Antony-22, CC BY-SA 4.0 (from the parking, base facade)
 * - "Skylon Tower Top.jpg", Kevin Payravi, CC BY-SA 3.0 (pod, drum, mast)
 * - "Niagara Falls - ON - Skylon Tower5.jpg", Taxiarchos228, CC BY 3.0 (distant, proportions)
 * - "Niagara Falls - ON - Skylon Tower bei Nacht.jpg", Wladyslaw, CC BY-SA 3.0 (night)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const D2R = Math.PI / 180
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- materials ---
const concrete = new Part() // shaft, underside, base fascia and roofs, mast
const white = new Part()    // the pod's white bands, the base's canopy band
const win = new Part()      // pod and base glazing (lit at night)
const copper = new Part()   // the drum
const yellow = new Part()   // the Yellow Bug cabs
const lamp = new Part()     // rim, drum and mast lamps

/** A quad whose winding is chosen so it faces `out`, with per-corner normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, Q: V3[], n: V3) => face(p, Q, [n, n, n, n])
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** Surface of revolution from [r, z]; left of the profile is outside. */
function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40, a0 = 0) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos(smooth * D2R)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = a0 + (s / k) * TAU, ab = a0 + ((s + 1) / k) * TAU
      const q = [P(r0, aa, z0), P(r0, ab, z0), P(r1, ab, z1), P(r1, aa, z1)]
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** A box on a horizontal frame (d outward, e along), centre c at its foot. */
function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number) {
  const up: V3 = [0, 0, 1]
  const at = (u: number, v: number, z: number): V3 => add(add(add(c, mul(d, u)), mul(e, v)), [0, 0, z])
  flat(p, [at(hd, -he, z0), at(hd, he, z0), at(hd, he, z1), at(hd, -he, z1)], d)
  flat(p, [at(-hd, -he, z0), at(-hd, he, z0), at(-hd, he, z1), at(-hd, -he, z1)], mul(d, -1))
  flat(p, [at(-hd, he, z0), at(hd, he, z0), at(hd, he, z1), at(-hd, he, z1)], e)
  flat(p, [at(-hd, -he, z0), at(hd, -he, z0), at(hd, -he, z1), at(-hd, -he, z1)], mul(e, -1))
  flat(p, [at(-hd, -he, z1), at(hd, -he, z1), at(hd, he, z1), at(-hd, he, z1)], up)
  flat(p, [at(-hd, -he, z0), at(hd, -he, z0), at(hd, he, z0), at(-hd, he, z0)], mul(up, -1))
}

/** A small octahedral bead, the lamp's shape. */
function bead(p: Part, c: V3, r: number) {
  const X: V3 = [r, 0, 0], Y: V3 = [0, r, 0], Z: V3 = [0, 0, r]
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) {
    const a = add(c, mul(X, sx)), b = add(c, mul(Y, sy)), t = add(c, mul(Z, sz))
    const n = unit([sx, sy, sz])
    p.tri(a, b, t, undefined, undefined, undefined, [n, n, n])
  }
}

// ------------------------------------------------------------- the shaft ---
const STREET = 10.5          // street at the tower's foot, above y = 0
const SHAFT_TOP = 116.5      // the runways run up into the collar
const shaftR = (z: number) => 9.95 - z * 0.0413 // r 9.0 at the base roof, 5.2 under the collar
const RUN_BEARINGS = [98, 218, 338]
const RUN_W = 1.8, RUN_D = 1.1 // runway half-width and depth
/**
 * One ring of the shaft's section at height z, counter-clockwise from above:
 * a circle with three rectangular runways cut into it. Each point carries
 * whether it lies on the round surface (smooth) or a runway's flat faces.
 */
function shaftRing(z: number): { p: V3; round: boolean }[] {
  const R = shaftR(z), out: { p: V3; round: boolean }[] = []
  const runs = RUN_BEARINGS.map((b) => (90 - b) * D2R).map((a) => ((a % TAU) + TAU) % TAU).sort((x, y) => x - y)
  const dl = Math.asin(RUN_W / R)
  for (let i = 0; i < 3; i++) {
    const a = runs[i], next = runs[(i + 1) % 3] + (i === 2 ? TAU : 0)
    const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const ro = Math.sqrt(R * R - RUN_W * RUN_W), ri = ro - RUN_D
    const at = (u: number, v: number): V3 => add(add(mul(d, u), mul(e, v)), [0, 0, z])
    out.push({ p: at(ro, -RUN_W), round: false }, { p: at(ri, -RUN_W), round: false },
      { p: at(ri, RUN_W), round: false }, { p: at(ro, RUN_W), round: false })
    // The round face between this runway and the next.
    const s0 = a + dl, s1 = next - dl, N = 9
    for (let k = 0; k <= N; k++) out.push({ p: P(R, s0 + ((s1 - s0) * k) / N, z), round: true })
  }
  return out
}
{
  const levels = [0, 60, SHAFT_TOP]
  const rings = levels.map(shaftRing)
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [A[i].p, A[j].p, B[j].p, B[i].p]
      if (A[i].round && A[j].round) {
        // Radial, tilted up by the taper.
        const rn = (p: V3): V3 => { const r = Math.hypot(p[0], p[1]); return unit([p[0] / r, p[1] / r, 0.0413]) }
        face(concrete, q, q.map(rn))
      } else {
        const t = sub(A[j].p, A[i].p), nOut = unit([t[1], -t[0], 0])
        // The runway's back wall (the second of its four points) is the
        // pale steel lining the photos show between the two rails.
        const back = !A[i].round && !A[j].round && i % 14 === 1
        flat(back ? white : concrete, q, nOut)
      }
    }
  }
}

// -------------------------------------------------- the Yellow Bug cabs ---
/** Each cab parks at a different height, as the three run independently. */
const CAB_Z = [STREET + 13.2, 66, 104]
RUN_BEARINGS.forEach((b, i) => {
  const a = (90 - b) * D2R, z0 = CAB_Z[i], z1 = z0 + 5
  const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
  const R = shaftR(z0 + 2.5), back = Math.sqrt(R * R - RUN_W * RUN_W) - RUN_D + 0.1, front = R + 1.0
  box(yellow, mul(d, (back + front) / 2), d, e, (front - back) / 2, 1.6, z0, z1)
  // The cab's glass front.
  const f = front + 0.05
  flat(win, [add(mul(d, f), add(mul(e, -1.2), [0, 0, z0 + 1.3])), add(mul(d, f), add(mul(e, 1.2), [0, 0, z0 + 1.3])),
    add(mul(d, f), add(mul(e, 1.2), [0, 0, z1 - 0.6])), add(mul(d, f), add(mul(e, -1.2), [0, 0, z1 - 0.6]))], d)
})

// ---------------------------------------------------------------- the pod ---
const K = 48
const POD_FOOT = 122.5, RIM = 133.5
// The collar and ribbed underside, bottom to the wall's foot.
lathe([
  [5.0, 113.2], [5.5, 115.6], [6.5, 117.4], [7.9, 118.6], [9.5, 119.4], // collar
  [14.6, 121.8], [15.1, 122.05], [15.3, POD_FOOT],                      // underside, lip
], () => concrete, K, 35)
// The leaning wall: white, window, white, window, white.
{
  const rAt = (z: number) => 15.3 + ((z - POD_FOOT) / (RIM - POD_FOOT)) * 1.7
  const Z = [POD_FOOT, 124.4, 127.4, 129.0, 131.9, RIM - 0.25]
  const prof: [number, number][] = Z.map((z) => [rAt(z), z])
  prof.push([17.05, RIM], [16.8, RIM + 0.15], [15.0, RIM + 0.15]) // rim cap and open deck
  lathe(prof, (b) => (b === 1 || b === 3 ? win : white), K, 30)
}
// The inner observation deck's glazing, leaning in, and its roof.
lathe([[15.0, RIM + 0.15], [14.7, 136.4]], () => win, K)
lathe([[14.7, 136.4], [14.9, 136.6], [14.8, 136.9], [6.2, 140.0]], (b) => (b < 2 ? white : concrete), K, 40)
// The copper drum, its cap and the mast's footing.
lathe([[6.2, 140.0], [5.5, 140.1], [5.5, 144.6], [5.3, 145.0], [1.2, 145.2]], (b) => (b === 0 ? white : copper), 32, 50)
lathe([[1.2, 145.2], [0.95, 146.2], [0.3, 160.2], [0, 161.2]], () => concrete, 6, 60)

// Ribs under the dish: radial plates from the collar to the lip.
{
  const N = 36, T = 0.18
  const dishZ = (r: number) => 119.4 + ((r - 9.5) / (14.6 - 9.5)) * 2.4
  for (let i = 0; i < N; i++) {
    const a = ((i + 0.5) / N) * TAU
    const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const A = (r: number, z: number, s: number): V3 => add(add(mul(d, r), mul(e, s * T)), [0, 0, z])
    const r0 = 9.6, r1 = 14.5, b0 = dishZ(r0) - 0.5, b1 = dishZ(r1) - 0.35
    flat(concrete, [A(r0, b0, 1), A(r1, b1, 1), A(r1, dishZ(r1) + 0.05, 1), A(r0, dishZ(r0) + 0.05, 1)], e)
    flat(concrete, [A(r0, b0, -1), A(r0, dishZ(r0) + 0.05, -1), A(r1, dishZ(r1) + 0.05, -1), A(r1, b1, -1)], mul(e, -1))
    const nb = unit(cross(sub(A(r1, b1, 1), A(r0, b0, 1)), e))
    flat(concrete, [A(r0, b0, -1), A(r1, b1, -1), A(r1, b1, 1), A(r0, b0, 1)], dot(nb, [0, 0, -1]) > 0 ? nb : mul(nb, -1))
  }
}

// ------------------------------------------------------------- the lamps ---
for (let i = 0; i < 40; i++) bead(lamp, P(16.9, (i / 40) * TAU, RIM + 0.75), 0.35)
for (let i = 0; i < 16; i++) bead(lamp, P(5.7, (i / 16) * TAU, 145.4), 0.3)
for (let k = 0; k < 9; k++) {
  const z = 147 + k * 1.6, r = 0.95 + (z - 146.2) * ((0.3 - 0.95) / 14) + 0.2
  for (const a of [0, Math.PI / 2, Math.PI, 1.5 * Math.PI]) bead(lamp, P(r, a + Math.PI / 4, z), 0.28)
}

// ---------------------------------------------------- the base building ---
/** OSM outlines in metres from the tower's axis (x east, y north). */
const BASE: [number, number][] = [ // way/241004782, the two-storey block
  [33.1, 6.9], [0.9, 30.4], [-35.6, 14.3], [-39.1, -17.7], [-43.3, -56.5], [-45.6, -77.4],
  [-13.4, -100.9], [23.1, -84.8], [29.0, -30.8],
]
const CORE: [number, number][] = [ // way/241004780, the raised theatre block
  [-5.1, -17.5], [-21.4, -24.7], [-27.2, -77.8], [-12.9, -88.3], [3.5, -81.0], [9.3, -28.0],
]
const EAST: [number, number][] = [[40.6, 1.4], [33.1, 6.9], [29.0, -30.8], [37.4, -27.0]] // way/241004773
const SW: [number, number][] = [ // way/241004768
  [-58.3, -68.1], [-57.2, -68.9], [-54.7, -70.7], [-45.6, -77.4], [-43.3, -56.5], [-56.8, -55.0],
]
const ccw2 = (r: [number, number][]) => {
  let s = 0
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] }
  return s > 0 ? r : [...r].reverse()
}
/** Push a convex ring outward by `o` metres (mitred). */
function offset(r: [number, number][], o: number): [number, number][] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const n1 = unit([p[1] - a[1], -(p[0] - a[0]), 0]), n2 = unit([b[1] - p[1], -(b[0] - p[0]), 0])
    const m = unit(add(n1, n2)), k = o / Math.max(0.5, dot(m, n1))
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
/** Walls of a ring between two heights in one part, faces outward. */
function walls(p: Part, ring: [number, number][], z0: number, z1: number, inset = 0) {
  const r = inset ? offset(ring, -inset) : ring
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    // Split long walls so the map's drape can bend their feet.
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = z0 < 1 ? Math.max(1, Math.ceil(L / 5)) : 1
    for (let k = 0; k < m; k++) {
      const t0 = k / m, t1 = (k + 1) / m
      const A: V3 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, 0], B: V3 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1, 0]
      flat(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], n)
    }
  }
}
const ring3 = (r: [number, number][], z: number): V3[] => r.map(([x, y]) => [x, y, z])
{
  const base = ccw2(BASE), ROOF = 23.0, FASCIA = 18.4
  walls(concrete, base, 0, STREET)
  walls(win, base, STREET, 14.0, 0.6)          // ground-floor glazing, set back under the canopy
  walls(white, base, 14.0, 15.3)                // cream canopy band
  walls(win, base, 15.3, FASCIA, 0.3)           // dark upper band
  // Under the set-back bands, close the gaps with soffits.
  const in6 = offset(base, -0.6), in3 = offset(base, -0.3)
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length
    flat(white, [[base[i][0], base[i][1], 14.0], [in6[i][0], in6[i][1], 14.0], [in6[j][0], in6[j][1], 14.0], [base[j][0], base[j][1], 14.0]], [0, 0, -1])
    flat(white, [[base[i][0], base[i][1], STREET], [base[j][0], base[j][1], STREET], [in6[j][0], in6[j][1], STREET], [in6[i][0], in6[i][1], STREET]], [0, 0, 1])
    flat(white, [[in3[i][0], in3[i][1], 15.3], [base[i][0], base[i][1], 15.3], [base[j][0], base[j][1], 15.3], [in3[j][0], in3[j][1], 15.3]], [0, 0, 1])
  }
  // The taupe fascia overhangs the walls by 0.8 m.
  const fas = offset(base, 0.8)
  walls(concrete, fas, FASCIA, ROOF)
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length, q = offset(base, -0.3)
    flat(concrete, [[q[i][0], q[i][1], FASCIA], [q[j][0], q[j][1], FASCIA], [fas[j][0], fas[j][1], FASCIA], [fas[i][0], fas[i][1], FASCIA]], [0, 0, -1])
  }
  concrete.cap(ring3(fas, ROOF), true)
  const core = ccw2(CORE)
  walls(concrete, core, ROOF - 0.2, 24.5)
  concrete.cap(ring3(core, 24.5), true)
  for (const wing of [EAST, SW]) {
    const w = ccw2(wing)
    walls(concrete, w, 0, 11.6)
    walls(win, w, 11.6, 13.4, 0.2)
    walls(concrete, w, 13.4, 15.2)
    concrete.cap(ring3(w, 15.2), true)
  }
}

// ---------------------------------------------------------------- output ---
// Concrete: the shaft's weathered warm grey (#b9b4aa in daylight), pulled a
// little lighter; it doubles as the base's taupe fascia, which photos show
// a shade darker. The pod's bands are near-white; the drum bright copper; the
// cabs the Yellow Bugs' yellow, pulled to the palette's lightness.
const shaftLit = (p: V3, n: V3): number => {
  const r = Math.hypot(p[0], p[1])
  if (p[2] < 27 && r > 10) return 0 // the base is not floodlit
  if (p[2] > 145.5) return 0
  if (p[2] < 117) return (n[2] > 0.7 ? 0.3 : 1) * (1 - 0.3 * Math.min(1, p[2] / 117))
  return n[2] < -0.2 ? 0.9 : 0.6 // the underside, lit from below
}
const podLit = (p: V3, n: V3): number => (p[2] < 27 ? 0 : p[2] < 137 ? (n[2] > 0.7 ? 0.4 : 0.8) : 0)
const parts = [
  { part: concrete, material: { ...finish('skylon-concrete', 0xc8c2b6), floodlight: shaftLit } },
  { part: white, material: { ...PALETTE.trim, floodlight: podLit } },
  { part: win, material: PALETTE.window },
  { part: copper, material: finish('skylon-copper', 0xc98f6c) },
  { part: yellow, material: finish('skylon-yellow', 0xe8c94a) },
  { part: lamp, material: finish('lamp', 0xd9d4c8) },
]
// The map stands the model on the lowest Mapterhorn point of a 7 x 7 grid
// over its plan extent, 181.1 m, 1.9 m under the lidar's 183.0 at the
// footprint's corner. Raise everything off the ground by that much, so the
// tower, the pod and the base roofs land at their lidar heights on the map;
// only the base walls' feet stay at y = 0. (glTF frame here: index 1 is up.)
const LIFT = 1.9
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 0.01) part.pos[i] += LIFT
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Skylon Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 161.2 + LIFT,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/niagara-skylon-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
