/**
 * The Gothic Chapel, Crown Hill Cemetery (1875, Adolph Scherrer and D. A.
 * Bohlen), 700 West 38th Street, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-crown-hill-gothic-chapel.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 358 (the
 * outline's walls run at 358). The origin is the area centroid of OSM
 * way/218880339 (-86.1717211, 39.8173360). The site is flat (map terrain
 * within 0.6 m, lidar ground 0.7..0.9); y = 0 is the ground.
 *
 * Identity (from the photos below):
 *  1. A small, steep-roofed Gothic Revival chapel of pale grey limestone
 *     (not brick) under dark slate, its tall west gable facing the drive,
 *     with a rose window and a pair of small lancets in the gable. (W, NW)
 *  2. Tall octagonal pinnacles with spirelets flanking the west gable, and
 *     smaller ones on the porch and on the corners of the side wings.
 *  3. The gabled entrance porch in front of the west gable: a deep pointed
 *     arch over dark double doors.                                (W, NW)
 *  4. The lower side wings (north and south) with slate hipped roofs and
 *     blind lancet arcades; a low chancel to the east.    (NW, lidar)
 *  It has no bell tower or spire of its own: the pinnacles are its crown.
 *
 * Sources
 * - OSM (ODbL): way/218880339 (building=chapel), the cross plan; no
 *   heights.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 0.5 m grid read in this frame, ground 0.7..0.9. Measured: the
 *   nave ridge 15.4..15.8 (E-W, at y -1), its eaves about 11; the side
 *   wings 6.0..9.3; the chancel 6.6..8.5; the porch roof 4.4..5.2 with its
 *   gable to 10.7; the west pinnacles 13.7..16.2.
 * - Photos (Wikimedia Commons):
 *   "Gothic Chapel at Crown Hill Cemetery.jpg" (Upstateherd, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Gothic_Chapel_at_Crown_Hill_Cemetery.jpg),
 *   from the north-west: the porch, the west gable, the north wing;
 *   "Crown Hill Cemetery - January 2012 06.jpg" (Richie Diesterheft,
 *   CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Crown_Hill_Cemetery_-_January_2012_06.jpg),
 *   the west front head-on.
 *
 * Estimated: the nave width (7.6 m, between the lidar eaves and the OSM
 *   chancel), the porch's depth (the lidar roof reaches 2 m west of the
 *   OSM stub), the windows' sizes and the pinnacles' girth, from the photos.
 * Doubts: the south and east sides are not photographed and are drawn to
 *   match the north. The lidar ridge sits about 1 m south of the OSM
 *   plan's middle; the OSM plan is followed.
 * Left out: crockets, finials' crosses, the cresting on the ridge, the
 *   buttress offsets, the tracery in the porch's tympanum, the steps.
 * Night: the windows glow; the stone is unlit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type XY, type Face, prism, rect, ccw, flatShape, extrudeShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

const stone = new Part(), slate = new Part(), win = new Part(), door = new Part()

/** A gabled block over x0..x1, y0..y1 with its ridge along x (or y), eaves e, ridge r, overhang o. */
function gabled(x0: number, y0: number, x1: number, y1: number, e: number, r: number, alongX: boolean, o = 0.3) {
  prism(stone, null, ccw(rect(x0, y0, x1, y1)), 0, e)
  if (alongX) {
    const ym = (y0 + y1) / 2
    // gable ends
    stone.tri([x0, y0, e], [x0, ym, r], [x0, y1, e])
    stone.tri([x1, y0, e], [x1, y1, e], [x1, ym, r])
    slate.quad([x0 - o, y0 - o, e - 0.2], [x1 + o, y0 - o, e - 0.2], [x1 + o, ym, r + 0.1], [x0 - o, ym, r + 0.1])
    slate.quad([x1 + o, y1 + o, e - 0.2], [x0 - o, y1 + o, e - 0.2], [x0 - o, ym, r + 0.1], [x1 + o, ym, r + 0.1])
  } else {
    const xm = (x0 + x1) / 2
    stone.tri([x0, y0, e], [x1, y0, e], [xm, y0, r])
    stone.tri([x1, y1, e], [x0, y1, e], [xm, y1, r])
    slate.quad([x1 + o, y0 - o, e - 0.2], [x1 + o, y1 + o, e - 0.2], [xm, y1 + o, r + 0.1], [xm, y0 - o, r + 0.1])
    slate.quad([x0 - o, y1 + o, e - 0.2], [x0 - o, y0 - o, e - 0.2], [xm, y0 - o, r + 0.1], [xm, y1 + o, r + 0.1])
  }
}
/** A hipped block: ridge along x, inset `h` from each end. */
function hipped(x0: number, y0: number, x1: number, y1: number, e: number, r: number, o = 0.3) {
  prism(stone, null, ccw(rect(x0, y0, x1, y1)), 0, e)
  const ym = (y0 + y1) / 2, d = (y1 - y0) / 2
  const a: V3 = [x0 - o, y0 - o, e - 0.2], b: V3 = [x1 + o, y0 - o, e - 0.2], c: V3 = [x1 + o, y1 + o, e - 0.2], dd: V3 = [x0 - o, y1 + o, e - 0.2]
  const p: V3 = [x0 + d, ym, r], q: V3 = [x1 - d, ym, r]
  slate.quad(a, b, q, p)
  slate.quad(c, dd, p, q)
  slate.tri(b, c, q)
  slate.tri(dd, a, p)
}
/** An octagonal pinnacle: shaft to z1, a spirelet to z2. */
function pinnacle(x: number, y: number, r: number, z0: number, z1: number, z2: number) {
  lathe(stone, x, y, [[r, z0], [r, z1], [r * 1.15, z1 + 0.15], [r * 1.15, z1 + 0.35], [0.01, z2]], 8, 22.5, 382.5)
}
/** An equilateral pointed arch's outline: width w, jambs from z0, springing at zs. */
function pointed(sc: number, w: number, z0: number, zs: number, n = 5): XY[] {
  const right = arc(sc - w / 2, zs, w, 0, 60, n), left = arc(sc + w / 2, zs, w, 120, 180, n)
  return [[sc - w / 2, z0], [sc + w / 2, z0], ...right, ...left.slice(1)]
}

