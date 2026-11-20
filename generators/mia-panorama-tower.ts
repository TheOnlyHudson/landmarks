/**
 * Panorama Tower (2018, Bermello Ajamil & Partners), 1101 Brickell Avenue,
 * Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-panorama-tower.ts [out.glb]
 *
 * This file also exports the small ring kit the other mia- Brickell towers
 * use (mia-four-seasons, mia-espirito-santo-plaza, mia-atlantis,
 * mia-brickell-city-centre): merge it first. The build below only runs when
 * the file is executed directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/676817045,
 * 25.7630483, -80.1903794. Bearing 0: plans are drawn in world axes; the
 * tower's own plan is drawn in a frame turned 13 degrees (its long axis)
 * and turned back.
 *
 * Form: an 18-storey parking/amenity podium filling the block (pool deck on
 * top), and an 85-storey blue-glass slab, long north-south. The slab is
 * 33 m wide up to about 145 m, where its west 9 m stops with a white ledge
 * (the white "belt" seen across the west face in photos), and the upper
 * slab carries on 24 m wide to a white brow at the roof, lit blue at night.
 *
 * Sources:
 *  - OSM: outline way/676817045 (265 m, 85 levels, wikidata Q4547246); tower
 *    part way/918579004; podium part relation/13333747 (18 levels, the
 *    tower as its inner ring). Plans from OSM, checked against lidar.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019, after completion), 1 m grid, read in the tower's 13-degree frame:
 *    main roof 253-254 m (measured), roof plant/brow to 258 m, podium deck
 *    57-61 m (measured), west wing roof 140-147 m (measured, wall returns
 *    blur it: taken as 145), upper slab x -11..+14, wing to x -20 (measured,
 *    matches the OSM part's west edge).
 *  - Published: 265 m, 85 floors (OSM / Wikipedia; the 265 includes the
 *    rooftop screen and mast, drawn as a plant box to 258 m).
 *  - Estimated: white balcony-slab lines every two floors (6 m), white
 *    edges on the 1.6 m corner chamfers, vertical white spines at the
 *    balcony stacks, brow depth (6 m, blue LED band under a white lip),
 *    podium window bands (photos). Glass pulled from the photos' dark
 *    grey-green to the palette's lightness.
 *  - The mid-height step was re-checked after review: in the turned frame
 *    the strip x -20..-12 returns 140-147 m (max per cell) along its whole
 *    60 m length, with no 250 m returns, while the roof east of x -11 reads
 *    250-254 m. A full-height wall there would put its top (254 m) in those
 *    cells. From the west the step is face-on and reads only as the white
 *    belt the photos show, which is why the photos look uniform; it shows
 *    in silhouette only from the north and south.
 *
 * Photos (Wikimedia Commons, daylight unless noted):
 *  - Panorama_Tower_(60062).jpg, Rhododendrites, CC BY-SA 4.0 — from the
 *    west, high (the west face, belt and brow);
 *  - Panorama_Tower_2020.jpg, Chris6d, CC BY-SA 4.0 — from Biscayne Bay to
 *    the east;
 *  - Panorama_Tower_Miami_April_2018.jpg, Phillip Pessar, CC BY 2.0 — from
 *    the north-east, past the JW Marriott;
 *  - Panorama_Tower_at_night_(60043).jpg, Rhododendrites, CC BY-SA 4.0 —
 *    night, same viewpoint as the first: the blue-lit crown.
 * No commercial imagery or 3D tiles were used. No look-only sources.
 *
 * Doubts: OSM and lidar agree on the plan to a couple of metres; the
 * camera direction of the first photo is read from the bay and port in its
 * background (west, slightly south) and is not certain. The podium's
 * street faces are only seen obliquely in the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ======================= shared ring kit (exported) =======================

export type XY = [number, number]

export const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without a repeated closing point. */
export const ccw = (r: XY[]): XY[] => {
  const s = r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r.slice(0, -1) : r
  return area(s) < 0 ? [...s].reverse() : s
}
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Outward normal of edge a→b of a ccw ring. */
export const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], -(b[0] - a[0])])

