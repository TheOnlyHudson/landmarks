/**
 * RBC Gateway (2019-22, Pickard Chilton with Kendall/Heaton), Minneapolis —
 * original procedural geometry, CC0-1.0.
 * bun generators/msp-rbc-gateway.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the tower's own axis
 * (placement bearing 44.1°: the model's +y runs along the tower's long
 * side, which is skewed ~13.6° off the downtown street grid). Origin at the
 * anchor, the area centroid of the OSM outline way/733105254 (-93.2692638,
 * 44.9814045), on the lowest ground under it (~256.5 m NAVD88).
 *
 * Form: a 25 x 84 m slab of pale blue glass, 37 storeys, whose top steps
 * down toward the north in three flat steps (159, 148 and 141 m), each step
 * marked by dark louvre notches at its high end; an 18-storey glass wing (the Four
 * Seasons hotel side) on its east flank to 86 m; a 4-storey podium of grey
 * metal panel and glass filling the rest of the site.
 *
 * Sources
 * - OSM: outline way/733105254 (3 levels, the podium); parts way/1456956222
 *   (tower, 37 levels, height 158) and way/1456956223 (east wing, 18 levels).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, class
 *   18 kept; heights above 256.5 m): the tower was topped out by the flight
 *   and its crown is in the cloud: 158-160 m over y -40..-2, 146-149 m over
 *   y -2..36, 141-143 m over y 36..47, a 153-157 m edge strip along the west
 *   face; east wing 86-88 m; podium 17-23 m. These agree with OSM's 158 m, so
 *   no published height was needed.
 * - Published: 37 storeys, completed 2022 (Wikipedia, "RBC Gateway").
 * - Photos (all evidence):
 *   Digdugsmug, "RBC.Gateway.jpg", CC BY-SA 4.0 (Wikimedia Commons): the
 *     crown steps and louvre bands from afar.
 *     https://commons.wikimedia.org/wiki/File:RBC.Gateway.jpg
 *   w_lemay, "RBC Gateway Tower, Nicollet Mall, Minneapolis, MN" (Flickr
 *     52834800601, 52834800161, 52835203570), CC BY-SA 2.0: the stepped top
 *     of the long face, the slender end, the grey podium.
 *     https://www.flickr.com/photos/59081381@N03/52834800601
 *     https://www.flickr.com/photos/59081381@N03/52834800161
 *     https://www.flickr.com/photos/59081381@N03/52835203570
 *   Czbik, "RBC Gateway building under construction. (May 10, 2020).jpg",
 *     CC0: the podium's frame.
 * - Look-only: Chad Davis, "The Churchill and RBC Gateway Reflections"
 *   (CC BY-NC-SA), not used.
 *
 * Estimated: horizontal mullion lines every four floors (~17 m), the
 * louvre notches (~7 m wide, two floors deep, at each step's south end), the podium's window
 * band. The west-edge strip at 153-157 m is folded into the steps.
 *
 * Night: the tower and wing glass and the podium glazing glow.
 *
 * Doubts: the crown's notched corners (dark recesses in the photos) are
 * simplified to three full-width steps; the curved north end of the site
 * (low canopy) is left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, wallEdge, capRing, finishGlb, outward } from './sea-rainier-square-tower'
import { band } from './msp-minneapolis-city-hall'

const TX0 = -27.6, TX1 = -2.4, TY0 = -39.5, TY1 = 44.5
const STEPS: { y0: number; y1: number; z: number }[] = [
  { y0: TY0, y1: -2, z: 159 },
  { y0: -2, y1: 36, z: 148 },
  { y0: 36, y1: TY1, z: 141 },
]
const WING: XY[] = ccw([[-2.4, -35.5], [9.1, -35.2], [10.6, 38.5], [-2.4, 37.9]])
const PODIUM: XY[] = ccw([[-27.6, -45.6], [-3.5, -39.8], [29.8, -31.7], [49.2, -27.0], [38.8, 22.7], [20.1, 22.2], [19.7, 33.0], [15.5, 33.2], [10.6, 38.5], [4.6, 42.0], [-2.3, 44.3], [-27.7, 44.3]])
const Z = { podium: 20, wing: 86 }
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

function build() {
  const glass = new Part(), trim = new Part(), louvre = new Part(), panel = new Part(), podWin = new Part(), roof = new Part()

  // ---------------------------------------------------------------- podium
  for (let i = 0; i < PODIUM.length; i++) wallEdge(panel, PODIUM, i, 0, Z.podium, 20)
  capRing(roof, PODIUM, Z.podium)
  band(panel, PODIUM, 0.3, Z.podium - 1, Z.podium + 0.4, 20)
  // glazed bands: shopfronts and the upper storeys
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = 0.06
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
    for (const [z0, z1] of [[0.6, 5.2], [7.5, 17.6]]) podWin.quad(P(1, z0), P(L - 1, z0), P(L - 1, z1), P(1, z1))
  }

  // ---------------------------------------------------------------- tower: glass slab stepping down north
  const zLow = STEPS[STEPS.length - 1].z
  for (const S of STEPS) {
    const r = ccw(rect(TX0, S.y0, TX1, S.y1))
    // long faces of this step, from the podium (or the previous step) up
    const zFrom = Z.podium
    glass.quad([TX0, S.y1, zFrom], [TX0, S.y0, zFrom], [TX0, S.y0, S.z], [TX0, S.y1, S.z])
    glass.quad([TX1, S.y0, zFrom], [TX1, S.y1, zFrom], [TX1, S.y1, S.z], [TX1, S.y0, S.z])
    capRing(roof, r, S.z)
    // the step's riser on the north side (to the next lower step)
    const next = STEPS.find((q) => q.y0 === S.y1)
    if (next) louvre.quad([TX1, S.y1, next.z], [TX0, S.y1, next.z], [TX0, S.y1, S.z], [TX1, S.y1, S.z])
    // louvre bands under each step top on both long faces
    for (const [x, s] of [[TX0, -1], [TX1, 1]] as [number, number][]) {
      const xx = x + s * 0.07, z0 = S.z - 8.5, z1 = S.z - 0.8
      // short dark notches at the step's high (south) end, as in the photos
      const ya = S.y0 + 0.8, yb = S.y0 + 7.5
      if (s > 0) louvre.quad([xx, ya, z0], [xx, yb, z0], [xx, yb, z1], [xx, ya, z1])
      else louvre.quad([xx, yb, z0], [xx, ya, z0], [xx, ya, z1], [xx, yb, z1])
    }
  }
  // end faces
  glass.quad([TX0, TY0, Z.podium], [TX1, TY0, Z.podium], [TX1, TY0, STEPS[0].z], [TX0, TY0, STEPS[0].z])
  glass.quad([TX1, TY1, Z.podium], [TX0, TY1, Z.podium], [TX0, TY1, zLow], [TX1, TY1, zLow])
  // louvres on the end faces under the top
  louvre.quad([TX0 + 0.8, TY0 - 0.07, STEPS[0].z - 8.5], [TX1 - 0.8, TY0 - 0.07, STEPS[0].z - 8.5], [TX1 - 0.8, TY0 - 0.07, STEPS[0].z - 0.8], [TX0 + 0.8, TY0 - 0.07, STEPS[0].z - 0.8])
  louvre.quad([TX1 - 0.8, TY1 + 0.07, zLow - 8.5], [TX0 + 0.8, TY1 + 0.07, zLow - 8.5], [TX0 + 0.8, TY1 + 0.07, zLow - 0.8], [TX1 - 0.8, TY1 + 0.07, zLow - 0.8])
  // a parapet rim round each step
  for (const S of STEPS) band(trim, ccw(rect(TX0, S.y0, TX1, S.y1)), 0.15, S.z - 0.6, S.z + 0.6, 20)

  // pale mullion lines every four floors on the tower
  const tower = ccw(rect(TX0, TY0, TX1, TY1))
  for (let z = Z.podium + 17; z < zLow - 10; z += 17.2) band(trim, tower, 0.12, z - 0.35, z + 0.35, 20)

  // ---------------------------------------------------------------- the east wing
  for (let i = 0; i < WING.length; i++) wallEdge(glass, WING, i, Z.podium, Z.wing, 20)
  capRing(roof, WING, Z.wing)
  band(trim, WING, 0.15, Z.wing - 1.2, Z.wing + 0.4, 20)
  for (let z = Z.podium + 17; z < Z.wing - 6; z += 17.2) band(trim, WING, 0.12, z - 0.35, z + 0.35, 20)

  return finishGlb('msp-rbc-gateway', 'RBC Gateway', [
    { part: glass, material: windowVariant(2, 0x9fb9d0) },
    { part: trim, material: { ...PALETTE.trim, color: 0xe9eef1 } },
    { part: louvre, material: { ...PALETTE.metal, color: 0x5b6670 } },
    { part: panel, material: finish('rbc-panel', 0xc8ccd0) },
    { part: podWin, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 44.1, height: STEPS[0].z + 0.6,
    replaces: ['way/733105254', 'way/1456956222', 'way/1456956223'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-rbc-gateway.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
