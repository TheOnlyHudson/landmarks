/**
 * Maiden Tower (Qız Qalası), Icherisheher, Baku: procedural, CC0-1.0.
 *   bun generators/baku-maiden-tower.ts   (writes the low and the detail model)
 *
 * Also the shared kit for the Baku batch models by the same builder
 * (baku-shirvanshahs-palace, baku-carpet-museum, baku-government-house,
 * baku-bibi-heybat-mosque): `wallLoop`, `cylPath`, `writeModel` and the
 * small helpers below. The tower's own geometry is under `import.meta.main`.
 *
 * Identity, in order: a squat stone cylinder 29.5 m tall and 16.5 m across;
 * the long buttress that runs out of its east side as tall as the tower, a
 * broad squared block for its lower 60 % and a narrower round-ended wall
 * above; the projecting stone courses that ridge the upper half of both
 * (each course's underside casts a dark line); the rounded coping round the
 * top; narrow slit windows climbing round the drum with the stair inside;
 * the low round-ended stretch of city wall that leaves the buttress's end
 * to the north-north-east.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the OSM outline way/299418016, at 49.837240, 40.366143.
 * y = 0 is the lowest ground under the footprint (the south side).
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): way/299418016 building, historic=castle,
 *   the tower and buttress outline; way/418164347 building:part,
 *   man_made=tower, height 29.5, the drum. A circle fitted to the drum's
 *   vertices: centre (-2.17, 0.46), r 8.31 (16.6 m across; published 16.5).
 *   The buttress: its end edge (15.54,-6.37)-(16.14,-3.45), 18.8 m from the
 *   drum's centre on compass 106.6. The Old City outline (way/152190481,
 *   place=neighbourhood) follows the city wall, which leaves the buttress's
 *   end north-north-east, (16.14,-3.45) -> (29.7, 20.2).
 * - Published: Wikipedia "Maiden Tower (Baku)": 29.5 m high, 16.5 m across
 *   at the base, eight floors, the long solid projection to the east, the
 *   door to the south-east, an observation deck on the roof (glass barrier
 *   since 2011), local limestone in courses.
 * - Photos (Wikimedia Commons, evidence):
 *   p1 Diego Delso, CC BY-SA 4.0, "Torre de la Doncella, Baku, Azerbaiyán,
 *      2016-09-26, DD 08.jpg": from about compass 125, the buttress end-on,
 *      its squared lower block, the low wall to its right (north)
 *      https://commons.wikimedia.org/wiki/File:Torre_de_la_Doncella,_Baku,_Azerbaiy%C3%A1n,_2016-09-26,_DD_08.jpg
 *   p2 Diego Delso, CC BY-SA 4.0, "... DD 06.jpg": the drum from the
 *      west-south-west (the buttress hidden behind it), the arched door up
 *      a short stair, the courses
 *      https://commons.wikimedia.org/wiki/File:Torre_de_la_Doncella,_Baku,_Azerbaiy%C3%A1n,_2016-09-26,_DD_06.jpg
 *   p4 Ludvig14, CC BY-SA 4.0, "Baku Maiden Tower 004 7736.jpg": the same
 *      side as p1, colours in daylight, the arched window
 *      https://commons.wikimedia.org/wiki/File:Baku_Maiden_Tower_004_7736.jpg
 *   p6 shankar s., CC BY 2.0, "Unusual construction of the Maiden Tower,
 *      Baku (36898425612).jpg": the drum and the buttress's flank
 *      https://commons.wikimedia.org/wiki/File:Unusual_construction_of_the_Maiden_Tower,_Baku_(36898425612).jpg
 *   p7 Sefer azeri, CC BY-SA 4.0, "Qız qalası ümumi 2016.jpg": the whole
 *      tower in sun, slit windows, proportions
 *      https://commons.wikimedia.org/wiki/File:Q%C4%B1z_qalas%C4%B1_%C3%BCmumi_2016.jpg
 *   p10 Wertuose, CC BY-SA 3.0, "Maiden Tower, Baku, Azerbaijan.jpg": from
 *      a distance with the buttress side on
 *      https://commons.wikimedia.org/wiki/File:Maiden_Tower,_Baku,_Azerbaijan.jpg
 *   n1 Avisadehh, CC0, "MAIDEN TOWER BAKU AT NIGHT A": floodlit warm white
 *      https://commons.wikimedia.org/wiki/File:MAIDEN_TOWER_BAKU_AT_NIGHT_A.%D7%9E%D7%92%D7%93%D7%9C_%D7%94%D7%A2%D7%97%D7%9E%D7%94_%D7%91%D7%90%D7%A7%D7%95_%D7%91%D7%9C%D7%99%D7%9C%D7%94_%D7%90.jpg
 * - Look-only: none.
 *
 * Numbers
 * - Plan: measured from OSM (above). The buttress's upper wall 5.0 m wide
 *   with a half-round end, its lower block 6.2 m wide and squared: widths
 *   estimated from p1 and p4 against the drum (OSM draws the end 3 m wide,
 *   which no photo shows).
 * - Heights: 29.5 published, for the drum and the buttress alike (p5 and
 *   p10 show their tops meeting level). The lower block 17.7 (0.6 of the
 *   height in p4 and p7); the ridged courses from 12.5 on the drum (0.42 of
 *   the height, p2, p4, p7) and from the block's top on the buttress; the
 *   courses' pitch about 0.55 m (p2), drawn at 1.0 m in the low model.
 * - The drum's slight batter (r 8.31 at the foot to 8.06 at the top) is
 *   estimated from p2 and p10.
 * - The north wall: 13.5 m high, 5 m thick, about 12 m long with a round
 *   end, estimated from p1 and p4; placed on the Old City outline.
 * - Colour: the limestone sampled in sun #c09966, #c5a575, #b19976 (p1, p2)
 *   and #a27a49 (p4, warmer light), shade #9c815c; drawn #c2a67d.
 *
 * Doubts
 * - The north wall stretch is not mapped in OSM as a building; its length
 *   and its round end are from photos only. Other low walls round the
 *   tower's foot are left out.
 * - The slit windows: a column up the south side and the round-headed
 *   window by the buttress's root are read from p1, p4, p7 and p10; the few
 *   on the north and west are placed by the same rhythm, as no photo shows
 *   those sides well. Drawn wider in the low model so they survive at
 *   phone size. The roof's glass barrier is left out.
 * - The door: Wikipedia puts it to the south-east, but p2 shows it with the
 *   buttress hidden behind the drum, which puts it on the west side, facing
 *   the Old City; the model follows the photo (compass 262). Its metal stair
 *   is left out.
 * - Terrain: Mapterhorn here is z12 only; it shows the ground rising about
 *   3 m from south to north across the tower, as the photos do (the rock
 *   the tower stands on shows on the east). The north side sinks into it.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, flat, type XY } from './sf-de-young'

// ---------------------------------------------------------------------------
// Shared kit

export const TAU = Math.PI * 2
const nz = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** One vertex of a plan path: position, outward horizontal normal, arc length. */
export type PathPt = { p: XY; n: XY; s: number }
/** A rectangular hole in a wall, in the wall's (s, z) frame, and its recess depth. */
export type Hole = { s0: number; s1: number; z0: number; z1: number; depth?: number; part?: Part; reveal?: Part }