/** Points drawn in a frame whose north is turned to `bearing`, back into world axes. */
export function turn(r: XY[], bearing: number): XY[] {
  const b = (bearing * Math.PI) / 180
  return r.map(([x, y]) => [x * Math.cos(b) + y * Math.sin(b), -x * Math.sin(b) + y * Math.cos(b)])
}
export const turnPt = (p: XY, bearing: number): XY => turn([p], bearing)[0]

/** Cut each sharp corner (turn over ~35°) back by `c` metres. */
export function bevel(r: XY[], c = 0.5): XY[] {
  const out: XY[] = []
  r.forEach((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const u = nrm2(sub2(p, a)), v = nrm2(sub2(b, p))
    const t = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])))
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    if (t > 0.6 && la > 3 * c && lb > 3 * c) out.push([p[0] - u[0] * c, p[1] - u[1] * c], [p[0] + v[0] * c, p[1] + v[1] * c])
    else out.push(p)
  })
  return out
}

/** Offset a ccw ring outward by d (mitred). */
export function offset(r: XY[], d: number): XY[] {
  return r.map((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const n1 = outward(a, p), n2 = outward(p, b), m = nrm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}

/** Ear-clipping triangulation of a simple ccw ring. */
export function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(r[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]
export function capRing(part: Part, r: XY[], z: number, up = true) {
  const n = up ? UP : DOWN
  for (const [a, b, c] of earcut(r)) part.tri([r[a][0], r[a][1], z], [r[b][0], r[b][1], z], [r[c][0], r[c][1], z], undefined, undefined, undefined, [n, n, n])
}

/** A convex polygon facing `n` (winding follows the normal). */
export function face(part: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/**
 * Vertical walls round a ccw ring, smooth across gentle bends and creased at
 * corners, split into height bands each with its own part. Faces longer than
 * `maxLen` near the ground are split so the map's drape follows the terrain.
 */
export function walls(r: XY[], bands: [number, number, Part][], smooth = 0.45) {
  const n = r.length
  const en = r.map((p, i) => outward(p, r[(i + 1) % n]))
  const vn = (i: number, e: number): V3 => {
    const a = en[(i - 1 + n) % n], b = en[i]
    const t = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])))
    const m = t < smooth ? nrm2([a[0] + b[0], a[1] + b[1]]) : en[e]
    return [m[0], m[1], 0]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], b = r[j]
    const na = vn(i, i), nb = vn(j, i)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [z0, z1, part] of bands) {
      if (z1 <= z0) continue
      const k = z0 < 1 ? Math.max(1, Math.ceil(L / 5)) : 1
      for (let s = 0; s < k; s++) {
        const p: XY = [a[0] + ((b[0] - a[0]) * s) / k, a[1] + ((b[1] - a[1]) * s) / k]
        const q: XY = [a[0] + ((b[0] - a[0]) * (s + 1)) / k, a[1] + ((b[1] - a[1]) * (s + 1)) / k]
        const np = s === 0 ? na : en[i].concat(0) as V3, nq = s === k - 1 ? nb : en[i].concat(0) as V3
        part.tri([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], undefined, undefined, undefined, [np, nq, nq])
        part.tri([p[0], p[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], undefined, undefined, undefined, [np, nq, np])
      }
    }
  }
}

/** A closed prism: walls, a top cap and (optionally) a bottom. */
export function prism(r: XY[], z0: number, z1: number, wall: Part, top?: Part, bottom?: Part) {
  walls(r, [[z0, z1, wall]])
  if (top) capRing(top, r, z1, true)
  if (bottom) capRing(bottom, r, z0, false)
}

/** Each edge of a ring as a frame: start, unit tangent, outward normal, length. */
function edges(r: XY[]) {
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return { a, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as XY, o: outward(a, b), L }
  })
}
const at = (e: { a: XY; t: XY; o: XY }, s: number, proud: number, z: number): V3 =>
  [e.a[0] + e.t[0] * s + e.o[0] * proud, e.a[1] + e.t[1] * s + e.o[1] * proud, z]

