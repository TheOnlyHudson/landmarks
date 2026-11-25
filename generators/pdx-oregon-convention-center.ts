/**
 * Oregon Convention Center, Portland, Oregon (1990, Zimmer Gunsul Frasca;
 * expanded 2003) — procedural, CC0-1.0, no textures.
 * bun generators/pdx-oregon-convention-center.ts
 *
 * Map frame: x east, y north, z up, metres (bearing 0; the halls are laid
 * out on the street grid). Anchor: area centroid of the OSM outline
 * way/25667700, -122.663138, 45.528328. z = 0 is the lowest ground at the
 * footprint (the south-west corner, by the I-5 ramps); elevation 0. The
 * site rises about 13 m to the north-east, so the walls on that side sink
 * into it.
 *
 * What makes it read as itself: the two teal glass spires, each a glass
 * pyramid rising from the roof to a square shaft that steps in twice and
 * ends in a spike; the long low buff hall under them, with its round
 * south drum and its glass quarter-dome, and the higher rounded north
 * block.
 *
 * The spires. OSM maps each as nested right triangles sharing their
 * south-west corner (32 m legs to 32.86 m, 16.6 m legs to 47.7 m, 8.2 m
 * to 63 m, a point to 76.52 m), with the hypotenuses on one line, x + y
 * = 102, which the diagonal glass gallery (way/1568261913) also follows.
 * The NAIP orthophoto shows the same dark glass triangles, the gallery
 * between them, and the higher north block's roof beyond the line. So
 * each spire is drawn as a corner pyramid: vertical triangular faces on
 * the west and south, a sloping glass face down to the line, and the
 * shafts rising over the corner, square in plan (9 m, then 5 m), so
 * seen from the south-west or north-east the spire is symmetric, as in
 * the photos.
 *
 * Evidence
 * - OSM: outline way/25667700 (height 6) and parts: the halls way/450247885
 *   (14), the west wing way/1568261914 (10), the south drum way/450247877
 *   (13), its glass segment way/450247880 (22.88), the gallery
 *   way/1568261913 (19), the spires way/450247886/884/881/878 and
 *   way/450247887/883/882/879, four small vents way/1568261915-918 (15).
 * - Measured, lidar: USGS 3DEP OR_OLCMetro_2019 (flown 2019), 2 m grid.
 *   Ground 8.5-9 m at the south-west corner, 14-15 m west, 19-21 m east,
 *   22-23 m north-east, over the box's lowest return; z = 0 here is 9.
 *   Roofs: the halls 30.2-31.2 m (21.8 above z = 0); the north block
 *   north-east of the spire line 33.7-34.5 m (25.2); the south drum
 *   38.8-39.7 m (30.2); the west wing and north-west strip 23.9-24.3 m
 *   (15); the east strip 29.3-29.6 m (20.5).
 * - Published: the spires 250 ft (76 m) tall (Wikipedia, "Oregon
 *   Convention Center"; OSM 76.52 m). Taken from the ground at their foot
 *   (about 7 m above z = 0, lidar), as OSM's other spire heights are.
 * - Measured, USGS NAIP orthophoto (0.17 m): the spires' and gallery's
 *   plan; the roof's colour (white with solar arrays).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Pete Forsyth, "Oregon Convention Center aerial view.jpg" (CC BY 3.0;
 *     from the east, high: the roofs, drum, glass segment, spires)
 *     https://commons.wikimedia.org/wiki/File:Oregon_Convention_Center_aerial_view.jpg
 *   Another Believer, "Oregon Convention Center, Portland 2012.JPG"
 *     (CC BY-SA 3.0; from the south-west across the river: the spires'
 *     teal glass and their steps)
 *     https://commons.wikimedia.org/wiki/File:Oregon_Convention_Center,_Portland_2012.JPG
 *   Fcb981, "Portland Convention Center 1.jpg" (CC BY-SA 3.0; from the
 *     north-east at night: the lit spires, the buff walls)
 *     https://commons.wikimedia.org/wiki/File:Portland_Convention_Center_1.jpg
 *   Michael Barera, "Portland July 2017 04 (Oregon Convention Center).jpg"
 *     (CC BY-SA 4.0; buff precast wall, dark glazed ground floor)
 *     https://commons.wikimedia.org/wiki/File:Portland_July_2017_04_(Oregon_Convention_Center).jpg
 * - Estimated: the pyramid's apex 39.9 m (OSM 32.86 above its foot); its
 *   legs 28 m (the orthophoto's triangles, 26-29 m; OSM's 31.7 m made the
 *   pyramids too broad against the photos); the shafts' widths from the
 *   photos (lower 9 m, upper 5 m); the ground under the walls, as a plane
 *   through the lidar's ground readings, to start the window band at the
 *   real ground on each side; the window bays.
 * - Doubts: the spires' plan is read from OSM and the orthophoto, not from
 *   a photo straight at them; the glass segment's slope; the solar arrays
 *   are left out (the roof is plain grey); not drawn: the flag mast,
 *   canopies, signs, rooftop plant.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, box, type XY } from './dc-nationals-park'

const OUTLINE: XY[] = [[-97.8,148.7],[-86.8,148.6],[-71.2,148.4],[-56.1,148.1],[-51.0,148.1],[-46.1,153.1],[-41.7,156.2],[-34.8,159.6],[-34.3,159.7],[-29.7,160.9],[-25.0,162.0],[-15.4,162.4],[-5.2,161.7],[4.1,160.0],[12.0,158.2],[21.4,155.0],[32.1,149.5],[41.5,143.5],[48.8,137.6],[55.6,131.5],[61.5,124.9],[68.2,115.8],[73.8,106.5],[79.5,92.6],[86.0,76.5],[86.3,57.1],[85.6,51.4],[85.1,47.8],[84.9,47.0],[83.6,43.1],[82.8,40.3],[93.0,35.3],[92.9,26.0],[91.8,-95.4],[96.2,-104.2],[97.9,-110.2],[98.8,-115.4],[98.9,-121.8],[98.2,-128.2],[96.8,-135.6],[93.8,-142.1],[84.8,-153.8],[81.0,-157.9],[77.3,-161.3],[72.4,-164.7],[66.9,-167.6],[61.2,-169.9],[54.8,-171.5],[47.9,-172.5],[41.7,-172.4],[35.8,-171.5],[30.7,-170.2],[25.4,-167.8],[19.6,-164.2],[14.7,-160.5],[10.9,-156.1],[-3.7,-155.9],[-7.9,-155.9],[-25.7,-155.6],[-31.8,-155.5],[-38.0,-154.0],[-42.5,-152.9],[-45.4,-151.7],[-55.3,-147.6],[-70.1,-136.6],[-72.3,-133.7],[-81.0,-121.3],[-61.4,-101.9],[-64.4,-99.1],[-61.0,-95.9],[-63.8,-93.3],[-61.0,-90.5],[-63.9,-87.9],[-61.0,-85.1],[-63.6,-82.4],[-61.0,-79.8],[-63.8,-77.1],[-60.9,-74.3],[-63.8,-71.6],[-61.0,-68.9],[-63.9,-66.0],[-61.1,-62.7],[-58.8,-60.0],[-66.5,-52.6],[-60.5,-46.9],[-57.8,-46.9],[-57.7,-34.0],[-63.9,-28.0],[-62.1,-25.9],[-112.9,25.0],[-112.9,32.9],[-112.9,39.8],[-112.6,103.5],[-97.3,103.4],[-97.8,144.0]]
const HALLS: XY[] = [[74.5,29.5],[77.4,32.6],[81.2,38.0],[82.8,40.3],[83.6,43.1],[84.9,47.0],[85.1,47.8],[85.6,51.4],[86.3,57.1],[86.0,76.5],[79.5,92.6],[73.8,106.5],[68.2,115.8],[61.5,124.9],[55.6,131.5],[48.8,137.6],[41.5,143.5],[32.1,149.5],[21.4,155.0],[12.0,158.2],[4.1,160.0],[-5.2,161.7],[-15.4,162.4],[-25.0,162.0],[-29.7,160.9],[-34.3,159.7],[-34.8,159.6],[-41.7,156.2],[-46.1,153.1],[-51.0,148.1],[-56.1,148.1],[-71.2,148.4],[-86.8,148.6],[-97.8,148.7],[-97.8,144.0],[-97.3,103.4],[-97.2,91.2],[-96.6,40.0],[-96.6,24.1],[-44.7,24.3],[-44.9,-20.2],[-49.7,-20.2],[-49.3,-55.6],[-45.5,-55.6],[-45.2,-79.8],[-49.0,-79.9],[-48.9,-90.4],[-45.1,-90.4],[-44.9,-110.6],[-48.7,-110.6],[-67.8,-130.0],[-60.4,-136.5],[-52.0,-142.2],[-44.7,-145.5],[-36.4,-148.1],[-26.7,-149.7],[9.2,-149.3],[10.9,-156.1],[14.7,-160.5],[19.6,-164.2],[25.4,-167.8],[30.7,-170.2],[35.8,-171.5],[41.7,-172.4],[47.9,-172.5],[54.8,-171.5],[61.2,-169.9],[66.9,-167.6],[72.4,-164.7],[77.3,-161.3],[81.0,-157.9],[84.8,-153.8],[93.8,-142.1],[96.8,-135.6],[98.2,-128.2],[98.9,-121.8],[98.8,-115.4],[97.9,-110.2],[96.2,-104.2],[91.8,-95.4],[83.6,-85.7],[81.2,-84.1],[74.6,-79.7]]
const WEST: XY[] = [[-44.7,24.3],[-44.9,-20.2],[-49.7,-20.2],[-49.3,-55.6],[-45.5,-55.6],[-45.2,-79.8],[-49.0,-79.9],[-48.9,-90.4],[-45.2,-90.4],[-45.3,-110.6],[-48.7,-110.6],[-67.8,-130.0],[-72.3,-133.7],[-81.0,-121.3],[-61.4,-101.9],[-64.4,-99.1],[-61.0,-95.9],[-63.8,-93.3],[-61.0,-90.5],[-63.9,-87.9],[-61.0,-85.1],[-63.6,-82.4],[-61.0,-79.8],[-63.8,-77.1],[-60.9,-74.3],[-63.8,-71.6],[-61.0,-68.9],[-63.9,-66.0],[-58.8,-60.0],[-66.5,-52.6],[-60.5,-46.9],[-57.8,-46.9],[-57.7,-34.0],[-63.9,-28.0],[-62.1,-25.9],[-112.9,25.0],[-112.9,32.9],[-44.7,32.6]]
const DRUM: XY[] = [[19.6,-151.3],[32.8,-160.3],[48.4,-163.6],[54.1,-162.6],[64.2,-160.8],[67.2,-158.8],[77.6,-152.1],[78.8,-150.3],[86.7,-139.0],[89.4,-126.4],[90.0,-123.5],[87.1,-107.9],[78.4,-94.6],[65.3,-85.6],[49.6,-82.2],[33.9,-85.1],[20.5,-93.7],[11.4,-106.8],[8.1,-122.4],[10.9,-138.0]]

const wall = new Part(), roof = new Part(), win = new Part(), spire = new Part(), trim = new Part()

const HALL = 21.8, NORTH = 25.2, LOW = 15, EAST = 20.5, DRUM_TOP = 30.2
// The ground round the walls, above z = 0 (a plane through the lidar).
const ground = (x: number, y: number) => Math.max(0, 6 + 0.025 * x + 0.03 * y)

/** Clip a ring to the half-plane a·x + b·y >= c (Sutherland-Hodgman). */
function clip(ring: XY[], a: number, b: number, c: number): XY[] {
  const out: XY[] = []
  const f = (p: XY) => a * p[0] + b * p[1] - c
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], fp = f(p), fq = f(q)
    if (fp >= 0) out.push(p)
    if (fp * fq < 0) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
  }
  return out
}

