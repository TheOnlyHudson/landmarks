/**
 * SOCAR Tower, Baku: procedural, CC0-1.0.
 * bun generators/baku-socar-tower.ts   (writes the low model and the detail model)
 *
 * The State Oil Company of Azerbaijan's headquarters on Heydar Aliyev
 * Avenue (Heerim Architects, built 2010-2016): 209 m, a glass tower whose
 * shape is meant as a flame, on a curved podium to its west.
 *
 * Identity, in order: two glass wings side by side, the north-east one
 * stopping at about 116 m in a raking top with a fin at its outer edge, the
 * main one rising on alone; the main wing's S-curve from the north-west
 * (a straight lower body, a waist at 115-135 m, a swollen upper body about
 * as wide as the base at 155-170 m, then an ogive drawing in to a point
 * that leans to the north-east); blue-teal glass with pale floor lines; the
 * maintenance crane on the tip; the low curved podium.
 *
 * Map frame: built turned, bearing 146.7: local +y runs along the OSM
 * outline's short side toward bearing 146.7 (SSE) and local +x along its
 * long side toward 236.7 (SW). Origin: the centroid of OSM way/357399633
 * (49.883650, 40.405454). y = 0 is the lowest ground under the footprint.
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Rail_yard,_Baku_(P1090216).jpg
 *   Matti Blume, CC BY-SA 4.0 (2019-07-14), camera 1.3 km at bearing 317
 *   (Commons coordinates): the whole tower from the north-west, telephoto.
 *   The silhouette table below is measured on it.
 * - p2 https://commons.wikimedia.org/wiki/File:Rail_yard,_Baku_(P1090213).jpg
 *   Matti Blume, CC BY-SA 4.0, same place: the crown and the glass colour.
 * - p3 https://commons.wikimedia.org/wiki/File:Rail_yard,_Baku_(P1090215).jpg
 *   Matti Blume, CC BY-SA 4.0, same place, at a distance.
 * - p4 https://commons.wikimedia.org/wiki/File:Baku_Panorama_from_Hotel.jpg
 *   Sefer azeri, CC BY-SA 4.0: from the south-west over the Heydar Aliyev
 *   Center, far off: the upper body swells and leans from that side too.
 * - p5 https://commons.wikimedia.org/wiki/File:Built_SOCAR_tower_with_podium.jpg
 *   Vita86, CC BY-SA 3.0 (2013-05, under construction): the podium's
 *   curved drum west of the tower and its height against the floors.
 * - p6 https://commons.wikimedia.org/wiki/File:SOCAR_tower.jpg
 *   Vita86, CC BY-SA 3.0 (2013-08, under construction): floor plates and
 *   the first glass, from the avenue.
 * - OSM (OSM API, 2026-11): way/357399633 the tower (height 209, 40
 *   levels; a 42.8 x 40.5 m rectangle, the plan at the foot), way/357399623
 *   the podium (6 levels, no height).
 * - Published: 209 m, 42 storeys, completed 2016 (Wikipedia "SOCAR Tower").
 * - Mapterhorn terrain (z12): the site is flat within 1-3 m.
 * - No lidar or NAIP (outside the US). Look-only references: none.
 *
 * Numbers. Heights published (209 m tip). Silhouette re-measured on p1
 * (lead review round 1) by scanning its edges row by row: 0.3585 m per
 * pixel from 209 m over the visible height; the view looks along bearing
 * 137, 10 degrees off local +y, so the plan's depth adds about 3.3 m to
 * each side; that is taken off. Main body edges in local x (- north-east,
 * + south-west):
 *   z   0-43: -21.4 / 21.4 (the OSM outline)   z 72: -20.5 / 19.5
 *   z 93: -17.5 / 18.4   z 108: -17 / 19.8   z 136: -18 / 23.6
 *   z 151: -18.2 / 24 (the subtle swell)   z 165: -20.2 / 21
 *   z 172: -20.2 / 17   z 179: -18.8 / 11.8   z 186: -16 / 6.4
 *   z 193: -12.8 / 4.2   z 200: -9.2 / 2.2   tip 209 at -5:
 * a narrow ogive from about 160 m to a sharp tip leaning north-east.
 * The north-east wing: a slim raking glass blade 3 m thick and 18 m wide
 * standing off the north-east face, its outer face the left edge of the
 * silhouette in p1, shoulders at 100 m and a point at 118 m (p1).
 * Depths (local y) are not seen in any open photo square on: the OSM
 * outline at the foot, a waist of 0.86 and 0.9 at the swell, drawing in
 * with the crown, the tip 4 m toward +y (estimated). Corners are rounded
 * (superellipse, exponent 4 at the foot easing to 2.6 at the crown;
 * estimated from the rounded edges in p1). Floor lines every three storeys
 * (4.9 m storeys from 209 m over 42 storeys, less the crown: estimated).
 * Podium: 6 storeys (OSM), 26 m (p5: the drum's top at about the tower's
 * fifth floor slab; estimated); its finished cladding is not in any open
 * photo: drawn as pale metal with one broad glass band (invented).
 * Colours: glass a dark teal-blue #4b7d90 (p1: #2e4f62 in shade, #7f9aaf
 * lit; lead review round 1); floor lines a slightly lighter glass tone
 * #6c96a7, every three storeys in the low model; the crane metal; podium
 * pale grey #d3d6d6 with one broad glass band #9fb6c6 round its outer
 * walls (3.5-21.5 m); roof grey.
 *
 * Night: the curtain wall is `window`, lit like an office tower; the
 * podium glass `window-2`. (Open night photos of the tower were not found.)
 *
 * Detail model (models/baku-socar-tower.detail.glb, from zoom 16): finer
 * sections, a floor line at every storey, the crane as members.
 *
 * Doubts: the plan above the foot and the depths are estimated (only one
 * side is photographed whole, p1, plus a distant p4); the twist the tower
 * shows from other sides is reduced to the lean of the crown and the
 * swell; the north-east wing's raking top is partly hidden in p1; the
 * podium's cladding and height are invented/estimated.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { triangulate, type XY } from './chi-aon-center'

export const ANCHOR: [number, number] = [49.88365, 40.405454]
export const BEARING = 146.7
const KX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), KY = 110574
const B = (BEARING * Math.PI) / 180
// Local axes as world (east, north) unit vectors: +x toward bearing B + 90, +y toward bearing B.
const EX: XY = [Math.sin(B + Math.PI / 2), Math.cos(B + Math.PI / 2)], EY: XY = [Math.sin(B), Math.cos(B)]
const local = (c: number[][]): XY[] => c.map(([lo, la]) => {
  const e = (lo - ANCHOR[0]) * KX, n = (la - ANCHOR[1]) * KY
  return [e * EX[0] + n * EX[1], e * EY[0] + n * EY[1]] as XY
})

const TOWER_OSM = [[49.8833062, 40.4055007], [49.8835706, 40.4051955], [49.883993, 40.4054076], [49.8837286, 40.4057129]]
const PODIUM_OSM = [[49.8832187, 40.4056996], [49.8831922, 40.4055943], [49.8831962, 40.4055015], [49.8832163, 40.4054166], [49.8832612, 40.405351], [49.8833021, 40.4052941], [49.8833788, 40.4052347], [49.8835765, 40.4051414], [49.8834914, 40.404968], [49.883609, 40.4049451], [49.883609, 40.4046898], [49.8834282, 40.4047365], [49.8833138, 40.4047908], [49.8831912, 40.4048708], [49.8830385, 40.4050175], [49.8829749, 40.4051082], [49.8829485, 40.4051833], [49.882924, 40.4052941], [49.8829334, 40.405391], [49.8829454, 40.40548], [49.882996, 40.4055758], [49.8830366, 40.4056372], [49.8831111, 40.4057111]]

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

// ---- The silhouette (header table) ---------------------------------------------------------------------
const H = 209
// The main wing: z, left (north-east) edge, right (south-west) edge, depth scale.
const MAIN: [number, number, number, number][] = [
  [0, -21.4, 21.4, 1.0],
  [43, -21.4, 21.4, 1.0],
  [72, -20.5, 19.5, 0.95],
  [93, -17.5, 18.4, 0.88],
  [108, -17, 19.8, 0.86],
  [136, -18, 23.6, 0.9],
  [151, -18.2, 24, 0.9],
  [158, -19.5, 23.4, 0.88],
  [165, -20.2, 21, 0.82],
  [172, -20.2, 17, 0.72],
  [179, -18.8, 11.8, 0.6],
  [186, -16, 6.4, 0.47],
  [193, -12.8, 4.2, 0.35],
  [200, -9.2, 2.2, 0.24],
  [205, -6.8, -1.5, 0.12],
  [H, -5, -5, 0],
]
/** Catmull-Rom through the table for column k. */
function prof(z: number, k: number) {
  const T = MAIN
  let i = 0
  while (i < T.length - 2 && z > T[i + 1][0]) i++
  const p0 = T[Math.max(0, i - 1)], p1 = T[i], p2 = T[i + 1], p3 = T[Math.min(T.length - 1, i + 2)]
  const t = (z - p1[0]) / (p2[0] - p1[0] || 1)
  const m1 = ((p2[k] - p0[k]) / (p2[0] - p0[0] || 1)) * (p2[0] - p1[0])
  const m2 = ((p3[k] - p1[k]) / (p3[0] - p1[0] || 1)) * (p2[0] - p1[0])
  const t2 = t * t, t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * p1[k] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[k] + (t3 - t2) * m2
}
const HALF_Y = 20.25 // the OSM outline's short side, 40.5 m
const TIP_Y = 4