/** A flat rectangle on edge e, from s0 to s1 along it and z0 to z1, `proud` off the wall. */
export function edgeRect(part: Part, e: { a: XY; t: XY; o: XY }, s0: number, s1: number, z0: number, z1: number, proud = 0.05) {
  face(part, [at(e, s0, proud, z0), at(e, s1, proud, z0), at(e, s1, proud, z1), at(e, s0, proud, z1)], [e.o[0], e.o[1], 0])
}
export { edges as ringEdges }

/** Horizontal strips (floor-group lines, ledges) round a ring at each z, height h. */
export function hbands(part: Part, r: XY[], zs: number[], h: number, proud = 0.05, minEdge = 1.5) {
  for (const e of edges(r)) if (e.L >= minEdge) for (const z of zs) edgeRect(part, e, 0, e.L, z - h / 2, z + h / 2, proud)
}

/** Vertical strips every `step` metres round a ring (not within `w` of a corner). */
export function vlines(part: Part, r: XY[], z0: number, z1: number, step: number, w = 0.8, proud = 0.05, minEdge = 0) {
  for (const e of edges(r)) {
    if (e.L < minEdge) continue
    const n = Math.max(1, Math.round(e.L / step))
    for (let k = 1; k < n; k++) {
      const s = (e.L * k) / n
      edgeRect(part, e, s - w / 2, s + w / 2, z0, z1, proud)
    }
  }
}

/**
 * Window panels on every edge longer than minEdge: bays about `bay` wide with
 * `pier` of wall between, rows `rowH` tall with `spandrel` of wall between.
 */
export function panels(part: Part, r: XY[], z0: number, z1: number, o: { bay: number; pier: number; rowH: number; spandrel: number; minEdge?: number; proud?: number }) {
  const rows = Math.max(1, Math.round((z1 - z0) / o.rowH)), rh = (z1 - z0) / rows
  for (const e of edges(r)) {
    if (e.L < (o.minEdge ?? 4)) continue
    const n = Math.max(1, Math.round(e.L / o.bay)), bw = e.L / n
    for (let k = 0; k < n; k++)
      for (let j = 0; j < rows; j++)
        edgeRect(part, e, k * bw + o.pier / 2, (k + 1) * bw - o.pier / 2, z0 + j * rh + o.spandrel / 2, z0 + (j + 1) * rh - o.spandrel / 2, o.proud ?? 0.05)
  }
}

/** A box centred at (cx, cy), w along `bearing`'s x, d along its y. */
export function box(part: Part, cx: number, cy: number, w: number, d: number, z0: number, z1: number, bearing = 0, top = true) {
  const r = turn([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]], bearing).map(([x, y]) => [x + cx, y + cy] as XY)
  walls(r, [[z0, z1, part]])
  if (top) capRing(part, r, z1)
}