/** Arc lengths along a list of {p, n}. */
export function withS(pts: Array<{ p: XY; n: XY }>): PathPt[] {
  let s = 0
  return pts.map((q, i) => {
    if (i) s += Math.hypot(q.p[0] - pts[i - 1].p[0], q.p[1] - pts[i - 1].p[1])
    return { ...q, s }
  })
}

/**
 * A polygon as a closed path with sharp corners: each edge its own column
 * with its own outward normal, and a zero-length column at each corner that
 * fills the wedge where proud courses and cornices meet. Any winding.
 */
export function polyPath(ring0: XY[]): PathPt[] {
  const a = ring0.reduce((s, p, i) => { const q = ring0[(i + 1) % ring0.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const ring = a > 0 ? ring0 : [...ring0].reverse()
  const pts: Array<{ p: XY; n: XY }> = []
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length], l = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1
    const n: XY = [(B[1] - A[1]) / l, -(B[0] - A[0]) / l]
    pts.push({ p: A, n }, { p: B, n })
  }
  pts.push(pts[0])
  return withS(pts)
}

/** The s at a distance `d` along edge `k` (from its start) of a polyPath. */
export const sOnEdge = (path: PathPt[], k: number, d: number) => path[2 * k].s + d

/** A circle as a closed path, `n` columns from compass bearing `b0` (degrees) clockwise. */
export function cylPath(c: XY, r: number, n: number, b0 = 0): PathPt[] {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const b = ((b0 + (360 * i) / n) * Math.PI) / 180
    const u: XY = [Math.sin(b), Math.cos(b)]
    return { p: [c[0] + r * u[0], c[1] + r * u[1]] as XY, n: u }
  })
  return withS(pts)
}