/** Walls split into ≤ 5 m pieces with a cap band, plus a flat roof. */
function block(ring: XY[], top: number, windows: boolean) {
  const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const R = area < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const o: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    const at = (u: number, z: number, off = 0): V3 => [a[0] + ((b[0] - a[0]) * u) / L + o[0] * off, a[1] + ((b[1] - a[1]) * u) / L + o[1] * off, z]
    const n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) quad(wall, [at((L * k) / n, 0), at((L * (k + 1)) / n, 0), at((L * (k + 1)) / n, top - 1), at((L * k) / n, top - 1)], o)
    quad(trim, [at(0, top - 1), at(L, top - 1), at(L, top), at(0, top)], o)
    if (!windows || L < 9) continue
    // The dark glazed ground floor: bays of about 10 m, from the ground
    // on this side, 4.5 m tall, between 2.5 m piers.
    const m = Math.max(1, Math.round(L / 10))
    for (let k = 0; k < m; k++) {
      const u0 = (L * k) / m + 1.25, u1 = (L * (k + 1)) / m - 1.25
      const p = at((u0 + u1) / 2, 0), g = ground(p[0], p[1]) + 0.6
      if (g + 4.5 > top - 2) continue
      quad(win, [at(u0, g, 0.05), at(u1, g, 0.05), at(u1, g + 4.5, 0.05), at(u0, g + 4.5, 0.05)], o)
    }
  }
  prism(R, top - 0.01, top, trim, roof)
}

