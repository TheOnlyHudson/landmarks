/**
 * The National Museum of Western Art (国立西洋美術館), main building,
 * Ueno Park, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-western-art-museum.ts
 *
 * Le Corbusier, 1959 (with Maekawa, Sakakura, Yoshizaka); part of the
 * World Heritage "Architectural Work of Le Corbusier" (2016). A square box
 * clad in green-grey pebble-concrete panels lifted on round pilotis, its
 * ground floor glazed in behind the columns; on the east front a deep
 * window opening at the top, a projecting concrete balcony on a tapered
 * pier and the straight exit stair rising to it from the forecourt; on the
 * roof, the lanterns that light the 19th-century hall and the galleries.
 *
 * Only the main building is modelled: OSM maps it as its own outline
 * (way/145344184, building=museum, height 12.1, 2 levels); Maekawa's 1979
 * new wing (way/145344123) and the 1997 underground hall are separate
 * buildings and stay as the map draws them. way/203960903 is the museum
 * site (tourism=museum), not a building, and is not replaced.
 *
 * Frame: origin at the outline's centroid (139.775879, 35.715364); bearing
 * 29 (the outline is a square turned 29 degrees, 40.6 x 40.5 m), so the
 * forecourt front faces the model's +x (compass 119 degrees, east-south-
 * east), the new wing touches the model's north (+y) side. y = 0 is the
 * forecourt; the map's terrain is flat here (within 0.2 m, terrain.ts
 * grid), elevation 0.
 *
 * Numbers:
 *  - plan 40.6 m square: measured (OSM);
 *  - overall height 12.1 m: OSM tag (height=12.1);
 *  - the pilotis 4.1 m, the concrete slab band 4.1-5.1 m, the panelled box
 *    5.1-12.1 m in four rows of panels: estimated by scaling Kakidai's
 *    frontal photo (No. 7) against the 12.1 m total, people for scale;
 *  - seven round columns a side (published: ja.wikipedia, "各辺に7本"),
 *    0.76 m across, set 2 m in from the box face, at 6.1 m;
 *  - the glazed ground floor 3.2 m in from the box face (photos);
 *  - the front opening 7.4 m wide, 7.5-11.2 m, at 21.9-29.3 m from the
 *    south corner; the balcony box 9 m wide, 5.4-8.6 m, 3.8 m deep on a
 *    pier tapering from 2.6 to 1.1 m; the stair 2.2 m wide from the
 *    balcony's north end to the forecourt 13 m out (all estimated from
 *    Kakidai No. 7 and 2018 (4), (5));
 *  - the roof lanterns: invented in their sizes. The roof can't be seen
 *    in any open photo found (no licensed aerial or roof view). Drawn from
 *    the published description of the building: a central skylight over
 *    the 19th-century hall (a triangular-section glazed lantern, 9 m long,
 *    3.4 m high, on the hall at the centre) and the long clerestory
 *    lanterns of the "lighting gallery" round it (four 1.6 m-high lanterns,
 *    pinwheeled). Kept low enough that, as in every photo, nothing shows
 *    over the parapet from the forecourt.
 * Colours (daylight photos, Kakidai No. 7, Francisco Anzola): panels
 * green-grey #a3a996 (pulled a little lighter than the photo's #8e9686),
 * concrete #d3d0c8, the ground-floor glazing and the opening in the palette
 * window slate, lanterns glass, roof membrane palette roof.
 * Night: the ground floor is lit behind its glass (`window`), the box is
 * not floodlit (Indiana jo's "Illumination" photo shows only the glazing
 * and the forecourt lit).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - National Museum of Western Art, Tokyo 7.jpg, Kakidai, CC BY-SA 4.0 (front, east)
 *  - 2018 National Museum of Western Art, Tokyo.jpg, Kakidai, CC BY-SA 4.0 (south-east corner, long side)
 *  - 2018 National Museum of Western Art, Tokyo 2.jpg / 4.jpg / 5.jpg, Kakidai, CC BY-SA 4.0 (front, stair)
 *  - National Museum Of Western Art (218675051).jpeg, Francisco Anzola, CC BY 3.0 (south-east corner close: panels, pilotis, opening)
 *  - Tokyo National Museum of Western Art seen from the west.jpg / from the south.jpg, Ymblanter, CC BY-SA 4.0
 *  - National museum of western art05s3200.jpg, 663highland, CC BY-SA 4.0 (front, far)
 * Look-only: 上野公園航空写真1984.jpg (MLIT/GSI aerial, attribution licence,
 * tagged look-only by tools/photos.py): too coarse to show the roof; it
 * only confirms the square plan.
 * Doubts: the roof lanterns (above); the west and north faces are plain in
 * the photos found; the ground-floor glazing line is read from the front
 * and south only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, capPoly, writeModel, rect, type XY, type Layer } from './tokyo-metropolitan-government-building'

const H = 20.3 // half side
const Z_PIL = 4.1, Z_BOX = 5.1, Z_TOP = 12.1

function build() {
  const panel = new Part(), conc = new Part(), win = new Part(), glass = new Part(), roof = new Part()

  // --- the panelled box, on its slab band
  const sq = rect(0, 0, H, H)
  prism(conc, sq, Z_PIL, Z_BOX, { bevel: 0.3, top: false })
  capPoly(conc, sq, Z_PIL, false) // the soffit over the pilotis
  // the box face sits flush with the band; its four rows of panels are
  // drawn as slightly proud strips separated by sunk joints, so the rows
  // read as in the photos
  const rows = 4, rh = (Z_TOP - 0.35 - Z_BOX) / rows
  prism(panel, rect(0, 0, H - 0.06, H - 0.06), Z_BOX, Z_TOP - 0.35, { bevel: 0.25, top: false })
  for (let k = 0; k < rows; k++) {
    const z0 = Z_BOX + k * rh + 0.07, z1 = Z_BOX + (k + 1) * rh - 0.07
    prism(panel, rect(0, 0, H + 0.02, H + 0.02), z0, z1, { bevel: 0.3, top: false, bottom: false })
    // the tops and bottoms of each proud row
    ring(panel, H + 0.02, H - 0.06, z1, true)
    ring(panel, H + 0.02, H - 0.06, z0, false)
  }
  // the coping and the flat roof inside it
  prism(conc, rect(0, 0, H + 0.04, H + 0.04), Z_TOP - 0.35, Z_TOP, { bevel: 0.2, roof, lip: 0.45 })

  // --- the front opening (east, +x face): a deep frame, glass set back
  const oy0 = -H + 21.9, oy1 = -H + 29.3, oz0 = 7.5, oz1 = 11.2
  const fx = H + 0.05
  // the frame: a concrete surround standing proud of the panels
  slab(conc, fx, fx + 0.35, oy0 - 0.4, oy1 + 0.4, oz1, oz1 + 0.75)
  slab(conc, fx, fx + 0.35, oy0 - 0.4, oy0, oz0, oz1)
  slab(conc, fx, fx + 0.35, oy1, oy1 + 0.4, oz0, oz1)
  quadX(win, fx + 0.02, oy0, oy1, oz0, oz1)

  // --- the balcony box on its tapered pier, and the stair
  const by0 = -5.8, by1 = 3.2, bx1 = H + 3.8
  slab(conc, H, bx1, by0, by1, 5.4, 8.6)
  // the pier: a trapezoid in elevation, 0.7 m thick, under the balcony's middle
  const pc = (by0 + by1) / 2, px = H + 2.6
  trapezoid(conc, px, pc, 1.45, 0.85, 0, 5.4, 0.4)
  // the stair: a sloping flight from the balcony's north end down to the forecourt
  const sy0 = by1 + 0.1, sy1 = sy0 + 2.2, sx0 = bx1, sx1 = bx1 + 13, sz = 8.2
  stair(conc, sx0, sx1, sy0, sy1, sz, 22)
  // its solid south parapet (the sloped concrete wall in the photos)
  for (const [y0, y1] of [[sy0 - 0.25, sy0]] as [number, number][]) {
    const P = (x: number, z: number, y: number): V3 => [x, y, z]
    const t = (x: number) => sz * (1 - (x - sx0) / (sx1 - sx0))
    const top = (x: number) => t(x) + 1.0
    const xs = [sx0, sx1]
    // outer and inner faces
    conc.quad(P(xs[0], 0, y0), P(xs[1], 0, y0), P(xs[1], top(xs[1]), y0), P(xs[0], top(xs[0]), y0))
    conc.quad(P(xs[1], 0, y1), P(xs[0], 0, y1), P(xs[0], top(xs[0]), y1), P(xs[1], top(xs[1]), y1))
    conc.quad(P(xs[0], top(xs[0]), y0), P(xs[1], top(xs[1]), y0), P(xs[1], top(xs[1]), y1), P(xs[0], top(xs[0]), y1))
    conc.quad(P(xs[1], 0, y0), P(xs[1], 0, y1), P(xs[1], top(xs[1]), y1), P(xs[1], top(xs[1]), y0))
  }

  // --- pilotis: seven round columns a side, 2 m in from the face
  const cin = H - 2.0, n = 7
  const cols = new Set<string>()
  for (let i = 0; i < n; i++) {
    const t = -cin + (2 * cin * i) / (n - 1)
    for (const [x, y] of [[t, -cin], [t, cin], [-cin, t], [cin, t]] as XY[]) {
      const key = `${x.toFixed(2)},${y.toFixed(2)}`
      if (cols.has(key)) continue
      cols.add(key)
      lathe(conc, [[0.38, 0], [0.38, Z_PIL]], 12, [x, y])
    }
  }

  // --- the ground floor, glazed behind the columns (3.2 m in)
  const g = H - 3.2
  prism(conc, rect(0, 0, g, g), 0, Z_PIL, { bevel: 0.1, top: false })
  // glass along every side, with plain wall at the corners; the south
  // front corner has the dark wall under the stair landing in Anzola's photo
  for (let s = 0; s < 4; s++) {
    const rot = (p: XY): XY => [[p[0], p[1]], [-p[1], p[0]], [-p[0], -p[1]], [p[1], -p[0]]][s] as XY
    const a = rot([-g + 2.0, -g - 0.05]), b = rot([g - 2.0, -g - 0.05])
    win.quad([a[0], a[1], 0.15], [b[0], b[1], 0.15], [b[0], b[1], Z_PIL - 0.35], [a[0], a[1], Z_PIL - 0.35])
  }

  // --- the roof lanterns (sizes invented; see header)
  const zr = Z_TOP - 0.34
  // central triangular lantern over the 19th-century hall: glazed slope to
  // the north-east, concrete back
  {
    const L = 4.5, w = 3.2, h = 3.4
    const A: V3 = [-L, -w, zr], B: V3 = [L, -w, zr], C: V3 = [L, w, zr], D: V3 = [-L, w, zr], E: V3 = [L, w, zr + h], F: V3 = [-L, w, zr + h]
    glass.quad(A, B, E, F) // the long sloped face, glazed (faces -y and up)
    conc.quad(C, D, F, E) // the vertical back
    conc.tri(B, C, E)
    conc.tri(D, A, F)
  }
  // four clerestory lanterns round it, pinwheeled
  for (let s = 0; s < 4; s++) {
    const rot = (p: XY): XY => [[p[0], p[1]], [-p[1], p[0]], [-p[0], -p[1]], [p[1], -p[0]]][s] as XY
    const c0 = rot([-3.0, -10.5]), c1 = rot([12.5, -10.5]), c2 = rot([12.5, -8.9]), c3 = rot([-3.0, -8.9])
    const ring2: XY[] = [c0, c1, c2, c3]
    prism(conc, ring2, zr, zr + 1.6, { bevel: 0.15 })
    // glass on its outward face
    const o = rot([0, -1]), e0 = rot([-2.6, -10.56]), e1 = rot([12.1, -10.56])
    void o
    win2(glass, e0, e1, zr + 0.35, zr + 1.35)
  }

  const flood = () => 0
  void flood
  return [
    { part: panel, material: finish('pebble-panel', 0xa3a996) },
    { part: conc, material: finish('concrete', 0xd3d0c8) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ] as Layer[]
}

/** The flat ring between two squares at height z, facing up or down. */
function ring(p: Part, outer: number, inner: number, z: number, up: boolean) {
  const O = rect(0, 0, outer, outer), I = rect(0, 0, inner, inner)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const a: V3 = [I[k][0], I[k][1], z], b: V3 = [O[k][0], O[k][1], z], c: V3 = [O[l][0], O[l][1], z], d: V3 = [I[l][0], I[l][1], z]
    if (up) p.quad(a, b, c, d); else p.quad(d, c, b, a)
  }
}

