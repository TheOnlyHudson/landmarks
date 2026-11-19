/**
 * Qasr Al Watan, the Presidential Palace, Abu Dhabi (completed 2017):
 * procedural, CC0-1.0.
 * bun generators/abu-dhabi-qasr-al-watan.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/abu-dhabi-qasr-al-watan.glb (low, under 6,500 triangles): the
 *   white granite and limestone blocks as OSM maps them, the great dome on
 *   its drum and the smaller domes, the court's arcaded galleries, the
 *   south front's arcade and the open entrance pavilion, every arch a real
 *   opening through the wall with its soffit and jambs, at one opening per
 *   8-11 m.
 * - models/abu-dhabi-qasr-al-watan.detail.glb (under 40,000): the same
 *   with the arcades at a ~5.5 m bay, arcades on every ground-floor face
 *   of the main blocks, finer arch curves and domes, both faces of every
 *   arcade wall, and windows round the great drum.
 *
 * Frame: anchor at the centroid of the OSM multipolygon (relation/7232861,
 * outer way 492539777, inner court way 492539774), 54.3051766, 24.4630182;
 * bearing 343.5, the outline's axis (its edges run at 73.5 and 163.5
 * degrees), so model +y points north-north-west, toward the sea. The plan
 * is symmetric about x = 3.5 within about 4 m; most blocks follow OSM's
 * edges as mapped (in the turned frame).
 *
 * Layout read from OSM and photos (d01 and w10 are views from Etihad
 * Towers, east-south-east of the palace): the main block to the south,
 * with the Great Hall's dome over its centre, the west wing (west) and the
 * House of Knowledge with the library (east; OSM building:part
 * way/1242194860 "Qasr Al Watan Library"), the entrance pavilion on the
 * south axis; a link block north to a courtyard building, whose open court
 * (OSM's inner way) is ringed by narrow arcaded galleries (6.7 m in OSM),
 * with the north range and its projections beyond.
 *
 * Published: the great dome about 37 m across over the Great Hall; the
 * building 60 m high (to the dome's top); white granite and limestone
 * (Wikipedia; qasralwatan.ae). Estimated from photos (w12, d01, w10): the
 * block heights (26 m for the Great Hall's block, 22 m for the main ranges,
 * 20 m for the wings, 12 m for the court galleries, 14-16 m for the link
 * and porches); the great dome on a square base to 31 m and a drum to
 * 38 m, rising 19.5 m to 57.5 m, with a gold finial to 60 m; the other
 * domes and their places (two on the south front, one each over the west
 * wing, the library, the north range and the entrance pavilion, small ones
 * at the north range's corners, detail model only) from d01 and w10, where the far side is
 * hidden, each on a square pavilion rising 4-6 m above its roof (w12); pointed arches on slender piers, spring at about 55% and apex at about 85% of
 * the arcade height (w12); window panels on the upper storeys at a 9 m
 * rhythm (d01).
 *
 * Colour: white stone #f4f2ec (w12 sunlit #f3f2ee-#f6f5f1, shaded
 * #dcdde0; it is white, not grey); domes #f1efe9 with gold rings and
 * finials #c9a14c (w12: the gilt calligraphy bands read gold at a
 * distance); flat roofs #e4e0d7; loggias and arcade backs in shade #b8b3a8
 * (how they read from outside in w12); windows `window`.
 *
 * Night: the palace is floodlit white (_FLOODLIGHT on the stone and the
 * domes); the loggias glow warm; windows glow.
 *
 * Elevation 0; the site is flat reclaimed coast.
 *
 * Photos (EVIDENCE):
 * - w12 "2024-Abu Dhabi + Qasr Al Watan", www.wbayer.com, CC0, https://www.flickr.com/photos/76319087@N08/53553471868 (the arcaded front and domes from the visitor plaza)
 * - w10 "2024-Abu Dhabi + Qasr Al Watan", www.wbayer.com, CC0, https://www.flickr.com/photos/76319087@N08/53553612299 (from the Etihad Towers, far)
 * - w04, w08, w11, w16 (same set), interiors: arches and the hall's dome from inside, https://www.flickr.com/photos/76319087@N08/53553612564, .../53553611949, .../53552417442, .../53553472948
 * - d01 "Abu Dhabi Presidential Palace", Christoph Derndorfer, CC BY-SA 2.0, https://www.flickr.com/photos/14184479@N02/24563645446 (aerial from the east-south-east; 2016)
 * Commons photos found but not downloadable during this build (rate-limited):
 * "Qasr al Watan palace.jpg" and "... by night.jpg" (Darthjipsu, CC BY-SA 4.0),
 * "The Beautiful Qasr Al Watan.jpg" (Aparna112626, CC BY-SA 4.0).
 * Facts: https://en.wikipedia.org/wiki/Qasr_Al_Watan ; https://www.qasralwatan.ae/
 *
 * Doubts: only one open daylight photo of the exterior at ground level
 * (w12) and two distant aerials; the dome positions other than the great
 * dome and the library's are estimates; the heights are estimated; the
 * west and east wings are drawn as OSM maps them though the palace is
 * otherwise symmetric; facade ornament (carved panels, calligraphy) is left
 * out; the separate U-shaped buildings to the north-east and west (OSM
 * way/493836574, way/493836575) are other palace buildings and not part of
 * this model.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 343.5
const AX = 3.5
const TAU = Math.PI * 2

type Mats = { stone: Part; roof: Part; dome: Part; gold: Part; win: Part; shade: Part }
type Face = 'S' | 'E' | 'N' | 'W'
type Box = { x0: number; x1: number; y0: number; y1: number; h: number; arc?: Face[]; arcH?: number; depth?: number; bay?: number; winRow?: boolean }

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nz = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** A quad with one normal for all corners (Part winds it to face that way). */
function q4(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [n, n, n])
  p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [n, n, n])
}

