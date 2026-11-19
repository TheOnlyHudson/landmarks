/**
 * Etihad Towers, Abu Dhabi (DBI Design, 2011): procedural, CC0-1.0.
 * bun generators/abu-dhabi-etihad-towers.ts
 *
 * Five towers of dark blue-grey glass on a shared podium. Each tower is
 * its OSM footprint lofted up with a gentle taper, and near the top its
 * plan draws in toward the edge facing the group (the curved glass faces
 * sweep in, the inner faces stay nearly straight), so each crown ends in
 * a rounded, sculpted blade, as in every photo. The flat faces that carry
 * white horizontal bands (o06, c01) are a lighter grey-blue finish.
 * Vertical texture is real geometry: pairs of solid mullion fins (1.2 m
 * wide, 1.4 m deep, light grey-blue) every fifth of the way round each
 * tower, from the ground into the crown; the curved glass turned to the
 * sun (south) is a lighter sky-lit blue, `window-4` #86a1b7 (o03, o06).
 * It stays a `window*` material, not `glass-*`, because these are lit
 * offices and flats at night. Each plan is scaled after smoothing to keep
 * OSM's footprint area, and the shaft is straight to 72% of the height
 * (no taper), with a rounder crown (lead review round 1).
 *
 * Frame: anchor at the centroid of the podium outline (way/1465342507),
 * 54.3217725, 24.4586313; bearing 0 (the group has no main axis).
 *
 * Heights, published (CTBUH / Wikipedia infobox; OSM agrees): T1 277.6 m
 * (way/168401784), T2 305.3 m (way/168401785), T3 260.3 m
 * (way/168401781), T4 234.0 m (way/168401783), T5 217.5 m
 * (way/168401782). Plans: OSM footprints. Estimated from photos (o02-o08,
 * c01): the crown taper starts at about 72% of each tower's height; the crown
 * ends in a sharp ridge about 10% of the tower's depth and 40% of its width, the curved
 * edge rounding in like an arc from the vertical.
 * The podium: OSM outline, 4 levels (OSM), modelled 15 m of dark glazing
 * under a thin pale roof edge (o04, o06, o07). Towers T4 and T5
 * stand outside OSM's podium outline and are drawn from the ground.
 *
 * Which edge each crown draws toward: the side facing the group's centre
 * (the mean of the five footprints), as the photos show the curved outer
 * faces sweeping in (o06 from the south-west, c01 from the north-west);
 * T3 stands at the centre and draws toward its straight north edge.
 *
 * Colour: glass #5f7d94 (sampled #45627a, #4d6680, #395153 in daylight in
 * o03 and o06, pulled to the palette's lightness; it reads blue-teal);
 * the banded flat faces #8f9ba4 (o06: #46534f with white bands); podium
 * roof edge `trim`; podium glazing `window`.
 *
 * Night: the towers are lit offices and flats, so the glass is `window`;
 * the podium band glows too.
 *
 * Photos (EVIDENCE):
 * - o01 "Etihad Towers Abu Dhabi", Mohammed Alborum, CC BY-SA 2.0, https://www.flickr.com/photos/130711206@N03/25923852504 (night)
 * - o02-o05 "Etihad Towers @ Abu Dhabi", *_*, CC BY 2.0, https://www.flickr.com/photos/22539273@N00/16018255636, .../15858372637, .../15421790574, .../15856583768
 * - o06 "Etihad Towers", Se.By. (Sergey Bystro), CC BY 2.0, https://www.flickr.com/photos/78051511@N03/7718010984 (from the south-west)
 * - o07 "Etihad Towers", Travels with Kathleen, CC BY 2.0, https://www.flickr.com/photos/72821066@N04/32453297315
 * - o08 "Etihad towers", Francisco Anzola, CC BY 2.0, https://www.flickr.com/photos/10345599@N03/8723117609
 * - c01 "Etihad Towerとエミレーツ・パレス", ykeiko, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Etihad_Tower%E3%81%A8%E3%82%A8%E3%83%9F%E3%83%AC%E3%83%BC%E3%83%84%E3%83%BB%E3%83%91%E3%83%AC%E3%82%B9_-_panoramio.jpg (from the sea, north-west)
 * - c02 "The Big Six in Abu Dhabi", Tms2007, CC BY-SA 4.0, Wikimedia Commons
 * - c03 "Skyline Abu Dhabi", Kimmyuandooo, CC BY-SA 3.0, Wikimedia Commons
 * - s06 "Abu Dhabi", sergei.gussev, CC BY 2.0, https://www.flickr.com/photos/133200397@N03/48352279486 (dusk)
 * Facts: https://en.wikipedia.org/wiki/Etihad_Towers ; CTBUH Skyscraper Center.
 *
 * Doubts: no open aerial, so the crown geometry (where each ridge sits)
 * is read from oblique photos; OSM's footprints are coarse polygons and
 * are used as mapped; the podium's height and roof are estimated.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
type P2 = [number, number]

const PODIUM: P2[] = [[24.5, 84.2], [34.5, 74.0], [50.4, 52.0], [58.9, 38.1], [64.8, 25.9], [68.4, 11.0], [69.0, -11.5], [68.9, -20.1], [67.4, -30.7], [62.0, -45.1], [56.4, -54.3], [46.4, -65.6], [38.8, -71.0], [25.7, -77.7], [16.0, -80.4], [3.6, -82.4], [-13.0, -80.9], [-24.7, -76.2], [-39.9, -68.5], [-37.2, -62.1], [-37.8, -56.7], [-41.6, -46.2], [-56.9, -23.0], [-69.0, 5.4], [-68.8, 22.3], [-72.4, 42.4], [-80.2, 79.4], [-67.1, 72.9], [-54.8, 66.3], [-32.9, 59.3], [-19.3, 58.8], [-4.8, 62.9], [5.6, 68.3], [13.8, 73.7]]

type Tower = { id: string; name: string; h: number; plan: P2[]; tip?: P2; side: number }
const TOWERS: Tower[] = [
  { id: 'way/168401784', name: 'T1', side: 1, h: 277.6, plan: [[61.0, -36.5], [65.5, -24.3], [54.4, -17.4], [42.6, -13.3], [26.6, -11.4], [21.7, -24.3], [35.1, -34.0], [48.4, -38.0]] },
  { id: 'way/168401785', name: 'T2', side: -1, h: 305.3, plan: [[-20.2, -60.4], [-6.6, -48.1], [1.4, -36.5], [3.3, -24.3], [-2.0, -15.9], [-11.9, -15.2], [-22.4, -23.6], [-29.2, -32.1], [-38.5, -48.7]] },
  { id: 'way/168401781', name: 'T3', side: 1, h: 260.3, plan: [[13.6, 6.3], [17.4, 16.6], [18.5, 32.2], [16.9, 53.7], [-18.1, 44.0], [-15.1, 31.9], [-10.0, 19.0], [-2.9, 10.9], [5.7, 5.5], [9.8, 4.7]], tip: [-0.6, 48.8] },
  { id: 'way/168401783', name: 'T4', side: -1, h: 234.0, plan: [[4.9, 91.6], [13.6, 91.9], [22.3, 95.4], [27.2, 101.6], [31.2, 107.8], [32.3, 111.3], [31.2, 116.7], [14.4, 115.6], [3.6, 111.5], [-2.1, 108.3], [-5.6, 102.9]] },
  { id: 'way/168401782', name: 'T5', side: 1, h: 217.5, plan: [[-64.4, 90.3], [-54.4, 84.4], [-43.6, 83.0], [-33.8, 82.5], [-30.0, 83.3], [-25.4, 95.4], [-31.1, 99.7], [-37.6, 102.9], [-44.6, 105.1], [-53.6, 106.2], [-61.2, 105.6]] },
]
const PODIUM_H = 15

const area = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const centroid = (p: P2[]): P2 => {
  let cx = 0, cy = 0; const A = area(p)
  p.forEach((a, i) => { const b = p[(i + 1) % p.length]; const c = a[0] * b[1] - b[0] * a[1]; cx += (a[0] + b[0]) * c; cy += (a[1] + b[1]) * c })
  return [cx / (6 * A), cy / (6 * A)]
}
const ccw = (p: P2[]) => (area(p) < 0 ? [...p].reverse() : p)
/** Resample a closed polygon to n points evenly spaced by arc length. */
function resample(p: P2[], n: number): P2[] {
  const segs = p.map((a, i) => { const b = p[(i + 1) % p.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]) })
  const L = segs.reduce((s, v) => s + v, 0)
  const out: P2[] = []
  let i = 0, acc = 0
  for (let k = 0; k < n; k++) {
    const t = (k / n) * L
    while (acc + segs[i] < t) { acc += segs[i]; i++ }
    const f = (t - acc) / segs[i], a = p[i], b = p[(i + 1) % p.length]
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f])
  }
  return out
}
/** Smooth a closed ring a little (Chaikin-like averaging), keeping its size. */
const smooth = (p: P2[]): P2[] => p.map((a, i) => {
  const b = p[(i + p.length - 1) % p.length], c = p[(i + 1) % p.length]
  return [a[0] * 0.5 + (b[0] + c[0]) * 0.25, a[1] * 0.5 + (b[1] + c[1]) * 0.25]
})

