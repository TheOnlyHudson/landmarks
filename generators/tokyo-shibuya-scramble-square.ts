/**
 * Shibuya Scramble Square (渋谷スクランブルスクエア), East Building, Shibuya,
 * Tokyo: procedural, CC0-1.0.  bun generators/tokyo-shibuya-scramble-square.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Opened 2019 (Nikken Sekkei, Tange Associates, Kengo Kuma); 47 floors,
 * 229.7 m (OSM height 229.706; Wikipedia "Shibuya Scramble Square": 229.71 m).
 * A pale-blue glass box that widens a little as it rises, its curtain wall
 * striped by short dark vertical fins set in a staggered, stepping pattern,
 * topped by SHIBUYA SKY: an open roof deck behind a glass parapet whose
 * roof slab sweeps down in an S-curve to the open "Sky Edge" corner over
 * the Scramble Crossing.
 *
 * Frame: built turned to bearing 338.2 (the outline's long walls). Origin at
 * 139.70222, 35.65838, the outline's centroid within 1.5 m; y = 0 is the
 * ground. The outline (way/617560918, the only OSM way for the building,
 * replaced) is a 59.4 x 69 m rectangle, centred at (0, -1.45) in this frame.
 *
 * From photos:
 * - the skirt (0-45 m, about a fifth of the height): the base widens in a
 *   concave curve to the full outline at the ground, clad in dense white
 *   vertical louvres (Syced's photo from Hikarie; Sakura Torch's curved
 *   lower volume), under a pale ledge where the facade changes;
 * - above it the faces lean outward again: verticals that should converge in
 *   upward views (Kakidai's two 2019 photos, Sakura Torch's) stay parallel,
 *   so the tower is 7% narrower each way at 45 m than at 195 m (estimated);
 * - the fins: many thin 3D fins (22 columns per face in the low model, 40
 *   in the detail), in staggered runs of 3 to 7 floors whose ends step
 *   diagonally across the faces;
 * - the crown: a bold pale slab fascia, the helipad raised on a steel frame
 *   to 229.7 m with its H, the lift housing, and a steel framework over the
 *   Sky Edge corner tracing the volume the dip cuts away;
 * - the roof: the main deck's slab edge at ~222 m, the glass parapet to
 *   ~224 m, the rooftop structures (lift and stair housings, the helipad
 *   frame) to 229.7 m; toward the north-west corner (the Sky Edge) the slab
 *   sweeps down in an S-curve to ~213 m, exposing a corner terrace;
 * - the floor bands every three floors read as pale lines.
 * Estimated: the flare, the dip's extent (about 30 m along each face from
 * the corner), the housings' sizes.
 *
 * Colours (daylight): the glass reads a pale sky blue (#86b7d2 to #a4c8dc),
 * drawn `window` #86b8d4 (offices lit at night); the fins a dark steel grey
 * (#4f5c69), drawn #66737f; the roof slab's fascia pale grey; the parapet
 * translucent glass.
 *
 * Photos (Wikimedia Commons):
 * - "2019 Shibuya Scramble Square 3.jpg", Kakidai, CC BY-SA 4.0
 * - "2019 Shibuya Scramble Square 2.jpg", Kakidai, CC BY-SA 4.0
 * - "SHIBUYA SCRAMBLE SQUARE East Tower.jpg", Sakura Torch, CC BY-SA 4.0
 * - "Shibuya Scramble Square building, taken from Shibuya Stream.jpg", Syced, CC0
 * - "Shibuya Scramble Square SHIBUYA SKY (53002237604).jpg", Dick Thomas
 *   Johnson, CC BY 2.0 (the roof deck's edge and glazing)
 * No lidar (Japan). No look-only sources.
 * Doubts: the skirt is drawn on all four sides (the photos show it clearly
 * on the station side only); the V-shaped glazed base and the LED screen
 * are left out; which corner carries the dip is read from the photos' viewpoints
 * (the one over the crossing).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, member, box, rect, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

const CY = -1.45, HX = 29.7, HY = 34.5
const FLARE = 0.97 // the foot's size relative to the top
const TOP = 222      // the deck's slab edge
const DIP = 213      // the slab's edge at the Sky Edge corner
type Lod = { detail: boolean }

const SKIRT = 45 // the skirt's top: the facade changes here (about 1/5 height)
const WAIST = 0.93 // plan scale at the skirt's top
/**
 * Plan scale at height z. Below SKIRT the base widens in a concave curve to
 * the full OSM outline at the ground (the skirt); above it the tower leans
 * out again from WAIST to the full outline at 195 m.
 */