// ------------------------------------------------------------------ plan ---
// Model frame (turned 343.5): x across the axis, y toward the sea.
const DETAIL_ARC: Face[] = ['S', 'E', 'N', 'W']
function boxes(detail: boolean): Box[] {
  const B: Box[] = [
    // main block, south
    { x0: -95.4, x1: 103.0, y0: -137.0, y1: -46.2, h: 26, arc: detail ? ['E', 'W'] : [] },
    { x0: -80.0, x1: 88.3, y0: -159.0, y1: -137.0, h: 22, arc: detail ? ['E', 'W'] : [] },
    { x0: -71.8, x1: 80.1, y0: -179.2, y1: -159.0, h: 22, arc: ['S'], arcH: 12, depth: 4.5, bay: detail ? 5.6 : 12.5 },
    { x0: -14.7, x1: 21.0, y0: -182.2, y1: -179.2, h: 24 },
    // entrance pavilion: open on three sides
    { x0: -8.0, x1: 14.4, y0: -221.6, y1: -182.2, h: 24, arc: ['S', 'E', 'W'], arcH: 15, depth: 12, bay: detail ? 6.6 : 11 },
    // the Great Hall's square base under the drum
    { x0: AX - 23, x1: AX + 23, y0: -118, y1: -72, h: 31 },
    // west wing
    { x0: -167.7, x1: -115.5, y0: -131.4, y1: -48.6, h: 20, arc: detail ? ['N', 'S'] : [], bay: 5.4 },
    { x0: -175.8, x1: -167.7, y0: -123.6, y1: -57.3, h: 20 },
    { x0: -115.5, x1: -109.4, y0: -123.6, y1: -57.3, h: 20 },
    { x0: -183.2, x1: -175.8, y0: -115.4, y1: -64.3, h: 20 },
    { x0: -109.4, x1: -105.0, y0: -115.5, y1: -64.4, h: 20 },
    { x0: -203.2, x1: -183.2, y0: -99.1, y1: -86.0, h: 14, arc: ['W', 'N', 'S'], arcH: 10, depth: 10, bay: detail ? 4.4 : 13 },
    { x0: -105.0, x1: -95.4, y0: -106.4, y1: -77.2, h: 16 },
    // east wing: the House of Knowledge and library
    { x0: 112.5, x1: 181.6, y0: -127.4, y1: -59.7, h: 22, arc: detail ? ['N', 'S'] : [], bay: 5.4 },
    { x0: 103.0, x1: 112.5, y0: -99.4, y1: -84.9, h: 16 },
    { x0: 181.6, x1: 203.9, y0: -101.4, y1: -90.3, h: 14, arc: ['E', 'N', 'S'], arcH: 10, depth: 10, bay: detail ? 3.7 : 11 },
    // link north
    { x0: -22.3, x1: 30.0, y0: -46.2, y1: 56.0, h: 16, arc: detail ? ['E', 'W'] : [], arcH: 9, bay: 5.2 },
    { x0: -48.7, x1: -22.3, y0: -45.9, y1: -11.0, h: 14 },
    { x0: -59.8, x1: -48.7, y0: -45.9, y1: -34.0, h: 14 },
    { x0: 30.0, x1: 55.6, y0: -46.2, y1: -11.2, h: 14 },
    { x0: 55.6, x1: 62.4, y0: -46.2, y1: -34.3, h: 14 },
    // courtyard building: the galleries round the court
    { x0: -58.5, x1: 60.4, y0: 56.0, y1: 65.0, h: 12, arc: detail ? ['N', 'S'] : ['N'], arcH: 9, depth: 3.6, bay: detail ? 5.5 : 11 },
    { x0: -58.5, x1: -51.8, y0: 65.0, y1: 152.4, h: 12, arc: ['E'], arcH: 9, depth: 3.6, bay: detail ? 5.5 : 11 },
    { x0: 53.8, x1: 62.0, y0: 65.0, y1: 152.0, h: 12, arc: ['W'], arcH: 9, depth: 3.6, bay: detail ? 5.5 : 11 },
    { x0: -12.1, x1: 14.2, y0: 65.0, y1: 72.1, h: 18 },
    { x0: -5.9, x1: 8.9, y0: 72.1, y1: 84.7, h: 18, arc: ['N'], arcH: 11, depth: 4, bay: 14.8 },
    // north range
    { x0: -73.9, x1: 77.5, y0: 162.6, y1: 229.0, h: 22, arc: ['S'], arcH: 11, depth: 4, bay: detail ? 5.5 : 11.5 },
    { x0: -73.9, x1: -51.8, y0: 152.4, y1: 162.6, h: 22 },
    { x0: 53.7, x1: 77.5, y0: 152.0, y1: 162.6, h: 22 },
    { x0: 0.5, x1: 17.9, y0: 150.5, y1: 162.6, h: 16 },
    { x0: -92.8, x1: -73.9, y0: 185.5, y1: 197.0, h: 14, arc: ['W'], arcH: 10, depth: 5, bay: 11.5 },
    { x0: 77.5, x1: 96.0, y0: 185.1, y1: 196.7, h: 14, arc: ['E'], arcH: 10, depth: 5, bay: 11.5 },
    { x0: -35.6, x1: 39.0, y0: 229.0, y1: 239.9, h: 20, arc: detail ? ['N'] : [], bay: 5.3 },
    { x0: -14.0, x1: 16.0, y0: 239.9, y1: 256.8, h: 20 },
    { x0: -14.0, x1: 25.3, y0: 256.8, y1: 269.7, h: 20 },
    { x0: -18.8, x1: 19.9, y0: 269.7, y1: 280.0, h: 18, arc: ['N'], arcH: 13, depth: 6, bay: 12.9 },
  ]
  if (detail) for (const b of B) if (!b.arc || b.arc.length === 0) b.arc = []
  return B
}
void DETAIL_ARC

