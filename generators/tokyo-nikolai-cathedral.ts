/**
 * Holy Resurrection Cathedral (東京復活大聖堂, "Nikolai-dō", ニコライ堂),
 * Kanda-Surugadai, Chiyoda, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-nikolai-cathedral.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 *
 * Byzantine-revival Orthodox cathedral: Mikhail Shchurupov's design, built
 * by Josiah Conder, 1891; rebuilt after the 1923 earthquake by Okada
 * Shin'ichirō (1929) with a taller domed drum, a lower bell tower and
 * mansard roofs. Identity, in order: the big green ribbed copper dome on a
 * dark drum ringed with arched windows, its rim scalloped over each window;
 * the white octagonal base under it with little green-roofed gablets; the
 * squat Greek cross of white stuccoed arms with dark string courses and
 * arched windows, each arm ending in a white gable with a cross; the west
 * front with the bell tower (a square stage, an octagonal belfry, a small
 * green dome) between two corner turrets; the green half-dome over the
 * east apse; Orthodox three-bar crosses on every dome.
 *
 * Frame: origin at the outline's centroid (139.765501, 35.698022), bearing
 * 23.2 (the arms' walls run at 23.2 / 113.2 degrees), so the nave axis runs
 * along the model's x: the bell tower at -x (west-north-west), the apse at
 * +x. The churchyard is level (on the 8 m-high terrace walled above the
 * streets to the south and east; tools/terrain.ts grid), but the map's
 * terrain, sampled at about 2 m, smears the terrace wall's drop in under
 * the apse, so the lowest ground under the footprint is 2.8 m below the
 * churchyard (tools/terrain.ts check). y = 0 is that low point; the church
 * is built on the churchyard at ZG = 2.8 m with its dark base run down to
 * y = 0, so it sinks into the terrace everywhere but at the apse. Heights
 * below are above the churchyard. elevation 0.
 *
 * Plan (OSM, measured): relation/4080936 (the outline) and its parts:
 * way/273260343 the crossing (19 m, chamfered square, height 18, mansard),
 * way/273260342 the drum (an octagon 17 m across, height 20),
 * way/273258751 the dome (15.6 m across, height 30, roof:height 7),
 * relations 9581986-9 and 4080937 the crossing square and the four arms
 * (height 15, gabled, roof:height 3), relation/7904399 the narthex
 * (height 11), relation/7904398 the tower (height 15) and way/553266118
 * its dome (5.4 m across, height 23).
 * Heights (published / estimated):
 *  - dome 35 m to the top (ja.wikipedia: "高さ35メートル"; read here as to
 *    the cross); the dome itself 23-30.6 m (OSM 30, roof:height 7);
 *  - the arms' eaves 12, ridges 15 (OSM); the octagonal base 12-18.6 (OSM
 *    18); the drum 18.6-23 m, radius 8.0 (OSM 20 at its own outline; the
 *    photos, Lcsschiller 2019, put the drum's window ring at 0.55 of the
 *    dome's height: estimated);
 *  - the narthex 11 m (OSM); the bell tower rescaled after review from
 *    Kakidai's frontal photo (2018) against the 11 m front: the base
 *    storey to 12 m, the corbel-arch frieze 11.8-13.2, the round-window
 *    stage to 15.3, a cornice, the panelled stage 16.2-17.8, the top
 *    cornice to 18.8 (all 7 m wide, OSM 7.1); the belfry an open ring of
 *    eight columns 19.3-22.4 m on a 5.7 m circle under round arches, green
 *    copper over them, the low dome to 25.4, the cross to 29.4 m (2.6
 *    times the front's eave, as in the photo)
 *    (estimated by scaling Kakidai's frontal views 2018/2019 against the
 *    11 m front; OSM's 23 m for the tower dome read as its springing);
 *  - string courses and window heights scaled from the same photos.
 * Colours (daylight photos): walls a warm white #ece7dc; trim, string
 * courses, window hoods, the drum and the base a dark grey-brown #77706a
 * (pulled lighter than the photos' #5d5853); copper #6fae98 (the photos'
 * verdigris #4d9a80, pulled to the palette's lightness); roofs grey
 * #8e969b; doors teal (drawn in copper).
 * Night: the cathedral is floodlit from below (night photos on Commons are
 * few; the walls and dome are lit); the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Tokyo Resurrection Cathedral March 2019.jpg, Lcsschiller, CC BY-SA 4.0 (from the east-south-east: dome, apse, south arm)
 *  - Holy Resurrection Cathedral, Tokyo, North view 20190422 1.jpg, DXR, CC BY-SA 4.0 (north)
 *  - 2018 Tokyo Resurrection Cathedral.jpg, 2019 ... 01.jpg, 2019 ... 02.jpg, Kakidai, CC BY-SA 4.0 (west front, tower)
 *  - Tokyo Resurrection Cathedral 201000.jpg, 201001.jpg, Wiiii, CC BY-SA 3.0 (north-west, south)
 *  - Tokyo Resurrection Cathedral 20200119 110744.jpg, Prcmd, CC BY-SA 4.0 (east)
 *  - Holy Resurrection Cathedral @ Ochanomizu (9116611674).jpg / (9114381483).jpg, Guilhem Vellut, CC BY 2.0 (tower, gate)
 *  - Holy Resurrection Cathedral in Tokyo - domedetail - jan 29 - 2015.jpg, Nesnad, CC BY 3.0 (dome ribs, scallops, lantern)
 *  - Nicholai-Do exterior.jpg, Matt Perreault, CC BY-SA 2.0 (tower and dome)
 * No look-only references.
 * Doubts: the inside of the crossing's octagonal base and the backs of the
 * arms' gables are drawn plainly; the window count on the north and south
 * arms follows the south arm (Lcsschiller) mirrored; the narthex roof is
 * hidden behind its parapet in every photo (drawn as a low hip).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, capPoly, writeModel, rect, type XY, type Layer } from './tokyo-metropolitan-government-building'
import { lathe as lathe2, quadOut, triOut, ball, bar, disc } from './tokyo-sensoji'

const TAU = Math.PI * 2
/** The churchyard above the lowest map ground under the footprint (tools/terrain.ts check). */
const ZG = 2.8
type Lod = { detail: boolean; k: number; arc: number }
const LOW: Lod = { detail: false, k: 32, arc: 5 }
const DETAIL: Lod = { detail: true, k: 48, arc: 10 }

