/**
 * Heck-Andrews House, Raleigh (1869–70; G. S. H. Appleget; Second
 * Empire): procedural, CC0-1.0.
 * bun generators/ral-heck-andrews-house.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°). Origin: the area centroid of OSM way/47776980
 * (-78.636616, 35.784257). The front, with the tower, faces south onto
 * Jones Street (k02). y = 0 is the lowest ground; elevation 0.
 *
 * OSM: way/47776980 "Heck-Andrews House" (no height): a main block
 * (x -3..11, y -7.8..7.4) and a narrower west ell (x -12.3..-3,
 * y -5.1..6.4). The outline takes in the front porch, so the house walls
 * are drawn at x -2.6..8.4, y -5.3..7.4 and the porch in front of them,
 * wrapping onto the east side (k01) to x 10.6.
 *
 * No lidar covers Wake County; heights are photo-scaled (estimated) from
 * k02, the south front frontal (the 11 m wall ≈ 920 px, ≈84 px/m),
 * lifted ≈8% for the upward view: porch floor 1.0 m, porch roof 4.6 m,
 * main bracketed cornice 8.8 m, the mansard's curved slopes to a deck at
 * 12.2 m; the tower 2.8 m wide (0.25 of the front, k02), its walls to
 * 12.5 m, its bell-shaped mansard to 16.3 m, a cap and balustrade to
 * 17.8 m. The west ell (not in any photo, hidden behind the house in
 * k02): drawn one tall storey, 5.6 m, under a low hip (invented), so it
 * stays under the main block's cornice.
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-heck-andrews-house/photos):
 *  k01 "Heck-Andrews House, Raleigh, NC (28221579358).jpg", Warren LeMay,
 *      CC0 (2016): from the south-east: the current pale pink paint, the
 *      porch wrapping the east side, dormers along the east mansard, the
 *      tower's oculi.
 *  k02 "Heck-Andrews-House-20080321.jpeg", Mark Turner, public domain
 *      (2008, then painted cream): the south front frontal, every height.
 *
 * Colours: the clapboard in its 2016 pink (k01), pulled to the palette's
 * lightness; trim a cream; the mansard slate a dark grey-blue; windows
 * slate panels.
 * Estimated: every height; dormer sizes. Invented: the west ell's form,
 * the north side (no licensed photo).
 * Left out: brackets, window hoods' scrolls, porch balusters, the slate's
 * fish-scale bands, the brick chimneys.
 * Doubts: no lidar, no Mapillary (no token); the porch's extent on the
 * east side; the ell.
 * Night: windows glow; the door is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, capRing, extrudeShape, flatShape, archShape, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel, triO, quadO } from './nash-tennessee-state-capitol'

const X0 = -2.6, X1 = 8.4, Y0 = -5.3, Y1 = 7.4
const XC = (X0 + X1) / 2
const CORN = 8.8, DECK = 12.2
const TW = 1.4, TY0 = Y0 - 0.3, TY1 = Y0 + 2.5, TWALL = 12.5, TTOP = 16.3

/** A mansard: rings inset by the profile's (inset, z) pairs, a deck on top. */
function mansard(slate: Part, deck: Part, x0: number, y0: number, x1: number, y1: number, prof: [number, number][]) {
  const rings = prof.map(([i, z]) => rect(x0 + i, y0 + i, x1 - i, y1 - i).map(([x, y]) => [x, y, z] as V3))
  slate.loft(rings)
  const [i, z] = prof[prof.length - 1]
  capRing(deck, rect(x0 + i, y0 + i, x1 - i, y1 - i), z, true)
}