type Dome = { x: number; y: number; z: number; r: number; rise: number; drum: number; finial: number }
const DOMES: Dome[] = [
  { x: AX, y: -95, z: 31, r: 18.5, rise: 19.5, drum: 7, finial: 2.5 }, // the Great Hall
  { x: AX - 52, y: -150, z: 22, r: 8.5, rise: 9.5, drum: 3, finial: 1.6 },
  { x: AX + 52, y: -150, z: 22, r: 8.5, rise: 9.5, drum: 3, finial: 1.6 },
  { x: 3.2, y: -205, z: 24, r: 6.5, rise: 7.5, drum: 2.5, finial: 1.4 }, // entrance pavilion
  { x: -141.6, y: -90, z: 20, r: 10, rise: 11, drum: 4, finial: 1.8 }, // west wing
  { x: 147.0, y: -93.5, z: 22, r: 10, rise: 11, drum: 4, finial: 1.8 }, // library
  { x: AX, y: 196, z: 22, r: 9, rise: 10, drum: 3.5, finial: 1.6 }, // north range
  { x: 1.0, y: 262, z: 20, r: 6.5, rise: 7.5, drum: 2.5, finial: 1.4 },
  { x: -64, y: 171, z: 22, r: 5, rise: 6, drum: 2, finial: 1.2 },
  { x: 68, y: 171, z: 22, r: 5, rise: 6, drum: 2, finial: 1.2 },
  { x: -64, y: 220, z: 22, r: 5, rise: 6, drum: 2, finial: 1.2 },
  { x: 68, y: 220, z: 22, r: 5, rise: 6, drum: 2, finial: 1.2 },
]

