/**
 * Red Hat Tower, Raleigh (2005; built as Two Progress Plaza, Red Hat's
 * headquarters since 2013) — original procedural geometry, CC0-1.0.
 * bun generators/ral-red-hat-tower.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the outer way of OSM relation/4144751
 * (way/267551242), 35.775208, -78.637828. Bearing 2 (the downtown grid,
 * from the outline's edges).
 *
 * The OSM multipolygon covers the whole complex: the tower and its two
 * podium blocks (the nine-level block on the south, the eight-level block
 * on the east). All of it is drawn, as plain masses for the podium, so
 * none of it is left showing as a box through the model.
 *
 * Identity (photos below): a pale grey precast slab running east–west,
 * long faces of horizontal glass ribbons, a thin flared cornice at the
 * roof; on the west end a projecting stone pylon with vertical window
 * strips, rising past the roof to two open square frames; the south bay
 * beside the pylon stops a few storeys lower; and on the roof the big red
 * Red Hat box (a mechanical screen) with the white Shadowman logo and
 * "redhat" wordmark facing south, an open steel cage at its west end. The
 * box is a lit sign at night (`neon-red-hat`, in its own red); the logo
 * and wordmark are plain white shapes (STYLE.md: other signs are plain).
 *
 * Evidence:
 *  - plan: OSM relation/4144751 (outer way/267551242) and its parts
 *    way/310324642, way/310750829 (tower), way/310168484 (east block, 8
 *    levels), way/310168485 (south block, 9 levels), turned 2° and squared
 *    up. The pylon's width and the cage: estimated from the photos.
 *  - heights: OSM part heights 76.4 m (the red box and the pylon frames)
 *    and 71 m (the main roof); 19 floors (OSM); main roof 70.5 m; the
 *    lower south bay 3 storeys lower; the box 70.5–76.4 m. The pylon to
 *    74 m and its frames to 80 m: estimated from City Dweller 2's and
 *    Alexisrael's photos (the pylon about a storey above the roof, the
 *    frames about two storeys above it), so above OSM's 76.4 m. The box's
 *    plan (x −29…19 with the cage to −33.5, y 1…21) and the south block's
 *    height (~28 m) from USGS NAIP: the roof's outline, and the block's
 *    lean against the tower roof's lean in the same image. East block
 *    30 m: estimated from its 8 levels. No lidar covers Raleigh.
 *  - colours: precast pale grey, glass dark teal (from every daylight
 *    photo, pulled to the palette's lightness), box red, podium tan stone.
 *  - y = 0 is the street; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Red Hat Tower-2013-10-29.jpeg, Mark Turner, CC0
 *    https://commons.wikimedia.org/wiki/File:Red_Hat_Tower-2013-10-29.jpeg
 *    (dusk from the south-west: the box, logo at its east end, cage)
 *  - Red Hat Tower December 2023.jpg, City Dweller 2, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Red_Hat_Tower_December_2023.jpg
 *    (the west end close up: pylon, frames, lower south bay, cornices)
 *  - Red Hat Tower -- 15 February 2017 (cropped).jpeg, Josh Hunter, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Red_Hat_Tower_--_15_February_2017_(cropped).jpeg
 *    (the south face and the box, from a roof)
 *  - Red Hat Tower.JPG, Alexisrael, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Red_Hat_Tower.JPG
 *    (from Fayetteville Street: the west end and the north face)
 *  - Red Hat Tower -- 27 September 2014 (cropped).jpg, James Willamor, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Red_Hat_Tower_--_27_September_2014_(cropped).jpg
 *    (from the south, far: the whole south face and the box)
 *  - Two Progress Plaza from RBC Plaza.jpg, Suzie Tremmel, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Two_Progress_Plaza_from_RBC_Plaza.jpg
 *    (from above, before 2013: the roof, the screen box and the west frames)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no photo shows the north and east faces of the red box (drawn
 * red all round) or the east block; the podium heights are estimates; the
 * logo and wordmark are simplified to a disc and a bar.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, rect, ringFaces, face, punched, coping, plate, cap, write } from './ral-wells-fargo-capitol-center'

const precast = new Part(), glass = new Part(), roof = new Part(), red = new Part(), white = new Part(), tan = new Part()

const FLOOR = 3.6, G0 = 6
const ROOF = 70.5, BOX = 76.4, FRAME = 80, PYLON = 74, LOWBAY = ROOF - 3 * FLOOR

/** A box mass with dressed walls, a coping and an overhanging flared cornice. */
function block(ring: XY[], z0: number, z1: number, dress: (f: Face) => void, cornice = 0) {
  for (const f of ringFaces(ring, z0, z1)) {
    dress(f)
    if (cornice > 0) {
      plate(precast, f, -cornice, f.len + cornice, z1 - 0.7, z1, cornice, cornice)
    } else coping(precast, f, 0.7, 0.18)
  }
  cap(roof, ring, z1)
}