const GROUP: P2 = (() => { const cs = TOWERS.map((t) => centroid(t.plan)); return [cs.reduce((s, c) => s + c[0], 0) / 5, cs.reduce((s, c) => s + c[1], 0) / 5] })()

/** The point where a ray from c toward dir leaves the polygon. */
function exitPoint(p: P2[], c: P2, dir: P2): P2 {
  let best = 0
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const den = dir[0] * ey - dir[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const t = ((a[0] - c[0]) * ey - (a[1] - c[1]) * ex) / den
    const u = ((a[0] - c[0]) * dir[1] - (a[1] - c[1]) * dir[0]) / den
    if (t > 0 && u >= 0 && u <= 1) best = Math.max(best, t)
  }
  return [c[0] + dir[0] * best, c[1] + dir[1] * best]
}

/** Is the outward edge normal at this point facing the tip side (the flat, banded faces)? */
function tower(glass: Part, band: Part, sun: Part, t: Tower, base: number) {
  const N = 28
  const raw = smooth(resample(ccw(t.plan), N))
  const k0 = Math.sqrt(Math.abs(area(t.plan)) / Math.abs(area(raw))), cr = centroid(raw)
  const ring0: P2[] = raw.map((p) => [cr[0] + (p[0] - cr[0]) * k0, cr[1] + (p[1] - cr[1]) * k0]) // OSM's area kept
  const c = centroid(ring0)
  let tip: P2
  if (t.tip) tip = t.tip
  else {
    const d: P2 = [GROUP[0] - c[0], GROUP[1] - c[1]]; const l = Math.hypot(...d)
    tip = exitPoint(ring0, c, [d[0] / l, d[1] / l])
  }
  // axes: u from the tip into the plan (depth), v along the tip edge (width)
  const ux0 = c[0] - tip[0], uy0 = c[1] - tip[1], ul = Math.hypot(ux0, uy0)
  const U: P2 = [ux0 / ul, uy0 / ul], V: P2 = [-U[1], U[0]]
  const H = t.h, z0 = 0.72 * H
  // levels: shaft (with a gentle taper), then the crown in fine steps
  const levels: Array<{ z: number; fu: number; fv: number }> = []
  for (const z of [base, z0 * 0.5, z0]) levels.push({ z, fu: 1, fv: 1 })
  const steps = 11
  for (let s = 1; s <= steps; s++) {
    const q = s / steps
    const z = z0 + (H - z0) * (1 - (1 - q) ** 1.6) // finer near the top
    const e = (z - z0) / (H - z0)
    levels.push({ z, fu: 1 - 0.88 * e ** 2, fv: 1 - 0.45 * e ** 2.5 })
  }
  // The width draws in toward one shoulder, not the middle, so from every
  // side one edge of the crown stays nearly straight and the other curves
  // in (o06, c01).
  const vmax = Math.max(...ring0.map((p) => (p[0] - tip[0]) * V[0] + (p[1] - tip[1]) * V[1])) * t.side
  const rings: V3[][] = levels.map(({ z, fu, fv }) => ring0.map((p) => {
    const du = (p[0] - tip[0]) * U[0] + (p[1] - tip[1]) * U[1], dv = (p[0] - tip[0]) * V[0] + (p[1] - tip[1]) * V[1] - vmax * 0.55
    const v = vmax * 0.55 + dv * fv
    return [tip[0] + U[0] * du * fu + V[0] * v, tip[1] + U[1] * du * fu + V[1] * v, z] as V3
  }))
  // Banded (flat) faces: chosen once per column from the base plan, so the band runs straight up.
  const banded = ring0.map((a, i) => {
    const b = ring0[(i + 1) % ring0.length]
    const fx = b[1] - a[1], fy = -(b[0] - a[0]), fl = Math.hypot(fx, fy) || 1
    return (fx * U[0] + fy * U[1]) / fl < -0.75
  })
  // Curved glass turned to the sun (south, model -y) reads lighter, sky-lit (o03, o06).
  const sunlit = ring0.map((a, i) => {
    const b = ring0[(i + 1) % ring0.length]
    const fx = b[1] - a[1], fy = -(b[0] - a[0]), fl = Math.hypot(fx, fy) || 1
    return fy / fl < -0.3
  })
  // Smooth normals per vertex column (horizontal), so the curved glass reads round;
  // a face is "banded" when it faces the tip side (outward normal against U).
  const n = ring0.length
  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a = rings[k][i], b = rings[k][j], cc = rings[k + 1][j], d = rings[k + 1][i]
      const nrm = (r: V3[], m: number): V3 => {
        const p = r[(m + n - 1) % n], q = r[(m + 1) % n]
        const ex = q[0] - p[0], ey = q[1] - p[1], l = Math.hypot(ex, ey) || 1
        return [ey / l, -ex / l, 0.08]
      }
      const part = banded[i] ? band : sunlit[i] ? sun : glass
      part.tri(a, b, cc, [0, 0], [0, 0], [0, 0], [nrm(rings[k], i), nrm(rings[k], j), nrm(rings[k + 1], j)])
      part.tri(a, cc, d, [0, 0], [0, 0], [0, 0], [nrm(rings[k], i), nrm(rings[k + 1], j), nrm(rings[k + 1], i)])
    }
  }
  // Vertical fins: pairs of solid mullion fins up the curved glass, one pair
  // every fifth of the way round, running up into the crown (o03, o05, o06).
  for (let i = 0; i < n; i++) {
    if (i % 5 > 1 || banded[i] || banded[(i + n - 1) % n]) continue
    const fin = (r: V3[], m: number) => {
      const p = r[(m + n - 1) % n], q = r[(m + 1) % n], o = r[m]
      const ex = q[0] - p[0], ey = q[1] - p[1], l = Math.hypot(ex, ey) || 1
      const tx = ex / l, ty = ey / l, nx = ty, ny = -tx
      const hw = 0.6, out = 1.4
      return { a: [o[0] - tx * hw, o[1] - ty * hw, o[2]] as V3, b: [o[0] + tx * hw, o[1] + ty * hw, o[2]] as V3, t: [o[0] + nx * out, o[1] + ny * out, o[2]] as V3, na: [nx - tx, ny - ty, 0] as V3, nb: [nx + tx, ny + ty, 0] as V3 }
    }
    for (let k = 0; k < rings.length - 1; k++) {
      const f0 = fin(rings[k], i), f1 = fin(rings[k + 1], i)
      band.tri(f0.a, f0.t, f1.t, [0, 0], [0, 0], [0, 0], [f0.na, f0.na, f1.na]); band.tri(f0.a, f1.t, f1.a, [0, 0], [0, 0], [0, 0], [f0.na, f1.na, f1.na])
      band.tri(f0.t, f0.b, f1.b, [0, 0], [0, 0], [0, 0], [f0.nb, f0.nb, f1.nb]); band.tri(f0.t, f1.b, f1.t, [0, 0], [0, 0], [0, 0], [f0.nb, f1.nb, f1.nb])
    }
  }
  // top ridge cap
  const top = rings[rings.length - 1]
  const tc: V3 = [top.reduce((s, p) => s + p[0], 0) / n, top.reduce((s, p) => s + p[1], 0) / n, H + 0.6]
  for (let i = 0; i < n; i++) glass.tri(top[i], top[(i + 1) % n], tc)
}