// ----------------------------------------------------------------- blocks ---
function faceOf(b: Box, f: Face) {
  const c: Record<Face, [V3, V3, V3]> = {
    S: [[b.x0, b.y0, 0], [b.x1, b.y0, 0], [0, -1, 0]],
    E: [[b.x1, b.y0, 0], [b.x1, b.y1, 0], [1, 0, 0]],
    N: [[b.x1, b.y1, 0], [b.x0, b.y1, 0], [0, 1, 0]],
    W: [[b.x0, b.y1, 0], [b.x0, b.y0, 0], [-1, 0, 0]],
  }
  return c[f]
}

/** A wall rectangle between plan points p, q, heights z0..z1, facing n. */
function wall(part: Part, p: V3, q: V3, z0: number, z1: number, n: V3) {
  q4(part, [p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], n)
}

function block(M: Mats, b: Box, detail: boolean) {
  const arc = b.arc ?? []
  const Ha = arc.length ? (b.arcH ?? Math.min(10, b.h * 0.5)) : 0
  const d = b.depth ?? 3.5
  const inset = (f: Face) => (arc.includes(f) ? d : 0)
  // lower part (behind the arcades), if anything is left of it
  if (Ha > 0) {
    const lx0 = b.x0 + inset('W'), lx1 = b.x1 - inset('E'), ly0 = b.y0 + inset('S'), ly1 = b.y1 - inset('N')
    if (lx1 - lx0 > 1 && ly1 - ly0 > 1) {
      const lb: Box = { x0: lx0, x1: lx1, y0: ly0, y1: ly1, h: Ha }
      for (const f of ['S', 'E', 'N', 'W'] as Face[]) {
        const [p, q, n] = faceOf(lb, f)
        wall(arc.includes(f) ? M.shade : M.stone, p, q, 0, Ha, n)
        // a glazed door in each loggia's back wall, one per bay or so
        if (arc.includes(f) && detail) {
          const L = Math.hypot(q[0] - p[0], q[1] - p[1]), bay = b.bay ?? 8
          const dir: V3 = [(q[0] - p[0]) / L, (q[1] - p[1]) / L, 0]
          const nb = Math.max(1, Math.round(L / bay))
          for (let i = 0; i < nb; i++) {
            const c = add(p, mul(dir, ((i + 0.5) * L) / nb)), o = mul(n, 0.05), w = Math.min(2.2, L / nb / 3)
            q4(M.win, add(add(c, mul(dir, -w)), o), add(add(c, mul(dir, w)), o), add(add(add(c, mul(dir, w)), o), [0, 0, Ha * 0.55]), add(add(add(c, mul(dir, -w)), o), [0, 0, Ha * 0.55]), n)
          }
        }
      }
    }
    // the loggias' ceiling: the upper part's underside
    q4(M.shade, [b.x0, b.y0, Ha], [b.x0, b.y1, Ha], [b.x1, b.y1, Ha], [b.x1, b.y0, Ha], [0, 0, -1])
  }
  // upper part (or the whole block), with a chamfered parapet edge
  const ch = 0.5
  for (const f of ['S', 'E', 'N', 'W'] as Face[]) {
    const [p, q, n] = faceOf(b, f)
    const z0 = arc.includes(f) || Ha > 0 ? Ha : 0
    if (arc.includes(f)) arcade(M, p, q, n, Ha, d, b.bay ?? 8, detail)
    else if (Ha > 0) wall(M.stone, p, q, 0, Ha, n) // non-arcaded faces run down to the ground
    wall(M.stone, p, q, z0, b.h - ch, n)
    const pi = add(p, add(mul(n, -ch), mul(faceDir(p, q), ch))), qi = add(q, add(mul(n, -ch), mul(faceDir(p, q), -ch)))
    const nc = nz(add(n, [0, 0, 1]))
    q4(M.stone, [p[0], p[1], b.h - ch], [q[0], q[1], b.h - ch], [qi[0], qi[1], b.h], [pi[0], pi[1], b.h], nc)
    // upper-storey windows, grouped two storeys tall, on a ~9 m rhythm (15 m in the low model)
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    const top = b.h - 2.5, bot = Math.max(z0 + 2.5, b.h - 10)
    if (b.winRow !== false && top - bot > 3 && L > 8) {
      const nw = Math.max(1, Math.round(L / (detail ? 9 : 15))), dir = faceDir(p, q)
      for (let i = 0; i < nw; i++) {
        const c = add(add(p, mul(dir, ((i + 0.5) * L) / nw)), [0, 0, bot]), o = mul(n, 0.05), w = 1.3
        q4(M.win, add(add(c, mul(dir, -w)), o), add(add(c, mul(dir, w)), o), add(add(add(c, mul(dir, w)), o), [0, 0, top - bot]), add(add(add(c, mul(dir, -w)), o), [0, 0, top - bot]), n)
      }
    }
  }
  q4(M.roof, [b.x0 + ch, b.y0 + ch, b.h], [b.x1 - ch, b.y0 + ch, b.h], [b.x1 - ch, b.y1 - ch, b.h], [b.x0 + ch, b.y1 - ch, b.h], [0, 0, 1])
}
const faceDir = (p: V3, q: V3): V3 => nz([q[0] - p[0], q[1] - p[1], 0])