block(OUTLINE, LOW, false)
block(WEST, LOW + 0.05, true)
block([[74.5, -88], [92, -88], [92, 30], [74.5, 30]], EAST, true)
block(HALLS, HALL, true)
block(clip(HALLS, 1, 1, 102), NORTH, true)

// The south drum, its glass segment on the north-west carved out: the
// segment slopes from the drum's roof at the chord down to the halls' roof
// at the arc.
const ARC: XY[] = [[8.1, -122.4], [11.4, -106.8], [20.5, -93.7], [33.9, -85.1], [49.6, -82.2]]
block(DRUM.filter((p) => !ARC.slice(1, 4).some((q) => q[0] === p[0] && q[1] === p[1])), DRUM_TOP, true)
for (let i = 0; i < ARC.length - 1; i++) {
  const ch = (k: number): V3 => {
    const t = k / (ARC.length - 1)
    return [ARC[0][0] + (ARC[4][0] - ARC[0][0]) * t, ARC[0][1] + (ARC[4][1] - ARC[0][1]) * t, DRUM_TOP]
  }
  const a: V3 = [ARC[i][0], ARC[i][1], HALL], b: V3 = [ARC[i + 1][0], ARC[i + 1][1], HALL]
  quad(spire, [a, b, ch(i + 1), ch(i)], [-1, 1, 1])
}