const ribbons = (f: Face) => punched(precast, glass, f, { bay: 7, pier: 0.7, group: 2 * FLOOR, spandrel: 1.7, origin: G0 })
const strips = (f: Face) => punched(precast, glass, f, { bay: 3.2, pier: 1.3, group: 3 * FLOOR, spandrel: 1.6, origin: G0 })
const podium = (f: Face) => punched(tan, glass, f, { bay: 4.5, pier: 1.4, group: 2 * 4.2, spandrel: 2.0, origin: 0 })

// The tower: the main slab, the lower south bay at the west end, the pylon.
block(rect(-29.9, -12.5, 30.9, 2.6), 0, ROOF, ribbons, 1.2)
block([[-40, 2.6], [34.8, 2.6], [34.8, 25.9], [-40, 25.9]], 0, ROOF, ribbons, 1.2)
block(rect(-35.7, -12.5, -29.9, 2.6), 0, LOWBAY, ribbons, 1.2)
const PY0 = 3.4, PY1 = 20.4
block(rect(-41.6, PY0, -33.5, PY1), 0, PYLON, strips)

// The two open square frames on the pylon, side by side along its west edge.
{
  const x0 = -41.4, x1 = -40.2, bar = 1.2
  const spans: Array<[number, number]> = [[PY0 + 0.2, (PY0 + PY1) / 2 - 0.2], [(PY0 + PY1) / 2 + 0.2, PY1 - 0.2]]
  for (const [y0, y1] of spans) {
    const posts = [rect(x0, y0, x1, y0 + bar), rect(x0, y1 - bar, x1, y1)]
    for (const r of posts) block(r, PYLON, FRAME, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
    block(rect(x0, y0, x1, y1), FRAME - bar, FRAME, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
    // a matching frame set back 6 m, joined by beams: the frames are open boxes
    const back = 6
    for (const r of [rect(x0 + back, y0, x1 + back, y0 + bar), rect(x0 + back, y1 - bar, x1 + back, y1)]) block(r, PYLON, FRAME, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
    block(rect(x0 + back, y0, x1 + back, y1), FRAME - bar, FRAME, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
    for (const [ya, yb] of [[y0, y0 + bar], [y1 - bar, y1]]) block(rect(x1, ya, x0 + back, yb), FRAME - bar, FRAME, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
  }
}

// The red box on the roof, its steel cage at the west end, logo facing south.
{
  const BX0 = -29, BX1 = 19, BY0 = 1, BY1 = 21
  const box = rect(BX0, BY0, BX1, BY1)
  for (const f of ringFaces(box, ROOF, BOX)) plate(red, f, 0, f.len, ROOF, BOX, 0, 0)
  cap(roof, box, BOX)
  // cage: corner posts and a top ring of beams
  const CX0 = BX0 - 4.5, b = 0.6
  for (const [x, y] of [[CX0, BY0], [CX0, BY1 - b], [BX0 - b, BY0], [BX0 - b, BY1 - b]] as XY[]) {
    block(rect(x, y, x + b, y + b), ROOF, BOX, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
  }
  for (const r of [rect(CX0, BY0, BX0, BY0 + b), rect(CX0, BY1 - b, BX0, BY1), rect(CX0, BY0, CX0 + b, BY1)]) {
    block(r, BOX - b, BOX, (f) => plate(precast, f, 0, f.len, f.z0, f.z1, 0, 0))
  }
  // the logo (a disc) and the wordmark (a bar), white, on the south face
  const s = face([BX0, BY0], [BX1, BY0], ROOF, BOX)
  const zc = (ROOF + BOX) / 2, r = 2.0, cs = s.len - 13
  const segs = 14
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * 2 * Math.PI, a1 = ((i + 1) / segs) * 2 * Math.PI
    const P = (a: number): V3 => {
      const u = cs + r * Math.cos(a)
      return [s.a[0] + s.t[0] * u + s.n[0] * 0.08, s.a[1] + s.t[1] * u + s.n[1] * 0.08, zc + r * Math.sin(a)]
    }
    const c: V3 = [s.a[0] + s.t[0] * cs + s.n[0] * 0.08, s.a[1] + s.t[1] * cs + s.n[1] * 0.08, zc]
    white.tri(c, P(a0), P(a1))
  }
  plate(white, s, cs + 3, cs + 10.5, zc - 0.8, zc + 0.8, 0.08)
}

// The podium blocks of the complex.
block(rect(-29.9, -32.5, 23.0, -12.5), 0, 28, podium)
block(rect(34.8, 6.8, 48.6, 25.5), 0, 30, podium)

const signLit = (p: V3) => (p[2] > ROOF + 0.5 ? 0.6 : 0)
await write('ral-red-hat-tower', 'Red Hat Tower', [
  { part: precast, material: finish('rht-precast', 0xdcdbd6) },
  { part: glass, material: windowVariant(2, 0x5f7a80) },
  { part: roof, material: PALETTE.roof },
  { part: red, material: finish('neon-red-hat', 0xd4453d, 0.6) },
  { part: white, material: { ...PALETTE.trim, floodlight: signLit } },
  { part: tan, material: finish('rht-podium-stone', 0xddcdb0) },
], { bearing: 2, elevation: 0, height: FRAME, replaces: ['relation/4144751', 'way/267551242', 'way/310324642', 'way/310750829', 'way/310168484', 'way/310168485'] })