/**
 * An arcade wall on a face: pointed (two-centred) arches cut through a wall
 * of real thickness, with soffits and jambs, and end walls closing the
 * loggia behind it.
 */
function arcade(M: Mats, p: V3, q: V3, n: V3, Ha: number, depth: number, bay: number, detail: boolean) {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1])
  const dir = faceDir(p, q)
  const nb = Math.max(1, Math.round(L / bay)), bl = L / nb
  const t = detail ? 0.9 : 0.8
  const pw = Math.max(0.9, bl * (detail ? 0.15 : 0.2)), W = bl - pw
  const rise = 0.742 * W
  const hs = Math.max(2.2, Ha - 0.9 - rise) // spring height
  const apexMax = Ha - 0.6
  const m = detail ? 6 : 2 // segments per half arch
  const at = (u: number, z: number, back = 0): V3 => [p[0] + dir[0] * u - n[0] * back, p[1] + dir[1] * u - n[1] * back, z]
  for (let i = 0; i < nb; i++) {
    const u0 = i * bl, u1 = (i + 1) * bl, a0 = u0 + pw / 2, a1 = u1 - pw / 2, mid = (a0 + a1) / 2
    // the arch curve from a0 to a1
    const r = 0.8 * W
    const curve: [number, number][] = []
    for (let k = 0; k <= m; k++) {
      // left half: centre (a0 + r, hs), angle from pi down to the apex angle
      const th1 = Math.acos((mid - (a0 + r)) / r)
      const th = Math.PI - ((Math.PI - th1) * k) / m
      curve.push([a0 + r + r * Math.cos(th), Math.min(apexMax, hs + r * Math.sin(th))])
    }
    for (let k = m - 1; k >= 0; k--) curve.push([2 * mid - curve[k][0], curve[k][1]])
    for (const back of detail ? [0, t] : [0]) {
      const nn: V3 = back ? mul(n, -1) : n
      const part = M.stone
      // piers
      q4(part, at(u0, 0, back), at(a0, 0, back), at(a0, hs, back), at(u0, hs, back), nn)
      q4(part, at(a1, 0, back), at(u1, 0, back), at(u1, hs, back), at(a1, hs, back), nn)
      // spandrels above the arch
      q4(part, at(u0, hs, back), at(a0, hs, back), at(a0, Ha, back), at(u0, Ha, back), nn)
      for (let k = 0; k < curve.length - 1; k++) {
        const [ua, za] = curve[k], [ub, zb] = curve[k + 1]
        q4(part, at(ua, za, back), at(ub, zb, back), at(ub, Ha, back), at(ua, Ha, back), nn)
      }
      q4(part, at(a1, hs, back), at(u1, hs, back), at(u1, Ha, back), at(a1, Ha, back), nn)
    }
    // soffit (intrados) through the wall's thickness
    for (let k = 0; k < curve.length - 1; k++) {
      const [ua, za] = curve[k], [ub, zb] = curve[k + 1]
      const cu = (ua + ub) / 2, cz = (za + zb) / 2
      const sn = nz(add(mul(dir, mid - cu), [0, 0, hs - cz - 0.5]))
      q4(M.stone, at(ua, za, 0), at(ub, zb, 0), at(ub, zb, t), at(ua, za, t), sn)
    }
    // jambs
    q4(M.stone, at(a0, 0, 0), at(a0, hs, 0), at(a0, hs, t), at(a0, 0, t), dir)
    q4(M.stone, at(a1, 0, 0), at(a1, 0, t), at(a1, hs, t), at(a1, hs, 0), mul(dir, -1))
  }
  // end walls closing the loggia
  for (const [u, s] of [[0, 1], [L, -1]] as [number, number][]) {
    const nn = mul(dir, s)
    q4(M.stone, at(u, 0, 0), at(u, 0, depth), at(u, Ha, depth), at(u, Ha, 0), nn)
  }
}