/** The s of compass bearing `b` (degrees) on a cylPath, snapped to the middle of its column. */
export function sOnCyl(path: PathPt[], b0: number, b: number) {
  const n = path.length - 1, step = 360 / n
  const k = Math.floor((((b - b0) % 360) + 360) % 360 / step)
  return (path[k].s + path[k + 1].s) / 2
}

/** The offset of a profile at height z (the first band that holds it). */
export function offAt(prof: Array<[number, number]>, z: number) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [o0, z0] = prof[k], [o1, z1] = prof[k + 1]
    if (z1 > z0 && z >= z0 - 1e-9 && z <= z1 + 1e-9) return o0 + ((o1 - o0) * (z - z0)) / (z1 - z0)
  }
  return prof[z < prof[0][1] ? 0 : prof.length - 1][0]
}

/**
 * A wall swept along a plan path with a profile of (offset, z) points from
 * bottom to top: offsets push the wall out along the path's normals, so
 * projecting courses, copings and parapets are real relief. Holes are cut
 * through it as real recesses: the opening, its reveals and a back panel
 * (`hole.part`, a window or door) `depth` behind the wall. A hole must fall
 * inside one column of the path.
 */
export function wallLoop(wall: Part, path: PathPt[], prof: Array<[number, number]>, holes: Hole[] = []) {
  const P = (i: number, t: number, off: number, z: number): V3 => {
    const a = path[i], b = path[i + 1]
    return [a.p[0] + (b.p[0] - a.p[0]) * t + (a.n[0] + (b.n[0] - a.n[0]) * t) * off, a.p[1] + (b.p[1] - a.p[1]) * t + (a.n[1] + (b.n[1] - a.n[1]) * t) * off, z]
  }
  const N = (i: number, t: number, bh: number, bv: number): V3 => {
    const a = path[i].n, b = path[i + 1].n
    const h = nz([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0])
    return nz([h[0] * bh, h[1] * bh, bv])
  }
  for (let k = 0; k < prof.length - 1; k++) {
    const [o0, z0] = prof[k], [o1, z1] = prof[k + 1]
    const dO = o1 - o0, dZ = z1 - z0
    if (Math.abs(dO) < 1e-9 && Math.abs(dZ) < 1e-9) continue
    const bl = Math.hypot(dO, dZ), bh = dZ / bl, bv = -dO / bl
    const at = (u: number): [number, number] => [o0 + dO * u, z0 + dZ * u]
    for (let i = 0; i < path.length - 1; i++) {
      const sa = path[i].s, sb = path[i + 1].s
      const corner = sb - sa < 1e-9 // a corner's wedge: no length, but its offsets differ
      if (corner && Math.abs(path[i].n[0] - path[i + 1].n[0]) + Math.abs(path[i].n[1] - path[i + 1].n[1]) < 1e-9) continue
      // rect pieces in (t across the column, u up the band)
      let pieces: Array<[number, number, number, number]> = [[0, 1, 0, 1]]
      for (const h of holes) {
        if (corner || h.s1 <= sa || h.s0 >= sb) continue
        let c: number, d: number
        if (Math.abs(dZ) > 1e-9) { c = (h.z0 - z0) / dZ; d = (h.z1 - z0) / dZ; if (c > d) [c, d] = [d, c] }
        else if (z0 > h.z0 && z0 < h.z1) { c = 0; d = 1 } else continue
        c = Math.max(0, c); d = Math.min(1, d)
        if (d <= c) continue
        const a = Math.max(0, (h.s0 - sa) / (sb - sa)), b = Math.min(1, (h.s1 - sa) / (sb - sa))
        const next: typeof pieces = []
        for (const [t0, t1, u0, u1] of pieces) {
          if (b <= t0 || a >= t1 || d <= u0 || c >= u1) { next.push([t0, t1, u0, u1]); continue }
          const A = Math.max(a, t0), B = Math.min(b, t1), C = Math.max(c, u0), D = Math.min(d, u1)
          if (C > u0) next.push([t0, t1, u0, C])
          if (D < u1) next.push([t0, t1, D, u1])
          if (A > t0) next.push([t0, A, C, D])
          if (B < t1) next.push([B, t1, C, D])
        }
        pieces = next
      }
      for (const [t0, t1, u0, u1] of pieces) {
        const [oa, za] = at(u0), [ob, zb] = at(u1)
        const q = [P(i, t0, oa, za), P(i, t1, oa, za), P(i, t1, ob, zb), P(i, t0, ob, zb)]
        const n = [N(i, t0, bh, bv), N(i, t1, bh, bv), N(i, t1, bh, bv), N(i, t0, bh, bv)]
        wall.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
        wall.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
      }
    }
  }
  // the recesses
  for (const h of holes) {
    const i = path.findIndex((q, j) => j < path.length - 1 && path[j + 1].s - q.s > 1e-6 && h.s0 >= q.s - 1e-6 && h.s1 <= path[j + 1].s + 1e-6)
    if (i < 0) throw new Error(`hole ${h.s0}-${h.s1} crosses a column`)
    const sa = path[i].s, sb = path[i + 1].s
    const ta = (h.s0 - sa) / (sb - sa), tb = (h.s1 - sa) / (sb - sa)
    const depth = h.depth ?? 0.5
    const back = Math.min(offAt(prof, h.z0), offAt(prof, h.z1)) - depth
    // z samples up the jambs, with every profile corner between
    const zs = [h.z0, ...prof.map((q) => q[1]).filter((z) => z > h.z0 + 1e-6 && z < h.z1 - 1e-6), h.z1]
    const outer: Array<[number, number]> = []
    for (const z of zs) {
      const at = prof.filter((q) => Math.abs(q[1] - z) < 1e-6)
      if (at.length > 1) for (const q of at) outer.push([q[0], z])
      else outer.push([offAt(prof, z), z])
    }
    const rv = h.reveal ?? wall
    const mt = (ta + tb) / 2
    const inward = (t: number): V3 => { const n = N(i, t, 1, 0); return [-n[0], -n[1], 0] }
    // jambs
    for (const [t, side] of [[ta, 1], [tb, -1]] as const) {
      const a = path[i], b = path[i + 1]
      const along = nz([b.p[0] - a.p[0], b.p[1] - a.p[1], 0])
      const nrm: V3 = [along[0] * side, along[1] * side, 0]
      for (let k = 0; k < outer.length - 1; k++) {
        const [oa, za] = outer[k], [ob, zb] = outer[k + 1]
        if (Math.abs(zb - za) < 1e-9) continue
        const q = [P(i, t, oa, za), P(i, t, ob, zb), P(i, t, back, zb), P(i, t, back, za)]
        rv.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nrm, nrm, nrm])
        rv.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nrm, nrm, nrm])
      }
    }
    // sill and head
    for (const [z, o, up] of [[h.z0, outer[0][0], 1], [h.z1, outer[outer.length - 1][0], -1]] as const) {
      const nrm: V3 = [0, 0, up]
      const q = [P(i, ta, o, z), P(i, tb, o, z), P(i, tb, back, z), P(i, ta, back, z)]
      rv.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nrm, nrm, nrm])
      rv.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nrm, nrm, nrm])
    }
    // the back panel
    const bp = h.part ?? wall, nb = inward(mt).map((v) => -v) as V3
    const q = [P(i, ta, back, h.z0), P(i, tb, back, h.z0), P(i, tb, back, h.z1), P(i, ta, back, h.z1)]
    bp.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nb, nb, nb])
    bp.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nb, nb, nb])
  }
}

