/**
 * Baku TV Tower (Bakı Televiziya Qülləsi), Baku: procedural, CC0-1.0.
 * bun generators/baku-tv-tower.ts   (writes the low model and the detail model)
 *
 * A free-standing reinforced-concrete telecommunications tower on the hill
 * above the city, designed by the USSR Ministry of Communications' state
 * design institute, built 1979-1996; the revolving restaurant opened in 2008.
 *
 * Identity, in order: the tall white concrete shaft, tapering, standing on a
 * crown of pointed (lancet) pilasters at its foot; the pod, four white tiers
 * that step out as they rise, each with a dark window band on its sloping
 * underside, under a squat white dome ringed with small windows; the
 * antenna cage round a short neck and the wide antenna platform over it;
 * the mast in red and white bands with three small platforms; at night the
 * whole concrete body floodlit in one colour (blue, yellow-green or the flag).
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin: the centre of the shaft, the centroid of OSM way/1375055411
 * (49.823362, 40.351555). y = 0 is the lowest ground under the footprint.
 *
 * Evidence (Wikimedia Commons):
 * - p1 https://commons.wikimedia.org/wiki/File:Baku_Botanical_Garden_60_(cropped).jpg
 *   Interfase, CC BY-SA 4.0 (2025-01-26): the whole tower, daylight,
 *   telephoto. Every proportion below is measured on it: tiers, dome,
 *   neck, platforms, the mast's bands, the lancet pilasters, the shaft's
 *   taper and its slit windows.
 * - p2 https://commons.wikimedia.org/wiki/File:Central_Park,_Baku,_May_2019_19.jpg
 *   Aykhan Zayedzadeh, CC BY-SA 4.0: daylight from the north-east, the pod
 *   and mast; colours in sun.
 * - p3 https://commons.wikimedia.org/wiki/File:Baku_Botanical_Garden_13.jpg
 *   Press Service of the President of the Republic of Azerbaijan, CC BY 4.0:
 *   from the west over the new botanical garden, proportions at a distance.
 * - p4 https://commons.wikimedia.org/wiki/File:Sabayil,_Baku,_Azerbaijan_-_panoramio_(1).jpg
 *   Galen Anderson, CC BY-SA 3.0: night, the whole body floodlit blue.
 * - p5 https://commons.wikimedia.org/wiki/File:Baku_Bulvar9.JPG
 *   Frokor, CC BY-SA 3.0: night, floodlit yellow-green, mast lights red.
 * - p6 https://commons.wikimedia.org/wiki/File:Entrance_of_Martyrs%27_Lane,_Baku.jpg
 *   Bernard Gagnon, CC BY 4.0: daylight from the north-east, colours.
 * - OSM (OSM API, 2026-11): way/1375055417 man_made=communications_tower
 *   area (height 310; a 43 m circle round the foot), building:parts
 *   way/1375055411 shaft (0-141, concrete, 14.3 m across at the foot),
 *   way/1375055409 pod (141-171, 37.9 m), way/1375055410 (171-192, metal),
 *   way/1375055412..16 the antenna sections (192-200, 200-220.7,
 *   220.7-243 red, 243-268 red, 268-310 red), way/1375091334 the low
 *   building the foot stands in (no height).
 * - Published: 310 m (Wikipedia en/ru); roof 226 m (ru Wikipedia infobox);
 *   revolving restaurant opened 2008, "175 m" (en/ru Wikipedia); lit in
 *   flag colours on holidays (en Wikipedia).
 * - Mapterhorn terrain (z12 only here): the ground rises about 5 m across
 *   the foot to the south and 7 m more under the low building; the map
 *   sinks the uphill side. No lidar or NAIP (outside the US).
 * - Look-only references: none. (Commons "File:Телебашня.jpg", linked from
 *   ru Wikipedia, is the Tashkent tower and was not used.)
 *
 * Numbers. Scale from p1: tip 310 m (published) and the pod's underside at
 * 141 m (OSM) give 0.277 m per pixel, which puts the hidden foot about
 * 50 px below the building in front; the shaft's width there then measures
 * 13.4 m against OSM's 14.3 m, which agrees. Measured (p1, +-0.5 m):
 * - shaft r 6.9 at the foot to r 5.1 under the pod (estimated straight
 *   taper between the two measured widths);
 * - lancet pilasters to 32.5 m, standing 2.3 m proud of the shaft; eight
 *   of them (estimated: p1 shows two at the edges and the shaft between,
 *   which fits four or eight; no open photo shows the foot close up);
 * - tiers (bottom to top), each a white frieze of vertical fins over a
 *   recessed glazed band under it: friezes r 8.15 (141-146), r 10.75
 *   (147-150.3), r 14.3 (153.1-156.4), r 16.75 (159.7-165.4); glazed
 *   bands r 7.6 (146-147), r 10.4 (150.3-153.1), r 14.0 (156.4-159.7);
 *   the top tier's fins stand 0.7 m above its parapet round the dome's foot
 *   (p1 zoomed). OSM's 37.9 m pod is wider than p1's 33.5 m (outlines of
 *   tall things traced on imagery lean); p1 is used;
 * - dome r 12.8 at 164.6 m to the neck at 176 m, with 16 small windows;
 * - neck r 4.8 to the antenna platform at 186-187.6 m, r 9.35;
 * - mast bands (from p1, compressed 2.7% so the tip lands on 310 m): white
 *   to 201.5, red to 211.5, white to 221, platform, white to 229, red to
 *   243.5, white to 257.5, platform, red to 268, white to 278, platform,
 *   the thin top mast to 297.5, a small ring, the tip at 310 m. These match
 *   OSM's 200 / 220.7 / 243 / 268 splits within 2 m.
 * - The published restaurant height (175 m) is the dome's top here; p1
 *   can't fit the tiers that high with the foot anywhere near the ground,
 *   so the photo is followed and the conflict is noted.
 * - The low building (way/1375091334): 10 m, two storeys (estimated; it is
 *   only seen in p1 as a white roof line at the tower's foot).
 * Colours: concrete a cool white #e6edf2 (p1, p2, p6: white under grey and
 * blue skies; not grey); the pod's glazed bands pale grey-blue #9fb1c0
 * (`window-2`; p1 reads them light behind their white fins), the friezes'
 * undersides and the small windows the palette's slate `window`; mast red #c64f4b (p1, p2 #b58ca2 hazed, pulled to a
 * signal red at the palette's lightness), mast white #e3e6e8.
 *
 * Night: the concrete body is `neon-tv-concrete`, so it glows in its own
 * colour, a pale blue-white, as the floodlit tower does (the real colour
 * changes: blue in p4, yellow-green in p5, the flag on holidays; one fixed
 * colour can only stand for them). The pod's glazed bands (`window-2`), the
 * dome's windows and the slit windows (`window`) glow warm. The mast is unlit paint.
 *
 * Detail model (models/baku-tv-tower.detail.glb, from zoom 16): finer
 * lathes, frieze fins every 1.6 m (3 m in the low model), mullion fins in
 * the glazed bands, the grilles in the lancet panels as
 * bars, the antenna cage as a lattice of posts, rings and braces with the
 * panel antennas on it, railings round the platforms, ladders' worth of
 * slit windows on the shaft.
 *
 * Doubts: the number of lancet pilasters (eight, estimated) and their plan;
 * the low building's height and its relation to the foot; the pod sizes
 * rest on one telephoto photo (p1), checked against p2 and p3 only at
 * small size; the antenna cage's members are schematic.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

export const ANCHOR: [number, number] = [49.823362, 40.351555]
const TAU = Math.PI * 2
const KX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), KY = 110574

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** A quad wound to face the way its normals say. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, Q: V3[], n: V3) => face(p, Q, [n, n, n, n])

/**
 * A surface of revolution from [r, z] points, outside on the profile's
 * left (walls go up, roofs go in, undersides go out). Bands meeting at
 * under `smooth` degrees share normals. `pick(b)` picks each band's part.
 */