/** An axis-aligned box. */
function slab(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, { bevel: 0.12, bottom: true })
}

/** A flat panel facing +x at x, between y0..y1 and z0..z1. */
function quadX(p: Part, x: number, y0: number, y1: number, z0: number, z1: number) {
  p.quad([x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1])
}

/** A flat window panel from a to b (counter-clockwise ring order, facing outward). */
function win2(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** A pier tapering from half-width w1 at the top to w0 at the bottom (in y), t half-thick in x. */
function trapezoid(p: Part, x: number, y: number, w1: number, w0: number, z0: number, z1: number, t: number) {
  const B: V3[] = [[x - t, y - w0, z0], [x + t, y - w0, z0], [x + t, y + w0, z0], [x - t, y + w0, z0]]
  const T: V3[] = [[x - t, y - w1, z1], [x + t, y - w1, z1], [x + t, y + w1, z1], [x - t, y + w1, z1]]
  p.loft([B, T])
}

/** A straight flight of `n` steps from (x0, z) at the top down to (x1, 0), y0..y1 wide. */
function stair(p: Part, x0: number, x1: number, y0: number, y1: number, z: number, n: number) {
  const run = (x1 - x0) / n, rise = z / n
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * run, xb = xa + run, zt = z - i * rise
    // tread and riser
    p.quad([xb, y0, zt], [xb, y1, zt], [xa, y1, zt], [xa, y0, zt])
    p.quad([xb, y1, zt - rise], [xb, y1, zt], [xb, y0, zt], [xb, y0, zt - rise])
  }
  // the sloping soffit underneath and the side strings
  const s = 0.45
  p.quad([x1, y1, 0], [x1, y0, 0], [x0, y0, z - s], [x0, y1, z - s])
  for (const [y, f] of [[y0, -1], [y1, 1]] as [number, number][]) {
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * run, xb = xa + run, zt = z - i * rise
      const zs0 = z - s - (z - s) * ((xa - x0) / (x1 - x0)), zs1 = Math.max(0, z - s - (z - s) * ((xb - x0) / (x1 - x0)))
      const pts: V3[] = [[xa, y, zs0], [xb, y, zs1], [xb, y, zt], [xa, y, zt]]
      if (f < 0) p.quad(pts[0], pts[1], pts[2], pts[3]); else p.quad(pts[3], pts[2], pts[1], pts[0])
    }
  }
}

if (import.meta.main) {
  const meta = { generator: 'generators/tokyo-western-art-museum.ts' }
  await writeModel('tokyo-western-art-museum', 'tokyo-western-art-museum.glb', 'National Museum of Western Art', build(), meta, 5000, 250_000)
}