function build() {
  const clap = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // ------------------------------------------------------------ the house
  prism(clap, null, rect(X0, Y0, X1, Y1), 0, CORN)
  // the bracketed cornice
  box(trim, X0 - 0.5, Y0 - 0.5, X1 + 0.5, Y1 + 0.5, CORN - 0.6, CORN, trim, 0.15)
  // the curved mansard (convex at the foot, steep, then a short top slope)
  mansard(slate, slate, X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3, [[0, CORN], [0.55, 9.6], [0.8, 10.6], [0.95, 11.6], [1.4, DECK]])
  // the west ell
  prism(clap, null, rect(-12.3, -5.1, X0, 6.4), 0, 5.6)
  box(trim, -12.6, -5.4, X0, 6.7, 5.1, 5.6, null)
  {
    const z = 5.6, r = 1.6, a = rect(-12.6, -5.4, X0, 6.7)
    const top = rect(-12.6 + 3, -5.4 + 3, X0 - 3, 6.7 - 3)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4, n: V3 = ([[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]] as V3[])[k]
      quadO(slate, [a[k][0], a[k][1], z], [a[l][0], a[l][1], z], [top[l][0], top[l][1], z + r], [top[k][0], top[k][1], z + r], n)
    }
    capRing(slate, top, z + r, true)
  }

  // ------------------------------------------------------------ the tower
  box(clap, XC - TW, TY0, XC + TW, TY1, 0, TWALL, null)
  box(trim, XC - TW - 0.35, TY0 - 0.35, XC + TW + 0.35, TY1 + 0.35, TWALL - 0.5, TWALL, trim, 0.1)
  // the bell-shaped mansard: bulging out, then drawn in to the cap
  mansard(slate, trim, XC - TW - 0.1, TY0 - 0.1, XC + TW + 0.1, TY1 + 0.1, [[0, TWALL], [-0.08, 13.4], [0, 14.4], [0.2, 15.3], [0.55, 15.95], [0.85, TTOP]])
  box(trim, XC - 0.75, (TY0 + TY1) / 2 - 0.75 - 0.15, XC + 0.75, (TY0 + TY1) / 2 + 0.75 - 0.15, TTOP, 17.0, trim)
  box(trim, XC - 0.9, (TY0 + TY1) / 2 - 0.9 - 0.15, XC + 0.9, (TY0 + TY1) / 2 + 0.9 - 0.15, 17.0, 17.8, trim)
  // an oculus on each of the tower's faces, set in the bulge
  const tc: XY = [XC, (TY0 + TY1) / 2]
  for (const n of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
    const half = n[0] ? TW + 0.1 : (TY1 - TY0) / 2 + 0.1
    const f: Face = { o: [tc[0] + n[0] * half, tc[1] + n[1] * half, 0], n }
    extrudeShape(trim, f, arc(0, 14.2, 0.62, 0, 360, 12).slice(0, -1), -0.4, 0.14)
    flatShape(win, f, arc(0, 14.2, 0.42, 0, 360, 12).slice(0, -1), 0.17)
  }

  // ------------------------------------------------------------ dormers in the mansard
  const dormer = (f: Face, s: number) => {
    extrudeShape(clap, f, [[s - 0.85, 9.0], [s + 0.85, 9.0], [s + 0.85, 11.4], [s - 0.85, 11.4]], -1.0, -0.15)
    extrudeShape(trim, f, [[s - 1.0, 11.3], [s + 1.0, 11.3], [s, 12.0]], -1.0, -0.08)
    flatShape(win, f, archShape(s, 0.9, 9.3, 10.8, 6), -0.12)
  }
  const faces: [Face, number[]][] = [
    [{ o: [XC, Y0 - 0.3, 0], n: [0, -1] }, [-3.6, 3.6]],
    [{ o: [X1 + 0.3, 0, 0], n: [1, 0] }, [-4.2, -0.3, 3.6]],
    [{ o: [XC, Y1 + 0.3, 0], n: [0, 1] }, [-2.4, 2.4]],
  ]
  for (const [f, ss] of faces) for (const s of ss) dormer(f, s)
  // the tower's tall arched window over the porch roof
  panel(trim, { o: [XC, TY0, 0], n: [0, -1] }, 0, 1.6, 9.1, 9.3, 0.05)
  flatShape(win, { o: [XC, TY0, 0], n: [0, -1] }, archShape(0, 1.0, 9.3, 11.4, 8), 0.06)

  // ------------------------------------------------------------ windows: round-headed, in pale surrounds
  const win2 = (f: Face, s: number, z0: number, zs: number, w = 0.95) => {
    flatShape(trim, f, archShape(s, w + 0.4, z0 - 0.2, zs, 8), 0.04)
    flatShape(win, f, archShape(s, w, z0, zs, 8), 0.07)
  }
  const south: Face = { o: [XC, Y0, 0], n: [0, -1] }, tower: Face = { o: [XC, TY0, 0], n: [0, -1] }
  for (const s of [-4.1, -2.4, 2.4, 4.1]) { win2(south, s, 5.6, 7.4); win2(south, s, 1.5, 3.8, 1.1) }
  for (const s of [-0.45, 0.45]) win2(tower, s, 5.6, 7.4, 0.7)
  // the front door, round-headed (k02)
  flatShape(trim, tower, archShape(0, 1.9, 1.0, 3.4, 8), 0.04)
  flatShape(door, tower, archShape(0, 1.4, 1.0, 3.3, 8), 0.07)
  const east: Face = { o: [X1, 1.05, 0], n: [1, 0] }, west: Face = { o: [X0, 1.05, 0], n: [-1, 0] }, north: Face = { o: [XC, Y1, 0], n: [0, 1] }
  for (const s of [-4.4, -2.4, 0.6, 2.6, 4.6]) { win2(east, s, 5.6, 7.4); win2(east, s, 1.5, 3.8, 1.1) }
  for (const s of [-3.5, -1.5, 1.5, 3.5]) win2(north, s, 5.6, 7.4)
  for (const s of [-4.6, 4.6]) win2(west, s, 5.6, 7.4)
  const ellS: Face = { o: [-7.45, -5.1, 0], n: [0, -1] }, ellN: Face = { o: [-7.45, 6.4, 0], n: [0, 1] }
  for (const f of [ellS, ellN]) for (const s of [-2.8, 0, 2.8]) win2(f, s, 1.3, 3.5)

  // ------------------------------------------------------------ the porch, wrapping the front and the east side
  const P0 = Y0 - 2.5, PE = X1 + 2.2
  const floor: XY[] = [[X0 - 0.4, P0], [PE, P0], [PE, Y1 - 1.0], [X1, Y1 - 1.0], [X1, Y0], [X0 - 0.4, Y0]]
  prism(trim, trim, floor, 0, 1.0)
  // its roof: a shallow slope down from the wall, slate, on paired posts
  prism(trim, null, floor.map(([x, y]) => [x, y] as XY), 4.2, 4.6)
  capRing(slate, floor, 4.6, true)
  capRing(trim, floor, 4.2, false)
  const posts: XY[] = [[X0 - 0.2, P0 + 0.2], [X0 + 2.5, P0 + 0.2], [XC - 1.3, P0 + 0.2], [XC + 1.3, P0 + 0.2], [X1 - 2.5, P0 + 0.2], [PE - 0.2, P0 + 0.2], [PE - 0.2, -0.5], [PE - 0.2, 3.4], [PE - 0.2, Y1 - 1.2]]
  for (const [x, y] of posts) {
    box(trim, x - 0.3, y - 0.12, x - 0.06, y + 0.12, 1.0, 4.2, null)
    box(trim, x + 0.06, y - 0.12, x + 0.3, y + 0.12, 1.0, 4.2, null)
  }

  return finishGlb('Heck-Andrews House', [
    { part: clap, material: finish('heck-andrews-clapboard', 0xe6d3d3) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('heck-andrews-slate', 0x76828c) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 3, height: 17.8, replaces: ['way/47776980'] }, 5000)
}

if (import.meta.main) await writeModel('ral-heck-andrews-house', build())
