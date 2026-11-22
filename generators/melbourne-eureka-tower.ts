/**
 * Eureka Tower, Southbank, Melbourne (2006, Fender Katsalidis): procedural,
 * CC0-1.0.
 * bun generators/melbourne-eureka-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from the OSM rings. Anchor = centroid of the OSM outline
 * way/13307317 (144.964650, -37.821699); the tower stands in its
 * north-west part.
 *
 * Identity, in order: the tall blue glass shaft with two shorter wings
 * stepped against its long sides; the gold-glazed top ten floors (the
 * crown) set on the shaft; the white horizontal bands; the red vertical bar
 * on the crown; the slanted white fold where the crown meets the shaft.
 *
 * Evidence:
 *  - plan: OSM building:parts: shaft way/272730141 (290 m), north-east
 *    part way/796349959 (207 m), south-west part way/796349960 (177 m),
 *    crown way/272731350, podium = the outline way/13307317 (20 m). The
 *    photos (Rader, Kgbo) show one slim block of near-constant width, not a
 *    shaft with wide wings, so the tower is drawn as the union of the three
 *    parts with subtle steps: the SW end steps in 3 m at 177 m and the NE
 *    end 3 m at 207 m (the OSM part heights); the shoulder is visible on
 *    the left of Rader's view (lead review round 1).
 *  - crown: gold glass from 252 m (photo-scaled; OSM's 261 reads short)
 *    to the 297.3 m roof (published, Wikipedia/CTBUH, 91 storeys) over all
 *    the block but its north-east corner, which stays blue to 290 m. The
 *    dividing line is from the photos; OSM's notched crown part matches
 *    no photo. Detail model: vertical gold fins every 1.6 m and floor
 *    ledges on the crown (Crisco 1492's telephoto).
 *  - lines: thin pale-blue lines every three floors on every face (the
 *    real tower has a pale spandrel line on most floors).
 *  - fold: a pale slanted strip on the north face from the crown's corner
 *    at the roof down to the 207 m step (Kgbo, Crisco 1492).
 *  - red: the bar on the crown's north and south faces, 244-265 m, and the
 *    diagonal red line up the lower north side from 70 to 185 m (Kgbo
 *    2024), on the NE part's north-west face.
 *  - colours: shaft glass a mid blue-grey pulled from the deep blue of the
 *    sunlit photos to the palette's lightness; crown gold from the
 *    Shrine and Rader photos; the bands white; the podium grey concrete.
 *
 * Photos (Wikimedia Commons):
 *  - "Eureka Tower, Melbourne, 2024.jpg", Kgbo, CC BY-SA 4.0 (north, river)
 *    https://commons.wikimedia.org/wiki/File:Eureka_Tower,_Melbourne,_2024.jpg
 *  - "Eureka Tower (top), Melbourne 2017-10-30.jpg", Crisco 1492, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Eureka_Tower_(top),_Melbourne_2017-10-30.jpg
 *  - "Eureka Tower from the Shrine of Remembrance 20180726-027.jpg", Gary
 *    Houston, CC0 (south)
 *    https://commons.wikimedia.org/wiki/File:Eureka_Tower_from_the_Shrine_of_Remembrance_20180726-027.jpg
 *  - "Eureka Tower in Melbourne, Australia.jpg", Matthew T Rader, CC BY-SA 4.0
 *    (north-west, across the Yarra)
 *    https://commons.wikimedia.org/wiki/File:Eureka_Tower_in_Melbourne,_Australia.jpg
 *  - "Melbourne (AU), Flinders Street Railway Station -- 2019 -- 1583.jpg",
 *    Dietmar Rabich, CC BY-SA 4.0 (north-east, distant)
 *    https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_Flinders_Street_Railway_Station_--_2019_--_1583.jpg
 * No lidar (none open to our tools in Australia); no commercial imagery.
 * Look-only references: none.
 *
 * Night: the crown is lit gold (`neon-eureka-gold`, fins `neon-eureka-gold-fin`);
 * the glass is `window` (lit apartments); the red bar and line glow red.
 *
 * Writes models/melbourne-eureka-tower.glb and .detail.glb (from zoom 16).
 *
 * Terrain: `terrain.ts check --zoom 12` prints ok.
 *
 * Doubts: the crown's plan and the block's steps depart from OSM's parts
 * (see above); the fold is one slanted strip on the north face only; the podium's
 * facades are plain (no photo shows them whole).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, panel } from './chi-aon-center'

const ID = 'melbourne-eureka-tower'

const PODIUM: XY[] = [[2.7, -51.3], [20.7, -37.1], [22.6, -39.8], [62.1, -17.3], [59.5, -13.1], [40.0, -18.6], [32.8, 1.0], [24.6, 11.0], [44.7, 17.2], [36.6, 26.7], [25.0, 18.0], [8.9, 38.0], [0.8, 48.1], [-2.6, 45.2], [-5.3, 48.4], [-24.8, 33.4], [-57.6, 22.1]]
const SHAFT: XY[] = [[-17.6, 5.1], [2.2, -7.5], [3.2, -5.4], [8.2, -4.5], [5.4, 2.9], [0.7, 15.2], [-2.8, 24.7], [-5.1, 23.0], [-6.1, 23.6], [-21.6, 32.9], [-23.4, 30.2], [-28.5, 31.7], [-26.3, 24.8], [-19.7, 4.7]]
const CROWN: XY[] = [[-12.1, 1.6], [2.2, -7.5], [3.2, -5.4], [8.2, -4.5], [5.4, 2.9], [1.3, 13.8], [-12.3, 27.3], [-21.6, 32.9], [-23.4, 30.2], [-28.5, 31.7], [-26.3, 24.8], [-23.0, 14.8]]
const PLANT: XY[] = [[0.2, 15.2], [-2.6, 22.6], [-10.6, 25.6]]
const WING_NE: XY[] = [[0.7, 15.2], [5.4, 2.9], [20.4, 14.3], [5.3, 33.4], [-6.1, 23.6], [2.7, 18.3]]
const WING_SW: XY[] = [[-23.1, -7.0], [-12.4, 1.8], [-17.6, 5.1], [-19.7, 4.7], [-26.3, 24.8], [-40.6, 13.2]]

const PODIUM_H = 20, SHAFT_H = 290, CROWN_Z0 = 252, TOP = 297.3, NE_H = 207, SW_H = 177
const FLOOR = TOP / 91

const inside = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** Offset a counter-clockwise ring outward by d (mitred, capped). */
function outset(r: XY[], d: number): XY[] {
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + r.length) % r.length], c), n2 = nrm(c, r[(i + 1) % r.length])
    const k = Math.max(1 + n1[0] * n2[0] + n1[1] * n2[1], 0.4)
    return [c[0] + ((n1[0] + n2[0]) / k) * d, c[1] + ((n1[1] + n2[1]) / k) * d] as XY
  })
}