const scaleAt = (z: number) => z < SKIRT ? WAIST + (1 - WAIST) * (1 - z / SKIRT) ** 2 : WAIST + (1 - WAIST) * Math.min(1, (z - SKIRT) / 150)
void FLARE
/** The perimeter, counter-clockwise, at unit scale: corners SE, NE, NW, SW. */
const CORNERS: XY[] = [[HX, CY - HY], [HX, CY + HY], [-HX, CY + HY], [-HX, CY - HY]]
const at = (p: XY, z: number): V3 => { const s = scaleAt(z); return [p[0] * s, CY + (p[1] - CY) * s, z] }

/** The slab's edge height over plan point p: TOP, sweeping down to DIP near the north-west corner. */
function edgeZ(p: XY) {
  const dx = (p[0] + HX) / 30, dy = (CY + HY - p[1]) / 30 // 0 at the corner, 1 thirty metres along
  const d = Math.min(1, Math.hypot(Math.min(1, dx), Math.min(1, dy)) * 0.85 + 0.15 * Math.min(dx, dy))
  const t = Math.max(0, Math.min(1, d))
  const s = t * t * (3 - 2 * t)
  return DIP + (TOP - DIP) * s
}

function build(L: Lod): Layer[] {
  const glass = new Part(), fin = new Part(), trim = new Part(), roof = new Part(), para = new Part(), housing = new Part()
  // the perimeter, subdivided so the slab edge can curve
  const step = L.detail ? 2.5 : 5
  const ring: XY[] = []
  for (let i = 0; i < 4; i++) {
    const a = CORNERS[i], b = CORNERS[(i + 1) % 4], L0 = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L0 / step)
    for (let k = 0; k < n; k++) ring.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  // the glass walls, from the ground to the slab edge (with the flare)
  const levels = L.detail ? [0, 4, 9, 15, 22, 30, 38, SKIRT, 70, 100, 130, 160, 195] : [0, 6, 14, 24, 34, SKIRT, 95, 145, 195]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const za = edgeZ(a) - 2, zb = edgeZ(b) - 2
    for (let k = 0; k < levels.length; k++) {
      const z0 = levels[k], z1a = k + 1 < levels.length ? levels[k + 1] : za, z1b = k + 1 < levels.length ? levels[k + 1] : zb
      glass.quad(at(a, z0), at(b, z0), at(b, z1b), at(a, z1a))
    }
    // the slab's fascia, a bold 3.5 m pale band
    trim.quad(at(a, za - 1.5), at(b, zb - 1.5), at(b, zb + 2), at(a, za + 2))
  }
  // the roof deck: the slab's top follows the edge heights (warped down to the corner)
  const top = ring.map((p) => at(p, edgeZ(p)))
  const inner = ring.map(([x, y]) => [x * 0.94, CY + (y - CY) * 0.94] as XY)
  for (const [a, b, c] of earcut(inner)) {
    const P = (q: XY): V3 => { const v = at(q, edgeZ(q)); return [v[0], v[1], v[2] - 0.6] }
    roof.tri(P(inner[a]), P(inner[b]), P(inner[c]))
  }
  // the band between the fascia's top and the sunken deck
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const ia = at(inner[i], edgeZ(inner[i]) - 0.6), ib = at(inner[j], edgeZ(inner[j]) - 0.6)
    trim.quad(top[i], top[j], ib, ia)
  }
  // the glass parapet round the deck, 1.8 m, translucent
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const a = top[i], b = top[j]
    para.quad(a, b, [b[0], b[1], b[2] + 1.8], [a[0], a[1], a[2] + 1.8])
    if (L.detail) member(trim, [a[0], a[1], a[2] + 1.8], [b[0], b[1], b[2] + 1.8], 0.12, 4)
  }
  // rooftop: the lift/stair housing, and the helipad raised on a steel
  // frame over the deck (its rim at 229.7 m), with its pale H
  box(housing, rect(-4, CY - 14, 9, 6), TOP - 0.6, 227.5)
  const HP: XY = [10, CY + 4], hh = 11
  box(housing, rect(HP[0], HP[1], hh, hh), 228.4, 229.7)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    member(fin, [HP[0] + sx * (hh - 1), HP[1] + sy * (hh - 1), TOP - 0.6], [HP[0] + sx * (hh - 1), HP[1] + sy * (hh - 1), 228.4], 0.45, 4)
    member(fin, [HP[0] + sx * (hh - 1), HP[1] + sy * (hh - 1), TOP - 0.6], [HP[0] + sx * 3, HP[1] + sy * 3, 228.4], 0.3, 4)
  }
  for (const r of [rect(HP[0] - 3.2, HP[1], 0.7, 4.5), rect(HP[0] + 3.2, HP[1], 0.7, 4.5), rect(HP[0], HP[1], 2.6, 0.6)]) box(trim, r, 229.7, 229.78)
  // the Sky Edge corner framework: posts and raking members over the dipped
  // corner, tracing the volume the dip cuts away (the angled top in photos)
  const ce: XY = [-HX, CY + HY]
  const posts: XY[] = [[0, 0], [12, 0], [24, 0], [0, -12], [0, -24], [12, -12]]
  for (const [dx, dy] of posts) {
    const q: XY = [ce[0] + dx + (dx === 0 ? 0.6 : 0), ce[1] + dy - (dy === 0 ? 0.6 : 0)]
    const v = at(q, edgeZ(q))
    member(fin, [v[0], v[1], v[2]], [v[0], v[1], TOP + 3.5], 0.35, 4)
  }
  const tq = (dx: number, dy: number): V3 => { const q: XY = [ce[0] + dx + 0.6, ce[1] + dy - 0.6]; const v = at(q, TOP); return [v[0], v[1], TOP + 3.5] }
  for (const [a2, b2] of [[[0, 0], [24, 0]], [[0, 0], [0, -24]], [[12, 0], [12, -12]], [[0, -12], [12, -12]]] as [number, number][][]) member(fin, tq(a2[0], a2[1]), tq(b2[0], b2[1]), 0.35, 4)
  for (const [dx, dy] of [[12, 0], [0, -12], [24, 0], [0, -24]]) {
    const q: XY = [ce[0] + dx + (dx === 0 ? 0.6 : 0), ce[1] + dy - (dy === 0 ? 0.6 : 0)], v = at(q, edgeZ(q))
    member(fin, [v[0], v[1], v[2]], tq(dx > 0 ? dx - 12 : 0, dy < 0 ? dy + 12 : 0), 0.25, 4)
  }

  // the curtain wall's pattern: floor bands every three floors (pale) and the
  // staggered fins (dark), on all four faces
  const FL = 4.5 // floor height
  for (let f = 0; f < 4; f++) {
    const a = CORNERS[f], b = CORNERS[(f + 1) % 4]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, nx = uy, ny = -ux
    const P = (s: number, z: number, out: number): V3 => {
      const q: XY = [a[0] + ux * s, a[1] + uy * s]
      const v = at(q, z), sc = scaleAt(z)
      return [v[0] + nx * out, v[1] + ny * out, z]
      void sc
    }
    const zmax = (s: number) => edgeZ([a[0] + ux * s, a[1] + uy * s]) - 2.5
    // floor bands
    for (let z = SKIRT + 3 * FL; z < TOP - 3; z += 3 * FL) {
      const segs = L.detail ? 12 : 4
      for (let k = 0; k < segs; k++) {
        const s0 = (len * k) / segs, s1 = (len * (k + 1)) / segs
        if (z + 0.5 > Math.min(zmax(s0), zmax(s1))) continue
        trim.quad(P(s0, z, 0.06), P(s1, z, 0.06), P(s1, z + 0.3, 0.06), P(s0, z + 0.3, 0.06))
      }
    }
    // fins: many thin 3D fins (0.35 x 0.8 m) in staggered runs of 3 to 7
    // floors, so their ends step diagonally across each face (photos)
    const cols = L.detail ? 40 : 20
    for (let c = 1; c < cols; c++) {
      const s = (len * c) / cols
      const w = L.detail ? 0.3 : 0.4, d = L.detail ? 0.8 : 0.9
      for (let k = -1; ; k++) {
        const run = 3 + ((c * 3 + k) % 5)
        const z0 = SKIRT + 2 + (((c * 2) % 9) + k * 11) * FL, z1 = z0 + run * FL
        if (z0 > zmax(s) - 2) break
        if (z1 < SKIRT + 2) continue
        const zz0 = Math.max(SKIRT + 2, z0), zz1 = Math.min(z1, zmax(s))
        if (zz1 - zz0 < 3) continue
        fin.quad(P(s - w / 2, zz0, d), P(s + w / 2, zz0, d), P(s + w / 2, zz1, d), P(s - w / 2, zz1, d))
        fin.quad(P(s + w / 2, zz0, 0), P(s + w / 2, zz1, 0), P(s + w / 2, zz1, d), P(s + w / 2, zz0, d))
        fin.quad(P(s - w / 2, zz0, 0), P(s - w / 2, zz0, d), P(s - w / 2, zz1, d), P(s - w / 2, zz1, 0))
      }
    }
    // the skirt: dense white vertical fins following its concave curve (the
    // station-side louvres, Syced/Hikarie photo), under a pale ledge at SKIRT
    const sk = L.detail ? 1.6 : 4
    for (let s = sk / 2; s < len; s += sk) {
      const zs = L.detail ? [0, 9, 18, 28, 37, SKIRT - 1] : [0, 15, 30, SKIRT - 1]
      for (let k = 0; k < zs.length - 1; k++) member(trim, P(s, zs[k], 0.5), P(s, zs[k + 1], 0.5), L.detail ? 0.25 : 0.32, 3, [0, 0, 1])
    }
    for (let k = 0; k < 6; k++) {
      const s0 = (len * k) / 6, s1 = (len * (k + 1)) / 6
      trim.quad(P(s0, SKIRT - 1, 1.0), P(s1, SKIRT - 1, 1.0), P(s1, SKIRT + 1, 1.0), P(s0, SKIRT + 1, 1.0))
      trim.quad(P(s1, SKIRT + 1, 1.0), P(s0, SKIRT + 1, 1.0), P(s0, SKIRT + 1, 0), P(s1, SKIRT + 1, 0))
    }
    // the entrance level: a darker glazed base band (lit at night: entrance)
    housing.quad(P(0.5, 0, 0.05), P(len - 0.5, 0, 0.05), P(len - 0.5, 0.6, 0.05), P(0.5, 0.6, 0.05))
  }

  return [
    { part: glass, material: { name: 'window', color: 0x86b8d4, roughness: 0.3 } },
    { part: fin, material: finish('scramble-fin', 0x66737f) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: para, material: { name: 'glass', color: 0x7fc4de, roughness: 0.2, opacity: 0.3, doubleSided: true } },
    { part: housing, material: finish('scramble-housing', 0xd5d9dc) },
  ]
}

const meta = { bearing: 338.2, elevation: 0, height: 229.7 }
await writeModel('tokyo-shibuya-scramble-square', 'tokyo-shibuya-scramble-square.glb', 'Shibuya Scramble Square', build({ detail: false }), meta, 5000, 256_000)
await writeModel('tokyo-shibuya-scramble-square', 'tokyo-shibuya-scramble-square.detail.glb', 'Shibuya Scramble Square', build({ detail: true }), meta, 40_000, 1536 * 1024)
