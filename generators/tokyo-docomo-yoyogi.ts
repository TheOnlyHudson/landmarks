/**
 * NTT Docomo Yoyogi Building (NTTドコモ代々木ビル), Sendagaya/Yoyogi, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-docomo-yoyogi.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Completed 2000 (NTT Facilities). A dark granite shaft of 32 floors under a
 * pale metal-clad stepped crown, Empire State-like, with a clock on the
 * first crown tier and a red-and-white lattice mast on top.
 *
 * Frame: built turned to bearing 348.7 (the outline's and every tier's walls,
 * measured on OSM). Origin at 139.70312, 35.68440, within 0.5 m of the
 * outline's centroid; y = 0 is the ground.
 *
 * OSM (all replaced): way/137189971 outline (153 m, 32 levels), 35.5 x 44 m
 * with chamfered corners and a projecting middle bay on the north and south
 * faces; building:parts way/380315128 (153-177 m, a 26 m square with 20 m
 * wide boxes projecting north and south: the clock boxes),
 * way/380315127 (177-192 m, 26 m square), way/380315126 (192-206 m, 19.7 m),
 * way/380315125 (206-221 m, 13.3 m), way/380315124 (221-240 m, 7.6 m).
 *
 * Published: 240 m to the roof of the top tier (Wikipedia, "NTT Docomo
 * Yoyogi Building"; also OSM). Measured on Basile Morin's night photo (shaft
 * 40 m wide = 370 px): the tier tops at 191, 206, 220 and 240 m agree with
 * OSM; the mast rises from 240 to ~269 m (estimated, photo), ~5 m square at
 * its foot tapering to ~2.5 m, with a wider platform ~248 m.
 *
 * From photos: the clock is a projecting box (20 m wide, 153-177 m) on the
 * north and south faces, with white roman numerals at 12, 3, 6, 9, bars at
 * the other hours and two white hands, the dial ~16 m across, no disc
 * (Zairon's close-up). The shaft's middle bay carries a full-height glazed
 * slot between two piers that run up past the shaft's top; open steel frames
 * stand on the shaft's four corners up to ~166 m. The crown is clad in pale
 * grey panels with white vertical ribs (~2 m apart), dishes on its terraces.
 * Estimated: the clock box's projection (OSM), the corner frames' size, the
 * rib spacing, the dishes' positions, the mast's lattice.
 *
 * The crown (rebuilt on review): OSM's five tiers, each split by an
 * intermediate setback read from Wiiii's south photo (186, 199, 213.5 m), so
 * eight steps from the clock tier to the mast, every tier with notched
 * corners, corner pinnacles ~3 m above its parapet and pale vertical fins
 * (bold in the low model, the real ribs' spacing in the detail).
 * Slenderness against Wiiii's photo: shaft width / shaft height 0.31 in the
 * photo, 0.26 in the render from the same side; the model follows OSM's
 * 35.5 x 44 m outline.
 *
 * Colours (daylight): shaft and crown the same warm brown-grey granite
 * (#8a7d72 to #9a8e84 in Wiiii's photo, OSM building:colour #AAA5A8), drawn
 * #a29589; the three upper tiers use that colour as `neon-docomo-crown`, so
 * by day they match the granite and at night they glow; windows small and grey-blue, the slot a light
 * sky blue. Night (Basile Morin, "clock tower at 7 pm with color lighting"):
 * the three upper tiers (192-240 m) are lit purple and blue from within
 * (`neon-docomo-crown`), the clock's numerals and hands are white and lit
 * (`neon-docomo-clock`), office windows lit (`window`), the clock tier and
 * shaft dark.
 *
 * Photos (Wikimedia Commons):
 * - "NTT DoCoMo Yoyogi Building 2009.jpg", Wiiii, CC BY-SA 3.0 (whole tower, south-east)
 * - "Shinjuku Gyoen National Garden and NTT DoCoMo Yoyogi Building, Tokyo, Japan.jpg",
 *   Basile Morin, CC BY-SA 4.0 (from the north-east, daylight colour)
 * - "NTT Docomo Yoyogi Building clock tower at 7 pm with color lighting
 *   Shibuya Tokyo Japan.jpg", Basile Morin, CC BY-SA 4.0 (crown elevation, night)
 * - "NTT Docomo Yoyogi Building Uhr.jpg", Zairon, CC BY-SA 4.0 (the clock)
 * - "NTT Docomo Yoyogi Building 3.jpg", Zairon, CC BY-SA 4.0 (west side, corner frames)
 * No lidar (Japan). No look-only sources.
 * Doubts: clocks only on the north and south boxes, where OSM maps the
 * projecting boxes (photos show the south face; the north is assumed the
 * same); the clock hands are set at 10:08.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, panels, member, box, rect, unit, writeModel, type XY, type Layer, setSoftMin } from './tokyo-metropolitan-government-building'

/** A flat quad facing n (winding follows the normal). */
function faceQuad(p: Part, q: V3[], n: V3) {
  p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
  p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
}