/** Keep the part of a ring where f(p) >= 0 (Sutherland-Hodgman, one half-plane). */
function clip(r: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out.filter((p, i) => Math.hypot(p[0] - out[(i + 1) % out.length][0], p[1] - out[(i + 1) % out.length][1]) > 0.05)
}
/** Signed side of p from the line a->b (positive on the left). */
const side = (a: XY, b: XY) => (p: XY) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

// The tower as one block: the union of OSM's shaft and its two wing parts.
const BLOCK: XY[] = [[-23.1, -7.0], [-12.4, 1.8], [2.2, -7.5], [3.2, -5.4], [8.2, -4.5], [5.4, 2.9], [20.4, 14.3], [5.3, 33.4], [-6.1, 23.6], [-21.6, 32.9], [-23.4, 30.2], [-28.5, 31.7], [-26.3, 24.8], [-40.6, 13.2]]
// the subtle steps: the SW end steps in at the SW wing's top, the NE end at the NE wing's
const T1 = clip(BLOCK, (p) => p[0] + 37.5)
const T2 = clip(T1, (p) => 17.5 - p[0])
// the gold crown: the middle of the top, between the two blue corners (lines from the photos)
const L1 = side([4.3, 15.8], [-9.3, 29.3]) // NE corner beyond it stays blue
const CROWN_R = clip(T2, L1)
const NE_TOP = clip(T2, (p) => -L1(p))

