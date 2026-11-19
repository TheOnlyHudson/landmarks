/**
 * St. Mary's Cathedral, Tokyo (東京カテドラル聖マリア大聖堂), Sekiguchi,
 * Bunkyō: procedural, CC0-1.0.  bun generators/tokyo-st-marys-cathedral.ts
 *
 * Kenzo Tange, 1964. Eight hyperbolic-paraboloid (HP) shells, clad in
 * stainless steel, stand on the edges of a kite-shaped plan and lean
 * against each other in pairs, leaving a cross-shaped strip of glass
 * between each pair along the top; at each of the cross's four ends the
 * glass turns down as a full-height vertical slot. The free-standing
 * concrete bell tower (61.6 m) stands to the west. Low concrete wings wrap
 * the foot of the shells.
 *
 * Geometry. The shells are true bilinear (HP) patches: each runs from a
 * straight line on the ground (a side of the kite, from the end of its own
 * arm to the end of the neighbouring arm) to a straight line along its
 * arm's skylight (from the arm's end at the top of the slot to the
 * crossing). So each quadrant of the kite is roofed twice, by two shells
 * twisting in opposite senses; their union is the building. Where a
 * neighbour's shell comes down to the foot of a slot it gives the
 * flared, concave sweep the photos show either side of each slot. The
 * glass strips (skylights and slots) are `window` (lit from inside at
 * night). Shell thickness is not drawn (12 cm real). The detail model adds
 * the cladding's standing seams along the rulings (about every 2 m) and the
 * slots' transoms.
 *
 * Frame: origin at the outline's centroid (139.726573, 35.714262), bearing
 * 0 (the cross's arms run at 115 and 24 degrees and are drawn where OSM
 * has them). y = 0 is the lowest ground under the footprint (the map's
 * terrain: the parking lot's edge to the west, about 1.3 m below the
 * cathedral's platform, tools/terrain.ts grid). The shells' ground lines
 * and the slots start at ZB = 1.3 m (the platform), and the shells and
 * the wings run on down to y = 0 so they sink into the higher ground.
 *
 * Plan (OSM, measured): way/120704384 (the outline: the shells and the
 * low wings), way/120704382 (building:part, height 40: the cross of the
 * skylights). The cross's arm ends, from the part's end edges: west-north-
 * west (-24.4, 10.8), east-south-east (33.3, -15.9), south-south-west
 * (3.9, -27.2), north-north-east (22.2, 14.3); the arms cross at
 * (13.0, -6.5): a Latin cross, the long arm (41 m) to the west. The bell
 * tower is way/120704385 (man_made=tower, tower:type=bell_tower, height 60,
 * not a building): a triangle 5 m across, drawn here as part of this model.
 * Heights:
 *  - the east end 39.4 m (published: ja/en.wikipedia "39.4m（本体）"),
 *    the highest point; the other ends and the crossing estimated from
 *    Kakidai's and Zairon's views from the footbridge to the south (the
 *    three peaks' heights in the photo scaled by their distances from it):
 *    west end 26 m, north and south ends 24 m, the crossing 33 m (the
 *    skylight rises from the west end to the altar end, so the photos
 *    from the west show the slot as the highest point by perspective);
 *  - the skylight / slot gap 3.2 m (photos: the slot about a twelfth of
 *    the width of an end view);
 *  - the low wings 5.5 m (estimated, photos);
 *  - the bell tower 61.6 m with its cross (published, en.wikipedia; OSM
 *    60), its bell opening 41-52 m (estimated, Kakidai, Wiiii).
 * Colours: stainless steel #cdd1d5 (photos: bright, between #bfc4c8 in
 * shade and near-white in sun); the wings and the tower board-marked
 * concrete #bdb8ae; the glass in the palette's window slate.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - St. Mary's Cathedral Tokyo.jpg, Kakidai, CC BY-SA 4.0 (from the footbridge to the south)
 *  - St. Mary's Cathedral Tokyo 2012.JPG, Kakidai, CC BY-SA 3.0 (same, with the tower)
 *  - 2018 St. Mary's Cathedral Tokyo 1.jpg / 2018 ..., Tokyo 2.jpg / 3.jpg, Kakidai, CC BY-SA 4.0 (end views)
 *  - Cathedral St. Mary Südseite 1.jpg / 3.jpg, Westseite 1.jpg, Zairon, CC BY-SA 4.0
 *  - St. Mary's Cathedral, Tokyo - DSC07746.JPG, Daderot, CC0 (from the south-west, with the tower)
 *  - St. Mary's Cathedral Tokyo2.jpg, Wiiii, CC BY-SA 3.0 (the tower)
 *  - 東京カテドラル聖マリア大聖堂IMG 20230729 170809 01-05.jpg, 経済特区, CC0 (slots, tower, shells close)
 *  - 20030702 2 July 2003 Tokyo Cathedorale 1/3/5 ... .jpg, Morio, CC BY-SA 3.0
 *  - StMary'sCathedral-Tokyo-01.jpg, Shinjuku1, public domain (interior: the cross skylight)
 * Published: ja.wikipedia 東京カテドラル聖マリア大聖堂 (39.4 m, 61.7 m, eight HP
 * shells in four pairs, plan 55.5 x 40.7 m, stainless steel cladding);
 * en.wikipedia St. Mary's Cathedral, Tokyo (61.6 m bell tower, to the west).
 * No look-only references.
 * Doubts: the heights of the ends other than the east are estimates from
 * photos; the shells are drawn as ideal HP patches between straight lines
 * (the real shells' edges are thickened and their stainless cladding has
 * ribs at 2 m, left out); OSM's cross is longer (63 m) than the published
 * 55.5 m plan: OSM is followed; the wings' heights vary in reality and are
 * drawn at one height.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, capPoly, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'
import { quadOut, triOut } from './tokyo-sensoji'

const ZB = 1.3
const GAP = 3.2
type Lod = { nu: number; nv: number; detail: boolean }
const LOW: Lod = { nu: 10, nv: 6, detail: false }
const DETAIL: Lod = { nu: 28, nv: 16, detail: true }

const OUTLINE: XY[] = [[9.45, 30.03], [-11.53, 28.85], [-11.66, 31.16], [-20.08, 30.67], [-19.95, 27.29], [-17.46, 27.48], [-17.09, 23.05], [-17.91, 22.95], [-17.34, 15.26], [-16.21, 15.3], [-16.14, 13.18], [-22.75, 14.05], [-24.93, 9.34], [-20.24, 4.03], [-21.92, 2.61], [-22.75, 3.64], [-28.91, -1.55], [-28.2, -2.43], [-29.43, -3.41], [-31.52, -5.07], [-33.28, -2.83], [-35.65, -4.79], [-20.06, -25.3], [-14.32, -20.84], [-9.09, -27.61], [-2.79, -22.47], [-5.47, -19.33], [-2.12, -16.7], [0.17, -20.94], [2.74, -25.76], [6.2, -26.84], [11.46, -23.46], [16.98, -21.51], [22.42, -19.56], [28.26, -18.17], [32.82, -17.6], [35.04, -12.39], [31.44, -7.96], [28.68, -2.75], [26.66, 3.37], [25.36, 9.68], [24.36, 14.48], [21.12, 15.84], [15.8, 13.21], [11.33, 11.9], [11.07, 16.75], [15.13, 17.15], [14.53, 25.33], [9.68, 25.03]]

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

function build(L: Lod) {
  const steel = new Part(), glass = new Part(), conc = new Part(), dark = new Part()
  // the cross: arm ends (plan) and their heights; C the crossing
  const C: XY = [13.0, -6.5], HC = 22
  const ends: Array<{ p: XY; h: number }> = [
    { p: [33.3, -15.9], h: 39.4 }, // E (altar end)
    { p: [22.2, 14.3], h: 26 }, // N
    { p: [-24.4, 10.8], h: 28 }, // W (long arm)
    { p: [3.9, -27.2], h: 26 }, // S
  ] // counter-clockwise from above
  const dir = (p: XY): XY => { const d: XY = [p[0] - C[0], p[1] - C[1]]; const l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l] }
  // the offset from arm i's axis toward its counter-clockwise (+1) or clockwise (-1) neighbour
  const side = (i: number, s: 1 | -1): XY => { const d = dir(ends[i].p); const n: XY = [-d[1], d[0]]; return [n[0] * s * GAP / 2, n[1] * s * GAP / 2] }
  const P3 = (p: XY, z: number, o: XY[] = []): V3 => [p[0] + o.reduce((t, q) => t + q[0], 0), p[1] + o.reduce((t, q) => t + q[1], 0), z]

  // eight shells: in the quadrant between arm i and arm j = i + 1 (ccw), one attached to each
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    for (const [a, b, sa, sb] of [[i, j, 1, -1], [j, i, -1, 1]] as [number, number, 1 | -1, 1 | -1][]) {
      const offA = side(a, sa), offB = side(b, sb)
      const g0 = P3(ends[a].p, ZB, [offA]), g1 = P3(ends[b].p, ZB, [offB])
      const t0 = P3(ends[a].p, ZB + ends[a].h, [offA]), t1 = P3(C, ZB + HC, [offA, offB])
      // the outward side: away from the crossing, toward the quadrant
      const mid: XY = [(ends[a].p[0] + ends[b].p[0]) / 2 - C[0], (ends[a].p[1] + ends[b].p[1]) / 2 - C[1]]
      shell(steel, g0, g1, t0, t1, L, mid)
      if (L.detail) seams(steel, g0, g1, t0, t1, L, mid)
      // run the shell's ground edge down to y = 0 (into the higher ground)
      quadOut(steel, [g0[0], g0[1], 0], [g1[0], g1[1], 0], g1, g0, [mid[0], mid[1], 0])
    }
  }
  // the glass: the skylight strip along each arm, the slot at each end, the
  // little square at the crossing
  for (let i = 0; i < 4; i++) {
    const e = ends[i], d = dir(e.p)
    const prev = (i + 3) % 4, next = (i + 1) % 4
    const L0 = P3(e.p, ZB + e.h, [side(i, -1)]), R0 = P3(e.p, ZB + e.h, [side(i, 1)])
    const L1 = P3(C, ZB + HC, [side(i, -1), side(prev, 1)]), R1 = P3(C, ZB + HC, [side(i, 1), side(next, -1)])
    quadOut(glass, L0, R0, R1, L1, [0, 0, 1])
    // the slot: vertical glass between the two shells' end edges
    const out: V3 = [d[0], d[1], 0]
    quadOut(glass, P3(e.p, 0, [side(i, -1)]), P3(e.p, 0, [side(i, 1)]), R0, L0, out)
    // a stainless frame either side of the slot (the slot's jambs)
    for (const s of [-1, 1] as const) {
      const o = side(i, s), ow: XY = [o[0] * 1.12, o[1] * 1.12]
      const a0 = P3(e.p, 0, [o]), a1 = P3(e.p, 0, [ow]), b1 = P3(e.p, ZB + e.h + 1.2, [ow]), b0 = P3(e.p, ZB + e.h + 1.2, [o])
      const fwd: V3 = [d[0] * 0.25, d[1] * 0.25, 0]
      quadOut(steel, add(a0, fwd), add(a1, fwd), add(b1, fwd), add(b0, fwd), out)
      quadOut(steel, a1, add(a1, fwd), add(b1, fwd), b1, [o[0], o[1], 0])
      quadOut(steel, a0, add(a0, fwd), add(b0, fwd), b0, [-o[0], -o[1], 0])
      triOut(steel, add(b0, fwd), add(b1, fwd), add(P3(e.p, ZB + e.h - 0.5, [o]), fwd), [0, 0, 1])
    }
    // the slot's transoms (detail): stainless bars across the glass every 2.6 m
    if (L.detail) for (let z = ZB + 5; z < ZB + e.h - 0.5; z += 2.6) {
      const fwd: V3 = [d[0] * 0.12, d[1] * 0.12, 0]
      const a = add(P3(e.p, z, [side(i, -1)]), fwd), b = add(P3(e.p, z, [side(i, 1)]), fwd)
      quadOut(steel, a, b, [b[0], b[1], b[2] + 0.22], [a[0], a[1], a[2] + 0.22], out)
      quadOut(steel, [a[0], a[1], a[2] + 0.22], [b[0], b[1], b[2] + 0.22], [b[0] - fwd[0], b[1] - fwd[1], b[2] + 0.22], [a[0] - fwd[0], a[1] - fwd[1], a[2] + 0.22], [0, 0, 1])
    }
    // the door at the foot of the slot
    const dz = ZB + 4.2
    quadOut(dark, P3(e.p, ZB - 0.1, [side(i, -1)]), P3(e.p, ZB - 0.1, [side(i, 1)]), P3(e.p, dz, [side(i, 1)]), P3(e.p, dz, [side(i, -1)]), out)
  }
  {
    const q: V3[] = [0, 1, 2, 3].map((i) => P3(C, ZB + HC, [side(i, 1), side((i + 1) % 4, -1)]))
    quadOut(glass, q[0], q[1], q[2], q[3], [0, 0, 1])
  }

  // the low concrete wings round the foot (the OSM outline at 5.5 m)
  const ring = OUTLINE
  prism(conc, ring, 0, ZB + 4.2, { bevel: 0.25, top: false })
  capPoly(conc, ring, ZB + 4.2)
  // a band of shadowed glazing in the wings (they are mostly blind concrete)
  // is left out: the photos show broad blank concrete walls.

  // the bell tower: a slender triangular blade tapering to its cross
  {
    const base: XY[] = [[-45.7, 6.19], [-49.4, 1.65], [-45.38, 0.21]]
    const c: XY = [(base[0][0] + base[1][0] + base[2][0]) / 3, (base[0][1] + base[1][1] + base[2][1]) / 3]
    const at = (k: number, f: number, z: number): V3 => [c[0] + (base[k][0] - c[0]) * f, c[1] + (base[k][1] - c[1]) * f, z]
    const levels: Array<[number, number]> = [[0, 1], [41, 0.66], [52, 0.55], [58, 0.38]]
    for (let l = 0; l < levels.length - 1; l++) {
      const [z0, f0] = levels[l], [z1, f1] = levels[l + 1]
      const part = l === 1 ? null : conc
      for (let k = 0; k < 3; k++) {
        const m = (k + 1) % 3
        const out: V3 = [(base[k][0] + base[m][0]) / 2 - c[0], (base[k][1] + base[m][1]) / 2 - c[1], 0]
        if (part) quadOut(part, at(k, f0, z0), at(m, f0, z0), at(m, f1, z1), at(k, f1, z1), out)
        else {
          // the bell stage: concrete edges, a dark opening in each face
          const q = (t: number, f: number, z: number): V3 => lerp3(at(k, f, z), at(m, f, z), t)
          quadOut(dark, q(0.25, f0, z0 + 1), q(0.75, f0, z0 + 1), q(0.75, f1, z1 - 1), q(0.25, f1, z1 - 1), out)
          quadOut(conc, at(k, f0, z0), q(0.25, f0, z0), q(0.25, f1, z1), at(k, f1, z1), out)
          quadOut(conc, q(0.75, f0, z0), at(m, f0, z0), at(m, f1, z1), q(0.75, f1, z1), out)
          quadOut(conc, q(0.25, f0, z0), q(0.75, f0, z0), q(0.75, f0, z0 + 1), q(0.25, f0, z0 + 1), out)
          quadOut(conc, q(0.25, f1, z1 - 1), q(0.75, f1, z1 - 1), q(0.75, f1, z1), q(0.25, f1, z1), out)
        }
      }
    }
    // the top: a short point and the cross
    const top = 58
    for (let k = 0; k < 3; k++) {
      const m = (k + 1) % 3
      const out: V3 = [(base[k][0] + base[m][0]) / 2 - c[0], (base[k][1] + base[m][1]) / 2 - c[1], 0.4]
      triOut(conc, at(k, 0.38, top), at(m, 0.38, top), [c[0], c[1], top + 1.0], out)
    }
    const cz = top + 0.8, ch = 3.6, t = 0.16
    box(steel, c[0] - t, c[1] - t, cz, c[0] + t, c[1] + t, cz + ch)
    box(steel, c[0] - t, c[1] - 0.9, cz + ch * 0.62, c[0] + t, c[1] + 0.9, cz + ch * 0.62 + 2 * t)
  }

  return [
    { part: steel, material: finish('stainless-steel', 0xcdd1d5, 0.45) },
    { part: glass, material: PALETTE.window },
    { part: conc, material: finish('concrete', 0xbdb8ae) },
    { part: dark, material: finish('dark-opening', 0x5d636a) },
  ] as Layer[]
}

/** A bilinear (HP) patch between ground line g0-g1 and top line t0-t1, smooth-shaded, facing `out` (plan direction). */
function shell(p: Part, g0: V3, g1: V3, t0: V3, t1: V3, L: Lod, out: XY) {
  const S = (u: number, v: number): V3 => lerp3(lerp3(g0, g1, u), lerp3(t0, t1, u), v)
  const N = (u: number, v: number): V3 => {
    const e = 1e-3
    const du = [S(u + e, v), S(u - e, v)], dv = [S(u, v + e), S(u, v - e)]
    const a: V3 = [du[0][0] - du[1][0], du[0][1] - du[1][1], du[0][2] - du[1][2]]
    const b: V3 = [dv[0][0] - dv[1][0], dv[0][1] - dv[1][1], dv[0][2] - dv[1][2]]
    let n: V3 = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    if (n[0] * out[0] + n[1] * out[1] < 0) n = [-n[0], -n[1], -n[2]]
    const l = Math.hypot(...n) || 1
    return [n[0] / l, n[1] / l, n[2] / l]
  }
  for (let i = 0; i < L.nu; i++) for (let j = 0; j < L.nv; j++) {
    const u0 = i / L.nu, u1 = (i + 1) / L.nu, v0 = j / L.nv, v1 = (j + 1) / L.nv
    const A = S(u0, v0), B = S(u1, v0), Cc = S(u1, v1), D = S(u0, v1)
    const nA = N(Math.min(u0, 0.999), v0), nB = N(Math.max(u1, 0.001), v0), nC = N(Math.max(u1, 0.001), v1), nD = N(Math.min(u0, 0.999), v1)
    p.tri(A, B, Cc, undefined, undefined, undefined, [nA, nB, nC])
    p.tri(A, Cc, D, undefined, undefined, undefined, [nA, nC, nD])
  }
}