type P = { wall: Part; trim: Part; cu: Part; roof: Part; win: Part; door: Part }

/** A wall plane: point a, unit tangent u (along the wall, counter-clockwise from above), outward normal n = (u.y, -u.x). */
type Wall = { a: XY; u: XY }
const at = (w: Wall, s: number, z: number, out: number): V3 => [w.a[0] + w.u[0] * s + w.u[1] * out, w.a[1] + w.u[1] * s - w.u[0] * out, z]

/** A round-headed shape on a wall: centre s, sill z0, width w, springing at z0 + h; returns ring points (ccw seen from outside). */
function archRing(w: Wall, s: number, z0: number, wd: number, h: number, out: number, seg: number, grow = 0): V3[] {
  const r = wd / 2 + grow, pts: V3[] = []
  pts.push(at(w, s - r, z0 - grow, out), at(w, s + r, z0 - grow, out))
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI
    pts.push(at(w, s + r * Math.cos(t), z0 + h + r * Math.sin(t), out))
  }
  return pts
}
/** A flat fan of an arch ring (convex), wound to face out. */
function fan(p: Part, ring: V3[], n: V3) {
  const c: V3 = ring.reduce((m, q) => [m[0] + q[0] / ring.length, m[1] + q[1] / ring.length, m[2] + q[2] / ring.length], [0, 0, 0] as V3)
  for (let i = 0; i < ring.length; i++) triOut(p, c, ring[i], ring[(i + 1) % ring.length], n)
}
/** An arched window: a dark hood band round a window panel. */
function archWin(P: P, w: Wall, s: number, z0: number, wd: number, h: number, L: Lod, o: { hood?: number; glass?: Part } = {}) {
  const n: V3 = [w.u[1], -w.u[0], 0]
  const hood = o.hood ?? 0.35
  fan(P.trim, archRing(w, s, z0, wd, h, 0.04, L.arc, hood), n)
  fan(o.glass ?? P.win, archRing(w, s, z0, wd, h, 0.08, L.arc), n)
}

/** A horizontal band (string course) round a ring at z0..z1, standing `out` proud. */
function band(p: Part, ring: XY[], z0: number, z1: number, out: number) {
  prism(p, grow(ring, out), z0, z1, { bevel: 0.08, top: true, bottom: true })
}
function grow(r: XY[], d: number): XY[] {
  // axis-aligned and chamfered rings only: push each edge out by d
  const n = r.length, out: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = r[(i + n - 1) % n], b = r[i], c = r[(i + 1) % n]
    const e0 = norm2([b[0] - a[0], b[1] - a[1]]), e1 = norm2([c[0] - b[0], c[1] - b[1]])
    const n0: XY = [e0[1], -e0[0]], n1: XY = [e1[1], -e1[0]]
    const k = 1 + n0[0] * n1[0] + n0[1] * n1[1]
    out.push([b[0] + ((n0[0] + n1[0]) * d) / k, b[1] + ((n0[1] + n1[1]) * d) / k])
  }
  return out
}
/** A flat band on a wall plane between s0..s1 and z0..z1, standing `out` proud. */
function band2(p: Part, w: Wall, s0: number, s1: number, z0: number, z1: number, out: number) {
  const n: V3 = [w.u[1], -w.u[0], 0]
  quadOut(p, at(w, s0, z0, out), at(w, s1, z0, out), at(w, s1, z1, out), at(w, s0, z1, out), n)
  quadOut(p, at(w, s0, z1, out), at(w, s1, z1, out), at(w, s1, z1, 0), at(w, s0, z1, 0), [0, 0, 1])
  quadOut(p, at(w, s0, z0, 0), at(w, s1, z0, 0), at(w, s1, z0, out), at(w, s0, z0, out), [0, 0, -1])
}
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A gabled roof over x0..x1 × y0..y1, ridge along `along` ('x' or 'y'), eaves ze, ridge zr, overhang o; gable ends get wall triangles. */
function gable(P: P, x0: number, x1: number, y0: number, y1: number, along: 'x' | 'y', ze: number, zr: number, o = 0.5, ends: [boolean, boolean] = [true, true]) {
  if (along === 'x') {
    const ym = (y0 + y1) / 2
    const A: V3 = [x0 - o, y0 - o, ze - o * 0.3], B: V3 = [x1 + o, y0 - o, ze - o * 0.3], R0: V3 = [x0 - o, ym, zr], R1: V3 = [x1 + o, ym, zr]
    const C: V3 = [x1 + o, y1 + o, ze - o * 0.3], D: V3 = [x0 - o, y1 + o, ze - o * 0.3]
    quadOut(P.roof, A, B, R1, R0, [0, -1, 1]); quadOut(P.roof, C, D, R0, R1, [0, 1, 1])
    quadOut(P.roof, A, B, R1, R0, [0, 1, -1]); quadOut(P.roof, C, D, R0, R1, [0, -1, -1])
    if (ends[0]) { triOut(P.wall, [x0, y0, ze], [x0, y1, ze], [x0, ym, zr - 0.2], [-1, 0, 0]); coping(P, [x0 - o, y0 - o, ze - o * 0.3], [x0 - o, ym, zr], [x0 - o, y1 + o, ze - o * 0.3], [-1, 0, 0]) }
    if (ends[1]) { triOut(P.wall, [x1, y0, ze], [x1, y1, ze], [x1, ym, zr - 0.2], [1, 0, 0]); coping(P, [x1 + o, y0 - o, ze - o * 0.3], [x1 + o, ym, zr], [x1 + o, y1 + o, ze - o * 0.3], [1, 0, 0]) }
  } else {
    const xm = (x0 + x1) / 2
    const A: V3 = [x0 - o, y0 - o, ze - o * 0.3], B: V3 = [x0 - o, y1 + o, ze - o * 0.3], R0: V3 = [xm, y0 - o, zr], R1: V3 = [xm, y1 + o, zr]
    const C: V3 = [x1 + o, y1 + o, ze - o * 0.3], D: V3 = [x1 + o, y0 - o, ze - o * 0.3]
    quadOut(P.roof, A, B, R1, R0, [-1, 0, 1]); quadOut(P.roof, C, D, R0, R1, [1, 0, 1])
    quadOut(P.roof, A, B, R1, R0, [1, 0, -1]); quadOut(P.roof, C, D, R0, R1, [-1, 0, -1])
    if (ends[0]) { triOut(P.wall, [x0, y0, ze], [x1, y0, ze], [xm, y0, zr - 0.2], [0, -1, 0]); coping(P, [x0 - o, y0 - o, ze - o * 0.3], [xm, y0 - o, zr], [x1 + o, y0 - o, ze - o * 0.3], [0, -1, 0]) }
    if (ends[1]) { triOut(P.wall, [x0, y1, ze], [x1, y1, ze], [xm, y1, zr - 0.2], [0, 1, 0]); coping(P, [x0 - o, y1 + o, ze - o * 0.3], [xm, y1 + o, zr], [x1 + o, y1 + o, ze - o * 0.3], [0, 1, 0]) }
  }
}
/** The dark raking coping of a gable: two bands from eave to apex. */
function coping(P: P, a: V3, apex: V3, b: V3, n: V3) {
  const t = 0.35, d = 0.5
  for (const [p0, p1] of [[a, apex], [apex, b]] as [V3, V3][]) {
    const lo0: V3 = [p0[0] - n[0] * 0.05, p0[1] - n[1] * 0.05, p0[2] - d], lo1: V3 = [p1[0] - n[0] * 0.05, p1[1] - n[1] * 0.05, p1[2] - d]
    const f0: V3 = [p0[0] + n[0] * t, p0[1] + n[1] * t, p0[2]], f1: V3 = [p1[0] + n[0] * t, p1[1] + n[1] * t, p1[2]]
    const g0: V3 = [lo0[0] + n[0] * (t + 0.05), lo0[1] + n[1] * (t + 0.05), lo0[2]], g1: V3 = [lo1[0] + n[0] * (t + 0.05), lo1[1] + n[1] * (t + 0.05), lo1[2]]
    quadOut(P.trim, g0, g1, f1, f0, n)
    quadOut(P.trim, p0, p1, f1, f0, [0, 0, 1])
  }
}