// ------------------------------------------------------------------ domes ---
function dome(M: Mats, D: Dome, detail: boolean, great: boolean) {
  const N = great ? (detail ? 40 : 20) : detail ? 24 : D.r > 7 ? 14 : 10
  const R = great ? (detail ? 12 : 7) : detail ? 8 : D.r > 7 ? 4 : 3
  const ring = (rr: number, z: number, k: number): V3 => [D.x + rr * Math.cos((TAU * k) / N), D.y + rr * Math.sin((TAU * k) / N), z]
  const rad = (k: number): V3 => [Math.cos((TAU * k) / N), Math.sin((TAU * k) / N), 0]
  const rd = D.r * 1.06, z0 = D.z, z1 = D.z + D.drum
  // drum
  for (let k = 0; k < N; k++) {
    M.stone.tri(ring(rd, z0, k), ring(rd, z0, k + 1), ring(rd, z1, k + 1), [0, 0], [0, 0], [0, 0], [rad(k), rad(k + 1), rad(k + 1)])
    M.stone.tri(ring(rd, z0, k), ring(rd, z1, k + 1), ring(rd, z1, k), [0, 0], [0, 0], [0, 0], [rad(k), rad(k + 1), rad(k)])
    // ledge from the drum to the dome's foot, and a gold band
    M.gold.tri(ring(rd, z1, k), ring(rd, z1, k + 1), ring(D.r, z1 + 0.6, k + 1), [0, 0], [0, 0], [0, 0], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
    M.gold.tri(ring(rd, z1, k), ring(D.r, z1 + 0.6, k + 1), ring(D.r, z1 + 0.6, k), [0, 0], [0, 0], [0, 0], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
  // drum windows (detail): tall arched panels on the great drum
  if (detail && great) {
    for (let k = 0; k < N; k += 2) {
      const a = (TAU * (k + 0.5)) / N, c: V3 = [Math.cos(a), Math.sin(a), 0], tg: V3 = [-Math.sin(a), Math.cos(a), 0]
      const base: V3 = [D.x + c[0] * (rd + 0.05), D.y + c[1] * (rd + 0.05), z0 + 1.2]
      const w = 0.9
      q4(M.win, add(base, mul(tg, -w)), add(base, mul(tg, w)), add(add(base, mul(tg, w)), [0, 0, D.drum - 2.6]), add(add(base, mul(tg, -w)), [0, 0, D.drum - 2.6]), c)
    }
  }
  // the dome: an elevated (slightly pointed) profile
  const zb = z1 + 0.6
  const prof = (j: number) => { const ph = (Math.PI / 2) * (j / R); return { r: D.r * Math.cos(ph) ** 0.92, z: zb + D.rise * Math.sin(ph) } }
  for (let j = 0; j < R; j++) {
    const a = prof(j), b = prof(j + 1)
    const nrm = (pr: { r: number; z: number }, k: number): V3 => {
      const c = rad(k)
      const nx = (pr.r / D.r) * D.rise, nzv = ((pr.z - zb) / D.rise) * D.r
      return nz([c[0] * nx, c[1] * nx, nzv + 0.001])
    }
    for (let k = 0; k < N; k++) {
      if (j === R - 1) {
        M.dome.tri(ring(a.r, a.z, k), ring(a.r, a.z, k + 1), [D.x, D.y, b.z], [0, 0], [0, 0], [0, 0], [nrm(a, k), nrm(a, k + 1), [0, 0, 1]])
      } else {
        M.dome.tri(ring(a.r, a.z, k), ring(a.r, a.z, k + 1), ring(b.r, b.z, k + 1), [0, 0], [0, 0], [0, 0], [nrm(a, k), nrm(a, k + 1), nrm(b, k + 1)])
        M.dome.tri(ring(a.r, a.z, k), ring(b.r, b.z, k + 1), ring(b.r, b.z, k), [0, 0], [0, 0], [0, 0], [nrm(a, k), nrm(b, k + 1), nrm(b, k)])
      }
    }
  }
  // gold finial: a ball on a spike
  const top = zb + D.rise, f = D.finial, s = detail || great ? 6 : 4
  const fr = (h: number, rr: number, k: number): V3 => [D.x + rr * Math.cos((TAU * k) / s), D.y + rr * Math.sin((TAU * k) / s), top + h]
  for (let k = 0; k < s; k++) {
    M.gold.quad(fr(-0.3, f * 0.18, k), fr(-0.3, f * 0.18, k + 1), fr(f * 0.35, f * 0.22, k + 1), fr(f * 0.35, f * 0.22, k))
    M.gold.quad(fr(f * 0.35, f * 0.22, k), fr(f * 0.35, f * 0.22, k + 1), fr(f * 0.5, f * 0.12, k + 1), fr(f * 0.5, f * 0.12, k))
    M.gold.tri(fr(f * 0.5, f * 0.12, k), fr(f * 0.5, f * 0.12, k + 1), [D.x, D.y, top + f])
  }
}

function build(detail: boolean): Mats {
  const M: Mats = { stone: new Part(), roof: new Part(), dome: new Part(), gold: new Part(), win: new Part(), shade: new Part() }
  for (const b of boxes(detail)) block(M, b, detail)
  // every dome but the great one stands on a square pavilion rising above its roof (w12)
  DOMES.forEach((d, i) => {
    if (i === 0) { dome(M, d, detail, true); return }
    if (!detail && d.r < 6) return // the small corner domes are in the detail model only
    const s = d.r * 1.25, lift = d.r > 7 ? 6 : 4
    block(M, { x0: d.x - s, x1: d.x + s, y0: d.y - s, y1: d.y + s, h: d.z + lift, winRow: detail }, detail)
    dome(M, { ...d, z: d.z + lift }, detail, false)
  })
  return M
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : 0.8)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.stone, material: { ...finish('qaw-stone', 0xf4f2ec), floodlight: lit } },
    { part: M.roof, material: finish('qaw-roof', 0xe4e0d7) },
    { part: M.dome, material: { ...finish('qaw-dome', 0xf1efe9, 0.6), floodlight: () => 0.7 } },
    { part: M.gold, material: { ...finish('qaw-gold', 0xc9a14c, 0.45), floodlight: () => 0.6 } },
    { part: M.win, material: PALETTE.window },
    { part: M.shade, material: { ...finish('qaw-loggia', 0xb8b3a8), floodlight: () => 0.9 } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Qasr Al Watan', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: BEARING, elevation: 0, height: 60,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('abu-dhabi-qasr-al-watan.glb', materials(build(false)), 6500, 250_000)
  await write('abu-dhabi-qasr-al-watan.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
}
