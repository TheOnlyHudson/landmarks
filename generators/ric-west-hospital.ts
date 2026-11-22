/**
 * West Hospital, Medical College of Virginia (VCU), 1200 East Broad Street,
 * Richmond, Virginia (1941, Baskervill & Son; Art Deco) — original
 * procedural geometry, CC0-1.0.
 * bun generators/ric-west-hospital.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36.7 (the street grid). Anchor = the centroid of
 * OSM way/224530984, -77.4306639, 37.5394229.
 *
 * Identity (from the photos below):
 *  1. A red-brown brick tower on a cross plan: four wings round a central
 *     block, the inner corners chamfered.
 *  2. Stepped massing: each wing steps back for its top storeys; the
 *     central block rises above the wings in two more setbacks to a hipped
 *     crown (the 1940s photo), with pale stone copings at each step.
 *  3. Tall vertical window strips between brick piers (the Art Deco
 *     verticals), and glazed penthouse bands at the top setbacks.
 *
 * Plan: OSM way/224530984, used as drawn: wings N (x -3.2..12.4, to y
 * 31.5), S (x -3.7..11.7, to y -29.0), W (y -8.3..6.7, to x -23.8), E
 * (y -8.9..6.4, to x 32.3) round a centre x -3.5..12, y -12..9.6.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame. y = 0 is the lowest ground (the east
 * side); the ground rises 4.8 m to the west wing. Measured above y = 0:
 * wing roofs 53.7 (to 55 on the parapets); the centre's first stage 59.3;
 * its tower stage 67.3; the crown's peak 72.0. OSM height 64.0 and 17
 * levels are the wings above the street. Estimated from the photos: the
 * wings' setback (two storeys, 1.6 m), the tower stage's plan (12.5 x
 * 13 m), storey height 3.2 m, the window bays (3.1 m).
 *
 * Ground: elevation 0.
 *
 * Night: windows glow (a working hospital); no floodlighting.
 *
 * Photos (all EVIDENCE):
 *  - West Hospital from Broad Street.jpg, VCU Libraries, CC BY 2.0 (1940s,
 *    Monumental Church's portico in front: the crown and setbacks)
 *    https://commons.wikimedia.org/wiki/File:West_Hospital_from_Broad_Street.jpg
 *  - VCU West Hospital-2007.jpg, Andrew Bain, CC BY-SA 3.0 (colour)
 *    https://commons.wikimedia.org/wiki/File:VCU_West_Hospital-2007.jpg
 *  - West Hospital Top.jpg, Taber Andrew Bain, CC BY 2.0 (wings and centre)
 *    https://commons.wikimedia.org/wiki/File:West_Hospital_Top.jpg
 *  - A.D. Williams Clinic and West Hospital.jpg, Taber Andrew Bain, CC BY
 *    2.0 (the stepped top from North 12th Street)
 *    https://commons.wikimedia.org/wiki/File:A.D._Williams_Clinic_and_West_Hospital.jpg
 *  - USGS NAIP orthoimagery (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the crown's hipped cap is from the 1940s photo; today's roof
 * carries plant and a glazed penthouse, so the cap is kept low. The
 * crenellated parapets of the wings are drawn as plain copings.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { onWall, pyramid, rectShape, type XY } from './atl-tech-tower'
import { box, ccw, offset, prism, save } from './atl-flatiron-building'

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part()

const PLAN: XY[] = ccw([
  [12.41, 31.51], [-3.19, 31.51], [-3.35, 9.68], [-6.18, 6.77], [-23.79, 6.71], [-23.85, -8.26],
  [-7.04, -8.21], [-3.49, -11.78], [-3.66, -28.95], [11.67, -28.99], [11.84, -11.88], [14.79, -8.99],
  [32.34, -8.8], [32.27, 6.44], [15.68, 6.26], [12.26, 9.6],
])
const W1 = 47.3, W2 = 53.7, C1 = 59.3, C2 = 67.3, TOP = 72.0, FL = 3.2

/** Window strips on every edge of a ring between z0 and z1, grouped three storeys a panel. */
function strips(ring: XY[], z0: number, z1: number, bay = 3.1, w = 1.5, skip = (_a: XY, _b: XY) => false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3 || skip(a, b)) continue
    const n = Math.max(1, Math.floor((L - 1.2) / bay)), m = (L - n * bay) / 2
    for (let k = 0; k < n; k++) {
      const s = m + (k + 0.5) * bay
      for (let z = z0; z + 2 * FL <= z1 + 0.01; z += 3 * FL) {
        const zt = Math.min(z + 3 * FL - 1.5, z1)
        onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z, zt), 0.05)
      }
    }
  }
}