/** The podium: OSM outline, a glazed band under a pale rounded roof edge. */
function podium(wall: Part, win: Part, roof: Part) {
  const p = ccw(PODIUM)
  const n = p.length
  const lv = (z: number, inset = 0): V3[] => {
    const c = centroid(p)
    return p.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy); return [x - (dx / l) * inset, y - (dy / l) * inset, z] as V3 })
  }
  const r0 = lv(0, 0.4), r1 = lv(PODIUM_H - 1.8, 0.4), r2 = lv(PODIUM_H - 1.8), r3 = lv(PODIUM_H - 0.5), r4 = lv(PODIUM_H, 0.7)
  win.loft([r0, r1])
  wall.loft([r1, r2]); wall.loft([r2, r3]); wall.loft([r3, r4])
  // roof: fan from the centroid (the outline is star-shaped about it)
  const c = centroid(p)
  for (let i = 0; i < n; i++) roof.tri(r4[i], r4[(i + 1) % n], [c[0], c[1], PODIUM_H])
}

type Mats = { glass: Part; band: Part; sun: Part; trim: Part; win: Part; roof: Part }
function build(): Mats {
  const M: Mats = { glass: new Part(), band: new Part(), sun: new Part(), trim: new Part(), win: new Part(), roof: new Part() }
  podium(M.trim, M.win, M.roof)
  for (const t of TOWERS) tower(M.glass, M.band, M.sun, t, 0)
  return M
}

function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.glass, material: { ...PALETTE.window, color: 0x5f7d94 } },
    { part: M.band, material: windowVariant(2, 0xb3c0ca) },
    { part: M.sun, material: windowVariant(4, 0x86a1b7) },
    { part: M.trim, material: PALETTE.trim },
    { part: M.win, material: windowVariant(3, 0x64798a) },
    { part: M.roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  const parts = materials(build())
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Etihad Towers', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: BEARING, elevation: 0, height: 305.3,
  })
  console.log(`abu-dhabi-etihad-towers.glb: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > 6500 || glb.length > 250_000) throw new Error('over budget')
  await Bun.write(new URL('../models/abu-dhabi-etihad-towers.glb', import.meta.url).pathname, glb)
}