export function build(detail = false) {
  const glass = new Part(), line = new Part(), gold = new Part(), red = new Part(), base = new Part(), fin = new Part()

  // ---- podium
  walls(base, PODIUM, 0, PODIUM_H)
  cap(base, PODIUM, PODIUM_H)
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    for (const [z0, z1] of [[4.5, 10.5], [12, 18]] as const) panel(glass, a, b, 1.2, L - 1.2, z0, z1, 0.05)
  }

  // ---- the blue glass block in tiers, thin pale-blue lines every three floors
  const tiers: [XY[], number, number][] = [
    [BLOCK, PODIUM_H - 0.5, SW_H], [T1, SW_H, NE_H], [T2, NE_H, CROWN_Z0],
    [NE_TOP, CROWN_Z0, SHAFT_H],
  ]
  for (const [r, z0, z1] of tiers) {
    if (r.length < 3) continue
    walls(glass, r, z0, z1)
    cap(base, r, z1)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 1) continue
      for (let f = 3; f * FLOOR < z1 - 1; f += 3) {
        const z = f * FLOOR
        if (z <= z0 + 0.5) continue
        panel(line, a, b, 0, L, z - 0.2, z + 0.2, 0.06)
      }
    }
  }

  // ---- the crown: gold glass, from 252 m to the roof, a little proud of the shaft
  const crown = outset(CROWN_R, 0.35)
  walls(gold, crown, CROWN_Z0, TOP)
  cap(gold, crown, TOP)
  cap(gold, crown, CROWN_Z0, false)
  if (detail) {
    // the crown's vertical fins and floor ledges
    for (let i = 0; i < crown.length; i++) {
      const a = crown[i], b = crown[(i + 1) % crown.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const P = (t: number, z: number, o: number): V3 => [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o, z]
      const k = Math.max(1, Math.round(L / 1.6))
      for (let j = 0; j <= k; j++) {
        const t = Math.min(L - 0.15, Math.max(0.15, (j * L) / k)), w = 0.13, d = 0.5
        fin.quad(P(t - w, CROWN_Z0, d), P(t + w, CROWN_Z0, d), P(t + w, TOP, d), P(t - w, TOP, d))
        fin.quad(P(t - w, CROWN_Z0, 0), P(t - w, CROWN_Z0, d), P(t - w, TOP, d), P(t - w, TOP, 0))
        fin.quad(P(t + w, CROWN_Z0, d), P(t + w, CROWN_Z0, 0), P(t + w, TOP, 0), P(t + w, TOP, d))
      }
      for (let f = 1; CROWN_Z0 + f * FLOOR < TOP - 0.5; f++) {
        const z = CROWN_Z0 + f * FLOOR
        fin.quad(P(0, z - 0.12, 0.3), P(L, z - 0.12, 0.3), P(L, z + 0.12, 0.3), P(0, z + 0.12, 0.3))
        fin.quad(P(0, z + 0.12, 0.3), P(L, z + 0.12, 0.3), P(L, z + 0.12, 0), P(0, z + 0.12, 0))
      }
    }
  }

  // ---- the slanted pale fold on the north face, from the crown's corner down to the NE step
  {
    const a: XY = [-6.1, 23.6], b: XY = [-21.6, 32.9], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * 0.2, a[1] + u[1] * t + n[1] * 0.2, z]
    const t1 = 0.4 * L, w = 0.6
    line.quad(P(0.3, NE_H), P(0.3 + 2 * w, NE_H), P(t1 + w, TOP), P(t1 - w, TOP))
  }

  // ---- red: the bar on the crown's north and south faces, and the diagonal red line
  // running up the lower shaft on the north side (70-185 m)
  const strip = (a: XY, b: XY, s0: number, z0: number, s1: number, z1: number, w: number, d: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (t: number, z: number, o: number): V3 => [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o, z]
    red.quad(P(s0 - w / 2, z0, d), P(s0 + w / 2, z0, d), P(s1 + w / 2, z1, d), P(s1 - w / 2, z1, d))
    red.quad(P(s0 - w / 2, z0, 0), P(s0 - w / 2, z0, d), P(s1 - w / 2, z1, d), P(s1 - w / 2, z1, 0))
    red.quad(P(s0 + w / 2, z0, d), P(s0 + w / 2, z0, 0), P(s1 + w / 2, z1, 0), P(s1 + w / 2, z1, d))
    red.quad(P(s0 - w / 2, z0, 0), P(s0 + w / 2, z0, 0), P(s0 + w / 2, z0, d), P(s0 - w / 2, z0, d))
  }
  {
    const a: XY = [-6.1, 23.6], b: XY = [-21.6, 32.9], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    strip(a, b, 0.72 * L, 244, 0.72 * L, 265, 1.8, 0.8)
  }
  {
    const a: XY = [-12.4, 1.8], b: XY = [2.2, -7.5], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    strip(a, b, 0.55 * L, 244, 0.55 * L, 265, 1.8, 0.8)
  }
  // the lower diagonal line, on the NE wing's north-west face
  strip([5.3, 33.4], [-6.1, 23.6], 12.5, 70, 3.5, 185, 1.3, 0.35)

  const parts = [
    { part: glass, material: { ...PALETTE.window, color: 0x4f6fa3 } },
    { part: line, material: finish('eureka-line', 0xa9bfdb) },
    { part: gold, material: finish('neon-eureka-gold', 0xcfaa5c, 0.4) },
    { part: red, material: finish('neon-eureka-red', 0xc8423c) },
    { part: base, material: finish('eureka-concrete', 0x8e959b) },
    { part: fin, material: finish('neon-eureka-gold-fin', 0xdcbc72, 0.4) },
  ]
  return parts
}

export async function writeModel(file: string, parts: ReturnType<typeof build>, maxTri: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${used.length} materials`)
  const glb = writeGlb('Eureka Tower', used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', bearing: 0, height: TOP })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  await Bun.write(file, glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await writeModel(new URL(`../models/${ID}.glb`, import.meta.url).pathname, build(false), 5000, 250_000)
  await writeModel(new URL(`../models/${ID}.detail.glb`, import.meta.url).pathname, build(true), 40_000, 1_536_000)
}