function lathe(profile: [number, number][], pick: (b: number) => Part | null, k: number, smooth = 35, a0 = 0) {
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
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const u0 = a0 + (s / k) * TAU, u1 = a0 + ((s + 1) / k) * TAU
      const q = [P(r0, u0, z0), P(r0, u1, z0), P(r1, u1, z1), P(r1, u0, z1)]
      const nn = [N(n0, u0), N(n0, u1), N(n1, u1), N(n1, u0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** A closed solid box between two points with a square section of side w (a strut). */
function strut(p: Part, a: V3, b: V3, w: number, h = w) {
  const d = unit(sub(b, a))
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = mul(unit(cross(d, ref)), w / 2), v = mul(unit(cross(d, unit(cross(d, ref)))), h / 2)
  const c = (o: V3, i: number): V3 => add(add(o, mul(u, i & 1 ? 1 : -1)), mul(v, i & 2 ? 1 : -1))
  const A = [0, 1, 3, 2].map((i) => c(a, i)), B = [0, 1, 3, 2].map((i) => c(b, i))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const q = [A[i], A[j], B[j], B[i]]
    const mpt = mul(add(add(A[i], A[j]), add(B[i], B[j])), 0.25), ctr = mul(add(a, b), 0.5)
    flat(p, q, unit(sub(mpt, ctr)))
  }
  flat(p, A, mul(d, -1))
  flat(p, B, d)
}

/** A box from a centre, two horizontal unit axes and half sizes. */
function box(p: Part, c: V3, ex: V3, ey: V3, hx: number, hy: number, z0: number, z1: number) {
  const at = (i: number, j: number, z: number): V3 => [c[0] + ex[0] * i * hx + ey[0] * j * hy, c[1] + ex[1] * i * hx + ey[1] * j * hy, z]
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = corners[k], [i1, j1] = corners[(k + 1) % 4]
    const n = unit(add(mul(ex, (i0 + i1) / 2), mul(ey, (j0 + j1) / 2)))
    flat(p, [at(i0, j0, z0), at(i1, j1, z0), at(i1, j1, z1), at(i0, j0, z1)], n)
  }
  flat(p, corners.map(([i, j]) => at(i, j, z1)), [0, 0, 1])
  flat(p, corners.map(([i, j]) => at(i, j, z0)), [0, 0, -1])
}

// ---- Heights and radii (see the header) --------------------------------------------------------------
const SHAFT_R0 = 6.9, SHAFT_R1 = 5.1, POD_Z = 141
const shaftR = (z: number) => SHAFT_R0 + (SHAFT_R1 - SHAFT_R0) * (z / POD_Z)
/**
 * Tiers bottom to top (p1, zoomed): each a white frieze of vertical fins
 * (radius r, from zf to z1) over a recessed glazed band (radius rg, from z0
 * to zf) set back under it; the frieze's flat underside reads as the dark
 * line at its foot. The lowest tier has almost no glazed band of its own.
 */
const TIERS = [
  { rg: 7.6, r: 8.15, z0: 141.0, zf: 141.0, z1: 146.0 },
  { rg: 7.6, r: 10.75, z0: 146.0, zf: 147.0, z1: 150.3 },
  { rg: 10.4, r: 14.3, z0: 150.3, zf: 153.1, z1: 156.4 },
  { rg: 14.0, r: 16.75, z0: 156.4, zf: 159.7, z1: 165.4 },
]
/** The dome springs inside the top tier's parapet. */
const DOME_R = 12.8, DOME_Z0 = 164.6, NECK_R = 4.8, NECK_Z = 176, PLAT_Z = 186, PLAT_T = 1.6, PLAT_R = 9.35
const MAST_Z0 = PLAT_Z + PLAT_T
/** Mast sections: top, radius, colour. */
const MAST: { z: number; r: number; red: boolean }[] = [
  { z: 201.5, r: 2.1, red: false },
  { z: 211.5, r: 2.1, red: true },
  { z: 221, r: 2.1, red: false },
  { z: 229, r: 1.7, red: false },
  { z: 243.5, r: 1.7, red: true },
  { z: 257.5, r: 1.7, red: false },
  { z: 268, r: 1.4, red: true },
  { z: 278, r: 1.4, red: false },
  { z: 297.5, r: 0.8, red: false },
  { z: 310, r: 0.4, red: false },
]
/** Mast platforms: height, radius. */
const MAST_PLATFORMS: [number, number][] = [[221, 5.2], [257.5, 5.2], [278, 3.8], [297.5, 1.95]]
const LANCETS = 8, LANCET_TOP = 32.5, LANCET_W = 2.2, LANCET_OUT = 2.3

// ---- Materials -----------------------------------------------------------------------------------------
const CONCRETE: MaterialSpec = finish('neon-tv-concrete', 0xe6edf2)
const WINDOW: MaterialSpec = PALETTE.window
// The pod's glazed bands read pale grey-blue behind their white fins (p1, p2): a lighter window.
const GLAZE: MaterialSpec = windowVariant(2, 0x9fb1c0)
const RED: MaterialSpec = finish('mast-red', 0xc64f4b)
const WHITE: MaterialSpec = finish('mast-white', 0xe3e6e8)
const STONE: MaterialSpec = PALETTE.stone

// The low building the foot stands in (way/1375091334), lon/lat.
const LOBBY_OSM = [[49.8232579, 40.3511832], [49.8234897, 40.3511821], [49.8235641, 40.3515999], [49.8231631, 40.351591]]
const LOBBY_H = 10

function lancetOutline(n: number, w: number, top: number): [number, number][] {
  // An equilateral pointed arch on jambs: (t, z), counter-clockwise from the bottom left.
  const rise = Math.sqrt(3) * w, zs = top - rise, out: [number, number][] = [[-w, 0], [w, 0]]
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * (Math.PI / 3) // right arc, centred at (-w, zs), radius 2w
    out.push([-w + 2 * w * Math.cos(a), zs + 2 * w * Math.sin(a)])
  }
  for (let i = n - 1; i >= 0; i--) {
    const a = (i / n) * (Math.PI / 3)
    out.push([w - 2 * w * Math.cos(a), zs + 2 * w * Math.sin(a)])
  }
  // Drop the duplicated apex.
  return out.filter((p, i) => i === 0 || Math.hypot(p[0] - out[i - 1][0], p[1] - out[i - 1][1]) > 1e-6)
}