// ---------------------------------------------------------------- the masses
const NY0 = -4.3, NY1 = 3.3, NX0 = -7.4, NX1 = 3.5 // the nave
gabled(NX0, NY0, NX1, NY1, 10.0, 15.0, true)
hipped(NX0, NY1, NX1, 9.5, 5.8, 7.8)           // north wing
hipped(NX0, -9.5, NX1, NY0, 5.8, 7.8)          // south wing
gabled(NX1, -4.0, 11.8, 2.9, 5.2, 8.0, true)   // the chancel
gabled(-12.5, -3.4, NX0, 2.4, 4.8, 9.6, true)  // the porch

// ---------------------------------------------------------------- pinnacles
for (const y of [NY0 - 0.2, NY1 + 0.2]) pinnacle(NX0 - 0.2, y, 0.48, 0, 12.6, 15.8)
for (const y of [-3.6, 2.6]) pinnacle(-12.6, y, 0.34, 0, 6.4, 8.6)
for (const [x, y] of [[NX0, 9.5], [NX0, -9.5], [NX1, 9.5], [NX1, -9.5]] as XY[]) pinnacle(x, y, 0.36, 0, 7.0, 9.4)
for (const y of [NY0 - 0.1, NY1 + 0.1]) pinnacle(NX1, y, 0.34, 8.0, 10.8, 12.6)

// ---------------------------------------------------------------- the west front
{
  const ym = (NY0 + NY1) / 2
  const W: Face = { o: [NX0, NY1, 0], n: [-1, 0] } // s runs south from the north corner
  const s0 = NY1 - ym // s of the gable's centre
  // the rose window and the two small lancets in the gable
  const rose = arc(s0, 11.1, 1.1, 0, 360, 14).slice(0, -1)
  flatShape(win, W, rose, 0.06)
  for (const ds of [-0.45, 0.45]) flatShape(win, W, pointed(s0 + ds, 0.55, 12.8, 13.3, 3), 0.06)
  // the porch's portal: a deep pointed arch with a moulding, dark doors and a glazed tympanum
  const pw = 5.8, P: Face = { o: [-12.5, 2.4, 0], n: [-1, 0] }, ps = pw / 2
  extrudeShape(stone, P, [...pointed(ps, 4.5, 0, 3.4, 6)], 0, 0.25)
  flatShape(door, P, rect(ps - 1.4, 0, ps + 1.4, 3.1), 0.27)
  flatShape(win, P, pointed(ps, 2.8, 3.1, 3.1, 5), 0.27)
  // a small round window in the porch gable
  flatShape(win, P, arc(ps, 7.8, 0.4, 0, 360, 10).slice(0, -1), 0.06)
}

// ---------------------------------------------------------------- lancets on the wings and the chancel
for (const [y, n] of [[9.5, [0, 1]], [-9.5, [0, -1]]] as [number, XY][]) {
  const F: Face = n[1] > 0 ? { o: [NX1, y, 0], n } : { o: [NX0, y, 0], n }
  const L = NX1 - NX0
  for (let k = 0; k < 4; k++) flatShape(win, F, pointed(1.6 + (k * (L - 3.2)) / 3, 1.0, 1.4, 3.6, 4), 0.06)
}
for (const [y, n] of [[2.9, [0, 1]], [-4.0, [0, -1]]] as [number, XY][]) {
  const F: Face = n[1] > 0 ? { o: [11.8, y, 0], n } : { o: [NX1, y, 0], n }
  for (const s of [2.6, 5.7]) flatShape(win, F, pointed(s, 1.0, 1.3, 3.4, 4), 0.06)
}
// the chancel's east window
flatShape(win, { o: [11.8, -4.0, 0], n: [1, 0] }, pointed(3.45, 1.8, 1.4, 4.0, 5), 0.06)

const built = finishGlb('Gothic Chapel, Crown Hill Cemetery', [
  { part: stone, material: finish('indy-chc-limestone', 0xddd8cd) },
  { part: slate, material: finish('indy-chc-slate', 0x77807e) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('indy-chc-door', 0x5b4d42) },
], { bearing: 358, height: 16.0, replaces: ['way/218880339'] }, 5000)
await writeModel('indy-crown-hill-gothic-chapel', built)