// The diagonal glass gallery between the spires, along x + y = 102.
prism([[0.3, 101.8], [-6.5, 101.8], [27.1, 68.1], [27.1, 74.9]], HALL, HALL + 4.2, spire, spire)

// ---------------------------------------------------------------- spires ---
const LEG = 28, APEX = 39.9, S1 = 9, T1 = 54.7, S2 = 5, T2a = 57, T2 = 70, CAP = 73.5, TIP = 83.5
function spireAt(C: XY) {
  const c0: V3 = [C[0], C[1], HALL], e: V3 = [C[0] + LEG, C[1], HALL], n: V3 = [C[0], C[1] + LEG, HALL], A: V3 = [C[0], C[1], APEX]
  spire.tri(c0, A, n) // west face, vertical
  spire.tri(c0, e, A) // south face, vertical
  spire.tri(e, n, A) // the sloping face, down to the gallery line
  // Lower shaft, its south-west corner on the pyramid's corner.
  const sq = (cx: number, cy: number, h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const mx = C[0] + S1 / 2, my = C[1] + S1 / 2
  const loft = (r0: V3[], r1: V3[]) => { for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(spire, [r0[i], r0[j], r1[j], r1[i]], [r0[i][0] + r0[j][0] - 2 * mx, r0[i][1] + r0[j][1] - 2 * my, 0.3]) } }
  loft(sq(mx, my, S1 / 2, HALL + 4), sq(mx, my, S1 / 2, T1))
  loft(sq(mx, my, S1 / 2, T1), sq(mx, my, S2 / 2, T2a))
  loft(sq(mx, my, S2 / 2, T2a), sq(mx, my, S2 / 2, T2))
  const top = sq(mx, my, S2 / 2, T2), cap: V3 = [mx, my, CAP]
  for (let i = 0; i < 4; i++) spire.tri(top[i], top[(i + 1) % 4], cap)
  // Pale bands where the shaft steps in, and the spike.
  loft(sq(mx, my, S1 / 2 + 0.08, T1 - 0.6), sq(mx, my, S1 / 2 + 0.08, T1))
  box(trim, [mx, my, (CAP + TIP) / 2 - 1], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.45, 0.45, (TIP - CAP) / 2 + 1])
}
spireAt([27.0, 43.3])
spireAt([-31.5, 101.8])

// --------------------------------------------------------------- output ---
// Colours from the daylight photos: buff precast, a white cap, the grey
// roof (the solar arrays and white membrane average to it), dark glazing,
// and the spires' teal glass pulled to the palette's lightness. The spires
// are floodlit from inside at night.
const parts = [
  { part: wall, material: finish('occ-buff', 0xdccdb0) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: spire, material: { ...finish('occ-spire-glass', 0x5fb0aa, 0.3), floodlight: () => 0.9 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Oregon Convention Center', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/25667700', height: TIP,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/pdx-oregon-convention-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
