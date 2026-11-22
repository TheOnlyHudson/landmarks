/**
 * Glen Span Arch, Central Park, West Drive over the Loch at the west end of
 * the Ravine (Calvert Vaux, 1865; stone superstructure 1885) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-glen-span-arch.ts
 *
 * Built with the portal kit in nyc-balcony-bridge.ts and the arch kit in
 * nyc-greyshot-arch.ts. Exports `portal`, a schist portal block (face,
 * voussoir ring, impost course, a short barrel and a parapet with the road
 * fill behind it), used again by nyc-huddlestone-arch.ts and
 * nyc-springbanks-arch.ts; the build runs only when this is the main module.
 *
 * Frame (mesh.ts map frame): y through the arch, downstream along the Loch
 * (bearing 97°, ESE: the placement's bearing), x along West Drive (bearing
 * 187°), z up, metres; z = 0 is the floor of the glen (the Loch and its
 * path) under the arch. Anchor: the centroid of OSM way/387386578
 * (man_made=bridge, "Glen Span Arch"), whose long sides run along the
 * drive at 6–8°.
 *
 * Evidence
 * - OSM (ODbL): the bridge outline way/387386578, about 18 m across the
 *   drive and 20–26 m along it.
 * - Published (Wikipedia, "List of bridges in Central Park", citing the
 *   Central Park Conservancy and the 1865–85 park reports): light-grey
 *   gneiss (Manhattan schist) ashlar, a vault 50 ft (15.2 m) long, 16 ft
 *   (4.9 m) wide and 18 ft 6 in (5.64 m) high; sidewalls 65 ft (19.8 m)
 *   long; pentagonal voussoirs; two grottos flank the arch.
 * - Map terrain (Mapterhorn z15, bearing 97, 2.5 m grid): the glen floor at
 *   0–0.3 m along x ≈ 0; West Drive's embankment flat at 7.9–8.1 m from
 *   y −5 to +5 and falling away past y ±7.5 (to 1 m at the arch's axis).
 *   The portals stand at y +7.4 and −7.8 (15.2 m apart, the vault's length),
 *   the road fill is taken at 7.7 m (0.3 m under the map's drive at 8.0)
 *   and the parapets' tops at 8.7 m.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-glen-span-arch/photos):
 *   Rhododendrites, "Glen Span Arch (01647).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Glen_Span_Arch_(01647).jpg
 *     (a face square on from the glen: the round arch on tall jambs, the
 *     impost course, the ashlar coursing, the rocks at its feet);
 *   Jay Dobkin, "Glen Span in Central Park 1.jpg" and
 *     "Glen Span in Central Park Feb 5 2018 08.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Glen_Span_in_Central_Park_1.jpg
 *     https://commons.wikimedia.org/wiki/File:Glen_Span_in_Central_Park_Feb_5_2018_08.jpg
 *     (the crown close up: long wedge voussoirs and a group of five tall
 *     keystones standing above the parapet's line);
 *   Epicgenius, "Central Park May 2019 35.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_35.jpg
 *     (the face from up the Loch: the level parapet, people for scale);
 *   Jay Dobkin, "Central Park looking west through Glen Span 02.jpg",
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_looking_west_through_Glen_Span_02.jpg
 *     (the barrel: the Loch and the path side by side under it).
 * - Estimated from those photos, scaled to the published 4.9 m span: the
 *   springing 3.19 m up (published height less the radius), voussoirs
 *   1.35 m deep, the impost course 0.45 m at the springing, the keystone
 *   group 2.9 m wide rising 0.45 m over the parapet; the parapet 0.6 m thick.
 *
 * Simplified: the ashlar coursing and the voussoirs' pentagonal joints are
 * plain faces; the two round drain holes in the keystones are left out; the
 * grottos are a few boulders at the face's feet. Each portal carries 2.5 m
 * of barrel; the middle of the vault is under the terrain's drive.
 *
 * Doubts: both faces drawn alike (the photos do not say which face they
 * show); the parapet height over the drive is estimated; the grottos'
 * depth is not modelled.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, qn } from './nyc-greyshot-arch'
import { archPr, barrel, hull, openFace, ring, type Pr } from './nyc-balcony-bridge'

/** A rough boulder: a six-sided lump from its foot (at z0) to a smaller top. */
export function lump(p: Part, cx: number, cy: number, rx: number, ry: number, h: number, seed: number, z0 = 0) {
  const n = 6, rings: V3[][] = []
  for (const [z, k] of [[0, 1], [h * 0.55, 1.08], [h, 0.62]] as const) {
    rings.push(Array.from({ length: n }, (_, i): V3 => {
      const t = (2 * Math.PI * i) / n + seed, j = 0.85 + 0.3 * Math.abs(Math.sin(seed * 3.1 + i * 1.7))
      return [cx + rx * k * j * Math.cos(t), cy + ry * k * j * Math.sin(t), z0 + z + (z > 0 ? 0.2 * Math.sin(seed + i) : 0)]
    }))
  }
  hull(p, rings)
}