/** A superellipse ring, counter-clockwise from above, n points. */
function ring(cx: number, cy: number, hx: number, hy: number, e: number, n: number, z: number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.PI / n
    const c = Math.cos(a), s = Math.sin(a)
    out.push([cx + hx * Math.sign(c) * Math.pow(Math.abs(c), 2 / e), cy + hy * Math.sign(s) * Math.pow(Math.abs(s), 2 / e), z])
  }
  return out
}

function mainRing(z: number, n: number): V3[] {
  const l = prof(z, 1), r = prof(z, 2), d = Math.max(0, prof(z, 3))
  const t = z / H
  const e = 4 - 1.6 * Math.pow(t, 2)
  const cy = TIP_Y * Math.pow(Math.max(0, (z - 150) / (H - 150)), 2)
  return ring((l + r) / 2, cy, Math.max(0.05, (r - l) / 2), Math.max(0.05, HALF_Y * d), e, n, z)
}

/**
 * Loft rings into a smooth-sided surface (normals smooth round each ring,
 * from neighbouring rings up and down), each band in the part `pick(k)`.
 */
function loftSmooth(rings: V3[][], pick: (k: number) => Part) {
  const n = rings[0].length
  const nrm = (k: number, i: number): V3 => {
    const r = rings[k]
    const a = r[(i + 1) % n], b = r[(i - 1 + n) % n]
    const up = rings[Math.min(rings.length - 1, k + 1)][i], dn = rings[Math.max(0, k - 1)][i]
    const tu = sub(a, b), tv = sub(up, dn)
    return unit(cross(tu, tv))
  }
  for (let k = 0; k < rings.length - 1; k++) {
    const p = pick(k)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const A = rings[k][i], Bp = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
      const nA = nrm(k, i), nB = nrm(k, j), nC = nrm(k + 1, j), nD = nrm(k + 1, i)
      p.tri(A, Bp, C, undefined, undefined, undefined, [nA, nB, nC])
      p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}

/** Bands: storey lines every `every` storeys, `line` metres tall. Returns ring heights and a material per band. */
function bands(z0: number, z1: number, storey: number, every: number, line: number, extra: number[]) {
  const zs: { z: number; trim: boolean }[] = [{ z: z0, trim: false }]
  for (let z = z0 + storey * every; z < z1 - 1; z += storey * every) {
    zs.push({ z: z - line, trim: false }, { z, trim: true })
  }
  for (const e of extra) if (e > z0 && e < z1 && zs.every((q) => Math.abs(q.z - e) > 0.8)) zs.push({ z: e, trim: false })
  zs.sort((a, b) => a.z - b.z)
  zs.push({ z: z1, trim: false })
  // A band is trim when it ends at a "trim" ring (the thin line just under it).
  return zs.map((q, k) => ({ z: q.z, trimBelow: k + 1 < zs.length && zs[k + 1].trim }))
}

const GLASS: MaterialSpec = { name: 'window', color: 0x4b7d90, roughness: 0.3 }
// Floor lines: a slightly lighter glass tone, not white (lead review round 1).
const TRIM: MaterialSpec = finish('socar-floor-line', 0x6c96a7)
const METAL: MaterialSpec = finish('crane-metal', 0xb9bec2)
const POD_WALL: MaterialSpec = finish('podium-metal', 0xd3d6d6)
const POD_GLASS: MaterialSpec = windowVariant(2, 0x9fb6c6)
const ROOF: MaterialSpec = PALETTE.roof
const STOREY = 4.75, POD_H = 26

/** A box strut between two points, square section w. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = unit(sub(b, a))
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = mul(unit(cross(d, ref)), w / 2), v = mul(unit(cross(d, unit(cross(d, ref)))), w / 2)
  const c = (o: V3, i: number): V3 => add(add(o, mul(u, i & 1 ? 1 : -1)), mul(v, i & 2 ? 1 : -1))
  const A = [0, 1, 3, 2].map((i) => c(a, i)), Bq = [0, 1, 3, 2].map((i) => c(b, i))
  const ctr = mul(add(a, b), 0.5)
  const face = (q: V3[], n: V3) => {
    const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    const ok = f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0
    const Q = ok ? q : [q[0], q[3], q[2], q[1]]
    p.quad(Q[0], Q[1], Q[2], Q[3])
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, q = [A[i], A[j], Bq[j], Bq[i]]
    face(q, unit(sub(mul(add(add(q[0], q[1]), add(q[2], q[3])), 0.25), ctr)))
  }
  face(A, mul(d, -1)); face(Bq, d)
}

export function build(detail: boolean) {
  const glass = new Part(), trim = new Part(), metal = new Part(), wall = new Part(), pglass = new Part(), roof = new Part()
  const N = detail ? 64 : 28
  const every = detail ? 1 : 3, line = detail ? 0.3 : 0.45

  // The main wing.
  const zMain = bands(0, 203.5, STOREY, every, line, detail ? [] : [100, 125, 151, 165, 172, 179, 186, 193, 200])
  const extraTop = detail ? [204.5, 205.5, 206.5, 207.5, 208.3, 208.8] : [205.5, 207.3, 208.5]
  const levels = [...zMain.map((q) => q.z), ...extraTop]
  const ringsMain = levels.map((z) => mainRing(z, N))
  // Close the tip: a last ring collapsed to the tip point.
  const tip: V3 = [-5, TIP_Y, H]
  ringsMain.push(ringsMain[0].map(() => tip))
  loftSmooth(ringsMain, (k) => (k < zMain.length && zMain[k].trimBelow ? trim : glass))
  // The base cap.
  glass.cap(ringsMain[0], false)

  // The north-east wing: a slim raking glass blade standing off the north-east
  // face, its outer edge the left of the silhouette in p1, its pointed top at
  // 118 m over the face's middle, its shoulders at 96 m (p1).
  {
    const x0 = -23.4, x1 = -20.4, hy = 9, zs = 100, zt = 118
    const P0: V3[] = [[x0, -hy, 0], [x0, hy, 0], [x0, hy, zs], [x0, 0, zt], [x0, -hy, zs]]
    const P1: V3[] = P0.map((p) => [x1, p[1], p[2]])
    // Outer face (toward -x) and inner face, fans from the bottom middle.
    const cO: V3 = [x0, 0, 0], cI: V3 = [x1, 0, 0]
    for (let i = 0; i < 5; i++) {
      const j = (i + 1) % 5
      const fo = cross(sub(P0[i], cO), sub(P0[j], cO))
      if (fo[0] < 0) glass.tri(cO, P0[i], P0[j]); else glass.tri(cO, P0[j], P0[i])
      const fi = cross(sub(P1[i], cI), sub(P1[j], cI))
      if (fi[0] > 0) glass.tri(cI, P1[i], P1[j]); else glass.tri(cI, P1[j], P1[i])
      // The blade's edges.
      const q = [P0[i], P0[j], P1[j], P1[i]]
      const mxy = [(q[0][1] + q[1][1]) / 2, (q[0][2] + q[1][2]) / 2]
      const ctr = [0, zs * 0.5]
      const out: V3 = [0, mxy[0] - ctr[0], mxy[1] - ctr[1]]
      const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
      if (f[1] * out[1] + f[2] * out[2] >= 0) trim.quad(q[0], q[1], q[2], q[3]); else trim.quad(q[0], q[3], q[2], q[1])
    }
  }

  // The maintenance crane on the tip: a mast and a jib (p1, p2).
  const mast0: V3 = [-5.5, TIP_Y, 203], mast1: V3 = [-5.5, TIP_Y, H + 9]
  strut(metal, mast0, mast1, detail ? 0.9 : 1.2)
  strut(metal, [-5.5, TIP_Y - 1, H + 7.5], [5.5, TIP_Y - 1, H + 8.5], detail ? 0.7 : 1.0)
  strut(metal, [-5.5, TIP_Y + 1, H + 7.5], [-12, TIP_Y + 1, H + 7], detail ? 0.6 : 0.9)
  if (detail) {
    for (let k = 0; k < 4; k++) strut(metal, [-5.5, TIP_Y, H + 9], [-5.5 + (k < 2 ? 5 : -6) * (k % 2 ? 0.6 : 1), TIP_Y - 1, H + 8], 0.15)
    strut(metal, [-5.5, TIP_Y, H + 2], [0, TIP_Y - 1, H + 8.5], 0.3)
  }

  // The podium: its outline extruded, pale metal with two glass bands of two storeys each.
  const pod = ccw(local(PODIUM_OSM))
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    wall.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], POD_H], [a[0], a[1], POD_H])
    // Skip the wall that faces the tower (inside the tower's rectangle zone).
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    if (Math.abs(mx) < 23.5 && Math.abs(my) < 22) continue
    const o = 0.06, s0 = 0, s1 = L
    const p0: XY = [a[0] + ((b[0] - a[0]) * s0) / L + nx * o, a[1] + ((b[1] - a[1]) * s0) / L + ny * o]
    const p1: XY = [a[0] + ((b[0] - a[0]) * s1) / L + nx * o, a[1] + ((b[1] - a[1]) * s1) / L + ny * o]
    for (const [z0, z1] of [[3.5, 21.5]]) pglass.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
  }
  for (const [i, j, k] of triangulate(pod)) roof.tri([pod[i][0], pod[i][1], POD_H], [pod[j][0], pod[j][1], POD_H], [pod[k][0], pod[k][1], POD_H])

  return [
    { part: glass, material: GLASS },
    { part: trim, material: TRIM },
    { part: metal, material: METAL },
    { part: wall, material: POD_WALL },
    { part: pglass, material: POD_GLASS },
    { part: roof, material: ROOF },
  ]
}

if (import.meta.main) {
  const t = local(TOWER_OSM)
  console.log('tower corners (local):', t.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('  '))
  for (const [file, detail, maxTris, maxBytes] of [
    ['baku-socar-tower.glb', false, 6500, 250 * 1024],
    ['baku-socar-tower.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('SOCAR Tower', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor', anchor: ANCHOR, bearing: BEARING, height: H + 9 })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