/** The cladding's standing seams (detail model): thin raised strips along the shell's rulings, about every 2 m. */
function seams(p: Part, g0: V3, g1: V3, t0: V3, t1: V3, L: Lod, out: XY) {
  const S = (u: number, v: number): V3 => lerp3(lerp3(g0, g1, u), lerp3(t0, t1, u), v)
  const len = Math.hypot(g1[0] - g0[0], g1[1] - g0[1])
  const n = Math.floor(len / 2.0)
  for (let k = 1; k < n; k++) {
    const u = k / n, du = 0.07 / len
    for (let j = 0; j < L.nv; j++) {
      const v0 = j / L.nv, v1 = (j + 1) / L.nv
      const a = S(u - du, v0), b = S(u + du, v0), c = S(u + du, v1), d = S(u - du, v1)
      // push the strip out along the surface normal
      const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
      let nn: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (nn[0] * out[0] + nn[1] * out[1] < 0) nn = [-nn[0], -nn[1], -nn[2]]
      const l = Math.hypot(...nn) || 1, o: V3 = [(nn[0] / l) * 0.06, (nn[1] / l) * 0.06, (nn[2] / l) * 0.06]
      quadOut(p, add(a, o), add(b, o), add(c, o), add(d, o), nn)
    }
  }
}

function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, { bevel: 0.02 })
}

if (import.meta.main) {
  const meta = { generator: 'generators/tokyo-st-marys-cathedral.ts' }
  await writeModel('tokyo-st-marys-cathedral', 'tokyo-st-marys-cathedral.glb', "St. Mary's Cathedral, Tokyo", build(LOW), meta, 5000, 250_000)
  await writeModel('tokyo-st-marys-cathedral', 'tokyo-st-marys-cathedral.detail.glb', "St. Mary's Cathedral, Tokyo", build(DETAIL), meta, 40_000, 1536 * 1024)
}
