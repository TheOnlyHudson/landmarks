/**
 * The Obelisk, Veterans Memorial Plaza (1930), Indiana World War Memorial
 * Plaza, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-veterans-memorial-obelisk.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the OSM node
 * node/1289479681 (-86.1568856, 39.7747971), the obelisk's axis; the model
 * is squared to the downtown grid (bearing 0.86, as the War Memorial's
 * outline). y = 0 is the floor the stepped base stands on.
 *
 * Identity: a 100 ft black granite obelisk with a gilded pyramidion, on a
 * square die carrying four bronze relief panels (Law, Science, Religion,
 * Education), over three broad steps, standing in the middle of a round
 * fountain basin (the basin, its jets and its water are left to the map).
 *
 * Sources
 * - OSM (ODbL): node/1289479681 (historic=monument, height 30). No
 *   building outline: `replaces` is empty.
 * - Published (Wikipedia, "Indiana World War Memorial Plaza"): the obelisk
 *   is 100 ft (30.5 m) of black granite with four bronze bas-reliefs by
 *   Henry Hering, in a fountain basin of coloured marble.
 * - Photos (Wikimedia Commons):
 *   "Veteran's Memorial Plaza Obelisk Indianapolis, Indiana.jpg" (Jimmy
 *   Baikovicius, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Veteran%27s_Memorial_Plaza_Obelisk_Indianapolis,_Indiana.jpg),
 *   square on, at night: every proportion below is scaled from it against
 *   the 30.5 m total;
 *   "Obelisk and States' Flags - panoramio.jpg" (Bohao Zhao, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:Obelisk_and_States%27_Flags_-_panoramio.jpg),
 *   by day: the granite reads near black, the tip gold.
 *
 * Scaled from the photo (±0.3 m; it is taken corner-on, so widths are its
 *   diagonals over 1.41): steps 6.8, 5.5 and 4.4 m wide, 0.75 m
 *   each; plinth 3.7 m to 2.9 m; the die 3.1 m wide, 2.9..7.6 m; the shaft
 *   2.7 m at its foot to 1.6 m under the pyramidion at 28.4 m; the
 *   pyramidion to 30.5 m.
 * Left out: the four small bronze eagles at the foot of the shaft, the
 *   fountain basin and jets, the flagpoles.
 * Night: the obelisk is floodlit from the basin (a wash on the granite,
 *   strongest low down).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { type XY, prism, rect, chamfer, flatShape, finishGlb, writeModel, type Face } from './sea-tacoma-union-station'

const granite = new Part(), steps = new Part(), gold = new Part(), bronze = new Part()

const sq = (h: number): XY[] => rect(-h, -h, h, h)
// the three steps and the plinth
prism(steps, steps, chamfer(sq(3.4), 0.15), 0, 0.75)
prism(steps, steps, chamfer(sq(2.75), 0.15), 0.75, 1.5)
prism(steps, steps, chamfer(sq(2.2), 0.15), 1.5, 2.25)
prism(granite, granite, chamfer(sq(1.85), 0.15), 2.25, 2.9)
// the die with its cap moulding
prism(granite, null, chamfer(sq(1.55), 0.12), 2.9, 7.6)
prism(granite, granite, chamfer(sq(1.7), 0.15), 7.6, 8.1)
// the four bronze reliefs
for (const n of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
  const f: Face = { o: [n[0] * 1.55, n[1] * 1.55, 0], n }
  flatShape(bronze, f, [[-1.0, 3.5], [1.0, 3.5], [1.0, 7.0], [-1.0, 7.0]], 0.05)
}
// the tapering shaft
const Z0 = 8.1, Z1 = 28.4, B = 1.35, T = 0.78
const ring = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
granite.loft([ring(B, Z0), ring(T, Z1)])
// the gilded pyramidion
const top: V3 = [0, 0, 30.5]
const r = ring(T, Z1)
for (let k = 0; k < 4; k++) gold.tri(r[k], r[(k + 1) % 4], top)

// floodlit from the basin: brightest low, faces looking up barely
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.3 : Math.max(0.35, 1 - p[2] / 45))
const graniteMat = { ...finish('indy-obelisk-granite', 0x4a4f57), floodlight: lit }
const stepsMat = { ...finish('indy-obelisk-steps', 0x6b6e72), floodlight: lit }
const built = finishGlb('The Obelisk, Veterans Memorial Plaza', [
  { part: granite, material: graniteMat },
  { part: steps, material: stepsMat },
  { part: bronze, material: finish('indy-obelisk-bronze', 0x7a6a50) },
  { part: gold, material: finish('indy-obelisk-gilt', 0xc9a54a, 0.5) },
], { bearing: 0.86, height: 30.5, replaces: [] }, 5000)

if (import.meta.main) await writeModel('indy-veterans-memorial-obelisk', built)