export type PortalSpec = {
  /** Face line and its outward sign (±y). */
  y: number; s: number
  /** Opening profile (x non-decreasing), face ends, top of the face. */
  pr: Pr; x0: number; x1: number; top: (x: number) => number
  /** Barrel depth behind the face; parapet thickness; road fill height. */
  depth: number; parapet: number; fill: number
  /** Voussoir depth and how far it stands proud. */
  vd: number; vp: number
}

/**
 * A portal block: the face with its opening, the voussoir ring, a short
 * barrel, the parapet's top and inner face, the road fill behind it (in
 * `road`, kept under the map's roadway), the block's ends and back.
 */
export function portal(face: Part, vous: Part, road: Part, o: PortalSpec) {
  const { y, s, pr, x0, x1, top, depth, parapet, fill } = o
  const yb = y - s * depth, yp = y - s * parapet
  openFace(face, y, s, pr, x0, x1, top, 4)
  ring(vous, y, s, pr, o.vd, o.vp)
  barrel(face, pr, y, yb)
  const xs = [x0, ...[0.25, 0.5, 0.75].map((t) => x0 + (x1 - x0) * t), x1]
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(face, [a, y, top(a)], [b, y, top(b)], [b, yp, top(b)], [a, yp, top(a)], [0, 0, 1])
    qn(face, [a, yp, fill], [b, yp, fill], [b, yp, top(b)], [a, yp, top(a)], [0, -s, 0])
  }
  qn(road, [x0, yp, fill], [x1, yp, fill], [x1, yb, fill], [x0, yb, fill], [0, 0, 1])
  for (const x of [x0, x1]) {
    const sx = x === x0 ? -1 : 1
    qn(face, [x, y, 0], [x, yp, 0], [x, yp, top(x)], [x, y, top(x)], [sx, 0, 0])
    qn(face, [x, yp, 0], [x, yb, 0], [x, yb, fill], [x, yp, fill], [sx, 0, 0])
  }
  openFace(face, yb, -s, pr, x0, x1, () => fill, 2)
}

// ===========================================================================
// Glen Span Arch
// ===========================================================================

