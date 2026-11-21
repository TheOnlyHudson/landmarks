/**
 * Lois & Richard Rosenthal Center for Contemporary Art (Zaha Hadid, 2003),
 * Cincinnati — original procedural geometry, CC0-1.0.
 * bun generators/cin-contemporary-arts-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -84.512126, 39.102843) on the lowest ground
 * under the footprint. Built in the outline's frame: x along 6th Street,
 * y along Walnut Street; placement bearing 358.5°.
 *
 * Form: an L-shaped block on the north-west corner of 6th and Walnut.
 * Its identity is the "jigsaw" of the Walnut face and the corner: stacked
 * pale concrete boxes and one black box, each pushed out past the face by
 * a different amount, over a recessed glazed ground floor. Along 6th
 * Street a concrete band (the lettered "urban carpet" lip) runs over the
 * glazed ground floor, glass curtain wall above it, and a long concrete box
 * cantilevers out over the pavement near the top.
 *
 * Sources
 * - OSM: outline way/46129997 (height 40, 6 levels). The narrow office
 *   building west of it, way/198344672 with parts way/1569533729..732, is a
 *   separate building and is neither modelled nor replaced.
 * - Published: opened 2003, Zaha Hadid's first US building (Wikipedia,
 *   "Contemporary Arts Center").
 * - Photos (Wikimedia Commons):
 *   Warren LeMay, "Contemporary Arts Center, Cincinnati, OH (46306691005)"
 *   (CC0; from the south-east corner: the jigsaw, the black box, both faces)
 *   https://commons.wikimedia.org/wiki/File:Contemporary_Arts_Center,_Cincinnati,_OH_(46306691005).jpg
 *   EEJCC, "Contemporary Arts Center, Cincinnati, 2019" (CC BY-SA 4.0; from
 *   the south-east, lower: the cantilevers over the corner)
 *   https://commons.wikimedia.org/wiki/File:Contemporary_Arts_Center,_Cincinnati,_2019.jpg
 *   Keith Lanser, "Contemporary Art Museum Cincinnati" (public domain; the
 *   6th Street face square on: glazed ground floor, lettered band, glass
 *   above)
 *   https://commons.wikimedia.org/wiki/File:Contemporary_Art_Museum_Cincinnati.JPG
 *   Eric Inglert, "CenterForContemporaryArtCorner" (CC BY-SA 3.0; the corner
 *   from Walnut, the black box from below)
 *   https://commons.wikimedia.org/wiki/File:CenterForContemporaryArtCorner.jpg
 * Estimated (from the photos, scaled by the 40 m OSM height and the 21.8 m
 *   Walnut face): every box's extent and height, the cantilevers (1.5-2.5
 *   m), the ground floor height (6.5 m). No lidar read: published height
 *   and photos settle a six-storey block.
 * Doubts: the north and west faces are hidden by neighbours in every photo
 *   and are drawn plain.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, wallEdge, chamfer, edgeBase, type Prism, finishGlb, emit } from './sea-two-union-square'
import { panels } from './cin-great-american-tower'

function build() {
  const conc = new Part(), black = new Part(), win = new Part(), door = new Part(), roof = new Part()
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  const S = -13.3, E = 24.0, W = -19.7 // 6th Street face, Walnut face, west party wall

  /** A free box (z0..z1), bevelled vertical edges, all faces. */
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const r = chamfer(rect(x0, x1, y0, y1), 0.35)
    for (let i = 0; i < r.length; i++) wallEdge(p, r, i, z0, z1, 0)
    capRing(roof === p ? roof : p, r, z1)
    capRing(p, r, z0, false)
  }

  // ---- the main mass: the L outline, stacked above a recessed glazed ground floor
  const L: XY[] = ccw([[W, S], [E, S], [E, 9.0], [-6.2, 8.8], [-6.3, 19.9], [W, 19.9]])
  const GF = 6.5
  // glazed ground floor, set 1.2 m back from both street faces
  const gf: XY[] = ccw([[W, S + 1.2], [E - 1.2, S + 1.2], [E - 1.2, 9.0], [-6.2, 8.8], [-6.3, 19.9], [W, 19.9]])
  for (let i = 0; i < gf.length; i++) {
    const a = gf[i], b = gf[(i + 1) % gf.length]
    const street = (Math.abs(a[1] - b[1]) < 0.01 && a[1] < 0) || (Math.abs(a[0] - b[0]) < 0.01 && a[0] > 20)
    wallEdge(street ? door : conc, gf, i, 0, GF, 0)
  }
  // soffit over the recess
  capRing(conc, L, GF, false)

  const prisms: Prism[] = [
    { ring: L, z0: GF, z1: 31, kind: 'body' },
    { ring: rect(-6, E - 2, -11, 9), z0: GF, z1: 39.6, kind: 'top' },
  ]
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(conc, r, i, z0, P.z1, 0)
      const a = r[i], b = r[(i + 1) % r.length]
      // the 6th Street face is glass above the band
      if (P.kind === 'body' && Math.abs(a[1] - S) < 0.01 && Math.abs(b[1] - S) < 0.01)
        panels(win, r, i, 11.5, 24, { w: 6.0, pitch: 6.4, grp: 12.5, gap: 0.01, from: 11.5, margin: 0.6 })
    }
    capRing(roof, r, P.z1)
  }

  // ---- the jigsaw (corner and Walnut face)
  // lettered concrete band along 6th Street over the ground floor
  box(conc, W + 0.3, 7, S - 0.6, S + 1.5, GF, 11)
  // low concrete box over the corner, pushed out past Walnut
  box(conc, 6, E + 1.6, S - 0.4, 8.6, GF, 15.5)
  // the black box, cantilevered over both streets at the corner
  box(black, 9, E + 2.6, S - 2.2, -1, 16.5, 25)
  // a tall concrete pier box at the north end of the Walnut face
  box(conc, E - 2.5, E + 1.0, 0.5, 8.6, 15.5, 35)
  // the long box along 6th Street, cantilevered out near the top
  box(conc, W + 0.5, 11, S - 1.8, -8.5, 24.5, 31.5)
  // the top box over the corner, set slightly out over Walnut
  box(conc, -4, E + 0.6, S + 0.4, 0.4, 31.5, 40)
  // windows: a strip in the Walnut face between the boxes, and the top box's slot
  panels(win, rect(-4, E + 0.6, S + 0.4, 0.4), 1, 33, 38, { w: 11, pitch: 12, grp: 6, gap: 0.01, from: 33 })

  return finishGlb('Contemporary Arts Center', [
    { part: conc, material: finish('cac-concrete', 0xdcdcd5) },
    { part: black, material: finish('cac-black', 0x4a4f57, 0.5) },
    { part: win, material: PALETTE.window },
    { part: door, material: windowVariant(2, 0x56636f) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 358.5, height: 40, replaces: REPLACES })
}

const REPLACES = ['way/46129997']

if (import.meta.main) await emit('cin-contemporary-arts-center', build())