/** A ribbed dome: profile [r, z] from springing to the top, `ribs` ribs standing out by `rib` of r. */
function ribDome(p: Part, cx: number, cy: number, prof: [number, number][], k: number, ribs: number, rib: number) {
  const rows = prof.map(([r, z]) => Array.from({ length: k + 1 }, (_, i) => {
    const a = (i / k) * TAU
    const m = ribs ? 1 + rib * Math.pow(Math.abs(Math.cos((a * ribs) / 2)), 3) : 1
    return [cx + r * m * Math.cos(a), cy + r * m * Math.sin(a), z] as V3
  }))
  for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < k; i++) {
    const A = rows[j][i], B = rows[j][i + 1], C = rows[j + 1][i + 1], D = rows[j + 1][i]
    const mid: V3 = [(A[0] + B[0]) / 2 - cx, (A[1] + B[1]) / 2 - cy, 0.3]
    if (Math.hypot(C[0] - D[0], C[1] - D[1]) < 1e-4) triOut(p, A, B, C, mid)
    else quadOut(p, A, B, C, D, mid)
  }
}
/** A dome profile: a stilted part-sphere of radius r from z0, rising h. */
function domeProf(r: number, z0: number, h: number, n: number, pinch = 0): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * (Math.PI / 2)
    out.push([Math.max(0.001, r * Math.cos(t) * (1 - pinch * Math.sin(t) ** 4)), z0 + h * Math.sin(t)])
  }
  return out
}

/** An Orthodox cross (three bars, the lowest slanted) standing at (x, y, z), h tall, in the plane facing x. */
function cross3(p: Part, x: number, y: number, z: number, h: number, faceY = false) {
  const t = h * 0.07
  const bx = (cx: number, cz: number, hw: number, hh: number, tilt = 0) => {
    const c = Math.cos(tilt), s = Math.sin(tilt)
    const pt = (u: number, v: number, d: number): V3 => {
      const uu = u * c - v * s, vv = u * s + v * c
      return faceY ? [x + uu + cx, y + d, z + cz + vv] : [x + d, y + uu + cx, z + cz + vv]
    }
    const Q = (d: number) => [pt(-hw, -hh, d), pt(hw, -hh, d), pt(hw, hh, d), pt(-hw, hh, d)]
    const f = Q(t), b = Q(-t)
    const nrm: V3 = faceY ? [0, 1, 0] : [1, 0, 0]
    const neg: V3 = [-nrm[0], -nrm[1], 0]
    quadOut(p, f[0], f[1], f[2], f[3], nrm); quadOut(p, b[0], b[1], b[2], b[3], neg)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; const mid = [(f[i][0] + f[j][0]) / 2, (f[i][1] + f[j][1]) / 2, (f[i][2] + f[j][2]) / 2]; const cen = pt(0, 0, 0); quadOut(p, f[i], f[j], b[j], b[i], [mid[0] - cen[0], mid[1] - cen[1], mid[2] - cen[2]]) }
  }
  bx(0, h / 2, t, h / 2)
  bx(0, h * 0.72, h * 0.3, t)
  bx(0, h * 0.88, h * 0.16, t * 0.8)
  bx(0, h * 0.3, h * 0.2, t * 0.8, -0.35)
}