/** A flat cap over a path's ring at offset `off`, height z (closing chord included). */
export function capPath(p: Part, path: PathPt[], off: number, z: number, up = true) {
  const ring: XY[] = path.map((q) => [q.p[0] + q.n[0] * off, q.p[1] + q.n[1] * off])
  if (Math.hypot(ring[0][0] - ring[ring.length - 1][0], ring[0][1] - ring[ring.length - 1][1]) < 1e-6) ring.pop()
  flat(p, ring, z, up)
}

/**
 * Projecting courses: (offset, z) points for `n` courses from z0, pitch
 * `pitch`, each `d` proud with a flat underside, a vertical face `face` of
 * the pitch tall and a bed sloping back to the wall, on a base offset
 * function. Seen from above, the vertical faces and the sloped beds light
 * differently, so the courses read as bands as they do in photos.
 */
export function courses(base: (z: number) => number, z0: number, n: number, pitch: number, d: number, face = 0.35): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let k = 0; k < n; k++) {
    const z = z0 + k * pitch
    out.push([base(z), z], [base(z) + d, z], [base(z + face * pitch) + d, z + face * pitch])
  }
  out.push([base(z0 + n * pitch), z0 + n * pitch])
  return out
}

/** Write a GLB, check its budget and print a line. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, meta: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter((q) => q.part.triangles > 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...meta })
  const tris = used.reduce((s, q) => s + q.part.triangles, 0)
  if (process.env.PARTS) console.log(file, used.map((q) => `${q.material.name}:${q.part.triangles}`).join(' '))
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles > ${maxTris}`)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes > ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// The Maiden Tower

const C: XY = [-2.17, 0.46], R0 = 8.31, H = 29.5
const BRG = 106.6 // the buttress's axis, compass
const AX: XY = [Math.sin((BRG * Math.PI) / 180), Math.cos((BRG * Math.PI) / 180)]
const PERP: XY = [AX[1], -AX[0]] // to the buttress's right (south-south-west)
const L_END = 18.8 // drum centre to the buttress's end

function build(detail: boolean) {
  const stone = new Part(), deck = new Part(), slit = new Part(), door = new Part()
  const NC = detail ? 40 : 24
  const PITCH = detail ? 0.55 : 1.0
  const taper = (z: number) => -0.25 * (z / H)
  const Z_RIB = 12.5, Z_TOP = 28.9

  // ---- the drum ----
  const drum = cylPath(C, R0, NC, 0)
  const nRib = Math.round((Z_TOP - Z_RIB) / PITCH)
  const pitch = (Z_TOP - Z_RIB) / nRib
  const coping = (base: number): Array<[number, number]> => [[base + 0.32, Z_TOP + 0.1], [base + 0.32, 29.3], [base + 0.12, H], [base - 0.75, H], [base - 0.75, H - 0.5]]
  const drumProf: Array<[number, number]> = [[0, 0], [taper(Z_RIB), Z_RIB], ...courses(taper, Z_RIB, nRib, pitch, detail ? 0.2 : 0.28).slice(1), ...coping(taper(Z_TOP))]
  // windows: the stair's slits climb round the drum; the door; the arched window
  const holes: Hole[] = []
  const hole = (b: number, z0: number, w: number, h: number, part: Part, depth = 0.6) => {
    const s = sOnCyl(drum, 0, b)
    holes.push({ s0: s - w / 2, s1: s + w / 2, z0, z1: z0 + h, depth, part })
  }
  hole(262, 1.8, 1.2, 2.6, door, 0.5) // the door, up its stair, towards the Old City (p2)
  // a column of slits up the south side, one per stage of the stair (p1, p4, p7, p10)
  for (const z of [4.4, 7.2, 10.0, 17.8, 20.4, 23.0, 25.6]) hole(190, z, detail ? 0.36 : 0.55, detail ? 1.4 : 1.8, slit)
  hole(150, 14.2, 0.85, 1.8, slit, 0.7) // the round-headed window by the buttress's root (p4, p7)
  // a few more on the sides no photo shows well, by the same rhythm
  for (const [b, z] of [[300, 9.0], [300, 19.5], [30, 13.0], [30, 23.5], [235, 26.0]]) hole(b, z, detail ? 0.36 : 0.55, detail ? 1.4 : 1.8, slit)
  wallLoop(stone, drum, drumProf, holes)
  {
    const top = drumProf[drumProf.length - 1][0]
    capPath(deck, drum, top, H - 0.5)
  }

  // ---- the buttress ----
  const along = (d: number, side: number): XY => [C[0] + AX[0] * d + PERP[0] * side, C[1] + AX[1] * d + PERP[1] * side]
  // the upper wall: flanks 5.0 m apart from inside the drum, a half-round end
  {
    const hw = 2.5, d0 = Math.sqrt((R0 - 0.45) ** 2 - hw * hw), dc = L_END - hw
    const NE = detail ? 12 : 8
    const pts: Array<{ p: XY; n: XY }> = []
    const nR: XY = PERP, nL: XY = [-PERP[0], -PERP[1]]
    const nf = detail ? 3 : 1
    for (let k = 0; k <= nf; k++) pts.push({ p: along(d0 + ((dc - d0) * k) / nf, hw), n: nR })
    for (let k = 1; k < NE; k++) {
      const a = -Math.PI / 2 + (Math.PI * k) / NE // from the right flank round the end
      const u: XY = [AX[0] * Math.cos(a) - PERP[0] * Math.sin(a), AX[1] * Math.cos(a) - PERP[1] * Math.sin(a)]
      pts.push({ p: [along(dc, 0)[0] + u[0] * hw, along(dc, 0)[1] + u[1] * hw], n: u })
    }
    for (let k = 0; k <= nf; k++) pts.push({ p: along(dc - ((dc - d0) * k) / nf, -hw), n: nL })
    const path = withS(pts)
    const Z0 = 17.0
    const nB = Math.round((Z_TOP - 17.7) / PITCH), pb = (Z_TOP - 17.7) / nB
    const flatB = () => 0
    const prof: Array<[number, number]> = [[0, Z0], [0, 17.7], ...courses(flatB, 17.7, nB, pb, detail ? 0.2 : 0.28).slice(1), [0.3, Z_TOP + 0.1], [0.3, 29.3], [0.1, H], [0, H]]
    wallLoop(stone, path, prof)
    capPath(deck, path, 0, H)
  }
  // the lower block: squared, 6.2 m wide, to 17.7
  {
    const hw = 3.1, d0 = Math.sqrt((R0 - 0.6) ** 2 - hw * hw), d1 = L_END + 0.15
    const ring: XY[] = [along(d0, hw), along(d1, hw), along(d1, -hw), along(d0, -hw)]
    prism(stone, ring, 0, 17.7, stone, 0.35)
  }
  // ---- the north stretch of city wall: from the buttress's end, round-ended ----
  {
    const o: XY = [16.14, -3.45], dir: XY = [0.5, 0.866], inn: XY = [-0.866, 0.5]
    const len = 12, th = 5.0, r = th / 2
    const P2 = (a: number, b: number): XY => [o[0] + dir[0] * a + inn[0] * b, o[1] + dir[1] * a + inn[1] * b]
    const ring: XY[] = [P2(-1.5, 0), P2(len - r, 0)]
    const NE = detail ? 10 : 6
    for (let k = 1; k < NE; k++) {
      const a = -Math.PI / 2 + (Math.PI * k) / NE
      ring.push(P2(len - r + r * Math.cos(a), r + r * Math.sin(a)))
    }
    ring.push(P2(len - r, th), P2(-1.5, th))
    prism(stone, ring, 0, 13.5, stone, 0.35)
  }
  return { stone, deck, slit, door }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.85)
    return [
      { part: p.stone, material: { ...finish('maiden-limestone', 0xc2a67d), floodlight: lit } },
      { part: p.deck, material: { ...finish('maiden-deck', 0xa89074) } },
      { part: p.slit, material: { ...finish('maiden-slit', 0x4d4237, 0.9) } },
      { part: p.door, material: PALETTE.entrance },
    ]
  }
  const meta = { bearing: 0, osm: 'way/299418016', height: 29.5 }
  await writeModel('baku-maiden-tower.glb', 'Maiden Tower', make(false), meta, 5000, 250 * 1024)
  await writeModel('baku-maiden-tower.detail.glb', 'Maiden Tower', make(true), meta, 40000, 1536 * 1024)
}
