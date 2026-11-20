/**
 * James J. Hill House (1891, Peabody, Stearns & Furber), 240 Summit Avenue,
 * Saint Paul: procedural, CC0-1.0.
 * bun generators/msp-james-j-hill-house.ts [out.glb]
 *
 * Map frame turned to bearing 44: +y runs north-east along Summit Avenue, +x
 * south-east towards the bluff. The origin is the area centroid of OSM
 * way/43385471 (-93.108949, 44.945090). The Summit front faces -x, with the
 * porte-cochere in its middle; the art gallery (skylit) is the north-east
 * wing; a columned porch at the south-west corner of the front; the back
 * looks over the bluff from a raised terrace. y = 0 (z here) is the lowest
 * ground under the footprint, at the back (lidar 274.0 m); the Summit side
 * is 4 m higher, so the front's ground floor starts at z = 4.
 *
 * Identity: OSM's name and wikidata (Q6136691) are on this outline, and the
 * photos below match it (porte-cochere mid-front, gallery at the north-east
 * end, end chimneys).
 *
 * Sources
 * - OSM (ODbL): way/43385471 (building=yes, name, Q6136691; no parts or
 *   heights). OSM's outline is about 3 m larger than the lidar's walls on the
 *   front and back (it seems to take in porches and the terrace); the walls
 *   here follow the lidar, the extent follows OSM.
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022), 0.5 m grid, class
 *   18 dropped (scattered noise over this low building). Heights above the
 *   back (garden) ground: front ground 4; front pavilions (|y| 6-18, faces at
 *   x = -13) eaves 16.5, cross-hips 20.5; the recessed centre at x = -9.5;
 *   main hip ridge 24.2 (x = 0, |y| < 9); back wings (to x = 17) eaves ~16,
 *   ridges ~20; the back's centre bay 9; the terrace 5.5; the porte-cochere
 *   x -20..-12, |y| < 3.6, top 10; the gallery wing's ridge 18 running
 *   north-east over x = 2-4, eaves 11.3; the south-west end 13 and its loggia
 *   8.5-9; the arcade block by the gallery 13. Chimneys read low (thin, and
 *   tops in class 18), so their tops are from the photos.
 * - USGS NAIP (public domain): slate roofs, the gallery skylights, the drive
 *   loop on the Summit side, the terraces behind.
 * - Published: 1891, red sandstone, Richardsonian Romanesque, about 36,500
 *   sq ft (Minnesota Historical Society; Wikipedia, "James J. Hill House").
 * - Photos (Wikimedia Commons), all compared side by side with renders:
 *   McGhiever, "James J. Hill House 2013.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:James_J._Hill_House_2013.jpg
 *     (from the north: gallery and its glass roof, end chimney, arcade,
 *     porte-cochere's side arch);
 *   Barlowjc, "JamesJHillHouse.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:JamesJHillHouse.jpg
 *     (the Summit front from the west: porte-cochere, pavilions, loggia);
 *   Teemu008, "James J. Hill House (1).jpg", CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:James_J._Hill_House_(1).jpg;
 *   Bmzuckerman, "Richardsonian Romanesque - Saint Paul, MN - James J. Hill
 *     Mansion (1)/(2)/(3).jpg", CC BY 4.0 (front, porte-cochere);
 *   William Wesen, "SummitAvenue.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:SummitAvenue.jpg
 *     (the back from downtown, over the bluff: roofs, chimneys, terrace wall).
 * Estimated from the photos (scaled to lidar): storey lines (4 / 7.8 / 11.4 /
 *   15), windows and their grouping, the dormers, chimney tops (26-27, about
 *   3 m over the ridges), the porte-cochere's arches, the porch columns.
 * Left out: carved ornament, the gatehouse (separate OSM way, not covered),
 *   the garden terraces down the bluff beyond the footprint (ground), railings.
 * Second pass (this builder): the old single broad hip at eave 15 read as one
 *   flat-roofed block; rebuilt to the lidar as pavilions, recessed centre,
 *   back wings and a north-east-running gallery roof (its glass was hidden
 *   under the old roof); porte-cochere arches widened (the deck had closed
 *   them); chimneys made broader and fewer; the stone a little browner.
 * Doubts: OSM's front line is ~3 m in front of the lidar's walls (the model
 *   follows the lidar). The back is seen in only one distant photo; its bay and the
 *   terrace's balustrade are from lidar and that photo. Chimney heights are
 *   photo estimates.
 * Night: lit windows (`window`); the porte-cochere's lamp-lit door is the
 *   `entrance`. Not floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

const G = 4 // the front (Summit) ground
const EAVE = 16.5, RIDGE = 24.2
const MX0 = -9.5, MX1 = 11, MY = 21 // main block (the front's centre is recessed between pavilions)
const PX = -13 // the front pavilions' faces
const BX = 17 // the back wings' faces

const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar polygon, wound to face `out`. */
const poly = (p: Part, pts: V3[], out: V3) => {
  const q = dot(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])), out) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