// ── Wings: the cross up to the setback, then the top storeys set back ──
prism(brick, PLAN, 0, W1, null, 0)
const SET = offset(PLAN, -1.6)
// a stone coping ledge at the setback
stone.loft([PLAN.map(([x, y]) => [x, y, W1] as V3), PLAN.map(([x, y]) => [x, y, W1 + 0.35] as V3)])
{
  // the ledge's top, between the outer plan and the set-back ring
  const n = PLAN.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, z = W1 + 0.35
    stone.quad([SET[i][0], SET[i][1], z], [PLAN[i][0], PLAN[i][1], z], [PLAN[j][0], PLAN[j][1], z], [SET[j][0], SET[j][1], z])
  }
}
prism(brick, SET, W1 + 0.35, W2, roof, 0.2)
// parapet coping
stone.loft([SET.map(([x, y]) => [x, y, W2 - 0.2] as V3), offset(SET, 0.15).map(([x, y]) => [x, y, W2 - 0.2] as V3)])
stone.loft([offset(SET, 0.15).map(([x, y]) => [x, y, W2 - 0.2] as V3), offset(SET, 0.15).map(([x, y]) => [x, y, W2 + 0.3] as V3)])

// ── The centre: a first stage, then the tower stage and the crown ──
const CEN: XY[] = [[-3.4, -11.8], [11.8, -11.8], [11.8, 9.6], [-3.4, 9.6]]
prism(brick, CEN, W2 - 0.5, C1, roof, 0.3)
box(stone, -3.6, 12.0, -12.0, 9.8, C1 - 0.4, C1, stone, 0.1)
const TWR: XY[] = [[-2.0, -7.6], [10.4, -7.6], [10.4, 5.4], [-2.0, 5.4]]
prism(brick, TWR, C1, C2 - 2.2, null, 0)
// the glazed penthouse band under the tower's coping
prism(win, offset(TWR, -0.05), C2 - 2.2, C2 - 0.5, null, 0)
for (const [x, y] of TWR) box(brick, x - 0.6, x + 0.6, y - 0.6, y + 0.6, C2 - 2.2, C2 - 0.5, null, 0)
box(stone, -2.3, 10.7, -7.9, 5.7, C2 - 0.5, C2, stone, 0.1)
pyramid(roof, [4.2, -1.1], 5.2, C2, TOP, 4, Math.PI / 4)
box(stone, 4.0, 4.4, -1.3, -0.9, TOP - 0.6, TOP + 0.6, stone, 0)

// ── Windows ──
// wings: the long faces and the ends, below the setback; inner chamfers too
strips(PLAN, 3.4, W1 - 0.8)
strips(SET, W1 + 1.0, W2 - 1.0, 3.1, 1.5)
strips(CEN, W2 + 0.4, C1 - 0.8, 3.1, 1.5, (a, b) => false)
strips(TWR, C1 + 0.8, C2 - 2.6, 3.1, 1.5)
// a glazed band on the wings' top storey ends (p4)
for (let i = 0; i < SET.length; i++) {
  const a = SET[i], b = SET[(i + 1) % SET.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 12 && L < 15) onWall(win, a, b, rectShape(0.8, L - 0.8, W2 - 2.4, W2 - 0.9), 0.06)
}

await save('ric-west-hospital', 'West Hospital', [
  { part: brick, material: finish('west-hospital-brick', 0xa86a52) },
  { part: stone, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('west-hospital-roof', 0x8e8a85) },
], { height: TOP + 0.6, anchor: [37.5394229, -77.4306639], bearing: 36.7 })