/** Total triangles, and the GLB written with budget checks. */
export async function build(name: string, id: string, parts: Array<{ part: Part; material: any }>, extras: Record<string, unknown>, out?: string, maxTris = 5000) {
  const used = parts.filter((p) => p.part.triangles)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`File budget exceeded: ${glb.length}`)
  const path = out ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(path, glb)
  console.log(`${path}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ============================== Panorama Tower ==============================

if (import.meta.main) {
  const glass = new Part()   // blue curtain wall
  const white = new Part()   // white slab-edge lines, spines, belt ledge, brow
  const podium = new Part()  // pale concrete podium
  const holes = new Part()   // podium openings
  const roof = new Part()
  const neon = new Part()    // blue LED line under the brow

  // OSM outline way/676817045 (podium, relation/13333747), world axes
  const PODIUM: XY[] = [[-20.6, 56.1], [-24.5, 39.6], [-26.5, 35.1], [-35.6, -6.9], [-38.8, -6.3], [-43.8, -25.7], [55.2, -50.5], [52.6, -41.3], [48.1, -29.9], [40.1, -17.7], [29.3, -1.4], [21.5, 16.0], [23.9, 23.4], [23.2, 31.3], [21.4, 35.6], [19.8, 38.1], [15.0, 42.0], [14.7, 47.7]]
  // tower in its own frame (turned 13°): lower slab = OSM part way/918579004; upper = lidar
  const LOWER13: XY[] = [[-19.7, 37.3], [-16.4, 41.0], [7.8, 41.0], [13.1, 29.3], [12.7, -24.2], [9.8, -27.4], [-17.1, -27.5], [-20.1, -24.2]]
  const UPPER13: XY[] = [[-11, 41.0], [7.8, 41.0], [13.1, 29.3], [12.7, -24.2], [9.8, -27.4], [-11, -27.5]]
  const BRG = 13

  const POD_TOP = 58, WING = 145, BROW0 = 248.5, ROOF = 254.5
  const pod = bevel(ccw(PODIUM), 0.6)
  const lower = bevel(ccw(turn(LOWER13, BRG)), 1.6)
  const upper = bevel(ccw(turn(UPPER13, BRG)), 1.6)

  // podium: concrete with grouped window bands, a parapet, the pool deck
  walls(pod, [[0, POD_TOP + 1.2, podium]])
  capRing(roof, pod, POD_TOP + 1.2)
  panels(holes, pod, 4, POD_TOP - 2, { bay: 14, pier: 1.8, rowH: 9, spandrel: 3.4, minEdge: 6 })
  // ground-floor glazing band (lobby, shops)
  panels(holes, pod, 0.6, 4, { bay: 9, pier: 1.2, rowH: 3.4, spandrel: 0.4, minEdge: 6 })

  // lower slab, podium to the west wing's ledge
  walls(lower, [[POD_TOP + 1.2, WING - 1.4, glass], [WING - 1.4, WING, white]])
  capRing(roof, lower, WING)
  // upper slab
  walls(upper, [[WING, BROW0, glass]])
  // white brow: a band standing a little proud of the glass, round the top
  const brow = offset(upper, 0.9)
  walls(brow, [[BROW0, ROOF - 0.8, neon], [ROOF - 0.8, ROOF, white]])
  capRing(white, brow, BROW0, false)
  capRing(roof, brow, ROOF)
  // rooftop plant and mast base
  box(roof, ...turnPt([1, 6], BRG), 14, 18, ROOF, 257.5, BRG)

  // floor-group lines every three floors (3 m storeys) and the white spines
  const lines = (from: number, to: number) => { const z: number[] = []; for (let h = from + 6; h < to - 2; h += 6) z.push(h); return z }
  hbands(white, lower, lines(POD_TOP + 1, WING - 1.4), 1.0, 0.05, 1)
  hbands(white, upper, lines(WING, BROW0 - 1), 1.0, 0.05, 1)
  // white edges on the chamfered corners, full height
  for (const [r, z0, z1] of [[lower, POD_TOP + 1.2, WING - 1.4], [upper, WING, BROW0]] as [XY[], number, number][])
    for (const e of edges(r)) if (e.L < 3) edgeRect(white, e, 0, e.L, z0, z1, 0.06)
  vlines(white, lower, POD_TOP + 1.2, WING - 1.4, 17, 1.2, 0.06, 30)
  vlines(white, upper, WING, BROW0 - 1, 17, 1.2, 0.06, 30)

  await build('Panorama Tower', 'mia-panorama-tower', [
    { part: glass, material: windowVariant(2, 0x5f7579) },
    { part: white, material: PALETTE.trim },
    { part: podium, material: finish('panorama-concrete', 0xe6dccb) },
    { part: holes, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: neon, material: finish('neon-panorama-blue', 0x4a8ee8) },
  ], { bearing: 0, elevation: 0, height: 257.5, replaces: ['way/676817045', 'way/918579004', 'relation/13333747'] }, process.argv[2])
}