export function build(detail: boolean) {
  const conc = new Part(), win = new Part(), glaze = new Part(), red = new Part(), white = new Part(), stone = new Part()
  const K = detail ? 48 : 24

  // The shaft, from the ground into the pod.
  const shaftProf: [number, number][] = []
  for (let z = 0; z <= POD_Z; z += POD_Z / 4) shaftProf.push([shaftR(z), z])
  lathe(shaftProf, () => conc, K)

  // The lancet pilasters at the foot: real solids with a recessed grille panel.
  const arcN = detail ? 8 : 4
  const outer = lancetOutline(arcN, LANCET_W, LANCET_TOP)
  const inset = 0.55, recess = 0.4
  const inner = lancetOutline(arcN, LANCET_W - inset, LANCET_TOP - inset * 1.7).map(([t, z]) => [t, z + inset] as [number, number])
  for (let f = 0; f < LANCETS; f++) {
    const a = (f / LANCETS) * TAU + Math.PI / LANCETS
    const er: V3 = [Math.cos(a), Math.sin(a), 0], et: V3 = [-Math.sin(a), Math.cos(a), 0]
    // The front face stands LANCET_OUT proud of the shaft at the springing.
    const rOut = (z: number) => shaftR(z) + LANCET_OUT
    const at = (t: number, z: number, d: number): V3 => add(add(mul(er, rOut(z) + d), mul(et, t)), [0, 0, z])
    const rIn = (z: number) => shaftR(z) - 0.6
    const back = (t: number, z: number): V3 => add(add(mul(er, rIn(z)), mul(et, t)), [0, 0, z])
    // Sides, following the outline.
    for (let i = 1; i < outer.length; i++) {
      const [t0, z0] = outer[i - 1], [t1, z1] = outer[i]
      const nrm = unit(add(mul(et, z1 - z0), mul([0, 0, 1], -(t1 - t0))))
      flat(conc, [at(t0, z0, 0), back(t0, z0), back(t1, z1), at(t1, z1, 0)], mul(nrm, -1))
    }
    // Front: the band between the outer and inner outlines, then the reveal, then the recessed panel.
    const m = outer.length
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m
      if (i === 0) {
        // Bottom edge: from the outer bottom corners to the inner ones.
        flat(conc, [at(outer[0][0], outer[0][1], 0), at(outer[1][0], outer[1][1], 0), at(inner[1][0], inner[1][1], 0), at(inner[0][0], inner[0][1], 0)], er)
        continue
      }
      flat(conc, [at(outer[i][0], outer[i][1], 0), at(outer[j][0], outer[j][1], 0), at(inner[j][0], inner[j][1], 0), at(inner[i][0], inner[i][1], 0)], er)
    }
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m
      const [t0, z0] = inner[i], [t1, z1] = inner[j]
      const nrm = unit(add(mul(et, -(z1 - z0)), mul([0, 0, 1], t1 - t0)))
      flat(conc, [at(t0, z0, 0), at(t1, z1, 0), at(t1, z1, -recess), at(t0, z0, -recess)], nrm)
    }
    // The recessed panel (a fan from its bottom centre; the lancet is convex).
    const c0 = at(0, inner[0][1], -recess)
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m
      const A = at(inner[i][0], inner[i][1], -recess), B = at(inner[j][0], inner[j][1], -recess)
      white.tri(c0, A, B, undefined, undefined, undefined, [er, er, er])
    }
    // The grille: horizontal bars across the panel (detail only).
    if (detail) {
      const zTop = inner.reduce((s, p) => Math.max(s, p[1]), 0)
      const halfAt = (z: number) => {
        let h = 0
        for (let i = 0; i < m; i++) {
          const [t0, z0] = inner[i], [t1, z1] = inner[(i + 1) % m]
          if ((z0 - z) * (z1 - z) <= 0 && z1 !== z0) h = Math.max(h, Math.abs(t0 + ((z - z0) / (z1 - z0)) * (t1 - t0)))
        }
        return h
      }
      for (let z = inner[0][1] + 1.1; z < zTop - 0.8; z += 1.1) {
        const h = halfAt(z) - 0.02
        if (h < 0.2) continue
        strut(conc, at(-h, z, -recess + 0.12), at(h, z, -recess + 0.12), 0.18, 0.22)
      }
      strut(conc, at(0, inner[0][1], -recess + 0.12), at(0, zTop - 0.2, -recess + 0.12), 0.22, 0.22)
    }
  }

  // The pod: four tiers stepping out as they rise, each a white finned frieze over a recessed glazed band.
  const podProf: [number, number][] = [[shaftR(POD_Z) - 0.01, POD_Z - 0.01]]
  const podMat: Part[] = []
  const push = (r: number, z: number, m: Part) => { podProf.push([r, z]); podMat.push(m) }
  for (const [k, t] of TIERS.entries()) {
    if (t.zf > t.z0) {
      if (k > 0) push(t.rg, t.z0, conc) // the roof of the tier below, in to the glazing
      push(t.rg, t.zf, glaze) // the glazed band
    }
    push(t.r, t.zf, win) // the frieze's flat underside, the dark line seen from below
    push(t.r, t.z1, conc) // the frieze
  }
  // The top tier's parapet, its inner face down to the roof, the roof in to the dome, the dome to the neck.
  const PAR = 0.8
  push(TIERS[3].r - 0.35, TIERS[3].z1, conc)
  push(TIERS[3].r - 0.35, DOME_Z0, conc)
  const domeN = detail ? 10 : 6
  for (let i = 0; i <= domeN; i++) {
    const a = (i / domeN) * (Math.PI / 2)
    // A dome from r DOME_R to the neck, steep at its foot (p1).
    const r = NECK_R + (DOME_R - NECK_R) * Math.cos(a)
    const z = DOME_Z0 + (NECK_Z - DOME_Z0) * Math.pow(Math.sin(a), 0.85)
    push(r, z, conc)
  }
  void PAR
  push(NECK_R, PLAT_Z, conc)
  lathe(podProf, (b) => podMat[b], K, 30, Math.PI / K)

  // Dome windows: a ring of 16 small square panels set just proud of the dome near its foot.
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU + Math.PI / 16
    const za = DOME_Z0 + 1.6, zb = DOME_Z0 + 3.3
    const ang = (z: number) => Math.asin(Math.pow((z - DOME_Z0) / (NECK_Z - DOME_Z0), 1 / 0.85))
    const rr = (z: number) => NECK_R + (DOME_R - NECK_R) * Math.cos(ang(z)) + 0.06
    const hw = 0.8 / rr(za)
    const nrm = unit([Math.cos(a), Math.sin(a), 0.35])
    flat(win, [P(rr(za), a - hw, za), P(rr(za), a + hw, za), P(rr(zb), a + hw, zb), P(rr(zb), a - hw, zb)], nrm)
  }

  // Frieze ribs on the tiers (detail): thin vertical fins standing 0.25 m proud.
  // The ribs: every 1.6 m in the detail model, every 3 m in the low one; the
  // top tier's stand 0.9 m above its parapet, the crown of fins round the
  // dome's foot in p1.
  for (const [k, t] of TIERS.entries()) {
    const n = Math.round((TAU * t.r) / (detail ? 1.6 : 3))
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      const er: V3 = [Math.cos(a), Math.sin(a), 0]
      box(conc, mul(er, t.r + 0.1), er, [-er[1], er[0], 0], 0.14, detail ? 0.12 : 0.2, t.zf + 0.3, k === 3 ? t.z1 + 0.7 : t.z1 - 0.1)
      if (detail) {
        // Mullion fins in the glazed band under it.
        if (t.zf - t.z0 > 0.5 && i % 2 === 0) {
          const ar = (i / n) * TAU
          const eg: V3 = [Math.cos(ar), Math.sin(ar), 0]
          box(white, mul(eg, t.rg + 0.25), eg, [-eg[1], eg[0], 0], 0.25, 0.1, t.z0, t.zf)
        }
      }
    }
  }
  if (detail) {
    // Slit windows on the shaft: pairs at five levels, four sides (p1).
    for (const z of [38, 62, 86, 104, 122]) {
      for (let s = 0; s < 4; s++) {
        for (const d of [-0.32, 0.32]) {
          const a = (s / 4) * TAU + d / shaftR(z) * 3
          const r = shaftR(z) + 0.04
          const hw = 0.3 / r
          flat(win, [P(r, a - hw, z), P(r, a + hw, z), P(r, a + hw, z + 2.2), P(r, a - hw, z + 2.2)], [Math.cos(a), Math.sin(a), 0])
        }
      }
    }
  }

  // The antenna cage round the neck: posts on the dome to the platform, rings, braces, panel antennas.
  const cageR = 6.6, posts = detail ? 12 : 6
  const cageZ0 = NECK_Z - 1.2
  for (let i = 0; i < posts; i++) {
    const a = (i / posts) * TAU
    strut(white, P(cageR, a, cageZ0), P(cageR, a, PLAT_Z), detail ? 0.35 : 0.6)
    if (detail) {
      const b = ((i + 1) / posts) * TAU
      for (const [z0, z1] of [[cageZ0, (cageZ0 + PLAT_Z) / 2], [(cageZ0 + PLAT_Z) / 2, PLAT_Z]] as [number, number][]) {
        strut(white, P(cageR, a, z0), P(cageR, b, z1), 0.18)
        strut(white, P(cageR, a, z1), P(cageR, b, z1), 0.22)
      }
      // Arms back to the neck at mid-height.
      strut(white, P(NECK_R, a, (cageZ0 + PLAT_Z) / 2), P(cageR, a, (cageZ0 + PLAT_Z) / 2), 0.22)
    }
    // Panel antennas hung on the posts (two levels in detail, one in the low model).
    const er: V3 = [Math.cos(a + Math.PI / posts), Math.sin(a + Math.PI / posts), 0]
    const levels = detail ? [[cageZ0 + 1.2, cageZ0 + 4.2], [cageZ0 + 5.6, cageZ0 + 8.6]] : [[cageZ0 + 2, cageZ0 + 8]]
    for (const [z0, z1] of levels) box(white, mul(er, cageR + 0.15), er, [-er[1], er[0], 0], 0.2, detail ? 0.45 : 0.9, z0, z1)
  }
  if (!detail) lathe([[cageR + 0.3, cageZ0 + 4.6], [cageR + 0.3, cageZ0 + 5.3], [cageR - 0.3, cageZ0 + 5.3], [cageR - 0.3, cageZ0 + 4.6], [cageR + 0.3, cageZ0 + 4.6]], () => white, 12)

  // The antenna platform: a wide flat drum with a bevelled rim.
  lathe([[NECK_R, PLAT_Z], [PLAT_R - 0.4, PLAT_Z], [PLAT_R, PLAT_Z + 0.4], [PLAT_R, PLAT_Z + PLAT_T - 0.3], [PLAT_R - 0.3, PLAT_Z + PLAT_T], [0, PLAT_Z + PLAT_T]], () => white, K, 50)

  // The mast: banded cylinders.
  const MK = detail ? 16 : 10
  let z0 = MAST_Z0, r0 = MAST[0].r
  for (const s of MAST) {
    const part = s.red ? red : white
    const last = s === MAST[MAST.length - 1]
    if (s.r !== r0) {
      // A step in: a little roof from the old radius to the new one.
      lathe([[r0, z0], [s.r, z0]], () => white, MK)
    }
    lathe(last ? [[s.r, z0], [0.15, s.z], [0, s.z]] : [[s.r, z0], [s.r, s.z]], () => part, MK)
    z0 = s.z; r0 = s.r
  }
  // Mast platforms.
  for (const [z, r] of MAST_PLATFORMS) {
    const rm = MAST.find((m) => m.z > z + 0.01)?.r ?? 0.5
    lathe([[rm, z - 0.6], [r, z - 0.2], [r, z + 0.3], [rm, z + 0.3]], () => white, MK, 20)
    if (detail) {
      // Railing: posts and a top rail.
      const n = Math.max(8, Math.round((TAU * r) / 1.4))
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
        strut(white, P(r - 0.15, a, z + 0.3), P(r - 0.15, a, z + 1.4), 0.08)
        strut(white, P(r - 0.15, a, z + 1.4), P(r - 0.15, b, z + 1.4), 0.1)
      }
    }
  }
  // Railing round the antenna platform (detail).
  if (detail) {
    const n = Math.round((TAU * PLAT_R) / 1.4)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, b = ((i + 1) / n) * TAU, z = PLAT_Z + PLAT_T
      strut(white, P(PLAT_R - 0.2, a, z), P(PLAT_R - 0.2, a, z + 1.2), 0.1)
      strut(white, P(PLAT_R - 0.2, a, z + 1.2), P(PLAT_R - 0.2, b, z + 1.2), 0.12)
    }
  }

  // The low building at the foot: a plain two-storey block with one window ribbon.
  const lob = LOBBY_OSM.map(([lo, la]) => [(lo - ANCHOR[0]) * KX, (la - ANCHOR[1]) * KY] as [number, number])
  const area = lob.reduce((s, a, i) => { const b = lob[(i + 1) % lob.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const ring = area < 0 ? [...lob].reverse() : lob
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const n: V3 = [uy, -ux, 0]
    flat(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], LOBBY_H], [a[0], a[1], LOBBY_H]], n)
    // Ribbon windows, stopped short of the corners and of the tower's foot.
    const w0 = 1.2, w1 = L - 1.2
    const segs: [number, number][] = []
    // Skip the stretch of the north wall the tower's foot covers.
    const nearTower = (s: number) => Math.hypot(a[0] + ux * s, a[1] + uy * s) < SHAFT_R0 + LANCET_OUT + 1.5
    let s0: number | null = null
    for (let s = w0; s <= w1 + 1e-6; s += 0.25) {
      const ok = !nearTower(s)
      if (ok && s0 === null) s0 = s
      if ((!ok || s + 0.25 > w1 + 1e-6) && s0 !== null) { segs.push([s0, ok ? s : s - 0.25]); s0 = null }
    }
    for (const [sa, sb] of segs) {
      if (sb - sa < 2) continue
      const p0: [number, number] = [a[0] + ux * sa + n[0] * 0.05, a[1] + uy * sa + n[1] * 0.05]
      const p1: [number, number] = [a[0] + ux * sb + n[0] * 0.05, a[1] + uy * sb + n[1] * 0.05]
      for (const [za, zb] of [[1.4, 3.8], [5.8, 8.4]]) flat(win, [[p0[0], p0[1], za], [p1[0], p1[1], za], [p1[0], p1[1], zb], [p0[0], p0[1], zb]], n)
    }
  }
  stone.cap(ring.map(([x, y]) => [x, y, LOBBY_H] as V3), true)

  return [
    { part: conc, material: CONCRETE },
    { part: win, material: WINDOW },
    { part: glaze, material: GLAZE },
    { part: red, material: RED },
    { part: white, material: WHITE },
    { part: stone, material: STONE },
  ]
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['baku-tv-tower.glb', false, 6500, 250 * 1024],
    ['baku-tv-tower.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Baku TV Tower', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor', anchor: ANCHOR, bearing: 0, height: 310 })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