function build(L: Lod) {
  const P: P = { wall: new Part(), trim: new Part(), cu: new Part(), roof: new Part(), win: new Part(), door: new Part() }
  const D = L.detail
  // ------------------------------------------------------------ plan
  const C: XY = [3.85, 0.1] // crossing centre
  const ZE = 12, ZR = 15
  // arms (walls to the eaves) and the crossing block
  const arms: Array<[number, number, number, number]> = [
    [-4.25, 11.9, 8.7, 15.3], // N
    [-4.25, 11.9, -15.2, -8.55], // S
    [11.9, 19.0, -8.6, 8.7], // E
    [-11.6, -4.25, -8.55, 8.7], // W (nave)
  ]
  // plinth (dark) and walls (white) of the cross: one outline
  const cross: XY[] = [[-11.6, -8.55], [-4.25, -8.55], [-4.25, -15.2], [11.9, -15.2], [11.9, -8.6], [19.0, -8.6], [19.0, 8.7], [11.9, 8.7], [11.9, 15.3], [-4.25, 15.3], [-4.25, 8.7], [-11.6, 8.7]]
  prism(P.wall, cross, 0, ZE, { bevel: 0.3, top: false })
  band(P.trim, cross, 0, 1.3, 0.25) // the dark stone base
  band(P.trim, cross, 5.6, 6.1, 0.12) // string course
  band(P.trim, cross, 10.9, ZE, 0.22) // corbel frieze under the eaves
  capPoly(P.roof, cross, ZE - 0.05)
  // porches on N and S
  for (const s of [1, -1]) {
    const y0 = s > 0 ? 15.3 : -15.2, y1 = s > 0 ? 17.2 : -17.2
    const x0 = s > 0 ? 0.9 : 0.4, x1 = s > 0 ? 6.6 : 7.4
    const ring: XY[] = s > 0 ? [[x0, y0 - 0.2], [x1, y0 - 0.2], [x1, y1], [x0, y1]] : [[x0, y1], [x1, y1], [x1, y0 + 0.2], [x0, y0 + 0.2]]
    prism(P.wall, ring, 0, 7.6, { bevel: 0.2, top: false })
    band(P.trim, ring, 0, 1.3, 0.2)
    band(P.trim, ring, 7.0, 7.6, 0.15)
    gable(P, x0, x1, Math.min(y0, y1), Math.max(y0, y1), 'y', 7.6, 9.6, 0.3, s > 0 ? [false, true] : [true, false])
    const w: Wall = s > 0 ? { a: [x1, y1], u: [-1, 0] } : { a: [x0, y1], u: [1, 0] }
    const wd = x1 - x0
    archWin(P, w, wd / 2, 1.3, 2.0, 2.4, L, { glass: P.door, hood: 0.4 })
    archWin(P, w, wd / 2, 5.0, 1.6, 0.4, L, { hood: 0.25 })
  }
  // arm roofs: gables at the arm ends
  gable(P, -4.25, 11.9, 8.7, 15.3, 'y', ZE, ZR, 0.5, [false, true])
  gable(P, -4.25, 11.9, -15.2, -8.55, 'y', ZE, ZR, 0.5, [true, false])
  gable(P, 11.9, 19.0, -8.6, 8.7, 'x', ZE, ZR, 0.5, [false, true])
  gable(P, -11.6, -4.25, -8.55, 8.7, 'x', ZE, ZR, 0.5, [false, false])
  // crosses on the gable apexes
  cross3(P.trim, 19.6, 0.05, ZR, 2.2)
  cross3(P.trim, C[0], 15.9, ZR, 2.2, true)
  cross3(P.trim, C[0], -15.8, ZR, 2.2, true)

  // arm windows: each arm end has a big central arched window over a
  // lower pair, the side walls one each storey
  const armEnds: Wall[] = [
    { a: [11.9, 15.3], u: [-1, 0] }, // N end, facing +y
    { a: [-4.25, -15.2], u: [1, 0] }, // S end, facing -y
  ]
  for (const w of armEnds) {
    const len = 16.15
    for (const s of [2.3, len - 2.3]) {
      archWin(P, w, s, 1.9, 1.4, 2.1, L)
      archWin(P, w, s, 6.8, 1.4, 2.0, L)
    }
    archWin(P, w, len / 2 + (w.u[0] > 0 ? 0 : 0), 7.0, 3.2, 1.6, L, { hood: 0.5 })
  }
  // E end: windows either side of the apse
  const we: Wall = { a: [19.0, -8.6], u: [0, 1] }
  for (const s of [2.4, 17.3 - 2.4]) { archWin(P, we, s, 1.9, 1.4, 2.1, L); archWin(P, we, s, 6.8, 1.4, 2.0, L) }
  // side walls of the arms (short returns)
  // [p0, p1, outward hint]
  const segs: Array<[XY, XY, XY]> = [
    [[-4.25, 8.7], [-4.25, 15.3], [-1, 0]], [[11.9, 8.7], [11.9, 15.3], [1, 0]],
    [[11.9, -15.2], [11.9, -8.6], [1, 0]], [[-4.25, -15.2], [-4.25, -8.55], [-1, 0]],
    [[11.9, -8.6], [19.0, -8.6], [0, -1]], [[11.9, 8.7], [19.0, 8.7], [0, 1]],
    [[-11.6, -8.55], [-4.25, -8.55], [0, -1]], [[-11.6, 8.7], [-4.25, 8.7], [0, 1]],
  ]
  const sides: Array<[Wall, number]> = segs.map(([p0, p1, h]) => {
    let a = p0, b = p1
    const u0 = norm2([b[0] - a[0], b[1] - a[1]])
    if (u0[1] * h[0] - u0[0] * h[1] < 0) [a, b] = [b, a]
    return [{ a, u: norm2([b[0] - a[0], b[1] - a[1]]) }, Math.hypot(b[0] - a[0], b[1] - a[1])]
  })
  for (const [w, len] of sides) {
    archWin(P, w, len / 2, 1.9, 2.0, 2.4, L)
    archWin(P, w, len / 2, 6.8, 2.0, 2.2, L)
  }

  // the east apse: a half-round projection with a green half-dome
  {
    const ax = 17.6, r = 3.6, k = L.detail ? 16 : 10
    const ring: XY[] = Array.from({ length: k + 1 }, (_, i) => { const a = -Math.PI / 2 + (i / k) * Math.PI; return [ax + r * Math.cos(a), r * Math.sin(a)] as XY })
    for (let i = 0; i < k; i++) {
      const a = ring[i], b = ring[i + 1]
      const m: V3 = [(a[0] + b[0]) / 2 - ax, (a[1] + b[1]) / 2, 0]
      quadOut(P.wall, [a[0], a[1], 1.3], [b[0], b[1], 1.3], [b[0], b[1], 8.6], [a[0], a[1], 8.6], m)
      quadOut(P.trim, [a[0] * 1 + (a[0] - ax) * 0.06, a[1] * 1.06, 0], [b[0] + (b[0] - ax) * 0.06, b[1] * 1.06, 0], [b[0] + (b[0] - ax) * 0.06, b[1] * 1.06, 1.3], [a[0] + (a[0] - ax) * 0.06, a[1] * 1.06, 1.3], m)
      quadOut(P.trim, [a[0] + (a[0] - ax) * 0.05, a[1] * 1.05, 8.2], [b[0] + (b[0] - ax) * 0.05, b[1] * 1.05, 8.2], [b[0] + (b[0] - ax) * 0.05, b[1] * 1.05, 8.9], [a[0] + (a[0] - ax) * 0.05, a[1] * 1.05, 8.9], m)
    }
    // half-dome (quarter sphere), ribbed
    const prof = domeProf(r + 0.2, 8.9, 3.4, L.detail ? 7 : 4)
    const rows = prof.map(([rr, z]) => Array.from({ length: k + 1 }, (_, i) => { const a = -Math.PI / 2 + (i / k) * Math.PI; return [ax + rr * Math.cos(a), rr * Math.sin(a), z] as V3 }))
    for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < k; i++) {
      const A = rows[j][i], B = rows[j][i + 1], Cc = rows[j + 1][i + 1], Dd = rows[j + 1][i]
      const mid: V3 = [(A[0] + B[0]) / 2 - ax, (A[1] + B[1]) / 2, 0.4]
      if (Math.hypot(Cc[0] - Dd[0], Cc[1] - Dd[1]) < 1e-4) triOut(P.cu, A, B, Cc, mid); else quadOut(P.cu, A, B, Cc, Dd, mid)
    }
    const aw: Wall = { a: [ax + r * Math.cos(-0.45), r * Math.sin(-0.45)], u: [-Math.sin(-0.45), Math.cos(-0.45)] }
    void aw
    // door and the arched window over it on the apse's axis
    const w0: Wall = { a: [ax + r + 0.02, -1], u: [0, 1] }
    archWin(P, w0, 1, 1.3, 1.5, 2.0, L, { glass: P.door, hood: 0.3 })
    archWin(P, w0, 1, 5.2, 1.2, 1.2, L, { hood: 0.25 })
  }

  // ------------------------------------------------------------ crossing
  // the white octagonal base (chamfered square 19 m) from the roofs to 18.6
  const oct: XY[] = [[-4.0, -9.2], [11.2, -9.0], [13.3, -7.3], [13.4, 7.5], [11.5, 9.6], [-3.9, 9.7], [-5.7, 8.0], [-5.7, -7.3]]
  const octIn = grow(oct, -1.1)
  prism(P.wall, octIn, ZE, 18.2, { bevel: 0.2, top: false })
  band(P.trim, octIn, 17.6, 18.6, 0.3)
  band(P.trim, octIn, 14.6, 14.9, 0.1)
  capPoly(P.roof, grow(octIn, 0.3), 18.6)
  // gablets on the diagonal faces, green roofed
  for (const [ang, rr] of [[Math.PI / 4, 11.2], [(3 * Math.PI) / 4, 11.2], [(-3 * Math.PI) / 4, 11.2], [-Math.PI / 4, 11.2]] as [number, number][]) {
    const cx = C[0] + Math.cos(ang) * (rr - 2.6), cy = C[1] + Math.sin(ang) * (rr - 2.6)
    const u: XY = [-Math.sin(ang), Math.cos(ang)], n: XY = [Math.cos(ang), Math.sin(ang)]
    const hw = 1.3, d0 = -1.0, d1 = 0.6
    const Pp = (s: number, d: number, z: number): V3 => [cx + u[0] * s + n[0] * d, cy + u[1] * s + n[1] * d, z]
    quadOut(P.wall, Pp(-hw, d1, ZE + 1), Pp(hw, d1, ZE + 1), Pp(hw, d1, 16.4), Pp(-hw, d1, 16.4), [n[0], n[1], 0])
    for (const s of [-1, 1]) quadOut(P.wall, Pp(s * hw, d0, ZE + 1), Pp(s * hw, d1, ZE + 1), Pp(s * hw, d1, 16.4), Pp(s * hw, d0, 16.4), [u[0] * s, u[1] * s, 0])
    triOut(P.wall, Pp(-hw, d1, 16.4), Pp(hw, d1, 16.4), Pp(0, d1, 17.8), [n[0], n[1], 0])
    for (const s of [-1, 1]) quadOut(P.cu, Pp(s * (hw + 0.2), d1 + 0.25, 16.3), Pp(s * (hw + 0.2), d0 - 0.5, 16.3), Pp(0, d0 - 0.5, 18.0), Pp(0, d1 + 0.25, 18.0), [u[0] * s, u[1] * s, 1])
    const w: Wall = { a: [Pp(-hw, d1 + 0.01, 0)[0], Pp(-hw, d1 + 0.01, 0)[1]], u }
    archWin(P, w, hw, 14.0, 1.0, 1.0, L, { hood: 0.18 })
  }

  // ------------------------------------------------------------ drum and dome
  const RD = 8.0, k = L.k
  const nWin = 16
  // the drum: dark, a ring of 16 arched windows
  lathe2(P.trim, C[0], C[1], [[RD, 18.55], [RD, 23.0]], k)
  // its cornice ring at the foot
  lathe2(P.trim, C[0], C[1], [[RD + 0.5, 18.5], [RD + 0.5, 19.1], [RD, 19.2]], k)
  for (let i = 0; i < nWin; i++) {
    const a = ((i + 0.5) / nWin) * TAU
    const u: XY = [-Math.sin(a), Math.cos(a)]
    const p0: XY = [C[0] + Math.cos(a) * RD, C[1] + Math.sin(a) * RD]
    const w: Wall = { a: p0, u }
    // window panel only (the drum itself is the dark hood)
    fan(P.win, archRing(w, 0, 19.4, 1.35, 1.75, 0.06, L.arc), [Math.cos(a), Math.sin(a), 0])
    if (D) {
      // the arched hoods: white arches over each window, the scallops of the rim
      fan(P.wall, archRing(w, 0, 19.3, 1.35, 1.75, 0.03, L.arc, 0.35), [Math.cos(a), Math.sin(a), 0])
      fan(P.trim, archRing(w, 0, 19.3, 1.35, 1.75, 0.045, L.arc, 0.15), [Math.cos(a), Math.sin(a), 0])
      fan(P.win, archRing(w, 0, 19.4, 1.35, 1.75, 0.07, L.arc), [Math.cos(a), Math.sin(a), 0])
    }
  }
  // scalloped rim: the dome's lower edge arches up over each window
  {
    const K = L.detail ? nWin * 6 : nWin * 2
    const rim: V3[] = []
    for (let i = 0; i <= K; i++) {
      const a = (i / K) * TAU
      const ph = ((a / TAU) * nWin) % 1 // 0..1 within a bay; window centres at 0.5
      const lift = 1.0 * Math.sin(Math.PI * ph)
      rim.push([C[0] + (RD + 0.35) * Math.cos(a), C[1] + (RD + 0.35) * Math.sin(a), 22.5 + lift])
    }
    // the copper skirt from the drum's top (flat ring) up to the scallops
    for (let i = 0; i < K; i++) {
      const a0 = (i / K) * TAU, a1 = ((i + 1) / K) * TAU
      const b0: V3 = [C[0] + (RD + 0.35) * Math.cos(a0), C[1] + (RD + 0.35) * Math.sin(a0), 22.4]
      const b1: V3 = [C[0] + (RD + 0.35) * Math.cos(a1), C[1] + (RD + 0.35) * Math.sin(a1), 22.4]
      const m: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0]
      if (rim[i][2] - 22.4 > 0.05 || rim[i + 1][2] - 22.4 > 0.05) quadOut(P.cu, b0, b1, rim[i + 1], rim[i], m)
    }
  }
  // the dome: a ribbed copper part-sphere, 23 -> 30.6
  const domeTop = 30.6
  ribDome(P.cu, C[0], C[1], domeProf(RD + 0.1, 23.0, domeTop - 23.0, L.detail ? 12 : 7, 0.0), k, D ? 48 : 16, 0.05)
  // a flat copper collar where the dome meets the drum's top (covers the gap)
  lathe2(P.cu, C[0], C[1], [[RD + 0.55, 22.35], [RD + 0.55, 23.0], [RD + 0.3, 23.05]], k)
  // the lantern: a little drum, an onion and the cross
  lathe2(P.cu, C[0], C[1], [[1.0, domeTop - 0.4], [1.0, domeTop + 0.9], [1.25, domeTop + 1.0], [1.35, domeTop + 1.6], [1.0, domeTop + 2.3], [0.35, domeTop + 2.9], [0.15, domeTop + 3.4], [0.001, domeTop + 3.5]], L.detail ? 16 : 10)
  cross3(P.trim, C[0], C[1], domeTop + 3.3, 2.4)

  // ------------------------------------------------------------ narthex and west front
  const nar: XY[] = [[-21.15, -8.5], [-11.6, -8.5], [-11.6, 8.7], [-21.15, 8.7]]
  prism(P.wall, nar, 0, 11.0, { bevel: 0.3, top: false })
  band(P.trim, nar, 0, 1.3, 0.25)
  band(P.trim, nar, 5.4, 5.9, 0.12)
  band(P.trim, nar, 10.0, 11.3, 0.2)
  // low hipped roof behind the parapet
  {
    const z0 = 11.0, x0 = -20.9, x1 = -11.8, y0 = -8.3, y1 = 8.5, zr = 12.6
    const r0: V3 = [-16.35, y0 + 4.5, zr], r1: V3 = [-16.35, y1 - 4.5, zr]
    quadOut(P.roof, [x0, y0, z0], [x0, y1, z0], r1, r0, [-1, 0, 1])
    quadOut(P.roof, [x1, y1, z0], [x1, y0, z0], r0, r1, [1, 0, 1])
    triOut(P.roof, [x0, y0, z0], [x1, y0, z0], r0, [0, -1, 1])
    triOut(P.roof, [x1, y1, z0], [x0, y1, z0], r1, [0, 1, 1])
  }
  // narthex windows: west face pairs either side of the tower, two storeys; north and south faces
  const wn: Wall = { a: [-21.15, 8.7], u: [0, -1] } // west face, s from y=8.7 going -y
  for (const s of [1.6, 3.5, 13.7, 15.6]) {
    archWin(P, wn, s, 1.9, 0.9, 1.9, L, { hood: 0.25 })
    archWin(P, wn, s, 6.6, 0.9, 1.8, L, { hood: 0.25 })
  }
  for (const w of [{ a: [-11.6, 8.7], u: [-1, 0] }, { a: [-21.15, -8.5], u: [1, 0] }] as Wall[]) {
    for (const s of [2.4, 4.4, 7.2]) {
      archWin(P, w, s, 1.9, 0.9, 1.9, L, { hood: 0.25 })
      archWin(P, w, s, 6.6, 0.9, 1.8, L, { hood: 0.25 })
    }
  }
  // corner turrets (the octagonal columns added in 1929)
  for (const y of [-8.35, 8.95]) {
    lathe2(P.wall, -20.6, y, [[0.95, 0], [0.95, 11.6]], 8, Math.PI / 8)
    lathe2(P.trim, -20.6, y, [[1.12, 0], [1.12, 1.3], [0.95, 1.35]], 8, Math.PI / 8)
    lathe2(P.trim, -20.6, y, [[1.12, 11.2], [1.15, 11.9], [0.6, 12.6], [0.001, 13.1]], 8, Math.PI / 8)
  }

  // the bell tower: a square base stage projecting from the front, a square
  // upper stage, an octagonal belfry and a green dome
  const TX = -19.35, TY = 0.4
  const tower: XY[] = rect(TX, TY, 3.55, 3.6)
  prism(P.wall, tower, 0, 12.0, { bevel: 0.3, top: false })
  band(P.trim, tower, 0, 1.3, 0.25)
  band(P.trim, tower, 5.4, 5.9, 0.12)
  band(P.trim, tower, 11.2, 12.2, 0.2)
  const tw: Wall = { a: [TX - 3.55, TY + 3.6], u: [0, -1] }
  archWin(P, tw, 3.6, 1.3, 2.2, 2.6, L, { glass: P.door, hood: 0.5 }) // the west door
  // round window over it
  {
    const n: V3 = [-1, 0, 0], k2 = L.detail ? 16 : 10
    const ring = (r: number, out: number) => Array.from({ length: k2 }, (_, i) => { const a = (i / k2) * TAU; return [TX - 3.55 - out, TY + r * Math.cos(a), 8.2 + r * Math.sin(a)] as V3 })
    fan(P.trim, ring(1.6, 0.04), n)
    fan(P.win, ring(1.15, 0.08), n)
  }
  // The upper stages, scaled from Kakidai's frontal photo (2018) against the
  // 11 m front: each about as wide as the base. A frieze of small dark
  // corbel arches 11.8-13.2; the stage with the round window under a
  // pointed hood 13.2-15.3; a dark cornice; a panelled stage 16.2-17.8;
  // the heavy top cornice to 18.8.
  const up: XY[] = rect(TX, TY, 3.4, 3.4)
  prism(P.wall, up, 12.0, 17.8, { bevel: 0.25, top: false })
  band(P.trim, up, 15.3, 16.2, 0.22)
  band(P.trim, up, 17.8, 18.8, 0.5)
  capPoly(P.trim, grow(up, 0.5), 18.8)
  for (let s = 0; s < 4; s++) {
    const ang = (s * Math.PI) / 2
    const u: XY = [-Math.sin(ang), Math.cos(ang)], n: XY = [Math.cos(ang), Math.sin(ang)]
    const w: Wall = { a: [TX + n[0] * 3.4 - u[0] * 3.4, TY + n[1] * 3.4 - u[1] * 3.4], u }
    const N: V3 = [n[0], n[1], 0]
    // the corbel-arch frieze: seven small dark arches on the white wall
    for (let k = 0; k < 7; k++) {
      const sc = 0.55 + k * 0.95
      fan(P.trim, archRing(w, sc, 12.3, 0.62, 0.35, 0.04, L.detail ? 6 : 3, 0.14), N)
      fan(P.wall, archRing(w, sc, 12.3, 0.62, 0.35, 0.07, L.detail ? 6 : 3), N)
    }
    band2(P.trim, w, 0, 6.8, 13.15, 13.35, 0.12)
    // the round window under its pointed hood
    archWin(P, w, 3.4, 13.7, 1.4, 0.4, L, { hood: 0.3 })
    const k2 = L.detail ? 14 : 8
    fan(P.win, Array.from({ length: k2 }, (_, i) => { const t = (i / k2) * TAU; return at(w, 3.4 + 0.42 * Math.cos(t), 14.25 + 0.42 * Math.sin(t), 0.11) }), N)
    // the panels of the top stage
    for (const [s0, s1] of [[0.6, 1.9], [2.3, 4.5], [4.9, 6.2]]) {
      quadOut(P.trim, at(w, s0, 16.55, 0.03), at(w, s1, 16.55, 0.03), at(w, s1, 17.5, 0.03), at(w, s0, 17.5, 0.03), N)
      quadOut(P.wall, at(w, s0 + 0.12, 16.67, 0.06), at(w, s1 - 0.12, 16.67, 0.06), at(w, s1 - 0.12, 17.38, 0.06), at(w, s0 + 0.12, 17.38, 0.06), N)
    }
  }
  // the belfry: an open ring of eight dark stone columns under round
  // arches, green copper over the arches, a low ribbed green dome, a
  // spike with a small onion and the cross (to 29 m)
  {
    const R = 2.85, zc0 = 19.3, zc1 = 22.4, n = 8
    lathe2(P.trim, TX, TY, [[3.1, 18.8], [3.1, zc0], [2.4, zc0 + 0.02]], 16)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      const cx = TX + R * Math.cos(a), cy = TY + R * Math.sin(a)
      lathe2(P.trim, cx, cy, [[0.4, zc0], [0.4, zc0 + 0.35], [0.27, zc0 + 0.45], [0.25, zc1 - 0.45], [0.38, zc1 - 0.15], [0.38, zc1], [0.001, zc1 + 0.01]], L.detail ? 10 : 6)
    }
    const c = (R * Math.PI) / n, m = L.detail ? 12 : 6
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU
      const arc: V3[] = [], top: V3[] = [], arcO: V3[] = []
      for (let j = 0; j <= m; j++) {
        const sArc = -c + (2 * c * j) / m, th = a0 + (sArc + c) / R
        const z = zc1 + Math.sqrt(Math.max(0, c * c - sArc * sArc))
        arc.push([TX + R * Math.cos(th), TY + R * Math.sin(th), z])
        arcO.push([TX + (R + 0.28) * Math.cos(th), TY + (R + 0.28) * Math.sin(th), z + 0.18])
        top.push([TX + (R + 0.28) * Math.cos(th), TY + (R + 0.28) * Math.sin(th), zc1 + c + 0.45])
      }
      // the arch itself (dark stone), and the copper spandrel over it, both faces
      bar(P.trim, arc, 0.5, 0.25, 0.12, false, true)
      for (let j = 0; j < m; j++) {
        const mid = (a0 + (j + 0.5) * (TAU / n) / m)
        quadOut(P.cu, arcO[j], arcO[j + 1], top[j + 1], top[j], [Math.cos(mid), Math.sin(mid), 0])
        quadOut(P.trim, arcO[j], arcO[j + 1], top[j + 1], top[j], [-Math.cos(mid), -Math.sin(mid), 0])
      }
    }
    // the soffit inside the dome, and the bells
    disc(P.trim, TX, TY, R + 0.3, zc1 + c + 0.3, false, 16)
    lathe2(P.trim, TX, TY, [[0.12, zc1 - 1.6], [0.12, zc1 + c + 0.3]], 6)
    ball(P.trim, TX, TY, 21.2, 0.85, L.detail ? 12 : 8, 0.95)
    // the dome: low, ribbed, over the arches
    ribDome(P.cu, TX, TY, domeProf(R + 0.3, zc1 + c + 0.45, 1.5, L.detail ? 8 : 5), L.detail ? 32 : 16, D ? 16 : 8, 0.05)
    const zt = zc1 + c + 1.95
    lathe2(P.cu, TX, TY, [[0.55, zt - 0.1], [0.45, zt + 0.3], [0.5, zt + 0.6], [0.32, zt + 0.95], [0.12, zt + 1.3], [0.001, zt + 1.5]], 8)
    cross3(P.trim, TX, TY, zt + 1.3, 2.7)
  }

  // the steps up to the west door
  for (let i = 0; i < 4; i++) {
    const d = 0.35 * (4 - i)
    capPoly(P.trim, [[TX - 3.55 - d, TY - 2.2], [TX - 3.55, TY - 2.2], [TX - 3.55, TY + 2.2], [TX - 3.55 - d, TY + 2.2]], 1.3 - i * 0.3)
    P.trim.quad([TX - 3.55 - d, TY - 2.2, 1.3 - (i + 1) * 0.3], [TX - 3.55 - d, TY + 2.2, 1.3 - (i + 1) * 0.3], [TX - 3.55 - d, TY + 2.2, 1.3 - i * 0.3], [TX - 3.55 - d, TY - 2.2, 1.3 - i * 0.3])
  }

  // The terrace: the map's terrain dips to the retaining wall at the east
  // end (its 2 m cells smear the wall's drop under the apse), so the
  // lowest ground under the footprint is 2.8 m below the churchyard. Lift
  // the whole church onto the churchyard and run a dark base down to y = 0
  // so it sinks into the ground everywhere but at the apse.
  for (const p of Object.values(P)) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] += ZG
  for (const r of [cross, nar, tower]) prism(P.trim, grow(r, 0.25), 0, ZG + 0.05, { bevel: 0.1, top: false })
  prism(P.trim, [[13.5, -4.0], [21.6, -4.0], [21.6, 4.0], [13.5, 4.0]], 0, ZG + 0.05, { bevel: 0.1, top: false })
  for (const r of [[[0.9, 15.0], [6.6, 15.0], [6.6, 17.4], [0.9, 17.4]], [[0.4, -17.4], [7.4, -17.4], [7.4, -15.0], [0.4, -15.0]]] as XY[][]) prism(P.trim, r, 0, ZG + 0.05, { bevel: 0.1, top: false })

  // night: floodlit walls and dome
  const flood = (k: number) => (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 * k : k)
  return [
    { part: P.wall, material: { ...finish('stucco-white', 0xece7dc), floodlight: flood(0.7) } },
    { part: P.trim, material: finish('dark-trim', 0x77706a) },
    { part: P.cu, material: { ...finish('verdigris', 0x6fae98), floodlight: flood(0.6) } },
    { part: P.roof, material: finish('roof-grey', 0x8e969b) },
    { part: P.win, material: PALETTE.window },
    { part: P.door, material: finish('door-teal', 0x4f8f86) },
  ] as Layer[]
}

if (import.meta.main) {
  const meta = { generator: 'generators/tokyo-nikolai-cathedral.ts' }
  await writeModel('tokyo-nikolai-cathedral', 'tokyo-nikolai-cathedral.glb', 'Holy Resurrection Cathedral (Nikolai-dō)', build(LOW), meta, 6500, 250_000)
  await writeModel('tokyo-nikolai-cathedral', 'tokyo-nikolai-cathedral.detail.glb', 'Holy Resurrection Cathedral (Nikolai-dō)', build(DETAIL), meta, 40_000, 1536 * 1024)
}