export function build() {
  const stone = new Part(), slate = new Part(), cop = new Part(), win = new Part(), glass = new Part(), door = new Part()

  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, c = 0) => {
    const r = rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
    prism(p, top, c > 0 ? chamfer(r, c) : r, z0, z1)
  }
  /** A hip roof over a rectangle; the ridge runs along the longer side. */
  const hip = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o = 0.6) => {
    x0 -= o; x1 += o; y0 -= o; y1 += o
    const ay = y1 - y0 >= x1 - x0
    const h = (ay ? x1 - x0 : y1 - y0) / 2
    const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
    const a: V3 = ay ? [xm, y0 + h, z1] : [x0 + h, ym, z1], b: V3 = ay ? [xm, y1 - h, z1] : [x1 - h, ym, z1]
    const c00: V3 = [x0, y0, z0], c10: V3 = [x1, y0, z0], c11: V3 = [x1, y1, z0], c01: V3 = [x0, y1, z0]
    if (ay) {
      slate.quad(c10, c11, b, a); slate.quad(c01, c00, a, b); slate.tri(c00, c10, a); slate.tri(c11, c01, b)
    } else {
      slate.quad(c00, c10, b, a); slate.quad(c11, c01, a, b); slate.tri(c10, c11, b); slate.tri(c01, c00, a)
    }
    eaveBand(x0, y0, x1, y1, z0)
  }
  /** The copper gutter band under an eave, and the soffit. */
  const eaveBand = (x0: number, y0: number, x1: number, y1: number, z0: number) => {
    prism(cop, null, rect(x0, y0, x1, y1), z0 - 0.45, z0)
    slate.quad([x0, y1, z0 - 0.45], [x1, y1, z0 - 0.45], [x1, y0, z0 - 0.45], [x0, y0, z0 - 0.45])
  }
  const chimney = (x: number, y: number, z1: number, w = 1.7, d = 2.6) => {
    box(stone, x - w / 2, y - d / 2, x + w / 2, y + d / 2, 0, z1, stone, 0.2)
    box(stone, x - w / 2 - 0.25, y - d / 2 - 0.25, x + w / 2 + 0.25, y + d / 2 + 0.25, z1 - 0.9, z1 - 0.4, stone)
  }
  /** Windows in a band: n panels of width w centred on sc, gap between. */
  const band = (f: Face, sc: number, n: number, w: number, gap: number, z0: number, z1: number) => {
    const tot = n * w + (n - 1) * gap
    for (let i = 0; i < n; i++) {
      const s0 = sc - tot / 2 + i * (w + gap)
      flatShape(win, f, rect(s0, z0, s0 + w, z1), 0.06)
    }
  }
  const arched = (f: Face, sc: number, w: number, z0: number, zs: number, p = win, d = 0.06) =>
    flatShape(p, f, [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, 8)], d)
  /** A wall with a round arch cut through it, as a slab `t` thick behind the face. */
  const archWall = (f: Face, half: number, z0: number, z1: number, zs: number, r: number, t: number) => {
    const P: XY[] = [[-half, z0], [-r, z0], [-r, zs], ...arc(0, zs, r, 180, 0, 10).slice(1, -1), [r, zs], [r, z0], [half, z0], [half, z1], [-half, z1]]
    extrudeShape(stone, { o: [f.o[0] - f.n[0] * t, f.o[1] - f.n[1] * t, 0], n: f.n }, P, 0, t)
    flatShape(stone, { o: [f.o[0] - f.n[0] * t, f.o[1] - f.n[1] * t, 0], n: [-f.n[0], -f.n[1]] }, P.map(([s, z]) => [-s, z] as XY), 0)
  }
  /** A three-storey window set on a front face: floor bands from the front ground. */
  const storeys = (f: Face, sc: number, n: number, w: number, gap: number, from = 0) => {
    const rows: [number, number][] = [[G + 1.3, G + 3.6], [G + 4.9, G + 7.3], [G + 8.5, G + 10.7]]
    rows.slice(from).forEach(([a, b]) => band(f, sc, n, w, gap, a, b))
  }

  // ---------------------------------------------------------------- the main block
  box(stone, MX0, -MY, MX1, MY, 0, EAVE, null)
  hip(MX0, MX1, -MY, MY, EAVE, RIDGE)
  mirror((s) => {
    // the front pavilions, projecting either side of the porte-cochere, with cross-hips
    box(stone, PX, s * 6, MX0 + 0.2, s * 18, 0, EAVE, null)
    hip(PX, -0.5, Math.min(s * 6, s * 18), Math.max(s * 6, s * 18), EAVE, 21)
    // the back wings, the same at the back
    box(stone, MX1 - 0.2, s * 6, BX, s * 18, 0, EAVE - 0.5, null)
    hip(3, BX, Math.min(s * 6, s * 18), Math.max(s * 6, s * 18), EAVE - 0.5, 20.5)
  })
  // the back's low centre bay over the garden terrace
  box(stone, MX1 - 0.2, -5, BX - 0.6, 5, 0, 9, null)
  hip(MX1, BX - 0.6, -5, 5, 9, 11.5, 0.4)
  band({ o: [BX - 0.6, 0, 0], n: [1, 0] }, 0, 4, 1.4, 0.5, 4.6, 7.8)
  // the back terrace and its parapet (lidar 5.5 m over the garden below)
  mirror((s) => {
    box(stone, BX, s * 4, BX + 2.2, s * 18.5, 0, 4.9, stone)
    box(stone, BX + 1.6, s * 4, BX + 2.3, s * 18.5, 4.9, 5.8, stone)
  })
  // dormers: copper-faced, hipped, on the front and back slopes of the main roof
  const dormer = (x: number, y: number, n: 1 | -1) => {
    const z0 = 18.6, z1 = 21.0
    box(cop, x - 1.6, y - 1.5, x + 1.6, y + 1.5, z0 - 1.6, z1, null)
    hip(x - 1.6, x + 1.6, y - 1.5, y + 1.5, z1, z1 + 1.3, 0.3)
    band({ o: [x + n * 1.6, y, 0], n: [n, 0] }, 0, 2, 0.9, 0.3, z0 - 0.4, z1 - 0.4)
  }
  for (const y of [-3.2, 3.2]) dormer(-6.4, y, -1)
  for (const y of [-2.6, 2.6]) dormer(8.0, y, 1)
  // chimneys: plain tall stone stacks, 3-4 m over the ridges (tops from the photos)
  mirror((s) => {
    chimney(-8.6, s * 15.6, 27.5, 2.1, 3.0)
    chimney(8.2, s * 14.8, 27, 2.1, 3.0)
  })
  chimney(-3.5, 6.5, 28, 2.2, 3.2) // the tall central stack (lidar: one, north-east of the ridge's middle)

  // the windows. The front: pavilions in three storeys, grouped two and three
  const F: Face = { o: [PX, 0, 0], n: [-1, 0] } // s = -y
  for (const sc of [-15.3, -9, 9, 15.3]) storeys(F, sc, 2, 1.25, 0.45, sc < 0 ? 0 : 1)
  // the north-east pavilion's ground storey is the arcade (arched, open)
  for (const sc of [-15.3, -9]) arched(F, sc, 2.4, G + 0.2, G + 2.2, win, 0.08)
  const FC: Face = { o: [MX0, 0, 0], n: [-1, 0] }
  mirror((s) => band(FC, s * 4.9, 1, 1.1, 0, G + 4.9, G + 7.3))
  band(FC, 0, 3, 1.0, 0.35, G + 8.5, G + 10.7)
  // the back: wings and centre, three storeys over the garden (from z = 0)
  const B: Face = { o: [BX, 0, 0], n: [1, 0] } // s = y
  for (const sc of [-15, -9, 9, 15]) {
    band(B, sc, 2, 1.2, 0.4, 4.8, 7.8)
    band(B, sc, 2, 1.2, 0.4, 8.8, 11.2)
    band(B, sc, 2, 1.1, 0.4, 12.2, 14.4)
  }
  band({ o: [MX1, 0, 0], n: [1, 0] }, 0, 3, 1.1, 0.4, 12.2, 14.4)
  // the north-east end (beside the gallery): two storeys of paired windows
  {
    const E: Face = { o: [0, MY, 0], n: [0, 1] } // s = -x
    for (const sc of [6.5, -14]) {
      band(E, sc, 2, 1.2, 0.4, 8.8, 11.2)
      band(E, sc, 2, 1.1, 0.4, 12.2, 14.4)
    }
  }

  // ---------------------------------------------------------------- the porte-cochere
  // Open on three sides: a broad round arch each side, a smaller one to the drive.
  {
    const x0 = -20, x1 = MX0, xa = -11.6, y0 = -3.6, y1 = 3.6, top = 10.2, zs = G + 2.2
    mirror((s) => archWall({ o: [(x0 + xa) / 2, s * y1, 0], n: [0, s] }, (xa - x0) / 2, G, top, zs, 3.2, 1.0))
    archWall({ o: [x0, 0, 0], n: [-1, 0] }, y1, G, top, zs, 2.3, 1.0)
    box(stone, xa, y0, x1, y1, G, top, null) // the vestibule between the arches and the house
    box(stone, x0, y0, xa, y1, top - 0.5, top, stone) // the deck over the arches
    box(stone, x0 - 0.3, y0 - 0.3, x1, y1 + 0.3, top, top + 0.8, stone) // its balustrade, as a parapet
    box(stone, x0, y0, x1, y1, 0, G, stone) // the drive's footing on the slope
    flatShape(door, FC, rect(-1.3, G, 1.3, G + 3.0), 0.06) // the front door under it
    flatShape(win, FC, [[-1.3, G + 3.2], [1.3, G + 3.2], ...arc(0, G + 3.2, 1.3, 0, 180, 8)], 0.06)
  }

  // ---------------------------------------------------------------- the art gallery (north-east)
  // Its roof ridge runs north-east (lidar: 18 m over x = 2-4 for y = 22-29); the
  // north-west slope is almost all glass with a raised skylight on top.
  {
    const x0 = -3, x1 = 8.8, y0 = MY - 0.4, y1 = 29.2, ze = 11.5, zr = 18
    box(stone, x0, y0, x1, y1, 0, ze, null)
    const o = 0.5, xm = (x0 + x1) / 2, X0 = x0 - o, X1 = x1 + o, Y1 = y1 + o, yb = Y1 - (X1 - X0) / 2 * 0.55
    const a: V3 = [xm, 17.5, zr], b: V3 = [xm, yb, zr]
    poly(slate, [[X0, a[1], ze], [X0, Y1, ze], b, a], [-1, 0, 1])
    poly(slate, [[X1, a[1], ze], [X1, Y1, ze], b, a], [1, 0, 1])
    poly(slate, [[X0, Y1, ze], [X1, Y1, ze], b], [0, 1, 1])
    eaveBand(X0, y0, X1, Y1, ze)
    // the glazed slopes (both; NAIP shows glass on each side), lifted off the slate
    mirror((s) => {
      const xe = s > 0 ? X1 : X0, at = (t: number, y: number): V3 => [xe + (xm - xe) * t + s * 0.0, y, ze + (zr - ze) * t + 0.12]
      const ya = y0 + 0.8, yz = yb - 0.6
      poly(glass, [at(0.28, ya), at(0.28, yz), at(0.9, yz), at(0.9, ya)], [s, 0, 1])
    })
    // the raised skylight monitor along the ridge
    box(glass, xm - 1.1, y0 + 0.8, xm + 1.1, yb - 0.6, zr - 0.6, zr + 0.9, slate)
    // the big end chimney rising from the ground on the north-east wall
    chimney(xm, y1 + 0.7, 27, 2.6, 1.6)
    const W: Face = { o: [x0, 25, 0], n: [-1, 0] }
    band(W, 0, 3, 1.1, 0.4, G + 1.2, G + 3.4)
    band({ o: [x1, 25, 0], n: [1, 0] }, 0, 3, 1.1, 0.4, 4.8, 7.8)
  }
  // the arcade block in front of the gallery's south-west end: two storeys, hipped
  {
    box(stone, PX, 18, -3, MY + 0.4, 0, 12.2, null)
    hip(PX, -3, 18, MY + 0.4, 12.2, 14.4, 0.5)
    const N: Face = { o: [0, MY + 0.4, 0], n: [0, 1] } // s = -x
    for (const sc of [11.2, 8.2, 5.2]) arched(N, sc, 2.1, G + 0.2, G + 2.4, win, 0.06)
    band(N, 8.2, 3, 1.1, 0.4, G + 4.4, G + 6.8)
  }

  // ---------------------------------------------------------------- the south-west end and porch
  {
    box(stone, -5, -24.2, 11, -MY + 0.2, 0, 13, null)
    hip(-5, 11, -24.2, -MY + 1, 13, 18, 0.4)
    chimney(1.5, -25, 27, 2.6, 1.8)
    const S: Face = { o: [3, -24.2, 0], n: [0, -1] } // s = x
    for (const sc of [-5.5, 0.5, 6.5]) {
      band(S, sc, 2, 1.2, 0.4, G + 1.3, G + 3.6)
      band(S, sc, 2, 1.2, 0.4, G + 4.9, G + 7.3)
    }
    // the deep corner loggia: heavy round columns under a low hipped roof
    const px0 = PX, px1 = -5, py0 = -26.4, py1 = -18
    box(stone, px0, py0, px1, py1, 0, G + 0.9, stone) // its podium
    const cols: XY[] = [[px0 + 0.7, py0 + 0.7], [px0 + 0.7, py1 - 0.7], [px0 + 0.7, -22.2], [-9, py0 + 0.7], [px1 - 0.7, py0 + 0.7]]
    for (const [x, y] of cols) box(stone, x - 0.55, y - 0.55, x + 0.55, y + 0.55, G + 0.9, 8.2, null, 0.3)
    box(stone, px0, py0, px1, py1, 8.2, 9.0, null)
    hip(px0, px1, py0, py1, 9.0, 10.6, 0.5)
    // the dark back wall of the loggia, seen between the columns
    flatShape(door, { o: [-11.6, -22, 0], n: [-1, 0] }, rect(-3.6, G + 0.9, 3.6, 8.2), 0.0)
    flatShape(door, { o: [-9, -25.2, 0], n: [0, -1] }, rect(-3.6, G + 0.9, 3.6, 8.2), 0.0)
    box(stone, -11.7, -25.3, -5, -18, G + 0.9, 8.2, null)
  }

  return finishGlb('James J. Hill House', [
    { part: stone, material: finish('hill-sandstone', 0x8c6156) },
    { part: slate, material: finish('hill-slate', 0x7c8288) },
    { part: cop, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ], {
    bearing: 44, height: 27,
    replaces: ['way/43385471'],
  })
}

if (import.meta.main) await writeModel('msp-james-j-hill-house', build())