const SHAFT: XY[] = [[17.5, 14.3], [17.4, -14.8], [12.6, -20.1], [6.0, -20.0], [4.2, -22.5], [-5.4, -22.3], [-7.4, -20.1], [-13.4, -20.0], [-18.0, -15.1], [-18.0, 14.3], [-13.1, 19.1], [-6.7, 19.0], [-4.9, 21.9], [4.9, 21.9], [7.3, 19.0], [13.2, 19.1]]
const CX = -0.3, CY = -0.8 // the crown tiers' common centre

type Lod = { detail: boolean }

function build(L: Lod): Layer[] {
  setSoftMin(L.detail ? 0 : 3)
  const shaft = new Part(), clad = new Part(), crown = new Part(), win = new Part(), clock = new Part(), red = new Part()

  // ---- the shaft, 0-153 m
  prism(shaft, SHAFT, 0, 153, { roof: clad, lip: 0.8, bevel: 0.5 })
  // windows: broad panels three floors high on the long faces; the
  // chamfered corners and the middle bay's returns stay plain granite
  panels(win, SHAFT, 4, 151, { bay: L.detail ? 2.6 : 4.4, row: L.detail ? 9.6 : 14.4, fw: 0.38, fh: 0.7, minEdge: 5, margin: 0.9 })
  // the middle bays (N and S): two piers either side of a full-height glazed slot,
  // running on past the shaft's top to ~160 m
  for (const s of [1, -1]) {
    const y = s > 0 ? 21.9 : -22.4
    for (const x of [-3.2, 3.2]) box(shaft, rect(x, y - s * 1.2, 1.4, 1.3), 150, 160)
    const n: V3 = [0, s, 0]
    const q = (x: number, z: number): V3 => [x, y + s * 0.06, z]
    if (s > 0) win.quad(q(1.0, 6), q(-1.0, 6), q(-1.0, 158), q(1.0, 158))
    else win.quad(q(-1.0, 6), q(1.0, 6), q(1.0, 158), q(-1.0, 158))
    void n
  }
  // open steel frames on the shaft's corners (153-166 m)
  for (const [x, y] of [[14.5, 16.5], [-15.5, 16.5], [14.5, -17.5], [-15.5, -17.5]] as XY[]) {
    const h = 2.6, z0 = 153, z1 = 166, r = L.detail ? 0.35 : 0.5
    const c: V3[] = [[x - h, y - h, 0], [x + h, y - h, 0], [x + h, y + h, 0], [x - h, y + h, 0]]
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      member(clad, [a[0], a[1], z0], [a[0], a[1], z1], r, 4)
      member(clad, [a[0], a[1], z1], [b[0], b[1], z1], r, 4)
      if (L.detail) member(clad, [a[0], a[1], (z0 + z1) / 2], [b[0], b[1], (z0 + z1) / 2], r, 4)
    }
  }

  // ---- the crown: a ziggurat in the shaft's granite. OSM's five tiers, each
  // split by an intermediate setback read from Wiiii's south photo, every
  // tier with notched corners, corner pinnacles and pale vertical fins.
  const T1: XY[] = [[-10.3, 15.6], [9.5, 15.7], [9.5, 12.5], [12.7, 12.5], [12.9, -13.8], [10.2, -13.8], [10.2, -17.1], [-9.9, -17.2], [-9.9, -14.0], [-13.3, -14.0], [-13.5, 12.2], [-10.3, 12.2]]
  prism(shaft, T1, 153, 177, { roof: clad, lip: 0.6, bevel: 0.4 })
  /** A square of half-size h with its corners notched n deep (stepped corners). */
  const notched = (h: number, n: number): XY[] => {
    const q: XY[] = []
    for (const [sx, sy] of [[1, -1], [1, 1], [-1, 1], [-1, -1]]) {
      // corner (sx, sy), walked counter-clockwise
      const c = (x: number, y: number): XY => [CX + x, CY + y]
      if (sx > 0 && sy < 0) q.push(c(h - n, -h), c(h - n, -h + n), c(h, -h + n))
      if (sx > 0 && sy > 0) q.push(c(h, h - n), c(h - n, h - n), c(h - n, h))
      if (sx < 0 && sy > 0) q.push(c(-h + n, h), c(-h + n, h - n), c(-h, h - n))
      if (sx < 0 && sy < 0) q.push(c(-h, -h + n), c(-h + n, -h + n), c(-h + n, -h))
    }
    return q
  }
  // [half-size, base, top, part]: OSM tiers 177/192/206/221/240 with the photo's intermediate steps
  const tiers: [number, number, number, Part][] = [
    [13.2, 177, 186, shaft], [12.0, 186, 192, shaft],
    [9.8, 192, 199, crown], [8.6, 199, 206, crown],
    [6.65, 206, 213.5, crown], [5.6, 213.5, 221, crown],
    [3.8, 221, 240, crown],
  ]
  for (const [h, z0, z1, part] of tiers) {
    const n = Math.min(1.4, h * 0.16)
    prism(part, notched(h, n), z0, z1, { roof: clad, lip: 0.5, bevel: 0.3 })
    // corner pinnacles: the notch's outer corners rise ~3 m above the parapet
    for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const k = Math.max(0.7, n * 0.8)
      prism(part, rect(CX + sx * (h - n - k / 2), CY + sy * (h - k / 2), k / 2, k / 2), z1 - 1, z1 + 3, { bevel: 0.12 })
      prism(part, rect(CX + sx * (h - k / 2), CY + sy * (h - n - k / 2), k / 2, k / 2), z1 - 1, z1 + 3, { bevel: 0.12 })
    }
    // pale vertical fins on each face (the cladding's ribs), bold in the low model
    const nf = L.detail ? Math.max(2, Math.round((2 * (h - n)) / 2.2)) : Math.max(1, Math.round((2 * (h - n)) / 5))
    const w = L.detail ? 0.18 : 0.35, d = L.detail ? 0.35 : 0.5
    for (let side = 0; side < 4; side++) for (let i = 1; i <= nf; i++) {
      const t = -(h - n) + (2 * (h - n) * i) / (nf + 1)
      const loc = (tt: number): XY => [[tt, -h], [h, tt], [-tt, h], [-h, -tt]][side] as XY
      const out: XY = [[0, -1], [1, 0], [0, 1], [-1, 0]][side] as XY
      const c0 = loc(t)
      box(clad, rect(CX + c0[0] + out[0] * d / 2, CY + c0[1] + out[1] * d / 2, out[0] ? d / 2 : w, out[1] ? d / 2 : w), z0 + 0.6, z1 - 0.6, false)
    }
  }
  box(clad, rect(CX, CY, 3.0, 3.0), 240, 241.5)
  // windows on the tiers above the clock (small, punched in pairs)
  panels(win, notched(13.2, 1.4), 178, 185, { bay: 4.4, row: 7, fw: 0.35, fh: 0.6, margin: 1, minEdge: 6 })

  // ---- the clocks, on the projecting boxes north and south, centre ~165 m
  const R = 8.4, zc = 165
  for (const s of [1, -1]) {
    const y = s > 0 ? 15.66 : -17.16
    // a point on the dial plane: u along the face (to the viewer's right), v up
    const P = (u: number, v: number, d = 0): V3 => [CX + (s > 0 ? -u : u), y + s * (0.08 + d), zc + v]
    const slab = (u0: number, v0: number, u1: number, v1: number, w: number, d = 0.12) => {
      // a bar from (u0,v0) to (u1,v1), w wide, d proud of the face
      const du = u1 - u0, dv = v1 - v0, l = Math.hypot(du, dv), nu = (-dv / l) * w / 2, nv = (du / l) * w / 2
      const a = P(u0 + nu, v0 + nv, d), b = P(u1 + nu, v1 + nv, d), c = P(u1 - nu, v1 - nv, d), e = P(u0 - nu, v0 - nv, d)
      const nf: V3 = [0, s, 0]
      faceQuad(clock, [a, e, c, b], nf)
      if (L.detail) {
        const a0 = P(u0 + nu, v0 + nv), b0 = P(u1 + nu, v1 + nv), c0 = P(u1 - nu, v1 - nv), e0 = P(u0 - nu, v0 - nv)
        const mid = P((u0 + u1) / 2, (v0 + v1) / 2, d)
        for (const [p0, p1, q1, q0] of [[a0, b0, b, a], [b0, c0, c, b], [c0, e0, e, c], [e0, a0, a, e]] as V3[][]) {
          const m: V3 = [(p0[0] + p1[0]) / 2 - mid[0], 0, (p0[2] + p1[2]) / 2 - mid[2]]
          faceQuad(clock, [p0, p1, q1, q0], unit(m))
        }
      }
    }
    for (let h = 0; h < 12; h++) {
      const a = Math.PI / 2 - (h * Math.PI) / 6, cu = Math.cos(a), cv = Math.sin(a)
      if (h % 3 === 0) {
        // roman numerals XII, III, VI, IX as a bold block with a gap: two strokes
        const r0 = R - 0.6
        const mu = cu * r0, mv = cv * r0
        slab(mu - 0.6, mv - 1.0, mu - 0.6, mv + 1.0, 0.75)
        slab(mu + 0.6, mv - 1.0, mu + 0.6, mv + 1.0, 0.75)
        slab(mu - 1.3, mv + 1.15, mu + 1.3, mv + 1.15, 0.4)
        slab(mu - 1.3, mv - 1.15, mu + 1.3, mv - 1.15, 0.4)
      } else slab(cu * (R - 2.0), cv * (R - 2.0), cu * R, cv * R, 0.95)
    }
    // hands at 10:08
    const hr = Math.PI / 2 - ((10 + 8 / 60) * Math.PI) / 6, mn = Math.PI / 2 - (8 * Math.PI) / 30
    slab(-0.6 * Math.cos(hr), -0.6 * Math.sin(hr), 4.8 * Math.cos(hr), 4.8 * Math.sin(hr), 1.3, 0.16)
    slab(-0.8 * Math.cos(mn), -0.8 * Math.sin(mn), 6.9 * Math.cos(mn), 6.9 * Math.sin(mn), 1.0, 0.2)
  }

  // ---- the mast: a red-and-white lattice from 240 to ~269 m
  const mast = (z: number) => 1.9 - (0.8 * (z - 240)) / 29
  box(red, rect(CX, CY, 3.6, 3.6), 247.5, 249)
  if (!L.detail) {
    const bands = [240, 244, 248, 252, 256, 260, 264, 269]
    for (let i = 0; i < bands.length - 1; i++) {
      const z0 = bands[i], z1 = bands[i + 1], h0 = mast(z0), h1 = mast(z1)
      const part = i % 2 ? clad : red
      const r0 = rect(CX, CY, h0 * 0.8, h0 * 0.8), r1 = rect(CX, CY, h1 * 0.8, h1 * 0.8)
      for (let k = 0; k < 4; k++) {
        const a = r0[k], b = r0[(k + 1) % 4], c = r1[(k + 1) % 4], d = r1[k]
        part.quad([a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z1], [d[0], d[1], z1])
      }
    }
  } else {
    const levels = 12
    for (let k = 0; k < levels; k++) {
      const z0 = 241.5 + ((269 - 241.5) * k) / levels, z1 = 241.5 + ((269 - 241.5) * (k + 1)) / levels
      const part = Math.floor(k / 2) % 2 ? clad : red
      const c0 = rect(CX, CY, mast(z0), mast(z0)), c1 = rect(CX, CY, mast(z1), mast(z1))
      for (let i = 0; i < 4; i++) {
        const a: V3 = [c0[i][0], c0[i][1], z0], b: V3 = [c1[i][0], c1[i][1], z1]
        const a2: V3 = [c0[(i + 1) % 4][0], c0[(i + 1) % 4][1], z0], b2: V3 = [c1[(i + 1) % 4][0], c1[(i + 1) % 4][1], z1]
        member(part, a, b, 0.22, 4)
        member(part, b, b2, 0.14, 4)
        member(part, a, b2, 0.1, 3)
      }
    }
    // dishes on the crown terraces
    for (const [x, y, z, ang] of [[11, 11, 192, 0.8], [-12, -12, 192, 3.9], [8, -8, 206, 5.5], [-8, 8, 206, 2.4], [5, 5, 221, 0.8]] as [number, number, number, number][]) {
      const c: V3 = [CX + x, CY + y, z + 1.6]
      member(clad, [c[0], c[1], z], c, 0.12, 4)
      const n: V3 = [Math.cos(ang), Math.sin(ang), 0], t: V3 = [-Math.sin(ang), Math.cos(ang), 0]
      const pts: V3[] = Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        return [c[0] + t[0] * Math.cos(a) * 1.1, c[1] + t[1] * Math.cos(a) * 1.1, c[2] + Math.sin(a) * 1.1] as V3
      })
      for (let i = 1; i < 9; i++) { clad.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n]); clad.tri(pts[0], pts[i + 1], pts[i], undefined, undefined, undefined, [[-n[0], -n[1], 0], [-n[0], -n[1], 0], [-n[0], -n[1], 0]]) }
    }
  }

  return [
    { part: shaft, material: finish('docomo-granite', 0xa29589) },
    { part: clad, material: finish('docomo-cladding', 0xd9d6d2) },
    { part: crown, material: finish('neon-docomo-crown', 0xa29589) },
    { part: win, material: { name: 'window', color: 0x7a8c9b, roughness: 0.35 } },
    { part: clock, material: finish('neon-docomo-clock', 0xf6f6f4) },
    { part: red, material: finish('docomo-mast-red', 0xc8483c) },
  ]
}

const meta = { bearing: 348.7, elevation: 0, height: 269 }
await writeModel('tokyo-docomo-yoyogi', 'tokyo-docomo-yoyogi.glb', 'NTT Docomo Yoyogi Building', build({ detail: false }), meta, 5000, 256_000)
await writeModel('tokyo-docomo-yoyogi', 'tokyo-docomo-yoyogi.detail.glb', 'NTT Docomo Yoyogi Building', build({ detail: true }), meta, 40_000, 1536 * 1024)