function build() {
  const face = new Part(), vous = new Part(), cope = new Part(), road = new Part(), rock = new Part()
  const A = 2.45, SPRING = 5.64 - A, TOP = 8.7, FILL = 7.7, HW = 9.9
  const pr = archPr('ellipse', A, A, SPRING, 12)
  const top = () => TOP
  for (const [s, y] of [[1, 7.4], [-1, -7.8]] as const) {
    portal(face, vous, road, { y, s, pr, x0: -HW, x1: HW, top, depth: 2.5, parapet: 0.6, fill: FILL, vd: 1.35, vp: 0.12 })
    // the impost course at the springing, either side of the opening
    for (const [a, b] of [[-HW, -A], [A, HW]]) band(cope, s, Math.abs(y), 0.14, [a, b], () => SPRING - 0.45, () => SPRING)
    // a rough coping along the parapet's top
    const yo = y + s * 0.08, yi = y - s * 0.68
    const [ya, yb] = s > 0 ? [yi, yo] : [yo, yi]
    for (const [a, b] of [[-HW - 0.05, -1.45], [1.45, HW + 0.05]]) {
      qn(cope, [a, yo, TOP], [b, yo, TOP], [b, yo, TOP + 0.22], [a, yo, TOP + 0.22], [0, s, 0])
      qn(cope, [a, ya, TOP + 0.22], [b, ya, TOP + 0.22], [b, yb, TOP + 0.22], [a, yb, TOP + 0.22], [0, 0, 1])
      qn(cope, [a, yi, TOP], [b, yi, TOP], [b, yi, TOP + 0.22], [a, yi, TOP + 0.22], [0, -s, 0])
      for (const x of [a, b]) qn(cope, [x, ya, TOP], [x, yb, TOP], [x, yb, TOP + 0.22], [x, ya, TOP + 0.22], [x === a ? -1 : 1, 0, 0])
    }
    // the keystone group: five tall stones over the crown, proud of the
    // face and rising above the parapet, the middle one tallest
    const ks: [number, number, number][] = [[-1.45, -0.9, 0.3], [-0.88, -0.32, 0.45], [-0.3, 0.3, 0.55], [0.32, 0.88, 0.45], [0.9, 1.45, 0.3]]
    const yk = y + s * 0.2
    for (const [a, b, h] of ks) {
      const lo = (x: number) => SPRING + Math.sqrt(Math.max(0, A * A - x * x))
      const z1 = TOP + h
      qn(vous, [a, yk, lo(a)], [b, yk, lo(b)], [b, yk, z1], [a, yk, z1], [0, s, 0])
      qn(vous, [a, yk, z1], [b, yk, z1], [b, y - s * 0.68, z1], [a, y - s * 0.68, z1], [0, 0, 1])
      qn(vous, [a, yk, TOP], [a, y - s * 0.68, TOP], [a, y - s * 0.68, z1], [a, yk, z1], [-1, 0, 0])
      qn(vous, [b, yk, TOP], [b, y - s * 0.68, TOP], [b, y - s * 0.68, z1], [b, yk, z1], [1, 0, 0])
      qn(vous, [a, y, lo(a)], [a, yk, lo(a)], [a, yk, TOP], [a, y, TOP], [-1, 0, 0])
      qn(vous, [b, y, lo(b)], [b, yk, lo(b)], [b, yk, TOP], [b, y, TOP], [1, 0, 0])
      qn(vous, [b, y - s * 0.68, TOP + 0.001], [a, y - s * 0.68, TOP + 0.001], [a, y - s * 0.68, z1], [b, y - s * 0.68, z1], [0, -s, 0])
    }
    // boulders and rock at the face's feet (the grottos' rockwork)
    lump(rock, -A - 3.5, y + s * 1.1, 1.5, 1.1, 2.2, 0.4 + s)
    lump(rock, A + 3.9, y + s * 1.2, 1.8, 1.3, 2.8, 1.3 + s)
    lump(rock, -A - 5.9, y + s * 0.5, 1.3, 1.0, 1.5, 2.2 + s)
  }
  finishModel('Glen Span Arch', 'nyc-glen-span-arch', [
    { part: face, material: { name: 'schist', color: 0xa4a197, roughness: 0.95 } },
    { part: vous, material: { name: 'voussoirs', color: 0xb8b4a7, roughness: 0.9 } },
    { part: cope, material: { name: 'coping', color: 0x989488, roughness: 0.95 } },
    { part: rock, material: { name: 'boulders', color: 0x8f8b82, roughness: 0.95 } },
    { part: road, material: { name: 'road-fill', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 97, osm: 'way/387386578', height: 9.25 }, 5000)
}

if (import.meta.main) build()
